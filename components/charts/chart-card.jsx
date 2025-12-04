"use client"

import { motion } from "framer-motion"

export default function ChartCard({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ boxShadow: "0 20px 25px rgba(0,0,0,0.1)" }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </motion.div>
  )
}
