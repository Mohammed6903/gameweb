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
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link 
            key={item.href}
            href={item.href}
            className={`
              flex items-center p-3 rounded-xl transition-all duration-300 
              ${isActive 
                ? `${item.activeBackground} ${item.activeColor} shadow-md` 
                : `${item.hoverBackground} ${item.hoverColor} text-gray-600`
              }
              group relative w-full
            `}
          >
            <Icon 
              className={`mr-3 transition-all duration-300 
                ${isActive 
                  ? `${item.activeColor} scale-110` 
                  : 'group-hover:scale-110'
                }`} 
              size={24} 
            />
            <span className="font-medium">{item.label}</span>
            {isActive && (
              <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
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
        hidden lg:block fixed left-0 top-0 h-full w-64 
        bg-gradient-to-b from-white to-gray-50 
        border-r-2 border-gray-100 shadow-2xl p-4 
        overflow-y-auto z-40
      ">
        <div className="flex flex-col h-full">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Admin Panel
            </h2>
          </div>
          <SidebarContent />
          <div className="mt-auto mb-4 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Admin Dashboard
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-gradient-to-b from-white to-gray-50">
            <div className="flex flex-col h-full">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                  Admin Panel
                </h2>
              </div>
              <SidebarContent />
              <div className="mt-auto mb-4 text-center text-xs text-gray-400">
                © {new Date().getFullYear()} Admin Dashboard
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
