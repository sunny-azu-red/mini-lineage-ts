import { describe, it, expect } from 'vitest';
import { formatAdena, pluralize, fillTemplate, makeFlash, makePurchaseFlash, isRelease } from './index';

describe('formatAdena', () => {
    it('returns plain number below 1k', () => expect(formatAdena(999)).toBe('999'));
    it('returns 1k for exactly 1000', () => expect(formatAdena(1_000)).toBe('1k'));
    it('returns 1.5k for 1500', () => expect(formatAdena(1_500)).toBe('1.5k'));
    it('strips trailing .0 from k', () => expect(formatAdena(5_000)).toBe('5k'));
    it('returns kk for millions', () => expect(formatAdena(1_000_000)).toBe('1kk'));
    it('returns kkk for billions', () => expect(formatAdena(1_000_000_000)).toBe('1kkk'));
});

describe('pluralize', () => {
    it('uses "a" for consonant-starting words', () => expect(pluralize('Human', 'Humans', 1)).toBe('a Human'));
    it('uses "an" for vowel-starting words', () => expect(pluralize('Elf', 'Elves', 1)).toBe('an Elf'));
    it('uses count + plural for multiple', () => expect(pluralize('Human', 'Humans', 3)).toBe('3 Humans'));
    it('includes emoji when provided', () => expect(pluralize('Human', 'Humans', 2, '🧙')).toBe('2 🧙 Humans'));
    it('includes emoji in singular', () => expect(pluralize('Elf', 'Elves', 1, '🧝')).toBe('an 🧝 Elf'));
});

describe('fillTemplate', () => {
    it('substitutes a simple variable', () => {
        expect(fillTemplate('Hello {name}!', { name: 'World' })).toBe('Hello World!');
    });
    it('leaves missing keys as-is', () => {
        expect(fillTemplate('{missing}', {})).toBe('{missing}');
    });
    it('handles ternary with truthy condition', () => {
        expect(fillTemplate("{flag ? 'yes' : 'no'}", { flag: true })).toBe('yes');
    });
    it('handles ternary with falsy condition', () => {
        expect(fillTemplate("{flag ? 'yes' : 'no'}", { flag: false })).toBe('no');
    });
    it('returns empty string for empty template', () => {
        expect(fillTemplate('', {})).toBe('');
    });
});

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

describe('isRelease', () => {
    it('returns true for a valid 7-char hex git hash', () => expect(isRelease('a1b2c3d')).toBe(true));
    it('returns false for "Development"', () => expect(isRelease('Development')).toBe(false));
    it('returns false for a 6-char string', () => expect(isRelease('a1b2c3')).toBe(false));
    it('returns false for a 7-char non-hex string', () => expect(isRelease('xyz1234')).toBe(false));
    it('returns false for empty string', () => expect(isRelease('')).toBe(false));
});
