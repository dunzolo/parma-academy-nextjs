// #REACT
import { GetServerSideProps, GetServerSidePropsContext } from "next";
// # LAYOUT
import DashboardLayout from "@/components/layouts/AdminLayout";
// #UI COMPONENTS
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupClient } from "@/components/tables/group-table/client";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    return {
      props: {},
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default function page({}: Props) {
  return <></>;
}
