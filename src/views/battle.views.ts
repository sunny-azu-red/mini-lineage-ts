import { renderPage } from './layout';
import { PlayerState, BattleResult } from '../common/types';
import { WEAPONS } from '../common/data';
import { formatAdena, randomInt } from '../common/utils';

export function renderBattlegroundView(player: PlayerState, results: BattleResult, leveledUp: boolean, newLevel: number): string {
    let html = `
        You are on the battleground.<br>
        Using your ${WEAPONS[player.weaponId]?.name || "Fists"} you have killed ${results.orcsKilled} ${results.orcsKilled === 1 ? 'Orc' : 'Orcs'}.<br>
        Your Health ${leveledUp ? 'was rejuvenated' : 'dropped'} to ${player.health} ${leveledUp ? 'plus' : 'but'} you gained ${results.expGained} Experience and ${formatAdena(results.adenaGained)} adena.<br><br>
    `;

    if (leveledUp)
        html += `<font color="green">Congratulations! You have reached level ${newLevel}.</font><br><br>`;

    if (player.caught) {
        const surprises = [
            "Out of the blue 3 Orcs surrounded you and you can't escape.",
            "You forgot to check your back and you get stormed by 6 Orcs.",
            "You find yourself in a delicate position, the Orc Leader has come with reinforcements.",
            "As you were walking along 4 Orcs jumped out of the bushes.",
            "You reached a dead-end and you find yourself cornered by 3 Orcs."
        ];
        html += `<font color="red">${surprises[randomInt(0, surprises.length - 1)]}</font><br><br>`;
        html += `<a href="/battle">Fight them!</a>`;
    } else {
        const moves = ["Look behind the tree", "Walk further", "Check the cave", "Jump in the bushes", "Look behind", "Run up the hill", "Go and look behind the big rock", "Enter the abandoned house", "Enter the abandoned town", "Scream I want more orcs", "Check out the orc ruins", "Open the locked tower"];
        const move = moves[randomInt(0, moves.length - 1)];
        html += `<a href="/battle">${move}</a> | <a href="/">Go back in town</a>`;
    }

    return renderPage("Battleground", player, html);
}
