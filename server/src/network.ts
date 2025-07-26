import * as THREE from 'three';


const playerMeshes = new Map<string, THREE.Mesh>();

export let myPlayerId: string | null = null;


function updateOtherPlayers(playersData: any[], scene: THREE.Scene) {
    if (!myPlayerId) return;

    const serverPlayerIds = new Set(playersData.map(p => p.id));
    
    playerMeshes.forEach((mesh, id) => {
        if (!serverPlayerIds.has(id)) {
            scene.remove(mesh);
            mesh.geometry.dispose();
            (mesh.material as THREE.Material).dispose();
            playerMeshes.delete(id);
        }
    });

    playersData.forEach((playerData) => {
        if (playerData.id === myPlayerId) return;

        let mesh = playerMeshes.get(playerData.id);
        if (mesh) {
            mesh.position.lerp(new THREE.Vector3(playerData.position.x, playerData.position.y , playerData.position.z), 0.3);
            mesh.quaternion.slerp(new THREE.Quaternion(playerData.rotation.x, playerData.rotation.y, playerData.rotation.z, playerData.rotation.w), 0.3);
        } else {
            const geometry = new THREE.CapsuleGeometry(5, 20, 4, 8);
            const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
            mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.position.set(playerData.position.x, playerData.position.y, playerData.position.z);
            scene.add(mesh);
            playerMeshes.set(playerData.id, mesh);
        }
    });
}


function attemptConnection(scene: THREE.Scene, onConnect: (myId: string, socket: WebSocket) => void) {
    const ws = new WebSocket('ws://127.0.0.1:8085');

    ws.onopen = () => {
        console.log('Подключено к WebSocket серверу!');
    };

    ws.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);

            if (message.type === 'your_id' && !myPlayerId) { 
                myPlayerId = message.id;
                onConnect(myPlayerId!, ws);
            }
            
            if (message.type === 'gameState') {
                updateOtherPlayers(message.payload, scene);
                 if ((window as any).updateMyPlayer) {
                    (window as any).updateMyPlayer(message.payload);
                }
            }
        } catch (e) {
            console.error("Ошибка парсинга сообщения от сервера:", e);
        }
    };

    ws.onerror = (err) => {
        console.error('Ошибка WebSocket:', err);
    };

    ws.onclose = () => {
        if (!myPlayerId) {
            console.log('Не удалось подключиться. Повторная попытка через 2 секунды...');
            setTimeout(() => {
                attemptConnection(scene, onConnect);
            }, 2000);
        } else {
            console.log('Отключено от сервера.');
            myPlayerId = null; // Сбрасываем ID
            playerMeshes.forEach(mesh => scene.remove(mesh));
            playerMeshes.clear();
            setTimeout(() => {
                attemptConnection(scene, onConnect);
            }, 2000);
        }
    };
}


export function connectToServer(scene: THREE.Scene, onConnect: (myId: string, socket: WebSocket) => void) {
    console.log("Первая попытка подключения к серверу...");
    attemptConnection(scene, onConnect);
}
