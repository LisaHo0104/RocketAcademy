"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

type RetroComputerSceneProps = {
  started: boolean;
  onActivate: () => void;
  onZoomChange?: (zoomed: boolean) => void;
};

type Point = {
  x: number;
  y: number;
};

const retroAssetBase = "/assets/three/retro";
const visibleComputerMeshes = new Set(["CRT", "Computer", "Keyboard", "Screen"]);
const renderableComputerMeshes = new Set(visibleComputerMeshes);
const closeZoomProgress = 0;
const initialZoomProgress = 0.56;
const maxZoomOutProgress = 1;
const tableOffsetFromComputerY = -3.2;
const controlProps = {
  computerCloseHeight: 0,
  computerStartHeight: 0.9,
  computerEndHeight: 0.94,
  computerCloseAngle: 0,
  computerStartAngle: 0,
  computerEndAngle: Math.PI * 0.2,
  computerCloseHorizontal: 0,
  computerStartHorizontal: -1.48,
  computerEndHorizontal: -0.2,
  cameraCloseZ: -2.5,
  cameraStartZ: -5.65,
  cameraEndZ: -10.4,
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function valMap(value: number, from: [number, number], to: [number, number]) {
  const mapped = ((value - from[0]) / (from[1] - from[0])) * (to[1] - to[0]) + to[0];

  if (to[0] < to[1]) {
    if (mapped < to[0]) {
      return to[0];
    }

    if (mapped > to[1]) {
      return to[1];
    }
  } else {
    if (mapped > to[0]) {
      return to[0];
    }

    if (mapped < to[1]) {
      return to[1];
    }
  }

  return mapped;
}

function easeOutCubic(value: number) {
  const t = clamp(value);
  return 1 - (1 - t) ** 3;
}

function easeInOut(value: number) {
  const t = clamp(value);
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function zoomKeyframe(value: number, closeValue: number, startValue: number, endValue: number) {
  if (value <= initialZoomProgress) {
    return valMap(
      value,
      [closeZoomProgress, initialZoomProgress],
      [closeValue, startValue],
    );
  }

  return valMap(
    value,
    [initialZoomProgress, maxZoomOutProgress],
    [startValue, endValue],
  );
}

function drawRetroFolder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  selected: boolean,
) {
  const amber = "#e8b2df";
  const darkAmber = "#2b1725";
  const width = 120 * scale;
  const height = 86 * scale;
  const tabWidth = 52 * scale;
  const tabHeight = 20 * scale;

  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = "rgba(235, 166, 222, 0.72)";
  ctx.shadowBlur = selected ? 22 * scale : 13 * scale;
  ctx.lineWidth = 7 * scale;
  ctx.strokeStyle = amber;
  ctx.fillStyle = selected ? "rgba(232, 178, 223, 0.24)" : "rgba(232, 178, 223, 0.12)";

  ctx.beginPath();
  ctx.moveTo(0, tabHeight);
  ctx.lineTo(12 * scale, tabHeight);
  ctx.lineTo(12 * scale, 0);
  ctx.lineTo(12 * scale + tabWidth, 0);
  ctx.lineTo(12 * scale + tabWidth, tabHeight);
  ctx.lineTo(width, tabHeight);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 12 * scale;
  ctx.fillStyle = selected ? amber : "rgba(232, 178, 223, 0.88)";
  ctx.fillRect(12 * scale, tabHeight + 17 * scale, width - 24 * scale, 7 * scale);
  ctx.fillRect(12 * scale, tabHeight + 35 * scale, width - 42 * scale, 7 * scale);

  ctx.shadowBlur = 0;
  ctx.fillStyle = selected ? amber : "rgba(232, 178, 223, 0.94)";
  ctx.fillRect(-16 * scale, height + 22 * scale, width + 32 * scale, 36 * scale);
  ctx.fillStyle = darkAmber;
  ctx.font = `700 ${18 * scale}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("TIEN VU", width / 2, height + 40 * scale);
  ctx.restore();
}

function drawTerminalScreen(
  ctx: CanvasRenderingContext2D,
  started: boolean,
  activationElapsed: number,
  t: number,
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const amber = "#f1b7de";
  const softAmber = "rgba(241, 183, 222, 0.78)";
  const selected = started && activationElapsed > 0.45;

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, width, height);
  const screenGradient = ctx.createLinearGradient(0, 0, width, height);
  screenGradient.addColorStop(0, "#1c131d");
  screenGradient.addColorStop(0.36, "#4a2f46");
  screenGradient.addColorStop(0.68, "#9a5f62");
  screenGradient.addColorStop(1, "#d1846f");
  ctx.fillStyle = screenGradient;
  ctx.fillRect(0, 0, width, height);

  const skyGlow = ctx.createRadialGradient(width * 0.62, height * 0.46, 20, width * 0.62, height * 0.46, width * 0.5);
  skyGlow.addColorStop(0, "rgba(255, 202, 177, 0.28)");
  skyGlow.addColorStop(0.52, "rgba(221, 128, 153, 0.12)");
  skyGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = skyGlow;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.38, height * 0.44, 30, width * 0.38, height * 0.44, width * 0.72);
  glow.addColorStop(0, "rgba(242, 183, 222, 0.24)");
  glow.addColorStop(0.58, "rgba(242, 160, 196, 0.1)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.shadowColor = "rgba(241, 183, 222, 0.68)";
  ctx.shadowBlur = 16;
  ctx.fillStyle = amber;
  ctx.font = "700 38px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Hi there,", 70, 70);

  const highlightPulse = selected ? 0.78 + Math.sin(t * 8) * 0.08 : 0.64;
  ctx.shadowBlur = 22;
  ctx.fillStyle = `rgba(232, 178, 223, ${highlightPulse})`;
  ctx.fillRect(70, 126, 380, 68);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#2b1725";
  ctx.font = "900 48px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText("TIEN VU", 92, 133);

  ctx.shadowBlur = 10;
  ctx.fillStyle = softAmber;
  ctx.font = "700 27px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText("+ MARKETING", 78, 224);
  ctx.fillText("+ PUBLIC RELATIONS", 78, 262);
  ctx.fillText("+ DIGITAL CAMPAIGNS", 78, 300);

  drawRetroFolder(ctx, 685, 120 + Math.sin(t * 2.2) * 4, 1.48, selected);

  ctx.shadowBlur = 11;
  ctx.fillStyle = softAmber;
  ctx.font = "700 25px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText("Welcome to TIEN-VU 2026", 70, 456);
  ctx.fillText("> select /home/tienvu", 70, 496);

  if (started) {
    const typedProgress = easeInOut((activationElapsed - 0.12) / 0.8);
    const typed = "open tien-vu-folder".slice(0, Math.floor(21 * typedProgress));
    ctx.fillText(`user:~$ ${typed}`, 70, 548);

    if (activationElapsed > 0.92) {
      const barProgress = easeOutCubic((activationElapsed - 0.92) / 1.15);
      ctx.fillText("mounting portfolio...", 70, 592);
      ctx.fillStyle = "rgba(241, 183, 222, 0.22)";
      ctx.fillRect(70, 636, 430, 18);
      ctx.fillStyle = amber;
      ctx.fillRect(70, 636, 430 * barProgress, 18);
    }
  } else {
    const caretVisible = Math.sin(t * 7) > -0.2;
    ctx.fillText("user:~$ ", 70, 548);
    if (caretVisible) {
      ctx.fillRect(205, 546, 20, 34);
    }
  }

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = "#000000";
  for (let line = 0; line < height; line += 4) {
    ctx.fillRect(0, line, width, 1);
  }

  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 220; i += 1) {
    const x = (i * 83 + Math.floor(t * 18)) % width;
    const y = (i * 47 + Math.floor(t * 31)) % height;
    ctx.fillStyle = i % 3 === 0 ? "rgba(255, 207, 234, 0.18)" : "rgba(255, 255, 255, 0.07)";
    ctx.fillRect(x, y, 2, 1);
  }

  ctx.globalAlpha = 1;
  const vignette = ctx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, height * 0.72);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(0.72, "rgba(0, 0, 0, 0.18)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.52)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose());
  } else {
    material.dispose();
  }
}

function createTableTopTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const width = canvas.width;
  const height = canvas.height;
  const base = ctx.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#683326");
  base.addColorStop(0.26, "#9a5035");
  base.addColorStop(0.58, "#dd8c55");
  base.addColorStop(0.82, "#f4c083");
  base.addColorStop(1, "#7b392a");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const centerGlow = ctx.createRadialGradient(width * 0.64, height * 0.34, 30, width * 0.64, height * 0.34, width * 0.42);
  centerGlow.addColorStop(0, "rgba(255, 218, 163, 0.58)");
  centerGlow.addColorStop(0.36, "rgba(234, 136, 80, 0.25)");
  centerGlow.addColorStop(1, "rgba(255, 180, 120, 0)");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, width, height);

  const contactShadow = ctx.createRadialGradient(width * 0.52, height * 0.2, 18, width * 0.52, height * 0.2, width * 0.3);
  contactShadow.addColorStop(0, "rgba(18, 7, 5, 0.82)");
  contactShadow.addColorStop(0.26, "rgba(42, 16, 10, 0.46)");
  contactShadow.addColorStop(0.62, "rgba(72, 28, 16, 0.18)");
  contactShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = contactShadow;
  ctx.fillRect(0, 0, width, height);

  const keyboardShadow = ctx.createRadialGradient(width * 0.58, height * 0.48, 20, width * 0.58, height * 0.48, width * 0.28);
  keyboardShadow.addColorStop(0, "rgba(21, 8, 5, 0.56)");
  keyboardShadow.addColorStop(0.42, "rgba(56, 22, 13, 0.28)");
  keyboardShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = keyboardShadow;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.18;
  ctx.translate(width * 0.54, -height * 0.08);
  ctx.rotate(-0.22);
  for (let i = 0; i < 9; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "rgba(255, 220, 169, 0.34)" : "rgba(255, 192, 134, 0.18)";
    ctx.fillRect(i * 145, 0, 24, height * 1.35);
  }
  ctx.restore();

  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 1200; i += 1) {
    const x = (i * 97) % width;
    const y = (i * 53) % height;
    ctx.fillStyle = i % 3 === 0 ? "rgba(255, 235, 206, 0.42)" : "rgba(60, 24, 16, 0.32)";
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  return texture;
}

function createTableContactShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const monitorShadow = ctx.createRadialGradient(410, 160, 18, 410, 160, 290);
  monitorShadow.addColorStop(0, "rgba(12, 5, 4, 0.8)");
  monitorShadow.addColorStop(0.32, "rgba(26, 10, 7, 0.46)");
  monitorShadow.addColorStop(0.74, "rgba(41, 16, 10, 0.12)");
  monitorShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = monitorShadow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const keyboardShadow = ctx.createRadialGradient(610, 290, 24, 610, 290, 310);
  keyboardShadow.addColorStop(0, "rgba(14, 6, 4, 0.62)");
  keyboardShadow.addColorStop(0.44, "rgba(43, 16, 10, 0.28)");
  keyboardShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = keyboardShadow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function RetroComputerScene({ started, onActivate, onZoomChange }: RetroComputerSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(started);
  const activationStartRef = useRef<number | null>(null);
  const pointerStartRef = useRef<Point | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const mouseDownRef = useRef<Point | null>(null);
  const computerParallaxRef = useRef<Point>({ x: 0, y: 0 });
  const onZoomChangeRef = useRef(onZoomChange);

  useEffect(() => {
    if (started && !startedRef.current) {
      activationStartRef.current = performance.now();
    }
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    onZoomChangeRef.current = onZoomChange;
  }, [onZoomChange]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;

    if (!root || !canvas) {
      return;
    }

    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    };
    const webGlContext =
      canvas.getContext("webgl2", contextAttributes) ??
      canvas.getContext("webgl", contextAttributes);

    if (!webGlContext) {
      root.dataset.webgl = "unavailable";
      onZoomChangeRef.current?.(false);
      return;
    }

    root.dataset.webgl = "ready";
    let disposed = false;
    let animationFrame = 0;
    let modelReady = false;
    let viewHeight = Math.max(1, document.documentElement.clientHeight);
    let scroll = initialZoomProgress;
    let portraitOffset = 0;
    const mountedAt = performance.now();
    const lookTarget = new THREE.Vector3(0, 0, 0);

    const scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);
    const tableFillLight = new THREE.HemisphereLight(0xffdcc0, 0x2a1512, 0.62);
    scene.add(tableFillLight);
    const tableKeyLight = new THREE.DirectionalLight(0xffbb86, 1.35);
    tableKeyLight.position.set(4.2, 5.8, -3.8);
    tableKeyLight.castShadow = true;
    tableKeyLight.shadow.mapSize.width = 1024;
    tableKeyLight.shadow.mapSize.height = 1024;
    tableKeyLight.shadow.camera.near = 0.5;
    tableKeyLight.shadow.camera.far = 18;
    tableKeyLight.shadow.camera.left = -7;
    tableKeyLight.shadow.camera.right = 7;
    tableKeyLight.shadow.camera.top = 7;
    tableKeyLight.shadow.camera.bottom = -7;
    scene.add(tableKeyLight);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, -2.5);
    camera.rotation.set(-Math.PI, 0, Math.PI);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas,
      context: webGlContext,
      preserveDrawingBuffer: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(2);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const computerGroup = new THREE.Group();
    scene.add(computerGroup);

    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1024;
    screenCanvas.height = 768;
    const screenContext = screenCanvas.getContext("2d");
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.flipY = true;
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;

    const textureLoader = new THREE.TextureLoader();
    const bakedTexture = textureLoader.load(`${retroAssetBase}/bake-quality-5.jpg`);
    bakedTexture.flipY = false;
    bakedTexture.colorSpace = THREE.SRGBColorSpace;
    const computerMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
      side: THREE.DoubleSide,
      toneMapped: false,
    });

    const tableTopTexture = createTableTopTexture();
    const tableContactShadowTexture = createTableContactShadowTexture();
    const tableGroup = new THREE.Group();
    const tableTopMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0a265,
      map: tableTopTexture ?? undefined,
      roughness: 0.64,
      metalness: 0,
    });
    const tableSideMaterial = new THREE.MeshStandardMaterial({
      color: 0x94492f,
      roughness: 0.78,
      metalness: 0,
    });
    const tableBottomMaterial = new THREE.MeshStandardMaterial({
      color: 0x5b2b22,
      roughness: 0.88,
      metalness: 0,
    });
    const tableFrontMaterial = new THREE.MeshStandardMaterial({
      color: 0xb6613e,
      roughness: 0.72,
      metalness: 0,
    });
    const tableShadowMaterial = new THREE.MeshBasicMaterial({
      depthWrite: false,
      map: tableContactShadowTexture ?? undefined,
      opacity: 0.92,
      transparent: true,
    });
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(12.6, 0.26, 8.8),
      [
        tableSideMaterial,
        tableSideMaterial,
        tableTopMaterial,
        tableBottomMaterial,
        tableFrontMaterial,
        tableSideMaterial,
      ],
    );
    tableTop.receiveShadow = true;
    tableTop.castShadow = false;
    tableGroup.add(tableTop);

    const tableFrontLip = new THREE.Mesh(
      new THREE.BoxGeometry(12.75, 0.16, 0.34),
      new THREE.MeshStandardMaterial({
        color: 0x7f3a2b,
        roughness: 0.78,
        metalness: 0,
      }),
    );
    tableFrontLip.position.set(0.02, -0.19, -4.46);
    tableFrontLip.receiveShadow = true;
    tableGroup.add(tableFrontLip);

    const tableContactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(7.3, 3.2),
      tableShadowMaterial,
    );
    tableContactShadow.position.set(0.32, 0.145, -1.38);
    tableContactShadow.rotation.x = -Math.PI / 2;
    tableContactShadow.renderOrder = 2;
    tableGroup.add(tableContactShadow);

    tableGroup.position.y = controlProps.computerStartHeight + tableOffsetFromComputerY;
    tableGroup.position.z = -0.65;
    tableGroup.visible = false;
    scene.add(tableGroup);

    const loader = new GLTFLoader();
    loader.load(
      `${retroAssetBase}/Commodore710_33.5.glb`,
      (gltf) => {
        if (disposed) {
          return;
        }

        const loaded = gltf as { scene?: THREE.Object3D; traverse?: THREE.Object3D["traverse"] } | undefined;
        const loadedScene = loaded?.scene ?? (typeof loaded?.traverse === "function" ? (loaded as THREE.Object3D) : null);
        if (typeof loadedScene?.traverse !== "function") {
          return;
        }

        const meshesToAdd: THREE.Mesh[] = [];

        loadedScene.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) {
            return;
          }

          if (!renderableComputerMeshes.has(mesh.name)) {
            return;
          }

          if (mesh.name === "Screen") {
            mesh.material = screenMaterial;
          } else {
            mesh.material = computerMaterial;
          }

          mesh.castShadow = true;
          mesh.receiveShadow = false;
          meshesToAdd.push(mesh);
        });

        if (meshesToAdd.length === 0) {
          return;
        }

        meshesToAdd.forEach((mesh) => computerGroup.add(mesh));
        computerGroup.position.x = controlProps.computerStartHorizontal;
        computerGroup.position.y = controlProps.computerStartHeight;
        computerGroup.rotation.y = controlProps.computerStartAngle;
        modelReady = true;
      },
      undefined,
      (error) => {
        console.error("Unable to load retro computer model.", error);
      },
    );

    const updateSceneSize = () => {
      const rect = root.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      viewHeight = Math.max(1, document.documentElement.clientHeight);
      scroll = clamp(window.scrollY / viewHeight, 0, maxZoomOutProgress);
      portraitOffset = valMap(height / width, [0.8, 1.8], [0, 2.5]);
      camera.aspect = width / height;
      camera.fov = 50;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const updateScroll = () => {
      const maxScrollY = viewHeight * maxZoomOutProgress;
      const nextScrollY =
        !startedRef.current && window.scrollY > maxScrollY ? maxScrollY : window.scrollY;

      if (!startedRef.current && window.scrollY > maxScrollY) {
        window.scrollTo({ top: maxScrollY, behavior: "auto" });
      }

      scroll = clamp(nextScrollY / viewHeight, 0, maxZoomOutProgress);
      const zoomFac = valMap(scroll, [0, 1], [0, 1]);
      root.dataset.zoomProgress = zoomFac.toFixed(3);
      onZoomChangeRef.current?.(scroll > initialZoomProgress + 0.06);
    };

    const preventScrollPastMax = (event: WheelEvent) => {
      const maxScrollY = viewHeight * maxZoomOutProgress;

      if (!startedRef.current && window.scrollY >= maxScrollY - 1 && event.deltaY > 0) {
        event.preventDefault();
        window.scrollTo({ top: maxScrollY, behavior: "auto" });
        scroll = maxZoomOutProgress;
        root.dataset.zoomProgress = maxZoomOutProgress.toFixed(3);
      }
    };

    const resizeObserver = new ResizeObserver(updateSceneSize);
    resizeObserver.observe(root);
    updateSceneSize();
    window.scrollTo({
      top: viewHeight * initialZoomProgress,
      behavior: "auto",
    });
    updateScroll();

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("wheel", preventScrollPastMax, { passive: false });
    window.addEventListener("resize", updateSceneSize, { passive: true });

    const render = () => {
      if (disposed) {
        return;
      }

      const now = performance.now();
      const t = (now - mountedAt) / 1000;
      const appearProgress = easeOutCubic(t / 1.35);
      const activationElapsed = activationStartRef.current
        ? (now - activationStartRef.current) / 1000
        : 0;
      const activeProgress = startedRef.current ? easeOutCubic(activationElapsed / 1.2) : 0;

      if (screenContext) {
        drawTerminalScreen(screenContext, startedRef.current, activationElapsed, t);
        screenTexture.needsUpdate = true;
      }

      camera.position.z = zoomKeyframe(
        scroll,
        controlProps.cameraCloseZ - portraitOffset,
        controlProps.cameraStartZ - portraitOffset,
        controlProps.cameraEndZ - portraitOffset,
      );
      camera.position.x =
        computerParallaxRef.current.x * valMap(scroll, [0, 1], [0.2, 5]) * 0.1 +
        camera.position.x * 0.9;
      camera.position.y =
        computerParallaxRef.current.y * valMap(scroll, [0, 1], [0.2, 1.5]) * 0.1 +
        camera.position.y * 0.9;

      computerGroup.position.x = zoomKeyframe(
        scroll,
        controlProps.computerCloseHorizontal,
        controlProps.computerStartHorizontal,
        controlProps.computerEndHorizontal,
      );
      computerGroup.position.y = zoomKeyframe(
        scroll,
        controlProps.computerCloseHeight,
        controlProps.computerStartHeight,
        controlProps.computerEndHeight,
      );
      computerGroup.position.z = -activeProgress * 0.04;
      computerGroup.rotation.x = 0;
      computerGroup.rotation.y = zoomKeyframe(
        scroll,
        controlProps.computerCloseAngle,
        controlProps.computerStartAngle,
        controlProps.computerEndAngle,
      );
      computerGroup.rotation.z =
        portraitOffset > 0.5 ? valMap(scroll, [0, 1], [-Math.PI / 2, 0]) : 0;

      tableGroup.position.x = computerGroup.position.x + zoomKeyframe(scroll, 0, 0.08, 0.18);
      tableGroup.position.y = computerGroup.position.y + tableOffsetFromComputerY;
      tableGroup.position.z = -0.65 + computerGroup.position.z;
      tableGroup.rotation.x = 0;
      tableGroup.rotation.y = computerGroup.rotation.y * 0.34;
      tableGroup.rotation.z = computerGroup.rotation.z;
      tableGroup.scale.setScalar(zoomKeyframe(scroll, 0.82, 1, 1.02));
      tableGroup.visible = modelReady && appearProgress > 0;

      computerGroup.visible = modelReady && appearProgress > 0;
      lookTarget.set(0, 0, 0);
      camera.lookAt(lookTarget);
      canvas.style.opacity = "1";

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("wheel", preventScrollPastMax);
      window.removeEventListener("resize", updateSceneSize);
      renderer.dispose();
      screenTexture.dispose();
      bakedTexture.dispose();
      tableTopTexture?.dispose();
      tableContactShadowTexture?.dispose();
      [computerMaterial, screenMaterial].forEach(disposeMaterial);
      computerGroup.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
        }
      });
      const disposedTableMaterials = new Set<THREE.Material>();
      tableGroup.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) {
          return;
        }

        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => {
          if (!disposedTableMaterials.has(material)) {
            disposedTableMaterials.add(material);
            material.dispose();
          }
        });
      });
    };
  }, []);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };

    if (event.pointerType !== "mouse") {
      activePointerIdRef.current = null;
      mouseDownRef.current = null;
      computerParallaxRef.current = { x: 0, y: 0 };
      return;
    }

    activePointerIdRef.current = event.pointerId;
    mouseDownRef.current = { x: event.clientX, y: event.clientY };

    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      mouseDownRef.current = null;
      computerParallaxRef.current = { x: 0, y: 0 };
      return;
    }

    const mouseDown = mouseDownRef.current;

    if (activePointerIdRef.current !== event.pointerId || !mouseDown) {
      return;
    }

    computerParallaxRef.current.x +=
      (event.clientX - mouseDown.x) / (window.innerWidth * 0.5);
    computerParallaxRef.current.x = valMap(computerParallaxRef.current.x, [-1, 1], [-1, 1]);
    computerParallaxRef.current.y +=
      (event.clientY - mouseDown.y) / (window.innerHeight * 0.5);
    computerParallaxRef.current.y = valMap(computerParallaxRef.current.y, [-1, 1], [-1, 1]);
    mouseDownRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const pointerStart = pointerStartRef.current;
    pointerStartRef.current = null;
    mouseDownRef.current = null;
    activePointerIdRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!pointerStart || startedRef.current) {
      return;
    }

    const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    if (distance < 8) {
      onActivate();
    }
  }

  function handlePointerCancel(event: PointerEvent<HTMLDivElement>) {
    pointerStartRef.current = null;
    mouseDownRef.current = null;
    activePointerIdRef.current = null;
    computerParallaxRef.current = { x: 0, y: 0 };

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      aria-hidden="true"
      className="three-retro-computer-scene"
      data-zoom-progress={initialZoomProgress.toFixed(3)}
      data-testid="retro-computer-three-scene"
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={rootRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 2 }}
    >
      <canvas
        data-testid="retro-computer-canvas"
        ref={canvasRef}
        style={{
          cursor: "grab",
          display: "block",
          height: "100%",
          touchAction: "pan-y",
          width: "100%",
        }}
      />
    </div>
  );
}
