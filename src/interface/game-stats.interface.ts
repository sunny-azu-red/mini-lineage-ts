export type GameStatField =
    | 'total_battles'
    | 'total_deaths'
    | 'total_ambushes'
    | 'total_enemies_killed'
    | 'total_adena_generated'
    | 'total_players';

export interface GameStatRow {
    stat_name: GameStatField;
    stat_value: number;
}

export type GameStats = {
    [K in GameStatField]: number;
};
