import { getAllCategoriesTournament, getTournament } from "@/api/supabase";
import RootLayout from "@/components/layouts/RootLayout";
import { Separator } from "@/components/ui/separator";
import { Category } from "@/models/Category";
import { Tournament } from "@/models/Tournament";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";

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
          <>
            <Link
              href={`/${tournament.at(0)?.slug}/${category.name.toLowerCase()}`}
            >
              <div className="flex items-center gap-4 space-y-1">
                <Image
                  src="https://res.cloudinary.com/dlzvlthdr/image/upload/v1711795335/webapp-tournament/team-amateurs/u1ppznudrgcewbfd7u1y.png"
                  alt="logo"
                  width={512}
                  height={512}
                  className="w-12 h-12"
                />
                <div>
                  <h4 className="text-sm font-medium leading-none">
                    {category.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
            <Separator className="my-4" />
          </>
        );
      })}
    </div>
  );
}

{
  /* <div>
  <ul>
    <li>
      Modalità di gioco: <strong>9 vs 9</strong>
    </li>
    <li>
      <strong>Due tempi di gioco da 15 minuti</strong> con interruzione di 3
      minuti tra i due tempi per consentire cambi e rapidi feedback
    </li>
    <li>Rimessa laterale con le mani</li>
    <li>Autorizzati i calci di punizione diretti (distanza barriera: 7mt)</li>
    <li>
      Autorizzati i calci di rigore per evidenti infrazioni (distanza: 9 mt)
    </li>
    <li>Previsto il fuorigioco negli ultimi 16,5 mt</li>
    <li>
      Il retropassaggio <strong>NON</strong> può essere preso con le mani dal
      portiere anche all’interno dell’area di rigore
    </li>
    <li>
      In occasione del primo passaggio nella rimessa da fondocampo, non è
      permesso ai giocatori della squadra avversaria superare la linea
      determinata dal limite dell’area di rigore e dal suo prolungamento fino
      alla linea laterale (zona “No Pressing”)
    </li>
    <li>
      I cambi sono volanti ed è consigliabile far giocare tutti/e in ogni
      partita a meno che, precedentemente alla partita, non si sia concordata
      direttamente con la squadra avversaria la volontà o la necessità di non
      far giocare alcuni/alcune tesserati/e causa infortunio o scelta tecnica
    </li>
  </ul>
</div> */
}
