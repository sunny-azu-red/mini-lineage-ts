export type GameStatField =
    | 'total_battles'
    | 'total_deaths'
    | 'total_ambushes'
    | 'total_enemies_killed'
    | 'total_adena_generated'
    | 'total_players';

export interface GameStats {
    id: number;
    total_battles: number;
    total_deaths: number;
    total_ambushes: number;
    total_enemies_killed: number;
    total_adena_generated: number;
    total_players: number;
}
