import {
  getAllCategories,
  getAllMatchGroupByDay,
  getAllCurrentYearTournaments,
  getAllSquads,
} from "@/api/supabase";
import RowMatch from "@/components/row-match/row-match";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tournament } from "@/models/Tournament";
import { dateFormatItalian } from "@/utils/utils";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { generateSlug } from "../utils/utils";
import Image from "next/image";

type Props = {
  currentTournaments: Tournament[];
};

const options = {
  month: "long",
  day: "numeric",
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    return {
      props: {
        currentTournaments: await getAllCurrentYearTournaments(
          new Date().getFullYear()
        ),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export const TournamentCard = ({ tournament }: { tournament: Tournament }) => {
  const [categories, setCategoryCount] = useState<string[]>([]);
  const [squads, setSquadCount] = useState<Tournament[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countCategories = await getAllCategories(tournament.slug);
        const countSquads = await getAllSquads(tournament.slug);
        setCategoryCount(countCategories);
        setSquadCount(countSquads);
      } catch (error) {
        console.error("Error fetching category count:", error);
      }
    };

    fetchData();
  }, [tournament.slug]);

  return (
    <Link href={generateSlug(tournament.name)}>
      <Card className="mb-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{tournament.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between">
          <div className="text-sm font-medium">
            <div>
              🗓 Dal {dateFormatItalian(tournament.date_start, options)} al{" "}
              {dateFormatItalian(tournament.date_end, options)}
            </div>
            <div>
              ⚽️ {categories.length} categorie - {squads.length} squadre
            </div>
          </div>
          <Image
            src={tournament.logo}
            alt="logo"
            width={512}
            height={512}
            className="w-16 h-16"
          />
        </CardContent>
      </Card>
    </Link>
  );
};

export default function Home({ currentTournaments }: Props) {
  return (
    <div className="container flex-1 space-y-4 p-4 md:p-8">
      <h1 className="text-center text-4xl font-bold">Tornei</h1>
      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>{new Date().getFullYear()}</AccordionTrigger>
          <AccordionContent className="pb-0">
            {currentTournaments?.map((tournament) => {
              return (
                <TournamentCard key={tournament.id} tournament={tournament} />
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
