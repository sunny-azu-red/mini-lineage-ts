import { FlashMessage, Item, PurchaseResult } from '@/interface';
import { randomInt } from '@/service/math.service';

export function randomElement<T>(array: T[]): T {
    return array[randomInt(0, array.length - 1)];
}

export function formatAdena(adena: number): string {
    const abs = Math.abs(adena);
    const sign = adena < 0 ? '-' : '';

    if (abs <= 999) return adena.toString();
    if (abs <= 999_000) return sign + (abs / 1_000).toFixed(1).replace('.0', '') + 'k';
    if (abs <= 999_000_000) return sign + (abs / 1_000_000).toFixed(1).replace('.0', '') + 'kk';
    return sign + (abs / 1_000_000_000).toFixed(1).replace('.0', '') + 'kkk';
}

export function formatNumber(num: number): string {
    return num.toLocaleString('en-US');
}

export function pluralize(singular: string, plural: string, count: number, emoji?: string): string {
    const icon = emoji ? `${emoji} ` : '';
    if (count === 1) {
        const article = ['a', 'e', 'i', 'o', 'u'].includes(singular.charAt(0).toLowerCase()) ? 'an' : 'a';
        return `${article} ${icon}${singular}`;
    }
    return `${formatNumber(count)} ${icon}${plural}`;
}

export function formatShopItems(items: Item[]) {
    return items.map(i => ({
        id: i.id,
        emoji: i.emoji,
        name: i.name,
        statFormatted: formatNumber(i.stat),
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

export function slugify(text: string): string {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
}
