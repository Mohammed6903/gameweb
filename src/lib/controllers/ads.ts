'use server'
import { AdSettings } from "@/types/ads";
import { HeaderScript, SavedScript } from "@/types/script";
import { createClient } from "../utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { supabaseAdmin } from "../utils/supabase/admin";

/**
 * Fetch ad settings from the database.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getAdSettings(): Promise<{data: any, error: PostgrestError | null | any}> {
    try {
        const { data, error } = await supabaseAdmin
        .from('ad_settings')
        .select('*')
        .single();

        if (error) {
            console.error('Error fetching ad settings:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Unexpected error fetching ad settings:', error);
        return { data: null, error };
    }
}

/**
 * Update ad settings in the database.
 * @param {object} adSettings - The updated ad settings object.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function updateAdSettings(adSettings: AdSettings) {
    try {
        const { data: existingRow, error: fetchError } = await supabaseAdmin
            .from('ad_settings')
            .select('id')
            .single();

        if (fetchError && fetchError.details !== 'Results contain 0 rows') {
            console.error('Error fetching existing settings:', fetchError);
            return { data: null, error: fetchError };
        }

        if (existingRow) {
            // If a row exists, update it
            const { id, ...saveSettings } = adSettings;
            const { data, error } = await supabaseAdmin
                .from('ad_settings')
                .update(saveSettings)
                .eq('id', existingRow.id);

            if (error) {
                console.error('Error updating ad settings:', error);
                return { data: null, error };
            }

            return { data, error: null };
        } else {
            const { data, error } = await supabaseAdmin.from('ad_settings').insert([adSettings]);
            if (error) {
                console.error('Error inserting new ad settings:', error);
                return { data: null, error };
            }

            return { data, error: null };
        }
    } catch (error) {
        console.error('Unexpected error updating ad settings:', error);
        return { data: null, error };
    }
}

/**
 * Parse a DOM element as text and get all its attributes in JSON format (Server-side, no JSDOM).
 * @param elementText - The serialized HTML string of the element.
 * @returns A JSON object containing all attributes of the element.
 */
export async function parseElementAttributesFromText(
    elementText: string
): Promise<{ attributes: Record<string, string>, type: string }> {
    if (typeof elementText !== "string" || !elementText.trim()) {
        throw new Error("Invalid element text provided. Must be a non-empty string.");
    }

    const trimmed = elementText.trim();
    
    // Extract tag name
    const tagMatch = trimmed.match(/^<(\w+)/);
    if (!tagMatch) {
        throw new Error("Invalid HTML structure. Could not parse element.");
    }
    
    const type = tagMatch[1].toLowerCase();
    
    // Extract all attributes using regex
    const attributes: Record<string, string> = {};
    const attrRegex = /(\w+(?:-\w+)*)=["']([^"']*)["']/g;
    let match;
    
    while ((match = attrRegex.exec(trimmed)) !== null) {
        attributes[match[1]] = match[2];
    }

    return { attributes, type };
}

export async function getAllScripts(): Promise<{status: number, data?: SavedScript[], message?: string}> {
    try {
        const {data, error} = await supabaseAdmin.from('adsense_scripts').select();
        if (error) {
            return {status: 404, message: 'Error fetching adsense scripts'};
        } else {
            return {status: 200, data: data};
        }
    } catch (error: any) {
        return {status: 500, message: 'Internal Error while fetching scripts'};
    }
}

export async function saveScript(saveData: SavedScript): Promise<{status: number, data?: SavedScript, message?: string}> {
    try {
        if (saveData.id === "create") {
            const {data, error} = await supabaseAdmin.from('adsense_scripts').upsert({
                name: saveData.name,
                element: saveData.element,
                position: saveData.position,
                script: saveData.script,
                parsedElement: saveData.parsedElement,
                updated_at: new Date().toISOString()
            }, {onConflict: 'name'}).select().single();
            if (data) {
                return {status: 200, data: data};
            } else {
                return {status: 500, message: 'Error upserting the data'};
            }
        }
        else {
            const {data, error} = await supabaseAdmin.from('adsense_scripts').update({
                name: saveData.name,
                element: saveData.element,
                position: saveData.position,
                script: saveData.script,
                parsedElement: saveData.parsedElement,
                updated_at: new Date().toISOString()
            }).eq('id', saveData.id).select().single();
            console.log(data);
            if (error) {
                return {status: 500, message: error.message};
            } else {
                return {status: 200, data: data};
            }
        }
    } catch (error: any) {
        return {status: 500, message: 'Internal Error while inserting scripts'};
    }
}

export async function deleteScript(id: string): Promise<{status: number, message?: string}> {
    try {
        const {data, error} = await supabaseAdmin.from('adsense_scripts').delete().eq('id', id).select().single();
        if (data) {
            return {status: 200, message: 'Successfully deleted the script'};
        } else {
            return {status: 500, message: `Error deleting the script: ${error}`};
        }
    } catch (error: any) {
        return {status: 500, message: `Internal Server Error whilte upserting the script: ${error}`};
    }
}

export async function getScript(id: number): Promise<{status: number, data?: any, message?: string}> {
    try {
        const {data, error} = await supabaseAdmin.from('adsense_scripts').select().eq('id', id);
        if (data) {
            return {status: 200, data: data};
        } else {
            return {status: 500, message: `Error fetching the script: ${error}`};
        }
    } catch (error: any) {
        return {status: 500, message: `Internal Server Error whilte fetching the script: ${error}`};
    }
}

export async function getAllHeadScripts() {
    try {
        const {data, error} = await supabaseAdmin.from('header_scripts').select();
        if (error) {
            console.error(`Error fetching head scripts: ${error.message}`);
            return {data: null, error: error.message};
        } else {
            return {data: data, error: null}
        }
    } catch (error: any) {
        return {data: null, error: error.message}
    }
}

export async function getHeadScript(id: number) {
    try {
        const {data, error} = await supabaseAdmin.from('header_scripts').select().eq('id', Number(id)).single();
        if (error) {
            console.error(`Error fetching head script: ${error.message}`);
            return {data: null, error: error.message};
        } else {
            return {data: data, error: null}
        }
    } catch (error: any) {
        return {data: null, error: error.message}
    }
}

export async function saveHeadScript(saveData: HeaderScript): Promise<{data: any | null, error: string | null}> {
    try {
        if (saveData.id === -1) {
            const {data, error} = await supabaseAdmin.from('header_scripts').upsert({
                script: saveData.script,
                name: saveData.name
            }, {onConflict: 'name'}).select().single();
            if (error) {
                console.error(`Error saving head script: ${error.message}`);
                return {data: null, error: error.message};
            } else {
                return {data: data, error: null}
            }
        }
        const {data, error} = await supabaseAdmin.from('header_scripts').update({
            script: saveData.script,
            name: saveData.name
        }).eq('id', saveData.id).select().single();
        if (error) {
            console.error(`Error fetching head scripts: ${error.message}`);
            return {data: null, error: error.message};
        } else {
            return {data: data, error: null}
        }
    } catch (error: any) {
        return {data: null, error: error.message}
    }
}

export async function deleteHeadScript(id: number) {
    const supabaseAdmin = await createClient();
    try {
        const {data, error} = await supabaseAdmin.from('header_scripts').delete().eq('id', id);
        if (error) {
            console.error(`Error deleting head script: ${error.message}`);
            return {status: 404, error: error.message};
        } else {
            return {status: 200, error: null}
        }
    } catch (error: any) {
        return {data: null, error: error.message}
    }
}