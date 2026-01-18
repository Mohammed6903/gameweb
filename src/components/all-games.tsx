"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FetchedGameData } from '@/types/games'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

interface GamesCarouselProps {
  games: FetchedGameData[]
}

export function AllGames({ games }: GamesCarouselProps) {
  const [cardsToShow, setCardsToShow] = useState(6);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState("1");
  const router = useRouter();

  useEffect(() => {
    const calculateCardsToShow = () => {
      const width = window.innerWidth;
      if (width < 640) setCardsToShow(2);
      else if (width < 768) setCardsToShow(3);
      else if (width < 1024) setCardsToShow(4);
      else if (width < 1280) setCardsToShow(5);
      else setCardsToShow(6);
    };

    calculateCardsToShow();
    window.addEventListener('resize', calculateCardsToShow);
    return () => window.removeEventListener('resize', calculateCardsToShow);
  }, []);

  // Sync pageInput when currentPage changes (e.g. via Next/Prev buttons)
  useEffect(() => {
    setPageInput((currentPage + 1).toString());
  }, [currentPage]);

  const openGame = (gameId: string) => {
    router.push(`/play/${gameId}`);
  }

  const totalPages = Math.ceil(games.length / cardsToShow);
  const startIndex = currentPage * cardsToShow;
  const endIndex = startIndex + cardsToShow;
  const currentGames = games.slice(startIndex, endIndex);

  // Pagination Logic
  const goToPage = (pageIndex: number) => {
    const target = Math.max(0, Math.min(totalPages - 1, pageIndex));
    setCurrentPage(target);
  };

  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const handlePageJump = () => {
    const page = Number(pageInput);
    if (!Number.isNaN(page) && page > 0 && page <= totalPages) {
      goToPage(page - 1);
    } else {
      // Reset input to current page if invalid
      setPageInput((currentPage + 1).toString());
    }
  };

  const getVisiblePages = () => {
    const maxDots = 7;
    if (totalPages <= maxDots) return Array.from({ length: totalPages }, (_, i) => i);
    
    // Logic to center the active page among the dots
    const start = Math.max(0, Math.min(currentPage - 3, totalPages - maxDots));
    const end = Math.min(totalPages - 1, start + maxDots - 1);
    
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (games.length === 0) return null;

  return (
    <section className="relative w-full rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 p-4 md:p-6 shadow-lg">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Browse
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{startIndex + 1}-{Math.min(endIndex, games.length)} of {games.length}</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            onClick={goToPrevPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots + Page Jump */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {getVisiblePages().map((pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => goToPage(pageIndex)}
                className={`h-2.5 rounded-full transition-all ${
                  pageIndex === currentPage ? "w-6 bg-primary" : "w-2.5 bg-muted"
                }`}
                aria-label={`Go to page ${pageIndex + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Page</span>
            <Input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ""))}
              onBlur={handlePageJump}
              onKeyDown={(e) => e.key === "Enter" && handlePageJump()}
              className="h-7 w-12 text-center px-1 bg-background border border-border"
            />
            <span>of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <AnimatePresence mode="popLayout">
          {currentGames.map((game, index) => (
            <motion.div
              key={`${game.id}-${currentPage}`}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.04 }}
              className="group"
            >
              <Card 
                className="relative overflow-hidden rounded-xl bg-card border border-primary/20 shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300 cursor-pointer"
                onClick={() => openGame(game.id)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={game.thumbnail_url || '/placeholder.png'}
                    alt={game.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16.66vw"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-primary/80 backdrop-blur-sm rounded-full p-3 border border-white/20 shadow-lg">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight drop-shadow-lg">
                    {game.name}
                  </h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}