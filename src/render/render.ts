import * as THREE from "three";
import { makeParticles, updateParticle, particles } from "../utils/particles";
import type { RenderStepParams } from "../types/RenderTypes";

const mouseCoords = new THREE.Vector2(0, 0);

export function runRenderStep({
  renderer,
  scene,
  camera,
  controls,
  worldGroup,
  raycaster,
  shotSound,
  socket,
}: RenderStepParams): void {
  if (controls.enabled && controls.click) {
    shotSound.currentTime = 0;
    shotSound.play();

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'shoot' }));
    }

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
