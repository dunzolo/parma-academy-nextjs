"use client";
// #REACT
import { useState } from "react";
// #NEXT
import { useRouter } from "next/navigation";
// #ICON
import { Edit, Trash } from "lucide-react";
// #UI COMPONENT
import { Button } from "@/components/ui/button";
// #MODEL
import { Squad } from "@/models/Squad";

interface CellActionProps {
  data: Squad;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => { };

  return (
    <>
      <div className="flex">
        <Button className="mr-2" onClick={() => router.push(`/dashboard/user/${data.id}`)}>
          <Edit className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:block">Update</span>
        </Button>
        <Button className="bg-red-700" onClick={() => setOpen(true)}>
          <Trash className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:block">Delete</span>
        </Button>
      </div>
    </>
  );
};
