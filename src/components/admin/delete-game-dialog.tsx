'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface DeleteGameDialogProps {
  gameId: string;
  gameTitle: string;
  onDelete: (gameId: string) => Promise<void>;
}

export function DeleteGameDialog({ 
  gameId, 
  gameTitle, 
  onDelete 
}: DeleteGameDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(gameId);
      toast.success(`Game "${gameTitle}" deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete game');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Delete Game</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to delete the game "{gameTitle}"?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">Cancel</Button>
          </DialogClose>
          <Button 
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
