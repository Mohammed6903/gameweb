import React from 'react';
import { Card } from "@/components/ui/card";

export const HeaderSkeleton = () => (
  <div>
    <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
    <div className="h-5 w-96 bg-muted rounded-lg mt-2 animate-pulse" />
  </div>
);

export const QuickStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="bg-card border-border shadow-sm animate-pulse">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="w-5 h-5 bg-muted rounded" />
          </div>
          <div className="h-8 w-16 bg-muted rounded mb-2" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
      </Card>
    ))}
  </div>
);

export const ChartsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2].map((i) => (
      <Card key={i} className="bg-card border-border shadow-sm animate-pulse">
        <div className="p-6 border-b border-border">
          <div className="h-6 w-40 bg-muted rounded" />
        </div>
        <div className="p-6">
          <div className="h-64 bg-muted rounded" />
        </div>
      </Card>
    ))}
  </div>
);

export const ActionsSkeleton = () => (
  <div className="bg-card border border-border rounded-lg p-6 shadow-sm animate-pulse">
    <div className="h-6 w-32 mb-4 bg-muted rounded" />
    <div className="flex gap-3">
      <div className="h-10 w-32 bg-muted rounded" />
      <div className="h-10 w-32 bg-muted rounded" />
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="space-y-8 p-6 md:p-8 bg-background text-foreground">
      <HeaderSkeleton />
      <QuickStatsSkeleton />
      <ChartsSkeleton />
      <ActionsSkeleton />
    </div>
  );
}