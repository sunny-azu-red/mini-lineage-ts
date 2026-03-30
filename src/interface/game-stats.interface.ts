export type GameStatField =
    | 'total_adena'
    | 'total_adena_generated'
    | 'total_adena_spent'
    | 'total_ambushes'
    | 'total_armors_bought'
    | 'total_battles'
    | 'total_deaths'
    | 'total_enemies_killed'
    | 'total_food_bought'
    | 'total_players'
    | 'total_players_cheated'
    | 'total_players_suicided'
    | 'total_weapons_bought';

export interface GameStatRow {
    stat_name: GameStatField;
    stat_value: number;
}

export type GameStats = {
    [K in GameStatField]: number;
};
