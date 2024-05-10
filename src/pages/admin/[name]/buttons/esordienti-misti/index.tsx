import { GetServerSideProps, GetServerSidePropsContext } from "next";
import DashboardLayout from "@/components/layouts/AdminLayout";
import { Squad } from "@/models/Squad";
import { handleRedirect } from "@/utils/supabase/redirect";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { SquadGroup } from "@/models/SquadGroup";
import {
  createGroup,
  getRankingByGroup,
  updateSquadWithGroupFinal,
} from "@/api/supabase";
import NewMatchForm from "../getNewMatchForm";

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
        slug,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

Page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default function Page({ slug }: Props) {
  const [selectedForm, setSelectedForm] = useState("form1"); // Stato per tenere traccia del form selezionato

  const handleFormSwitch = (formName: string) => {
    setSelectedForm(formName); // Funzione per aggiornare lo stato al click del bottone
  };

  const handleFirstGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const groups = await getRankingByGroup(["L", "M", "N"], slug as string);
    await generateFirstGroup(groups, "group_eso_misti_first");
  };

  const handleSecondGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const groups = await getRankingByGroup(["L", "M", "N"], slug as string);
    await generateSecondGroup(groups, "group_eso_misti_second");
  };

  const handleThirdGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const groups = await getRankingByGroup(["L", "M", "N"], slug as string);
    await generateThirdGroup(groups, "group_eso_misti_third");
  };

  const handleFourthGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const groups = await getRankingByGroup(["L", "M", "N"], slug as string);
    await generateFourthGroup(groups, "group_eso_misti_fourth");
  };

  const generateFirstGroup = async (groups: SquadGroup[][], name: string) => {
    //recupero dal girone L la prima classificata
    const first_team = parseInt(groups[0][0].squad_id.id);
    //recupero dal girone M la terza classificata
    const second_team = parseInt(groups[1][2].squad_id.id);
    //recupero dal girone N la quarta classificata
    const third_team = parseInt(groups[2][3].squad_id.id);
    await updateSquad(first_team, name);
    await updateSquad(second_team, name);
    await updateSquad(third_team, name);
    await generateGroup(name, first_team, second_team, third_team);
  };

  const generateSecondGroup = async (groups: SquadGroup[][], name: string) => {
    //recupero dal girone M la prima classificata
    const first_team = parseInt(groups[1][0].squad_id.id);
    //recupero dal girone N la terza classificata
    const second_team = parseInt(groups[2][2].squad_id.id);
    //recupero dal girone L la quarta classificata
    const third_team = parseInt(groups[0][3].squad_id.id);
    await updateSquad(first_team, name);
    await updateSquad(second_team, name);
    await updateSquad(third_team, name);
    await generateGroup(name, first_team, second_team, third_team);
  };

  const generateThirdGroup = async (groups: SquadGroup[][], name: string) => {
    //recupero dal girone N la prima classificata
    const first_team = parseInt(groups[2][0].squad_id.id);
    //recupero dal girone L la terza classificata
    const second_team = parseInt(groups[0][2].squad_id.id);
    //recupero dal girone M la quarta classificata
    const third_team = parseInt(groups[1][3].squad_id.id);
    await updateSquad(first_team, name);
    await updateSquad(second_team, name);
    await updateSquad(third_team, name);
    await generateGroup(name, first_team, second_team, third_team);
  };

  const generateFourthGroup = async (groups: SquadGroup[][], name: string) => {
    //recupero dal girone L la seconda classificata
    const first_team = parseInt(groups[0][1].squad_id.id);
    //recupero dal girone M la seconda classificata
    const second_team = parseInt(groups[1][1].squad_id.id);
    //recupero dal girone N la seconda classificata
    const third_team = parseInt(groups[2][1].squad_id.id);
    await updateSquad(first_team, name);
    await updateSquad(second_team, name);
    await updateSquad(third_team, name);
    await generateGroup(name, first_team, second_team, third_team);
  };

  const generateGroup = async (
    name: string,
    first_team: number,
    second_team: number,
    third_team: number
  ) => {
    try {
      await createGroup(name, first_team);
      await createGroup(name, second_team);
      await createGroup(name, third_team);
    } catch (error: any) {
      console.log(error);
    }
  };

  const updateSquad = async (team_id: number, group_final_name: string) => {
    try {
      console.log(team_id, group_final_name);
      await updateSquadWithGroupFinal(team_id, group_final_name);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="grid grid-cols-1">
        <div className="flex items-center justify-between mb-3">
          <Heading
            title={`Primo triangolare`}
            description="crea le partite della fase finale"
          />
          <form onSubmit={handleFirstGroup}>
            <Button type="submit" className="mt-1">
              GENERA
            </Button>
          </form>
        </div>
        <div className="flex items-center justify-between mb-3">
          <Heading
            title={`Secondo triangolare`}
            description="crea le partite della fase finale"
          />
          <form onSubmit={handleSecondGroup}>
            <Button type="submit" className="mt-1">
              GENERA
            </Button>
          </form>
        </div>
        <div className="flex items-center justify-between mb-3">
          <Heading
            title={`Terzo triangolare`}
            description="crea le partite della fase finale"
          />
          <form onSubmit={handleThirdGroup}>
            <Button type="submit" className="mt-1">
              GENERA
            </Button>
          </form>
        </div>
        <div className="flex items-center justify-between mb-3">
          <Heading
            title={`Quarto triangolare`}
            description="crea le partite della fase finale"
          />
          <form onSubmit={handleFourthGroup}>
            <Button type="submit" className="mt-1">
              GENERA
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => handleFormSwitch("form1")}>
          Primo triangolare
        </Button>
        <Button onClick={() => handleFormSwitch("form2")}>
          Secondo triangolare
        </Button>
        <Button onClick={() => handleFormSwitch("form3")}>
          Terzo triangolare
        </Button>
        <Button onClick={() => handleFormSwitch("form4")}>
          Quarto triangolare
        </Button>
      </div>

      {/* Mostra il form selezionato */}
      {selectedForm === "form1" && (
        <NewMatchForm slug={slug} group={"eso_misti_first"} />
      )}
      {selectedForm === "form2" && (
        <NewMatchForm slug={slug} group={"eso_misti_second"} />
      )}
      {selectedForm === "form3" && (
        <NewMatchForm slug={slug} group={"eso_misti_third"} />
      )}
      {selectedForm === "form4" && (
        <NewMatchForm slug={slug} group={"eso_misti_fourth"} />
      )}
    </div>
  );
}
