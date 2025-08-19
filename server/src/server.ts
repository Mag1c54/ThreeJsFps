import { WebSocketServer, WebSocket } from "ws";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { normalizeVector3 } from "./utils/vector";
import type { Player } from "./serverTypes/player";
import { createSeededRandom } from "./utils/seed";
import { updatePlayerMovement } from "./dependencies/server/playerMovement";

async function main() {
  await RAPIER.init();
  console.log("Движок Rapier3D успешно инициализирован.");

  const gravity = new RAPIER.Vector3(0, -9.81 * 2, 0);
  const world = new RAPIER.World(gravity);


  const floorSize = 4000;
  const floorBodyDesc = RAPIER.RigidBodyDesc.fixed();
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(floorSize / 2, 0.1, floorSize / 2),
    world.createRigidBody(floorBodyDesc)
  );
  console.log("Физический пол создан на сервере.");

  const seededRandom = createSeededRandom(12345);
  for (let i = 0; i < 15; i++) {
    const pos = {
      x: (seededRandom() - 0.5) * 1800,
      y: 25,
      z: (seededRandom() - 0.5) * 1800,
    };
    const boxBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      pos.x,
      pos.y,
      pos.z
    );
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(25, 25, 25),
      world.createRigidBody(boxBodyDesc)
    );
  }
  console.log("Физические ящики созданы на сервере.");

  // Настройка WebSocket сервера
  const players = new Map<string, Player>();
  const wss = new WebSocketServer({ port: 8085, host: "0.0.0.0" });

  wss.on("connection", (ws) => {
    const playerId = Math.random().toString(36).substr(2, 9);
    console.log(`Игрок ${playerId} подключился.`);
    ws.send(JSON.stringify({ type: "your_id", id: playerId }));

    const playerHeight = 30;
    const playerRadius = 5;
    const playerBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(0, playerHeight, 0)
      .setCanSleep(false)
      .setLinearDamping(0.5);
    const playerRigidBody = world.createRigidBody(playerBodyDesc);
    world.createCollider(
      RAPIER.ColliderDesc.capsule(playerHeight / 2, playerRadius),
      playerRigidBody
    );

    const player: Player = {
      id: playerId,
      socket: ws,
      rigidBody: playerRigidBody,
      hp: 100,
      inventory: ["thompson", "knife"],
      currentWeapon: "thompson",
      input: {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        run: false,
        yaw: 0,
        pitch: 0,
        moveVector: { x: 0, z: 0 },
      },
    };
    players.set(playerId, player);

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        const player = players.get(playerId);
        if (!player) return;

        if (data.type === "shoot") {
          const shooter = players.get(playerId);
          if (!shooter) return;

          if (shooter.currentWeapon !== "thompson") {
            return 
          }

          const yaw = data.yaw;
          const pitch = data.pitch;
          const direction = new RAPIER.Vector3(
            -Math.sin(yaw) * Math.cos(pitch),
            -Math.sin(pitch),
            -Math.cos(yaw) * Math.cos(pitch)
          );

          const normalizedDirection = normalizeVector3(direction);

          const shooterPos = shooter.rigidBody.translation();
          const rayOrigin = new RAPIER.Vector3(
            shooterPos.x,
            shooterPos.y + 12.0,
            shooterPos.z
          );

          const ray = new RAPIER.Ray(rayOrigin, normalizedDirection);
          const maxDistance = 2000;

          const hit = world.castRay(
            ray,
            maxDistance,
            true,
            undefined,
            undefined,
            shooter.rigidBody.collider(0)
          );

          if (hit) {
            const hitBody = hit.collider.parent();
            if (hitBody) {
              for (const [targetId, targetPlayer] of players.entries()) {
                if (
                  targetId !== playerId &&
                  targetPlayer.rigidBody.handle === hitBody.handle
                ) {
                  targetPlayer.hp -= 25;
                  console.log(
                    `Игрок ${playerId} попал в ${targetId}. У ${targetId} осталось ${targetPlayer.hp} HP.`
                  );

                  if (targetPlayer.hp <= 0) {
                    console.log(`Игрок ${targetId} убит.`);
                    targetPlayer.hp = 100;
                    targetPlayer.rigidBody.setTranslation(
                      { x: 0, y: 30, z: 0 },
                      true
                    );
                    targetPlayer.rigidBody.setLinvel(
                      { x: 0, y: 0, z: 0 },
                      true
                    );
                  }
                  break;
                }
              }
            }
          }

          const shootEvent = JSON.stringify({
            type: "player_shot",
            shooterId: playerId,
          });
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(shootEvent);
            }
          });
        } else if (data.type === "switch_weapon") {
          const requestedWeapon = data.weapon;
          if (player.inventory.includes(requestedWeapon)) {
            player.currentWeapon = requestedWeapon;
            console.log(
              `Игрок ${playerId} сменил оружие на ${requestedWeapon}`
            );
          }
        } else {
          player.input = { ...player.input, ...data };
        }
      } catch (e) {}
    });

    ws.on("close", () => {
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

    players.forEach((player) => {
      updatePlayerMovement(player, RAPIER, world);
    });

    const gameState = Array.from(players.values()).map((p) => ({
      id: p.id,
      position: p.rigidBody.translation(),
      rotation: p.rigidBody.rotation(),
      hp: p.hp,
      currentWeapon: p.currentWeapon,
    }));

    if (gameState.length > 0) {
      const stateString = JSON.stringify({
        type: "gameState",
        payload: gameState,
      });
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(stateString);
        }
      });
    }
  }, 1000 / 60);
}



// Запускаем сервер
main().catch((error) => {
  console.error("Произошла критическая ошибка при запуске сервера:", error);
});
