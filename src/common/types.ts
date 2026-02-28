import 'express-session';

export interface Item {
    id: number;
    name: string;
    emoji: string;
    stat: number;
    cost: number;
}

export interface Hero {
    id: number;
    label: string;
    emoji: string;
    enemyHeroId: number;
    startHealth: number;
    startAdena: number;
    ambushOdds: number;
}

export interface BattleResult {
    enemiesKilled: number;
    hpLost: number;
    damageBlocked: number;
    expGained: number;
    adenaGained: number;
}

export interface PlayerState {
    heroId: number;
    health: number;
    adena: number;
    experience: number;
    weaponId: number;
    armorId: number;
    dead?: boolean;
    ambushed?: boolean;
    coward?: boolean;
    welcomed?: boolean;
    weapon_buy?: boolean;
    armor_buy?: boolean;
    inn_buy?: boolean;
}

declare module 'express-session' {
    interface SessionData extends PlayerState { }
}
