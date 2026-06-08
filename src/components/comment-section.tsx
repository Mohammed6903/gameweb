"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Comment {
  id: string
  name: string
  message: string
  createdAt: string
}

interface CommentSectionProps {
  gameId: string
}

export function CommentSection({ gameId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && message) {
      const newComment: Comment = {
        id: Date.now().toString(),
        name,
        message,
        createdAt: new Date().toISOString(),
      }
      setComments([newComment, ...comments])
      setName('')
      setEmail('')
      setMessage('')
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-none p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Comments</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/5 border-input focus:border-primary"
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border-input focus:border-primary"
        />
        <Textarea
          placeholder="Your comment"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-white/5 border-input focus:border-primary min-h-[100px]"
        />
        <Button type="submit" variant="neon" className="w-full">
          Submit Comment
        </Button>
      </form>
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar>
              <AvatarFallback>{comment.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{comment.name}</h3>
                <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-foreground">{comment.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

