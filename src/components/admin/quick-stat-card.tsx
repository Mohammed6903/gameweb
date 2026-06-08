'use client'

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { memo } from 'react'

interface QuickStat {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}

const ACCENTS = [
  { text: "text-primary", glow: "shadow-[0_0_14px_oklch(var(--primary)/0.5)]" },
  { text: "text-accent", glow: "shadow-[0_0_14px_oklch(var(--accent)/0.5)]" },
  { text: "text-[oklch(0.7_0.22_290)]", glow: "shadow-[0_0_14px_oklch(0.55_0.25_290/0.5)]" },
]

export const QuickStatsCard = memo(({ stat, index }: { stat: QuickStat; index: number }) => {
  const Icon = stat.icon
  const accent = ACCENTS[index % ACCENTS.length]

  return (
    <Card className="bg-card border border-border neon-border-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
        <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${accent.glow}`}>
          <Icon className={`h-5 w-5 ${accent.text}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground font-display">{stat.value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground mt-1">Total active</p>
      </CardContent>
    </Card>
  )
})

QuickStatsCard.displayName = 'QuickStatsCard'
