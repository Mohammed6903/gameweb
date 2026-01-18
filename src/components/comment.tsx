"use client";

import { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchComments, postComment } from "@/lib/controllers/comment";
import { toast } from "sonner";

interface Comment {
  id: number;
  user: string;  
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  gameId: number;
  userId: string | undefined;
}

export function CommentSection({ gameId, userId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(gameId);
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    loadComments();
  }, [gameId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error('Sign in to comment');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty!');
      return;
    }
  
    try {
      const { data, error } = await postComment(gameId, newComment);
      if (error) {
        toast.error("Failed to post comment. Please try again.");
        console.error(error);
        return;
      }
  
      if (data) {
        setComments([data, ...comments]); 
        setNewComment("");
        toast.success('Comment posted successfully!');
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Try parsing the date string
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      
      // Format the date
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Date parsing error:', error, dateString);
      return 'Just now';
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handlePostComment} className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="bg-background/60 border-border/60 focus-visible:ring-ring resize-none min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      </form>
      
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {comment.user.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{comment.user}</p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}