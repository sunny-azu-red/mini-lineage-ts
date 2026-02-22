import { Item } from './types';

export const WEAPONS: Record<number, Item> = {
    0: { id: 0, name: 'Fists', stat: 7, cost: 0 },
    1: { id: 1, name: 'Elven Sword', stat: 16, cost: 300 },
    2: { id: 2, name: 'Stormbringer', stat: 18, cost: 5000 },
    3: { id: 3, name: 'Sword Of Valhalla', stat: 32, cost: 18000 },
    4: { id: 4, name: 'Elemental Sword', stat: 45, cost: 160000 },
    5: { id: 5, name: 'The Forgotten Blade', stat: 85, cost: 3000000 },
};

export const ARMORS: Record<number, Item> = {
    0: { id: 0, name: 'Regular Clothes', stat: 2, cost: 0 },
    1: { id: 1, name: 'Leather Armor', stat: 10, cost: 500 },
    2: { id: 2, name: 'Wooden Armor', stat: 15, cost: 8000 },
    3: { id: 3, name: 'Plate Armor', stat: 29, cost: 30000 },
    4: { id: 4, name: 'Steel Armor', stat: 38, cost: 120000 },
    5: { id: 5, name: 'Mithril Alloy Armor', stat: 59, cost: 1500000 },
};
