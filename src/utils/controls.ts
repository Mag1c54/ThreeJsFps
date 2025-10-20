import * as THREE from 'three';

export class FirstPersonControls {
  public enabled = false;
  public click = false;
  public MouseMoveSensitivity: number;

  private pitchObject = new THREE.Object3D();
  private yawObject = new THREE.Object3D();

  private run = false;
  private wantsToJump = false; 

  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  
  private socket: WebSocket; 

  constructor(
    camera: THREE.Camera,
    socket: WebSocket, 
    MouseMoveSensitivity = 0.002 
  ) {
    this.MouseMoveSensitivity = MouseMoveSensitivity;
    this.socket = socket; 
    
    camera.rotation.set(0, 0, 0);
    this.pitchObject.add(camera);
    this.yawObject.add(this.pitchObject);
    this.initEventListeners();
  }

  private initEventListeners() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  public dispose() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  public getObject(): THREE.Object3D {
    return this.yawObject;
  }

  public getInputState() {

    const direction = new THREE.Vector3(
      Number(this.moveRight) - Number(this.moveLeft),
      0,
      Number(this.moveBackward) - Number(this.moveForward)
    );
  
    let moveVector = { x: 0, z: 0 };
    
    if (direction.lengthSq() > 0) {
      direction.normalize();
  
      const yaw = this.yawObject.rotation.y;
      const matrix = new THREE.Matrix4().makeRotationY(yaw);
      direction.applyMatrix4(matrix);
  
      moveVector = { x: direction.x, z: direction.z };
    }
  
    const inputPayload = {
      forward: this.moveForward,
      backward: this.moveBackward,
      left: this.moveLeft,
      right: this.moveRight,
      jump: this.wantsToJump,
      run: this.run,
      yaw: this.yawObject.rotation.y,
      pitch: this.pitchObject.rotation.x,
      moveVector, 
    };
  
    if (this.wantsToJump) {
      this.wantsToJump = false;
    }
  
    return inputPayload;
  }
  
  private onMouseMove = (event: MouseEvent): void => {


    if (!this.enabled) return;
    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    this.yawObject.rotation.y -= movementX * this.MouseMoveSensitivity;
    this.pitchObject.rotation.x -= movementY * this.MouseMoveSensitivity;
    const PI_2 = Math.PI / 2;
    this.pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, this.pitchObject.rotation.x));
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    if (!this.enabled) return;
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      case 'Space':
        this.wantsToJump = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.run = true;
        break;
      case 'Digit1':
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'switch_weapon', weapon: 'thompson' }));
          }
        break;
      case 'Digit2':
           if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'switch_weapon', weapon: 'knife' }));
          }
        break;
    }
  };

  private onKeyUp = (event: KeyboardEvent): void => {


    if (!this.enabled) return;
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.run = false;
        break;
    }
  };

  private onMouseDown = (): void => {

    if (!this.enabled) return;
    this.click = true;
  };

  private onMouseUp = (): void => {
   
    if (!this.enabled) return;
    this.click = false;
  };
}