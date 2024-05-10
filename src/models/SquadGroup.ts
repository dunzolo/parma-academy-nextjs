import { Squad } from "./Squad"
import { Tournament } from "./Tournament"

export interface SquadGroup {
    [x: string]: any
    id: string
    created_at: string
    squad_id: Squad
    points: number
    goal_scored: number
    goal_conceded: number
    goal_difference: number
    tournament_id: Tournament
}