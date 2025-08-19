
export let myPlayerId: string | null = null;


export function getMyPlayerState(gameState: any[]) {
    if (!myPlayerId) return null;
    return gameState.find(p => p.id === myPlayerId);
}
