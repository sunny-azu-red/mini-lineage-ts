import { describe, it, expect, vi } from 'vitest';
import { errorMiddleware } from './error.middleware';
import * as layoutView from '@/view/layout.view';

vi.mock('@/config/logger.config', () => ({
    logger: {
        error: vi.fn()
    }
}));

vi.mock('@/view/base.view', () => ({
    readTemplate: vi.fn().mockReturnValue({ content: '', filename: 'error.ejs' }),
    render: vi.fn().mockReturnValue('<html>Error</html>')
}));

vi.mock('@/view/layout.view', () => ({
    renderSimplePage: vi.fn().mockReturnValue('<html>Simple Error</html>')
}));

describe('errorMiddleware', () => {
    it('should log error and return 500 response', () => {
        const err = new Error('Test error');
        const req = {};
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
            locals: { player: { name: 'Player' } }
        };
        const next = vi.fn();

        errorMiddleware(err, req as any, res as any, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('<html>Simple Error</html>');
        expect(layoutView.renderSimplePage).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(String),
            null,
            res.locals.player
        );
    });
});
