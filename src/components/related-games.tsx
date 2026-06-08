import Image from 'next/image'
import Link from 'next/link'
import { Game } from "@/types/game"

interface RelatedGamesProps {
  categories: string[]
  currentGameId:string
}

async function getRelatedGames(categories: string[], currentGameId: string): Promise<Game[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games/related`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categories, currentGameId }),
    next: { revalidate: 60 }
  })
  if (!res.ok) throw new Error('Failed to fetch related games')
  return res.json()
}

export async function RelatedGames({ categories, currentGameId }: RelatedGamesProps) {
  const relatedGames = await getRelatedGames(categories, currentGameId)

  return (
    <div className="space-y-4">
      {relatedGames.map((game) => (
        <Link key={game.id} href={`/games/${game.id}`} className="block">
          <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Image
              src={game.thumbnail}
              alt={game.name}
              width={80}
              height={80}
              className="rounded-md"
            />
            <div>
              <h3 className="font-semibold">{game.name}</h3>
              <p className="text-sm text-muted-foreground">{game.categories.join(', ')}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}