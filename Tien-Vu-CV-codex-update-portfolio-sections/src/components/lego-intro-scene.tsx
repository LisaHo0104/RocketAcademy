"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { UltraHDRLoader } from "three/addons/loaders/UltraHDRLoader.js";
import {
  mergeGeometries,
  toCreasedNormals,
} from "three/addons/utils/BufferGeometryUtils.js";

type LegoIntroSceneProps = {
  rotationTurns: number;
  started: boolean;
};

type BrickTarget = {
  position: THREE.Vector3;
  rotationY: number;
};

const legoAssetBase = "/assets/three/lego";
const theme = {
  focus: 0xfcbf49,
  primary: 0xf77f00,
  secondary: 0xd62828,
  dark: 0x003049,
};

const brickHeight = 0.6;
const brickWidth = 1;
const brickLength = 2;
const studDepth = 0.1;
const sectionColors = [theme.dark, theme.secondary, theme.primary, theme.focus];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function createBrickGeometry() {
  const bevelSize = 0.01;
  const bevelThickness = 0.01;
  const bevelSegments = 3;
  const bevelOffset = -bevelSize;
  const solidUv = new THREE.Vector2(0.9, 0.9);
  const topUv = [solidUv, solidUv, solidUv];
  const sideUv = [solidUv, solidUv, solidUv, solidUv];
  const rectangle = new THREE.Shape()
    .moveTo(-brickWidth / 2, -brickLength / 2)
    .lineTo(brickWidth / 2, -brickLength / 2)
    .lineTo(brickWidth / 2, brickLength / 2)
    .lineTo(-brickWidth / 2, brickLength / 2)
    .closePath();
  const studShape = (x: number, y: number) =>
    new THREE.Shape().absellipse(x, y, 0.15, 0.15, 0, Math.PI * 2);
  const studs = Array.from({ length: 4 }, (_, index) =>
    studShape(
      (index % 2) * 0.5 - brickWidth / 4,
      Math.floor(index / 2) * 0.5 - 0.75,
    ),
  );
  const uvGenerator = {
    generateTopUV: () => topUv,
    generateSideWallUV: () => sideUv,
  };
  const studGeometry = toCreasedNormals(
    new THREE.ExtrudeGeometry(studs, {
      bevelSegments,
      bevelOffset,
      bevelSize,
      bevelThickness,
      depth: studDepth,
      UVGenerator: uvGenerator,
    }).translate(0, 0, brickHeight),
    Math.PI / 3,
  ).rotateX(-Math.PI / 2);
  const bodyGeometry = new THREE.ExtrudeGeometry(rectangle, {
    bevelSegments,
    bevelOffset,
    bevelSize,
    bevelThickness,
    depth: brickHeight - bevelThickness,
    UVGenerator: uvGenerator,
  }).rotateX(-Math.PI / 2);
  const geometry = mergeGeometries([
    bodyGeometry,
    studGeometry,
    studGeometry.clone().translate(0, 0, -1),
  ]);

  bodyGeometry.dispose();
  geometry.computeVertexNormals();
  return { brick: geometry, stud: studGeometry };
}

function calculateOriginalDimensions(camera: THREE.PerspectiveCamera) {
  if (camera.aspect < 0.5) {
    camera.zoom = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(camera.aspect, 0.5, 0.4, 1, 0.7),
      0.7,
      1,
    );
  } else {
    camera.zoom = 1;
  }
  camera.updateProjectionMatrix();

  const cameraDistance = camera.position.length();
  const view = camera.getViewSize(cameraDistance, new THREE.Vector2());
  const planeNormal = camera.position.clone().negate().normalize();
  const projectedX = new THREE.Vector3(1, 0, 0).projectOnPlane(planeNormal);
  const planeOrthogonal = new THREE.Vector3(1, 0, -1).normalize();
  projectedX.setLength(view.x / 2 / Math.cos(projectedX.angleTo(planeOrthogonal)));
  const alpha = Math.abs(projectedX.z / (Math.abs(projectedX.z) + Math.abs(camera.position.z)));
  const width = Math.max(3, Math.floor(projectedX.lerp(camera.position, alpha).length() / 2));
  const theta = THREE.MathUtils.degToRad(camera.fov / 2);
  const beta = Math.PI / 2 - camera.position.angleTo(new THREE.Vector3(0, 1, 0));
  const gamma = Math.PI / 2 - theta;
  const height =
    Math.floor((view.y / 2) * Math.sin(gamma)) /
    Math.sin(Math.PI - gamma - beta);

  return { width, height, viewWidth: view.x };
}

