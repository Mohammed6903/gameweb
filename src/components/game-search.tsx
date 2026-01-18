"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, TrendingUp, Clock, X } from 'lucide-react';
import { ScrollArea } from "./ui/scroll-area";
import { useRouter } from "next/navigation";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { debounce } from "lodash";

interface Game {
  id: number;
  name: string;
  categories: string[];
  tags: string[];
  thumbnail_url: string;
  description: string;
}

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function GameSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Fetch games with debounce for better performance
  const fetchGames = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setGames([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const searchLower = term.toLowerCase();

      const { data, error } = await supabase
        .from('games')
        .select('id, name, categories, tags, thumbnail_url, description')
        .eq('is_active', true)
        .or(`name.ilike.%${searchLower}%,categories.cs.{${searchLower}},tags.cs.{${searchLower}}`)
        .limit(20);

      if (error) {
        console.error('Error fetching games:', error);
      } else {
        setGames(data || []);
      }
      setIsLoading(false);
    }, 300),
    [supabase]
  );

  // Group games by relevance
  const groupedResults = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    const exactMatches = games.filter(game => 
      game.name.toLowerCase() === searchLower
    );
    
    const nameMatches = games.filter(game => 
      game.name.toLowerCase().includes(searchLower) && 
      game.name.toLowerCase() !== searchLower
    );
    
    const categoryMatches = games.filter(game => 
      !game.name.toLowerCase().includes(searchLower) &&
      game.categories?.some(cat => cat.toLowerCase().includes(searchLower))
    );
    
    const tagMatches = games.filter(game => 
      !game.name.toLowerCase().includes(searchLower) &&
      !game.categories?.some(cat => cat.toLowerCase().includes(searchLower)) &&
      game.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );

    return { exactMatches, nameMatches, categoryMatches, tagMatches };
  }, [games, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchGames(value);
    if (value.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const addToRecentSearches = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const navigateToGame = (gameId: number, gameName: string) => {
    addToRecentSearches(searchTerm);
    router.push(`/play/${gameId}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    fetchGames(term);
    setIsOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const hasResults = games.length > 0;
  const showRecentSearches = !searchTerm && recentSearches.length > 0;

  return (
    <div className="w-full relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search games, categories, or tags..."
          className="h-10 w-full pl-10 pr-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-muted focus:border-primary/30"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
            onClick={() => {
              setSearchTerm('');
              setGames([]);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-950 rounded-lg shadow-2xl border border-border overflow-hidden z-50">          
          <div className="max-h-[500px] overflow-y-auto">
            <div className="p-2">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                  <span className="ml-2 text-sm">Searching...</span>
                </div>
              )}

              {/* Recent Searches */}
              {showRecentSearches && (
                <div className="mb-4">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                      <Clock className="h-3 w-3" />
                      Recent Searches
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs hover:bg-muted"
                      onClick={clearRecentSearches}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start px-3 py-2 h-auto hover:bg-muted"
                        onClick={() => handleRecentSearchClick(term)}
                      >
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{term}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {!isLoading && searchTerm && !hasResults && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">No games found</p>
                  <p className="text-xs text-muted-foreground">Try searching with different keywords</p>
                </div>
              )}

              {/* Exact Matches */}
              {!isLoading && groupedResults.exactMatches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary uppercase">
                    <TrendingUp className="h-3 w-3" />
                    Best Match
                  </div>
                  <div className="space-y-1">
                    {groupedResults.exactMatches.map((game) => (
                      <GameResultItem
                        key={game.id}
                        game={game}
                        onClick={() => navigateToGame(game.id, game.name)}
                        highlight={searchTerm}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Name Matches */}
              {!isLoading && groupedResults.nameMatches.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Games ({groupedResults.nameMatches.length})
                  </div>
                  <div className="space-y-1">
                    {groupedResults.nameMatches.map((game) => (
                      <GameResultItem
                        key={game.id}
                        game={game}
                        onClick={() => navigateToGame(game.id, game.name)}
                        highlight={searchTerm}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Category Matches */}
              {!isLoading && groupedResults.categoryMatches.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    By Category ({groupedResults.categoryMatches.length})
                  </div>
                  <div className="space-y-1">
                    {groupedResults.categoryMatches.slice(0, 5).map((game) => (
                      <GameResultItem
                        key={game.id}
                        game={game}
                        onClick={() => navigateToGame(game.id, game.name)}
                        highlight={searchTerm}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Matches */}
              {!isLoading && groupedResults.tagMatches.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    By Tag ({groupedResults.tagMatches.length})
                  </div>
                  <div className="space-y-1">
                    {groupedResults.tagMatches.slice(0, 5).map((game) => (
                      <GameResultItem
                        key={game.id}
                        game={game}
                        onClick={() => navigateToGame(game.id, game.name)}
                        highlight={searchTerm}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Separate component for game result items
const GameResultItem = ({ 
  game, 
  onClick, 
  highlight 
}: { 
  game: Game; 
  onClick: () => void; 
  highlight: string;
}) => {
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <span key={i} className="bg-primary/20 text-primary font-semibold">{part}</span> : 
        part
    );
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start px-3 py-3 h-auto hover:bg-muted group"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 w-full">
        {/* Thumbnail */}
        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
          <Image
            src={game.thumbnail_url || '/placeholder.png'}
            alt={game.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Game Info */}
        <div className="flex-1 text-left min-w-0">
          <div className="font-medium text-sm text-foreground mb-1 truncate">
            {highlightText(game.name, highlight)}
          </div>
          <div className="flex flex-wrap gap-1">
            {game.categories?.slice(0, 2).map((category, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-xs px-1.5 py-0 h-5"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Button>
  );
};