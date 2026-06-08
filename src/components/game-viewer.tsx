'use client'

import { useState, useRef, useEffect } from "react"
import { Maximize2, Minimize2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import GameNotFound from "./game-not-found"
import { updateGamePlays } from "@/lib/controllers/games"

interface GameViewerProps {
  play_url: string
  thumbnail?: string
  game_id: number
}

export function GameViewer({ play_url, thumbnail, game_id }: GameViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [iframeError, setIframeError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const onPlay = async () => {
    const response = await updateGamePlays(game_id);
    if (response.error) {
      console.error(`Error updating game play count: ${response.error}`);
    }
    setIsPlaying(true);
  }

  return (
    <div ref={containerRef} className="relative rounded-lg overflow-hidden bg-[#2a1b52]">
      {!isPlaying ? (
        <div className="relative aspect-video">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="Game thumbnail"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No thumbnail available</span>
            </div>
          )}
          <Button
            onClick={async () => await onPlay()}
            variant="neon"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size="lg"
          >
            Play
          </Button>
        </div>
      ) : (
        <div className={`relative ${isFullscreen ? 'w-screen h-screen' : 'aspect-video'}`}>
          {!iframeError ? (
            <iframe
              src={play_url}
              onError={() => setIframeError(true)}
              className="w-full h-full"
              title="Content"
            />
          ) : (
            <GameNotFound />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            {isFullscreen ? (
              <Minimize2 className="h-6 w-6" />
            ) : (
              <Maximize2 className="h-6 w-6" />
            )}
          </Button>
        </div>
      )}
    </div>
  )
}