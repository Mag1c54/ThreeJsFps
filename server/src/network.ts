import * as THREE from "three";
import { attemptConnection } from "./dependencies/network/connection"; // Убедитесь, что путь правильный

export const playerMeshes = new Map<string, THREE.Mesh>();
export let myPlayerId: string | null = null;
export let lastKnownWeapon: string | null = null;

export function setMyPlayerId(id: string | null) {
  myPlayerId = id;
}
export function setLastKnownWeapon(weapon: string | null) {
  lastKnownWeapon = weapon;
}

export function connectToServer(
  scene: THREE.Scene,
  shotSound: HTMLAudioElement,
  raycaster: THREE.Raycaster,
  worldGroup: THREE.Group,
  camera: THREE.Camera,
  onConnect: (myId: string, socket: WebSocket) => void
) {
  console.log("Первая попытка подключения к серверу...");
  attemptConnection(scene, shotSound, raycaster, worldGroup, camera, onConnect);
}
