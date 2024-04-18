import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Icons } from "../Icons";
import { Dispatch, SetStateAction } from "react";

interface DashboardNavProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function AdminFooter({ setOpen }: DashboardNavProps) {
  const path = usePathname();
  const { name } = useParams();

  const items = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: "dashboard",
      label: "Dashboard",
    },
    {
      title: "Aggiungi",
      href: `/admin/${name}/match/update`,
      icon: "pencil",
      label: "Aggiungi",
    },
  ] as NavItem[];

  if (!items?.length) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-t bg-background/95 backdrop-blur z-20">
      <nav className="h-16 flex items-center justify-around px-4">
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];
          return (
            item.href && (
              <div className="w-20">
                <Link
                  key={index}
                  href={item.disabled ? "/" : item.href}
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      "group flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      path === item.href ? "bg-accent" : "transparent",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </span>
                </Link>
              </div>
            )
          );
        })}
      </nav>
    </div>
  );
}
