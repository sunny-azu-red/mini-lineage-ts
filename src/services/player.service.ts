import { PlayerState, Hero } from '../common/types';
import { HEROES } from '../common/data';

export function initializePlayer(player: PlayerState, hero: Hero): void {
    player.heroId = hero.id;
    player.health = hero.startHealth;
    player.adena = hero.startAdena;
    player.experience = 0;
    player.weaponId = 0;
    player.armorId = 0;
    player.welcomed = false;
}

export function deductCost(player: PlayerState, cost: number): boolean {
    if (player.adena < cost)
        return false;

    player.adena -= cost;
    return true;
}

export function restoreHealth(player: PlayerState, amount: number): void {
    const maxHp = HEROES[player.heroId].startHealth;
    player.health = Math.min(maxHp, player.health + amount);
}

export function applyBattleResult(player: PlayerState, hpLost: number, expGained: number, adenaGained: number): void {
    player.health -= hpLost;
    player.experience += expGained;
    player.adena += adenaGained;

    if (player.health <= 0)
        player.dead = true;
    // player.health = 100; // DEBUG: never die
}
