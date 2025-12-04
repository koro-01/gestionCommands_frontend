"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/context/theme-context"
import MainLayout from "@/components/layout/main-layout"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  )
}
