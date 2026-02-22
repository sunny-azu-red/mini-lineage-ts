import { Request, Response } from 'express';
import { formatAdena } from '../common/utils';
import { renderPage } from '../views';
import { WEAPONS, ARMORS, FOODS } from '../common/data';

export const getWeaponsShop = (req: Request, res: Response) => {
    let alertHtml = "";
    if (req.session.weapon_buy) {
        alertHtml = `<font color='green'>You have bought a weapon. [${WEAPONS[req.session.weaponId!]?.name}]</font><br><br>`;
        req.session.weapon_buy = false; // reset flash
    }

    let weaponsTableHtml = "";
    let weaponsOptionsHtml = "";
    for (let i = 1; i < WEAPONS.length; i++) { // skip index 0 since it is 'Fists' (free/default)
        const weapon = WEAPONS[i];
        const rowClass = i % 2 === 1 ? 'con1' : 'con2';
        weaponsTableHtml += `<tr class='${rowClass}'><td>${weapon.name}</td><td>${weapon.stat}</td><td>${formatAdena(weapon.cost)}</td></tr>`;
        weaponsOptionsHtml += `<option value="${i}">Buy ${weapon.name}</option>`;
    }

    let mainContent = `
        ${alertHtml}
        You have arrived at Weapons Shop.<br>
        The nice man greets you and lets you look thru his swords.<br>
        You see these weapons available:<br><br>

        <table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='50%'>Name</td><td width='30%'>Physical Attack</td><td width='20%'>Adena</td></tr>
            ${weaponsTableHtml}
        </table>
        <br>
        <form method="POST" action="/shop/weapons">
            <select class="box" name="select_weapon">
                <option value="">Get out of Weapons Shop</option>
                ${weaponsOptionsHtml}
            </select>
            <input type="submit" class="box" value="Submit">
        </form>
    `;

    res.send(renderPage("Weapons Shop", req.session, mainContent));
};

export const postWeaponsShop = (req: Request, res: Response) => {
    if (!req.body.select_weapon) return res.redirect('/');

    const weaponId = parseInt(req.body.select_weapon);
    const cost = WEAPONS[weaponId]?.cost;

    if (cost === undefined || req.session.adena! < cost) {
        return res.send(renderPage("Error", req.session, `Sorry, you need more money.<br><br><a href="/shop/weapons">Go back</a>`));
    }

    req.session.adena! -= cost;
    req.session.weaponId = weaponId;
    req.session.weapon_buy = true;
    res.redirect('/shop/weapons');
};

export const getArmorsShop = (req: Request, res: Response) => {
    let alertHtml = "";
    if (req.session.armor_buy) {
        alertHtml = `<font color='green'>You have bought an Armor. [${ARMORS[req.session.armorId!]?.name}]</font><br><br>`;
        req.session.armor_buy = false; // reset flash
    }

    let armorsTableHtml = "";
    let armorsOptionsHtml = "";
    for (let i = 1; i < ARMORS.length; i++) { // skip index 0 since it is 'Regular Clothes' (free/default)
        const armor = ARMORS[i];
        const rowClass = i % 2 === 1 ? 'con1' : 'con2';
        armorsTableHtml += `<tr class='${rowClass}'><td>${armor.name}</td><td>${armor.stat}</td><td>${formatAdena(armor.cost)}</td></tr>`;
        armorsOptionsHtml += `<option value="${i}">Buy ${armor.name}</option>`;
    }

    let mainContent = `
        ${alertHtml}
        You have arrived at Armor Shop.<br>
        The old man greets you and lets you look thru his Armors.<br>
        You see these Armors available:<br><br>

        <table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='50%'>Name</td><td width='30%'>Physical Defense</td><td width='20%'>Adena</td></tr>
            ${armorsTableHtml}
        </table>
        <br>
        <form method="POST" action="/shop/armors">
            <select class="box" name="select_armor">
                <option value="">Get out of Armor Shop</option>
                ${armorsOptionsHtml}
            </select>
            <input type="submit" class="box" value="Submit">
        </form>
    `;

    res.send(renderPage("Armor Shop", req.session, mainContent));
};

export const postArmorsShop = (req: Request, res: Response) => {
    if (!req.body.select_armor) return res.redirect('/');

    const armorId = parseInt(req.body.select_armor);
    const cost = ARMORS[armorId]?.cost;

    if (cost === undefined || req.session.adena! < cost) {
        return res.send(renderPage("Error", req.session, `Sorry, you need more money.<br><br><a href="/shop/armors">Go back</a>`));
    }

    req.session.adena! -= cost;
    req.session.armorId = armorId;
    req.session.armor_buy = true;
    res.redirect('/shop/armors');
};

export const getInn = (req: Request, res: Response) => {
    let alertHtml = "";
    if (req.session.inn_buy) {
        alertHtml = `<font color='green'>You have bought food. Your HP has risen to [${req.session.health!}]</font><br><br>`;
        req.session.inn_buy = false; // reset flash
    }

    let foodTableHtml = "";
    let foodOptionsHtml = "";
    for (let i = 0; i < FOODS.length; i++) {
        const food = FOODS[i];
        const rowClass = i % 2 === 0 ? 'con1' : 'con2';
        foodTableHtml += `<tr class='${rowClass}'><td>${food.name}</td><td>${food.stat}</td><td>${formatAdena(food.cost)}</td></tr>`;
        foodOptionsHtml += `<option value="${i}">Buy ${food.name}</option>`;
    }

    let mainContent = `
        ${alertHtml}
        You have arrived at Inn.<br>
        The old lady greets you and sets you at a table.<br>
        You see a menu and you open it. Inside you read:<br><br>

        <table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='50%'>Name</td><td width='30%'>Healing</td><td width='20%'>Adena</td></tr>
            ${foodTableHtml}
        </table>
        <br>
        <form method="POST" action="/inn">
            <select class="box" name="select_food">
                <option value="">Get out of Inn</option>
                ${foodOptionsHtml}
            </select>
            <input type="submit" class="box" value="Submit">
        </form>
    `;

    res.send(renderPage("Inn", req.session, mainContent));
};

export const postInn = (req: Request, res: Response) => {
    if (!req.body.select_food) return res.redirect('/');

    const val = parseInt(req.body.select_food);
    const food = FOODS[val];
    if (!food || req.session.adena! < food.cost) {
        return res.send(renderPage("Error", req.session, `Sorry, you need more money.<br><br><a href="/inn">Go back</a>`));
    }

    req.session.adena! -= food.cost;
    req.session.health = Math.min(100, req.session.health! + food.stat);
    req.session.inn_buy = true;
    res.redirect('/inn');
};
