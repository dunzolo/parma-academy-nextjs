import { getSquadsByGroup } from "@/api/supabase";
import { Squad } from "@/models/Squad";
import { GetServerSideProps } from "next";

type Props = {
    squads: Squad
}

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const squads = await getSquadsByGroup('A');
        return {
            props: {
                squads,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
};

export default function Classifica({ squads }: Props) {
    return (
        <div>
            <h1>Classifica</h1>
            <pre>{JSON.stringify(squads, null, 2)}</pre>
        </div>
    )
}