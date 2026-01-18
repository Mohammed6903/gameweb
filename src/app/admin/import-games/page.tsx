"use client"

import { Label } from "@/components/ui/label"
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import React, { useState, useEffect } from 'react';
import { Search, Save, Gamepad, Download, Filter, CheckCircle2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Badge } from "@/components/ui/badge"
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
  const [isSaving, setIsSaving] = useState(false);
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
    setIsSaving(true);
    const gamesToSave = saveAll 
      ? allGames
      : allGames.filter(game => selectedGames.has(game.id));
    
    try {
      const response = await saveGames(gamesToSave, provider);
      if (response.success){
        toast.success(`Successfully imported ${gamesToSave.length} game${gamesToSave.length !== 1 ? 's' : ''}`);
        setSelectedGames(new Set());
      } else if (response.error) {
        toast.error(response.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const areAllCurrentPageSelected = displayedGames.length > 0 && 
    displayedGames.every(game => selectedGames.has(game.id));

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
          {/* Header Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Game Import Manager</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Import and manage games from external providers
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available Games</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{allGames.length}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Selected</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{selectedGames.size}</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Provider</p>
                    <p className="text-2xl font-bold text-foreground mt-1 capitalize">{selectedApi}</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Gamepad className="h-5 w-5 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">Filters & Search</CardTitle>
              </div>
              <CardDescription>Configure your import criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Game Provider</Label>
                  <Select
                    onValueChange={(value: "gamepix" | "gamemonetize") => setSelectedApi(value)}
                    defaultValue="gamepix"
                  >
                    <SelectTrigger className="bg-background border-border/60">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gamepix">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          GamePix
                        </div>
                      </SelectItem>
                      <SelectItem value="gamemonetize">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          GameMonetize
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Category Filter</Label>
                  <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)} value={selectedCategory || 'all'}>
                    <SelectTrigger className="bg-background border-border/60">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Search Games</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by title..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 bg-background border-border/60"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Games Table */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    Game Catalog
                    {selectedGames.size > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedGames.size} selected
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {allGames.length} games available for import
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSaveGames(false)}
                    variant="outline"
                    disabled={selectedGames.size === 0 || isSaving}
                    className="border-border/60"
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Import Selected ({selectedGames.size})
                  </Button>
                  <Button
                    onClick={() => handleSaveGames(true)}
                    disabled={allGames.length === 0 || isSaving}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Import All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Loading games from {selectedApi}...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                          <TableHead className="w-12">
                            <Checkbox 
                              checked={areAllCurrentPageSelected} 
                              onCheckedChange={handleSelectAll}
                              className="border-border"
                            />
                          </TableHead>
                          <TableHead className="w-20">Preview</TableHead>
                          <TableHead className="font-semibold">Title</TableHead>
                          <TableHead className="font-semibold">Category</TableHead>
                          <TableHead className="w-24 text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedGames.map((game) => (
                          <TableRow 
                            key={game.id} 
                            className="border-border/50 hover:bg-muted/30 transition-colors"
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedGames.has(game.id)}
                                onCheckedChange={(checked) => handleSelectGame(game.id, checked as boolean)}
                                className="border-border"
                              />
                            </TableCell>
                            <TableCell>
                              {game.thumbnailUrl ? (
                                <img
                                  src={game.thumbnailUrl}
                                  alt={game.title}
                                  className="w-16 h-16 object-cover rounded-lg border border-border/50 shadow-sm"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center border border-border/50">
                                  <Gamepad className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span className="text-foreground">{game.title}</span>
                                {game.description && (
                                  <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    {game.description}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {game.category ? (
                                <Badge variant="outline" className="border-border/50">
                                  {game.category}
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">Uncategorized</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {selectedGames.has(game.id) ? (
                                <Badge className="bg-primary/10 text-primary border-primary/20">
                                  Selected
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-border/50 text-muted-foreground">
                                  Available
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {displayedGames.length > 0 && (
                    <div className="p-4 border-t border-border/50 bg-muted/10">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        baseUrl="/admin/import-games"
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* No Results */}
          {!isLoading && displayedGames.length === 0 && (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="p-4 bg-muted/50 rounded-full">
                  <Gamepad className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-foreground">No games found</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Try adjusting your filters or search criteria to find games
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <Toaster position="bottom-right" richColors />
      </div>
    </Suspense>
  );
}