function createWalls(
  parent: THREE.Group,
  geometry: THREE.BufferGeometry,
  bricksPerRow: number,
  height: number,
) {
  const layerCount = Math.floor(height / brickHeight - 1);
  const count = layerCount * bricksPerRow;
  const positions = [
    { position: [0.5, 0, 1] as const, rotationY: 0 },
    { position: [1, 0, 0.5] as const, rotationY: Math.PI / 2 },
    { position: [-1, 0, -0.5] as const, rotationY: (3 * Math.PI) / 2 },
    { position: [-0.5, 0, -1] as const, rotationY: Math.PI },
  ];
  const gradient = [theme.dark, theme.secondary, theme.primary, theme.focus].map(
    (value) => new THREE.Color(value),
  );
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);

  return positions.map((wallProps, wallIndex) => {
    const material = new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 0 });
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const targets: BrickTarget[] = [];
    mesh.position.set(
      wallProps.position[0],
      wallProps.position[1],
      wallProps.position[2],
    );
    mesh.rotation.y = wallProps.rotationY;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    for (let index = 0; index < count; index += 1) {
      const row = Math.floor(index / bricksPerRow);
      const offset = row % 2 === (wallIndex % 2 === 1 ? 0 : 1) ? 1 : 0;
      const rowIndex =
        row % 2 === 1
          ? index % bricksPerRow
          : bricksPerRow - 1 - (index % bricksPerRow);
      const position = new THREE.Vector3(0, row * brickHeight, rowIndex * brickLength + offset);
      targets.push({ position, rotationY: 0 });
      matrix.makeTranslation(position.x, position.y + 20, position.z);
      mesh.setMatrixAt(index, matrix);

      const sectionLength = count / (gradient.length - 1);
      const first = Math.floor(index / sectionLength);
      const second = Math.min(gradient.length - 1, first + 1);
      const color = new THREE.Color().lerpColors(
        gradient[first],
        gradient[second],
        THREE.MathUtils.seededRandom(index),
      );
      mesh.setColorAt(index, color);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor!.needsUpdate = true;
    parent.add(mesh);
    quaternion.setFromEuler(new THREE.Euler(0, 0, 0));
    return { mesh, material, targets, matrix, quaternion, scale };
  });
}

function createFloor(
  parent: THREE.Group,
  viewWidth: number,
  studGeometry: THREE.BufferGeometry,
) {
  const diagonal = Math.ceil(Math.sqrt(viewWidth ** 2 / 2));
  const gridSize = diagonal + (1 - (diagonal % 2)) + 6;
  const count = gridSize ** 2;
  const material = new THREE.MeshStandardMaterial({
    color: theme.dark,
    roughness: 0.4,
    metalness: 0,
  });
  const studs = new THREE.InstancedMesh(studGeometry, material, count);
  const matrix = new THREE.Matrix4();
  const offset = Math.floor(gridSize / 2);

  for (let index = 0; index < count; index += 1) {
    const x = (index % gridSize) - offset + brickWidth / 2;
    const z = Math.floor(index / gridSize) - offset;
    matrix.makeTranslation(x, 0, z);
    studs.setMatrixAt(index, matrix);
  }

  studs.position.set(-0.5, -brickHeight, -0.5);
  studs.receiveShadow = true;
  studs.instanceMatrix.needsUpdate = true;

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(gridSize, studDepth, gridSize),
    material,
  );
  base.position.y = -studDepth / 2;
  base.receiveShadow = true;

  const group = new THREE.Group();
  group.position.set(10, -15, 10);
  group.rotation.y = Math.PI / 4;
  group.add(studs, base);
  parent.add(group);
  return { group, material, base };
}

function createExternalLinkTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) return null;

  context.strokeStyle = "#ffffff";
  context.lineWidth = 17;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowColor = "rgba(255, 255, 255, 0.9)";
  context.shadowBlur = 14;

  context.beginPath();
  context.moveTo(112, 58);
  context.lineTo(66, 58);
  context.quadraticCurveTo(48, 58, 48, 76);
  context.lineTo(48, 190);
  context.quadraticCurveTo(48, 208, 66, 208);
  context.lineTo(180, 208);
  context.quadraticCurveTo(198, 208, 198, 190);
  context.lineTo(198, 144);
  context.stroke();

  context.beginPath();
  context.moveTo(111, 145);
  context.lineTo(207, 49);
  context.moveTo(153, 49);
  context.lineTo(207, 49);
  context.lineTo(207, 103);
  context.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPhoneSignTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) return null;

  context.fillStyle = "#f8efd6";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#16856b";
  context.beginPath();
  context.arc(256, 256, 184, 0, Math.PI * 2);
  context.fill();

  context.save();
  context.translate(88, 88);
  context.scale(14, 14);
  context.strokeStyle = "#ffffff";
  context.lineWidth = 2.35;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke(
    new Path2D(
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z",
    ),
  );
  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  return texture;
}

function createBlankSignTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) return null;

  context.fillStyle = "#f8efd6";
  context.beginPath();
  context.arc(256, 256, 226, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#d6c6a1";
  context.lineWidth = 18;
  context.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function LegoIntroScene({ rotationTurns, started }: LegoIntroSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(started);
  const activationStartedAtRef = useRef<number | null>(null);
  const rotationTurnsRef = useRef(rotationTurns);

  useEffect(() => {
    if (started && !startedRef.current) {
      activationStartedAtRef.current = performance.now();
    }
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    rotationTurnsRef.current = rotationTurns;
  }, [rotationTurns]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const context = canvas.getContext("webgl2", { alpha: false, antialias: true });
    if (!context) {
      root.dataset.webgl = "unavailable";
      return;
    }

    let disposed = false;
    let animationFrame = 0;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme.focus);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, Math.sqrt(206.25) + 1);
    camera.position.set(10, 2.5, 10);

    const renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const rect = root.getBoundingClientRect();
    camera.aspect = Math.max(rect.width, 1) / Math.max(rect.height, 1);
    const dimensions = calculateOriginalDimensions(camera);
    scene.fog = new THREE.Fog(theme.focus, camera.far - 1.5, camera.far);
    scene.add(new THREE.DirectionalLight(0xffffff, 1));
    scene.children[scene.children.length - 1].position.set(0, 1, 0);

    const display = new THREE.Group();
    display.rotation.y = rotationTurnsRef.current * (Math.PI / 2);
    scene.add(display);

    const brickGeometry = createBrickGeometry();
    const walls = createWalls(
      display,
      brickGeometry.brick,
      dimensions.width,
      dimensions.height,
    );
    const floor = createFloor(display, dimensions.viewWidth, brickGeometry.stud);
    const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), deskMaterial);
    desk.position.set(2.5, 0.5, -3);
    desk.castShadow = true;
    desk.receiveShadow = true;
    display.add(desk);

    const manager = new THREE.LoadingManager(() => {
      if (!disposed) root.dataset.loaded = "true";
    });
    const dracoLoader = new DRACOLoader(manager).setDecoderPath("/assets/three/draco/");
    const ktx2Loader = new KTX2Loader(manager).setTranscoderPath("/assets/three/basis/");
    ktx2Loader.detectSupport(renderer);
    const gltfLoader = new GLTFLoader(manager)
      .setDRACOLoader(dracoLoader)
      .setKTX2Loader(ktx2Loader);
    const mixers: THREE.AnimationMixer[] = [];

    const prepareModel = (model: THREE.Object3D) => {
      model.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
    };

    const addFigure = (
      file: "Intern" | "Junior" | "Senior",
      position: [number, number, number],
      rotationY: number,
    ) => {
      gltfLoader.load(`${legoAssetBase}/${file}.glb`, (gltf) => {
        if (disposed) return;
        gltf.scene.position.set(...position);
        gltf.scene.rotation.y = rotationY;
        prepareModel(gltf.scene);
        display.add(gltf.scene);
        const clip = gltf.animations.find((animation) => animation.name === "typing");
        if (clip) {
          const mixer = new THREE.AnimationMixer(gltf.scene);
          mixer.clipAction(clip).play();
          mixers.push(mixer);
        }
      });
    };

    addFigure("Intern", [3, 0, -5.5], Math.PI / 2);
    addFigure("Junior", [5.5, 0, -3], Math.PI);
    addFigure("Senior", [2.5, 1, -3], Math.PI);

    const contactModels = [
      {
        file: "Spaceman",
        animation: "look_left",
        href: "https://www.linkedin.com/in/tia-tien-vu",
      },
      {
        file: "Overalls",
        animation: "look_right",
        href: "mailto:jocastavutien@gmail.com",
      },
      {
        file: "Pirate",
        animation: "look_left",
        href: "tel:+61404715735",
      },
      {
        file: "Knight",
        animation: "look_right",
        href: null,
      },
    ] as const;
    const contactOrigin = THREE.MathUtils.clamp(
      dimensions.width,
      1.5,
      Math.floor(camera.position.length() / 2),
    );
    const externalLinkTexture = createExternalLinkTexture();
    const externalLinkMaterial = externalLinkTexture
      ? new THREE.SpriteMaterial({
          map: externalLinkTexture,
          depthWrite: false,
          toneMapped: false,
          transparent: true,
        })
      : null;
    const contactIndicators: THREE.Sprite[] = [];
    const clickableContacts: THREE.Object3D[] = [];
    const contactHrefByObject = new WeakMap<THREE.Object3D, string>();
    const phoneSignTexture = createPhoneSignTexture();
    const phoneSignMaterial = phoneSignTexture
      ? new THREE.MeshStandardMaterial({
          map: phoneSignTexture,
          metalness: 0.1,
          roughness: 0.35,
          side: THREE.DoubleSide,
        })
      : null;
    const blankSignTexture = createBlankSignTexture();
    const blankSignMaterial = blankSignTexture
      ? new THREE.SpriteMaterial({
          map: blankSignTexture,
          depthWrite: false,
          toneMapped: false,
          transparent: true,
        })
      : null;

    contactModels.forEach(({ file, animation, href }, index) => {
      const isEven = index % 2 === 0;
      const offset = (Math.floor(index / 2) + 1) * 2.5 - 1;
      const x = isEven ? -contactOrigin - offset : -contactOrigin;
      const z = isEven ? contactOrigin : contactOrigin + offset;

      if (externalLinkMaterial && href) {
        const indicator = new THREE.Sprite(externalLinkMaterial);
        indicator.position.set(x, 3.15, z);
        indicator.scale.setScalar(0.68);
        indicator.renderOrder = 3;
        display.add(indicator);
        contactIndicators.push(indicator);
      }

      gltfLoader.load(`${legoAssetBase}/${file}.glb`, (gltf) => {
        if (disposed) return;
        gltf.scene.position.set(x, 0, z);
        gltf.scene.rotation.y = isEven ? 0 : -Math.PI / 2;
        prepareModel(gltf.scene);

        if (file === "Pirate" && phoneSignMaterial) {
          const sign = gltf.scene.getObjectByName("pirate_sign") as THREE.Mesh | undefined;
          if (sign) sign.material = phoneSignMaterial;
        }

        if (file === "Knight" && blankSignMaterial) {
          const blankSign = new THREE.Sprite(blankSignMaterial);
          blankSign.position.set(0.72, 1.2, 0.82);
          blankSign.scale.setScalar(1.42);
          blankSign.renderOrder = 3;
          gltf.scene.add(blankSign);
        }

        if (href) {
          gltf.scene.traverse((child) => contactHrefByObject.set(child, href));
          clickableContacts.push(gltf.scene);
        }
        display.add(gltf.scene);
        const clip = gltf.animations.find((entry) => entry.name === animation);
        if (clip) {
          const mixer = new THREE.AnimationMixer(gltf.scene);
          mixer.clipAction(clip).play();
          mixers.push(mixer);
        }
      });
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const getContactHref = (event: PointerEvent) => {
      const activeSection = ((rotationTurnsRef.current % 4) + 4) % 4;
      if (activeSection !== 1) return null;

      const bounds = canvas.getBoundingClientRect();
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(clickableContacts, true)[0];
      return hit ? contactHrefByObject.get(hit.object) ?? null : null;
    };
    const handlePointerMove = (event: PointerEvent) => {
      canvas.style.cursor = getContactHref(event) ? "pointer" : "default";
    };
    const handlePointerLeave = () => {
      canvas.style.cursor = "default";
    };
    const handleContactClick = (event: PointerEvent) => {
      const href = getContactHref(event);
      if (!href) return;

      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    };
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleContactClick);

    const titleResources: Array<THREE.Texture | THREE.Material | THREE.BufferGeometry> = [];

    const createTitlePlane = (kind: "name" | "portfolio") => {
      const titleCanvas = document.createElement("canvas");
      titleCanvas.width = 1200;
      titleCanvas.height = kind === "name" ? 440 : 600;
      const titleContext = titleCanvas.getContext("2d")!;
      titleContext.lineJoin = "round";
      titleContext.textBaseline = "middle";

      if (kind === "name") {
        titleContext.font = "900 220px Impact, Arial Black, sans-serif";
        titleContext.lineWidth = 26;
        titleContext.strokeStyle = "#111014";
        titleContext.strokeText("tien vu", 48, 170);
        titleContext.fillStyle = "#f7f7f0";
        titleContext.fillText("tien vu", 48, 170);

        titleContext.font = "900 58px Impact, Arial Narrow, sans-serif";
        const subtitle = "MARKETING · PUBLIC RELATIONS";
        const subtitleWidth = titleContext.measureText(subtitle).width;
        titleContext.fillStyle = "rgba(255,255,255,0.94)";
        titleContext.fillRect(84, 300, subtitleWidth + 34, 76);
        titleContext.fillStyle = "#111014";
        titleContext.fillText(subtitle, 101, 340);
      } else {
        titleContext.font = "italic 900 190px Impact, Arial Black, sans-serif";
        titleContext.lineWidth = 18;
        titleContext.strokeStyle = "#8d1628";
        titleContext.shadowColor = "#d62828";
        titleContext.shadowOffsetX = 22;
        titleContext.shadowOffsetY = 25;
        titleContext.strokeText("creative", 60, 190);
        titleContext.fillStyle = "#fff0a0";
        titleContext.fillText("creative", 60, 190);
        titleContext.strokeText("portfolio", 190, 405);
        titleContext.fillStyle = "#ffe06b";
        titleContext.fillText("portfolio", 190, 405);
      }

      const titleTexture = new THREE.CanvasTexture(titleCanvas);
      titleTexture.colorSpace = THREE.SRGBColorSpace;
      titleTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const titleMaterial = new THREE.MeshBasicMaterial({
        map: titleTexture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      });
      const titleGeometry = new THREE.PlaneGeometry(
        kind === "name" ? 6.7 : 6.2,
        kind === "name" ? 2.46 : 3.1,
      );
      titleResources.push(titleTexture, titleMaterial, titleGeometry);
      return new THREE.Mesh(titleGeometry, titleMaterial);
    };

    for (let section = 0; section < 4; section += 1) {
      const titles = new THREE.Group();
      titles.rotation.y = (section - 3) * (Math.PI / 2);

      const name = createTitlePlane("name");
      name.position.set(3.55, 4.35, -0.035);
      name.rotation.y = Math.PI;

      const portfolio = createTitlePlane("portfolio");
      portfolio.position.set(0.035, 4.25, -3.45);
      portfolio.rotation.y = Math.PI / 2;

      titles.add(name, portfolio);
      display.add(titles);
    }

    const environment = new UltraHDRLoader(manager);
    environment.load(`${legoAssetBase}/bambanani_sunset_1k.jpg`, (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 1;
    });

    const resizeObserver = new ResizeObserver(() => {
      const bounds = root.getBoundingClientRect();
      camera.aspect = Math.max(bounds.width, 1) / Math.max(bounds.height, 1);
      calculateOriginalDimensions(camera);
      renderer.setSize(Math.max(bounds.width, 1), Math.max(bounds.height, 1), false);
    });
    resizeObserver.observe(root);
    renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1), false);
    root.dataset.webgl = "ready";

    const mountedAt = performance.now();
    let previousTime = mountedAt;
    const target = new THREE.Vector3();

    const render = (now: number) => {
      if (disposed) return;
      const elapsed = (now - mountedAt) / 1000;
      const delta = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;

      const floorAlpha = THREE.MathUtils.smootherstep(elapsed, 0.5, 1.15);
      floor.group.position.lerpVectors(
        new THREE.Vector3(10, -15, 10),
        new THREE.Vector3(),
        floorAlpha,
      );
      floor.group.rotation.y = THREE.MathUtils.lerp(Math.PI / 4, 0, floorAlpha);

      const wallAlpha = THREE.MathUtils.smootherstep(elapsed, 0.9, 3.4);
      walls.forEach(({ mesh, targets, matrix }) => {
        if (wallAlpha < 1) {
          targets.forEach((entry, index) => {
            const chunk = 1 / targets.length;
            const start = chunk * index - chunk * index * 0.1;
            const stop = chunk * (index + 1) + 0.1 * (1 - chunk * (index + 1));
            const localAlpha = THREE.MathUtils.smootherstep(wallAlpha, start, stop);
            target.copy(entry.position);
            target.y += (1 - localAlpha) * 15;
            mesh.setMatrixAt(index, matrix.makeTranslation(target.x, target.y, target.z));
          });
          mesh.instanceMatrix.needsUpdate = true;
          mesh.computeBoundingSphere();
        }
      });

      mixers.forEach((mixer) => mixer.update(delta));
      contactIndicators.forEach((indicator, index) => {
        indicator.position.y = 3.15 + Math.sin(elapsed * 2 + index * 0.4) * 0.0625;
      });

      display.rotation.y = THREE.MathUtils.damp(
        display.rotation.y,
        rotationTurnsRef.current * (Math.PI / 2),
        5.5,
        delta,
      );
      const activeSection = ((rotationTurnsRef.current % 4) + 4) % 4;
      const backdrop = new THREE.Color(sectionColors[activeSection]);
      (scene.background as THREE.Color).lerp(backdrop, 1 - Math.exp(-4 * delta));
      if (scene.fog) scene.fog.color.copy(scene.background as THREE.Color);

      const exitAlpha = activationStartedAtRef.current
        ? clamp((now - activationStartedAtRef.current) / 800)
        : 0;
      camera.position.set(10 - exitAlpha * 3, 2.5, 10 - exitAlpha * 3);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleContactClick);
      mixers.forEach((mixer) => mixer.stopAllAction());
      scene.environment?.dispose();
      brickGeometry.brick.dispose();
      brickGeometry.stud.dispose();
      walls.forEach(({ material }) => material.dispose());
      floor.material.dispose();
      floor.base.geometry.dispose();
      desk.geometry.dispose();
      deskMaterial.dispose();
      externalLinkMaterial?.dispose();
      externalLinkTexture?.dispose();
      phoneSignMaterial?.dispose();
      phoneSignTexture?.dispose();
      blankSignMaterial?.dispose();
      blankSignTexture?.dispose();
      titleResources.forEach((resource) => resource.dispose());
      dracoLoader.dispose();
      ktx2Loader.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div aria-hidden="true" className="lego-intro-scene" ref={rootRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
