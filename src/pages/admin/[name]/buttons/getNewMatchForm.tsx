import {
  createMatch,
  createMatchFinalPhase,
  getAllMatch,
  getAllMatchFinalPhase,
  getSquadsByGroup,
  getTournament,
} from "@/api/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MatchDatum } from "@/models/Match";
import { SquadGroup } from "@/models/SquadGroup";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewMatchProps {
  group: string;
  slug: string;
}

const NewMatchForm: React.FC<NewMatchProps> = ({ group, slug }) => {
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
      group_finals: "",
      category: "",
      created_at: "",
      show_label_group: true,
      tournament_id: {
        id: "",
        name: "",
        year: 0,
        logo: "",
        description: "",
        date_start: "",
        date_end: "",
        background_image: "",
        created_at: "",
        slug: "",
      },
    },
    squad_away: {
      id: "",
      name: "",
      logo: "",
      group: "",
      group_finals: "",
      category: "",
      created_at: "",
      show_label_group: true,
      tournament_id: {
        id: "",
        name: "",
        year: 0,
        logo: "",
        description: "",
        date_start: "",
        date_end: "",
        background_image: "",
        created_at: "",
        slug: "",
      },
    },
    outcome: "",
    score_home: 0,
    score_away: 0,
    field: "",
    tournament_id: {
      id: "",
      name: "",
      year: 0,
      logo: "",
      description: "",
      date_start: "",
      date_end: "",
      background_image: "",
      created_at: "",
      slug: "",
    },
    is_final_phase: false,
  });

  const handleChangeInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleChangeSelectField = async (event: any) => {
    setForm({ ...form, ["field"]: event });
  };

  useEffect(() => {
    const caricaSquadreDaDatabase = async () => {
      const squads = await getSquadsByGroup(group);
      setSquadCount(squads);
    };
    caricaSquadreDaDatabase();
  }, [group]);

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

    const { day, hour, squad_home, squad_away, field } = data;

    const matches = await getAllMatchFinalPhase();
    const tournament = await getTournament(slug as string);

    await createMatchFinalPhase(
      matches.length + 1,
      day as string,
      hour as string,
      squad_home as string,
      squad_away as string,
      tournament[0].id,
      field as string,
      true
    );
  }

  return (
    <div className="pb-20">
      <h1>Accoppiamenti: {group}</h1>
      {accoppiamenti.map((partita, index) => (
        <form onSubmit={handleSubmitMatch} key={index}>
          <div className="grid sm:grid-cols-2 gap-2 mb-3">
            <div>
              <Label>Casa:</Label>
              <input
                type="hidden"
                name="squad_home"
                value={partita.casa.squad_id.id}
              />
              <Input
                type="text"
                name="squad_home_name"
                value={partita.casa.squad_id.name}
                readOnly
              />
            </div>
            <div>
              <Label>Trasferta:</Label>
              <input
                type="hidden"
                name="squad_away"
                value={partita.trasferta.squad_id.id}
              />
              <Input
                type="text"
                name="squad_away_name"
                value={partita.trasferta.squad_id.name}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <Input
              type="date"
              name="day"
              value={form.day}
              onChange={handleChangeInput}
            />
            <Input
              type="time"
              name="hour"
              value={form.hour}
              onChange={handleChangeInput}
            />
            <Select name="field" onValueChange={handleChangeSelectField}>
              <SelectTrigger className="w-full md:w-1/4">
                <SelectValue placeholder="Seleziona" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Campo 1">Campo 1</SelectItem>
                  <SelectItem value="Campo 2">Campo 2</SelectItem>
                  <SelectItem value="Campo 3">Campo 3</SelectItem>
                  <SelectItem value="Campo 4">Campo 4</SelectItem>
                  <SelectItem value="Campo A">Campo A</SelectItem>
                  <SelectItem value="Campo B">Campo B</SelectItem>
                  <SelectItem value="Campo C">Campo C</SelectItem>
                  <SelectItem value="Campo D">Campo D</SelectItem>
                  <SelectItem value="Campo E">Campo E</SelectItem>
                  <SelectItem value="Campo F">Campo F</SelectItem>
                  <SelectItem value="Campo G">Campo G</SelectItem>
                  <SelectItem value="Campo 1 Stadio 'Tardini'">
                    Campo 1 Stadio “Tardini”
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Salva Partita</Button>
        </form>
      ))}
    </div>
  );
};

export default NewMatchForm;
