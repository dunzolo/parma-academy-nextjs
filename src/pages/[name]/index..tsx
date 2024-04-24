import {
  getAllCategoriesTournament,
  getSquadsByCategory,
  getTournament,
} from "@/api/supabase";
import RootLayout from "@/components/layouts/RootLayout";
import { Separator } from "@/components/ui/separator";
import { Category } from "@/models/Category";
import { Tournament } from "@/models/Tournament";
import { count } from "console";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  tournament: Tournament[];
  categories: Category[];
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const slug = context.params?.name?.toString();

  try {
    return {
      props: {
        tournament: await getTournament(slug as string),
        categories: await getAllCategoriesTournament(slug as string),
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

export default function Home({ tournament, categories }: Props) {
  return (
    <div className="container flex-1 space-y-4 p-4 md:p-8">
      <h1 className="text-center text-2xl font-bold">
        {tournament.at(0)?.name}
      </h1>
      <h3 className="text-center !mt-0">{tournament.at(0)?.description}</h3>

      {categories.map((category) => {
        return (
          <div className="mt-4" key={category.id}>
            <Link
              href={`/${tournament.at(0)?.slug}/${category.name.toLowerCase()}`}
            >
              <div className="flex items-center gap-4 space-y-1">
                <Image
                  src={
                    tournament.at(0)?.logo ??
                    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngfind.com%2Fmpng%2FiJooxRm_default-avatar-svg-png-icon-free-download-avatar%2F&psig=AOvVaw0qxi0_fiy-wvNoamEjfYqq&ust=1714076048595000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMCmj4TV24UDFQAAAAAdAAAAABAY"
                  }
                  alt="logo"
                  width={512}
                  height={512}
                  className="w-14 h-14"
                />
                <div>
                  <h4 className="text-base font-semibold leading-none">
                    {category.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
            <Separator className="!my-2" />
          </div>
        );
      })}
    </div>
  );
}

{
  /* <div>
  <ul>
    <li>
    Le gare si svolgeranno con la <strong>Modalità di Gioco 9 vs 9</strong>.
    </li>
    <li>
      Ufficiali di gara: Le partite saranno arbitrate da <strong>Arbitri Ufficiali dell’Associazione Italiana Arbitri</strong>, appartenenti alle Sezioni territorialmente competenti.
    </li>
    <li><strong>Due tempi di gioco da 15'</strong> con time out tecnico a metà per consentire cambi e rapidi feedback.</li>
    <li>Rimessa laterale con le mani.</li>
    <li>
      <strong>Dimensioni della porta: 6x2 metri</strong> (in alternativa, comprese tra i seguenti valori: 5-6 x 1,80-2 metri).
    </li>
    <li>
      Il pallone utilizzato per le gare è convenzionalmente identificato con il numero “4”.
    </li>
    <li>
      <strong>Consegna Distinta Gara obbligatoria</strong> a inizio torneo, sostituzioni libere e a discrezione degli allenatori che garantiranno l’utilizzo di tutte le calciatrici durante lo svolgimento del torneo.
    </li>
    <li>
      <strong>In occasione di ogni le partecipanti alla gara dovranno salutarsi fra loro</strong> sia all’inizio che alla fine di ogni confronto, utilizzando la stessa cerimonia. In
entrambe le occasioni le partecipanti dovranno schierarsi a centrocampo insieme all’
arbitro, salutando il pubblico e la squadra avversaria.
    </li>
  </ul>
</div> */
}
