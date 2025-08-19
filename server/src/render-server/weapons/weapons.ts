import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const weapons = new Map<string, THREE.Object3D>();

export function setupWeapons(
  camera: THREE.PerspectiveCamera,
  loader: GLTFLoader
): void {
  loader.load("/models/Thompson.glb", (gltf) => {
    const weapon = gltf.scene;
    weapon.position.set(0.2, -0.2, -0.5);
    weapon.rotation.y = Math.PI;
    weapon.scale.set(0.8, 0.8, 0.8);
    weapon.visible = false;

    weapon.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
      }
    });

    camera.add(weapon);
    weapons.set("thompson", weapon);
  });

  loader.load(
    "/models/knife.glb",
    (gltf) => {
      const weapon = gltf.scene;
      weapon.position.set(0.25, -0.1, -0.5);
      weapon.rotation.set(
        THREE.MathUtils.degToRad(270), // Наклон от игрока (по оси X)
        THREE.MathUtils.degToRad(-10), // Легкий поворот к центру (по оси Y)
        THREE.MathUtils.degToRad(90) // Наклон вбок, лезвием вверх (по оси Z)
      );
      weapon.scale.set(0.15, 0.15, 0.15);
      weapon.visible = false;

      weapon.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
        }
      });

      camera.add(weapon);
      weapons.set("knife", weapon);
    },
    undefined,
    () =>
      console.error(
        "Не удалось загрузить модель ножа. Убедитесь, что файл /models/knife.glb существует."
      )
  );
}

export function switchActiveWeapon(weaponName: string): void {
  weapons.forEach((weaponObject, name) => {
    weaponObject.visible = name === weaponName;
  });
}
