"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "./sidebar"
import Header from "./header"
import Dashboard from "@/pages/dashboard"
import Users from "@/pages/users"
import Products from "@/pages/products"
import Colis from "@/pages/colis"
import Deliveries from "@/pages/deliveries"
import Analytics from "@/pages/analytics"

export default function MainLayout() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const pages = {
    dashboard: <Dashboard />,
    users: <Users />,
    products: <Products />,
    colis: <Colis />,
    deliveries: <Deliveries />,
    analytics: <Analytics />,
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isOpen={sidebarOpen} currentPage={currentPage} onPageChange={setCurrentPage} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} currentPage={currentPage} />

        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8"
            >
              {pages[currentPage]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
