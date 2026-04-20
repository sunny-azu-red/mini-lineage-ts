import { describe, it, expect, vi } from 'vitest';
import { ItemType, PlayerState } from '@/interface';
import { RACES } from '@/constant/game.constant';
import {
    isGameStarted,
    initializePlayer,
    deductCost,
    killPlayer,
    commitSuicide,
    restoreHealth,
    purchaseItem,
    applyBattleResult,
    processTick,
} from './player.service';
import { statisticsRepository } from '@/repository/statistics.repository';

vi.mock('@/repository/statistics.repository', () => ({
    statisticsRepository: {
        increment: vi.fn().mockResolvedValue(undefined),
        getAll: vi.fn(),
    },
}));

const makePlayer = (overrides: Partial<PlayerState> = {}): PlayerState => ({
    name: 'Test Hero',
    raceId: 0, // Human — startHealth: 100
    health: 100,
    adena: 500,
    experience: 0,
    weaponId: 0,
    armorId: 0,
    totalBattles: 0,
    totalAmbushes: 0,
    totalEnemiesKilled: 0,
    ...overrides,
} as PlayerState);

describe('isGameStarted', () => {
    it('returns true for a fully initialized player', () => expect(isGameStarted(makePlayer())).toBe(true));
    it('returns false when raceId is missing', () => expect(isGameStarted({} as PlayerState)).toBe(false));
});

describe('initializePlayer', () => {
    it('populates player state and returns an info flash message', () => {
        const p = {} as any;
        const race = RACES[0]; // Human
        const flash = initializePlayer(p, race, 'Arthur');

        expect(p.name).toBe('Arthur');
        expect(p.health).toBe(race.startHealth);
        expect(p.adena).toBe(race.startAdena);
        expect(p.experience).toBe(0);
        expect(p.totalAmbushes).toBe(0);
        expect(flash.type).toBe('info');
        expect(flash.text).toContain('Human');
        // Verify repository increment for new players
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_players');
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_adena', race.startAdena);
    });

    it('stores the provided name', () => {
        const p = {} as any;
        initializePlayer(p, RACES[0], 'Merlin');
        expect(p.name).toBe('Merlin');
    });
});

describe('deductCost', () => {
    it('deducts adena and returns true when affordable', () => {
        const p = makePlayer({ adena: 100 });
        expect(deductCost(p, 50)).toBe(true);
        expect(p.adena).toBe(50);
    });
    it('deducts nothing and returns false when not affordable', () => {
        const p = makePlayer({ adena: 10 });
        expect(deductCost(p, 50)).toBe(false);
        expect(p.adena).toBe(10);
    });
    it('succeeds when player has exact amount, leaving 0 adena', () => {
        const p = makePlayer({ adena: 50 });
        expect(deductCost(p, 50)).toBe(true);
        expect(p.adena).toBe(0);
    });
});

describe('killPlayer', () => {
    it('sets health to 0 and dead to true and increments total_deaths', () => {
        const p = makePlayer({ health: 75 });
        killPlayer(p);
        expect(p.health).toBe(0);
        expect(p.dead).toBe(true);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_deaths');
    });
});

describe('commitSuicide', () => {
    it('kills the player and marks them as a coward', () => {
        const p = makePlayer({ health: 100 });
        commitSuicide(p);
        expect(p.health).toBe(0);
        expect(p.dead).toBe(true);
        expect(p.coward).toBe(true);
    });
});

describe('restoreHealth', () => {
    it('restores partial HP and returns amount healed', () => {
        const p = makePlayer({ raceId: 0, health: 50 });
        const healed = restoreHealth(p, 20);
        expect(p.health).toBe(70);
        expect(healed).toBe(20);
    });
    it('clamps to maxHp — no over-healing — and returns clamped amount', () => {
        const p = makePlayer({ raceId: 0, health: 90 });
        const healed = restoreHealth(p, 999);
        expect(p.health).toBe(RACES[0].startHealth); // 100
        expect(healed).toBe(10);
    });
    it('returns 0 when already at full health', () => {
        const p = makePlayer({ raceId: 0, health: RACES[0].startHealth });
        const healed = restoreHealth(p, 20);
        expect(healed).toBe(0);
    });
});

describe('purchaseItem — weapon', () => {
    it('deducts cost and updates weaponId on success', () => {
        const p = makePlayer({ adena: 1000, weaponId: 0 });
        const result = purchaseItem(p, ItemType.Weapon, 1); // Elven Needle costs 300
        expect(result?.success).toBe(true);
        expect(p.weaponId).toBe(1);
        expect(p.adena).toBe(700);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_weapons_bought');
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_adena_spent', 300);
    });
    it('fails when adena is insufficient', () => {
        const p = makePlayer({ adena: 10, weaponId: 0 });
        const result = purchaseItem(p, ItemType.Weapon, 1);
        expect(result?.success).toBe(false);
        expect(p.adena).toBe(10);
        expect(p.weaponId).toBe(0);
    });
    it('fails when already owning the item', () => {
        const p = makePlayer({ adena: 1000, weaponId: 1 });
        const result = purchaseItem(p, ItemType.Weapon, 1);
        expect(result?.success).toBe(false);
        expect(p.adena).toBe(1000); // no deduction
    });
});

