import { Request, Response } from 'express';
import { ItemType } from '@/interface';
import { toFlash } from '@/util';
import { renderWeaponsShopView, renderArmorsShopView, renderInnView } from '@/view/shop.view';
import { purchaseItem } from '@/service/player.service';

export const getWeaponsShop = (req: Request, res: Response) => {
    res.send(renderWeaponsShopView(res.locals.player, res.locals.flash));
};

export const postWeaponsShop = (req: Request, res: Response) => {
    if (!req.body.select_weapon)
        return res.redirect('/');

    const player = res.locals.player;
    const result = purchaseItem(player, ItemType.Weapon, parseInt(req.body.select_weapon));
    if (result)
        player.flash = toFlash(result);

    res.redirect('/shop/weapons');
};

export const getArmorsShop = (req: Request, res: Response) => {
    res.send(renderArmorsShopView(res.locals.player, res.locals.flash));
};

export const postArmorsShop = (req: Request, res: Response) => {
    if (!req.body.select_armor)
        return res.redirect('/');

    const player = res.locals.player;
    const result = purchaseItem(player, ItemType.Armor, parseInt(req.body.select_armor));
    if (result)
        player.flash = toFlash(result);

    res.redirect('/shop/armors');
};

export const getInn = (req: Request, res: Response) => {
    res.send(renderInnView(res.locals.player, res.locals.flash));
};

export const postInn = (req: Request, res: Response) => {
    if (!req.body.select_food)
        return res.redirect('/');

    const player = res.locals.player;
    const result = purchaseItem(player, ItemType.Food, parseInt(req.body.select_food));
    if (result)
        player.flash = toFlash(result);

    res.redirect('/inn');
};
