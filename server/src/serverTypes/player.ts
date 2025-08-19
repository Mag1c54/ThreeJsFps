import RAPIER from "@dimforge/rapier3d-compat";
import { WebSocket } from "ws";

export interface Player {
  id: string;
  socket: WebSocket;
  rigidBody: RAPIER.RigidBody;
  hp: number;
  inventory: string[];      
  currentWeapon: string;  
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
