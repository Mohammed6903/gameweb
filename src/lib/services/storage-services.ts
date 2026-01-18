"use client";
import { createClient } from "@/lib/utils/supabase/client";

export async function uploadGameThumbnail(file: File): Promise<string> {
    const supabase = await createClient();
    const {data: uploadedFile, error} = await supabase
    .storage
    .from('gameThumbnails')
    .upload(`public/${file.name}-${new Date()}`, file, {
        cacheControl: '3600',
        upsert: false
    });
    if (error) {
        throw new Error(`Error uploading file: ${error}`);
    }

    const {data} = supabase
    .storage
    .from('gameThumbnails')
    .getPublicUrl(`${uploadedFile?.path}`);
    
    return data.publicUrl;
}

export async function uploadFavIcon(file: File): Promise<{url?: string, error?: string}> {
    const supabase = await createClient();
    const {data: uploadedFile, error} = await supabase
    .storage
    .from('favIcons')
    .upload(`public/${file.name}`, file, {
        cacheControl: '3600',
        upsert: true
    });
    if (error) {
        throw new Error(`Error uploading file: ${error}`);
        return {error: error?.message};
    }

    const {data} = supabase
    .storage
    .from('favIcons')
    .getPublicUrl(`${uploadedFile?.path}`);
    
    return {url: data.publicUrl};
}