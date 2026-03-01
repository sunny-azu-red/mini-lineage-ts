import { readTemplate, render } from './base.view';
import { WEAPONS, ARMORS, RACES, GAME_VERSION, REPO_COMMIT_URL } from '../common/data';
import { calculateLevel, isLowHealth, calculatePercentage, getExpProgress, isMaxLevel } from '../services/math.service';
import { formatAdena } from '../common/utils';
import { PlayerState, RenderOptions, FlashMessage } from '../common/types';

const layoutTpl = readTemplate('layout.ejs');
const simpleTpl = readTemplate('simple.ejs');
const statusTpl = readTemplate('partials/status.ejs');
const inventoryTpl = readTemplate('partials/inventory.ejs');

const HEADER_BANNER = `
<div id="site-header">
  <svg class="header-emblem" xmlns="http://www.w3.org/2000/svg" viewBox="58 0 50 157">
    <g>
        <path fill="#c9a84c" d="M88.696 135.174c0 14.37 8.958 19.79 8.958 19.79-5.312-8.229-4.688-19.9-4.688-19.9l-.105-111.5c-.103-13.23 5-21.04 5-21.04-9.584 8.645-9.166 21.04-9.166 21.04v111.6m-18.999-.09c0 14.38-8.96 19.79-8.96 19.79 5.313-8.23 4.689-19.9 4.689-19.9l.104-111.5c.104-13.23-5-21.04-5-21.04 9.584 8.646 9.167 21.04 9.167 21.04v111.6"/>
    </g>
  </svg>
  <span class="header-title">Mini Lineage</span>
  <span class="header-subtitle">Remastered</span>
</div>
`;

function getVersionHtml(): string {
    return GAME_VERSION.length === 7 && /^[0-9a-f]+$/i.test(GAME_VERSION)
        ? `<a href="${REPO_COMMIT_URL}${GAME_VERSION}" target="_blank" class="version-link">${GAME_VERSION}</a>`
        : GAME_VERSION;
}

export function renderStatus(player: PlayerState): string {
    const level = calculateLevel(player.experience);
    const hp = player.health;
    const { current: currentXp, required: nextLevelXp, percent: expPercent } = getExpProgress(player.experience);

    const race = RACES[player.raceId];
    const levelDisplay = player.ambushed
        ? `${race.emoji} <span class="gold">${race.label} level ${level}</span>`
        : `${race.emoji} <a href='/exp-table'>${race.label} level ${level}</a>`;

    const maxHp = race.startHealth;

    return render(statusTpl, {
        hp,
        maxHp,
        hpPercent: calculatePercentage(hp, maxHp),
        expPercent,
        currentXp,
        nextLevelXp,
        totalXp: player.experience,
        isMaxLevel: isMaxLevel(level),
        isLowHealth: isLowHealth(hp, maxHp),
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

export function renderPage(title: string, player: PlayerState, mainContent: string, flash: FlashMessage | null = null, options: RenderOptions = {}): string {
    const statusHtml = renderStatus(player);
    const inventoryHtml = renderInventory(player);

    const maxHp = RACES[player.raceId].startHealth;
    let lowHealthAlert = '';
    if (isLowHealth(player.health, maxHp) && !options.hideLowHealthAlert) {
        lowHealthAlert = player.ambushed
            ? `Your HP is dangerously low!<br>You fell into a trap and can't do anything... good luck adventurer 🥲`
            : `Your HP is dangerously low!<br>You should buy some food from the 🍺 <a href='/inn'>Inn</a> to regain your strength.`;
    }

    return render(layoutTpl, {
        title,
        mainContent,
        statusHtml,
        inventoryHtml,
        lowHealthAlert,
        flash,
        headerClickable: !player.ambushed,
        headerBanner: HEADER_BANNER,
        year: new Date().getFullYear(),
        version: getVersionHtml(),
    });
}

export function renderSimplePage(title: string, mainContent: string, flash: FlashMessage | null = null): string {
    return render(simpleTpl, {
        title,
        mainContent,
        flash,
        headerBanner: HEADER_BANNER,
        year: new Date().getFullYear(),
        version: getVersionHtml(),
    });
}
