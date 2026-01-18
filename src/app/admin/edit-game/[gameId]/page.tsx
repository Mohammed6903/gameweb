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
      <div className="max-w-2xl mx-auto m-12 p-6 bg-gray-900 text-gray-100">
        <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-lg">
          <CardContent className="p-6">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
              Edit Game
            </h1>
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