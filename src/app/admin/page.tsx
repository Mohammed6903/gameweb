"use client"
import { Gamepad, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { QuickStatsCard } from "@/components/admin/quick-stat-card"
import { ChartCard } from "@/components/admin/chart-card"
import type { ApexOptions } from "apexcharts"

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
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
    <div className="space-y-6 p-6 bg-gray-800">
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickStats.map((stat) => (
          <QuickStatsCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {playsOverTimeSeries[0]?.data?.length > 0 && (
          <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 shadow-sm">
            <ChartCard
              title="Weekly Game Plays"
              options={playsOverTimeOptions}
              series={playsOverTimeSeries}
              type="line"
              height={350}
            />
          </div>
        )}

        {gameCategorySeries?.length > 0 && (
          <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 shadow-sm">
            <ChartCard
              title="Game Categories"
              options={gameCategoryOptions}
              series={gameCategorySeries}
              type="donut"
              height={350}
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">Quick Actions</h2>
        <div className="flex space-x-4">
          <Link href="/admin/add-game">
            <Button
              variant="default"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Add New Game
            </Button>
          </Link>
          <Link href="/admin/manage-games">
            <Button variant="outline" className="text-gray-200 border-gray-600 hover:bg-gray-700">
              Manage Games
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GameAnalyticsDashboard