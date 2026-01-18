"use client"

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FetchedGameData } from '@/types/games'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Play, Star, Sparkles } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface FeaturedGamesProps {
  games: FetchedGameData[]
}

interface GameCardProps {
  game: FetchedGameData
  index: number
  isMobile?: boolean
  onGameClick: (id: string) => void
  onHover?: (index: number | null) => void
}

function GameCard({ game, index, isMobile = false, onGameClick, onHover }: GameCardProps) {
  return (
    <motion.div
      {...(!isMobile && {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut", delay: index * 0.08 },
        whileHover: { y: -6 }
      })}
      className="group h-full"
    >
      <Card
        className="relative h-full overflow-hidden rounded-2xl bg-card border border-primary/20 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
        onMouseEnter={() => onHover?.(index)}
        onMouseLeave={() => onHover?.(null)}
        onClick={() => onGameClick(game.id)}
      >
        {/* Top Glow */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/20 via-transparent to-transparent pointer-events-none" />

        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={game.thumbnail_url || '/placeholder.png'}
            alt={game.name}
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

          {/* Featured Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Featured
            </Badge>
          </div>

          {game.tags && game.tags.length > 0 && (
            <div className="absolute top-4 right-4">
              <Badge 
                variant="secondary" 
                className="bg-accent/90 text-accent-foreground border-0 shadow-lg backdrop-blur-sm"
              >
                <Star className="w-3 h-3 mr-1 fill-current" />
                {game.tags[0]}
              </Badge>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
            <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 shadow-2xl border border-white/20">
              <Play className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <div>
            <h3 className="text-xl font-extrabold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {game.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-4">
              {game.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {game.categories.slice(0, 2).map((category, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="text-xs border-primary/30 text-foreground hover:bg-primary/10 transition-colors"
                >
                  {category}
                </Badge>
              ))}
              {game.categories.length > 2 && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-primary/30 text-foreground"
                >
                  +{game.categories.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-500 pointer-events-none"
          layoutId={`border-${game.id}-${isMobile ? 'mobile' : 'desktop'}`}
        />
      </Card>
    </motion.div>
  )
}

export function FeaturedGames({ games }: FeaturedGamesProps) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleOpenGame = useCallback((gameId: string) => {
    router.push(`/play/${gameId}`);
  }, [router]);

  return (
    <div className="w-full">
      {/* Mobile View: Carousel */}
      <div className="block md:hidden w-full px-1">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {games.map((game, index) => (
              <CarouselItem key={game.id} className="pl-4 basis-[90%] sm:basis-1/2">
                <div className="p-1 h-full">
                  <GameCard 
                    game={game} 
                    index={index} 
                    isMobile={true} 
                    onGameClick={handleOpenGame}
                    onHover={setHoveredIndex} 
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:flex items-center justify-between mt-3">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>

      {/* Desktop View: Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game, index) => (
          <GameCard 
            key={game.id} 
            game={game} 
            index={index}
            onGameClick={handleOpenGame}
            onHover={setHoveredIndex}
          />
        ))}
      </div>
    </div>
  )
}