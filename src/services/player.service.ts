import { PlayerState } from '../common/types';

export function deductCost(player: PlayerState, cost: number): boolean {
    if (player.adena < cost)
        return false;

    player.adena -= cost;
    return true;
}

export function restoreHealth(player: PlayerState, amount: number): void {
    player.health = Math.min(100, player.health + amount);
}

export function applyBattleResult(player: PlayerState, hpLost: number, expGained: number, adenaGained: number): void {
    player.health -= hpLost;
    player.experience += expGained;
    player.adena += adenaGained;

    if (player.health <= 0)
        player.dead = true;
}
