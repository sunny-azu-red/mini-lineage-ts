import { z } from 'zod';
import { WEAPONS, ARMORS, FOODS } from '@/constant/game.constant';
import { itemIdSchema } from './common.schema';

const WEAPON_IDS = WEAPONS.slice(1).map(w => w.id); // don't allow fists
const ARMOR_IDS = ARMORS.slice(1).map(a => a.id); // don't allow tunic
const FOOD_IDS = FOODS.map(f => f.id);

export const ShopWeaponSchema = z.object({
    select_weapon: itemIdSchema(WEAPON_IDS),
});

export const ShopArmorSchema = z.object({
    select_armor: itemIdSchema(ARMOR_IDS),
});

export const ShopFoodSchema = z.object({
    select_food: itemIdSchema(FOOD_IDS),
});
