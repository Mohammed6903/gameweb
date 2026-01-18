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
    <div className="space-y-6 p-6 bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
        Manage Games
      </h1>

      {/* Search and Add Game Section */}
      <div className="flex justify-between items-center mb-6 space-x-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search games by title or status..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 w-full bg-gray-800 border-gray-700 text-gray-100"
          />
        </div>
        <Link href="/admin/add-game">
          <Button
            variant="default"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Game
          </Button>
        </Link>
      </div>

      {/* Games Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-100 flex items-center">
            <Gamepad className="mr-2 h-5 w-5 text-purple-400" />
            Game Catalog
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10 text-gray-300">Loading...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Thumbnail</TableHead>
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGames.map((game) => (
                    <TableRow key={game.id} className="border-gray-700">
                      <TableCell>
                        {game.thumbnail_url ? (
                          <img
                            src={game.thumbnail_url || "/placeholder.svg"}
                            alt={`${game.name} thumbnail`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-gray-100">{game.name}</TableCell>
                      <TableCell>
                        <span
                          className={`
                            px-2 py-1 rounded text-xs font-semibold
                            ${game.is_active ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"}
                          `}
                        >
                          {game.is_active ? "active" : "inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/admin/edit-game/${game.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
                            >
                              <Edit className="mr-1 h-4 w-4" /> Edit
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
        </CardContent>
      </Card>

      {/* No Results Handling */}
      {!isLoading && filteredGames.length === 0 && (
        <div className="text-center py-10 bg-gray-800 rounded-lg">
          <p className="text-gray-300 mb-4">No games found</p>
          <Link href="/admin/add-game">
            <Button
              variant="default"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Your First Game
            </Button>
          </Link>
        </div>
      )}
      <Toaster position="bottom-right" />
    </div>
  )
}