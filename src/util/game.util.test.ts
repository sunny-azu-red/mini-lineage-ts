import { describe, it, expect } from 'vitest';
import { makeFlash, makePurchaseFlash } from './game.util';

describe('makeFlash', () => {
    it('converts newlines to <br>', () => {
        const flash = makeFlash('line1\nline2', 'info');
        expect(flash.text).toBe('line1<br>line2');
    });
    it('forwards the type', () => {
        expect(makeFlash('msg', 'danger').type).toBe('danger');
    });
});

describe('makePurchaseFlash', () => {
    it('returns success type on success', () => {
        const flash = makePurchaseFlash({ success: true, text: 'bought!' });
        expect(flash.type).toBe('success');
    });
    it('returns danger type on failure', () => {
        const flash = makePurchaseFlash({ success: false, text: 'not enough adena' });
        expect(flash.type).toBe('danger');
    });
});
