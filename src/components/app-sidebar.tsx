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
        bg-card
        text-foreground
        border-r border-border
        md:mt-16
      `}
    >
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border px-4">
        <h1 className={`
          text-lg font-bold text-foreground
          transition-opacity duration-300
        `}>
          {siteName ? siteName : process.env.NEXT_PUBLIC_SITE_NAME}
        </h1>
      </SidebarHeader>
      <SidebarContent className='bg-card custom-scrollbar'>
        <SidebarGroup>
          <SidebarGroupLabel className={`
            text-muted-foreground font-semibold px-4 py-2 text-xs uppercase tracking-wider
            ${open ? '' : 'md:hidden'}
          `}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="
                      flex items-center gap-3 py-2.5 px-4 
                      rounded-md hover:bg-muted
                      transition-colors duration-200
                      text-muted-foreground hover:text-foreground
                    ">
                      <item.icon className="size-5 flex-shrink-0" />
                      <span className={`
                        transition-opacity duration-300 whitespace-nowrap text-sm
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
            text-muted-foreground font-semibold px-4 py-2 text-xs uppercase tracking-wider
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
                      rounded-md hover:bg-muted
                      transition-colors duration-200
                      text-muted-foreground hover:text-foreground
                      group text-sm
                    ">
                      <span className={`
                        transition-opacity duration-300 whitespace-nowrap
                      `}>
                        {capitalizeCategory(item.category)}
                      </span>
                      <span className={`
                        text-xs bg-muted px-2 py-0.5 rounded
                        text-muted-foreground group-hover:text-accent transition-all duration-300
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
