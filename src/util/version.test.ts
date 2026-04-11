import { describe, it, expect, vi, afterEach } from 'vitest';
import { isRelease, getVersion } from './version';

describe('version utility', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    describe('isRelease', () => {
        describe('when NODE_ENV is production', () => {
            it('returns true regardless of the version string content', () => {
                vi.stubEnv('NODE_ENV', 'production');

                // even with a dev label, production env forces a release state
                expect(isRelease('⚡development')).toBe(true);
                expect(isRelease('anything')).toBe(true);
                expect(isRelease('')).toBe(true);
            });
        });

        describe('when NODE_ENV is NOT production', () => {
            it('returns true for a valid 7-char hex git hash', () => {
                vi.stubEnv('NODE_ENV', 'development');
                expect(isRelease('a1b2c3d')).toBe(true);
            });

            it('is case-insensitive for hex hashes', () => {
                vi.stubEnv('NODE_ENV', 'development');
                expect(isRelease('A1B2C3D')).toBe(true);
            });

            it('returns false for "⚡development"', () => {
                vi.stubEnv('NODE_ENV', 'development');
                expect(isRelease('⚡development')).toBe(false);
            });

            it('returns false for invalid hex strings or lengths', () => {
                vi.stubEnv('NODE_ENV', 'development');

                expect(isRelease('a1b2c3')).toBe(false);
                expect(isRelease('xyz1234')).toBe(false);
                expect(isRelease('')).toBe(false);
            });
        });
    });

    describe('getVersion', () => {
        it('returns ⚡development if the version file is missing', () => {
            expect(getVersion()).toBe('⚡development');
        });
    });
});
