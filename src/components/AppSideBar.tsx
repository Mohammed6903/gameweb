'use client'

import { History, Sparkles, Flame, RefreshCw } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar
} from "@/components/ui/sidebar"
import React, { useEffect, useState } from 'react'
import { getUsedCategories } from '@/lib/controllers/categories'
import { toast } from 'sonner'
import { capitalizeCategory } from '@/app/(dashboard)/categories/[category]/clientCategory'

const mainNavItems = [
  // { name: "Recently Played", url: "/recent", icon: History },
  { name: "New Games", url: "/new", icon: Sparkles },
  { name: "Trending", url: "/trending", icon: Flame },
  // { name: "Updated", url: "/updated", icon: RefreshCw },
]

interface sidebarProps{
  siteName: string
}

export const AppSideBar: React.FC<sidebarProps> = ({siteName}) => {
  const [categories, setCategories] = useState<{category:string, count: number}[]>([]);
  const { open } = useSidebar();

  useEffect(() => {
    const fetch = async () => {
      const res = await getUsedCategories();
      if (res?.[0] === null){
        toast('OOPS! It seems that there are no games added yet!');
      } else {
        setCategories(res);
      }
    };
    fetch();
  }, [])

  return (
    <Sidebar 
      className={`
        ${open ? 'w-64' : 'w-0 md:w-16'} 
        transition-all duration-300 ease-in-out 
        bg-purple-900
        text-white
        shadow-xl
      `}
    >
      <SidebarHeader className="h-16 flex items-center justify-center border-b bg-purple-700 border-purple-700/50">
        <h1 className={`
          text-2xl font-bold text-white
          transition-opacity duration-300
        `}>
          {siteName ? siteName : 'Game Web'}
        </h1>
      </SidebarHeader>
      <SidebarContent className='bg-purple-700 custom-scrollbar'>
        <SidebarGroup>
          <SidebarGroupLabel className={`
            text-white/90 font-semibold px-4 py-2 text-sm
            ${open ? '' : 'md:hidden'}
          `}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="
                      flex items-center gap-3 py-2.5 px-4 
                      rounded-lg hover:bg-purple-800/50
                      transition-colors duration-200
                      text-white/90 hover:text-white
                    ">
                      <item.icon className="size-5 flex-shrink-0" />
                      <span className={`
                        transition-opacity duration-300 whitespace-nowrap
                      `}>
                        {item.name}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className={`
            text-white/90 font-semibold px-4 py-2 text-sm
            ${open ? '' : 'md:hidden'}
          `}>
            Categories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((item) => (
                <SidebarMenuItem key={item.category}>
                  <SidebarMenuButton asChild>
                    <a href={`/categories/${item.category}`} className="
                      flex items-center justify-between py-2.5 px-4 
                      rounded-lg hover:bg-purple-800/50
                      transition-colors duration-200
                      text-white/90 hover:text-white
                      group
                    ">
                      <span className={`
                        transition-opacity duration-300 whitespace-nowrap
                      `}>
                        {capitalizeCategory(item.category)}
                      </span>
                      <span className={`
                        text-sm bg-purple-800/50 px-2 py-0.5 rounded-md
                        text-white/75 group-hover:text-white} transition-all duration-300
                      `}>
                        {item.count}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}