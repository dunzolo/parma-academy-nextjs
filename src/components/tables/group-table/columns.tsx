"use client";
import { ColumnDef } from "@tanstack/react-table";
import { SquadGroup } from "@/models/SquadGroup";

export const columns: ColumnDef<SquadGroup>[] = [
  {
    accessorKey: "squad_id.logo",
    header: "LOGO",
  },
  {
    accessorKey: "squad_id.name",
    header: "NOME",
  },
  {
    accessorKey: "points",
    header: "PT",
  },
  {
    accessorKey: "goal_scored",
    header: "GF",
  },
  {
    accessorKey: "goal_conceded",
    header: "GS",
  },
  {
    accessorKey: "goal_difference",
    header: "+/-",
  },
];
