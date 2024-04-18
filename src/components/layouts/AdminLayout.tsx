import AdminHeader from "@/components/header/AdminHeader";
import AdminSidebar from "../sidebar/AdminSidebar";
import { Toaster } from "@/components/ui/toaster";
import AdminFooter from "../footer/AdminFooter";
import { footerAdminItems } from "@/constants/data";
import { MenuContextProvider } from "@/contexts/admin_menu_context";

const DashboardLayout = ({ children }: any) => {
  return (
    <MenuContextProvider>
      <AdminHeader />
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="w-full pt-16">{children}</main>
        <Toaster />
      </div>
      <AdminFooter />
    </MenuContextProvider>
  );
};

export default DashboardLayout;
