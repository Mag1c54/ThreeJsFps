import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FirstPersonControls } from "../utils/controls";
import type InitParams from "../types/RenderTypes";
import { setupLighting } from "./light/lighting";
import { setupWorld } from "./world/world";
import { setupWeapons } from "../../server/src/render-server/weapons/weapons";
import { setupEnvironment } from "./enviroment/enviroment";

function setupRenderer(renderer: THREE.WebGLRenderer): void {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  if (!document.body.contains(renderer.domElement)) {
    document.body.appendChild(renderer.domElement);
  }
}

export function initScene({
  camera,
  scene,
  renderer,
  world,
  setControls,
  socket,
}: InitParams & { socket: WebSocket }): void {
  const textureLoader = new THREE.TextureLoader();
  const gltfLoader = new GLTFLoader();

  setupRenderer(renderer);
  setupEnvironment(scene);
  setupLighting(scene);

  scene.add(world);
  setupWorld(world, textureLoader);

  camera.position.z = 5;

  const controls = new FirstPersonControls(camera, socket);
  scene.add(controls.getObject());

  setControls(controls);

  setupWeapons(camera, gltfLoader);
}
