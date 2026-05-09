import { Router } from 'express';
import { getSharedConfig } from '@/util/config';

const router = Router();

/**
 * Dynamic Config
 * Serves the shared game constants to the frontend.
 * This is public and doesn't require session/locking.
 */
router.get('/js/config.js', (req, res) => {
    res.type('application/javascript');
    res.send(`window.CONFIG = ${JSON.stringify(getSharedConfig())};`);
});

export default router;
