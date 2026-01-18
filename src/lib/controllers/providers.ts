'use server'
import { Provider, ProviderFormData } from "@/components/admin/provider-form";
import { createClient } from "../utils/supabase/server";

export const addProvider = async (providerData: ProviderFormData) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('providers').insert({
      name: providerData.name,
      url: providerData.url,
      description: providerData.description || null,
      logo_url: providerData.logo_url || null,
      is_active: providerData.is_active,
      created_at: new Date().toISOString(),
    }).select();
    if (error) {
      throw new Error(`Error adding provider: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Error adding provider:', err);
    throw err;
  }
};

export const upsertProvider = async (providerData: ProviderFormData) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('providers').upsert({
      name: providerData.name,
      url: providerData.url,
      description: providerData.description || null,
      logo_url: providerData.logo_url || null,
      is_active: providerData.is_active,
      created_at: new Date().toISOString(),
    }, {onConflict: 'url'}).select();
    if (error) {
      throw new Error(`Error adding provider: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Error adding provider:', err);
    throw err;
  }
};

export const getAllProviders = async (): Promise<Provider[]> => {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('providers').select('*');
          if (error) {
          throw new Error(`Error adding provider: ${error.message}`);
        }
        return data;
    } catch (err) {
        console.error('Error adding provider:', err);
        throw err;
    }
}