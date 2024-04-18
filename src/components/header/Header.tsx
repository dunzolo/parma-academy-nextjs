import { cn } from "@/lib/utils";
import Link from "next/link";
import { HeaderMobile } from "./HeaderMobile";
import Image from "next/image";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href="/">
            <Image
              src="https://res.cloudinary.com/dlzvlthdr/image/upload/v1711795335/webapp-tournament/team-amateurs/u1ppznudrgcewbfd7u1y.png"
              alt="logo"
              width={512}
              height={512}
              className="w-12 h-12"
            />
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <HeaderMobile />
        </div>
      </nav>
    </div>
  );
}
