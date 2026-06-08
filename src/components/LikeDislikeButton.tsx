'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { dislikeGame, getLikedOrDisliked, likeGame } from '@/lib/controllers/like';

interface LikeDislikeButtonsProps {
  gameId: number;
  userId: string | undefined;
}

export function LikeDislikeButtons({ gameId, userId }: LikeDislikeButtonsProps) {
  const [like, setLike] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (userId) {
        const response = await getLikedOrDisliked(gameId, userId);
        setLike(response?.is_like);
      }
    };
    fetchStatus();
  }, [gameId, userId]);

  const likeHandler = async () => {
    if (userId) {
      const response = await likeGame(gameId, userId);
      if (response?.status === 200) {
        setLike(true);
      }
    } else {
      toast('Sign in to like games');
    }
  };

  const dislikeHandler = async () => {
    if (userId) {
      const response = await dislikeGame(gameId, userId);
      if (response?.status === 200) {
        setLike(false);
      }
    } else {
      toast('Sign in to dislike games');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={likeHandler}
        variant="outline"
        size="icon"
        className={`text-foreground bg-card hover:bg-primary hover:text-primary-foreground ${like ? "bg-primary text-primary-foreground" : ""}`}
        aria-label="Like game"
      >
        <ThumbsUp className="h-5 w-5" aria-hidden="true" />
      </Button>
      <Button
        onClick={dislikeHandler}
        variant="outline"
        size="icon"
        className={`text-foreground bg-card hover:bg-primary hover:text-primary-foreground ${(like === false) ? "bg-primary text-primary-foreground" : ""}`}
        aria-label="Dislike game"
      >
        <ThumbsDown className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
}