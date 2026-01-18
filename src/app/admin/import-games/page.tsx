"use client"

import { Label } from "@/components/ui/label"
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import React, { useState, useEffect } from 'react';
import { Search, Save, Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from '@/components/pagination';
import { toast, Toaster } from 'sonner';
import { getOrCreateProviderId } from '@/lib/utils/provider';
import { ExternalGame } from '@/types/games';
import { saveGames } from '@/lib/controllers/import-game';
import Loading from "./loading";

interface Category {
  id: string;
  name: string;
}

export default function ImportGamesPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [allGames, setAllGames] = useState<ExternalGame[]>([]);
  const [displayedGames, setDisplayedGames] = useState<ExternalGame[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApi, setSelectedApi] = useState<'gamepix' | 'gamemonetize'>('gamepix');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());
  const [provider, setProvider] = useState<string>('');
  const pageSize = 10;

  const gameMonetizeCategories = [
    ".IO", "2 Player", "3D", "Adventure", "Arcade", 
    "Bejeweled", "Boys", "Clicker", "Cooking", "Girls", "Hypercasual", 
    "Multiplayer", "Puzzle", "Racing", "Shooting", "Soccer", 
    "Sports", "Stickman", "Baby Hazel", "Action"
  ];

  useEffect(() => {
    const savedSelections = localStorage.getItem('selectedGames');
    if (savedSelections) {
      setSelectedGames(new Set(JSON.parse(savedSelections)));
    };

  }, []);

  useEffect(() => {
    localStorage.setItem('selectedGames', JSON.stringify(Array.from(selectedGames)));
  }, [selectedGames]);

  useEffect(() => {
    if (selectedApi === 'gamepix') {
      fetchGamePixCategories();
    } else {
      setCategories(gameMonetizeCategories.map((name, index) => ({ id: (index + 1).toString(), name })));
    }
  }, [selectedApi]);

  useEffect(() => {
    if (selectedApi) {
      fetchGames();
      updateDisplayedGames();
    }
  }, [selectedApi, selectedCategory]);

  useEffect(() => {
    updateDisplayedGames();
  }, [currentPage, searchTerm, allGames]);

  const updateDisplayedGames = () => {
    const filteredGames = searchTerm
      ? allGames.filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : allGames;

    setTotalPages(Math.ceil(filteredGames.length / pageSize));
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedGames(filteredGames.slice(startIndex, endIndex));
  };

  const fetchGamePixCategories = async () => {
    try {
      const response = await fetch('https://games.gamepix.com/categories');
      const data = await response.json();
      if (data.status === 'success') {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching GamePix categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchGames = async () => {
    setIsLoading(true);
    try {
        const providerId = await getOrCreateProviderId(selectedApi);
        setProvider(providerId);
        let url;
        if (selectedApi === 'gamepix') {
            url = selectedCategory
            ? `https://games.gamepix.com/games?category=${selectedCategory}&page=${currentPage}`
            : `https://games.gamepix.com/games?sid=1&order=q&page=${currentPage}`;
        } else {
            url = selectedCategory
            ? `https://gamemonetize.com/feed.php?format=0&category=${selectedCategory}&links=0`
            : `https://gamemonetize.com/feed.php?format=0&links=0`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        let formattedGames: ExternalGame[];
        if (selectedApi === 'gamepix') {
            formattedGames = data.data.map((game: any) => ({
              id: game.id,
              title: game.title,
              description: game.description,
              thumbnailUrl: game.thumbnailUrl,
              category: game.category,
              categories: game.categories,
              url: game.url
            }));
        } else {
            formattedGames = data.map((game: any) => ({
              id: game.id,
              title: game.title,
              description: game.description,
              thumbnailUrl: game.thumb,
              category: game.category,
              tags: game.tags,
              url: game.url
            }));
        }
        setAllGames(formattedGames);
              
    } catch (error) {
        console.error('Error fetching games:', error);
        toast.error('Failed to fetch games');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedGames);
      displayedGames.forEach(game => newSelected.add(game.id));
      setSelectedGames(newSelected);
    } else {
      const newSelected = new Set(selectedGames);
      displayedGames.forEach(game => newSelected.delete(game.id));
      setSelectedGames(newSelected);
    }
  };

  const handleSelectGame = (gameId: string, checked: boolean) => {
    const newSelected = new Set(selectedGames);
    if (checked) {
      newSelected.add(gameId);
    } else {
      newSelected.delete(gameId);
    }
    setSelectedGames(newSelected);
  };

  const handleSaveGames = async (saveAll: boolean) => {
    const gamesToSave = saveAll 
      ? allGames
      : allGames.filter(game => selectedGames.has(game.id));
    
    const response = await saveGames(gamesToSave, provider);
    if (response.success){
      toast.success(`${saveAll ? 'All' : 'Selected'} games saved successfully`);
    } else if (response.error) {
      toast.error(response.message);
    }
  };

  const areAllCurrentPageSelected = displayedGames.length > 0 && 
    displayedGames.every(game => selectedGames.has(game.id));

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6 p-6 md:p-8 bg-background text-foreground">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Import Games</h1>
          <p className="text-muted-foreground mt-2">Add games from external providers to your catalog</p>
        </div>

        {/* Filters Card */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label className="text-sm font-medium text-foreground block mb-2">Game Provider</Label>
                <Select
                  onValueChange={(value: "gamepix" | "gamemonetize") => setSelectedApi(value)}
                  defaultValue="gamemonetize"
                >
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Select API" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="gamepix">GamePix</SelectItem>
                    <SelectItem value="gamemonetize">GameMonetize</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground block mb-2">Category</Label>
                <Select onValueChange={(value) => setSelectedCategory(value)}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground block mb-2">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Games Table */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-foreground">
              Game Catalog ({selectedGames.size} selected)
            </CardTitle>
            <div className="flex gap-3">
              <Button
                onClick={() => handleSaveGames(false)}
                variant="outline"
                disabled={selectedGames.size === 0}
                className="border-border text-foreground hover:bg-muted"
              >
                <Save className="h-4 w-4 mr-2" /> Save Selected ({selectedGames.size})
              </Button>
              <Button
                onClick={() => handleSaveGames(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={allGames.length === 0}
              >
                <Save className="h-4 w-4 mr-2" /> Save All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading games...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-[50px] text-foreground font-semibold">
                        <Checkbox checked={areAllCurrentPageSelected} onCheckedChange={handleSelectAll} />
                      </TableHead>
                      <TableHead className="text-foreground font-semibold">Thumbnail</TableHead>
                      <TableHead className="text-foreground font-semibold">Title</TableHead>
                      <TableHead className="text-foreground font-semibold">Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedGames.map((game) => (
                      <TableRow key={game.id} className="border-border hover:bg-muted/50 transition-colors">
                        <TableCell className="py-3">
                          <Checkbox
                            checked={selectedGames.has(game.id)}
                            onCheckedChange={(checked) => handleSelectGame(game.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="py-3">
                          {game.thumbnailUrl ? (
                            <img
                              src={game.thumbnailUrl || "/placeholder.svg"}
                              alt={`${game.title} thumbnail`}
                              className="w-14 h-14 object-cover rounded-md border border-border"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{game.title}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{game.category || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="mt-4 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl="/admin/import-games"
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* No Results Handling */}
        {!isLoading && displayedGames.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <Gamepad className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No games found. Try adjusting your filters.</p>
            </CardContent>
          </Card>
        )}
        <Toaster position="bottom-right" />
      </div>
    </Suspense>
  );
}
