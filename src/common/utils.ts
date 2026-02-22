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

// O(1) Level calculation using the Quadratic Formula
export function calculateLevel(exp: number): number {
    if (exp < 1000) return 1;
    const a = 162, b = 176, c = -exp;
    const level = Math.floor((-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a));
    return Math.min(Math.max(level, 1), 80);
};

export function calculateExpForLevel(level: number): number {
    return level <= 1 ? 0 : Math.round(level * (176 + (level * 162)));
};
