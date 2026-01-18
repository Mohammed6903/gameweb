"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const providerFormSchema = z.object({
  name: z.string().min(2, 'Provider name must be at least 2 characters'),
  url: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export type ProviderFormData = z.infer<typeof providerFormSchema>;

export interface Provider {
  id: string;
  name: string;
  url: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
}

interface ProviderFormProps {
  onSubmit: (data: ProviderFormData) => Promise<void>;
}

export function ProviderForm({ onSubmit }: ProviderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: '',
      url: '',
      description: '',
      logo_url: '',
      is_active: true,
    },
  });

  const handleSubmit = async (data: ProviderFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Failed to add provider:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-4 hide-scrollbar">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Provider Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter provider name" {...field} className="bg-gray-700 text-gray-100 border-gray-600" />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Website URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} className="bg-gray-700 text-gray-100 border-gray-600" />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter provider description (optional)" 
                  {...field} 
                  className="bg-gray-700 text-gray-100 border-gray-600"
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                Provide a brief description of the provider (optional).
              </FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} className="bg-gray-700 text-gray-100 border-gray-600" />
              </FormControl>
              <FormDescription className="text-gray-400">
                Enter the URL of the provider's logo image (optional).
              </FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4 bg-gray-800">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-gray-200">
                  Active Status
                </FormLabel>
                <FormDescription className="text-gray-400">
                  Set whether this provider is currently active.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-800 disabled:text-gray-300"
        >
          {isSubmitting ? 'Adding Provider...' : 'Add Provider'}
        </Button>
      </form>
    </Form>
  );
}