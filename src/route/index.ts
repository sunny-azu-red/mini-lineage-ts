import { Router } from 'express';
import { getHome, postGameStart } from '@/controller/game.controller';
import { getWeaponsShop, postWeaponsShop, getArmorsShop, postArmorsShop, getInn, postInn } from '@/controller/shop.controller';
import { getBattle } from '@/controller/battle.controller';
import { getSuicide, postSuicide, getDeath, getRestart, getXpTable } from '@/controller/player.controller';
import { postHighscores, getHighscores } from '@/controller/highscores.controller';
import { battleRateLimiter, shopRateLimiter } from '@/middleware/rate-limit.middleware';

const router = Router();

// home & start
router.get('/', getHome);
router.post('/start', postGameStart);

// battle
router.get('/battle', battleRateLimiter, getBattle);

// shops & inn
router.get('/shop/weapons', getWeaponsShop);
router.post('/shop/weapons', shopRateLimiter, postWeaponsShop);
router.get('/shop/armors', getArmorsShop);
router.post('/shop/armors', shopRateLimiter, postArmorsShop);
router.get('/inn', getInn);
router.post('/inn', shopRateLimiter, postInn);

// suicide
router.get('/suicide', getSuicide);
router.post('/suicide', postSuicide);

// death & restart
router.get('/death', getDeath);
router.get('/restart', getRestart);

// xp table
router.get('/xp-table', getXpTable);

// highscores
router.post('/highscores', postHighscores);
router.get('/highscores', getHighscores);

export default router;
