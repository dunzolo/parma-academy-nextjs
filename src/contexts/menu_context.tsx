import { getAllCategories } from "@/api/supabase";
import { NavItem } from "@/types";
import { useRouter } from "next/router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface ContextProps {
  menu_items: NavItem[];
}

const Context = createContext<ContextProps | undefined>(undefined);

export const MenuContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<NavItem[]>([]);

  const router = useRouter();
  const { name } = router.query;

  useEffect(() => {
    const getData = async () => {
      const categories = await getAllCategories(name as string);

      let data: NavItem[] = [
        {
          title: "Calendario",
          href: `/${name}`,
          icon: "user",
          label: "Calendario",
        },
      ];

      categories.map((category) =>
        data.push({
          title: `Classifica ${category.toLowerCase()}`,
          href: `/${name}/classifiche/${category.toLowerCase()}`,
          icon: "user",
          label: `Classifica ${category.toLowerCase()}`,
        })
      );

      setData(data);
    };

    getData();
  }, [name]);

  return (
    <Context.Provider value={{ menu_items: data }}>{children}</Context.Provider>
  );
};

export const useMenuContext = () => {
  const value = useContext(Context);
  if (!value) {
    throw Error(
      "Use menu context can only be used inside a menu context provider"
    );
  }
  return value;
};