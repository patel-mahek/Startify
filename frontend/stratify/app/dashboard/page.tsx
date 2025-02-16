"use client"

import './style.css'
import * as React from "react"
import { Bar, Line, Pie } from "react-chartjs-2"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  ChartBarIcon,
  ChartPieIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid"
import { format, addDays } from "date-fns"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)

const chartColor = "rgb(0, 75, 98)"

export default function Dashboard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="min-h-screen bg-white">
      {/* <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Stratify</h1>
          <NavigationMenu>
            <NavigationMenuList className="flex justify-center space-x-4">
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Calendar
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Pitch
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Chatbot
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                  Presentation
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header> */}

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Overview Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <OverviewCard
                title="Total Revenue"
                value="₹12,345"
                change={5.2}
                icon={<CurrencyRupeeIcon className="h-6 w-6" />}
              />
              <OverviewCard
                title="Net Profit"
                value="₹5,678"
                change={-2.1}
                icon={<ChartBarIcon className="h-6 w-6" />}
              />
              <OverviewCard
                title="Items Sold"
                value="1,234"
                change={8.7}
                icon={<ShoppingBagIcon className="h-6 w-6" />}
              />
              <OverviewCard title="Growth" value="15%" change={3.5} icon={<ChartPieIcon className="h-6 w-6" />} />
            </div>

            <Card className="h-[400px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Report</CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </CardHeader>
              <CardContent className="h-[340px]">
                <RevenueChart />
              </CardContent>
            </Card>
          </div>

          {/* Detailed Charts Section */}
          <div className="space-y-4">
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[340px]">
                <CostBreakdownChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">XYZ</div>
                <p className="text-muted-foreground">Our best-selling item this month</p>
              </CardContent>
            </Card>

            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle>Sales Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-[340px]">
                <SalesComparisonChart />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function OverviewCard({
  title,
  value,
  change,
  icon,
}: {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}) {
  return (
    <Card className="h-[180px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn("text-xs", change > 0 ? "text-green-500" : "text-red-500")}>
          <span className="inline-block mr-1">
            {change > 0 ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
          </span>
          {Math.abs(change)}%
        </p>
      </CardContent>
    </Card>
  )
}

function RevenueChart() {
  const startDate = new Date(2023, 5, 1) // June 1, 2023
  const labels = Array.from({ length: 10 }, (_, i) => format(addDays(startDate, i * 3), "MMM dd"))

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: labels.map(() => Math.floor(Math.random() * 10000) + 5000),
        backgroundColor: chartColor,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Daily Revenue",
      },
    },
  }

  return <Bar data={data} options={options} />
}

function CostBreakdownChart() {
  const data = {
    labels: ["Factory Cost", "Salaries", "Profit", "Other"],
    datasets: [
      {
        data: [30, 25, 35, 10],
        backgroundColor: ["rgb(14, 136, 173)", "rgb(58, 184, 222)", "rgb(54, 132, 156)", "rgb(0, 75, 98)"],
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Cost Breakdown",
      },
    },
  }

  return <Pie data={data} options={options} />
}

function SalesComparisonChart() {
  const startDate = new Date(2023, 5, 1) // June 1, 2023
  const labels = Array.from({ length: 10 }, (_, i) => format(addDays(startDate, i * 3), "MMM dd"))

  const data = {
    labels,
    datasets: [
      {
        label: "Our Sales",
        data: labels.map(() => Math.floor(Math.random() * 5000) + 5000),
        borderColor: chartColor,
        backgroundColor: "rgba(0, 75, 98, 0.5)",
      },
      {
        label: "Competitor Sales",
        data: labels.map(() => Math.floor(Math.random() * 5000) + 3000),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Sales Comparison",
      },
    },
  }

  return <Line data={data} options={options} />
}

