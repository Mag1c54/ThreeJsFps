import * as THREE from 'three';


export function setupLighting(scene: THREE.Scene): void {
    const sunLight = new THREE.DirectionalLight(0xfff8e7, 4.0);
    sunLight.position.set(100, 150, 100);
    sunLight.castShadow = true;
  
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 2500;
    const shadowCamSize = 1000;
    sunLight.shadow.camera.left = -shadowCamSize;
    sunLight.shadow.camera.right = -shadowCamSize;
    sunLight.shadow.camera.top = shadowCamSize;
    sunLight.shadow.camera.bottom = -shadowCamSize;
    
    scene.add(sunLight);
  
    const ambientLight = new THREE.AmbientLight(0x6080A0, 0.6);
    scene.add(ambientLight);
  }