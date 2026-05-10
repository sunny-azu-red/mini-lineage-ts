import { Router } from 'express';

const router = Router();

// Catch-all 404 handler
router.use((req, res, next) => {
    const err = new Error(`Page not found: ${req.originalUrl}`);
    (err as any).status = 404;
    next(err);
});

export default router;
