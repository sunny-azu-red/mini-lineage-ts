import { formatAdena, randomInt } from '../common/utils';
import { renderPage, renderSimplePage } from './layout';
import { PlayerState } from '../common/types';

export function renderGameStartView(): string {
    return renderSimplePage('Game Start', `
        Hello!<br>
        You can start a new game or check the <a href="/highscores">Highscores</a>!<br><br>
        What race do you want to be?<br><table><tr><td></td></tr></table>
        <form onsubmit="window.location.href=this.querySelector('select').value; return false;">
            <select class="box" name="start">
                <option value="/human">Human</option>
                <option value="/orc">Orc</option>
            </select>
            <input type="submit" class="box" value="Submit">
        </form>
    `);
}

export function renderHomeView(player: PlayerState, isNewPlayer: boolean): string {
    let helloMsg = `Welcome to <a href="/highscores">City of Aden</a>.<br><br>`;

    if (isNewPlayer) {
        const age = randomInt(10, 70);

        let definition = "boy";
        if (age > 18 && age <= 50) definition = "man";
        else if (age > 50) definition = "old timer";

        helloMsg = `You have selected to be Human. Congratulations!<br>Welcome to <a href="/highscores">City of Aden</a>. You are an average ${definition}, aged ${age}, and you came here with ${formatAdena(player.adena)} adena.<br><br>`;
    }

    return renderPage("Home Town", player, `
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
}
