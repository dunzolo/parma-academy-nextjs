import { Match, MatchDatum } from "@/models/Match";
import { Squad } from "@/models/Squad";
import { SquadGroup } from "@/models/SquadGroup";
import { Tournament } from "@/models/Tournament";
import { supabase } from "@/supabase/supabase";
import { translateGroup } from "@/utils/utils";

/**
 * Recupera il torneo corrente
 */
export const getTournament = async (slug: string) => {
  const response = await supabase
    .from("tournaments")
    .select("*")
    .eq("slug", slug);

  return response.data ?? [];
};

/**
 * Recupera l'elenco totale dei tornei creati dell'anno corrente
 */
export const getAllCurrentYearTournaments = async (year: number) => {
  const response = await supabase
    .from("tournaments")
    .select("*")
    .eq("year", year);
  return response.data ?? [];
};

/**
 * Recuperare l'elenco di tutte le squadre presenti
 * @returns
 */
export const getAllSquads = async (slug: string): Promise<Tournament[]> => {
  const response = await supabase
    .from("squads")
    .select("*, tournament_id!inner(*)")
    .eq("tournament_id.slug", slug);
  return response.data ?? [];
};

/**
 * Recuperare l'elenco di tutte le squadre presenti
 * @returns
 */
export const getAllDistinctSquads = async (slug: string): Promise<string[]> => {
  const response = await supabase
    .from("squads")
    .select("*, tournament_id!inner(*)")
    .eq("tournament_id.slug", slug);
  
    if (response.data) {
      const squads: string[] = response.data.map((entry) => entry.name);
      const uniqueSquad = Array.from(new Set(squads)).sort();
      return uniqueSquad;
    }
  
    return [];

};

/**
 * Recupera le categorie dalla risposta della query e rimuovi i duplicati
 * @returns
 */
export const getAllCategories = async (slug: string): Promise<string[]> => {
  const response = await supabase
    .from("squads")
    .select("category, tournament_id!inner(*)")
    .eq("tournament_id.slug", slug);

  if (response.data) {
    const categories: string[] = response.data.map((entry) => entry.category);
    const uniqueCategories = Array.from(new Set(categories)).sort();
    return uniqueCategories;
  }

  return [];
};

/**
 * Recuperare i nomi dei singoli campi da calcio
 * @returns
 */
export const getAllDistinctFields = async (): Promise<string[]> => {
  const response = await supabase.from("match").select("field");

  if (response.data) {
    const fields: string[] = response.data.map((entry) => entry.field);
    const uniqueFileds = Array.from(new Set(fields)).sort();
    return uniqueFileds;
  }

  return [];
};

/**
 * Recupera i giorni dalla risposta della query e rimuovi i duplicati
 * @returns
 */
export const getAllDays = async (slug: string): Promise<string[]> => {
  const response = await supabase
    .from("match")
    .select("day, tournament_id!inner(*)")
    .eq("tournament_id.slug", slug);

  if (response.data) {
    const days: string[] = response.data.map((entry) => entry.day);
    const uniqueDays = Array.from(new Set(days)).sort();
    return uniqueDays;
  }

  return [];
};

export const getAllMatch = async (slug?: string): Promise<MatchDatum[]> => {
  let query = supabase
    .from("match")
    .select("*, squad_home(*), squad_away(*), tournament_id!inner(*)")
    .order("id", { ascending: true });

  if(slug) query = query.eq("tournament_id.slug", slug);
    
  const { data } = await query;
    
  return data ?? [];
};

/**
 * Recupera tutte le partite del torneo suddivise per giorno, ordinate per giorno ed ora
 * @param slug slug del torneo di riferimento
 * @returns 
 */
