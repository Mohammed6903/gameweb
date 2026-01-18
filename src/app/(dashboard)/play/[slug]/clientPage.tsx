'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CommentSection } from '@/components/comment';
import { GameViewer } from '@/components/game-viewer';
import { GamePageAd } from '@/components/adSense/game-page-ads';
import { Tag, Gamepad2, TrendingUp } from 'lucide-react';
import { LikeDislikeButtons } from '@/components/LikeDislikeButton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AdSettings {
  google_client_id: string;
  carousel_ad_frequency: number;
  carousel_ad_slot: string;
  carousel_ad_format: string;
  carousel_ad_full_width: boolean;
  sidebar_ad_slot: string;
  sidebar_ad_format: string;
  sidebar_ad_full_width: boolean;
  game_view_ad_slot: string;
  game_view_ad_format: string;
  game_view_ad_full_width: boolean;
  comment_section_ad_slot: string;
  comment_section_ad_format: string;
  comment_section_ad_full_width: boolean;
  show_carousel_ads: boolean;
  show_sidebar_ads: boolean;
  show_game_view_ads: boolean;
  show_comment_section_ads: boolean;
  sidebar_ad_count: number;
}

interface RelatedGame {
  id: number;
  name: string;
  thumbnail_url: string;
  categories: string[];
  description: string;
}

interface GamePageProps {
  game: {
    id: number;
    name: string;
    description: string;
    play_url: string;
    thumbnail_url: string;
    categories: string[];
    tags: string[];
  };
  user: { id: string } | null;
  adSetting: AdSettings;
  relatedGames: RelatedGame[];
}

export default function GamePage({ game, user, adSetting, relatedGames }: GamePageProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    description: game.description,
    image: game.thumbnail_url,
    genre: game.categories,
    gamePlatform: 'Web Browser',
    applicationCategory: 'Game',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-[2000px] mx-auto">
          {/* Main Content */}
          <div className="flex-1 lg:max-w-[calc(100%-426px)]">
            {/* Game Viewer with Gradient Border */}
            <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-[2px]">
              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                <GameViewer play_url={game.play_url} thumbnail={game.thumbnail_url} game_id={game.id} />
              </div>
            </div>

            {/* Game Title Section */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
                    {game.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {game.categories.map((category) => (
                      <Link
                        key={category}
                        href={`/categories/${category}`}
                      >
                        <Badge 
                          variant="secondary" 
                          className="hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5 text-sm font-medium"
                        >
                          <Tag className="w-3 h-3 mr-1.5" />
                          {category}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <LikeDislikeButtons gameId={game.id} userId={user?.id} />
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-card border border-border rounded-xl p-5 mb-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">About This Game</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap mb-4">
                {game.description}
              </p>
              
              {game.tags && game.tags.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {game.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Ad Below Description */}
            {adSetting.show_game_view_ads && (
              <div className="mb-6 rounded-xl overflow-hidden border border-border bg-card/50 p-4">
                <GamePageAd
                  adSlot={adSetting.game_view_ad_slot}
                  adFormat={adSetting.game_view_ad_format}
                  dataFullWidthResponsive={adSetting.game_view_ad_full_width}
                />
              </div>
            )}

            {/* Ad Before Comments */}
            {adSetting.show_comment_section_ads && (
              <div className="mb-6 rounded-xl overflow-hidden border border-border bg-card/50 p-4">
                <GamePageAd
                  adSlot={adSetting.comment_section_ad_slot}
                  adFormat={adSetting.comment_section_ad_format}
                  dataFullWidthResponsive={adSetting.comment_section_ad_full_width}
                />
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-6">
              <CommentSection gameId={game.id} userId={user?.id}/>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-[410px] flex-shrink-0">
            {/* Related Games */}
            {relatedGames && relatedGames.length > 0 && (
              <div className="sticky top-20">
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-4">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-bold text-foreground">Recommended For You</h2>
                    </div>
                  </div>
                  
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {relatedGames.map((relatedGame, index) => (
                      <Link
                        key={relatedGame.id}
                        href={`/play/${relatedGame.id}`}
                        className="flex gap-3 p-3 hover:bg-muted/50 transition-all duration-200 group border-b border-border last:border-b-0"
                      >
                        {/* Thumbnail with Overlay */}
                        <div className="relative w-40 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted shadow-sm">
                          <Image
                            src={relatedGame.thumbnail_url || '/placeholder.png'}
                            alt={relatedGame.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            Play Now
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 py-1">
                          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {relatedGame.name}
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {relatedGame.categories.slice(0, 2).map((cat) => (
                              <span
                                key={cat}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sidebar Ads */}
                {adSetting.show_sidebar_ads && (
                  <div className="space-y-4">
                    {Array.from({ length: adSetting.sidebar_ad_count }).map((_, index) => (
                      <div
                        key={`sidebar-ad-${index}`}
                        className="rounded-xl overflow-hidden border border-border bg-card/50 p-4 shadow-sm"
                      >
                        <GamePageAd
                          adSlot={adSetting.sidebar_ad_slot}
                          adFormat={adSetting.sidebar_ad_format}
                          dataFullWidthResponsive={adSetting.sidebar_ad_full_width}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}