import { redirect } from "next/navigation"
import { getAllProviders } from "@/lib/controllers/providers"
import { getAllCategories } from "@/lib/controllers/categories"
import { getAllTags } from "@/lib/controllers/tags"
import EditGameClient from "./EditGameClient"
import { Card, CardContent } from "@/components/ui/card"
import { getGameById } from "@/lib/controllers/games"

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  try {
    const { gameId } = await params;
    const gameById = await getGameById(gameId)

    const providers = await getAllProviders()
    const categories = (await getAllCategories()).map((item: any) => item.category)
    const tags = (await getAllTags()).map((item: any) => item.tag)

    if (!gameById) {
      return redirect("/admin/manage-games")
    }

    return (
      <div className="space-y-6 p-6 md:p-8 bg-background text-foreground max-w-4xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Edit Game</h1>
          <p className="text-muted-foreground mt-2">Update game information and settings</p>
        </div>
        
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-6 md:p-8">
            <EditGameClient initialGame={gameById} providers={providers} categories={categories} tags={tags} />
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch game data:", error)
    return redirect("/admin/manage-games")
  }
}
