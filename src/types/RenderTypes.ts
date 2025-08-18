import * as THREE from 'three';
import { FirstPersonControls } from '../utils/controls';

 export default interface InitParams {
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    world: THREE.Group; 
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
    shotSound: HTMLAudioElement;
  }

export interface RenderStepParams {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: FirstPersonControls;
    worldGroup: THREE.Group;
    raycaster: THREE.Raycaster;
    shotSound: HTMLAudioElement;
    socket: WebSocket;
}