import { Squad } from './Squad';
import { Tournament } from './Tournament';
export type Match = MatchDatum[]

export interface MatchDatum {
    id: string
    created_at: string
    day: string
    squad_home: Squad
    squad_away: Squad
    score_home: number
    score_away: number
    outcome: string
    hour: string
    field: string
    tournament_id: Tournament
    is_final_phase: boolean
}

export interface MatchProvisionalDatum{
    id: string
    created_at: string
    day: string
    squad_home: string
    squad_away: string
    category: string
    hour: string
    field: string
    tournament_id: Tournament
}