import { describe, it, expect } from 'vitest';
import { isRelease } from './version';

describe('isRelease', () => {
    it('returns true for a valid 7-char hex git hash', () => expect(isRelease('a1b2c3d')).toBe(true));
    it('returns false for "⚡development"', () => expect(isRelease('⚡development')).toBe(false));
    it('returns false for a 6-char string', () => expect(isRelease('a1b2c3')).toBe(false));
    it('returns false for a 7-char non-hex string', () => expect(isRelease('xyz1234')).toBe(false));
    it('returns false for empty string', () => expect(isRelease('')).toBe(false));
});
