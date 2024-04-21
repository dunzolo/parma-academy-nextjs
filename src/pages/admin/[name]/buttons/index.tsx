import { GetServerSideProps, GetServerSidePropsContext } from "next";
import DashboardLayout from "@/components/layouts/AdminLayout";
import { Squad } from "@/models/Squad";
import { handleRedirect } from "@/utils/supabase/redirect";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { getAllSquads } from "@/api/supabase";
import Link from "next/link";

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
  return (
    <div className="container">
      <div className="grid md:grid-cols-2">
        <div className="text-center mb-3">
          <Heading
            title={`Pulcini primo anno`}
            description="crea le partite della fase finale"
          />
          <Link href={`/admin/${slug}/buttons/pulcini-primo-anno`}>
            <Button>GENERA</Button>
          </Link>
        </div>
        <div className="text-center mb-3">
          <Heading
            title={`Pulcini misti`}
            description="crea le partite della fase finale"
          />
          <Link href={`/admin/${slug}/buttons/pulcini-misti`}>
            <Button>GENERA</Button>
          </Link>
        </div>
        <div className="text-center mb-3">
          <Heading
            title={`Esordienti primo anno`}
            description="crea le partite della fase finale"
          />
          <Link href={`/admin/${slug}/buttons/esordienti-primo-anno`}>
            <Button>GENERA</Button>
          </Link>
        </div>
        <div className="text-center mb-3">
          <Heading
            title={`Esordienti misti`}
            description="crea le partite della fase finale"
          />
          <Link href={`/admin/${slug}/buttons/esordienti-misti`}>
            <Button>GENERA</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
