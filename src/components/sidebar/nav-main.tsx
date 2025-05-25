"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link
                    href={item.url}
                    prefetch={true}
                    className={cn(
                      "flex items-center gap-2 px-3 transition-colors",
                      isActive
                        ? "bg-muted !text-primary font-semibold hover:bg-muted !hover:text-primary"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className="w-4 h-4 align-middle"
                        aria-hidden="true"
                      />
                    )}
                    <span className="align-middle">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
