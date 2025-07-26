import * as THREE from 'three';
import { makeParticles, updateParticle, particles } from '../utils/particles';
import  type { RenderStepParams } from '../types/RenderTypes';



// Вектор для координат мыши создаем один раз
const mouseCoords = new THREE.Vector2(0, 0);


export function runRenderStep({
    renderer,
    scene,
    camera,
    controls,
    worldGroup,
    raycaster,
}: RenderStepParams): void {

 
    if (controls.enabled && controls.click) {
      
        raycaster.setFromCamera(mouseCoords, camera);
        
       
        const intersects = raycaster.intersectObjects(worldGroup.children, true);
        if (intersects.length > 0) {
            makeParticles(intersects[0].point, scene);
        }
        
        
        controls.click = false;
    }

    
    for (let i = particles.length - 1; i >= 0; i--) {
        updateParticle(particles[i], i, scene);
    }
    

    renderer.render(scene, camera);
}