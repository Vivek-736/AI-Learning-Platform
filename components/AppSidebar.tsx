'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import {
  Book,
  Compass,
  LayoutDashboard,
  PencilRulerIcon,
  UserCircle2Icon,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./AddNewCourseDialog";

const AppSidebar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const SidebarOptions = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/workspace",
    },
    {
      title: "My Learning",
      icon: Book,
      path: "/workspace/my-courses",
    },
    {
      title: "Explore Courses",
      icon: Compass,
      path: "/workspace/explore",
    },
    {
      title: "AI Tools",
      icon: PencilRulerIcon,
      path: "/workspace/ai-tools",
    },
    {
      title: "Account Billing",
      icon: WalletCards,
      path: "/workspace/billing",
    },
    {
      title: "My Profile",
      icon: UserCircle2Icon,
      path: "/workspace/profile",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex items-center flex-row">
        <Image src={"/favicon.png"} alt="logo" width={60} height={60} />
        <p className="text-lg font-bold">EruditeAI</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AddNewCourseDialog>
            <Button className="cursor-pointer">
              Create New Course
            </Button>
          </AddNewCourseDialog>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarOptions.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className="p-5">
                    <Link href={item.path} className={`text-[17px] ${pathname === item.path ? "text-primary bg-purple-100" : "text-gray-600 hover:text-black"} flex items-center space-x-3`}>
                      <item.icon className="h-7 w-7" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="md:bg-none bg-white">
        {user && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.imageUrl}
                alt="User profile"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold text-black">
                  {user.fullName || "User"}
                </p>
                <p className="text-xs text-gray-600">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
