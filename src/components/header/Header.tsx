import { cn } from "@/lib/utils";
import Link from "next/link";
import { HeaderMobile } from "./HeaderMobile";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/dlzvlthdr/image/upload/v1713817769/webapp-tournament/tournaments_logos/ioemejleaaqvlfyycyme.png"
            alt="logo"
            width={512}
            height={512}
            className="w-12 h-12"
          />
        </Link>
        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/copa-crozada-2024" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Categorie
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className={cn("block lg:!hidden")}>
          <HeaderMobile />
        </div>
      </nav>
    </div>
  );
}
