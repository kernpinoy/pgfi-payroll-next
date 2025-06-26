import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ReactQueryProvider from "@/providers/react-query-client";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "PFGFI Payroll - Home",
  description: "PFGFI Payroll - Home",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="border-2 shadow-2xl">
        <SiteHeader />
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
