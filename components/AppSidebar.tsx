"use client";

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
  Bot,
  Compass,
  LayoutDashboard,
  PencilRulerIcon,
  UserCircle2Icon,
  WalletCards,
  BarChart2,
  MapPin,
  GraduationCap,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./AddNewCourseDialog";

const AppSidebar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  const adminEmails = [
    "vivekvrc777@gmail.com",
    "ashrafgalibshaik@gmail.com",
    "yasodamalavya2006@gmail.com",
    "myvini1411@gmail.com"
  ];

  const isAdmin =
    user &&
    adminEmails.includes(user?.primaryEmailAddress?.emailAddress as string);

  const SidebarOptions = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/workspace",
    },
    {
      title: "Career Guide",
      icon: GraduationCap,
      path: "/workspace/career-guide",
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
      title: "NSQF Mapping",
      icon: MapPin,
      path: "/workspace/nsqf-mapping",
    },
    {
      title: "AI Tools",
      icon: PencilRulerIcon,
      path: "/workspace/ai-tools",
    },
    {
      title: "Leaderboard",
      icon: Trophy,
      path: "/workspace/leaderboard",
    },
    {
      title: "Assistant",
      icon: Bot,
      path: "/workspace/assistant",
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
    ...(isAdmin
      ? [
          {
            title: "Admin Panel",
            icon: BarChart2,
            path: "/workspace/analytics",
          },
        ]
    : []),
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex items-center flex-row">
        <Image src={"/favicon.png"} alt="logo" width={60} height={60} />
        <p className="text-lg font-bold">EruditeAI</p>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <SidebarGroup className="flex-shrink-0">
          <AddNewCourseDialog>
            <Button className="cursor-pointer w-full">Create New Course</Button>
          </AddNewCourseDialog>
        </SidebarGroup>
        <SidebarGroup className="flex-1 overflow-hidden flex flex-col">
          <SidebarGroupContent className="flex-1 overflow-y-auto">
            <SidebarMenu>
              {SidebarOptions.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className="p-5">
                    <Link
                      href={item.path}
                      className={`text-[17px] ${
                        pathname === item.path
                          ? "text-primary bg-purple-100"
                          : "text-gray-600 hover:text-black"
                      } flex items-center space-x-3`}>
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
      <SidebarFooter className="md:bg-none bg-[#FFFFFF] flex-shrink-0">
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
