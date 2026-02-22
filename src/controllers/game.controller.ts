import { Request, Response } from 'express';
import { randomInt, formatAdena, isGameStarted } from '../common/utils';
import { renderPage, renderSimplePage } from '../views';

export const getHome = (req: Request, res: Response) => {
    // if they haven't chosen a race yet, show the start screen
    if (!isGameStarted(req)) {
        return res.send(renderSimplePage('Game Start | <a href="/highscores">See Highscores</a>', `
            Hello!<br><br>
            What race do you want to be?<br><table><tr><td></td></tr></table>
            <form onsubmit="window.location.href=this.querySelector('select').value; return false;">
                <select class="box" name="start">
                    <option value="/human">Human</option>
                    <option value="/orc">Orc</option>
                </select>
                <input type="submit" class="box" value="Submit">
            </form>
        `));
    }

    const age = randomInt(10, 70);
    let definition = "boy";
    if (age > 18 && age <= 50) definition = "man";
    else if (age > 50) definition = "old timer";

    let helloMsg = "Welcome to City of Aden.<br><br>";
    if (req.session.firstTime && !req.session.welcomed) {
        helloMsg = `You have selected to be Human. Congratulations!<br>Welcome to City of Aden. You are an average ${definition}, aged ${age}, and you came here with ${formatAdena(req.session.adena!)} adena.<br><br>`;
        req.session.welcomed = true;
    }

    const html = renderPage("Home Town", req.session, `
        ${helloMsg}
        <form onsubmit="window.location.href=this.querySelector('select').value; return false;">
            <select class="box" name="travel">
                <option value="/shop/armors">Go to Armor Shop</option>
                <option value="/shop/weapons">Go to Weapon Shop</option>
                <option value="/inn">Go to Inn</option>
                <option value="/battle">Fight on the Battlefield</option>
                <option value="/suicide">Commit Suicide</option>
            </select>
            <input type="submit" class="box" value="Submit">
        </form>
    `);
    res.send(html);
};

export const getHuman = (req: Request, res: Response) => {
    if (isGameStarted(req)) {
        return res.redirect('/');
    }

    req.session.race = 'Human';
    req.session.health = 100;
    req.session.adena = 300;
    req.session.experience = 0;
    req.session.weaponId = 0;
    req.session.armorId = 0;
    req.session.firstTime = true;

    res.redirect('/');
};

export const getOrc = (req: Request, res: Response) => {
    if (isGameStarted(req)) {
        return res.redirect('/');
    }

    res.send(renderSimplePage('Hmmm', `
        Module not yet finished :(<br><br>
        <a href="/">Go back</a>
    `));
};
