"use client"

import { motion } from "framer-motion"
import { LayoutDashboard, Users, Package, Truck, TrendingUp, Box } from "lucide-react"
import { useState } from "react"

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "products", label: "Products", icon: Package },
  { id: "colis", label: "Colis", icon: Box },
  { id: "deliveries", label: "Deliveries", icon: Truck },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
]

export default function Sidebar({ isOpen, currentPage, onPageChange }) {
  const [expandedSubmenu, setExpandedSubmenu] = useState(null)

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -280, opacity: 0 },
  }

  const itemVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -20, opacity: 0 },
  }

  return (
    <motion.aside
      initial={isOpen ? "open" : "closed"}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
      className="fixed md:relative w-64 h-screen bg-card border-r border-border overflow-y-auto z-40"
    >
      <div className="p-6 border-b border-border">
        <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="font-bold text-lg">Admin</span>
        </motion.div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            variants={itemVariants}
            onClick={() => onPageChange(item.id)}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <item.icon size={20} />
            <span className="flex-1 text-left">{item.label}</span>
            {currentPage === item.id && (
              <motion.div
                layoutId="activeIndicator"
                className="w-1 h-6 bg-primary-foreground rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-border">
        <motion.div className="p-4 rounded-lg bg-muted" whileHover={{ scale: 1.02 }}>
          <p className="text-sm font-medium">Pro Plan</p>
          <p className="text-xs text-muted-foreground mt-1">Upgrade available</p>
        </motion.div>
      </div>
    </motion.aside>
  )
}
