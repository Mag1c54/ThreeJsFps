import * as THREE from 'three';
import { setupGUI } from './setup/gui';
import { FirstPersonControls } from './utils/controls';
import { setupPointerLock } from './setup/pointerLock';
import { startRenderLoop } from './render/loop';
import { initScene } from './render/init';
import { connectToServer } from '../server/src/network';

export const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 3000);
export const scene = new THREE.Scene();
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export const raycaster = new THREE.Raycaster();
export const worldGroup = new THREE.Group();

const shotSound = new Audio('/sounds/Thompson.mp3');
shotSound.load()



initScene({
  camera,
  scene,
  renderer,
  world  : worldGroup,
  setControls: (controls: FirstPersonControls) => {
    console.log('Контроллер создан, настраиваем GUI и PointerLock.');
    setupGUI(controls);
    setupPointerLock(controls);

    console.log('Подключаемся к серверу...');
    connectToServer(scene, shotSound, (myId, socket) => {
      console.log("Успешно подключено к серверу. Мой ID:", myId);
      startRenderLoop({
        scene, camera, renderer, controls, socket, world: worldGroup, raycaster
        , shotSound
      });
    });
  },
});

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);
onWindowResize();