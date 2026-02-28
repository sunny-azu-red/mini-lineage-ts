import { Request, Response } from 'express';
import { renderWeaponsShopView, renderArmorsShopView, renderInnView } from '../views/shop.view';
import { WEAPONS, ARMORS, FOODS } from '../common/data';
import { deductCost, restoreHealth } from '../services/player.service';

export const getWeaponsShop = (req: Request, res: Response) => {
    res.send(renderWeaponsShopView(res.locals.player, res.locals.flash));
};

export const postWeaponsShop = (req: Request, res: Response) => {
    if (!req.body.select_weapon)
        return res.redirect('/');

    const player = res.locals.player;
    const weaponId = parseInt(req.body.select_weapon);
    const cost = WEAPONS[weaponId]?.cost;

    if (!deductCost(player, cost)) {
        player.flash = { text: 'Sorry, you need more adena.', type: 'danger' };
        return res.redirect('/shop/weapons');
    }

    player.weaponId = weaponId;
    player.flash = { text: `You have bought a weapon.<br>You are now wielding the swift ${WEAPONS[weaponId].name}!`, type: 'success' };
    res.redirect('/shop/weapons');
};

export const getArmorsShop = (req: Request, res: Response) => {
    res.send(renderArmorsShopView(res.locals.player, res.locals.flash));
};

export const postArmorsShop = (req: Request, res: Response) => {
    if (!req.body.select_armor)
        return res.redirect('/');

    const player = res.locals.player;
    const armorId = parseInt(req.body.select_armor);
    const cost = ARMORS[armorId]?.cost;

    if (!deductCost(player, cost)) {
        player.flash = { text: 'Sorry, you need more adena.', type: 'danger' };
        return res.redirect('/shop/armors');
    }

    player.armorId = armorId;
    player.flash = { text: `You have bought an Armor.<br>You are now wearing the mighty ${ARMORS[armorId].name}!`, type: 'success' };
    res.redirect('/shop/armors');
};

export const getInn = (req: Request, res: Response) => {
    res.send(renderInnView(res.locals.player, res.locals.flash));
};

export const postInn = (req: Request, res: Response) => {
    if (!req.body.select_food)
        return res.redirect('/');

    const player = res.locals.player;
    const val = parseInt(req.body.select_food);
    const food = FOODS[val];
    if (!food || !deductCost(player, food.cost)) {
        player.flash = { text: 'Sorry, you need more adena.', type: 'danger' };
        return res.redirect('/inn');
    }

    restoreHealth(player, food.stat);
    player.flash = { text: `You have bought food.<br>Delicious! You feel your strength returning, bringing you to ${player.health} HP.`, type: 'success' };
    res.redirect('/inn');
};
