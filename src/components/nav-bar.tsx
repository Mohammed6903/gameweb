"use client"

import Link from "next/link"
import { Bell, Heart, Search, Menu, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/utils/supabase/client"
import { GameSearch } from "./game-search"
import { ThemeToggle } from "./theme/theme-toggle"
import {  
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOutAction } from "@/lib/actions/auth-actions"
import { getLikedGameDetails } from "@/lib/controllers/like"
import { getFavIconByType, getFavIcons } from "@/lib/controllers/meta"

interface NavBarprops {
  siteName: string,
}

export const NavBar: React.FC<NavBarprops> = ({siteName}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [user, setUser] = useState<any>();
  const [emailInfo, setEmailInfo] = useState<any>();
  const [likedGames, setLikedGames] = useState<any[]>([]);
  const [isLikedGamesOpen, setIsLikedGamesOpen] = useState(false);
  const [favIcon, setFavIcon] = useState<any>();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchFavIcon = async() => {
      const response = await getFavIconByType('favicon');
      if (response.status === 200) {
        setFavIcon(response.data);
      }
    };
    fetchFavIcon();
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const response = await supabase.auth.getUser();
      if (response.error) {
        setUser(null);
      } else {
        setUser(response.data.user);
      }
    };
  
    fetchUser();
  }, [supabase]);
  
  useEffect(() => {
    const fetchEmailInfo = async () => {
      if (user?.app_metadata.provider === "email") {
        const response = await supabase
          .from("emailUser")
          .select("first_name, last_name")
          .eq("email", user?.email)
          .single();
  
        if (response.error || !response.data) {
          console.error("Error fetching email info:", response.error);
          setUser(null);
        } else {
          setEmailInfo({
            id: user?.id,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
          });
        }
      }
    };

    const fetchGames = async () => {
      if (user?.id) {
        const response = await getLikedGameDetails(user.id);
        if (response) {
          setLikedGames(response);
        } else {
          setLikedGames([]);
        }
      }
    }
  
    if (user) {
      fetchEmailInfo();
      fetchGames();
    }
  }, [user, supabase]);
  
  const handleLikedGamesClick = () => {
    setIsLikedGamesOpen(!isLikedGamesOpen);
  };

  const goToGame = (gameId: string) => {
    router.push(`/play/${gameId}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-card/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <nav className="flex flex-wrap items-center justify-between h-16 w-full px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
          <Link href="/" className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <img src={favIcon?.publicUrl ? favIcon?.publicUrl : '/favicon.ico'} alt="icon" className="size-5" />
            </div>
            <span className="font-semibold text-foreground text-lg">{siteName ? siteName : process.env.NEXT_PUBLIC_SITE_NAME}</span>
          </Link>
        </div>
        
        <div className="hidden sm:flex flex-1 items-center justify-center max-w-lg mx-6">
          <div className="w-full relative group">
             <GameSearch />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <Search className="size-5" />
          </Button>

          {/* Theme Toggle Added Here */}
          <ThemeToggle />

          <DropdownMenu open={isLikedGamesOpen} onOpenChange={setIsLikedGamesOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden sm:inline-flex text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
                onClick={handleLikedGamesClick}
              >
                <Heart className="size-5" />
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border" align="end" forceMount>
              {likedGames.length > 0 ? (
                likedGames.map((game) => (
                  <DropdownMenuItem key={game.id} className="flex items-center gap-2" onClick={() => goToGame(game.id)}>
                    <img src={game.thumbnail_url || "/placeholder.svg"} alt={game.name} className="w-8 h-8 object-cover rounded" />
                    <span className="text-sm">{game.name}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No liked games</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata.avatar_url || "/placeholder.svg"} alt={'User Photo'} />
                    <AvatarFallback>{emailInfo ? emailInfo.first_name?.[0] : user.user_metadata.name?.[0]}{emailInfo && emailInfo.last_name?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card border-border" align="end" forceMount>
                <DropdownMenuItem className="flex-col items-start">
                  <div className="text-sm font-medium">{emailInfo ? (emailInfo.first_name + " " + emailInfo.last_name) : user.user_metadata.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => await signOutAction()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              size="sm" 
              className="hidden sm:inline-flex ml-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
              onClick={() => router.push('/sign-in')}
            >
              Sign In
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </nav>
      {isSearchVisible && (
        <div className="w-full px-6 py-3 sm:hidden border-t border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              className="h-9 w-full pl-9 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-muted focus:border-primary/30"
            />
          </div>
        </div>
      )}
    </header>
  )
}