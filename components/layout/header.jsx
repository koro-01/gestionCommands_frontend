"use client"

import { motion } from "framer-motion"
import { Menu, Moon, Sun, Bell, Settings } from "lucide-react"
import { useTheme } from "@/context/theme-context"

const pageNames = {
  dashboard: "Dashboard",
  users: "Users Management",
  products: "Products Management",
  colis: "Colis Management",
  deliveries: "Deliveries Management",
  analytics: "Analytics & Reports",
}

export default function Header({ onMenuClick, currentPage }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onMenuClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
          >
            <Menu size={20} />
          </motion.button>
          <h1 className="text-2xl font-bold">{pageNames[currentPage]}</h1>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-blue-500" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-muted rounded-lg relative"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <Settings size={20} />
          </motion.button>

          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold cursor-pointer">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
