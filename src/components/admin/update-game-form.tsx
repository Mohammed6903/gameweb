'use client'
import { BaseGameForm } from './base-game-form';
import { Game, GameFormData} from '@/types/games';
import { Provider } from './provider-form';

interface UpdateGameFormProps {
  initialData: Game;
  providers: Provider[];
  categories: string[];
  tags: string[];
  onSubmit: (data: GameFormData) => Promise<void>;
}

export function UpdateGameForm({ initialData, providers, categories, tags, onSubmit }: UpdateGameFormProps) {
  return (
    <BaseGameForm
      initialData={initialData}
      providers={providers}
      categories={categories}
      tags={tags}
      onSubmit={onSubmit}
      submitButtonText="Update Game"
    />
  );
}