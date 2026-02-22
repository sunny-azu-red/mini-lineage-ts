import { Item } from './types';

export const WEAPONS: Item[] = [
    { id: 0, name: 'Fists', stat: 7, cost: 0 },
    { id: 1, name: 'Elven Sword', stat: 16, cost: 300 },
    { id: 2, name: 'Stormbringer', stat: 18, cost: 5_000 },
    { id: 3, name: 'Sword Of Valhalla', stat: 32, cost: 18_000 },
    { id: 4, name: 'Elemental Sword', stat: 45, cost: 160_000 },
    { id: 5, name: 'The Forgotten Blade', stat: 85, cost: 3_000_000 },
];

export const ARMORS: Item[] = [
    { id: 0, name: 'Regular Clothes', stat: 2, cost: 0 },
    { id: 1, name: 'Leather Armor', stat: 10, cost: 500 },
    { id: 2, name: 'Wooden Armor', stat: 15, cost: 8_000 },
    { id: 3, name: 'Plate Armor', stat: 29, cost: 30_000 },
    { id: 4, name: 'Steel Armor', stat: 38, cost: 120_000 },
    { id: 5, name: 'Mithril Alloy Armor', stat: 59, cost: 1_500_000 },
];

export const FOODS: Item[] = [
    { id: 0, name: 'Juice', stat: 4, cost: 8 },
    { id: 1, name: 'Apple', stat: 6, cost: 11 },
    { id: 2, name: 'Hotdog', stat: 15, cost: 30 },
    { id: 3, name: 'Mash Potatos', stat: 25, cost: 80 },
    { id: 4, name: 'Turkey', stat: 50, cost: 180 },
];
