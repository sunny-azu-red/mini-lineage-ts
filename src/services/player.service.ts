import { PlayerState, Hero, FlashMessage } from '../common/types';
import { HEROES, ARMORS, WEAPONS, FOODS } from '../common/data';
import { calculateLevel } from './math.service';
import { randomInt, formatAdena } from '../common/utils';

export function initializePlayer(player: PlayerState, hero: Hero): FlashMessage {
    player.heroId = hero.id;
    player.health = hero.startHealth;
    player.adena = hero.startAdena;
    player.experience = 0;
    player.weaponId = 0;
    player.armorId = 0;

    const builds = ['a slim', 'a lean', 'an average', 'a fit', 'a stocky', 'a broad', 'a round'];
    const build = builds[randomInt(0, builds.length - 1)];
    const age = randomInt(9, 69);
    const definition = age <= 23 ? 'youth' : (age <= 54 ? 'adult' : 'elder');

    const text = `You have selected to be ${hero.emoji} ${hero.label}. Congratulations!<br>` +
        `You are ${build} ${definition}, aged ${age}, and you came here with ${formatAdena(player.adena)} adena.`;

    return { text, type: 'info' };
}

export function commitSuicide(player: PlayerState): void {
    player.dead = true;
    player.coward = true;
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

export function applyBattleResult(player: PlayerState, hpLost: number, expGained: number, adenaGained: number): FlashMessage | null {
    // hpLost = 0; // DEBUG: never die

    player.health -= hpLost;
    if (player.health <= 0) {
        player.dead = true;
        return null;
    }

    player.adena += adenaGained;

    const oldLevel = calculateLevel(player.experience);
    player.experience += expGained;
    const newLevel = calculateLevel(player.experience);
    if (newLevel > oldLevel) {
        player.health = HEROES[player.heroId].startHealth;
        return { text: `🎉 Congratulations! You have reached level ${newLevel}.`, type: 'warning' };
    }

    return null;
}

export function purchaseItem(player: PlayerState, itemType: 'weapon' | 'armor' | 'food', itemId: number): FlashMessage | null {
    const item = itemType === 'weapon' ? WEAPONS[itemId] : (itemType === 'armor' ? ARMORS[itemId] : FOODS[itemId]);
    if (!item)
        return null;

    if (!deductCost(player, item.cost))
        return { text: 'Sorry, you need more Adena.', type: 'danger' };

    if (itemType === 'weapon') {
        player.weaponId = itemId;
        return { text: `You have bought a Weapon.<br>You are now wielding the swift ${item.name}!`, type: 'success' };
    } else if (itemType === 'armor') {
        player.armorId = itemId;
        return { text: `You have bought an Armor.<br>You are now wearing the mighty ${item.name}!`, type: 'success' };
    } else {
        restoreHealth(player, item.stat);
        return { text: `You have bought Food.<br>Delicious! You feel your strength returning, bringing you to ${player.health} HP.`, type: 'success' };
    }
}
