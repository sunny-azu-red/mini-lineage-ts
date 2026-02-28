import * as fs from 'fs';
import * as path from 'path';
import { Request } from 'express';
import { PlayerState, Item } from './types';

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatAdena(adena: number): string {
    if (adena <= 999) return adena.toString();
    if (adena <= 999_000) return (adena / 1_000).toFixed(1).replace('.0', '') + 'k';
    if (adena <= 999_000_000) return (adena / 1_000_000).toFixed(1).replace('.0', '') + 'kk';
    return (adena / 1_000_000_000).toFixed(1).replace('.0', '') + 'kkk';
}

export function formatShopItems(items: Item[]) {
    return items.map(i => ({
        id: i.id,
        emoji: i.emoji,
        name: i.name,
        stat: i.stat,
        costFormatted: formatAdena(i.cost),
    }));
}

export const isGameStarted = (req: Request): boolean => {
    const player = req.session as PlayerState;
    return !!(player.heroId !== undefined && player.health !== undefined && player.adena !== undefined);
};

export function getVersion(): string {
    try {
        const versionPath = path.join(__dirname, '../version.txt');
        if (fs.existsSync(versionPath)) {
            return fs.readFileSync(versionPath, 'utf8').trim();
        }
    } catch (err) {
    }
    return 'Bleeding Edge';
}
