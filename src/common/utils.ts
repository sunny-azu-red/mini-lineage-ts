import * as fs from 'fs';
import * as path from 'path';
import { Item, Hero } from './types';
import { randomInt } from '../services/math.service';

export function randomElement<T>(array: T[]): T {
    return array[randomInt(0, array.length - 1)];
}

export function formatAdena(adena: number): string {
    if (adena <= 999) return adena.toString();
    if (adena <= 999_000) return (adena / 1_000).toFixed(1).replace('.0', '') + 'k';
    if (adena <= 999_000_000) return (adena / 1_000_000).toFixed(1).replace('.0', '') + 'kk';
    return (adena / 1_000_000_000).toFixed(1).replace('.0', '') + 'kkk';
}

export function pluralize(item: Hero | string, count: number): string {
    if (typeof item !== 'string')
        return count === 1 ? item.label : item.plural;

    return count === 1 ? item : item + 's';
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
