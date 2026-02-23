import { Request, Response } from 'express';
import { calculateLevel, calculateExpForLevel } from '../common/utils';
import { renderPage, renderSimplePage } from '../views';

export const getSuicide = (req: Request, res: Response) => {
    let mainContent = `
        Are you sure you want to kill yourself?<br><br>
        <form method="POST" action="/suicide">
            <select class="box" name="suicide">
                <option value="yes">Yes, stab yourself in the heart</option>
                <option value="no">No, my bad</option>
            </select>
            <input type="submit" class="box" style="width:70px" value="Submit">
        </form>
    `;
    res.send(renderPage("Commit Suicide", req.session, mainContent));
};

export const postSuicide = (req: Request, res: Response) => {
    if (req.body.suicide === 'yes') {
        req.session.dead = true;
        res.redirect('/death');
    } else {
        res.redirect('/');
    }
};

export const getDeath = (req: Request, res: Response) => {
    const reason = req.query.reason === 'coward'
        ? "You were caught trying to flee an ambush! Game Over !!"
        : "Your health dropped to 0 and you died.";

    res.send(renderSimplePage("Oops...", `
        <font color='red'>${reason}</font><br><br>
        <a href="/highscores/submit">Write your status in Highscores!</a><br>
        <a href="/restart">Play Again?</a>
    `));
};

export const getRestart = (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

export const getExpTable = (req: Request, res: Response) => {
    const currentExp = req.session.experience || 0;
    const currentLevel = calculateLevel(currentExp);

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
        <br>Your current XP is ${currentExp}, <a href="/">go back!</a>
    `;

    res.send(renderSimplePage(`Experience Table`, mainContent));
};
