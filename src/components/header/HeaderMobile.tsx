"use client";
import { DashboardNav } from "@/components/DashboardNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItemsRoot } from "@/constants/data";
import { MenuContextProvider, useMenuContext } from "@/contexts/menu_context";
import { MenuIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function HeaderMobile({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);

  let { menu_items } = useMenuContext();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="!px-0">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Menù
            </h2>
            <div className="space-y-1">
              <DashboardNav
                items={[...navItemsRoot, ...menu_items]}
                setOpen={setOpen}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
