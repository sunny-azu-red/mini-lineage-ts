import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { WEAPONS, ARMORS } from '../common/data';
import { calculateLevel, calculateExpForLevel } from '../services/math.service';
import { formatAdena } from '../common/utils';
import { PlayerState } from '../common/types';

const TEMPLATES_DIR = path.join(__dirname, 'templates');

function readTemplate(name: string): string {
    return fs.readFileSync(path.join(TEMPLATES_DIR, name), 'utf8');
}

// Pre-load all templates at startup (synchronous, happens once)
const layoutTpl = readTemplate('layout.ejs');
const simpleTpl = readTemplate('simple.ejs');
const statusTpl = readTemplate('partials/status.ejs');
const inventoryTpl = readTemplate('partials/inventory.ejs');

function render(template: string, locals: Record<string, any>): string {
    return ejs.render(template, locals, { rmWhitespace: false });
}

export function renderStatus(player: PlayerState): string {
    const level = calculateLevel(player.experience);
    const hp = player.health;
    const prevLimit = calculateExpForLevel(level);
    const nextLimit = calculateExpForLevel(level + 1);
    const actualExp = player.experience - prevLimit;
    const requiredExp = nextLimit - prevLimit;

    let expPercent = (actualExp / requiredExp) * 100;
    if (expPercent > 100) expPercent = 100;
    if (expPercent < 0) expPercent = 0;
    expPercent = Math.round(expPercent * 10) / 10;

    const levelDisplay = player.caught
        ? `${player.race} lvl ${level}`
        : `<a href='/exp-table'>${player.race} lvl ${level}</a>`;

    return render(statusTpl, { hp, expPercent, adena: formatAdena(player.adena), levelDisplay });
}

export function renderInventory(player: PlayerState): string {
    const weaponStr = player.weaponId > 0 ? WEAPONS[player.weaponId]?.name : 'No Weapon';
    const armorStr = player.armorId > 0 ? ARMORS[player.armorId]?.name : 'No Armor';
    return render(inventoryTpl, { weaponStr, armorStr });
}

export function renderPage(title: string, player: PlayerState, mainContent: string): string {
    const statusHtml = renderStatus(player);
    const inventoryHtml = renderInventory(player);

    let lowHealthAlert = '';
    if (player.health < 25 && player.health > 0) {
        lowHealthAlert = player.caught
            ? `Your HP is dangerously low [${player.health}] !!`
            : `Your HP is dangerously low [${player.health}] !! You should buy some food to rejuvenate yourself.`;
    }

    return render(layoutTpl, {
        title,
        mainContent,
        statusHtml,
        inventoryHtml,
        lowHealthAlert,
        headerClickable: !player.caught,
        year: new Date().getFullYear(),
    });
}

export function renderSimplePage(title: string, mainContent: string): string {
    return render(simpleTpl, {
        title,
        mainContent,
        year: new Date().getFullYear(),
    });
}
