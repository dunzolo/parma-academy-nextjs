// #LAYOUT
import DashboardLayout from "@/components/layouts/AdminLayout";
// #SUPABASE
import { getAllDays, getMatchesByDate } from "@/api/supabase";
// #MODELS
import { MatchDatum } from "@/models/Match";
// #UTILS
import { dateFormatItalian } from "@/utils/utils";
// #NEXT & REACT
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { useState } from "react";
// #UI COMPONENTS
import { ScrollArea } from "@/components/ui/scroll-area";
import BreadCrumb from "@/components/Breadcrumb";
import { MatchForm } from "@/components/forms/match-form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleRedirect } from "@/utils/supabase/redirect";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";

type Props = {
  daysProps: string[];
  slug: string;
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
  const responseRedirect = await handleRedirect(context);
  const slug = context.params?.name?.toString();

  if (responseRedirect.redirect) return responseRedirect;

  try {
    const daysProps = await getAllDays(slug as string);
    return {
      props: {
        daysProps,
        slug,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

Update.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default function Update({ daysProps, slug }: Props) {
  const breadcrumbItems = [
    { title: "Match", link: `/admin/${slug}/match` },
    { title: "Inserisci risultati", link: `/admin/${slug}/match/update` },
  ];

  const [selectedDay, setSelectedDay] = useState<MatchDatum[]>([]);

  const handleSelectDay = async (event: any) => {
    const data = await getMatchesByDate(event);
    setSelectedDay(data);
  };

  return (
    <div>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-center justify-between">
          <Heading
            title="Inserisci i risultati"
            description="in questa sezione puoi inserire i risultati del torneo selezionando la giornata"
          />
        </div>
        <Separator />

        <div className="sticky top-[56px] z-[1] bg-white !mt-0 py-3">
          <Label>Seleziona la giornata</Label>
          <Select onValueChange={handleSelectDay}>
            <SelectTrigger className="w-full md:w-1/4">
              <SelectValue placeholder="Seleziona" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {daysProps.map((day) => {
                  return (
                    <SelectItem key={day} value={day}>
                      {dateFormatItalian(day, options)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 w-[95%] mx-auto !mb-[64px]">
          {selectedDay.map((item) => {
            return <MatchForm initialData={item} key={item.id} />;
          })}
        </div>
      </div>
    </div>
  );
}
