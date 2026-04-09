import { describe, it, expect } from 'vitest';
import { ShopWeaponSchema, ShopArmorSchema, ShopFoodSchema } from './shop.schema';
import { GameStartSchema } from './game.schema';
import { SuicideSchema, HighscoreNameSchema } from './player.schema';

// ---------------------------------------------------------------------------
// Shop schemas
// ---------------------------------------------------------------------------

describe('ShopWeaponSchema', () => {
    it('accepts a valid weapon id', () => {
        const result = ShopWeaponSchema.safeParse({ select_weapon: '1' });
        expect(result.success).toBe(true);
        if (result.success) expect(result.data.select_weapon).toBe(1);
    });
    it('rejects id 0 (unsellable fists)', () => {
        expect(ShopWeaponSchema.safeParse({ select_weapon: '0' }).success).toBe(false);
    });
    it('rejects a non-numeric string', () => {
        expect(ShopWeaponSchema.safeParse({ select_weapon: 'abc' }).success).toBe(false);
    });
    it('rejects an out-of-range id', () => {
        expect(ShopWeaponSchema.safeParse({ select_weapon: '999' }).success).toBe(false);
    });
});

describe('ShopArmorSchema', () => {
    it('accepts a valid armor id', () => {
        const result = ShopArmorSchema.safeParse({ select_armor: '2' });
        expect(result.success).toBe(true);
    });
    it('rejects id 0 (unsellable tunic)', () => {
        expect(ShopArmorSchema.safeParse({ select_armor: '0' }).success).toBe(false);
    });
    it('rejects an out-of-range id', () => {
        expect(ShopArmorSchema.safeParse({ select_armor: '99' }).success).toBe(false);
    });
});

describe('ShopFoodSchema', () => {
    it('accepts id 0 (food is sellable from first item)', () => {
        expect(ShopFoodSchema.safeParse({ select_food: '0' }).success).toBe(true);
    });
    it('rejects an out-of-range id', () => {
        expect(ShopFoodSchema.safeParse({ select_food: '99' }).success).toBe(false);
    });
});

describe('GameStartSchema', () => {
    it('accepts all 4 valid race ids', () => {
        for (const id of [0, 1, 2, 3]) {
            expect(GameStartSchema.safeParse({ select_race: String(id) }).success).toBe(true);
        }
    });
    it('rejects race id 4 (out of range)', () => {
        expect(GameStartSchema.safeParse({ select_race: '4' }).success).toBe(false);
    });
    it('accepts a name within 20 chars', () => {
        const result = GameStartSchema.safeParse({ select_race: '0', name: 'Hero' });
        expect(result.success).toBe(true);
        if (result.success) expect(result.data.name).toBe('Hero');
    });
    it('rejects a name exceeding 20 chars', () => {
        expect(GameStartSchema.safeParse({ select_race: '0', name: 'a'.repeat(21) }).success).toBe(false);
    });
    it('coerces missing name to null', () => {
        const result = GameStartSchema.safeParse({ select_race: '0' });
        expect(result.success).toBe(true);
        if (result.success) expect(result.data.name).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// Player schemas
// ---------------------------------------------------------------------------

describe('SuicideSchema', () => {
    it('accepts "yes"', () => expect(SuicideSchema.safeParse({ suicide: 'yes' }).success).toBe(true));
    it('accepts "no"', () => expect(SuicideSchema.safeParse({ suicide: 'no' }).success).toBe(true));
    it('rejects any other string', () => {
        expect(SuicideSchema.safeParse({ suicide: 'maybe' }).success).toBe(false);
        expect(SuicideSchema.safeParse({ suicide: '' }).success).toBe(false);
    });
});

describe('HighscoreNameSchema', () => {
    it('accepts a name within 32 chars', () => {
        const result = HighscoreNameSchema.safeParse({ name: 'Warrior' });
        expect(result.success).toBe(true);
    });
    it('accepts exactly 32 chars', () => {
        const result = HighscoreNameSchema.safeParse({ name: 'a'.repeat(32) });
        expect(result.success).toBe(true);
    });
    it('rejects a name exceeding 32 chars', () => {
        expect(HighscoreNameSchema.safeParse({ name: 'a'.repeat(33) }).success).toBe(false);
    });
    it('coerces empty string to null', () => {
        const result = HighscoreNameSchema.safeParse({ name: '' });
        expect(result.success).toBe(true);
        if (result.success) expect(result.data.name).toBeNull();
    });
    it('coerces missing name to null', () => {
        const result = HighscoreNameSchema.safeParse({});
        expect(result.success).toBe(true);
        if (result.success) expect(result.data.name).toBeNull();
    });
});
