'use client';

import { useState } from 'react';
import { UpdateGameForm } from '@/components/admin/update-game-form';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { Game } from '@/types/games';
import { updateGame } from '@/lib/controllers/games';

export default function EditGameClient({
  initialGame,
  providers,
  categories,
  tags,
}: {
  initialGame: any;
  providers: any[];
  categories: any[];
  tags: any[];
}) {
  const router = useRouter();
  const [game, setGame] = useState<Game>({
    id: initialGame?.id,
    name: initialGame?.name,
    description: initialGame?.description,
    status: initialGame?.is_active ? 'active' : 'inactive',
    play_url: initialGame?.play_url,
    thumbnail_url: initialGame?.thumbnail_url,
    provider_id: initialGame?.provider_id,
    categories: initialGame?.categories,
    tags: initialGame?.tags,
  });

  const handleUpdateGame = async (gameData: any) => {
    try {
      console.log(gameData);
      await updateGame(game.id, {
        name: gameData.name,
        description: gameData.description,
        play_url: gameData.play_url,
        tags: gameData.tags,
        status: gameData.status,
        provider_id: gameData.provider_id,
        thumbnail_url: gameData.thumbnail_url,
        categories: gameData.categories,
      });
      toast.success('Game updated successfully');
      router.push('/admin/manage-games');
    } catch (error) {
      console.error('Failed to update game:', error);
      toast.error('Failed to update game');
    }
  };

  return (
    <>    
      <UpdateGameForm
          initialData={game}
          providers={providers}
          categories={categories}
          tags={tags}
          onSubmit={handleUpdateGame}
      />
      <Toaster position='bottom-right' />
    </>
  );
}
