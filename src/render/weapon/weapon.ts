import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


 export function setupWeapon(camera: THREE.PerspectiveCamera, loader: GLTFLoader): void {
    loader.load('/models/Thompson.glb', (gltf) => {
        const weapon = gltf.scene;
        weapon.position.set(0.2, -0.2, -0.5);
        weapon.rotation.y = Math.PI;
        weapon.scale.set(0.8, 0.8, 0.8);
        
        weapon.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
          }
        });
        camera.add(weapon);
      },
      undefined, 
      (error) => {
        console.error('Не удалось загрузить модель оружия:', error);
      }
    );
  }