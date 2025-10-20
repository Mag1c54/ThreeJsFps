import type * as RAPIER from "@dimforge/rapier3d-compat";
import type { Player } from "../../serverTypes/player";

export function updatePlayerMovement(
  player: Player,
<<<<<<< HEAD
  RAPIER_API: any,
=======
  RAPIER_API: any, 
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a
  world: RAPIER.World
) {
  const speed = player.input.run ? 250.0 : 150.0;
  const input = player.input;
  const rigidBody = player.rigidBody;
  const linVel = rigidBody.linvel();

<<<<<<< HEAD
  const moveVector = input.moveVector || { x: 0, z: 0 };

  if (moveVector.x === 0 && moveVector.z === 0) {
    rigidBody.setLinvel({ x: 0, y: linVel.y, z: 0 }, true);
  } else {
=======
  
  const moveVector = input.moveVector || { x: 0, z: 0 };

  if (moveVector.x === 0 && moveVector.z === 0) {
   
    rigidBody.setLinvel({ x: 0, y: linVel.y, z: 0 }, true);
  } else {
    
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a
    const moveDirection = new RAPIER_API.Vector3(moveVector.x, 0, moveVector.z);
    rigidBody.setLinvel(
      {
        x: moveDirection.x * speed,
        y: linVel.y,
        z: moveDirection.z * speed,
      },
      true
    );
  }
<<<<<<< HEAD
  if (input.jump) {
    const ray = new RAPIER_API.Ray(rigidBody.translation(), {
      x: 0,
      y: -1,
      z: 0,
    });

    const maxToi = 21.0;
    

    const playerCollider = rigidBody.collider(0);

    const hit = world.castRay(
      ray,
      maxToi,
      true,
      undefined,
      undefined,
      playerCollider
    );

    if (hit !== null) {
      rigidBody.applyImpulse({ x: 0, y: 75000, z: 0 }, true);
      player.input.jump = false;
    }
  }
}
=======


  if (input.jump) {
    
    const ray = new RAPIER_API.Ray(rigidBody.translation(), { x: 0, y: -1, z: 0 });
    const maxToi = 1.8; 
    const hit = world.castRay(ray, maxToi, true);

    if (hit !== null) {
    
      rigidBody.applyImpulse({ x: 0, y: 75000, z: 0 }, true);
    }
  
    player.input.jump = false;
  }
}
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a
