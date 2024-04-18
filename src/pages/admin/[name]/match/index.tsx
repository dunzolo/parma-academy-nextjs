import {
  getAllCategories,
  getAllDistinctSquads,
  getAllMatch,
} from "@/api/supabase";
import BreadCrumb from "@/components/Breadcrumb";
import DashboardLayout from "@/components/layouts/AdminLayout";
import { MatchClient } from "@/components/tables/match-table/client";
import { MatchDatum } from "@/models/Match";
import { handleRedirect } from "@/utils/supabase/redirect";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

type Props = {
  matches: MatchDatum[];
  categories: string[];
  squads: string[];
  slug: string;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const responseRedirect = await handleRedirect(context);

  if (responseRedirect.redirect) return responseRedirect;

  const slug = context.params?.name?.toString();

  try {
    return {
      props: {
        matches: await getAllMatch(slug as string),
        categories: await getAllCategories(slug as string),
        squads: await getAllDistinctSquads(slug as string),
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

export default function page({ matches, categories, squads, slug }: Props) {
  const breadcrumbItems = [{ title: "Match", link: `/admin/${slug}/match` }];
  return (
    <>
      <div className="flex-1 space-y-4 px-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <MatchClient
          data={matches}
          categories={categories}
          squads={squads}
          slug={slug}
        />
      </div>
    </>
  );
}
