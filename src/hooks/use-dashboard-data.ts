import { useEffect, useState } from 'react';
import { 
  fetchWeeklyGamePlays, 
  getActiveGamesCount, 
  getTotalGamesCount 
} from '@/lib/controllers/games';
import { getUsedCategories } from '@/lib/controllers/categories';
import { getNewUsersCount } from '@/lib/controllers/analytics';

export const useDashboardData = () => {
  const [playsOverTimeSeries, setPlaysOverTimeSeries] = useState([{ name: 'Game Plays', data: <any>[] }]);
  const [categories, setCategories] = useState<string[]>([]);
  const [gameCategorySeries, setGameCategorySeries] = useState<number[]>([]);
  const [gameCategoryLabels, setGameCategoryLabels] = useState<string[]>([]);
  const [gamesCount, setGamesCount] = useState<GameCounts>({totalCount: 0, activeCount: 0});
  const [newUsers, setNewUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [
          weeklyData,
          categoriesData,
          totalCount,
          activeCount,
          newUsersCount
        ] = await Promise.all([
          fetchWeeklyGamePlays(),
          getUsedCategories(),
          getTotalGamesCount(),
          getActiveGamesCount(),
          getNewUsersCount()
        ]);

        if (!mounted) return;

        // Process weekly plays data
        if (weeklyData?.length) {
          const categories = weeklyData.map(d => d.date);
          const data = weeklyData.map(d => d.totalPlays);
          setCategories(categories);
          setPlaysOverTimeSeries([{ name: 'Game Plays', data }]);
        }

        // Process category data
        if (categoriesData?.length) {
          const labels = categoriesData.map(item => item.category);
          const series = categoriesData.map(item => item.count);
          setGameCategoryLabels(labels);
          setGameCategorySeries(series);
        }

        // Set counts
        if (totalCount !== undefined && activeCount !== undefined) {
          setGamesCount({ totalCount, activeCount });
        }

        if (newUsersCount !== undefined && newUsersCount !== null) {
          setNewUsers(newUsersCount);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error loading dashboard data:', error);
        setError(error instanceof Error ? error : new Error('Failed to load dashboard data'));
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadAllData();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    playsOverTimeSeries,
    categories,
    gameCategorySeries,
    gameCategoryLabels,
    gamesCount,
    newUsers,
    isLoading,
    error
  };
};