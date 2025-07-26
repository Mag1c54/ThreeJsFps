import * as THREE from 'three';
import { getMyPlayerState } from '../utils/network'; 
import { runRenderStep } from './render'; 
import type  { LoopParams } from '../types/RenderTypes';


export function startRenderLoop(params: LoopParams): void {
  const { camera, scene, renderer, controls, socket, world, raycaster } = params;
  
  console.log("Логический цикл запущен!");

  const inputSendInterval = 1000 / 20; 
  let lastInputSendTime = 0;
  
  // Создаем глобальную функцию, которую будет вызывать network.ts для обновления нашей камеры
  (window as any).updateMyPlayer = (gameState: any[]) => {
      const myPlayerState = getMyPlayerState(gameState);

      if (myPlayerState) {
          const playerObject = controls.getObject();
       
          const EYE_HEIGHT_OFFSET = 12.0; 
        
          playerObject.position.lerp(
              new THREE.Vector3(
                  myPlayerState.position.x, 
                  myPlayerState.position.y + EYE_HEIGHT_OFFSET, // Поднимаем камеру на уровень глаз
                  myPlayerState.position.z
              ), 
              0.4 
          );
      }
  };

  function loop(): void {

    requestAnimationFrame(loop);

    if (controls.enabled) {
      const now = performance.now();
      if (now - lastInputSendTime > inputSendInterval) {
        if (socket && socket.readyState === WebSocket.OPEN) {
          const inputState = controls.getInputState();
          socket.send(JSON.stringify(inputState));
        }
        lastInputSendTime = now;
      }
    }

    runRenderStep({
      renderer,
      scene,
      camera,
      controls,
      worldGroup: world,
      raycaster
    });
  }

  loop();
}