import React, { Suspense } from 'react';
import { Gamepad2, Laptop2, Users2, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { FeaturedGames } from '@/components/featured-games';
import { AllGames } from '@/components/all-games';
import { FetchedGameData } from '@/types/games';
import { getActiveGamesCount, getAllGames } from '@/lib/controllers/games';
import Loading, { CategorySkeleton, FeaturedGamesSkeleton, WelcomeSkeleton } from './loading';

// Helper function
const capitalizeCategory = (category: string) => {
  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Main component
export default async function DashboardPage() {
  const [games, activeCount] = await Promise.all([
    getAllGames(),
    getActiveGamesCount(),
  ]);

  const categories = await getGamesByCategory(games);

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12 space-y-12">
          {/* Welcome Section */}
          <Suspense fallback={<WelcomeSkeleton />}>
              <section className="relative overflow-hidden bg-card border border-primary/20 rounded-xl p-6 md:p-8 shadow-lg transition-transform hover:shadow-xl duration-300">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/15 via-transparent to-accent/15" />
                <div className="relative flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-md transform transition-transform hover:scale-105 duration-300">
                      <Gamepad2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                        {process.env.NEXT_PUBLIC_SITE_NAME}
                      </h1>
                      <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Play instantly, no downloads needed
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-0">
                    <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-foreground hover:bg-primary/10 transition-colors border border-primary/20">
                      <Laptop2 className="text-accent w-5 h-5 sm:w-6 sm:h-6" />
                      {activeCount}+ games
                    </Button>
                    <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-foreground hover:bg-primary/10 transition-colors border border-primary/20">
                      <Users2 className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                      Play with friends
                    </Button>
                    <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-foreground hover:bg-primary/10 transition-colors border border-primary/20">
                      <Sparkles className="text-accent w-5 h-5 sm:w-6 sm:h-6" />
                      All for free
                    </Button>
                  </div>
                </div>
              </section>
          </Suspense>

          {/* Featured Games */}
          <section>
            <h2 className="text-2xl sm:text-xl font-bold mb-6 text-foreground">
              Featured Games
            </h2>
            <Suspense fallback={<FeaturedGamesSkeleton />}>
              <FeaturedGames games={games.slice(0, 6)} />
            </Suspense>
          </section>

          {/* Categories */}
          {Object.entries(categories).map(([category, categoryGames]) => (
            <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                {capitalizeCategory(category)}
              </h2>
              <Suspense fallback={<CategorySkeleton />}>
                <AllGames games={categoryGames} />
              </Suspense>
            </section>
          ))}
        </div>
      </div>
    </Suspense>
  );
}

async function getGamesByCategory(games: FetchedGameData[]): Promise<Record<string, FetchedGameData[]>> {
  const categorizedGames: Record<string, FetchedGameData[]> = {};

  games.forEach((game) => {
    game.categories.forEach((category) => {
      if (!categorizedGames[category]) {
        categorizedGames[category] = [];
      }
      categorizedGames[category].push({
        id: game.id,
        name: game.name,
        description: game.description,
        thumbnail_url: game.thumbnail_url,
        play_url: game.play_url,
        tags: game.tags,
        provider_id: game.provider_id,
        categories: game.categories,
        is_active: game.is_active,
        created_at: game.created_at,
        updated_at: game.updated_at,
      });
    });
  });

  return categorizedGames;
}