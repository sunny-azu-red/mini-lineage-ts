import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { renderPage } from './layout';
import { PlayerState, BattleResult } from '../common/types';
import { WEAPONS } from '../common/data';
import { formatAdena, randomInt } from '../common/utils';

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const battlegroundTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'battleground.ejs'), 'utf8');

function render(template: string, locals: Record<string, any>): string {
    return ejs.render(template, locals);
}

export function renderBattlegroundView(player: PlayerState, results: BattleResult, leveledUp: boolean, newLevel: number): string {
    const weaponName = WEAPONS[player.weaponId]?.name || 'Fists';
    const hpVerb = leveledUp ? 'was rejuvenated' : 'dropped';
    const hpConj = leveledUp ? 'plus' : 'but';

    const battleText = `You are on the battleground.<br>
Using your ${weaponName} you have killed ${results.orcsKilled} ${results.orcsKilled === 1 ? 'Orc' : 'Orcs'}.<br>
Your Health ${hpVerb} to ${player.health} ${hpConj} you gained ${results.expGained} Experience and ${formatAdena(results.adenaGained)} adena.`;

    const surprises = [
        'Out of the blue 3 Orcs surrounded you and you can\'t escape.',
        'You forgot to check your back and you get stormed by 6 Orcs.',
        'You find yourself in a delicate position, the Orc Leader has come with reinforcements.',
        'As you were walking along 4 Orcs jumped out of the bushes.',
        'You reached a dead-end and you find yourself cornered by 3 Orcs.',
    ];
    const moves = ['Look behind the tree', 'Walk further', 'Check the cave', 'Jump in the bushes', 'Look behind', 'Run up the hill', 'Go and look behind the big rock', 'Enter the abandoned house', 'Enter the abandoned town', 'Scream I want more orcs', 'Check out the orc ruins', 'Open the locked tower'];

    const content = render(battlegroundTpl, {
        battleText,
        leveledUp,
        newLevel,
        caught: player.caught,
        caughtMessage: surprises[randomInt(0, surprises.length - 1)],
        nextMove: moves[randomInt(0, moves.length - 1)],
    });

    return renderPage('Battleground', player, content);
}
