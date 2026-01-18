"use client";

import React,{useEffect, useState} from 'react';
import { Suspense } from 'react'
import { Tag, Filter, Grid, List } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { FetchedGameData } from '@/types/games'
import { Pagination } from '@/components/pagination'
// import {FilterModal}  from "@/components/filterModal"
import { useRouter } from 'next/navigation';

interface ClientCategoryProps {
  category: string,
  gameProp: FetchedGameData[],
  totalProp: number,
  handlePageChange: (page: number) => Promise<{games: any[], total: number | null}>
}

export function capitalizeCategory(category: string) {
  return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

export default function ClientCategoryPage({ category, gameProp, totalProp, handlePageChange }: ClientCategoryProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [games, setGames] = useState<any []>(gameProp);
  const [total, setTotal] = useState<number>(totalProp);
  const gamesPerPage = 12;
  const totalPages = Math.ceil(total / gamesPerPage);
  const router = useRouter();
  
  useEffect(() => {
    const fetchNew = async () => {
        const res = await handlePageChange(currentPage);
        if (res.games && res.total) {
            setGames(res.games);
            setTotal(res.total);
        }
        router.refresh();
    }
    fetchNew();
  }, [currentPage])

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Category Header */}
        <section className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="size-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Tag className="size-10 text-primary" />
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {capitalizeCategory(category)}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                {total} {total === 1 ? 'game' : 'games'} available
              </p>
            </div>
            {/* <div className="flex items-center space-x-4">
              <Button onClick={() => setIsFilterModalOpen(true)} variant="outline" className="gap-2 text-gray-300 hover:text-white hover:bg-white/10">
                <Filter className="size-5 text-purple-500" />
                Filters
              </Button>
              <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilters={handleApplyFilters}
              />
            </div> */}
          </div>
        </section>

        {/* Games Grid */}
        <Suspense fallback={<div className="h-96 bg-card rounded-lg animate-pulse"></div>}>
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games && games.map((game: FetchedGameData) => (
              <div 
                key={game.id} 
                className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="aspect-video relative bg-muted overflow-hidden group">
                  {game.thumbnail_url && (
                    <img
                      src={game.thumbnail_url || "/placeholder.svg"} 
                      alt={game.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => router.push(`/play/${game.id}`)}>
                      Play Now
                    </Button>
                  </div>
                </div>
                <div className="p-4 hidden sm:block">
                  <h3 className="text-sm font-semibold truncate text-foreground">{game.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {game.categories.slice(0, 2).map((cat: string) => (
                      <span 
                        key={cat} 
                        className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </Suspense>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              setCurrentPage={setCurrentPage}
              baseUrl={`/categories/${category}`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
