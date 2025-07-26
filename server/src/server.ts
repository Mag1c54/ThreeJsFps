// server/src/server.ts

import { WebSocketServer, WebSocket } from 'ws';
import RAPIER from "@dimforge/rapier3d-compat";
import type { Player } from './serverTypes/player';
// Убедитесь, что путь до вашего seed.ts правильный. Возможно, './utils/seed'
import { createSeededRandom } from './utils/seed'; 

async function main() {
    await RAPIER.init();
    console.log('Движок Rapier3D успешно инициализирован.');

    const gravity = new RAPIER.Vector3(0, -9.81 * 2, 0);
    const world = new RAPIER.World(gravity);

    // Создаем статическую геометрию мира
    const floorSize = 4000;
    const floorBodyDesc = RAPIER.RigidBodyDesc.fixed();
    world.createCollider(RAPIER.ColliderDesc.cuboid(floorSize / 2, 0.1, floorSize / 2), world.createRigidBody(floorBodyDesc));
    console.log('Физический пол создан на сервере.');

    const seededRandom = createSeededRandom(12345);
    for (let i = 0; i < 15; i++) {
        const pos = { x: (seededRandom() - 0.5) * 1800, y: 25, z: (seededRandom() - 0.5) * 1800 };
        const boxBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y, pos.z);
        world.createCollider(RAPIER.ColliderDesc.cuboid(25, 25, 25), world.createRigidBody(boxBodyDesc));
    }
    console.log('Физические ящики созданы на сервере.');

    // Настройка WebSocket сервера
    const players = new Map<string, Player>();
    const wss = new WebSocketServer({ port: 8085, host: '0.0.0.0' });

    wss.on('connection', (ws) => {
        const playerId = Math.random().toString(36).substr(2, 9);
        console.log(`Игрок ${playerId} подключился.`);
        ws.send(JSON.stringify({ type: 'your_id', id: playerId }));

        const playerHeight = 30;
        const playerRadius = 5;
        const playerBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, playerHeight, 0).setCanSleep(false).setLinearDamping(0.5);
        const playerRigidBody = world.createRigidBody(playerBodyDesc);
        world.createCollider(RAPIER.ColliderDesc.capsule(playerHeight / 2, playerRadius), playerRigidBody);

        const player: Player = {
            id: playerId,
            socket: ws,
            rigidBody: playerRigidBody,
            input: { forward: false, backward: false, left: false, right: false, jump: false, run: false, yaw: 0, pitch: 0 ,  moveVector: { x: 0, z: 0 }, }
        };
        players.set(playerId, player);

        ws.on('message', (message) => {
            try {
                const inputData = JSON.parse(message.toString());
                if (player) { player.input = { ...player.input, ...inputData }; }
            } catch (e) { /* Игнорируем ошибки парсинга */ }
        });

        ws.on('close', () => {
            console.log(`Игрок ${playerId} отключился.`);
            const playerToRemove = players.get(playerId);
            if (playerToRemove) {
                world.removeRigidBody(playerToRemove.rigidBody);
                players.delete(playerId);
            }
        });
    });

    // Главный игровой цикл
    setInterval(() => {
        world.step();

        players.forEach(player => {
            updatePlayerMovement(player, RAPIER, world);
        });

        const gameState = Array.from(players.values()).map(p => ({
            id: p.id,
            position: p.rigidBody.translation(),
            rotation: p.rigidBody.rotation(),
        }));
        
        if (gameState.length > 0) {
            const stateString = JSON.stringify({ type: 'gameState', payload: gameState });
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(stateString);
                }
            });
        }
    }, 1000 / 60);
}

/**
 * Обновляет движение игрока на основе его ввода.
 */
function updatePlayerMovement(player: Player, RAPIER: any, world: RAPIER.World) {
    const speed = player.input.run ? 250.0 : 150.0;
    const input = player.input;
    const linVel = player.rigidBody.linvel();

    // --- НАЧАЛО НОВОЙ, ПРОСТОЙ ЛОГИКИ ---

    // 1. Получаем готовый вектор движения от клиента (если он есть)
    const moveVector = input.moveVector || { x: 0, z: 0 };
    
    // 2. Проверяем, есть ли движение
    if (moveVector.x === 0 && moveVector.z === 0) {
        player.rigidBody.setLinvel({ x: 0, y: linVel.y, z: 0 }, true);
    } else {
        // 3. Создаем вектор Rapier. Клиент уже прислал нормализованный вектор.
        const moveDirection = new RAPIER.Vector3(moveVector.x, 0, moveVector.z);

        // 4. Устанавливаем скорость. Поворачивать ничего не нужно!
        player.rigidBody.setLinvel(
            {
                x: moveDirection.x * speed,
                y: linVel.y,
                z: moveDirection.z * speed
            },
            true
        );
    }
    // --- КОНЕЦ НОВОЙ, ПРОСТОЙ ЛОГИКИ ---

    // 5. Логика прыжка
    if (input.jump) {
        const ray = new RAPIER.Ray(player.rigidBody.translation(), { x: 0, y: -1, z: 0 });
        const hit = world.castRay(ray, 1.8, true);
        
        if (hit !== null) {
           player.rigidBody.applyImpulse({ x: 0, y: 75000, z: 0 }, true);
        }
        player.input.jump = false;
    }
}
// Запускаем сервер
main().catch(error => {
    console.error("Произошла критическая ошибка при запуске сервера:", error);
});