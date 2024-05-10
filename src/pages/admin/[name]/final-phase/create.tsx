import React, { useState } from "react";
import {
  createMatch,
  createMatchFinalPhase,
  getAllCategories,
  getAllMatch,
  getAllMatchFinalPhase,
  getSquadsByCategory,
  getTournament,
} from "@/api/supabase";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { MatchDatum } from "@/models/Match";
import { Squad } from "@/models/Squad";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layouts/AdminLayout";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Props = {
  categories: string[];
  slug: string;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const slug = context.params?.name?.toString();
  try {
    const categories = await getAllCategories(slug as string);
    return {
      props: {
        categories,
        slug,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

Create.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default function Create({ categories, slug }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTeamHome, setSelectedTeamHome] = useState("");
  const [subcategories, setSubcategories] = useState<Squad[]>([]);

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

  const handleSelectCategory = async (event: any) => {
    setSelectedCategory(event);

    const data = await getSquadsByCategory(event);
    setSubcategories(data);
  };

  const handleChangeInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleChangeSelectField = async (event: any) => {
    setForm({ ...form, ["field"]: event });
  };

  const handleChangeSelect = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: { id: value } });
  };

  return (
    <div className="container">
      <h1 className="font-bold text-xl mb-3">Crea Match - Fasi finali</h1>
      {/* <select value={selectedCategory} onChange={handleSelectCategory}>
        <option value="">Seleziona una categoria</option>
        {categories.map((category) => {
          return (
            <option key={category} value={category}>
              {category}
            </option>
          );
        })}
      </select> */}

      <Select name="category" onValueChange={handleSelectCategory}>
        <SelectTrigger className="w-full md:w-1/4 mb-3">
          <SelectValue placeholder="Seleziona una categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {categories.map((category) => {
              return (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      <form action="" onSubmit={handleSubmitMatch}>
        <div className="grid sm:grid-cols-2 gap-2 mb-3">
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
              <SelectValue placeholder="Seleziona il campo" />
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

        <div>
          <select
            name="squad_home"
            value={form.squad_home.id}
            onChange={handleChangeSelect}
          >
            <option value="">Seleziona una subcategoria</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>

          <select
            name="squad_away"
            value={form.squad_away.id}
            onChange={handleChangeSelect}
          >
            <option value="">Seleziona una subcategoria</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit">Salva Partita</Button>
      </form>
    </div>
  );
}
