import { PlayerState } from '../common/types';

export function deductCost(player: PlayerState, cost: number): boolean {
    if (player.adena < cost)
        return false;

    player.adena -= cost;
    return true;
}

export function restoreHealth(player: PlayerState, amount: number): void {
    player.health = Math.min(100, player.health + amount);
}

export function applyBattleResult(player: PlayerState, hpLost: number, expGained: number, adenaGained: number): void {
    player.health -= hpLost;
    player.experience += expGained;
    player.adena += adenaGained;

    if (player.health <= 0)
        player.dead = true;
    // player.health = 100; // DEBUG: respawn on death
}

// TODO: make the buttons even nicer (the zoom in zoom out is very distracting)
// TODO: buttons have 3 classes, btn, btn-secondary and btn-danger, can we pick btn and btn-danger for buttons with emojis and btn-secondary for buttons without emojis?
// TODO: the same way we have an Item interface for weapon and armor and food, we need to make one for Human and Orc so that we can sepcify the emoji for each there
// TODO: make it that if we dont have enough money, it shows a red flash message, not a separate page with go back
// TODO: make it so that you cant buy armor or weapon if you already have the exact one, the option should be disabled in the list
// TODO: animate .stat-row.danger to indicate health is super low
// TODO: can we animate the health bar and xp bar? perhaps save the previous hp or xp in session and when you refresh the page, show the previous hp and xp but then animate to the actual hp and xp
// TODO: and on that note maybe the bar labels should be animated too?
// TODO: <div class="alert alert-success">🎉 Congratulations! You have reached level <%= newLevel %>.</div> should not be green but golden, simulate the lineage level up
// TODO: the surprises should be 25% of enemies you previously killed (enemiesKilled / 4)
// TODO: more text versions for the battleground
// TODO: i dont like the *.views.ts files, that logic can go in the controller and the controller should call .ejs or should that logic go into .ejs?
// TODO: finish the orc module, should be exactly the same only they fight humans on the battleground
// TODO: human and orc should be a hero type, like item, they should have name and emoji and base health, the orc should have 150 hp? anything else i can change between them? maybe change the odds of the orc getting caught like 1 in 10?
// TODO: add the race in the highscores (emoji before the name)
// TODO: change the version in the copyright
// TODO: the render function is repeating alot of times
// TODO: dry the code and ask for improvements
