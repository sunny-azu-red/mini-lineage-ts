import { PlayerState, Race, FlashMessage, PurchaseResult, ItemType } from '@/interface';
import { RACES, ARMORS, WEAPONS, FOODS } from '@/constant/game.constant';
import { calculateLevel, isLevelUp, randomInt } from '@/service/math.service';
import { formatAdena, randomElement, fillTemplate } from '@/util';
import { WELCOME_MESSAGES } from '@/constant/narratives.constant';

export function isGameStarted(player: PlayerState): boolean {
    return player.raceId !== undefined && player.health !== undefined && player.adena !== undefined;
}

export function initializePlayer(player: PlayerState, race: Race): FlashMessage {
    player.raceId = race.id;
    player.health = race.startHealth;
    player.prevHealth = 0;
    player.adena = race.startAdena;
    player.prevAdena = 0;
    player.experience = 0;
    player.prevExperience = 0;
    player.weaponId = 0;
    player.armorId = 0;

    const builds = ['a slim', 'a lean', 'an average', 'a fit', 'a stocky', 'a broad', 'a round'];
    const build = randomElement(builds);
    const age = randomInt(9, 69);
    const definition = age <= 23 ? 'youth' : (age <= 54 ? 'adult' : 'elder');
    const welcome = fillTemplate(randomElement(WELCOME_MESSAGES), { raceLabel: race.label });

    const text = `You have selected to be ${race.emoji} ${race.label}, ${welcome}<br>` +
        `You are ${build} ${definition}, aged ${age}, and you came here with ${formatAdena(player.adena)} Adena.`;

    return { text, type: 'info' };
}

export function killPlayer(player: PlayerState): void {
    player.health = 0;
    player.dead = true;
}

export function commitSuicide(player: PlayerState): void {
    killPlayer(player);
    player.coward = true;
}

export function deductCost(player: PlayerState, cost: number): boolean {
    if (player.adena < cost)
        return false;

    player.adena -= cost;
    return true;
}

export function restoreHealth(player: PlayerState, amount: number): void {
    const maxHp = RACES[player.raceId].startHealth;
    player.health = Math.min(maxHp, player.health + amount);
}

export function applyBattleResult(player: PlayerState, hpLost: number, xpGained: number, adenaGained: number): FlashMessage | null {
    // hpLost = 0; // DEBUG: never die
    // xpGained = xpGained * 250; // DEBUG: level up faster
    // adenaGained = adenaGained * 500; // DEBUG: get adena faster

    player.health -= hpLost;
    if (player.health <= 0) {
        killPlayer(player);
        return null;
    }

    player.adena += adenaGained;
    const oldXp = player.experience;
    player.experience += xpGained;

    if (isLevelUp(oldXp, player.experience)) {
        const newLevel = calculateLevel(player.experience);
        player.health = RACES[player.raceId].startHealth;
        return { text: `🎉 Congratulations! You have reached level ${newLevel}.`, type: 'warning' };
    }

    return null;
}

export function purchaseItem(player: PlayerState, itemType: ItemType, itemId: number): PurchaseResult | null {
    const item = itemType === ItemType.Weapon ? WEAPONS[itemId] : (itemType === ItemType.Armor ? ARMORS[itemId] : FOODS[itemId]);
    if (!item)
        return null;

    if (itemType === ItemType.Weapon && player.weaponId === itemId)
        return { success: false, text: `Sorry, you already own the ${item.emoji} ${item.name}.`, item };
    if (itemType === ItemType.Armor && player.armorId === itemId)
        return { success: false, text: `Sorry, you already own the ${item.emoji} ${item.name}.`, item };

    if (!deductCost(player, item.cost))
        return { success: false, text: 'Sorry, you need more 🪙 Adena.' };

    if (itemType === ItemType.Weapon) {
        player.weaponId = itemId;
        return { success: true, text: `You have bought a Weapon.\nYou are now wielding the swift ${item.emoji} ${item.name}!`, item };
    } else if (itemType === ItemType.Armor) {
        player.armorId = itemId;
        return { success: true, text: `You have bought an Armor.\nYou are now wearing the mighty ${item.emoji} ${item.name}!`, item };
    } else {
        restoreHealth(player, item.stat);
        return { success: true, text: `You have bought ${item.emoji} ${item.name}.\nYou feel your strength returning, bringing you to ${player.health} HP.`, item };
    }
}
