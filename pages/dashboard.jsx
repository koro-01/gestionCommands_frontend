"use client"

import { useState, useEffect } from "react"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import KPICard from "@/components/cards/kpi-card"
import ChartCard from "@/components/charts/chart-card"
import { Users, Package, TrendingUp, Activity } from "lucide-react"

const chartData = [
  { name: "Jan", users: 2400, revenue: 4000, orders: 240 },
  { name: "Feb", users: 2810, revenue: 3800, orders: 221 },
  { name: "Mar", users: 3200, revenue: 2000, orders: 229 },
  { name: "Apr", users: 2290, revenue: 9800, orders: 200 },
  { name: "May", users: 2000, revenue: 9800, orders: 221 },
  { name: "Jun", users: 2181, revenue: 7300, orders: 250 },
]

const pieData = [
  { name: "Direct", value: 300 },
  { name: "Referral", value: 300 },
  { name: "Organic", value: 200 },
  { name: "Social", value: 278 },
]

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"]

const activityData = [
  { id: 1, user: "John Doe", action: "Created new product", time: "2 minutes ago" },
  { id: 2, user: "Jane Smith", action: "Completed delivery", time: "5 minutes ago" },
  { id: 3, user: "Admin", action: "Updated user permissions", time: "10 minutes ago" },
  { id: 4, user: "Bob Johnson", action: "Processed refund", time: "15 minutes ago" },
]

export default function Dashboard() {
  const [liveKPI, setLiveKPI] = useState({ users: 12500, orders: 8420, revenue: 156800, conversions: 4230 })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveKPI((prev) => ({
        users: prev.users + Math.floor(Math.random() * 10),
        orders: prev.orders + Math.floor(Math.random() * 5),
        revenue: prev.revenue + Math.floor(Math.random() * 1000),
        conversions: prev.conversions + Math.floor(Math.random() * 3),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users" value={liveKPI.users} change={12.5} icon={Users} delay={0} />
        <KPICard title="Total Orders" value={liveKPI.orders} change={8.2} icon={TrendingUp} delay={0.1} />
        <KPICard title="Revenue" value={liveKPI.revenue} change={15.3} icon={Package} delay={0.2} />
        <KPICard title="Conversions" value={liveKPI.conversions} change={5.1} icon={Activity} delay={0.3} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend" delay={0.4}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders by Month" delay={0.5}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Bar dataKey="orders" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Traffic Sources" delay={0.6}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Users Growth" delay={0.7} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Activity Feed */}
      <ChartCard title="Live Activity Feed" delay={0.8}>
        <div className="space-y-3">
          {activityData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Activity size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.user}</p>
                <p className="text-sm text-muted-foreground">{item.action}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
