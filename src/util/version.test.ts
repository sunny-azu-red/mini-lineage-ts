import { describe, it, expect, vi, afterEach } from 'vitest';
import { isRelease, getVersion } from './version';
import { env } from '@/config/env.config';

vi.mock('@/config/env.config', () => ({
    env: {
        NODE_ENV: 'development',
    }
}));

describe('version utility', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.mocked(env).NODE_ENV = 'development';
    });

    describe('isRelease', () => {
        describe('when NODE_ENV is production', () => {
            it('returns true regardless of the version string content', () => {
                vi.mocked(env).NODE_ENV = 'production';

                expect(isRelease('⚡ development')).toBe(true);
                expect(isRelease('anything')).toBe(true);
                expect(isRelease('')).toBe(true);
            });
        });

        describe('when NODE_ENV is NOT production', () => {
            it('returns true for a valid 7-char hex git hash', () => {
                vi.mocked(env).NODE_ENV = 'development';
                expect(isRelease('a1b2c3d')).toBe(true);
            });

            it('is case-insensitive for hex hashes', () => {
                vi.mocked(env).NODE_ENV = 'development';
                expect(isRelease('A1B2C3D')).toBe(true);
            });

            it('returns false for "⚡ development"', () => {
                vi.mocked(env).NODE_ENV = 'development';
                expect(isRelease('⚡ development')).toBe(false);
            });

            it('returns false for invalid hex strings or lengths', () => {
                vi.mocked(env).NODE_ENV = 'development';

                expect(isRelease('a1b2c3')).toBe(false);
                expect(isRelease('xyz1234')).toBe(false);
                expect(isRelease('')).toBe(false);
            });
        });
    });

    describe('getVersion', () => {
        it('returns ⚡ development if the version file is missing', () => {
            expect(getVersion()).toBe('⚡ development');
        });
    });
});
