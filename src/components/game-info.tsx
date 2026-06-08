import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FetchedGameData } from "@/types/games"

interface GameInfoProps {
  game: FetchedGameData
}

export function GameInfo({ game }: GameInfoProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-none p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Game Description</h2>
      <p className="text-foreground mb-6">
        {game.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {game.categories.map((category) => (
          <Link 
            key={category} 
            href={`/categories/${category}`}
          >
            <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
              {category}
            </Badge>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Provider:</span>
        <Badge variant="outline">{game.provider_id}</Badge>
      </div>
      {game.tags && game.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {game.tags.map((tag, index) => (
            <Badge key={index} variant="default" className="bg-primary text-primary-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  )
}