"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { FetchedGameData } from '@/types/games'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface GameGridProps {
  games: FetchedGameData[]
}

export function GameGrid({ games }: GameGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const router = useRouter();

  const openGame = (gameId: string) => {
    router.push(`/play/${gameId}`);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {games.map((game, index) => {
        const isFeatured = index < 4;
        const cardSize = isFeatured ? 'aspect-[1]' : 'aspect-[4/3]';

        return (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card
              className={`group relative overflow-hidden rounded-xl bg-card border border-border neon-border-hover cursor-pointer ${cardSize}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => openGame(game.id)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={game.thumbnail_url || '/placeholder.png'}
                  alt={game.name}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  fill
                  sizes={`(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16.66vw`}
                />
              </div>
              {game.tags && game.tags.length > 0 && (
                <span className={`absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full shadow-[0_0_12px_oklch(var(--primary)/0.6)]`}>
                  {game.tags[0]}
                </span>
              )}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className={`font-semibold mb-1 line-clamp-2 text-white`}>{game.name}</h3>
                {isFeatured && (
                  <p className="text-sm text-zinc-200 line-clamp-2 mb-2">{game.description}</p>
                )}
                <div className="flex flex-wrap gap-1 mb-2">
                  {game.categories.slice(0, 2).map((category, i) => (
                    <span key={i} className={`text-xs bg-white/15 backdrop-blur-sm px-2 py-1 rounded-full`}>
                      {category}
                    </span>
                  ))}
                </div>
                <button className={`bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold shadow-[0_0_16px_oklch(var(--primary)/0.5)] rounded-full transition-colors duration-300 py-2 px-4 text-sm`}>
                  Play Now
                </button>
              </motion.div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  )
}