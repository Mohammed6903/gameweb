import { Card } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8 lg:p-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
              <div className="w-64 h-10 bg-muted rounded-lg animate-pulse" />
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Game Viewer Skeleton */}
            <div className="rounded-lg overflow-hidden shadow-sm border border-border">
              <div className="aspect-video bg-muted animate-pulse" />
            </div>

            {/* Game Details Skeleton */}
            <Card className="bg-card border border-border rounded-lg shadow-sm">
              <div className="p-6 space-y-4">
                <div className="w-48 h-8 bg-muted rounded-lg animate-pulse" />
                <div className="space-y-3">
                  <div className="w-full h-4 bg-muted rounded animate-pulse" />
                  <div className="w-5/6 h-4 bg-muted rounded animate-pulse" />
                  <div className="w-4/6 h-4 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-24 h-8 bg-muted rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Comments Section Skeleton */}
            <Card className="bg-card border border-border rounded-lg shadow-sm">
              <div className="p-6 space-y-4">
                <div className="w-40 h-8 bg-muted rounded-lg animate-pulse" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                      <div className="w-32 h-4 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="w-full h-16 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="w-full h-[300px] bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
