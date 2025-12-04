"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import ChartCard from "@/components/charts/chart-card"
import { Download, Calendar } from "lucide-react"

const analyticsData = [
  { month: "Jan", revenue: 45000, users: 2400, orders: 240, roi: 12 },
  { month: "Feb", revenue: 52000, users: 2810, orders: 221, roi: 14 },
  { month: "Mar", revenue: 48000, users: 3200, orders: 229, roi: 13 },
  { month: "Apr", revenue: 61000, users: 2290, orders: 200, roi: 16 },
  { month: "May", revenue: 55000, users: 2000, orders: 221, roi: 15 },
  { month: "Jun", revenue: 67000, users: 2181, orders: 250, roi: 18 },
]

export default function Analytics() {
  const [dateRange, setDateRange] = useState("last-6-months")

  const handleExport = () => {
    alert("Exporting report...")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Analytics & Reports</h2>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg appearance-none pr-8 focus:outline-none focus:border-primary"
            >
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="year">This Year</option>
            </select>
            <Calendar
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
              size={16}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <Download size={16} />
            Export
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend" delay={0.1}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="User Growth vs Orders" delay={0.2}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Comparison" delay={0.3}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="orders" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="ROI Performance" delay={0.4}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Line type="monotone" dataKey="roi" stroke="#F59E0B" strokeWidth={3} dot={{ fill: "#F59E0B", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$328,000", change: "+12.5%" },
          { label: "Avg Order Value", value: "$142.50", change: "+3.2%" },
          { label: "Conversion Rate", value: "3.8%", change: "+0.4%" },
          { label: "Customer ROI", value: "18%", change: "+2.1%" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-secondary mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
