"use client"
import { Gamepad, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { QuickStatsCard } from "@/components/admin/quick-stat-card"
import { ChartCard } from "@/components/admin/chart-card"
import type { ApexOptions } from "apexcharts"
import Loading from "./loading"

const GameAnalyticsDashboard = () => {
  const {
    playsOverTimeSeries,
    categories,
    gameCategorySeries,
    gameCategoryLabels,
    gamesCount,
    newUsers,
    isLoading,
    error,
  } = useDashboardData()

  const playsOverTimeOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      background: "transparent",
    },
    colors: ["#8b5cf6"],
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories,
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        trim: true,
        style: {
          colors: "#9ca3af",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: any) => value.toString(),
        style: {
          colors: "#9ca3af",
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#374151",
      strokeDashArray: 4,
    },
    theme: {
      mode: "dark",
    },
  }

  const gameCategoryOptions: ApexOptions = {
    chart: {
      type: "donut",
      animations: {
        enabled: true,
        speed: 500,
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      background: "transparent",
    },
    labels: gameCategoryLabels,
    colors: ["#8b5cf6", "#10b981", "#ef4444", "#f59e0b"],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`,
      style: {
        colors: ["#fff"],
      },
    },
    theme: {
      mode: "dark",
    },
  }

  const quickStats = [
    {
      title: "Total Games",
      value: gamesCount.totalCount,
      icon: Gamepad,
      color: "text-blue-400",
      bg: "bg-blue-900",
    },
    {
      title: "Active Games",
      value: gamesCount.activeCount,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-900",
    },
    {
      title: "Unique Players",
      value: newUsers,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-900",
    },
  ]

  if (isLoading) {
    return (
      <Loading />
    )
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-400">Error loading dashboard data. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 md:p-8 bg-background text-foreground">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor your game performance and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat) => (
          <QuickStatsCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playsOverTimeSeries[0]?.data?.length > 0 && (
          <ChartCard
            title="Weekly Game Plays"
            options={playsOverTimeOptions}
            series={playsOverTimeSeries}
            type="line"
            height={350}
          />
        )}

        {gameCategorySeries?.length > 0 && (
          <ChartCard
            title="Game Categories"
            options={gameCategoryOptions}
            series={gameCategorySeries}
            type="donut"
            height={350}
          />
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/add-game">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Add New Game
            </Button>
          </Link>
          <Link href="/admin/manage-games">
            <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
              Manage Games
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GameAnalyticsDashboard
