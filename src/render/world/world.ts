import * as THREE from 'three';
import {createSeededRandom} from '../../../server/src/utils/seed';
import { RAPIER, world as rapierWorld } from '../../utils/physics';

export function setupWorld(worldGroup: THREE.Group, textureLoader: THREE.TextureLoader): void {
  

    const floorSize = 4000;
    const textureRepeat = 200;
  

    const grassColor = textureLoader.load('/textures/grass/color.jpg');
    const grassNormal = textureLoader.load('/textures/grass/normal.jpg');
    const grassRoughness = textureLoader.load('/textures/grass/roughness.jpg');
    const grassAO = textureLoader.load('/textures/grass/ao.jpg');
    
    [grassColor, grassNormal, grassRoughness, grassAO].forEach(t => {
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(textureRepeat, textureRepeat);
    });
    
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: grassColor,
        normalMap: grassNormal,
        roughnessMap: grassRoughness,
        aoMap: grassAO,
        aoMapIntensity: 1,
    });
  
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorSize, floorSize), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    worldGroup.add(floor);
  

    const floorBodyDesc = RAPIER.RigidBodyDesc.fixed();
    const floorRigidBody = rapierWorld.createRigidBody(floorBodyDesc);
    const floorColliderDesc = RAPIER.ColliderDesc.cuboid(floorSize / 2, 0.1, floorSize / 2);
    rapierWorld.createCollider(floorColliderDesc, floorRigidBody);
  

    const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc, 
        roughness: 0.6,
        metalness: 0.2
    });
    

    const seededRandom = createSeededRandom(12345); 
  
    for (let i = 0; i < 15; i++) {
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        const pos = {
            x: (seededRandom() - 0.5) * 1800,
            y: 25,
            z: (seededRandom() - 0.5) * 1800
        };
        box.position.set(pos.x, pos.y, pos.z);
        box.rotation.y = seededRandom() * Math.PI;
        box.castShadow = true;
        box.receiveShadow = true;
        worldGroup.add(box);
  
        // Физика для ящиков
        const boxBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y, pos.z);
        const boxRigidBody = rapierWorld.createRigidBody(boxBodyDesc);
        const boxColliderDesc = RAPIER.ColliderDesc.cuboid(25, 25, 25); // Половина размера геометрии
        rapierWorld.createCollider(boxColliderDesc, boxRigidBody);
    }
}