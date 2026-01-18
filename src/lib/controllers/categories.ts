'use server'
import { createClient } from "../utils/supabase/server";


export const getAllCategories = async ():Promise<any[]> => {
    const supabase = await createClient();
    try {
        const user = (await supabase.auth.getUser()).data.user;
        const { data, error } = await supabase.from('categories').select('category');
          if (error) {
          throw new Error(`Error getting categories: ${error.message}`);
        }
        return data;
    } catch (err) {
        console.error('Error getting categories:', err);
        throw err;
    }
}

export const addCategory = async (category: string) => {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('categories').insert({
            category: category
        }).select();
          if (error) {
          throw new Error(`Error inserting category: ${error.message}`);
        }
        return data;
    } catch (err) {
        console.error('An unexpected error occured while inserting category:', err);
        throw err;
    }
}

export async function getUsedCategories() {
    const supabase = await createClient();
    const chunkSize = 1000;
    let allGamesCategories: any[] = [];
    let hasMore = true;
    let lastId = 0;
  
    try {
      while (hasMore) {
        const { data, error } = await supabase
          .from('games')
          .select('id, categories')
          .not('categories', 'is', null)
          .gt('id', lastId)
          .order('id', { ascending: true })
          .limit(chunkSize);
  
        if (error) {
          throw new Error(`Error fetching categories: ${error.message}`);
        }
  
        if (data.length === 0) {
          hasMore = false;
        } else {
          allGamesCategories = [...allGamesCategories, ...data];
          lastId = data[data.length - 1].id;
          if (data.length < chunkSize) {
            hasMore = false;
          }
        }
      }
  
      // Flatten the categories array and count occurrences
      const categoryCounts: { [key: string]: number } = {};
  
      allGamesCategories.forEach((game) => {
        if (Array.isArray(game.categories)) {
          game.categories.forEach((category: string) => {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
        }
      });
  
      const sortedCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
  
      return sortedCategories;
    } catch (error) {
      console.error('Error fetching used categories:', error);
      return [];
    }
}

export const getAllCategoriesForSitemap = async (): Promise<any[]> => {
  const usedCategories = await getUsedCategories();
  
  return usedCategories.map(category => ({
      category: category.category
  }));
};
