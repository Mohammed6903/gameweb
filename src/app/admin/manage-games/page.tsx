"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Gamepad, Search, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteGameDialog } from "@/components/admin/delete-game-dialog"
import { getPaginatedGames, deleteGame, getTotalGamesCount } from "@/lib/controllers/games"
import type { FetchedGameData } from "@/types/games"
import { Pagination } from "@/components/pagination"
import { toast, Toaster } from "sonner"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"
import { Suspense } from "react"

export default function ManageGamesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [games, setGames] = useState<FetchedGameData[]>([])
  const [filteredGames, setFilteredGames] = useState<FetchedGameData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const pageSize = 10

  useEffect(() => {
    loadGames()
  }, []) // Removed currentPage dependency

  async function loadGames() {
    setIsLoading(true)
    try {
      const fetchedGames = await getPaginatedGames(currentPage, pageSize)
      setGames(fetchedGames)
      setFilteredGames(fetchedGames)
      const totalCount = await getTotalGamesCount()
      setTotalPages(Math.ceil(totalCount / pageSize))
    } catch (error) {
      console.error("Failed to load games:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = games.filter((game) => game.name.toLowerCase().includes(term))

    setFilteredGames(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleDeleteGame = async (gameId: string) => {
    const response = await deleteGame(gameId)
    if (response.status === 200) {
      loadGames()
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
  }

  return (
    <div className="space-y-6 p-6 md:p-8 bg-background text-foreground">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Manage Games</h1>
          <p className="text-muted-foreground mt-1">View, edit, and manage your game catalog</p>
        </div>
        <Link href="/admin/add-game">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="h-5 w-5" /> Add New Game
          </Button>
        </Link>
      </div>

      {/* Search and Filter Section */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Search Games</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by title or status..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Table */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Gamepad className="h-5 w-5 text-primary" />
            Game Catalog ({filteredGames.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<Loading />}>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-foreground font-semibold">Thumbnail</TableHead>
                      <TableHead className="text-foreground font-semibold">Title</TableHead>
                      <TableHead className="text-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-right text-foreground font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGames.map((game) => (
                      <TableRow key={game.id} className="border-border hover:bg-muted/50 transition-colors">
                        <TableCell className="py-3">
                          {game.thumbnail_url ? (
                            <img
                              src={game.thumbnail_url || "/placeholder.svg"}
                              alt={`${game.name} thumbnail`}
                              className="w-14 h-14 object-cover rounded-md border border-border"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{game.name}</TableCell>
                        <TableCell>
                          <span
                            className={`
                              px-3 py-1 rounded-full text-xs font-semibold
                              ${game.is_active 
                                ? "bg-green-500/15 text-green-600 dark:text-green-400" 
                                : "bg-red-500/15 text-red-600 dark:text-red-400"
                            }
                          `}
                          >
                            {game.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/edit-game/${game.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                            </Link>
                            <DeleteGameDialog
                              gameId={game.id}
                              gameTitle={game.name}
                              onDelete={() => handleDeleteGame(game.id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="mt-4 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl="/admin/manage-games"
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </>
            )}
          </Suspense>
        </CardContent>
      </Card>

      {/* No Results Handling */}
      {!isLoading && filteredGames.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <Gamepad className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-6">No games found</p>
            <Link href="/admin/add-game">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="h-4 w-4" /> Add Your First Game
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
      <Toaster position="bottom-right" />
    </div>
  )
}
