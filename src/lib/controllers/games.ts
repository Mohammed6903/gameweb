'use server'
import { FetchedGameData, Game, GameBasicData, GameFormData } from '@/types/games';
import { createClient } from "../utils/supabase/server";

export async function addGame(gameData: GameFormData) {
  const supabase = await createClient();
  try{
    const { data, error } = await supabase.from('games').insert({
      name: gameData.name,
      description: gameData.description,
      play_url: gameData.play_url,
      thumbnail_url: gameData.thumbnail_url || null,
      is_active: (gameData.status === 'active' ? true : false),
      tags: gameData.tags,
      categories: gameData.categories,
      provider_id: Number(gameData.provider_id),
    }).select().single();

    if (error) {
      throw new Error(`Error inserting game: ${error.message}`);
    } else {
      return data;
    }
  } catch (err) {
    console.error('Error adding game:', err);
    throw err;
  }
}

export async function updateGame(
  gameId: string, 
  gameData: Partial<GameFormData>
): Promise<Game> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('games')
      .update({
        name: gameData.name,
        description: gameData.description,
        play_url: gameData.play_url,
        thumbnail_url: gameData.thumbnail_url || null,
        is_active: (gameData.status === 'active' ? true : false),
        tags: gameData.tags,
        categories: gameData.categories,
        provider_id: gameData.provider_id,
        updated_at: new Date()
      })
      .eq('id', gameId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating game: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error updating game:', error);
    throw error;
  }
}

export async function deleteGame(gameId: string) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', gameId);

    if (error) {
      console.error(`Error deleting game: ${error.message}`);
    }

    return {status: 200, message: 'Deleted game successfully!'};
  } catch (err) {
    console.error('Error deleting game:', err);
    return {status: 500, message: 'Error deleting game'};
  }
}

export async function getAllGames(): Promise<FetchedGameData[]> {
  const supabase = await createClient();
  const chunkSize = 1000; // Supabase's max limit
  let allGames: FetchedGameData[] = [];
  let hasMore = true;
  let lastId = 0;

  while (hasMore) {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .gt('id', lastId)
      .order('id', { ascending: true })
      .limit(chunkSize);

    if (error) {
      throw Error(`Error fetching games: ${error.message}`);
    }

    if (data.length === 0) {
      hasMore = false;
    } else {
      allGames = [...allGames, ...data];
      lastId = data[data.length - 1].id;
      
      if (data.length < chunkSize) {
        hasMore = false;
      }
    }
  }

  return allGames;
}

export async function getGamesPage(page: number = 1, pageSize: number = 24): Promise<{
  games: GameBasicData[];
  total: number;
}> {
  const supabase = await createClient();
  const start = (page - 1) * pageSize;
  
  const [gamesQuery, countQuery] = await Promise.all([
    supabase
      .from('games')
      .select('id, name, thumbnail_url, categories, description, tags')
      .eq('is_active', true)
      .order('id', { ascending: true })
      .range(start, start + pageSize - 1),
    
    supabase
      .from('games')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
  ]);

  if (gamesQuery.error) throw Error(`Error fetching games: ${gamesQuery.error.message}`);
  if (countQuery.error) throw Error(`Error getting count: ${countQuery.error.message}`);

  return {
    games: gamesQuery.data,
    total: countQuery.count || 0
  };
}

export async function getPaginatedGames(page: number, pageSize: number): Promise<FetchedGameData[]> {
  const supabase = await createClient();
  
  const offset = (page - 1) * pageSize;

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw new Error(`Error fetching games: ${error.message}`);
  } else {
    return data as FetchedGameData[];
  }
}

