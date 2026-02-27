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

const HEADER_BANNER = `
<div id="site-header">
  <svg class="header-emblem" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 2 L18 12 L28 10 L20 16 L26 26 L16 20 L6 26 L12 16 L4 10 L14 12 Z" fill="none" stroke="#c9a84c" stroke-width="1.2"/>
    <circle cx="16" cy="16" r="3" fill="#c9a84c" opacity="0.7"/>
  </svg>
  <span class="header-title">Mini Lineage</span>
</div>
`;

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
        ? `👤 <span class="gold">${player.race} level ${level}</span>`
        : `👤 <a href='/exp-table'>${player.race} level ${level}</a>`;

    const MAX_HP = 100;
    const MAX_LEVEL = 80;
    const isMaxLevel = level >= MAX_LEVEL;
    return render(statusTpl, {
        hp,
        maxHp: MAX_HP,
        hpPercent: Math.round((hp / MAX_HP) * 100),
        expPercent,
        currentXp: actualExp,
        nextLevelXp: requiredExp,
        totalXp: player.experience,
        isMaxLevel,
        adena: formatAdena(player.adena),
        levelDisplay,
    });
}

export function renderInventory(player: PlayerState): string {
    const weapon = WEAPONS[player.weaponId];
    const armor = ARMORS[player.armorId];
    return render(inventoryTpl, {
        weaponStr: weapon.name,
        armorStr: armor.name,
        weaponEmoji: weapon.emoji,
        armorEmoji: armor.emoji,
    });
}

export function renderPage(title: string, player: PlayerState, mainContent: string): string {
    const statusHtml = renderStatus(player);
    const inventoryHtml = renderInventory(player);

    let lowHealthAlert = '';
    if (player.health < 25 && player.health > 0) {
        lowHealthAlert = player.caught
            ? `Your HP is dangerously low!<br>You fell into a trap and can't do anything... good luck hero 🥲`
            : `Your HP is dangerously low!<br>You should buy some food from the <a href='/inn'>Inn</a> to rejuvenate yourself.`;
    }

    return render(layoutTpl, {
        title,
        mainContent,
        statusHtml,
        inventoryHtml,
        lowHealthAlert,
        headerClickable: !player.caught,
        headerBanner: HEADER_BANNER,
        year: new Date().getFullYear(),
    });
}

export function renderSimplePage(title: string, mainContent: string): string {
    return render(simpleTpl, {
        title,
        mainContent,
        headerBanner: HEADER_BANNER,
        year: new Date().getFullYear(),
    });
}
