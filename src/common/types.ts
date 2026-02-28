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

export interface FlashMessage {
    text: string;
    type: 'success' | 'danger' | 'info' | 'warning';
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
    flash?: FlashMessage;
}

export interface RenderOptions {
    hideLowHealthAlert?: boolean;
}

export interface HighscoreEntry {
    name: string | null;
    hero_id: number;
    total_exp: number;
    adena: number;
    level: number;
    created: string;
}

declare module 'express-session' {
    interface SessionData extends PlayerState { }
}
