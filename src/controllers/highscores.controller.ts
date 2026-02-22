import { Request, Response } from 'express';
import { calculateLevel, formatAdena } from '../common/utils';
import { renderSimplePage } from '../views';
import { db } from '../config/db';

export const getHighscoresSubmit = (req: Request, res: Response) => {
    res.send(renderSimplePage('Highscores', `
        <form method="POST" action="/highscores">
            Name: <input type="text" class="box" name="name" placeholder="Anonymous">
            <input type="submit" class="box" value="Submit">
        </form>
    `));
};

export const postHighscores = async (req: Request, res: Response) => {
    if (req.session.dead && !req.session.wrote_highscore) {
        const name = req.body.name || 'Anonymous';
        const s = req.session;
        const level = calculateLevel(s.experience!);

        await db.execute(
            'INSERT INTO highscores (total_exp, name, race, adena, level, created) VALUES (?, ?, ?, ?, ?, NOW())',
            [s.experience, name, s.race, s.adena, level]
        );
        req.session.wrote_highscore = true;
    }
    res.redirect('/highscores');
};

export const getHighscores = async (req: Request, res: Response) => {
    let headerMessage = '';
    let footerMessage = 'You could be among them too';
    let contentHtml = '';
    try {
        const [rows] = await db.execute('SELECT * FROM highscores ORDER BY total_exp DESC, adena DESC LIMIT 25');
        const highscores = rows as any[];

        let rowsHtml = '';
        highscores.forEach((score, idx) => {
            const rowClass = idx % 2 === 0 ? 'con1' : 'con2';

            const d = new Date(score.created);
            const pad = (n: number) => n.toString().padStart(2, '0');
            const formattedDate = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;

            rowsHtml += `
                <tr class='${rowClass}'>
                    <td>${score.name || 'Anonymous'}</td>
                    <td>${score.level}</td>
                    <td>${score.total_exp}</td>
                    <td>${formatAdena(score.adena)}</td>
                    <td>${formattedDate}</td>
                </tr>
            `;
        });

        if (highscores.length === 0) {
            headerMessage = 'No highscores yet...<br>';
            footerMessage = 'You could be the first one here';
        } else {
            contentHtml = `
            <table class='main' width='100%' cellspacing='1' cellpadding='4'>
                <tr class='bottom'>
                    <td width='30%'>Name</td>
                    <td width='10%'>Level</td>
                    <td width='20%'>Total exp</td>
                    <td width='20%'>Adena</td>
                    <td width='20%'>Date</td>
                </tr>
                ${rowsHtml}
            </table>
            `;
        }
    } catch (err) {
        console.error(err);
        contentHtml = "<table class='main' width='100%' cellspacing='1' cellpadding='4'><tr class='con1'><td colspan='5'>Error loading highscores...</td></tr></table>";
    }

    res.send(renderSimplePage('Highscores', `
        ${headerMessage}${contentHtml}
        <br>${footerMessage}, <a href="/">go back!</a>
    `));
};
