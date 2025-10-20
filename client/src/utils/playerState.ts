import { myPlayerId } from "../../../shared/network/network";

export function getMyPlayerState(gameState: any[]) {
  if (!myPlayerId) return null;
  return gameState.find((p) => p.id === myPlayerId);
}
