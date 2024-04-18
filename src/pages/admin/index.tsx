// #REACT
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";
// #UI COMPONENTS
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
// # SUPABASE
import { getAllCurrentYearTournaments } from "@/api/supabase";
// # MODELS
import { Tournament } from "@/models/Tournament";
// # UTILS
import { dateFormatItalian, generateSlug, getGroupedData } from "@/utils/utils";
import { handleRedirect } from "@/utils/supabase/redirect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  currentTournaments: Tournament[];
};

const options = {
  month: "long",
  day: "numeric",
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const responseRedirect = await handleRedirect(context);

  if (responseRedirect.redirect) return responseRedirect;

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

export default function page({ currentTournaments }: Props) {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Ciao, Bentornato! 👋
          </h2>
        </div>
        <div className="container flex-1 space-y-4 p-4 md:p-8">
          <Accordion type="single" defaultValue="item-1" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>{new Date().getFullYear()}</AccordionTrigger>
              <AccordionContent className="pb-0">
                {currentTournaments?.map((tournament) => {
                  return (
                    <Link
                      key={tournament.id}
                      href={`/admin/${generateSlug(tournament.name)}`}
                    >
                      <Card className="mb-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-2xl font-bold">
                            {tournament.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm font-medium">
                            📆 Dal{" "}
                            {dateFormatItalian(tournament.date_start, options)}{" "}
                            al {dateFormatItalian(tournament.date_end, options)}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </ScrollArea>
  );
}
