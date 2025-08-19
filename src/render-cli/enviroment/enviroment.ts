import * as THREE from 'three';

export function setupEnvironment(scene: THREE.Scene): void {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const skyboxTexture = cubeTextureLoader
      .setPath('/textures/skybox/sunny/') 
      .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
  
    scene.background = skyboxTexture;
    scene.environment = skyboxTexture;
  
    const fogColor = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(fogColor, 500, 2000);
  }