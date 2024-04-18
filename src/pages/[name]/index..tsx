import {
  getAllCategories,
  getAllDistinctSquads,
  getAllMatch,
  getAllMatchGroupByDay,
  getAllSquads,
  getTournament,
} from "@/api/supabase";
import RootLayout from "@/components/layouts/RootLayout";
import RowMatch from "@/components/row-match/row-match";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Match, MatchDatum } from "@/models/Match";
import { Squad } from "@/models/Squad";
import { Tournament } from "@/models/Tournament";
import { dateFormatItalian } from "@/utils/utils";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";

type Props = {
  matches: { [key: string]: MatchDatum[] };
  categories: string[];
  tournament: Tournament[];
  squads: string[];
};

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const slug = context.params?.name?.toString();

  try {
    return {
      props: {
        matches: await getAllMatchGroupByDay(slug as string),
        categories: await getAllCategories(slug as string),
        squads: await getAllDistinctSquads(slug as string),
        tournament: await getTournament(slug as string),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

Home.getLayout = (page: any) => {
  return <RootLayout>{page}</RootLayout>;
};

export default function Home({
  categories,
  matches,
  tournament,
  squads,
}: Props) {
  const [filterSquad, setFilterSquad] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const handleFilterChangeSquad = (event: any) => {
    if (event === "all") {
      event = "";
    }
    setFilterSquad(event);
  };

  const handleFilterChangeCategory = (event: any) => {
    if (event === "all") {
      event = "";
    }

    setFilterCategory(event);
  };

  //Filtra i dati in base al campo "name" e "category"
  const filterData = Object.entries(matches).map(([date, matchesForDate]) =>
    matchesForDate.filter(
      (match) =>
        (match.squad_home.name
          .toLowerCase()
          .includes(filterSquad.toLowerCase()) ||
          match.squad_away.name
            .toLowerCase()
            .includes(filterSquad.toLowerCase())) &&
        match.squad_home.category
          .toLowerCase()
          .includes(filterCategory.toLowerCase())
    )
  );

  return (
    <div className="container flex-1 space-y-4 p-4 md:p-8">
      <h1 className="text-center text-2xl font-bold">
        {tournament.at(0)?.name}
      </h1>
      <h3 className="text-center !mt-0">{tournament.at(0)?.description}</h3>

      <div className="grid grid-cols-2 w-full items-center gap-1.5 sticky top-[56px] bg-white z-[2] pb-2">
        <div className="text-center">
          <Label>Nome squadra</Label>
          <Select onValueChange={handleFilterChangeSquad}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona la squadra" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Tutte</SelectItem>
                {squads.map((squad) => {
                  return (
                    <SelectItem key={squad} value={squad}>
                      {squad}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="text-center">
          <Label>Categoria</Label>
          <Select onValueChange={handleFilterChangeCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona la categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Tutte</SelectItem>
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
        </div>
      </div>

      {filterData.map((matchesForDate, index) => (
        <div key={index}>
          {matchesForDate[0]?.day ? (
            <div className="sticky top-[120px] bg-white z-[1]">
              <h2 className="text-center text-sm font-bold mb-2">
                {dateFormatItalian(matchesForDate[0]?.day, options)}
              </h2>
              <Separator className="h-[2px] mb-2" />
            </div>
          ) : null}
          <div className="grid gap-2 md:grid-cols-2 place-items-center">
            {matchesForDate.map((match) => (
              <RowMatch key={match.id} matchProps={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
