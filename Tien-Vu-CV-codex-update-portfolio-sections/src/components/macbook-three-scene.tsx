"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const screenSize: [number, number] = [29.4, 20];

type MacbookThreeSceneProps = {
  started: boolean;
  onActivate: () => void;
};

type Point = {
  x: number;
  y: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value: number) {
  const t = clamp(value);
  return 1 - (1 - t) ** 3;
}

function easeInOut(value: number) {
  const t = clamp(value);
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function drawFolder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  label: string,
  selected = false,
) {
  const width = 110 * scale;
  const height = 78 * scale;
  const tabWidth = 48 * scale;
  const tabHeight = 22 * scale;
  const labelFontSize = 20 * scale;

  ctx.save();
  ctx.shadowColor = "rgba(10, 30, 58, 0.28)";
  ctx.shadowBlur = 16 * scale;
  ctx.shadowOffsetY = 9 * scale;
  ctx.fillStyle = selected ? "rgba(255, 255, 255, 0.22)" : "transparent";
  ctx.beginPath();
  ctx.roundRect(x - 18 * scale, y - 28 * scale, width + 36 * scale, height + 112 * scale, 22 * scale);
  ctx.fill();

  const folderGradient = ctx.createLinearGradient(0, y, 0, y + height);
  folderGradient.addColorStop(0, "#72d3ff");
  folderGradient.addColorStop(0.48, "#2eaef2");
  folderGradient.addColorStop(1, "#0e76c7");
  ctx.fillStyle = "#38baf2";
  ctx.beginPath();
  ctx.roundRect(x + 8 * scale, y - tabHeight, tabWidth, tabHeight + 7 * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = folderGradient;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 13 * scale);
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 71, 136, 0.18)";
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.shadowColor = "rgba(0, 0, 0, 0.24)";
  ctx.shadowBlur = 7 * scale;
  ctx.shadowOffsetY = 2 * scale;
  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.font = `700 ${labelFontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  const labelWidth = Math.max(128 * scale, ctx.measureText(label).width + 34 * scale);
  const labelHeight = 46 * scale;
  ctx.beginPath();
  ctx.roundRect(x + width / 2 - labelWidth / 2, y + height + 20 * scale, labelWidth, labelHeight, 9 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#1b2637";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + width / 2, y + height + 20 * scale + labelHeight / 2);
  ctx.restore();
}

function drawCursor(ctx: CanvasRenderingContext2D, point: Point, scale = 1) {
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(-0.14);
  ctx.shadowColor = "rgba(5, 11, 23, 0.38)";
  ctx.shadowBlur = 8 * scale;
  ctx.shadowOffsetX = 8 * scale;
  ctx.shadowOffsetY = 8 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 8 * scale;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(82 * scale, 35 * scale);
  ctx.lineTo(43 * scale, 51 * scale);
  ctx.lineTo(26 * scale, 94 * scale);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

function drawDock(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const iconSize = 42;
  const gap = 11;
  const icons = 7;
  const dockWidth = iconSize * icons + gap * (icons - 1) + 30;
  const x = width / 2 - dockWidth / 2;
  const y = height - 86;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.52)";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "rgba(15, 23, 42, 0.22)";
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.roundRect(x, y, dockWidth, 64, 24);
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = "transparent";

  const colors = [
    ["#eef9ff", "#4db5f3"],
    ["#fff", "#e43e36"],
    ["#ffffff", "#207eea"],
    ["#ff3b30", "#007aff"],
    ["#fff9af", "#f5f5f5"],
    ["#ff5a7a", "#ff1f4f"],
    ["#c8ced6", "#202834"],
  ];

  for (let i = 0; i < icons; i += 1) {
    const iconX = x + 15 + i * (iconSize + gap);
    const gradient = ctx.createLinearGradient(iconX, y + 11, iconX + iconSize, y + 53);
    gradient.addColorStop(0, colors[i][0]);
    gradient.addColorStop(1, colors[i][1]);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(iconX, y + 11, iconSize, iconSize, 12);
    ctx.fill();
  }
  ctx.restore();
}

function drawFinderWindow(ctx: CanvasRenderingContext2D, progress: number) {
  const alpha = easeOutCubic(progress);
  const scale = lerp(0.92, 1, alpha);
  const x = 220;
  const y = 455 - 24 * alpha;
  const width = 620;
  const height = 220;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x + width / 2, y + height / 2);
  ctx.scale(scale, scale);
  ctx.translate(-width / 2, -height / 2);
  ctx.shadowColor = "rgba(12, 18, 30, 0.28)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = "rgba(247, 250, 252, 0.9)";
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 18);
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
  ctx.beginPath();
  ctx.roundRect(0, 0, width, 44, 18);
  ctx.fill();
  ctx.fillRect(0, 26, width, 18);

  ["#ff5f57", "#ffbd2e", "#28c840"].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(22 + index * 20, 22, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#172033";
  ctx.font = "700 18px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Tien Vu Folder", width / 2, 22);

  ctx.fillStyle = "rgba(216, 226, 236, 0.75)";
  ctx.fillRect(0, 44, 160, height - 44);
  ctx.fillStyle = "rgba(23, 32, 51, 0.62)";
  ctx.font = "700 13px ui-sans-serif, system-ui";
  ctx.textAlign = "left";
  ctx.fillText("LOCATION", 20, 78);
  ctx.font = "700 16px ui-sans-serif, system-ui";
  ctx.fillText("Tien Vu", 20, 112);

  ctx.fillStyle = "rgba(23, 32, 51, 0.72)";
  ctx.font = "700 22px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Opening Tien Vu...", 390, 128);
  ctx.fillStyle = "rgba(43, 126, 207, 0.18)";
  ctx.beginPath();
  ctx.roundRect(250, 158, 280, 10, 999);
  ctx.fill();
  ctx.fillStyle = "rgba(43, 126, 207, 0.72)";
  ctx.beginPath();
  ctx.roundRect(250, 158, 210 * alpha, 10, 999);
  ctx.fill();

  ctx.restore();
}

function drawScreenFrame(ctx: CanvasRenderingContext2D, started: boolean, activationElapsed: number, t: number) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  const wallpaper = ctx.createLinearGradient(0, 0, width, height);
  wallpaper.addColorStop(0, "#274863");
  wallpaper.addColorStop(0.25, "#7cc9d1");
  wallpaper.addColorStop(0.44, "#eef8fb");
  wallpaper.addColorStop(0.58, "#f0b55d");
  wallpaper.addColorStop(0.78, "#ef7654");
  wallpaper.addColorStop(1, "#bd3f64");
  ctx.fillStyle = wallpaper;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(420, 0);
  ctx.lineTo(0, 610);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.56)";
  ctx.fillRect(0, 0, width, 58);
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.font = "700 22px ui-sans-serif, system-ui";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.beginPath();
  ctx.arc(32, 29, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText("Finder", 58, 30);
  ctx.font = "500 20px ui-sans-serif, system-ui";
  ctx.fillText("File", 145, 30);
  ctx.fillText("Edit", 202, 30);
  ctx.fillText("View", 262, 30);
  ctx.textAlign = "right";
  ctx.font = "600 18px ui-sans-serif, system-ui";
  ctx.fillText("Thu 16 Jul", width - 30, 30);

  const folderPulse = started ? Math.sin(clamp(activationElapsed / 0.7) * Math.PI) * 0.08 : Math.sin(t * 2) * 0.025;
  drawFolder(ctx, 352, 226 - folderPulse * 8, 1.58 + folderPulse, "Tien Vu", started && activationElapsed > 0.9);
  drawDock(ctx, width, height);

  let cursor: Point;
  if (started) {
    const moveProgress = easeInOut((activationElapsed - 0.18) / 1.1);
    cursor = {
      x: lerp(835, 520, moveProgress),
      y: lerp(525, 380, moveProgress),
    };
  } else {
    cursor = {
      x: 820 + Math.sin(t * 1.2) * 18,
      y: 510 + Math.cos(t * 1.1) * 12,
    };
  }
  drawCursor(ctx, cursor, 0.82);

  if (started && activationElapsed > 0.92 && activationElapsed < 1.42) {
    ctx.save();
    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - (activationElapsed - 0.92) / 0.5})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(520, 380, 32 + (activationElapsed - 0.92) * 64, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (started) {
    drawFinderWindow(ctx, (activationElapsed - 1.35) / 0.75);
  }
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose());
  } else {
    material.dispose();
  }
}

export function MacbookThreeScene({ started, onActivate }: MacbookThreeSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(started);
  const activationStartRef = useRef<number | null>(null);
  const pointerStartRef = useRef<Point | null>(null);

  useEffect(() => {
    if (started && !startedRef.current) {
      activationStartRef.current = performance.now();
    }
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;

    if (!root || !canvas) {
      return;
    }

    let disposed = false;
    let animationFrame = 0;
    const mountedAt = performance.now();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 10, 1000);
    camera.position.set(0, 3, 76);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      preserveDrawingBuffer: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
    scene.add(ambientLight);

    const lightHolder = new THREE.Group();
    scene.add(lightHolder);
    const pointLight = new THREE.PointLight(0xfff5e1, 1.12);
    pointLight.position.set(0, 10, 58);
    lightHolder.add(pointLight);

    const macGroup = new THREE.Group();
    macGroup.position.z = -10;
    scene.add(macGroup);

    const lidGroup = new THREE.Group();
    const bottomGroup = new THREE.Group();
    macGroup.add(lidGroup, bottomGroup);
    let isNarrowViewport = false;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 52;
    controls.maxDistance = 112;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.target.set(0, -4, 0);

    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1180;
    screenCanvas.height = 800;
    const screenContext = screenCanvas.getContext("2d");
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.flipY = false;
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.minFilter = THREE.LinearFilter;

    const textureLoader = new THREE.TextureLoader();
    const keyboardTexture = textureLoader.load("/assets/three/keyboard-overlay.png");
    keyboardTexture.colorSpace = THREE.SRGBColorSpace;

    const darkPlasticMaterial = new THREE.MeshStandardMaterial({
      color: 0x020307,
      metalness: 0.82,
      roughness: 0.9,
    });
    const cameraMaterial = new THREE.MeshBasicMaterial({ color: 0x141820 });
    const baseMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8dade,
      metalness: 0.65,
      roughness: 0.34,
    });
    const logoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
      opacity: 0,
      side: THREE.BackSide,
      transparent: true,
    });
    const keyboardMaterial = new THREE.MeshBasicMaterial({
      alphaMap: keyboardTexture,
      color: 0xffffff,
      transparent: true,
    });

    let screenLight: THREE.RectAreaLight | null = null;
    let modelReady = false;

    const addScreen = () => {
      const screenMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(screenSize[0], screenSize[1]),
        screenMaterial,
      );
      screenMesh.position.set(0, 10.5, -0.11);
      screenMesh.rotation.set(Math.PI, 0, 0);
      screenMesh.renderOrder = 2;
      lidGroup.add(screenMesh);

      screenLight = new THREE.RectAreaLight(0xffffff, 0, screenSize[0], screenSize[1]);
      screenLight.position.set(0, 10.5, 0);
      screenLight.rotation.set(Math.PI, 0, 0);
      lidGroup.add(screenLight);

      const darkScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(screenSize[0], screenSize[1]),
        darkPlasticMaterial,
      );
      darkScreen.position.set(0, 10.5, -0.18);
      darkScreen.rotation.set(Math.PI, Math.PI, 0);
      darkScreen.renderOrder = 1;
      lidGroup.add(darkScreen);
    };

    const addKeyboard = () => {
      const keyboardKeys = new THREE.Mesh(
        new THREE.PlaneGeometry(27.7, 11.6),
        keyboardMaterial,
      );
      keyboardKeys.rotation.set(-0.5 * Math.PI, 0, 0);
      keyboardKeys.position.set(0, 0.045, 7.21);
      bottomGroup.add(keyboardKeys);
    };

    const loader = new GLTFLoader();
    loader.load(
      "/assets/three/mac-noUv.glb",
      (glb) => {
        if (disposed) {
          return;
        }

        [...glb.scene.children].forEach((child) => {
          if (child.name === "_top") {
            lidGroup.add(child);
            child.traverse((object) => {
              const mesh = object as THREE.Mesh;
              if (!mesh.isMesh) {
                return;
              }

              if (mesh.name === "lid") {
                mesh.material = baseMetalMaterial;
              } else if (mesh.name === "logo") {
                mesh.material = logoMaterial;
              } else if (mesh.name === "screen-frame") {
                mesh.material = darkPlasticMaterial;
              } else if (mesh.name === "camera") {
                mesh.material = cameraMaterial;
              }
            });
          } else if (child.name === "_bottom") {
            bottomGroup.add(child);
            child.traverse((object) => {
              const mesh = object as THREE.Mesh;
              if (!mesh.isMesh) {
                return;
              }

              if (mesh.name === "base") {
                mesh.material = baseMetalMaterial;
              } else if (mesh.name === "legs" || mesh.name === "keyboard" || mesh.name === "inner") {
                mesh.material = darkPlasticMaterial;
              }
            });
          }
        });

        addScreen();
        addKeyboard();
        modelReady = true;
      },
      undefined,
      (error) => {
        console.error("Unable to load MacBook model.", error);
      },
    );

    const updateSceneSize = () => {
      const rect = root.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      isNarrowViewport = width < 640;
      camera.aspect = width / height;
      camera.position.y = isNarrowViewport ? 6 : 3;
      camera.position.z = isNarrowViewport ? 126 : 76;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(updateSceneSize);
    resizeObserver.observe(root);
    updateSceneSize();

    const render = () => {
      if (disposed) {
        return;
      }

      const now = performance.now();
      const t = (now - mountedAt) / 1000;
      const appearProgress = easeOutCubic(t / 1.65);
      const activationElapsed = activationStartRef.current
        ? (now - activationStartRef.current) / 1000
        : 0;
      const activeBoost = startedRef.current ? easeOutCubic(activationElapsed / 1.1) : 0;
      const openProgress = Math.min(1, appearProgress * 0.88 + activeBoost * 0.12);

      if (screenContext) {
        drawScreenFrame(screenContext, startedRef.current, activationElapsed, t);
        screenTexture.needsUpdate = true;
      }

      lidGroup.rotation.x = lerp(0.5 * Math.PI, -0.2 * Math.PI, openProgress);
      lidGroup.position.z = lerp(0.7, 0, openProgress);
      const floatingY = Math.sin(t * 1.15) * 0.8;
      lidGroup.position.y = floatingY;
      bottomGroup.position.y = floatingY;
      macGroup.rotation.x = lerp(0.5 * Math.PI, 0.06 * Math.PI, appearProgress);
      macGroup.rotation.y = lerp(0.22 * Math.PI, -0.11 * Math.PI, appearProgress);
      macGroup.position.x = isNarrowViewport ? 4 : 0;
      macGroup.position.y = lerp(isNarrowViewport ? -42 : -50, isNarrowViewport ? -4 : -7, appearProgress);
      macGroup.position.z = -10;
      screenMaterial.opacity = modelReady ? lerp(0, 0.98, appearProgress) : 0;
      if (screenLight) {
        screenLight.intensity = modelReady ? lerp(0, 1.45, appearProgress) : 0;
      }

      controls.update();
      lightHolder.quaternion.copy(camera.quaternion);
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      keyboardTexture.dispose();
      screenTexture.dispose();
      [
        darkPlasticMaterial,
        cameraMaterial,
        baseMetalMaterial,
        logoMaterial,
        screenMaterial,
        keyboardMaterial,
      ].forEach(disposeMaterial);
    };
  }, []);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const pointerStart = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!pointerStart || startedRef.current) {
      return;
    }

    const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    if (distance < 8) {
      onActivate();
    }
  }

  return (
    <div
      aria-hidden="true"
      className="three-macbook-scene"
      data-testid="macbook-three-scene"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      ref={rootRef}
    >
      <canvas data-testid="macbook-canvas" id="laptop" ref={canvasRef} />
    </div>
  );
}
