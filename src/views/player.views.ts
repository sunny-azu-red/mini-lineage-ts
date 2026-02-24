import { renderPage, renderSimplePage } from './layout';
import { PlayerState } from '../common/types';
import { calculateExpForLevel } from '../services/math.service';

export function renderSuicideView(player: PlayerState): string {
    return renderPage("Commit Suicide", player, `
        Are you sure you want to kill yourself?<br><br>
        <form method="POST" action="/suicide">
            <select class="box" name="suicide">
                <option value="no">No, my bad</option>
                <option value="yes">Yes, stab yourself in the heart</option>
            </select>
            <input type="submit" class="box" style="width:70px" value="Submit">
        </form>
    `);
}

export function renderDeathView(reason: string): string {
    return renderSimplePage("Oops...", `
        <font color='red'>${reason}</font><br><br>
        <a href="/highscores/submit">Write your status in Highscores!</a><br>
        <a href="/restart">Play Again?</a>
    `);
}

export function renderExpTableView(currentExp: number, currentLevel: number): string {
    const getLayoutForLevels = (start: number, end: number) => {
        let html = `<table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='30%' align='center'>Level</td><td width='70%'>Experience</td></tr>`;
        for (let i = start; i <= end; i++) {
            const expReq = calculateExpForLevel(i);
            const rowClass = currentLevel === i ? 'con4' : (i % 2 === 0 ? 'con1' : 'con2');
            html += `<tr class='${rowClass}'><td align='center'>${i}</td><td>${expReq}</td></tr>`;
        }
        html += `</table>`;
        return html;
    };

    let mainContent = `
        <table width='100%' cellspacing='0' cellpadding='0'>
        <tr class='empty' valign='top'>
        <td width='24%'>
            ${getLayoutForLevels(1, 20)}
        </td>
        <td width='1%'></td>
        <td width='24%'>
            ${getLayoutForLevels(21, 40)}
        </td>
        <td width='1%'></td>
        <td width='24%'>
            ${getLayoutForLevels(41, 60)}
        </td>
        <td width='1%'></td>
        <td width='25%'>
            ${getLayoutForLevels(61, 80)}
        </td></tr></table>
        <br>Your current XP is ${currentExp} ${currentLevel < 80 ? `| ${calculateExpForLevel(currentLevel + 1) - currentExp} XP needed to level up` : ''} | <a href="/">Go back</a>
    `;

    return renderSimplePage(`Experience Table`, mainContent);
}
