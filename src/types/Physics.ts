  import * as THREE from 'three';
  import { RAPIER } from '../utils/physics';
 export default interface PhysicsObject {
    mesh: THREE.Mesh;
    sprite: THREE.Sprite;
    rigidBody: RAPIER.RigidBody;
  }
 