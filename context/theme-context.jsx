"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // read sync from localStorage (safe in "use client")
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "dark"
    } catch {
      return "dark"
    }
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    document.documentElement.style.colorScheme = theme
    setMounted(true)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    try {
      localStorage.setItem("theme", newTheme)
    } catch {}
    document.documentElement.style.colorScheme = newTheme
  }

  // don't render children until provider is ready — prevents useTheme() from throwing
  if (!mounted) return null

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
