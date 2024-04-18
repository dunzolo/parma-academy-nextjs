import Header from "@/components/header/Header";
import { MenuContextProvider } from "@/contexts/menu_context";

const RootLayout = ({ children }: any) => {
  return (
    <MenuContextProvider>
      <Header />
      <div className="flex h-screen">
        <main className="w-full pt-16">{children}</main>
      </div>
    </MenuContextProvider>
  );
};

export default RootLayout;
