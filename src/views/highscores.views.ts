import { renderSimplePage } from './layout';
import { formatAdena } from '../common/utils';

export function renderHighscoresSubmitView(): string {
    return renderSimplePage('Highscores', `
        <form method="POST" action="/highscores">
            Name: <input type="text" class="box" name="name" placeholder="Anonymous">
            <input type="submit" class="box" value="Submit">
        </form>
    `);
}

export function renderHighscoresView(highscores: any[]): string {
    let headerMessage = '';
    let footerMessage = 'You could also be in this list';
    let contentHtml = '';

    if (highscores.length === 0) {
        headerMessage = 'No highscores yet...<br>';
        footerMessage = 'You could be the first one here';
    } else {
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

    return renderSimplePage('Highscores', `
        ${headerMessage}${contentHtml}
        <br>${footerMessage} | <a href="/">Go back</a>
    `);
}

export function renderHighscoresErrorView(): string {
    return renderSimplePage('Highscores', `
        <table class='main' width='100%' cellspacing='1' cellpadding='4'><tr class='con1'><td colspan='5'>Error loading highscores...</td></tr></table>
        <br><a href="/">Go back</a>
    `);
}
