import * as fs from 'fs';
import * as path from 'path';
import { FlashMessage, Item, PurchaseResult } from '@/interface';
import { randomInt } from '@/service/math.service';

export function randomElement<T>(array: T[]): T {
    return array[randomInt(0, array.length - 1)];
}

export function formatAdena(adena: number): string {
    if (adena <= 999) return adena.toString();
    if (adena <= 999_000) return (adena / 1_000).toFixed(1).replace('.0', '') + 'k';
    if (adena <= 999_000_000) return (adena / 1_000_000).toFixed(1).replace('.0', '') + 'kk';
    return (adena / 1_000_000_000).toFixed(1).replace('.0', '') + 'kkk';
}

export function pluralize(singular: string, plural: string, count: number, emoji?: string): string {
    const icon = emoji ? `${emoji} ` : '';
    if (count === 1) {
        const article = ['a', 'e', 'i', 'o', 'u'].includes(singular.charAt(0).toLowerCase()) ? 'an' : 'a';
        return `${article} ${icon}${singular}`;
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

export function makeFlash(text: string, type: FlashMessage['type']): FlashMessage {
    return {
        type,
        text: text.replace(/\n/g, '<br>')
    };
}

export function makePurchaseFlash(result: PurchaseResult): FlashMessage {
    return makeFlash(result.text, result.success ? 'success' : 'danger');
}

export function fillTemplate(template: string, data: Record<string, any>): string {
    if (!template)
        return '';

    // process ternaries: {condition ? 'trueVal' : 'falseVal'} or {condition ? "trueVal" : "falseVal"}
    const ternaryRegex = /\{(\w+)\s*\?\s*['"]([^'"]*)['"]\s*:\s*['"]([^'"]*)['"]\}/g;
    let processed = template.replace(ternaryRegex, (_, key, trueVal, falseVal) => {
        return data[key] ? trueVal : falseVal;
    });

    // process variables: {variable}
    return processed.replace(/\{(\w+)\}/g, (_, key) => {
        const val = data[key];
        return val !== undefined && val !== null ? val.toString() : `{${key}}`;
    });
}

export function getVersion(): string {
    try {
        const versionPath = path.join(__dirname, '../version.txt');
        if (fs.existsSync(versionPath)) {
            return fs.readFileSync(versionPath, 'utf8').trim();
        }
    } catch (err) {
    }

    return '⚡development';
}

export function isRelease(version: string): boolean {
    return version.length === 7 && /^[0-9a-f]+$/i.test(version);
}

export function slugify(text: string): string {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
}
