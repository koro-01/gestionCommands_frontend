"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function KPICard({ title, value, change, icon: Icon, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = Number.parseInt(value)
    const duration = 1500
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px rgba(0,0,0,0.1)" }}
      className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <motion.h3
            className="text-3xl font-bold mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {displayValue.toLocaleString()}
          </motion.h3>
          <div className={`text-sm mt-2 ${isPositive ? "text-secondary" : "text-red-500"}`}>
            {isPositive ? "↑" : "↓"} {Math.abs(change)}% from last month
          </div>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="text-primary" size={24} />
        </div>
      </div>
    </motion.div>
  )
}
