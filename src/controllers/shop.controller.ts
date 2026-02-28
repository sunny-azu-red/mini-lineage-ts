import { Request, Response } from 'express';
import { renderPage } from '../views/layout.view';
import { renderWeaponsShopView, renderArmorsShopView, renderInnView } from '../views/shop.view';
import { WEAPONS, ARMORS, FOODS } from '../common/data';
import { deductCost, restoreHealth } from '../services/player.service';
import { PlayerState } from '../common/types';

export const getWeaponsShop = (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    let alertHtml = "";
    if (player.weapon_buy) {
        alertHtml = `You have bought a weapon.<br>You are now wielding the swift ${WEAPONS[player.weaponId as number]?.name}!`;
        player.weapon_buy = false; // reset flash
    }

    res.send(renderWeaponsShopView(player, alertHtml));
};

export const postWeaponsShop = (req: Request, res: Response) => {
    if (!req.body.select_weapon)
        return res.redirect('/');

    const player = req.session as PlayerState;
    const weaponId = parseInt(req.body.select_weapon);
    const cost = WEAPONS[weaponId]?.cost;

    if (!deductCost(player, cost))
        return res.send(renderPage("Error", player, `<p>Sorry, you need more money.</p><a href="/shop/weapons">Go back</a>`));

    player.weaponId = weaponId;
    player.weapon_buy = true;
    res.redirect('/shop/weapons');
};

export const getArmorsShop = (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    let alertHtml = "";
    if (player.armor_buy) {
        alertHtml = `You have bought an Armor.<br>You are now wearing the mighty ${ARMORS[player.armorId as number]?.name}!`;
        player.armor_buy = false; // reset flash
    }

    res.send(renderArmorsShopView(player, alertHtml));
};

export const postArmorsShop = (req: Request, res: Response) => {
    if (!req.body.select_armor)
        return res.redirect('/');

    const player = req.session as PlayerState;
    const armorId = parseInt(req.body.select_armor);
    const cost = ARMORS[armorId]?.cost;

    if (!deductCost(player, cost))
        return res.send(renderPage("Error", player, `<p>Sorry, you need more money.</p><a href="/shop/armors">Go back</a>`));

    player.armorId = armorId;
    player.armor_buy = true;
    res.redirect('/shop/armors');
};

export const getInn = (req: Request, res: Response) => {
    const player = req.session as PlayerState;
    let alertHtml = "";
    if (player.inn_buy) {
        alertHtml = `You have bought food.<br>Delicious! You feel your strength returning, bringing you to ${player.health} HP.`;
        player.inn_buy = false; // reset flash
    }

    res.send(renderInnView(player, alertHtml));
};

export const postInn = (req: Request, res: Response) => {
    if (!req.body.select_food)
        return res.redirect('/');

    const player = req.session as PlayerState;
    const val = parseInt(req.body.select_food);
    const food = FOODS[val];
    if (!food || !deductCost(player, food.cost))
        return res.send(renderPage("Error", player, `<p>Sorry, you need more money.</p><a href="/inn">Go back</a>`));

    restoreHealth(player, food.stat);
    player.inn_buy = true;
    res.redirect('/inn');
};
