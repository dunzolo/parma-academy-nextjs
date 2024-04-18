import {
  getMatchesBySquad,
  getSquadsByGroup,
  updatePointsGroup,
  updateResult,
} from "@/api/supabase";
import { Match, MatchDatum } from "@/models/Match";
import { SquadGroup } from "@/models/SquadGroup";
import { useState } from "react";

type Props = {
  item: MatchDatum;
};

const AppResult: React.FC<Props> = ({ item }) => {
  const { squad_home, score_home, squad_away, score_away, hour } = item;

  const [isActive, seiIsActive] = useState(false);

  const toggleDisabled = () => {
    seiIsActive(!isActive);
  };

  const [form, setForm] = useState<MatchDatum>({
    ...item,
    score_home: score_home ?? 0,
    score_away: score_away ?? 0,
  });

  async function handleSubmitResult(event: React.FocusEvent<HTMLFormElement>) {
    event.preventDefault();

    const { score_home, score_away } = form;

    const outcome = `${score_home} - ${score_away}`;

    await updateResult(item.id, score_home, score_away, outcome);
    calcPointsGroup();
  }

  async function calcPointsGroup() {
    const matchesBySquadHome: Match = await getMatchesBySquad(squad_home.id);
    const matchesBySquadAway: Match = await getMatchesBySquad(squad_away.id);

    const squadHome: SquadGroup[] = await getSquadsByGroup(
      squad_home.group,
      squad_home.id
    );
    const squadAway: SquadGroup[] = await getSquadsByGroup(
      squad_away.group,
      squad_away.id
    );

    squadHome[0].goal_scored = 0;
    squadHome[0].goal_conceded = 0;
    squadHome[0].goal_difference = 0;
    squadHome[0].points = 0;

    squadAway[0].goal_scored = 0;
    squadAway[0].goal_conceded = 0;
    squadAway[0].goal_difference = 0;
    squadAway[0].points = 0;

    matchesBySquadHome.map((match_squad_home: MatchDatum) => {
      if (
        match_squad_home.score_home != null &&
        match_squad_home.score_away != null
      ) {
        squadHome[0].goal_scored += match_squad_home.score_home;
        squadHome[0].goal_conceded += match_squad_home.score_away;
        squadHome[0].goal_difference +=
          squadHome[0].goal_scored - squadHome[0].goal_conceded;

        if (squadHome[0].goal_scored > squadHome[0].goal_conceded) {
          squadHome[0].points += 3;
        } else if (squadHome[0].goal_scored == squadHome[0].goal_conceded) {
          squadHome[0].points += 1;
        } else {
          squadHome[0].points += 0;
        }
      }
    });

    matchesBySquadAway.map((match_squad_away: MatchDatum) => {
      if (
        match_squad_away.score_home != null &&
        match_squad_away.score_away != null
      ) {
        squadAway[0].goal_scored += match_squad_away.score_away;
        squadAway[0].goal_conceded += match_squad_away.score_home;
        squadAway[0].goal_difference +=
          squadAway[0].goal_scored - squadAway[0].goal_conceded;

        if (squadAway[0].goal_scored > squadAway[0].goal_conceded) {
          squadAway[0].points += 3;
        } else if (squadAway[0].goal_scored == squadAway[0].goal_conceded) {
          squadAway[0].points += 1;
        } else {
          squadAway[0].points += 0;
        }
      }
    });

    await updatePointsGroup(
      squad_home.group,
      squadHome[0].id,
      squadHome[0].points,
      squadHome[0].goal_scored,
      squadHome[0].goal_conceded,
      squadHome[0].goal_difference
    );

    await updatePointsGroup(
      squad_home.group,
      squadAway[0].id,
      squadAway[0].points,
      squadAway[0].goal_scored,
      squadAway[0].goal_conceded,
      squadAway[0].goal_difference
    );
  }

  const handleChangeInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: parseInt(value) });
  };

  return (
    <>
      <form action="" onSubmit={handleSubmitResult}>
        <h3>{hour}</h3>
        <span>{squad_home.name}</span>
        {isActive ? (
          <span>
            <input
              type="number"
              name="score_home"
              value={form.score_home}
              onChange={handleChangeInput}
            />
            -
            <input
              type="number"
              name="score_away"
              value={form.score_away}
              onChange={handleChangeInput}
            />
          </span>
        ) : score_home != null || score_away != null ? (
          `${score_home} - ${score_away}`
        ) : (
          <p>Risultato da inserire</p>
        )}

        <span>{squad_away.name}</span>

        {isActive ? <button type="submit">Invia</button> : null}
      </form>
      {!isActive ? (
        <button type="button" onClick={toggleDisabled}>
          {score_home != null || score_away != null ? "Modifica" : "Inserisci"}
        </button>
      ) : null}
    </>
  );
};

export default AppResult;
