import { describe, it, expect, vi, beforeEach } from 'vitest';
import { debugMiddleware } from './debug.middleware';
import { logger } from '@/config/logger.config';
import * as util from '@/util';

vi.mock('@/config/logger.config', () => ({
    logger: {
        debug: vi.fn()
    }
}));

describe('debugMiddleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call next and register finish listener', () => {
        const req = { method: 'GET', url: '/', sessionID: 'xyz' };
        const res = { on: vi.fn(), statusCode: 200 };
        const next = vi.fn();

        debugMiddleware(req as any, res as any, next);

        expect(next).toHaveBeenCalled();
        expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    });

    it('should log debug info on finish in development', () => {
        vi.spyOn(util, 'isRelease').mockReturnValue(false);
        const req = { method: 'GET', url: '/', sessionID: 'xyz', session: { name: 'Player' } };
        let finishHandler: Function = () => { };
        const res = {
            on: vi.fn((event, handler) => { if (event === 'finish') finishHandler = handler; }),
            statusCode: 200
        };
        const next = vi.fn();

        debugMiddleware(req as any, res as any, next);
        finishHandler();

        expect(logger.debug).toHaveBeenCalledOnce();
        expect(logger.debug).toHaveBeenCalledWith(
            expect.objectContaining({ "name\u200B": 'Player' }),
            expect.stringContaining('[GET] / = 200')
        );
    });

    it('should NOT log debug info on finish in release', () => {
        vi.spyOn(util, 'isRelease').mockReturnValue(true);
        const req = { method: 'GET', url: '/', sessionID: 'xyz' };
        let finishHandler: Function = () => { };
        const res = {
            on: vi.fn((event, handler) => { if (event === 'finish') finishHandler = handler; }),
            statusCode: 200
        };
        const next = vi.fn();

        debugMiddleware(req as any, res as any, next);
        finishHandler();

        expect(logger.debug).not.toHaveBeenCalled();
    });
});
