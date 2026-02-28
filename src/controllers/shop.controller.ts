import { Request, Response } from 'express';
import { renderWeaponsShopView, renderArmorsShopView, renderInnView } from '../views/shop.view';
import { purchaseItem } from '../services/player.service';

export const getWeaponsShop = (req: Request, res: Response) => {
    res.send(renderWeaponsShopView(res.locals.player, res.locals.flash));
};

export const postWeaponsShop = (req: Request, res: Response) => {
    if (!req.body.select_weapon)
        return res.redirect('/');

    const player = res.locals.player;
    const weaponId = parseInt(req.body.select_weapon);
    const flash = purchaseItem(player, 'weapon', weaponId);
    if (flash)
        player.flash = flash;

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
    const flash = purchaseItem(player, 'armor', armorId);
    if (flash)
        player.flash = flash;

    res.redirect('/shop/armors');
};

export const getInn = (req: Request, res: Response) => {
    res.send(renderInnView(res.locals.player, res.locals.flash));
};

export const postInn = (req: Request, res: Response) => {
    if (!req.body.select_food)
        return res.redirect('/');

    const player = res.locals.player;
    const foodId = parseInt(req.body.select_food);
    const flash = purchaseItem(player, 'food', foodId);
    if (flash)
        player.flash = flash;

    res.redirect('/inn');
};
