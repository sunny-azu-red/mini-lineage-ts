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

// TODO: make the buttons nicer (and animated) (some buttons have icons, some dont, meh)
// TODO: can we animate the health bar and xp bar?
// TODO: more text versions for the battleground
// TODO: i dont like the *.views.ts files, that logic can go in the controller and the controller should call .ejs or should that logic go into .ejs?
// TODO: finish the orc module, should be exactly the same only they fight humans on the battleground
// TODO: human and orc should be a hero type, like item, they should have name and emoji and base health, the orc should have 150 hp? anything else i can change between them?
// TODO: add the race in the highscores (emoji before the name)
// TODO: change the version in the copyright
// TODO: the render function is repeating alot of times
// TODO: dry the code and ask for improvements