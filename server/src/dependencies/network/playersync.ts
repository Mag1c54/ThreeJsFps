import * as THREE from "three";
import { myPlayerId, playerMeshes } from "../../network";

export function updateOtherPlayers(playersData: any[], scene: THREE.Scene) {
  if (!myPlayerId) return;

  const serverPlayerIds = new Set(playersData.map((p) => p.id));

  playerMeshes.forEach((mesh, id) => {
    if (!serverPlayerIds.has(id)) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      playerMeshes.delete(id);
    }
  });

  playersData.forEach((playerData) => {
    if (playerData.id === myPlayerId) return; 

    let mesh = playerMeshes.get(playerData.id);
    if (mesh) {
     
      mesh.position.lerp(
        new THREE.Vector3(
          playerData.position.x,
          playerData.position.y,
          playerData.position.z
        ),
        0.3
      );
      mesh.quaternion.slerp(
        new THREE.Quaternion(
          playerData.rotation.x,
          playerData.rotation.y,
          playerData.rotation.z,
          playerData.rotation.w
        ),
        0.3
      );
    } else {
  
      const geometry = new THREE.CapsuleGeometry(5, 20, 4, 8);
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.position.set(
        playerData.position.x,
        playerData.position.y,
        playerData.position.z
      );
      scene.add(mesh);
      playerMeshes.set(playerData.id, mesh);
    }
  });
}
