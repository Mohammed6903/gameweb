"use client"

import React, { useEffect, useState } from 'react'
import { Flame, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { fetchPopularGames } from '@/lib/controllers/games'

export default function TrendingGamesPage() {
    const [trendingGames, setTrendingGames] = useState<any[]>();

    useEffect(() => {
        const fetchNew = async () => {
            const response = await fetchPopularGames();
            console.log(response);
            setTrendingGames(response);
        }
        fetchNew();
    }, [])
    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-12">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-12">
            Trending Games
            </h1>

            <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Flame className="w-8 h-8 text-accent" />
                <h2 className="text-3xl font-bold text-foreground">Hot Right Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingGames && trendingGames.map((game) => (
                <GameCard key={game.id} game={game} />
                ))}
            </div>
            </section>
        </div>
        </div>
    )
}

function GameCard({ game }: { game: any }) {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="aspect-video relative bg-muted overflow-hidden group">
        <img
          src={game.thumbnail_url || "/placeholder.svg"}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/play/${game.id}`} passHref>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              Play Now
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold truncate text-foreground">{game.name}</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {game.categories.map((category: string) => (
            <span
              key={category}
              className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
