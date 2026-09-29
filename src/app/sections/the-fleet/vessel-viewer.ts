import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  type Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type VesselViewer = {
  /** Adds yaw in radians; the release velocity carries on as inertia. */
  drag: (radians: number) => void;
  release: () => void;
  nudge: (radians: number) => void;
  setActive: (active: boolean) => void;
  setVisible: (visible: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  dispose: () => void;
};

type Options = {
  canvas: HTMLCanvasElement;
  url: string;
  /** Model height as a fraction of the canvas height. */
  fill: number;
  /** Yaw at rest, radians. The exports run bow along +X, so -PI/2 faces the bow to camera. */
  restYaw: number;
  /** Yaw each showing turns in from. */
  introYaw: number;
  onReady: () => void;
  onError: () => void;
};

const HULL_GREY = new Color(0xb4b6b8);
const FOV = 18;
const INERTIA_DECAY = 0.92;
const BOB = { height: 0.006, period: 5.6 };
const PITCH = { angle: 0.006, period: 7.3 };
const ROLL = { angle: 0.01, period: 9.1 };
const INTRO_MS = 2000;
/* The first showing waits for the panel's own entry reveal (the-fleet.module.css). */
const FIRST_INTRO_DELAY_MS = 1100;

const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

let revealed = false;

let draco: DRACOLoader | null = null;
const dracoLoader = () => {
  if (!draco) {
    draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    draco.setDecoderConfig({ type: "wasm" });
  }
  return draco;
};

export function createVesselViewer({
  canvas,
  url,
  fill,
  restYaw,
  introYaw,
  onReady,
  onError,
}: Options): VesselViewer {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.35;
  scene.add(new HemisphereLight(0xffffff, 0x8a949c, 0.6));
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 7, 5);
  scene.add(key);
  const rim = new DirectionalLight(0xdfe8f0, 0.8);
  rim.position.set(-6, 3, -4);
  scene.add(rim);

  const camera = new PerspectiveCamera(FOV, 2, 0.1, 1000);
  const yawGroup = new Group();
  const floatGroup = new Group();
  yawGroup.add(floatGroup);
  scene.add(yawGroup);

  let yaw = restYaw;
  let velocity = 0;
  let intro: { t0: number } | null = null;
  let introPending = true;
  let dragging = false;
  let active = false;
  let visible = false;
  let reduced = false;
  let modelHeight = 1;
  let loaded = false;
  let disposed = false;
  let frame = 0;
  const t0 = performance.now();

  const material = new MeshStandardMaterial({
    color: HULL_GREY,
    roughness: 0.62,
    metalness: 0.05,
    // CAD skins are single surfaces; their back faces are what you see from the other side.
    side: DoubleSide,
  });

  const frameModel = (height: number, centerY: number) => {
    const dist = height / fill / 2 / Math.tan((FOV * Math.PI) / 360);
    camera.position.set(0, centerY + height * 0.04, dist);
    camera.near = dist / 20;
    camera.far = dist * 20;
    camera.lookAt(0, centerY, 0);
    camera.updateProjectionMatrix();
  };

  new GLTFLoader().setDRACOLoader(dracoLoader()).load(
    url,
    (gltf) => {
      if (disposed) return;
      const root = gltf.scene;
      root.traverse((node) => {
        const mesh = node as Mesh;
        if (!mesh.isMesh) return;
        mesh.material = material;
      });
      const box = new Box3().setFromObject(root);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());
      root.position.set(-center.x, -box.min.y, -center.z);
      floatGroup.add(root);
      modelHeight = size.y;
      frameModel(size.y, size.y / 2);
      loaded = true;
      resize();
      onReady();
      maybeIntro();
      kick();
    },
    undefined,
    () => {
      if (!disposed) onError();
    },
  );

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    kick();
  };
  const resizer = new ResizeObserver(resize);
  resizer.observe(canvas);

  const idle = () => !reduced && active;
  const moving = () => dragging || intro !== null || Math.abs(velocity) > 1e-4;

  const maybeIntro = () => {
    if (!introPending || !active || !loaded || !visible) return;
    introPending = false;
    velocity = 0;
    if (reduced) {
      yaw = restYaw;
      intro = null;
    } else {
      yaw = introYaw;
      intro = {
        t0: performance.now() + (revealed ? 0 : FIRST_INTRO_DELAY_MS),
      };
    }
    revealed = true;
    kick();
  };

  const tick = () => {
    frame = 0;
    if (!loaded || !visible) return;
    if (intro && !dragging) {
      const p = Math.min(
        1,
        Math.max(0, (performance.now() - intro.t0) / INTRO_MS),
      );
      yaw = restYaw + (introYaw - restYaw) * (1 - easeOut(p));
      if (p >= 1) intro = null;
    } else if (!dragging) {
      yaw += velocity;
      velocity *= reduced ? 0 : INERTIA_DECAY;
    }
    yawGroup.rotation.y = yaw;

    const t = (performance.now() - t0) / 1000;
    const wave = (period: number, phase = 0) =>
      Math.sin((t / period) * Math.PI * 2 + phase);
    if (idle()) {
      floatGroup.position.y = modelHeight * BOB.height * wave(BOB.period);
      floatGroup.rotation.x = PITCH.angle * wave(PITCH.period, 1.3);
      floatGroup.rotation.z = ROLL.angle * wave(ROLL.period, 0.4);
    } else if (reduced) {
      floatGroup.position.y = 0;
      floatGroup.rotation.set(0, 0, 0);
    }

    renderer.render(scene, camera);
    if (idle() || moving()) kick();
  };

  function kick() {
    if (!frame && !disposed) frame = requestAnimationFrame(tick);
  }

  return {
    drag(radians) {
      dragging = true;
      intro = null;
      yaw += radians;
      velocity = radians;
      kick();
    },
    release() {
      dragging = false;
      kick();
    },
    nudge(radians) {
      intro = null;
      velocity = 0;
      yaw += radians;
      kick();
    },
    setActive(value) {
      if (value && !active) introPending = true;
      active = value;
      maybeIntro();
      kick();
    },
    setVisible(value) {
      visible = value;
      maybeIntro();
      kick();
    },
    setReducedMotion(value) {
      reduced = value;
      kick();
    },
    dispose() {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizer.disconnect();
      scene.traverse((node) => {
        const mesh = node as Mesh;
        if (mesh.isMesh) mesh.geometry.dispose();
      });
      material.dispose();
      scene.environment?.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
