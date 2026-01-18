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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 pb-4 hide-scrollbar">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Provider Information</h3>
          </div>
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Provider Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter provider name" {...field} className="bg-muted border-border text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} className="bg-muted border-border text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter provider description (optional)" 
                    {...field} 
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a brief description of the provider (optional).
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Logo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/logo.png" {...field} className="bg-muted border-border text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the URL of the provider's logo image (optional).
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t border-border pt-6">
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-muted">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-medium text-foreground">
                    Active Status
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Set whether this provider is currently active.
                  </p>
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
        </div>

        <div className="flex gap-3 justify-end pt-6 border-t border-border">
          <Button 
            variant="outline" 
            type="button"
            className="border-border text-foreground hover:bg-muted bg-transparent"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? 'Adding Provider...' : 'Add Provider'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
