import 'express-session';
import { RaceType } from './game.interface';

export interface PlayerState {
    raceId: RaceType;
    name?: string | null;
    health: number;
    prevHealth?: number;
    adena: number;
    prevAdena?: number;
    experience: number;
    prevExperience?: number;
    weaponId: number;
    armorId: number;
    totalBattles?: number;
    totalEnemiesKilled?: number;
    dead?: boolean;
    ambushed?: boolean;
    coward?: boolean;
    deathReason?: string;
    flash?: FlashMessage;
}

export interface FlashMessage {
    text: string;
    type: 'success' | 'danger' | 'info' | 'warning';
}

declare module 'express-session' {
    interface SessionData extends PlayerState { }
}
