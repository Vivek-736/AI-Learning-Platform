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
  Code2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./AddNewCourseDialog";
import localFont from "next/font/local";
import { Schibsted_Grotesk } from "next/font/google";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const nohemi = localFont({
  src: [
    {
      path: "../public/fonts/nohemi/Nohemi-Thin-BF6438cc5896c67.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-ExtraLight-BF6438cc58a2634.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-Light-BF6438cc5899919.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-Medium-BF6438cc5883899.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-ExtraBold-BF6438cc5881baf.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-Black-BF6438cc58744d4.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-nohemi",
});

const AppSidebar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  const adminEmails = [
    "vivekvrc777@gmail.com",
    "ashrafgalibshaik@gmail.com",
    "yasodamalavya2006@gmail.com",
  ];

  const isAdmin = user && adminEmails.includes(user?.primaryEmailAddress?.emailAddress as string);

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
      title: "Coding Playground",
      icon: Code2,
      path: "/workspace/coding-playground",
    },
    {
      title: "Opportunities",
      icon: Sparkles,
      path: "/workspace/opportunities",
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
      <SidebarHeader className="p-4 flex items-center flex-row dark:border-b dark:border-gray-800">
        <Image src="/favicon.png" alt="logo" className="rounded-lg bg-black dark:bg-gray-800 dark:ring-1 dark:ring-gray-700" width={40} height={40} />
        <p className={`text-3xl font-normal ${nohemi.className} mt-1 dark:text-gray-100`}>Fascinity</p>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <SidebarGroup className="flex-shrink-0">
          <AddNewCourseDialog>
            <Button className={`cursor-pointer w-full ${schibstedGrotesk.className} dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:shadow-lg dark:shadow-gray-900/20`}>Create New Course</Button>
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
                      className={`text-[17px] ${nohemi.className} ${
                        pathname === item.path
                          ? "text-primary bg-gradient-to-b border-2 border-gray-900 from-gray-200 to-gray-100 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 dark:text-gray-100"
                          : "text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/60"
                      } flex items-center space-x-3 transition-all duration-200`}>
                      <item.icon className="h-7 w-7" />
                      <span className="mt-1">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="md:bg-none bg-[#FFFFFF] dark:bg-gray-900/20 flex-shrink-0">
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.imageUrl}
                alt="User profile"
                className="w-8 h-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
              />
              <div className={`${schibstedGrotesk.className}`}>
                <p className="text-sm font-semibold text-black dark:text-gray-100">
                  {user.fullName || "User"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
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
