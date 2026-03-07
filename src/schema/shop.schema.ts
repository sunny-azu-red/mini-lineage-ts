import { z } from 'zod';
import { WEAPONS, ARMORS, FOODS, RACES } from '@/constant/game.constant';

// private helper — only used within this file
const itemIdSchema = (validIds: number[]) =>
    z.string().transform((val, ctx) => {
        const n = parseInt(val, 10);
        if (isNaN(n) || !validIds.includes(n)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid ID' });
            return z.NEVER;
        }
        return n;
    });

const WEAPON_IDS = WEAPONS.slice(1).map(w => w.id); // don't allow fists
const ARMOR_IDS = ARMORS.slice(1).map(a => a.id); // don't allow tunic
const FOOD_IDS = FOODS.map(f => f.id);
const RACE_IDS = RACES.map(r => r.id);

export const ShopWeaponSchema = z.object({
    select_weapon: itemIdSchema(WEAPON_IDS),
});

export const ShopArmorSchema = z.object({
    select_armor: itemIdSchema(ARMOR_IDS),
});

export const ShopFoodSchema = z.object({
    select_food: itemIdSchema(FOOD_IDS),
});

export const GameStartSchema = z.object({
    select_race: itemIdSchema(RACE_IDS),
});
