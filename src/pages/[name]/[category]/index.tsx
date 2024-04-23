import {
  getAllCategories,
  getAllDistinctSquads,
  getAllMatch,
  getAllMatchFinalPhaseGroupByDay,
  getAllMatchGroupByDay,
  getAllMatchProvisionalsGroupByDay,
  getAllSquads,
  getGroupsByCategory,
  getGroupsByCategoryFinalPhase,
  getRankingByFinalGroup,
  getRankingByGroup,
  getRulesCurrentCategory,
  getSingleCategory,
  getTournament,
} from "@/api/supabase";
import RootLayout from "@/components/layouts/RootLayout";
import RowMatch from "@/components/row-match/row-match";
import RowMatchProvisional from "@/components/row-match/row-match-provisional";
import { GroupClient } from "@/components/tables/group-table/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/models/Category";
import { Match, MatchDatum, MatchProvisionalDatum } from "@/models/Match";
import { Squad } from "@/models/Squad";
import { SquadGroup } from "@/models/SquadGroup";
import { Tournament } from "@/models/Tournament";
import { dateFormatItalian } from "@/utils/utils";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";

type Props = {
  tournament: Tournament[];
  category: Category;
  squads: string[];
  matches: { [key: string]: MatchDatum[] };
  matches_final_phase: { [key: string]: MatchDatum[] };
  groups: SquadGroup[][];
  groups_final_phase: SquadGroup[][];
  rules: any;
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
  const category = context.params?.category?.toString();

  try {
    const groupsCategory = await getGroupsByCategory(category);
    const groupsCategoryFinalPhase = await getGroupsByCategoryFinalPhase(
      category
    );

    return {
      props: {
        matches: await getAllMatchGroupByDay(
          slug as string,
          category as string
        ),
        matches_final_phase: await getAllMatchFinalPhaseGroupByDay(
          slug as string,
          category as string,
          true
        ),
        category: await getSingleCategory(category as string),
        groups: await getRankingByGroup(groupsCategory),
        groups_final_phase: groupsCategoryFinalPhase[0]
          ? await getRankingByFinalGroup(groupsCategoryFinalPhase)
          : null,
        squads: await getAllDistinctSquads(slug as string, category as string),
        tournament: await getTournament(slug as string),
        rules: await getRulesCurrentCategory(category as string),
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
  category,
  matches,
  matches_final_phase,
  tournament,
  squads,
  groups,
  groups_final_phase,
  rules,
}: Props) {
  const customWidthTabs = groups_final_phase ? "w-1/4" : "w-1/3";
  const [filterSquad, setFilterSquad] = useState("");

  const handleFilterChangeSquad = (event: any) => {
    if (event === "all") {
      event = "";
    }
    setFilterSquad(event);
  };

  //Filtra i dati in base al campo "name" e "category"
  const filterData = Object.entries(matches).map(([date, matchesForDate]) =>
    matchesForDate.filter(
      (match) =>
        match.squad_home.name
          .toLowerCase()
          .includes(filterSquad.toLowerCase()) ||
        match.squad_away.name.toLowerCase().includes(filterSquad.toLowerCase())
    )
  );

  //Filtra i dati in base al campo "name" e "category"
  const filterDataFinalPhase = Object.entries(matches_final_phase).map(
    ([date, matchesForDate]) =>
      matchesForDate.filter(
        (match) =>
          match.squad_home.name
            .toLowerCase()
            .includes(filterSquad.toLowerCase()) ||
          match.squad_away.name
            .toLowerCase()
            .includes(filterSquad.toLowerCase())
      )
  );

  return (
    <div className="container flex-1 space-y-4 p-4 md:p-8">
      <h1 className="text-center text-2xl font-bold">
        {tournament.at(0)?.name}
      </h1>
      <h3 className="text-center !mt-0">
        Categoria {category.name.toLowerCase()}
      </h3>

      <Tabs defaultValue="partite" className="space-y-4 bg-re">
        <TabsList className="w-full">
          <TabsTrigger className={customWidthTabs} value="partite">
            Partite
          </TabsTrigger>
          <TabsTrigger className={customWidthTabs} value="gironi">
            Gironi
          </TabsTrigger>
          {groups_final_phase && (
            <TabsTrigger className={customWidthTabs} value="fasi_finali">
              Fasi finali
            </TabsTrigger>
          )}
          <TabsTrigger className={customWidthTabs} value="info">
            Info
          </TabsTrigger>
        </TabsList>
        <TabsContent value="partite" className="space-y-4">
          <div className="grid grid-cols-1 w-full items-center gap-1.5 sticky top-[56px] bg-white z-[2] pb-2">
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

          {category.show_final_phase && (
            <>
              <h3 className="font-bold text-center">FASE FINALE</h3>
              {filterDataFinalPhase.map((matchesForDate, index) => (
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
            </>
          )}
        </TabsContent>
        <TabsContent value="gironi" className="space-y-4">
          {Object.entries(groups).map(([group, data]) => (
            <Card key={group}>
              <CardHeader
                className={
                  "flex flex-row items-center justify-center space-y-0 p-2 rounded-t-xl opacity-90 bg-[#2E3C81] text-white"
                }
              >
                <CardTitle className="text-sm font-medium">
                  {data[0].squad_id.show_label_group
                    ? "GIRONE " + data[0].squad_id.group
                    : "GIRONE"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <GroupClient data={data} />
              </CardContent>
              <div className="flex-1 text-sm text-muted-foreground text-center space-x-2 py-2">
                Classifica aggiornata
              </div>
            </Card>
          ))}
        </TabsContent>
        {groups_final_phase && (
          <TabsContent value="fasi_finali" className="space-y-4">
            {Object.entries(groups_final_phase).map(([group, data]) => (
              <Card key={group}>
                <CardHeader
                  className={
                    "flex flex-row items-center justify-center space-y-0 p-2 rounded-t-xl opacity-90 bg-[#2E3C81] text-white"
                  }
                >
                  <CardTitle className="text-sm font-medium">
                    {"GIRONE"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <GroupClient data={data} />
                </CardContent>
                <div className="flex-1 text-sm text-muted-foreground text-center space-x-2 py-2">
                  Classifica aggiornata
                </div>
              </Card>
            ))}
          </TabsContent>
        )}
        <TabsContent value="info" className="space-y-4">
          <h3 className="font-bold text-center">REGOLAMENTO</h3>
          <div
            className="px-4 !mt-0 [&_ul]:list-disc [&_li]:pt-2 [&_li]:text-sm"
            dangerouslySetInnerHTML={{
              __html: rules[0].rule_category_id.description,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
