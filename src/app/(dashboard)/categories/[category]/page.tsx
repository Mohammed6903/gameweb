import { getGamesByCategory } from '@/lib/controllers/games'
import GameNotFound from '@/components/game-not-found'
import ClientCategoryPage from './clientCategory'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>,
  searchParams: Promise<{
    page?: string
  }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const gamesPerPage = 12;

  const { games, total } = await getGamesByCategory(category, {
    page: currentPage,
    limit: gamesPerPage
  });

  const handlePageChange = async (page: number) => {
    'use server'
    const { games, total } = await getGamesByCategory(category, {
      page: page,
      limit: gamesPerPage
    });
    return {games, total}
  }

  if (!games || total === null) {
    return <GameNotFound />
  }

  return (
    <ClientCategoryPage gameProp={games} category={category} totalProp={total} handlePageChange={handlePageChange}/>
  )
}