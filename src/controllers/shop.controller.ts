import { Request, Response } from 'express';
import { formatAdena } from '../common/utils';
import { renderPage } from '../views';
import { WEAPONS, ARMORS, FOOD } from '../common/data';

export const getWeaponsShop = (req: Request, res: Response) => {
    let alertHtml = "";
    if (req.session.weapon_buy) {
        alertHtml = `<font color='green'>You have bought a weapon. [${WEAPONS[req.session.weaponId!]?.name}]</font><br><br>`;
        req.session.weapon_buy = false; // reset flash
    }

    let mainContent = `
        ${alertHtml}
        You have arrived at Weapons Shop.<br>
        The nice man greets you and lets you look thru his swords.<br>
        You see these weapons available:<br><br>

        <table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='50%'>Name</td><td width='30%'>Physical Attack</td><td width='20%'>Adena</td></tr>
            <tr class='con1'><td>Elven Sword</td><td>16</td><td>${formatAdena(300)}</td></tr>
            <tr class='con2'><td>Stormbringer</td><td>18</td><td>${formatAdena(5000)}</td></tr>
            <tr class='con1'><td>Sword Of Valhalla</td><td>32</td><td>${formatAdena(18000)}</td></tr>
            <tr class='con2'><td>Elemental Sword</td><td>45</td><td>${formatAdena(160000)}</td></tr>
            <tr class='con1'><td>The Forgotten Blade</td><td>85</td><td>${formatAdena(3000000)}</td></tr>
        </table>
        <br>
        <form method="POST" action="/shop/weapons">
            <select class="box" name="select_weapon">
                <option value="">Get out of Weapons Shop</option>
                <option value="1">Buy Elven Sword</option>
                <option value="2">Buy Stormbringer</option>
                <option value="3">Buy Sword Of Valhalla</option>
                <option value="4">Buy Elemental Sword</option>
                <option value="5">Buy The Forgotten Blade</option>
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

    let mainContent = `
        ${alertHtml}
        You have arrived at Armor Shop.<br>
        The old man greets you and lets you look thru his Armors.<br>
        You see these Armors available:<br><br>

        <table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='50%'>Name</td><td width='30%'>Physical Defense</td><td width='20%'>Adena</td></tr>
            <tr class='con1'><td>Leather Armor</td><td>10</td><td>${formatAdena(500)}</td></tr>
            <tr class='con2'><td>Wooden Armor</td><td>15</td><td>${formatAdena(8000)}</td></tr>
            <tr class='con1'><td>Plate Armor</td><td>29</td><td>${formatAdena(30000)}</td></tr>
            <tr class='con2'><td>Steel Armor</td><td>38</td><td>${formatAdena(120000)}</td></tr>
            <tr class='con1'><td>Mithril Alloy Armor</td><td>59</td><td>${formatAdena(1500000)}</td></tr>
        </table>
        <br>
        <form method="POST" action="/shop/armors">
            <select class="box" name="select_armor">
                <option value="">Get out of Armor Shop</option>
                <option value="1">Buy Leather Armor</option>
                <option value="2">Buy Wooden Armor</option>
                <option value="3">Buy Plate Armor</option>
                <option value="4">Buy Steel Armor</option>
                <option value="5">Buy Mithril Alloy Armor</option>
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

    let mainContent = `
        ${alertHtml}
        You have arrived at Inn.<br>
        The old lady greets you and sets you at a table.<br>
        You see a menu and you open it. Inside you read:<br><br>

        <table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='50%'>Name</td><td width='30%'>HP Restoration</td><td width='20%'>Adena</td></tr>
            <tr class='con1'><td>Juice</td><td>4</td><td>${formatAdena(8)}</td></tr>
            <tr class='con2'><td>Apple</td><td>6</td><td>${formatAdena(11)}</td></tr>
            <tr class='con1'><td>Hotdog</td><td>15</td><td>${formatAdena(30)}</td></tr>
            <tr class='con2'><td>Mash Potatos</td><td>25</td><td>${formatAdena(80)}</td></tr>
            <tr class='con1'><td>Turkey</td><td>50</td><td>${formatAdena(180)}</td></tr>
        </table>
        <br>
        <form method="POST" action="/inn">
            <select class="box" name="select_food">
                <option value="">Get out of Inn</option>
                <option value="0">Buy Juice (4 health restoration)</option>
                <option value="1">Buy Apple (6 health restoration)</option>
                <option value="2">Buy Hotdog (15 health restoration)</option>
                <option value="3">Buy Mash Potatos (25 health restoration)</option>
                <option value="4">Buy Turkey (50 health restoration)</option>
            </select>
            <input type="submit" class="box" value="Submit">
        </form>
    `;

    res.send(renderPage("Inn", req.session, mainContent));
};

export const postInn = (req: Request, res: Response) => {
    if (!req.body.item) return res.redirect('/');

    const val = parseInt(req.body.item);
    const food = FOOD[val];
    if (!food || req.session.adena! < food.cost) {
        return res.send(renderPage("Error", req.session, `Sorry, you need more money.<br><br><a href="/inn">Go back</a>`));
    }

    req.session.adena! -= food.cost;
    req.session.health = Math.min(100, req.session.health! + food.hp);
    req.session.inn_buy = true;
    res.redirect('/inn');
};
