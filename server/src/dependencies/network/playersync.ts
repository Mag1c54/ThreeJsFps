import * as THREE from "three";
<<<<<<< HEAD
import { myPlayerId, playerMeshes } from "@shared/network/network";
=======
import { myPlayerId, playerMeshes } from "../../network";
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a

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
<<<<<<< HEAD
    if (playerData.id === myPlayerId) return;

    let mesh = playerMeshes.get(playerData.id);
    if (mesh) {
=======
    if (playerData.id === myPlayerId) return; 

    let mesh = playerMeshes.get(playerData.id);
    if (mesh) {
     
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a
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
<<<<<<< HEAD
=======
  
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a
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
