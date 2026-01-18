'use client'
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react"

import { AppSideBar } from "@/components/app-sidebar";
import { NavBar } from "@/components/nav-bar";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import { getMeta } from "@/lib/controllers/meta";
import { useMetadataStore } from "@/hooks/stores/meta";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const { siteName, setSiteName } = useMetadataStore();
  const [hasFetched, setHasFetched] = useState(false);
  
  useEffect(() => {
    // Only fetch once
    if (hasFetched) return;
    
    const fetchMeta = async () => {
      const metaResult = await getMeta();
      if (metaResult.status === 200 && metaResult.data) {
        setSiteName(metaResult.data.site_name);
      }
      setHasFetched(true);
    };
    fetchMeta();
  }, [hasFetched, setSiteName]); // Remove siteName from deps!

  return (
    <SidebarProvider 
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
        <NavBar siteName={siteName}/>
        <div className="flex flex-1 overflow-hidden">
          <AppSideBar siteName={siteName}/>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out">
            {children}
          </main>
        </div>
        <Footer siteName={siteName}/>
        <Toaster position="bottom-right" />
      </div>
    </SidebarProvider>
  );
}