import { PlayerState, Race, FlashMessage, PurchaseResult, ItemType } from '@/interface';
import { RACES, ARMORS, WEAPONS, FOODS } from '@/constant/game.constant';
import { calculateLevel, isLevelUp, randomInt } from '@/service/math.service';
import { formatAdena, randomElement, fillTemplate } from '@/util';
import { WELCOME_MESSAGES } from '@/constant/narratives.constant';
import { statisticsRepository } from '@/repository/statistics.repository';

export function isGameStarted(player: PlayerState): boolean {
    return player.raceId !== undefined && player.health !== undefined && player.adena !== undefined;
}

export function initializePlayer(player: PlayerState, race: Race, name: string): FlashMessage {
    player.raceId = race.id;
    player.name = name;
    player.health = race.startHealth;
    player.prevHealth = 0;
    player.adena = race.startAdena;
    player.prevAdena = 0;
    player.experience = 0;
    player.prevExperience = 0;
    player.weaponId = 0;
    player.armorId = 0;
    player.totalBattles = 0;
    player.totalAmbushes = 0;
    player.totalEnemiesKilled = 0;

    void statisticsRepository.increment('total_players');
    void statisticsRepository.increment('total_adena', player.adena);

    const builds = ['a slim', 'a lean', 'an average', 'a fit', 'a stocky', 'a broad', 'a round'];
    const build = randomElement(builds);
    const age = randomInt(9, 69);
    const definition = age <= 23 ? 'youth' : (age <= 54 ? 'adult' : 'elder');
    const welcome = fillTemplate(randomElement(WELCOME_MESSAGES), { raceLabel: race.label });

    const text = `You have selected to be ${race.emoji} ${race.label}, ${welcome}\n` +
        `You are ${build} ${definition}, aged ${age}, and you came here with ${formatAdena(player.adena)} Adena.`;

    return { text, type: 'info' };
}

export function killPlayer(player: PlayerState): void {
    player.health = 0;
    player.dead = true;

    void statisticsRepository.increment('total_deaths');
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

export function restoreHealth(player: PlayerState, amount: number): number {
    const maxHp = RACES[player.raceId].startHealth;
    const oldHealth = player.health;
    player.health = Math.min(maxHp, player.health + amount);
    return player.health - oldHealth;
}

export function applyBattleResult(player: PlayerState, hpLost: number, xpGained: number, adenaGained: number, enemiesKilled: number, damageBlocked: number): FlashMessage | null {
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
    player.totalBattles = (player.totalBattles ?? 0) + 1;
    player.totalEnemiesKilled = (player.totalEnemiesKilled ?? 0) + enemiesKilled;

    void statisticsRepository.increment('total_battles');
    void statisticsRepository.increment('total_enemies_killed', enemiesKilled);
    void statisticsRepository.increment('total_adena_generated', adenaGained);
    void statisticsRepository.increment('total_adena', adenaGained);
    void statisticsRepository.increment('total_hp_lost', hpLost);
    void statisticsRepository.increment('total_xp_gained', xpGained);
    void statisticsRepository.increment('total_damage_blocked', damageBlocked);

    if (isLevelUp(oldXp, player.experience)) {
        const newLevel = calculateLevel(player.experience);
        const hpHealed = restoreHealth(player, RACES[player.raceId].startHealth);
        void statisticsRepository.increment('total_levels_gained');
        void statisticsRepository.increment('total_hp_healed', hpHealed);
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
        void statisticsRepository.increment('total_weapons_bought');
        void statisticsRepository.increment('total_adena_spent', item.cost);
        return { success: true, text: `You have bought a Weapon.\nYou are now wielding the swift ${item.emoji} ${item.name}!`, item };
    } else if (itemType === ItemType.Armor) {
        player.armorId = itemId;
        void statisticsRepository.increment('total_armors_bought');
        void statisticsRepository.increment('total_adena_spent', item.cost);
        return { success: true, text: `You have bought an Armor.\nYou are now wearing the mighty ${item.emoji} ${item.name}!`, item };
    } else {
        const hpHealed = restoreHealth(player, item.stat);
        void statisticsRepository.increment('total_food_bought');
        void statisticsRepository.increment('total_adena_spent', item.cost);
        void statisticsRepository.increment('total_hp_healed', hpHealed);
        return { success: true, text: `You have bought ${item.emoji} ${item.name}.\nYou feel your strength returning, bringing you to ${player.health} HP.`, item };
    }
}
