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
    // Merge the provided options with dark theme options
    const darkThemeOptions: ApexOptions = {
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
        borderColor: "#374151", // border-gray-700
      },
      legend: {
        ...options.legend,
        labels: {
          ...options.legend?.labels,
          colors: "#e5e7eb", // text-gray-200
        },
      },
    }

    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-100">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart options={darkThemeOptions} series={series} type={type} height={300} />
        </CardContent>
      </Card>
    )
  },
)

ChartCard.displayName = "ChartCard"