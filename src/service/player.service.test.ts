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
} from './player.service';
import { gameStatsRepository } from '@/repository/game-stats.repository';

vi.mock('@/repository/game-stats.repository', () => ({
    gameStatsRepository: {
        increment: vi.fn().mockResolvedValue(undefined),
        getAll: vi.fn(),
    },
}));

const makePlayer = (overrides: Partial<PlayerState> = {}): PlayerState => ({
    raceId: 0, // Human — startHealth: 100
    health: 100,
    adena: 500,
    experience: 0,
    weaponId: 0,
    armorId: 0,
    totalBattles: 0,
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
        expect(flash.type).toBe('info');
        expect(flash.text).toContain('Human');
        // Verify repository increment for new players
        expect(gameStatsRepository.increment).toHaveBeenCalledWith('total_players');
    });

    it('handles null name correctly', () => {
        const p = {} as any;
        initializePlayer(p, RACES[0], null);
        expect(p.name).toBeNull();
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
    it('sets health to 0 and dead to true', () => {
        const p = makePlayer({ health: 75 });
        killPlayer(p);
        expect(p.health).toBe(0);
        expect(p.dead).toBe(true);
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
    it('restores partial HP', () => {
        const p = makePlayer({ raceId: 0, health: 50 });
        restoreHealth(p, 20);
        expect(p.health).toBe(70);
    });
    it('clamps to maxHp — no over-healing', () => {
        const p = makePlayer({ raceId: 0, health: 90 });
        restoreHealth(p, 999);
        expect(p.health).toBe(RACES[0].startHealth); // 100
    });
});

describe('purchaseItem — weapon', () => {
    it('deducts cost and updates weaponId on success', () => {
        const p = makePlayer({ adena: 1000, weaponId: 0 });
        const result = purchaseItem(p, ItemType.Weapon, 1); // Elven Needle costs 300
        expect(result?.success).toBe(true);
        expect(p.weaponId).toBe(1);
        expect(p.adena).toBe(700);
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

describe('purchaseItem — food', () => {
    it('heals the player on purchase', () => {
        const p = makePlayer({ adena: 100, health: 50, raceId: 0 });
        const result = purchaseItem(p, ItemType.Food, 0); // Spiced Ale: stat 4, cost 7
        expect(result?.success).toBe(true);
        expect(p.health).toBe(54);
        expect(p.adena).toBe(93);
    });
});

describe('applyBattleResult', () => {
    it('kills the player on lethal damage', () => {
        const p = makePlayer({ health: 5 });
        const flash = applyBattleResult(p, 10, 100, 50, 3);
        expect(p.dead).toBe(true);
        expect(p.health).toBe(0);
        expect(flash).toBeNull();
    });
    it('returns a level-up flash and restores hp on level-up', () => {
        const p = makePlayer({ health: 90, experience: 0, raceId: 0 });
        // Level 2 threshold is calculateXpForLevel(2) = 780
        const flash = applyBattleResult(p, 0, 780, 0, 0);
        expect(flash).not.toBeNull();
        expect(flash?.type).toBe('warning');
        expect(p.health).toBe(RACES[0].startHealth); // full HP on level up
    });
    it('returns null flash and updates stats on normal battle', () => {
        const p = makePlayer({ health: 80, adena: 100, experience: 0 });
        const flash = applyBattleResult(p, 10, 50, 25, 5);
        expect(flash).toBeNull();
        expect(p.health).toBe(70);
        expect(p.adena).toBe(125);
        expect(p.experience).toBe(50);
        expect(p.totalBattles).toBe(1);
        expect(p.totalEnemiesKilled).toBe(5);
    });

    it('increments global stats during battle', () => {
        const p = makePlayer({ health: 100 });
        applyBattleResult(p, 10, 50, 25, 5);

        expect(gameStatsRepository.increment).toHaveBeenCalledWith('total_battles');
        expect(gameStatsRepository.increment).toHaveBeenCalledWith('total_enemies_killed', 5);
        expect(gameStatsRepository.increment).toHaveBeenCalledWith('total_adena_generated', 25);
    });

    it('increments total_deaths when player dies', () => {
        const p = makePlayer({ health: 5 });
        applyBattleResult(p, 10, 0, 0, 0);
        expect(gameStatsRepository.increment).toHaveBeenCalledWith('total_deaths');
    });
});
