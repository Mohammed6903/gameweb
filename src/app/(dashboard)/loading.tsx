import React from 'react';
import { Gamepad2, Laptop2, Users2, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const WelcomeSkeleton = () => (
  <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm animate-pulse">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
          <div className="w-8 h-8 bg-muted rounded" />
        </div>
        <div>
          <div className="h-8 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-36 bg-muted rounded-lg mt-2" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-0">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-32 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

export const FeaturedGamesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Card 
        key={i}
        className="group relative overflow-hidden rounded-2xl bg-card border-transparent animate-pulse"
      >
        <div className="relative w-full h-[200px]">
          <div className="w-full h-full bg-muted rounded-t-2xl" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end">
          <div className="h-6 w-3/4 bg-white/10 rounded mb-2" />
          <div className="h-4 w-1/2 bg-white/10 rounded" />
        </div>
      </Card>
    ))}
  </div>
);

export const CategorySkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card 
          key={i}
          className="group relative overflow-hidden rounded-xl bg-card border-transparent animate-pulse"
        >
          <div className="aspect-square relative">
            <div className="w-full h-full bg-muted" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end">
              <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
              <div className="flex gap-1">
                <div className="h-6 w-16 bg-white/10 rounded-full" />
                <div className="h-6 w-16 bg-white/10 rounded-full" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export const GamesCarouselSkeleton = () => {
  const getGridColumns = () => {
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className={`grid ${getGridColumns()} gap-4`}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card 
            key={index}
            className="relative overflow-hidden rounded-xl bg-card border-transparent animate-pulse"
          >
            <div className="aspect-square relative">
              <div className="w-full h-full bg-muted" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end">
                <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                <div className="flex gap-1">
                  <div className="h-6 w-16 bg-white/10 rounded-full" />
                  <div className="h-6 w-16 bg-white/10 rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12 space-y-12">
        {/* Welcome Section */}
        <WelcomeSkeleton />

        {/* Featured Games */}
        <section>
          <div className="h-8 w-48 bg-muted rounded-lg animate-pulse mb-6" />
          <FeaturedGamesSkeleton />
        </section>

        {/* Categories */}
        {[1, 2, 3].map((i) => (
          <section key={i} className="scroll-mt-20">
            <CategorySkeleton />
          </section>
        ))}
      </div>
    </div>
  );
}