describe('purchaseItem — armor', () => {
    it('deducts cost and updates armorId and increments stats', () => {
        const p = makePlayer({ adena: 1000, armorId: 0 });
        const result = purchaseItem(p, ItemType.Armor, 1); // Brigandine Leathers costs 500
        expect(result?.success).toBe(true);
        expect(p.armorId).toBe(1);
        expect(p.adena).toBe(500);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_armors_bought');
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_adena_spent', 500);
    });
});
describe('purchaseItem — food', () => {
    it('heals the player on purchase and increments stats', () => {
        const p = makePlayer({ adena: 100, health: 50, raceId: 0 });
        const result = purchaseItem(p, ItemType.Food, 0); // Spiced Ale: stat 4, cost 7
        expect(result?.success).toBe(true);
        expect(p.health).toBe(54);
        expect(p.adena).toBe(93);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_food_bought');
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_adena_spent', 7);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_hp_healed', 4);
    });
});

describe('applyBattleResult', () => {
    it('kills the player on lethal damage', () => {
        const p = makePlayer({ health: 5 });
        const flash = applyBattleResult(p, 10, 100, 50, 3, 2);
        expect(p.dead).toBe(true);
        expect(p.health).toBe(0);
        expect(flash).toBeNull();
    });
    it('returns a level-up flash and restores hp on level-up', () => {
        const p = makePlayer({ health: 90, experience: 0, raceId: 0 });
        // Level 2 threshold is calculateXpForLevel(2) = 780
        const flash = applyBattleResult(p, 0, 780, 0, 0, 0);
        expect(flash).not.toBeNull();
        expect(flash?.type).toBe('warning');
        expect(p.health).toBe(RACES[0].startHealth); // full HP on level up
    });
    it('increments total_levels_gained and total_hp_healed on level-up', () => {
        const p = makePlayer({ health: 60, experience: 0, raceId: 0 });
        applyBattleResult(p, 0, 780, 0, 0, 0);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_levels_gained');
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_hp_healed', 40); // 100 - 60
    });
    it('returns null flash and updates stats on normal battle', () => {
        const p = makePlayer({ health: 80, adena: 100, experience: 0 });
        const flash = applyBattleResult(p, 10, 50, 25, 5, 3);
        expect(flash).toBeNull();
        expect(p.health).toBe(70);
        expect(p.adena).toBe(125);
        expect(p.experience).toBe(50);
        expect(p.totalBattles).toBe(1);
        expect(p.totalEnemiesKilled).toBe(5);
    });

    it('increments global stats during battle', () => {
        const p = makePlayer({ health: 100 });
        applyBattleResult(p, 10, 50, 25, 5, 7);

        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_battles');
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_enemies_killed', 5);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_adena_generated', 25);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_adena', 25);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_hp_lost', 10);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_xp_gained', 50);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_damage_blocked', 7);
    });

    it('increments total_deaths when player dies', () => {
        const p = makePlayer({ health: 5 });
        applyBattleResult(p, 10, 0, 0, 0, 0);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_deaths');
    });
});

describe('processTick', () => {
    it('heals an Elf (regen 2) with no regen armor by 2 and returns true', () => {
        const p = makePlayer({ raceId: 2, health: 50, armorId: 0 }); // Elf, Peasant's Tunic
        const result = processTick(p);
        expect(result).toBe(true);
        expect(p.health).toBe(52);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_hp_regen', 2);
    });

    it('heals a Human (regen 1) with Knight\'s Plate (regen 1) by 2 total and returns true', () => {
        const p = makePlayer({ raceId: 0, health: 70, armorId: 3 }); // Human, Knight's Plate
        const result = processTick(p);
        expect(result).toBe(true);
        expect(p.health).toBe(72);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_hp_regen', 2);
    });

    it('returns false and does not heal an Orc (regen 0) with no regen armor', () => {
        const p = makePlayer({ raceId: 1, health: 80, armorId: 0 }); // Orc, Peasant's Tunic
        const result = processTick(p);
        expect(result).toBe(false);
        expect(p.health).toBe(80);
    });

    it('returns false when player is already at full HP', () => {
        const p = makePlayer({ raceId: 2, health: 75, armorId: 0 }); // Elf at max HP (75)
        const result = processTick(p);
        expect(result).toBe(false);
        expect(p.health).toBe(75);
    });

    it('returns false when player is dead', () => {
        const p = makePlayer({ raceId: 2, health: 0, dead: true, armorId: 0 });
        const result = processTick(p);
        expect(result).toBe(false);
        expect(p.health).toBe(0);
    });

    it('clamps HP to maxHp and heals only the remainder', () => {
        const p = makePlayer({ raceId: 0, health: 99, armorId: 0 }); // Human max 100, regen 1
        processTick(p);
        expect(p.health).toBe(100);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_hp_regen', 1);
    });

    it('Dark Elf (regen 2) with Eternal Aegis (regen 3) heals for 5 total', () => {
        const p = makePlayer({ raceId: 3, health: 50, armorId: 5 }); // Dark Elf, Eternal Aegis
        processTick(p);
        expect(p.health).toBe(55);
        expect(statisticsRepository.increment).toHaveBeenCalledWith('total_hp_regen', 5);
    });
});
