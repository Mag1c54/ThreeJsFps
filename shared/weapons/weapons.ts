import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loadedWeapons = new Map<string, THREE.Object3D>();


async function loadAllWeapons(loader: GLTFLoader): Promise<Map<string, THREE.Object3D>> {
  const weaponConfigs = [
    { name: "thompson", path: "/models/Thompson.glb", scale: 0.8, position: [0.2, -0.2, -0.5], rotationY: Math.PI },
    { name: "knife", path: "/models/knife.glb", scale: 0.15, position: [0.25, -0.1, -0.5], rotation: [THREE.MathUtils.degToRad(270), THREE.MathUtils.degToRad(-10), THREE.MathUtils.degToRad(90)] }
  ];

  for (const config of weaponConfigs) {
    try {
      const gltf = await loader.loadAsync(config.path);
      const weapon = gltf.scene;

      weapon.scale.set(config.scale, config.scale, config.scale);
      weapon.position.set(config.position[0], config.position[1], config.position[2]);

      if (config.rotation) {
        weapon.rotation.set(config.rotation[0], config.rotation[1], config.rotation[2]);
      } else if (config.rotationY) {
        weapon.rotation.y = config.rotationY;
      }

      weapon.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
        }
      });

      loadedWeapons.set(config.name, weapon);
    } catch (error) {
      console.error(`Не удалось загрузить модель ${config.name} из ${config.path}:`, error);
    }
  }

  return loadedWeapons;
}

export async function setupWeapons(camera: THREE.PerspectiveCamera, loader: GLTFLoader): Promise<Map<string, THREE.Object3D>> {
  const weapons = await loadAllWeapons(loader);
  
  weapons.forEach(weapon => {
    weapon.visible = false;
    camera.add(weapon);
  });

  return weapons;
}

export function switchActiveWeapon(weaponName: string): void {
  loadedWeapons.forEach((weaponObject, name) => {
    weaponObject.visible = name === weaponName;
  });
}