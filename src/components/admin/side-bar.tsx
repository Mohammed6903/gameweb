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
      activeColor: 'text-emerald-500',
      activeBackground: 'bg-emerald-50',
      hoverColor: 'hover:text-emerald-600',
      hoverBackground: 'hover:bg-emerald-100'
    },
    { 
      href: '/admin/add-game', 
      icon: PlusCircle, 
      label: 'Add New Game',
      activeColor: 'text-purple-500',
      activeBackground: 'bg-purple-50',
      hoverColor: 'hover:text-purple-600',
      hoverBackground: 'hover:bg-purple-100'
    },
    { 
      href: '/admin/manage-games', 
      icon: List, 
      label: 'Manage Games',
      activeColor: 'text-blue-500',
      activeBackground: 'bg-blue-50',
      hoverColor: 'hover:text-blue-600',
      hoverBackground: 'hover:bg-blue-100'
    },
    { 
      href: '/admin/import-games', 
      icon: DatabaseBackup, 
      label: 'Import Games',
      activeColor: 'text-teal-500',
      activeBackground: 'bg-teal-50',
      hoverColor: 'hover:text-teal-600',
      hoverBackground: 'hover:bg-teal-100'
    },
    { 
      href: '/admin/settings', 
      icon: Settings, 
      label: 'Settings',
      activeColor: 'text-orange-500',
      activeBackground: 'bg-orange-50',
      hoverColor: 'hover:text-orange-600',
      hoverBackground: 'hover:bg-orange-100'
    },
    { 
      href: '/admin/edit-pages', 
      icon: Edit, 
      label: 'Edit Pages',
      activeColor: 'text-red-500',
      activeBackground: 'bg-red-50',
      hoverColor: 'hover:text-red-600',
      hoverBackground: 'hover:bg-red-100'
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
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <Icon 
              className={`mr-3 h-5 w-5 transition-all duration-200 
                ${isActive ? 'text-primary-foreground' : 'group-hover:text-foreground'}
              `}
            />
            <span className="text-sm font-medium">{item.label}</span>
            {isActive && (
              <div className="absolute right-3 w-1.5 h-1.5 bg-primary-foreground rounded-full" />
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
          <h2 className="text-2xl font-bold text-foreground">Admin</h2>
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
              variant="default"
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-card border-border p-0">
            <div className="flex flex-col h-full p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">Admin</h2>
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
