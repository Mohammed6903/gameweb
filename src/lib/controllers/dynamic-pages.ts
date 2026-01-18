'use server'
import { ContactInfo } from "@/app/(dashboard)/pages/contacts/page";
import { createClient } from "../utils/supabase/server";

export async function getPageContent(slug: string): Promise<{ content: string }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('content')
      .eq('slug', slug)
      .single();
  
    if (error) {
      throw new Error(`Error fetching page content: ${error.message}`);
    }
  
    return { content: data.content };
}

export const createPage = async (slug: string, content: string) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('pages')
      .insert([{ slug, content }]);

    if (error) {
      throw new Error(`Error creating page: ${error.message}`);
    }

  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
};

export const updatePage = async (slug: string, content: string) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('pages')
      .upsert({ slug, content, updated_at: new Date() }, {onConflict: 'slug'})
      .select();

    if (error) {
      throw new Error(`Error creating page: ${error.message}`);
    }
    return data;

  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
};

export const deletePage = async (slug: string, content: string) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('slug', slug);

    if (error) {
      throw new Error(`Error creating page: ${error.message}`);
    }

  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
};

export const getAllPages = async (): Promise<any[]> => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*');

    if (error) {
      throw new Error(`Error creating page: ${error.message}`);
    }

    return data;

  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
};

export async function getContactInfo(): Promise<ContactInfo> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .single();

  if (error) {
    throw new Error(`Error fetching contact info: ${error.message}`);
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    address: data.address,
    email: data.email,
    phone: data.phone,
    formTitle: data.form_title,
    formDescription: data.form_description,
    socialTitle: data.social_title,
    socialLinks: data.social_links,
  };
}

export const upsertContactInfo = async (contactInfo: ContactInfo) => {
  const {
    title,
    description,
    address,
    email,
    phone,
    formTitle,
    formDescription,
    socialTitle,
    socialLinks,
  } = contactInfo;

  const supabase = await createClient();

  try {
    const { data: existing, error: existingError } = await supabase
      .from('contact_info')
      .select('id')
      .limit(1)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw new Error(`Error fetching contact info: ${existingError.message}`);
    }

    if (existing?.id) {
      const { data, error } = await supabase
        .from('contact_info')
        .update({
          title,
          description,
          address,
          email,
          phone,
          form_title: formTitle,
          form_description: formDescription,
          social_title: socialTitle,
          social_links: socialLinks,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating contact info: ${error.message}`);
      }

      return data;
    }

    const { data, error } = await supabase
      .from('contact_info')
      .insert({
        title,
        description,
        address,
        email,
        phone,
        form_title: formTitle,
        form_description: formDescription,
        social_title: socialTitle,
        social_links: socialLinks,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating contact info: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating contact info:', error);
    throw error;
  }
};