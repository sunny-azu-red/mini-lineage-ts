import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('env.config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should use default values in test environment', async () => {
        const { env } = await import('./env.config');
        expect(env.NODE_ENV).toBe('test');
        expect(env.SESSION_SECRET).toBe('your-secret-here');
    });

    it('should use nonEmptyStr validator when not in test mode', async () => {
        // We simulate a non-test environment by overriding NODE_ENV before import
        process.env.NODE_ENV = 'development';
        process.env.SESSION_SECRET = 'secret123';
        
        const { env } = await import('./env.config');
        expect(env.SESSION_SECRET).toBe('secret123');
    });

    it('should throw error if SESSION_SECRET is empty in development', async () => {
        process.env.NODE_ENV = 'development';
        process.env.SESSION_SECRET = '';
        
        // This should trigger the nonEmptyStr validator and throw because cleanEnv fails
        await expect(import('./env.config')).rejects.toThrow();
    });
});
