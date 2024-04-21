import { Tournament } from "./Tournament";

export interface Category {
    id: string;
    created_at: string;
    name: string;
    description: string;
    rule_category_id: RuleCategory;
    tournament_id: Tournament;
    show_provisorial_match: boolean;
    show_final_phase: boolean;
  }

  export interface RuleCategory{
    id: string;
    created_at: string;
    description: string;
  }
  