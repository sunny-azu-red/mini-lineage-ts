import 'express-session';

export interface Item {
    id: number;
    name: string;
    stat: number;
    cost: number;
}

declare module 'express-session' {
    interface SessionData {
        race?: 'Human' | 'Orc';
        health: number;
        adena: number;
        experience: number;
        weaponId: number;
        armorId: number;
        dead?: boolean;
        caught?: boolean;
        firstTime?: boolean;
        wrote_highscore?: boolean;
        weapon_buy?: boolean;
        armor_buy?: boolean;
        inn_buy?: boolean;
        welcomed?: boolean;
    }
}
