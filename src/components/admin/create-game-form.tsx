// 'use client';
import { BaseGameForm } from './base-game-form';
import { GameFormData } from '@/types/games';
import { Provider } from '@/components/admin/provider-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { addGame } from '@/lib/controllers/games';

interface CreateGameFormProps {
  providers: Provider[];
  categories: string[];
  tags: string[];
}

export function CreateGameForm({ providers, categories, tags }: CreateGameFormProps) {
  const router = useRouter();
  const handleAddGame = async (gameData: GameFormData) => {
    try {
      const newGame = await addGame(gameData);
      toast.success('Game added successfully');
      router.push('/admin/manage-games');
    } catch (error) {
      console.error('Failed to add game:', error);
      toast.error('Failed to add game');
    }
  };

  return (
    <>    
      <BaseGameForm
        initialData={{}}
        providers={providers}
        categories={categories}
        tags={tags}
        onSubmit={handleAddGame}
        submitButtonText="Add Game"
      />
    </>
  );
}