export const getAllMatchGroupByDay = async (
  slug: string
): Promise<{
  [key: string]: MatchDatum[];
}> => {
  const { data } = await supabase
    .from("match")
    .select("*, squad_home(*), squad_away(*), tournament_id!inner(*)")
    .eq("tournament_id.slug", slug)
    .order("day", { ascending: true })
    .order("hour", { ascending: true });

  if (data) {
    // Creare un oggetto per raggruppare i dati per data
    const groupedData: { [key: string]: MatchDatum[] } = {};
    for (const row of data) {
      const dataValue = row.day; // Assumendo che la colonna si chiami "data"
      if (!groupedData[dataValue]) {
        groupedData[dataValue] = [];
      }
      groupedData[dataValue].push(row);
    }
    return groupedData ?? [];
  }

  return {};
};

/**
 * Recupera l'elenco delle squadre in base alla categoria
 * @param category La categoria per cui vuoi filtrare
 * @returns
 */
export const getSquadsByCategory = async (
  category: string
): Promise<Squad[]> => {
  const response = await supabase
    .from("squads")
    .select("*")
    .eq("category", category);
  return response.data ?? [];
};

/**
 * Recupera l'elenco delle squadre dalla tabella group
 * @param group Lettera del gruppo per cui vuoi filtrare
 * @param id ID della squadra per cui vuoi filtrare
 * @returns
 */
export const getSquadsByGroup = async (group: string, id?: string) => {
  let query = supabase
    .from(`group_${group}`)
    .select("*, squad_id(*)")
    .order("id", { ascending: true });

  if (id) query = query.eq("squad_id", id);

  const response = await query;
  return response.data ?? [];
};

/**
 * Recupera tutti i record dalle tabelle dei gironi
 * @param groups Array di lettere dei gironi per cui vuoi filtrare
 * @returns
 */
export const getRankingByGroup = async (
  groups: string[]
): Promise<SquadGroup[][]> => {
  const responses = await Promise.all(
    groups.map(async (group) => {
      const { data } = await supabase
        .from(`group_${group}`)
        .select("*, squad_id(*)")
        .order("points", { ascending: false })
        .order("goal_difference", { ascending: false })
        .order("goal_scored", { ascending: false })

      return data as SquadGroup[];
    })
  );
  return responses;
};

export const getGroupsByCategory = async (category: string | undefined) => {
  const response = await supabase
    .from("squads")
    .select("group")
    .ilike("category", `%${category}%`);

  if (response.data) {
    const groups: string[] = response.data.map((entry) => entry.group);
    const uniqueGroups = Array.from(new Set(groups)).sort();
    return uniqueGroups;
  }

  return [];
};

/**
 * Recupera tutti i match in base alla giornata del calendario
 * @param date Data del calendario per cui vuoi filtrare
 * @returns
 */
export const getMatchesByDate = async (date: string): Promise<Match> => {
  const response = await supabase
    .from("match")
    .select("*, squad_home(*), squad_away(*)")
    .eq("day", date)
    .order("id", { ascending: true });

  return response.data ?? [];
};

export const getMatchesByCategory = async (
  category: string | undefined
): Promise<MatchDatum[]> => {
  const response = await supabase
    .from("match")
    .select("*, squad_home!inner(*), squad_away!inner(*)")
    .ilike("squad_home.category", `%${category}%`)
    .order("id", { ascending: true });

  return response.data ?? [];
};

/**
 * Recupera tutti i match che deve disputare un determinata squadra all'interno del torneo
 * @param id ID della squadra per cui vuoi recuperare i match
 * @returns
 */
export const getMatchesBySquad = async (id: string): Promise<Match> => {
  const response = await supabase
    .from("match")
    .select("*, squad_home(*), squad_away(*)")
    .or(`squad_home.eq.${id}, squad_away.eq.${id}`);

  return response.data ?? [];
};

/**
 * Recupera il singolo match
 * @param id ID del match che vuoi recuperare
 * @returns
 */
export const getMatchesById = async (id: string): Promise<Match> => {
  const response = await supabase
    .from("match")
    .select("*, squad_home(*), squad_away(*)")
    .eq("id", id);

  return response.data ?? [];
};

/**
 * Recupera tutti match del calendario che hanno presente un risultato inserito
 * @returns
 */
