import { renderPage } from './layout';
import { PlayerState } from '../common/types';
import { WEAPONS, ARMORS, FOODS } from '../common/data';
import { formatAdena } from '../common/utils';

export function renderWeaponsShopView(player: PlayerState, alertHtml: string): string {
    let weaponsTableHtml = "";
    let weaponsOptionsHtml = "";
    for (let i = 1; i < WEAPONS.length; i++) {
        const weapon = WEAPONS[i];
        const rowClass = i % 2 === 1 ? 'con1' : 'con2';
        weaponsTableHtml += `<tr class='${rowClass}'><td>${weapon.name}</td><td>${weapon.stat}</td><td>${formatAdena(weapon.cost)}</td></tr>`;
        weaponsOptionsHtml += `<option value="${i}">Buy ${weapon.name}</option>`;
    }

    return renderPage("Weapons Shop", player, `
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
    `);
}

export function renderArmorsShopView(player: PlayerState, alertHtml: string): string {
    let armorsTableHtml = "";
    let armorsOptionsHtml = "";
    for (let i = 1; i < ARMORS.length; i++) {
        const armor = ARMORS[i];
        const rowClass = i % 2 === 1 ? 'con1' : 'con2';
        armorsTableHtml += `<tr class='${rowClass}'><td>${armor.name}</td><td>${armor.stat}</td><td>${formatAdena(armor.cost)}</td></tr>`;
        armorsOptionsHtml += `<option value="${i}">Buy ${armor.name}</option>`;
    }

    return renderPage("Armor Shop", player, `
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
    `);
}

export function renderInnView(player: PlayerState, alertHtml: string): string {
    let foodTableHtml = "";
    let foodOptionsHtml = "";
    for (let i = 0; i < FOODS.length; i++) {
        const food = FOODS[i];
        const rowClass = i % 2 === 0 ? 'con1' : 'con2';
        foodTableHtml += `<tr class='${rowClass}'><td>${food.name}</td><td>${food.stat}</td><td>${formatAdena(food.cost)}</td></tr>`;
        foodOptionsHtml += `<option value="${i}">Buy ${food.name}</option>`;
    }

    return renderPage("Inn", player, `
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
    `);
}
