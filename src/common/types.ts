import 'express-session';

export interface Item {
    id: number;
    name: string;
    emoji: string;
    stat: number;
    cost: number;
}

export enum Race {
    Human = 'Human',
    Orc = 'Orc'
}

export interface BattleResult {
    enemiesKilled: number;
    hpLost: number;
    damageBlocked: number;
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
    ambushed?: boolean;
    coward?: boolean;
    welcomed?: boolean;
    inscribed?: boolean;
    weapon_buy?: boolean;
    armor_buy?: boolean;
    inn_buy?: boolean;
}

declare module 'express-session' {
    interface SessionData extends PlayerState { }
}
