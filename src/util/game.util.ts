import { FlashMessage, PurchaseResult } from '@/interface';
import { randomInt } from '@/service/math.service';

export function randomElement<T>(array: T[]): T {
    return array[randomInt(0, array.length - 1)];
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
