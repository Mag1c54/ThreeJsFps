import RAPIER from "@dimforge/rapier3d-compat";
import { WebSocket } from "ws";

export interface Player {
  id: string;
  socket: WebSocket;
  rigidBody: RAPIER.RigidBody;
  hp: number;
<<<<<<< HEAD
  inventory: string[];
  currentWeapon: string;
=======
  inventory: string[];      
  currentWeapon: string;  
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a
  input: {
    forward: boolean;
    backward: boolean;
    moveVector: { x: number; z: number };
    left: boolean;
    right: boolean;
    jump: boolean;
    run: boolean;
    yaw: number;
    pitch: number;
  };
}
