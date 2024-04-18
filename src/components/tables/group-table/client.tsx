"use client";
// #MODELS
import { SquadGroup } from "@/models/SquadGroup";
// #UI COMPONENTS
import { DataTable } from "@/components/ui/data-table";
// #COLUMNS
import { columns } from "./columns";

interface GroupClientProps {
  data: SquadGroup[];
}

export const GroupClient: React.FC<GroupClientProps> = ({ data }) => {
  return <DataTable columns={columns} data={data} isRanking={true} />;
};
