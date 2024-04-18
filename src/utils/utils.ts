import { updatePointsGroup } from "@/api/supabase";
import { Match, MatchDatum } from "@/models/Match";
import { SquadGroup } from "@/models/SquadGroup";

/**
 * Genera lo slug usando il nome del torneo
 * @param name nome del torneo
 * @returns
 */
export const generateSlug = (name: string) => {
  return name
    .toLowerCase() // Converti la stringa in minuscolo
    .replace(/[^\w\s-]/g, "") // Rimuovi caratteri non alfanumerici, spazi e trattini
    .trim() // Rimuovi spazi iniziali e finali
    .replace(/\s+/g, "-") // Sostituisci gli spazi con trattini
    .replace(/-+/g, "-"); // Rimuovi eventuali doppi trattini
};

/**
 * Funzione che converte la data in formato italiano
 * @param date Data che vuoi convertire
 * @returns
 */
export const dateFormatItalian = (date: string, options: Object) => {
  const data = new Date(date);

  const dataFormattata = data.toLocaleDateString("it-IT", options);

  // Trasformare la prima lettera del giorno in maiuscolo
  const dataFormattataCapitalized =
    dataFormattata.charAt(0).toUpperCase() + dataFormattata.slice(1);

  return dataFormattataCapitalized;
};

/**
 * Funzione che rimuove i secondi dall'orario in formato stringa
 * @param time
 * @returns
 */
export const timeFormatHoursMinutes = (time: string) => {
  const [hours, minutes] = time.split(":");
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
};

/**
 * Funzione che aggiorna i punteggi del girone in base ai goal realizzati
 * @param matchesBySquad array di tutte le partite del torneo della squadra
 * @param squad squadra per cui devo aggiornare i dati della classfica
 * @param group girone della squadra
 */
export const updatePointsSquadHome = async (
  matchesBySquad: Match,
  squad: SquadGroup,
  group: string,
) => {
  //azzero ogni volta il punteggio per gestire le modifiche dei punteggi delle partite
  squad.goal_scored = 0;
  squad.goal_conceded = 0;
  squad.goal_difference = 0;
  squad.points = 0;

  matchesBySquad.forEach((match: MatchDatum) => {
    //assegno i punteggi quando la partita cointiene un risultato
    if (match.score_home != null && match.score_away != null) {
      //verifico tramite booleano se la squadra ha giocato in casa oppure no per aggiornare la relativa classifica
      squad.goal_scored += match.score_home;
      squad.goal_conceded += match.score_away;
      squad.goal_difference += (match.score_home - match.score_away);

      if (match.score_home > match.score_away) {
        squad.points += 3;
      } else if (match.score_home === match.score_away) {
        squad.points += 1;
      } else {
        squad.points += 0;
      }
    }
  });

  const response = await updatePointsGroup(
    group,
    squad.id,
    squad.points,
    squad.goal_scored,
    squad.goal_conceded,
    squad.goal_difference
  );
};

/**
 * Funzione che aggiorna i punteggi del girone in base ai goal realizzati
 * @param matchesBySquad array di tutte le partite del torneo della squadra
 * @param squad squadra per cui devo aggiornare i dati della classfica
 * @param group girone della squadra
 */
export const updatePointsSquadAway = async (
  matchesBySquad: Match,
  squad: SquadGroup,
  group: string,
) => {
  //azzero ogni volta il punteggio per gestire le modifiche dei punteggi delle partite
  squad.goal_scored = 0;
  squad.goal_conceded = 0;
  squad.goal_difference = 0;
  squad.points = 0;

  matchesBySquad.forEach((match: MatchDatum) => {
    //assegno i punteggi quando la partita cointiene un risultato
    if (match.score_home != null && match.score_away != null) {
      //verifico tramite booleano se la squadra ha giocato in casa oppure no per aggiornare la relativa classifica
      squad.goal_scored += match.score_away;
      squad.goal_conceded += match.score_home;
      squad.goal_difference += (match.score_away - match.score_home);

      if (match.score_away > match.score_home) {
        squad.points += 3;
      } else if (match.score_home === match.score_away) {
        squad.points += 1;
      } else {
        squad.points += 0;
      }
    }
  });

  const response = await updatePointsGroup(
    group,
    squad.id,
    squad.points,
    squad.goal_scored,
    squad.goal_conceded,
    squad.goal_difference
  );
};

export const getGroupedData = (data: SquadGroup[], category: string) => {
  // Filtra gli oggetti in base al campo "category"
  const groupedDataEsordienti = data.reduce<{ [key: string]: SquadGroup[] }>(
    (acc, curr) => {
      if (curr.squad_id.category === category) {
        const group = curr.squad_id.group;
        // Verifica se acc[group] è già definito, altrimenti inizializza come array vuoto
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(curr);
      }
      return acc;
    },
    {}
  );

  return groupedDataEsordienti;
};

export const getBackgroundColorCard = (category: string) => {
  switch (category.toLowerCase()) {
    case "2011":
      return "bg-[#00B050]";
    case "2012":
      return "bg-[#974806]";
    case "2013":
      return "bg-[#FF00FF]";
    case "2014":
      return "bg-[#FFC000]";
    case "professionisti maschile":
      return "bg-[#05A9EE]";
    case "professionisti femminile":
      return "bg-[#FF66CC]";
    case "dilettanti":
      return "bg-[#0B8640]";
    default:
      return "";
  }
};

export const translateGroup = (group: string) => {
  switch (group.toLowerCase()) {
    case "professionisti maschile":
      return "professional_men";
    case "professionisti femminile":
      return "professional_girls";
    case "dilettanti":
      return "amateurs";
    default:
      return group;
  }
};
