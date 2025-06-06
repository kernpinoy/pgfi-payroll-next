"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { type ComponentProps } from "react";
import NavUser from "./nav-user";
import NavMain from "./nav-main";
import {
  CalendarIcon,
  HandCoinsIcon,
  HouseIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

interface Item {
  title: string;
  url: string;
  icon?: LucideIcon;
}

type Items = Item[];

const items: Items = [
  // Declare as Items (an array of Item)
  {
    title: "Home",
    url: "/home",
    icon: HouseIcon,
  },
  {
    title: "Employees",
    url: "/home/employees",
    icon: UserIcon,
  },
  {
    title: "Attendance",
    url: "/home/attendance",
    icon: CalendarIcon,
  },
  {
    title: "Payroll",
    url: "/home/payroll",
    icon: HandCoinsIcon,
  },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 flex justify-center"
            >
              <Link href="/home" prefetch={true}>
                <span className="text-base font-semibold">PGFI Payroll</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
        {/* <NavDocuments items={data.documents} />
            <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
