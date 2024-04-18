import {
  createMatch,
  getAllMatch,
  getSquadsByGroup,
  getTournament,
} from "@/api/supabase";
import { MatchDatum } from "@/models/Match";
import { SquadGroup } from "@/models/SquadGroup";
import { useEffect, useState } from "react";

interface NewMatchProps {
  group: string;
  slug: string;
}

export const NewMatchForm: React.FC<NewMatchProps> = ({ group, slug }) => {
  const [squads, setSquadCount] = useState<SquadGroup[]>([]);
  const [accoppiamenti, setAccoppiamenti] = useState<SquadGroup[]>([]);

  const [form, setForm] = useState<MatchDatum>({
    id: "",
    created_at: "",
    day: "",
    hour: "",
    squad_home: {
      id: "",
      name: "",
      logo: "",
      group: "",
      category: "",
      created_at: "",
      show_label_group: true,
    },
    squad_away: {
      id: "",
      name: "",
      logo: "",
      group: "",
      category: "",
      created_at: "",
      show_label_group: true,
    },
    outcome: "",
    score_home: 0,
    score_away: 0,
    field: "",
  });

  const handleChangeInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    const caricaSquadreDaDatabase = async () => {
      const squads = await getSquadsByGroup(group);
      setSquadCount(squads);
    };
    caricaSquadreDaDatabase();
  }, []);

  useEffect(() => {
    const generaAccoppiamenti = (squadre: SquadGroup[]) => {
      const accoppiamenti = [];
      for (let i = 0; i < squadre.length - 1; i++) {
        for (let j = i + 1; j < squadre.length; j++) {
          const squadraCasa = squadre[i];
          const squadraTrasferta = squadre[j];
          if (squadraCasa.id !== squadraTrasferta.id) {
            const partita = {
              casa: squadraCasa,
              trasferta: squadraTrasferta,
            };
            accoppiamenti.push(partita);
          }
        }
      }
      return accoppiamenti;
    };

    if (squads.length > 0) {
      const nuoviAccoppiamenti = generaAccoppiamenti(squads);
      // @ts-ignore
      setAccoppiamenti(nuoviAccoppiamenti);
    }
  }, [squads]);

  async function handleSubmitMatch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // @ts-ignore
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const { day, hour, squad_home, squad_away } = data;

    const matches = await getAllMatch();
    const tournament = await getTournament(slug as string);

    await createMatch(
      matches.length + 1,
      day as string,
      hour as string,
      squad_home as string,
      squad_away as string,
      tournament[0].id
    );
  }

  return (
    <div>
      <h1>Accoppiamenti del Girone</h1>
      <form onSubmit={handleSubmitMatch}>
        {accoppiamenti.map((partita, index) => (
          <div key={index}>
            <label>
              Casa:
              <input
                type="hidden"
                name="squad_home"
                value={partita.casa.squad_id.id}
              />
              <input
                type="text"
                name="squad_home_name"
                value={partita.casa.squad_id.name}
                readOnly
              />
            </label>
            <label>
              Trasferta:
              <input
                type="hidden"
                name="squad_away"
                value={partita.trasferta.squad_id.id}
              />
              <input
                type="text"
                name="squad_away_name"
                value={partita.trasferta.squad_id.name}
                readOnly
              />
            </label>
            <div>
              <input
                type="date"
                name="day"
                value={form.day}
                onChange={handleChangeInput}
              />
              <input
                type="time"
                name="hour"
                value={form.hour}
                onChange={handleChangeInput}
              />
              {/* <select
              name="field"
              value={form.field}
              onChange={handleChangeSelectField}
            >
              <option value="Campo 1">Campo 1</option>
              <option value="Campo 2">Campo 2</option>
            </select> */}
            </div>
            <button type="submit">Salva Partita</button>
          </div>
        ))}
      </form>
    </div>
  );
};
