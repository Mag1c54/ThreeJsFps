import * as THREE from 'three';
import { FirstPersonControls } from '../utils/controls';

 export default interface InitParams {
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    world: THREE.Group; // Группа для статичных объектов мира
    setControls: (controls: FirstPersonControls) => void;
  }
  
export interface LoopParams {
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    controls: FirstPersonControls;
    socket: WebSocket;
    world: THREE.Group;
    raycaster: THREE.Raycaster;
  }

export interface RenderStepParams {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: FirstPersonControls;
    worldGroup: THREE.Group;
    raycaster: THREE.Raycaster;
}