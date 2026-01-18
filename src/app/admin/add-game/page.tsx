"use client"

import { useEffect, useState } from 'react';
import { ProviderForm, ProviderFormData, Provider } from '@/components/admin/provider-form';
import { addProvider, getAllProviders } from '@/lib/controllers/providers';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { GameFormData } from '@/types/games';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateGameForm } from '@/components/admin/create-game-form';
import axios from 'axios';
import { getAllCategories } from '@/lib/controllers/categories';
import { getAllTags } from '@/lib/controllers/tags';

export default function AddGamePage() {
  const [activeTab, setActiveTab] = useState('add-game');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAll = async () => {
      const providers = await getAllProviders();
      const categories = (await getAllCategories()).map((item: any) => item.category);
      const tags = (await getAllTags()).map((item: any) => item.tag);
      setProviders(providers);
      setCategories(categories);
      setTags(tags);
    }
    fetchAll();
  },[]);

  const handleAddProvider = async (providerData: ProviderFormData) => {
    try {
      const newProvider = await addProvider(providerData);
      toast.success('Provider added successfully');
      setActiveTab('add-game');
    } catch (error) {
      console.error('Failed to add provider:', error);
      toast.error('Failed to add provider');
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-8 bg-background text-foreground">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Game Management</h1>
        <p className="text-muted-foreground mt-2">Add new games or create game providers</p>
      </div>
      
      <Card className="bg-card border-border shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted m-6 mb-0 p-1 h-auto">
            <TabsTrigger 
              value="add-game"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all rounded-md"
            >
              Add New Game
            </TabsTrigger>
            <TabsTrigger 
              value="add-provider"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all rounded-md"
            >
              Create New Provider
            </TabsTrigger>
          </TabsList>
          <CardContent className="p-6 border-t border-border">
            <TabsContent value="add-game">  
              <CreateGameForm providers={providers} categories={categories} tags={tags} />
            </TabsContent>
            <TabsContent value="add-provider">
              <ProviderForm onSubmit={handleAddProvider} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      <Toaster position='bottom-right' />
    </div>
  );
}