export const getMatchesWithResult = async (): Promise<MatchDatum[]> => {
  const response = await supabase
    .from("match")
    .select("*, squad_home(*), squad_away(*)")
    .not("score_home", "is", null)
    .not("score_away", "is", null)
    .order("id", { ascending: true });

  return response.data ?? [];
};

/**
 * Crea una nuova partita all'interno del calendario del torneo in base al form che hai compilato
 * @param date Giorno in cui verrà giocata la partita
 * @param hour Orario in cui verrà giocata la partita
 * @param selectedSquadHome ID della squadra che giocherà in casa
 * @param selectedSquadAway ID della squadra che giocherà in trasferta
 * @param field Campo in cui verrà giocata la partita
 */
export const createMatch = async (
  id: number,
  date: string,
  hour: string,
  selectedSquadHome: string,
  selectedSquadAway: string,
  tournament: number,
  field?: string,
) => {
  const response = await supabase.from("match").insert([
    {
      id: id,
      day: date,
      hour: hour,
      squad_home: selectedSquadHome,
      squad_away: selectedSquadAway,
      field: field,
      tournament_id: tournament
    },
  ]);
};

export const createGroup = async (
  group: string,
  id: number
) => {
  const response = await supabase.from(group).insert([
    {
      squad_id: id,
      points: 0,
      goal_scored: 0,
      goal_conceded: 0,
      goal_difference: 0,
    },
  ]);

};

export const updateMatch = async (
  id: string,
  day: string,
  hour: string,
  field?: string
) => {
  const response = await supabase
    .from("match")
    .update({ day, hour, field })
    .eq("id", id);
  return response.data ?? [];
};

/**
 //TODO: gestire il caricamento del logo da pannello admin
 * Crea la squadra con nome, categoria e gruppo
 * NB: il logo è da inserire direttamente da DB
 * @param id 
 * @param name Nome della squadra che verrà inserita
 * @param category Categoria della squadra che verrà inserita
 * @param group Girone della squadra che verrà inserita
 * @returns 
 */
export const createSquad = async (
  id: number,
  name: string,
  category: string,
  group: string
) => {
  const response = await supabase.from("squads").insert([
    {
      id: id,
      name: name.toUpperCase(),
      category: category,
      group: group.toUpperCase(),
    },
  ]);

  return response;
};

/**
 * Aggiorna i valori della squadra selezionata
 * @param tableName Tabella in cui è presente la squadra che deve essere modificata
 * @param newData Valori aggiornati della squadra selezionata
 * @param recordId ID della squadra selezionata
 * @returns
 */
export const updateSquad = async (
  tableName: string,
  newData: string,
  recordId: string
) => {
  const response = await supabase
    .from(tableName)
    .update(newData)
    .eq("id", recordId);
  return response.data ?? [];
};

/**
 * Aggiorna il risultato della partita selezionata
 * @param id ID della partita selezioanta
 * @param score_home Goal segnati dalla squadra di casa
 * @param score_away Goal segnati dalla squadra in trasferta
 * @param outcome Risultato finale della partita
 */
export const updateResult = async (
  id: string,
  score_home: number,
  score_away: number,
  outcome: string
) => {
  const response = await supabase
    .from("match")
    .update({ score_home, score_away, outcome })
    .eq("id", id);
};

/**
 * Aggiorni i punteggi del girone in base ai risultati della partita inserita
 * @param group Girone della squadra
 * @param id ID della squadra
 * @param points Punteggio totale della squadra
 * @param goal_scored Goal totali segnati dalla squadra
 * @param goal_conceded Goal totali subiti dalla squadra
 * @param goal_difference Differenza reti della squadra
 */
export const updatePointsGroup = async (
  group: string,
  id: string,
  points: number,
  goal_scored: number,
  goal_conceded: number,
  goal_difference: number
) => {
  const response = await supabase
    .from(`group_${group}`)
    .update({ points, goal_scored, goal_conceded, goal_difference })
    .eq("id", id);
};
