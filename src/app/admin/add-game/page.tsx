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
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
        Game Management
      </h1>
      
      <Card className="bg-gray-800 shadow-lg rounded-lg border-gray-700">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger 
              value="add-game"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-gray-100"
            >
              Add New Game
            </TabsTrigger>
            <TabsTrigger 
              value="add-provider"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-gray-100"
            >
              Create New Provider
            </TabsTrigger>
          </TabsList>
          <CardContent className="p-6">
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