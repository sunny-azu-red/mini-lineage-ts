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

export function pluralize(item: Hero | string, count: number, emoji?: string): string {
    const label = typeof item === 'string' ? item : item.label;
    const plural = typeof item === 'string' ? item + 's' : item.plural;
    const icon = emoji ? `${emoji} ` : '';

    if (count === 1) {
        const firstLetter = label.charAt(0).toLowerCase();
        const article = ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? 'an' : 'a';
        return `${article} ${icon}${label}`;
    }

    return `${count} ${icon}${plural}`;
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