export async function getTotalGamesCount(): Promise<number> {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from('games')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Error fetching total games count: ${error.message}`);
  }

  return count || 0;
}

export async function getActiveGamesCount(): Promise<number> {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from('games')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (error) {
    throw new Error(`Error fetching total games count: ${error.message}`);
  }

  return count || 0;
}

export async function getGameById(gameId: string) {
  const supabase = await createClient();
  try {
    const game = await supabase.from('games').select().eq('id', gameId).single();
    if (game.error) {
      throw new Error(`Error fetching game: ${game.error}`)
    }
    return game.data;
  } catch (error) {
    throw new Error(`Error fetching game: ${error}`);
  }
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return str; // Handle empty or null strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function getGamesByCategory(category: string, { page = 1, limit = 10 } = {}) {
  const supabase = await createClient();
  try {
    const cat = capitalizeFirstLetter(category);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: capData, error: capErr, count: capCount } = await supabase
    .from('games')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .contains('categories', [category])
    .range(from, to);
    
    if (capErr) {
      const { data, error, count } = await supabase
        .from('games')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .contains('categories', [cat])
        .range(from, to);
      if (error) {
        throw new Error(`Error fetching games: ${capErr.message}`);
      }
      return { games: data, total: count };
    } else {
      return {games: capData, total: capCount}
    }
  } catch (error: any) {
    throw new Error(`Error fetching games: ${error.message}`);
  }
}

export async function fetchWeeklyGamePlays() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('game_plays')
    .select('play_date, play_count')
    .gte('play_date', new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .order('play_date', { ascending: true })

  if (error) {
    console.error('Error fetching weekly game plays:', error);
    return [];
  }

  // Aggregate plays by date
  const aggregatedData: { date: string; totalPlays: number }[] = [];

  data.forEach((row) => {
    const existingDate = aggregatedData.find((d) => d.date === row.play_date);
    if (existingDate) {
      existingDate.totalPlays += row.play_count;
    } else {
      aggregatedData.push({ date: row.play_date, totalPlays: row.play_count });
    }
  });

  return aggregatedData;
}


export async function updateGamePlays(gameId: number) {
  const supabase = await createClient();

  try {
    const currentDate = new Date().toISOString().split('T')[0];

    // Check if the record already exists
    const { data: existingPlay, error: fetchError } = await supabase
      .from('game_plays')
      .select('play_count')
      .eq('game_id', gameId)
      .eq('play_date', currentDate)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "Row not found" error
      throw new Error(fetchError.message);
    }

    if (existingPlay) {
      // Increment play count if record exists
      const { error: incrementError } = await supabase.rpc('increment_play_count', {
        game_id_param: gameId,
        play_date_param: currentDate,
      });

      if (incrementError) {
        throw new Error(incrementError.message);
      }
    } else {
      // Insert new record if it doesn't exist
      const { error: insertError } = await supabase
        .from('game_plays')
        .insert([
          {
            game_id: gameId,
            play_date: currentDate,
            play_count: 1,
          },
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }
    }

    return { status: 200 };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function fetchPopularGames() {
  const supabase = await createClient();

  try {
    // Get aggregated play counts for all games
    const { data: playCounts, error: playCountsError } = await supabase
      .from('game_plays')
      .select('game_id, play_count')
      .order('play_count', { ascending: false })

    if (playCountsError) {
      throw new Error(`Error fetching play counts: ${playCountsError.message}`);
    }

    if (!playCounts || playCounts.length === 0) {
      return []; // No popular games
    }

    const gameIds = playCounts.map((play) => play.game_id);

    // Fetch game details for popular games
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('id, name, play_url, thumbnail_url, description, categories, tags, created_at, updated_at')
      .eq('is_active', true)
      .in('id', gameIds);

    if (gamesError) {
      throw new Error(`Error fetching game details: ${gamesError.message}`);
    }

    // Return popular games sorted by play counts
    const gamesMap = games.reduce((acc, game) => {
      acc[game.id] = game;
      return acc;
    }, {} as Record<number, any>);

    return gameIds.map((id) => gamesMap[id]);
  } catch (error) {
    console.error('Error fetching popular games:', error);
    throw error;
  }
}

export async function fetchTopNewGames() {
  const supabase = await createClient();

  try {
    // Fetch the total count of games
    const { count: totalGames, error: countError } = await supabase
      .from('games')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      throw new Error(`Error fetching total games count: ${countError.message}`);
    }

    // If there are less than 10 games, fetch all games regardless of date
    if (totalGames && totalGames < 10) {
      const { data: allGames, error: allGamesError } = await supabase
        .from('games')
        .select(`*, created_at::date`)
        .order('created_at', { ascending: false });

      if (allGamesError) {
        throw new Error(`Error fetching all games: ${allGamesError.message}`);
      }

      return allGames.map(game => ({
        ...game,
        created_at: game.created_at.toString(), // Convert to date string
      }));
    }

    // Otherwise, fetch the 10 most recently added games
    const { data: newGames, error: newGamesError } = await supabase
      .from('games')
      .select(`*, created_at::date`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (newGamesError) {
      throw new Error(`Error fetching new games: ${newGamesError.message}`);
    }

    return newGames.map(game => ({
      ...game,
      created_at: game.created_at.toString(), // Convert to date string
    }));
  } catch (error) {
    console.error('Error fetching top new games:', error);
    throw error;
  }
}

export const getGameBySlug = async (slug: string) => {
  const game = await getGameById(slug);
  return game;
}

export async function fetchAllGamesForSitemap() {
  const supabase = await createClient();

  try {
    const { data: games, error } = await supabase
      .from('games')
      .select('id, name, updated_at');

    if (error) {
      throw new Error(`Error fetching games for sitemap: ${error.message}`);
    }

    return games.map((game) => ({
      id: game.id,
      name: game.name,
      updated_at: new Date(game.updated_at).toISOString(),
    }));
  } catch (error) {
    console.error('Error in fetchAllGamesForSitemap:', error);
    throw error;
  }
}

export async function getRelatedGames(gameId: string, limit: number = 10) {
  const supabase = await createClient();
  
  try {
    // First, get the current game
    const currentGame = await getGameById(gameId);
    
    if (!currentGame) {
      throw new Error('Game not found');
    }

    // Fetch all active games except the current one
    const { data: allGames, error } = await supabase
      .from('games')
      .select('id, name, thumbnail_url, categories, tags, description')
      .eq('is_active', true)
      .neq('id', gameId);

    if (error) {
      throw new Error(`Error fetching games: ${error.message}`);
    }

    // Calculate similarity scores
    const scoredGames = allGames.map((game) => {
      let score = 0;

      // Category matching (higher weight)
      const currentCategories = currentGame.categories || [];
      const gameCategories = game.categories || [];
      const categoryMatches = currentCategories.filter((cat: string) =>
        gameCategories.includes(cat)
      ).length;
      score += categoryMatches * 3;

      // Tag matching (lower weight)
      const currentTags = currentGame.tags || [];
      const gameTags = game.tags || [];
      const tagMatches = currentTags.filter((tag: string) =>
        gameTags.includes(tag)
      ).length;
      score += tagMatches * 1;

      // Bonus for having all or most categories in common
      if (
        currentCategories.length > 0 &&
        categoryMatches === currentCategories.length
      ) {
        score += 5;
      }

      return {
        ...game,
        relevanceScore: score,
      };
    });

    // Filter out games with zero score and sort by relevance
    const relatedGames = scoredGames
      .filter((game) => game.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
      .map(({ relevanceScore, ...game }) => game); // Remove relevanceScore from response

    return relatedGames;
  } catch (error) {
    console.error('Error fetching related games:', error);
    throw error;
  }
}