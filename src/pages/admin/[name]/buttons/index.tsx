import { GetServerSideProps, GetServerSidePropsContext } from "next";
import DashboardLayout from "@/components/layouts/AdminLayout";
import {
  createGroup,
  getAllSquads,
  getRankingByGroup,
} from "../../../../api/supabase";
import { Squad } from "@/models/Squad";
import { handleRedirect } from "@/utils/supabase/redirect";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";
import { Heading } from "@/components/ui/heading";
import { SquadGroup } from "@/models/SquadGroup";
import { NewMatchForm } from "./getNewMatchForm";

type Props = {
  squads: Squad[];
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
        squads: await getAllSquads(slug as string),
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

export default function page({ slug }: Props) {
  const generateGroup = async (groups: SquadGroup[][], name: string) => {
    //recupero la prima e la seconda classificata del primo girone
    const first_team_first_group = parseInt(groups[0][0].squad_id.id);
    const second_team_first_group = parseInt(groups[0][1].squad_id.id);

    //recupero la prima e la seconda classificata del primo girone
    const first_team_second_group = parseInt(groups[1][0].squad_id.id);
    const second_team_second_group = parseInt(groups[1][1].squad_id.id);

    try {
      await createGroup(name, first_team_first_group);
      await createGroup(name, second_team_first_group);
      await createGroup(name, first_team_second_group);
      await createGroup(name, second_team_second_group);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSubmitGroup2014 = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const groups = await getRankingByGroup(["G", "H"]);
    await generateGroup(groups, "group_final_2014");
  };

  const handleSubmitGroup2013 = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const groups = await getRankingByGroup(["E", "F"]);
    await generateGroup(groups, "group_final_2013");
  };

  return (
    <div className="container">
      <div className="grid md:grid-cols-2">
        <div className="text-center mb-3">
          <Heading
            title={`Girone finale 2014`}
            description="crea il girone finale per i 2014"
          />
          <form onSubmit={handleSubmitGroup2014}>
            <Button type="submit" className="mt-1">
              GENERA
            </Button>
          </form>
        </div>
        <div className="text-center mb-3">
          <Heading
            title={`Girone finale 2013`}
            description="crea il girone finale per i 2013"
          />
          <form onSubmit={handleSubmitGroup2013}>
            <Button type="submit" className="mt-1">
              GENERA
            </Button>
          </form>
        </div>
      </div>

      <NewMatchForm slug={slug} group={"final_2013"} />
    </div>
  );
}
