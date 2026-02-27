import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { renderPage } from './layout';
import { PlayerState, BattleResult, Race } from '../common/types';
import { WEAPONS, ARMORS } from '../common/data';
import { formatAdena, randomInt } from '../common/utils';

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const battlegroundTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'battleground.ejs'), 'utf8');

function render(template: string, locals: Record<string, any>): string {
    return ejs.render(template, locals);
}

export function renderBattlegroundView(player: PlayerState, results: BattleResult, leveledUp: boolean, newLevel: number): string {
    const weapon = WEAPONS[player.weaponId];
    const armor = ARMORS[player.armorId];
    const weaponName = weapon.name;
    const weaponEmoji = weapon.emoji;
    const armorName = armor.name;
    const armorEmoji = armor.emoji;
    const blocked = results.damageBlocked;
    const enemies = results.enemiesKilled;
    const enemyEmoji = player.race === Race.Human ? '👹' : '👤';

    // Weapon / kill line
    const killLines = [
        `Wielding your ${weaponEmoji} ${weaponName} with fury, you cut down ${enemies} ${enemyEmoji}.`,
        `Your ${weaponEmoji} ${weaponName} cleaves through the battlefield, slaying ${enemies} ${enemyEmoji}.`,
        `With a fierce war cry you lunge forward, striking down ${enemies} ${enemyEmoji} with your ${weaponEmoji} ${weaponName}.`,
        `The ${enemyEmoji} stood no chance, your ${weaponEmoji} ${weaponName} ended ${enemies === 1 ? 'its' : 'their'} life${enemies === 1 ? '' : 's'} swiftly.`,
    ];
    const killLine = killLines[randomInt(0, killLines.length - 1)];

    // Armor deflection line (only meaningful if armor blocked something)
    const armorLines = [
        `Your ${armorEmoji} ${armorName} absorbed a total of <span class="muted">${blocked} dmg</span> but you still learned from the clash, earning <span class="xp-glow">${results.expGained} xp</span>.`,
        `The ${armorEmoji} ${armorName} held firm, deflecting <span class="muted">${blocked} dmg</span> and the narrow escape nets you <span class="xp-glow">${results.expGained} xp</span>.`,
        `Blades glanced off your ${armorEmoji} ${armorName} for <span class="muted">${blocked} dmg</span> and you mastered your defense, granting <span class="xp-glow">${results.expGained} xp</span>.`,
        `Your ${armorEmoji} ${armorName} took the brunt of <span class="muted">${blocked} dmg</span> yet you grow tougher from the blow, gaining <span class="xp-glow">${results.expGained} xp</span>.`,
    ];
    const armorLine = armorLines[randomInt(0, armorLines.length - 1)];

    const battleText = [killLine, armorLine].filter(Boolean).join(' ');

    // HP outcome line
    const outcomeLines = [
        `You limp away with <span class="hp-glow">${player.health} hp</span> remaining and <span class="gold">${formatAdena(results.adenaGained)} adena</span> to show for it.`,
        `The skirmish leaves you at <span class="hp-glow">${player.health} hp</span>, but richer by <span class="gold">${formatAdena(results.adenaGained)} adena</span>.`,
        `Breathing heavily, you stand with <span class="hp-glow">${player.health} hp</span> left and pocket <span class="gold">${formatAdena(results.adenaGained)} adena</span>.`,
    ];
    const outcomeLine = outcomeLines[randomInt(0, outcomeLines.length - 1)];

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
        outcomeLine,
        leveledUp,
        newLevel,
        caught: player.caught,
        caughtMessage: surprises[randomInt(0, surprises.length - 1)],
        nextMove: moves[randomInt(0, moves.length - 1)],
    });

    return renderPage('Battleground', player, content);
}
