import { Request } from 'express';

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isGameStarted = (req: Request): boolean => {
    return !!(req.session.race && req.session.health !== undefined && req.session.adena !== undefined);
};

export function formatAdena(adena: number): string {
    if (adena <= 999) return adena.toString();
    if (adena <= 999_000) return (adena / 1_000).toFixed(1).replace('.0', '') + 'k';
    if (adena <= 999_000_000) return (adena / 1_000_000).toFixed(1).replace('.0', '') + 'kk';
    return (adena / 1_000_000_000).toFixed(1).replace('.0', '') + 'kkk';
};

export function calculateExpForLevel(level: number): number {
    return level <= 1 ? 0 : Math.round(130 * Math.pow(level, 2) + 130 * level);
};

export function calculateLevel(exp: number): number {
    let level = 1;
    while (level < 80 && calculateExpForLevel(level + 1) <= exp) {
        level++;
    }
    return level;
};
