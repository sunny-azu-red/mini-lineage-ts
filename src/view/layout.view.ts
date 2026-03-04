import { readTemplate, render } from './base.view';
import { WEAPONS, ARMORS, RACES, GAME_VERSION, REPO_COMMIT_URL } from '@/constant/game.constant';
import { calculateLevel, isLowHealth, calculatePercentage, getXpProgress, isMaxLevel } from '@/service/math.service';
import { formatAdena, randomElement, isRelease } from '@/util';
import { AMBUSH_LOW_HEALTH_MESSAGES } from '@/constant/narratives.constant';
import { PlayerState, RenderOptions, FlashMessage } from '@/interface';

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
    return isRelease(GAME_VERSION)
        ? `<a href="${REPO_COMMIT_URL}${GAME_VERSION}" target="_blank" class="version-link">${GAME_VERSION}</a>`
        : GAME_VERSION;
}

export function renderStatus(player: PlayerState): string {
    const level = calculateLevel(player.experience);
    const hp = player.health;
    const { current: currentXp, required: nextLevelXp, percent: xpPercent } = getXpProgress(player.experience);

    const race = RACES[player.raceId];
    const maxHp = race.startHealth;

    const prevHp = player.prevHealth ?? hp;
    const prevXp = player.prevExperience ?? player.experience;
    const prevAdena = player.prevAdena ?? player.adena;
    const prevLevel = calculateLevel(prevXp);

    const prevHpPercent = calculatePercentage(prevHp, maxHp);
    const { current: prevCurrentXp, percent: prevXpPercentRaw } = getXpProgress(prevXp);

    // for xp, avoid the "shrinking" effect (start from 0 on level up, unless reaching max level)
    const prevXpPercent = (level > prevLevel && !isMaxLevel(level)) ? 0 : prevXpPercentRaw;
    const prevCurrentXpAnim = (level > prevLevel && !isMaxLevel(level)) ? 0 : prevCurrentXp;

    player.prevHealth = hp;
    player.prevExperience = player.experience;
    player.prevAdena = player.adena;

    const statusEmoji = player.dead ? '☠️' : race.emoji;
    const levelDisplay = (player.ambushed || player.dead)
        ? `${statusEmoji} <span class="gold">${race.label} level ${level}</span>`
        : `${statusEmoji} <a href='/xp-table'>${race.label} level ${level}</a>`;

    return render(statusTpl, {
        hp,
        prevHp,
        maxHp,
        hpPercent: calculatePercentage(hp, maxHp),
        prevHpPercent,
        xpPercent,
        prevXpPercent,
        currentXp,
        prevCurrentXp: prevCurrentXpAnim,
        nextLevelXp,
        totalXp: player.experience,
        prevTotalXp: prevXp,
        isMaxLevel: isMaxLevel(level),
        isLowHealth: isLowHealth(hp, maxHp),
        adena: player.adena,
        prevAdena: prevAdena,
        adenaFormatted: formatAdena(player.adena),
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
    if (!player.dead && isLowHealth(player.health, maxHp) && !options.hideLowHealthAlert) {
        lowHealthAlert = player.ambushed
            ? `Your HP is dangerously low!<br>${randomElement(AMBUSH_LOW_HEALTH_MESSAGES)}`
            : `Your HP is dangerously low!<br>You should buy some food from the 🍺 <a href='/inn'>Inn</a> to regain your strength.`;
    }

    return render(layoutTpl, {
        title,
        mainContent,
        statusHtml,
        inventoryHtml,
        lowHealthAlert,
        flash,
        headerClickable: !player.ambushed && !player.dead,
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
