import * as THREE from "three";
import {
  myPlayerId,
  lastKnownWeapon,
  playerMeshes,
  setMyPlayerId,
  setLastKnownWeapon,
<<<<<<< HEAD
} from "@shared/network/network";
import { updateOtherPlayers } from "./playersync";
import { updateHpDisplay } from "../../utils/hud";
import { switchActiveWeapon } from "@shared/weapons/weapons";
=======
} from "../../network";
import { updateOtherPlayers } from "./playersync";
import { updateHpDisplay } from "../../utils/hud";
import { switchActiveWeapon } from "../../render-server/weapons/weapons";
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a
import { makeParticles } from "../../utils/particles";

export function attemptConnection(
  scene: THREE.Scene,
  shotSound: HTMLAudioElement,
  raycaster: THREE.Raycaster,
  worldGroup: THREE.Group,
  camera: THREE.Camera,
  onConnect: (myId: string, socket: WebSocket) => void
) {
  const ws = new WebSocket("ws://127.0.0.1:8085");

  ws.onopen = () => {
    console.log("Подключено к WebSocket серверу!");
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      if (message.type === "your_id" && !myPlayerId) {
<<<<<<< HEAD
        setMyPlayerId(message.id);
=======
        setMyPlayerId(message.id); 
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a
        onConnect(myPlayerId!, ws);
      }

      if (message.type === "gameState") {
        const gameStatePayload = message.payload;
        updateOtherPlayers(gameStatePayload, scene);

        const myPlayerData = gameStatePayload.find(
          (p: any) => p.id === myPlayerId
        );

        if (myPlayerData) {
          updateHpDisplay(myPlayerData.hp);
<<<<<<< HEAD

          if (myPlayerData.currentWeapon !== lastKnownWeapon) {
            switchActiveWeapon(myPlayerData.currentWeapon);

            setLastKnownWeapon(myPlayerData.currentWeapon);

=======
          if (myPlayerData.currentWeapon !== lastKnownWeapon) {
            switchActiveWeapon(myPlayerData.currentWeapon);
            setLastKnownWeapon(myPlayerData.currentWeapon); 
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a
            console.log(
              `Визуально переключился на ${myPlayerData.currentWeapon}`
            );
          }
        }

        if ((window as any).updateMyPlayer) {
          (window as any).updateMyPlayer(gameStatePayload);
        }
      }

      if (message.type === "player_shot") {
        shotSound.currentTime = 0;
        shotSound.play();

        if (message.shooterId === myPlayerId) {
          const mouseCoords = new THREE.Vector2(0, 0);
          raycaster.setFromCamera(mouseCoords, camera);
          const intersects = raycaster.intersectObjects(
            worldGroup.children,
            true
          );
          if (intersects.length > 0) {
            makeParticles(intersects[0].point, scene);
          }
        }
      }
    } catch (e) {
      console.error("Ошибка обработки сообщения от сервера:", e);
    }
  };

  ws.onerror = (err) => {
    console.error("Ошибка WebSocket:", err);
  };

  ws.onclose = () => {
    if (!myPlayerId) {
      console.log(
        "Не удалось подключиться. Повторная попытка через 2 секунды..."
      );
      setTimeout(() => {
        attemptConnection(
          scene,
          shotSound,
          raycaster,
          worldGroup,
          camera,
          onConnect
        );
      }, 2000);
    } else {
      console.log("Отключено от сервера. Попытка переподключения...");
<<<<<<< HEAD
      setMyPlayerId(null);
=======
      setMyPlayerId(null); 
>>>>>>> 41ec7bc36048c123436d8ca35fba12238008560a
      setLastKnownWeapon(null);
      playerMeshes.forEach((mesh) => scene.remove(mesh));
      playerMeshes.clear();
      setTimeout(() => {
        attemptConnection(
          scene,
          shotSound,
          raycaster,
          worldGroup,
          camera,
          onConnect
        );
      }, 2000);
    }
  };
}
