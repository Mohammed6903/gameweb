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
      toast('Sign in to comment');
      return;
    }
    if (!newComment.trim()) {
      toast('Comment cannot be empty!');
      return;
    }
  
    try {
      const { data, error } = await postComment(gameId, newComment);
      if (error) {
        toast("Failed to post comment. Please try again.");
        console.error(error);
        return;
      }
  
      if (data) {
        setComments([data, ...comments]); 
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast("Failed to post comment. Please try again.");
    }
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handlePostComment} className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="bg-white/5 border-white/10 focus:border-purple-500"
        />
        <div className="py-4">
          <Button className="bg-white to purple-400 px-3 py-2 text-black" type="submit">Post Comment</Button>
        </div>
      </form>
      <div className="space-y-4">
      {comments.map((comment) => {
        const userTimeZoneDate = new Date(comment.createdAt).toLocaleString(undefined, {
          timeZoneName: 'short',
        });

        return (
          <div key={comment.id} className="flex space-x-4">
            <div className="flex-1">
              <p className="font-semibold">{comment.user}</p>
              <p className="text-sm text-gray-400">{userTimeZoneDate}</p>
              <p className="mt-1">{comment.content}</p>
            </div>
          </div>
        );
      })}

      </div>
    </div>
  );
}
