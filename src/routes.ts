import { Router } from 'express';
import { getHome, postGameStart } from './controllers/game.controller';
import { getWeaponsShop, postWeaponsShop, getArmorsShop, postArmorsShop, getInn, postInn } from './controllers/shop.controller';
import { getBattle } from './controllers/battle.controller';
import { getSuicide, postSuicide, getDeath, getRestart, getExpTable } from './controllers/player.controller';
import { getHighscoresSubmit, postHighscores, getHighscores } from './controllers/highscores.controller';

const router = Router();

// home & start
router.get('/', getHome);
router.post('/start', postGameStart);

// battle
router.get('/battle', getBattle);

// shops & inn
router.get('/shop/weapons', getWeaponsShop);
router.post('/shop/weapons', postWeaponsShop);
router.get('/shop/armors', getArmorsShop);
router.post('/shop/armors', postArmorsShop);
router.get('/inn', getInn);
router.post('/inn', postInn);

// suicide
router.get('/suicide', getSuicide);
router.post('/suicide', postSuicide);

// death & restart
router.get('/death', getDeath);
router.get('/restart', getRestart);

// exp table
router.get('/exp-table', getExpTable);

// highscores
router.get('/highscores/submit', getHighscoresSubmit);
router.post('/highscores', postHighscores);
router.get('/highscores', getHighscores);

export default router;
