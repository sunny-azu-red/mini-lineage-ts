import { WEAPONS, ARMORS } from '../common/data';
import { calculateLevel, formatAdena } from '../common/utils';

export function renderStatus(session: any): string {
    const isGuest = !session.firstTime;
    const race = isGuest ? "Guest" : session.race;
    const level = isGuest ? 1 : calculateLevel(session.experience!);
    const hp = isGuest ? 0 : session.health!;
    const adena = isGuest ? 0 : session.adena!;

    // calculate exp limits based on PHP formula:
    // limit for level N = N * (176 + (N * 162))
    const prevLimit = level === 1 ? 0 : Math.round(level * (176 + (level * 162)));
    const nextLimit = Math.round((level + 1) * (176 + ((level + 1) * 162)));

    const actualExp = isGuest ? 0 : session.experience! - prevLimit;
    const requiredExp = nextLimit - prevLimit;

    let expPercent = (actualExp / requiredExp) * 100;
    if (expPercent > 100) expPercent = 100;
    if (expPercent < 0) expPercent = 0;
    expPercent = Math.round(expPercent * 10) / 10; // 1 decimal place

    const alertStyle = hp < 25 && !isGuest ? "style='background-color: #f7dfdf;'" : "";

    return `
<table class='main' cellspacing='1' cellpadding='4'>
    <tr class='head'><td>Status</td></tr>
    <tr class='con1'>
        <td>
            <table width='100%' cellspacing='0' cellpadding='0'>
                <tr class='empty'>
                    <td>${race} lvl ${level} </td>
                    ${isGuest ? '' : `<td align='right'><a href='/exp-table'>EXP Table</a></td>`}
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
                        <table width='${hp}%' cellpadding='0' cellspacing='0'>
                            <tr>
                                <td>
                                    <table width='100%' cellpadding='0' cellspacing='0'>
                                        <tr>
                                            <td width='2'><img src='/style/hp_a.gif' width='2' height='12'></td>
                                            <td width='100%' background='/style/hp_b.gif'></td>
                                            <td width='2'><img src='/style/hp_c.gif' width='2' height='12'></td>
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
                                            <td width='2'><img src='/style/exp_a.gif' width='2' height='12'></td>
                                            <td width='100%' background='/style/exp_b.gif'></td>
                                            <td width='2'><img src='/style/exp_c.gif' width='2' height='12'></td>
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
    <tr class='con1'><td>Adena: ${formatAdena(session.adena!)}</td></tr>
</table>
    `;
}

export function renderInventory(session: any): string {
    const weaponName = WEAPONS[session.weaponId!]?.name || "Fists";
    const weaponStat = WEAPONS[session.weaponId!]?.stat || 7;
    const weaponStr = session.weaponId! > 0 ? `${weaponName} (${weaponStat} p.atk)` : "No Weapon";

    const armorName = ARMORS[session.armorId!]?.name || "Regular Clothes";
    const armorStat = ARMORS[session.armorId!]?.stat || 2;
    const armorStr = session.armorId! > 0 ? `${armorName} (${armorStat} p.def)` : "No Armor";

    return `
<table class='main' cellspacing='1' cellpadding='4'>
    <tr class='head'><td>Inventory</td></tr>
    <tr class='con1'><td>${armorStr}</td></tr>
    <tr class='con1'><td>${weaponStr}</td></tr>
</table>
    `;
}

export function renderPage(title: string, session: any, mainContent: string): string {
    const statusHtml = renderStatus(session);
    const inventoryHtml = renderInventory(session);

    let lowHealthAlert = "";
    if (session.health! < 25 && session.health! > 0) {
        lowHealthAlert = `<font color='red'>Your HP is dangerously low [${session.health!}] !! You should buy some food to rejuvenate yourself.</font><br><br>`;
    }

    return `
<link href='/style/style.css' rel='stylesheet' type='text/css'>
<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
<table class='middle' cellspacing='0' cellpadding='0'>
    <tr>
        <td class='zero'>
            <div id='wrapper'>
                <img src='/style/header.jpg'><br>
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
<link href='/style/style.css' rel='stylesheet' type='text/css'>
<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
<table class='middle' cellspacing='0' cellpadding='0'><tr><td class='zero'><div id='wrapper'>
<img src='/style/header.jpg'><br>
<table class='main' cellspacing='1' cellpadding='4'>
    <tr class='head'><td>${title}</td></tr>
    <tr class='con1'><td>
        ${mainContent}
    </td></tr>
</table>
</div><div id='copyright'>Version 1.5 &copy; 2005 - ${new Date().getFullYear()}</div></td></tr></table>
    `;
}
