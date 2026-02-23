import { WEAPONS, ARMORS } from '../common/data';
import { calculateLevel, calculateExpForLevel } from '../services/math.service';
import { formatAdena } from '../common/utils';
import { PlayerState } from '../common/types';

export function renderStatus(player: PlayerState): string {
    const race = player.race;
    const level = calculateLevel(player.experience);
    const hp = player.health;
    const adena = player.adena;
    const prevLimit = calculateExpForLevel(level);
    const nextLimit = calculateExpForLevel(level + 1);
    const actualExp = player.experience - prevLimit;
    const requiredExp = nextLimit - prevLimit;

    let expPercent = (actualExp / requiredExp) * 100;
    if (expPercent > 100) expPercent = 100;
    if (expPercent < 0) expPercent = 0;
    expPercent = Math.round(expPercent * 10) / 10; // 1 decimal place

    const alertStyle = hp < 25 ? "style='background-color: #f7dfdf;'" : "";
    const levelDisplay = player.caught ? `${race} lvl ${level}` : `<a href='/exp-table'>${race} lvl ${level}</a>`;

    return `
<table class='main' cellspacing='1' cellpadding='4'>
    <tr class='head'><td>Status</td></tr>
    <tr class='con1'>
        <td>
            <table width='100%' cellspacing='0' cellpadding='0'>
                <tr class='empty'>
                    <td>${levelDisplay}</td>
                </tr>
            </table>
        </td>
    </tr>
    <tr class='con1'>
        <td ${alertStyle}>
            <table border='0' width='100%' cellspacing='0' cellpadding='0'>
                <tr class='empty'>
                    <td width='15%'>HP: </td>
                    <td width='85%'>
                        <table width='${Math.min(hp, 100)}%' cellpadding='0' cellspacing='0'>
                            <tr>
                                <td>
                                    <table width='100%' cellpadding='0' cellspacing='0'>
                                        <tr>
                                            <td width='2'><img src='/images/hp_a.gif' width='2' height='12'></td>
                                            <td width='100%' background='/images/hp_b.gif'></td>
                                            <td width='2'><img src='/images/hp_c.gif' width='2' height='12'></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr class='con1'>
        <td>
            <table border='0' width='100%' cellspacing='0' cellpadding='0'>
                <tr class='empty'>
                    <td width='15%'>XP: </td>
                    <td width='85%'>
                        <table width='${expPercent}%' cellpadding='0' cellspacing='0'>
                            <tr>
                                <td>
                                    <table width='100%' cellpadding='0' cellspacing='0'>
                                        <tr>
                                            <td width='2'><img src='/images/exp_a.gif' width='2' height='12'></td>
                                            <td width='100%' background='/images/exp_b.gif'></td>
                                            <td width='2'><img src='/images/exp_c.gif' width='2' height='12'></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr class='con1'><td>Adena: ${formatAdena(adena)}</td></tr>
</table>
    `;
}

export function renderInventory(player: PlayerState): string {
    const weaponStr = player.weaponId > 0 ? WEAPONS[player.weaponId]?.name : "No Weapon";
    const armorStr = player.armorId > 0 ? ARMORS[player.armorId]?.name : "No Armor";

    return `
<table class='main' cellspacing='1' cellpadding='4'>
    <tr class='head'><td>Inventory</td></tr>
    <tr class='con1'><td>${armorStr}</td></tr>
    <tr class='con1'><td>${weaponStr}</td></tr>
</table>
    `;
}

export function renderPage(title: string, player: PlayerState, mainContent: string): string {
    const statusHtml = renderStatus(player);
    const inventoryHtml = renderInventory(player);

    let lowHealthAlert = "";
    if (player.health < 25 && player.health > 0) {
        if (player.caught) {
            lowHealthAlert = `<font color='red'>Your HP is dangerously low [${player.health}] !!</font><br><br>`;
        } else {
            lowHealthAlert = `<font color='red'>Your HP is dangerously low [${player.health}] !! You should buy some food to rejuvenate yourself.</font><br><br>`;
        }
    }

    const headerImage = player.caught ? `<img src='/images/header.jpg'>` : `<a href="/"><img src='/images/header.jpg'></a>`;

    return `
<link href='/style.css' rel='stylesheet' type='text/css'>
<link rel='icon' href='/favicon.ico' type='image/x-icon'>
<title>Mini Lineage - ${title}</title>
<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
<table class='middle' cellspacing='0' cellpadding='0'>
    <tr>
        <td class='zero'>
            <div id='wrapper'>
                ${headerImage}<br>
                <table width='100%' cellspacing='0' cellpadding='0'>
                    <tr valign='top'>
                        <td class='empty' width='29%'>${statusHtml}<br>${inventoryHtml}</td>
                        <td class='empty' width='2.5%'></td>
                        <td class='empty' width='68.5%'>
                            <table class='main' cellspacing='1' cellpadding='4'>
                                <tr class='head'><td>${title}</td></tr>
                                <tr class='con1'>
                                    <td>
                                        ${lowHealthAlert}
                                        ${mainContent}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            <div id='copyright'>Version 1.5 &copy; 2005 - ${new Date().getFullYear()}</div>
        </td>
    </tr>
</table>
    `;
}

export function renderSimplePage(title: string, mainContent: string): string {
    return `
<link href='/style.css' rel='stylesheet' type='text/css'>
<link rel='icon' href='/favicon.ico' type='image/x-icon'>
<title>Mini Lineage - ${title}</title>
<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
<table class='middle' cellspacing='0' cellpadding='0'><tr><td class='zero'><div id='wrapper'>
<a href="/"><img src='/images/header.jpg'></a><br>
<table class='main' cellspacing='1' cellpadding='4'>
    <tr class='head'><td>${title}</td></tr>
    <tr class='con1'><td>
        ${mainContent}
    </td></tr>
</table>
</div><div id='copyright'>Version 1.5 &copy; 2005 - ${new Date().getFullYear()}</div></td></tr></table>
    `;
}
