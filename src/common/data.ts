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
    { id: 0, name: 'Regular Clothes', emoji: '👕', stat: 2, cost: 0 },
    { id: 1, name: 'Leather Armor', emoji: '🥋', stat: 10, cost: 500 },
    { id: 2, name: 'Wooden Armor', emoji: '🪵', stat: 22, cost: 8_000 },
    { id: 3, name: 'Plate Armor', emoji: '🛡️', stat: 41, cost: 30_000 },
    { id: 4, name: 'Steel Armor', emoji: '⚙️', stat: 64, cost: 140_000 },
    { id: 5, name: 'Mithril Alloy Armor', emoji: '✨', stat: 88, cost: 400_000 },
];

export const WEAPONS: Item[] = [
    { id: 0, name: 'Fists', emoji: '👊', stat: 7, cost: 0 },
    { id: 1, name: 'Elven Sword', emoji: '🗡️', stat: 16, cost: 300 },
    { id: 2, name: 'Stormbringer', emoji: '⚡', stat: 28, cost: 5_000 },
    { id: 3, name: 'Swords of Valhalla', emoji: '⚔️', stat: 45, cost: 18_000 },
    { id: 4, name: 'Elemental Sword', emoji: '🔥', stat: 62, cost: 160_000 },
    { id: 5, name: 'The Forgotten Blade', emoji: '💀', stat: 90, cost: 600_000 },
];

export const FOODS: Item[] = [
    { id: 0, name: 'Juice', emoji: '🥤', stat: 4, cost: 8 },
    { id: 1, name: 'Apple', emoji: '🍎', stat: 6, cost: 11 },
    { id: 2, name: 'Hotdog', emoji: '🌭', stat: 15, cost: 30 },
    { id: 3, name: 'Mash Potatos', emoji: '🥔', stat: 25, cost: 80 },
    { id: 4, name: 'Turkey', emoji: '🍗', stat: 50, cost: 180 },
];
