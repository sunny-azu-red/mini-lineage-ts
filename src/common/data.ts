import { Item } from './types';

/**
 * Item Data Configurations
 * 
 * Game combat math (HP lost, Orcs killed, XP and Adena gained) scales 
 * dynamically based solely on the `stat` property of the equipped Weapon and Armor.
 * 
 * You can seamlessly add new Items to the end of these arrays without breaking 
 * the game engine, provided the `stat` roughly follows the established scaling curve.
 */
export const ARMORS: Item[] = [
    { id: 0, name: 'Regular Clothes', stat: 2, cost: 0 },
    { id: 1, name: 'Leather Armor', stat: 10, cost: 500 },
    { id: 2, name: 'Wooden Armor', stat: 22, cost: 8_000 },
    { id: 3, name: 'Plate Armor', stat: 41, cost: 30_000 },
    { id: 4, name: 'Steel Armor', stat: 64, cost: 140_000 },
    { id: 5, name: 'Mithril Alloy Armor', stat: 88, cost: 400_000 },
];

export const WEAPONS: Item[] = [
    { id: 0, name: 'Fists', stat: 7, cost: 0 },
    { id: 1, name: 'Elven Sword', stat: 16, cost: 300 },
    { id: 2, name: 'Stormbringer', stat: 28, cost: 5_000 },
    { id: 3, name: 'Sword Of Valhalla', stat: 45, cost: 18_000 },
    { id: 4, name: 'Elemental Sword', stat: 62, cost: 160_000 },
    { id: 5, name: 'The Forgotten Blade', stat: 90, cost: 600_000 },
];

export const FOODS: Item[] = [
    { id: 0, name: 'Juice', stat: 4, cost: 8 },
    { id: 1, name: 'Apple', stat: 6, cost: 11 },
    { id: 2, name: 'Hotdog', stat: 15, cost: 30 },
    { id: 3, name: 'Mash Potatos', stat: 25, cost: 80 },
    { id: 4, name: 'Turkey', stat: 50, cost: 180 },
];
