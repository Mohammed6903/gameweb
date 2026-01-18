import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { memo } from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse bg-gray-700 rounded-lg" />,
})

export const ChartCard = memo(
  ({
    title,
    options,
    series,
    height,
    type,
  }: {
    title: string
    options: ApexOptions
    series: any
    height: number
    type: "line" | "donut"
  }) => {
    // Merge the provided options with theme options
    const themeOptions: ApexOptions = {
      ...options,
      theme: {
        mode: "dark",
      },
      chart: {
        ...options.chart,
        background: "transparent",
      },
      grid: {
        ...options.grid,
        borderColor: "var(--color-border)",
      },
      legend: {
        ...options.legend,
        labels: {
          ...options.legend?.labels,
          colors: "var(--color-foreground)",
        },
      },
    }

    return (
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Chart options={themeOptions} series={series} type={type} height={300} />
        </CardContent>
      </Card>
    )
  },
)

ChartCard.displayName = "ChartCard"
