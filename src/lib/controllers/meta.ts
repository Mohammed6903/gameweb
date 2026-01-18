"use server"
import { createClient } from "../utils/supabase/server";

export const insertMeta = async (title: string, description: string) => {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
          .from('site_metadata')
          .upsert([{ site_name: title, description: description, updated_at: new Date().toISOString() }],  {onConflict: 'site_name'} );
        
        if (error) {
            console.error("Error saving site meta:", error);
            return {error};
        }
        const { error: cleanupError } = await supabase
        .from('site_metadata')
        .delete()
        .neq('site_name', title);

        if (cleanupError) {
            console.error('Error during cleanup:', cleanupError.message);
        }
        return {status: 200, data: data}
    } catch (error) {
        console.error("Unexpected error saving site meta:", error);
        return {error};
    }
}

export const getMeta = async () => {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
          .from('site_metadata')
          .select()
          .maybeSingle();
        
        if (error) {
            console.error("Error fetching site meta:", error);
            return { status: 500, error };
        }

        // Return empty object if no data found
        return { status: 200, data: data || {} };
    } catch (error) {
        console.error("Unexpected error fetching site meta:", error);
        return { status: 500, error };
    }
}


export const saveFavIcon = async (type: string, publicUrl: string) => {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
          .from('favIcon')
          .upsert({
            type: type,
            publicUrl: publicUrl
          }, {onConflict: 'type'})
        
        if (error) {
            console.error("Error saving favIcon in table: ", error);
            return {error: error.message};
        }

        return {status: 200}
    } catch (error) {
        console.error("Unexpected error saving site meta:", error);
        return {error: error};
    }
}

export const getFavIcons = async () => {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
          .from('favIcon')
          .select()
        
        if (error) {
            console.error("Error saving favIcon in table: ", error);
            return {error: error.message};
        }

        return {status: 200, data: data}
    } catch (error) {
        console.error("Unexpected error saving site meta:", error);
        return {error: error};
    }
}

export const getFavIconByType = async (type: string) => {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
          .from('favIcon')
          .select()
          .eq('type', type)
          .maybeSingle(); // Use maybeSingle() instead of single()
        
        if (error) {
            console.error("Error fetching favIcon:", error);
            return { status: 500, error: error.message };
        }

        return { status: 200, data: data || null };
    } catch (error) {
        console.error("Unexpected error fetching favIcon:", error);
        return { status: 500, error };
    }
}