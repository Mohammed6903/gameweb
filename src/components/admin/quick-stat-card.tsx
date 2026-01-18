'use client'

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { memo } from 'react'

interface QuickStat {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
}

export const QuickStatsCard = memo(({ stat }: { stat: QuickStat }) => {
  const Icon = stat.icon
  
  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
        <Icon className="h-5 w-5 text-primary opacity-70" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground mt-1">Total active</p>
      </CardContent>
    </Card>
  )
})

QuickStatsCard.displayName = 'QuickStatsCard'
