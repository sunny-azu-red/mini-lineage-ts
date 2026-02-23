import { Request, Response } from 'express';
import { calculateLevel, randomInt, formatAdena } from '../common/utils';
import { renderPage } from '../views';
import { WEAPONS } from '../common/data';
import { simulateBattle } from '../services/battle.service';

export const getBattle = (req: Request, res: Response) => {
    const s = req.session;
    const oldLevel = calculateLevel(s.experience!);
    const results = simulateBattle(s.weaponId!, s.armorId!, s.experience!);

    s.health! -= results.hpLost;
    s.experience! += results.expGained;
    s.adena! += results.adenaGained;

    if (s.health! <= 0) {
        s.dead = true;
        return res.redirect('/death');
    }

    const newLevel = calculateLevel(s.experience!);
    let leveledUp = newLevel > oldLevel;
    if (leveledUp) s.health = 100;

    const luck = randomInt(1, 15);
    let isAmbushed = luck === 5;
    if (isAmbushed) s.caught = true;

    let html = `
        You are on the battleground.<br>
        Using your ${WEAPONS[s.weaponId!]?.name || "Fists"} you have killed ${results.orcsKilled} ${results.orcsKilled === 1 ? 'Orc' : 'Orcs'}.<br>
        Your Health ${leveledUp ? 'was rejuvenated' : 'dropped'} to ${s.health!} ${leveledUp ? 'plus' : 'but'} you gained ${results.expGained} Experience and ${formatAdena(results.adenaGained)} adena.<br><br>
    `;

    if (leveledUp) html += `<font color="green">Congratulations! You have reached level ${newLevel}.</font><br><br>`;

    if (isAmbushed) {
        const surprises = [
            "Out of the blue 3 Orcs surrounded you and you can't escape.",
            "You forgot to check your back and you get stormed by 6 Orcs.",
            "You find yourself in a delicate position, the Orc Leader has come with reinforcements.",
            "As you were walking along 4 Orcs jumped out of the bushes.",
            "You reached a dead-end and you find yourself cornered by 3 Orcs."
        ];
        html += `<font color="red">${surprises[randomInt(0, surprises.length - 1)]}</font><br><br>`;
        html += `<form method="POST" action="/battle/ambush"><button class="box" type="submit">Fight them!</button></form>`;
    } else {
        const moves = ["Look behind the tree", "Walk Further", "Check the cave", "Jump in the bushes", "Look Behind", "Run up the hill", "Go and look behind the big rock", "Enter the Abandoned House", "Enter the Abandoned Town", "Scream 'I WANT MORE ORCS'", "Check out the Orc Ruins", "Open the locked tower"];
        const move = moves[randomInt(0, moves.length - 1)];
        html += `<a href="/">Go back in town</a> | <a href="/battle">${move}</a>`;
    }

    res.send(renderPage("Battleground", s, html));
};

export const postBattleAmbush = (req: Request, res: Response) => {
    if (req.session.caught) req.session.caught = false;
    res.redirect('/battle');
};
