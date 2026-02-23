import 'express-session';

export interface Item {
    id: number;
    name: string;
    stat: number;
    cost: number;
}

export enum Race {
    Human = 'Human',
    Orc = 'Orc'
}

export interface WeaponConfig {
    orcs: [number, number];
    hpLoss: [number, number];
    exp: [number, number];
    adena: [number, number];
}

export interface BattleResult {
    orcsKilled: number;
    hpLost: number;
    expGained: number;
    adenaGained: number;
}

export interface PlayerState {
    race?: Race;
    health: number;
    adena: number;
    experience: number;
    weaponId: number;
    armorId: number;
    dead?: boolean;
    caught?: boolean;
    welcomed?: boolean;
    wrote_highscore?: boolean;
    weapon_buy?: boolean;
    armor_buy?: boolean;
    inn_buy?: boolean;
}

declare module 'express-session' {
    interface SessionData extends PlayerState { }
}
