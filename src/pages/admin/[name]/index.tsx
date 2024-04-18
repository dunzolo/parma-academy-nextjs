// #REACT
import { GetServerSideProps, GetServerSidePropsContext } from "next";
// # LAYOUT
import DashboardLayout from "@/components/layouts/AdminLayout";
// #UI COMPONENTS
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupClient } from "@/components/tables/group-table/client";
import { ScrollArea } from "@/components/ui/scroll-area";
// # SUPABASE
import { getRankingByGroup } from "@/api/supabase";
// # MODELS
import { SquadGroup } from "@/models/SquadGroup";
// # UTILS
import { getGroupedData } from "@/utils/utils";
import { handleRedirect } from "@/utils/supabase/redirect";

type Props = {
  groups: SquadGroup[][];
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const responseRedirect = await handleRedirect(context);

  if (responseRedirect.redirect) return responseRedirect;

  try {
    const groups = await getRankingByGroup(["A", "B", "C", "D", "E", "F"]);
    return {
      props: {
        groups,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default function page({ groups }: Props) {
  const allData = (groups as SquadGroup[][])
    .flat()
    .reduce<SquadGroup[]>((acc, curr) => acc.concat(curr), []);

  const groupedDataEsordienti = getGroupedData(allData, "ESORDIENTI");
  const groupedData2013 = getGroupedData(allData, "2013");
  const groupedData2014 = getGroupedData(allData, "2014");

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <Tabs defaultValue="esordienti" className="space-y-4">
          <TabsList>
            <TabsTrigger value="esordienti">Esordienti</TabsTrigger>
            <TabsTrigger value="pulcini_2013">2013</TabsTrigger>
            <TabsTrigger value="pulcini_2014">2014</TabsTrigger>
          </TabsList>
          <TabsContent value="esordienti" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(groupedDataEsordienti).map(([group, data]) => (
                <Card key={group}>
                  <CardHeader className="flex flex-row items-center justify-center space-y-0 p-2">
                    <CardTitle className="text-sm font-medium">
                      GIRONE {group}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <GroupClient data={data} />
                  </CardContent>
                  <div className="flex-1 text-sm text-muted-foreground text-center space-x-2 py-2">
                    {/* //TODO: inserire testo in riferimento al girone */}
                    Classifica aggiornata
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="pulcini_2013" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(groupedData2013).map(([group, data]) => (
                <Card key={group}>
                  <CardHeader className="flex flex-row items-center justify-center space-y-0 p-2">
                    <CardTitle className="text-sm font-medium">
                      GIRONE {group}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <GroupClient data={data} />
                  </CardContent>
                  <div className="flex-1 text-sm text-muted-foreground text-center space-x-2 py-2">
                    {/* //TODO: inserire testo in riferimento al girone */}
                    Classifica aggiornata
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="pulcini_2014" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(groupedData2014).map(([group, data]) => (
                <Card key={group}>
                  <CardHeader className="flex flex-row items-center justify-center space-y-0 p-2">
                    <CardTitle className="text-sm font-medium">
                      GIRONE {group}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <GroupClient data={data} />
                  </CardContent>
                  <div className="flex-1 text-sm text-muted-foreground text-center space-x-2 py-2">
                    {/* //TODO: inserire testo in riferimento al girone */}
                    Classifica aggiornata
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
