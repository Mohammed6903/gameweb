'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PlusCircle,
  List,
  Settings,
  Menu,
  Edit,
  DatabaseBackup
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    {
      href: '/admin',
      icon: Home,
      label: 'Dashboard',
    },
    {
      href: '/admin/add-game',
      icon: PlusCircle,
      label: 'Add New Game',
    },
    {
      href: '/admin/manage-games',
      icon: List,
      label: 'Manage Games',
    },
    {
      href: '/admin/import-games',
      icon: DatabaseBackup,
      label: 'Import Games',
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: 'Settings',
    },
    {
      href: '/admin/edit-pages',
      icon: Edit,
      label: 'Edit Pages',
    }
  ];

  const SidebarContent = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative
              ${isActive
                ? 'bg-[linear-gradient(90deg,oklch(0.55_0.25_290/0.25),transparent)] text-foreground shadow-[inset_3px_0_0_oklch(var(--primary))]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <Icon
              className={`mr-3 h-5 w-5 transition-all duration-200
                ${isActive ? 'text-primary' : 'group-hover:text-foreground'}
              `}
            />
            <span className="text-sm font-medium">{item.label}</span>
            {isActive && (
              <div className="absolute right-3 w-1.5 h-1.5 bg-primary shadow-[0_0_8px_oklch(var(--primary)/0.8)] rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="
        hidden lg:flex flex-col fixed left-0 top-0 h-full w-64
        bg-card border-r border-border p-6
        overflow-y-auto z-40 shadow-sm
      ">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground font-display text-glow-cyan">Admin</h2>
          <p className="text-xs text-muted-foreground mt-1">Dashboard</p>
        </div>
        <div className="flex-1">
          <SidebarContent />
        </div>
        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          © {new Date().getFullYear()} All rights reserved
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="neon"
              size="icon"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-card border-border p-0">
            <div className="flex flex-col h-full p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground font-display text-glow-cyan">Admin</h2>
                <p className="text-xs text-muted-foreground mt-1">Dashboard</p>
              </div>
              <div className="flex-1">
                <SidebarContent />
              </div>
              <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
                © {new Date().getFullYear()} All rights reserved
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Sidebar Spacer for Desktop */}
      <div className="hidden lg:block w-64" />
    </>
  );
}
