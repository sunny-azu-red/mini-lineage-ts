export enum RaceType {
    Human = 0,
    Orc = 1,
    Elf = 2,
    DarkElf = 3,
}

export enum ItemType {
    Weapon = 'weapon',
    Armor = 'armor',
    Food = 'food',
}

export interface Race {
    id: RaceType;
    label: string;
    plural: string;
    emoji: string;
    enemyRaceId: RaceType;
    startHealth: number;
    startAdena: number;
    ambushOdds: number;
}

export interface Item {
    id: number;
    name: string;
    emoji: string;
    stat: number;
    cost: number;
}

export interface PurchaseResult {
    success: boolean;
    text: string;
    item?: Item;
}
