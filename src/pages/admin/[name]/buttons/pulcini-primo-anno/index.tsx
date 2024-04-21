import { GetServerSideProps, GetServerSidePropsContext } from "next";
import DashboardLayout from "@/components/layouts/AdminLayout";
import { handleRedirect } from "@/utils/supabase/redirect";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SquadGroup } from "@/models/SquadGroup";
import {
  createMatchFinalPhase,
  getAllMatchFinalPhase,
  getRankingByGroup,
  getTournament,
} from "@/api/supabase";
import { MatchDatum } from "@/models/Match";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  ranking: SquadGroup[][];
  slug: string;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const responseRedirect = await handleRedirect(context);
  const slug = context.params?.name?.toString();

  if (responseRedirect.redirect) return responseRedirect;

  try {
    return {
      props: {
        ranking: await getRankingByGroup(["pulcini"]),
        slug,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default function page({ ranking, slug }: Props) {
  const [matches, setMatches] = useState<any>([]);

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

  useEffect(() => {
    // Crea gli accoppiamenti tra squadre
    const newMatches: any = [];

    const sortedSquads = [...ranking[0]].reverse();

    for (let i = 0; i < sortedSquads.length; i += 2) {
      if (sortedSquads[i + 1]) {
        const match = {
          homeTeam: sortedSquads[i].squad_id,
          awayTeam: sortedSquads[i + 1].squad_id,
        };
        newMatches.push(match);
      }
    }

    // Imposta gli accoppiamenti nel nostro stato
    setMatches(newMatches);
  }, [ranking]);

  const handleChangeInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleChangeSelectField = async (event: any) => {
    setForm({ ...form, ["field"]: event });
  };

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
    <div className="container pb-20">
      <div>
        {matches.map((match: any, index: any) => (
          <div key={index}>
            <form onSubmit={handleSubmitMatch}>
              <div className="grid sm:grid-cols-2 gap-2 mb-3">
                <div>
                  <Label>
                    Casa:
                    <input
                      type="hidden"
                      name="squad_home"
                      value={match.homeTeam.id}
                    />
                    <Input
                      type="text"
                      name="squad_home_name"
                      value={match.homeTeam.name}
                      readOnly
                    />
                  </Label>
                </div>
                <div>
                  <Label>
                    Trasferta:
                    <input
                      type="hidden"
                      name="squad_away"
                      value={match.awayTeam.id}
                    />
                    <Input
                      type="text"
                      name="squad_away_name"
                      value={match.awayTeam.name}
                      readOnly
                    />
                  </Label>
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
                {/* <select
                  name="field"
                  value={form.field}
                  onChange={handleChangeSelectField}
                ></select> */}

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
          </div>
        ))}
      </div>
    </div>
  );
}
