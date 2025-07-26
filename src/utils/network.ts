import { myPlayerId } from '../../server/src/network';

export function getMyPlayerState(gameState: any[]) {
    if (!myPlayerId) return null;
    return gameState.find(p => p.id === myPlayerId);
}