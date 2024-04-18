import { Squad } from './Squad';
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
}