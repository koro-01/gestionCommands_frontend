"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useTheme } from "../context/theme-context"
import Sidebar from "./components/layout/Sidebar"
import Header from "./components/layout/Header"
import Dashboard from "./pages/Dashboard"
import Commands from "./pages/Commands"
import Products from "./pages/Products"
import Livreurs from "./pages/Livreurs"
import Preparateurs from "./pages/Preparateurs"
import NewCommandPage from "./pages/NewCommandPage"
import "./App.css"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { theme, toggleTheme } = useTheme()

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        <Sidebar isOpen={sidebarOpen} />
        <div className="main-wrapper">
          <Header
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            darkMode={theme === "dark"}
            onThemeToggle={toggleTheme}
          />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/commands" element={<Commands />} />
              <Route path="/products" element={<Products />} />
              <Route path="/livreurs" element={<Livreurs />} />
              <Route path="/preparateurs" element={<Preparateurs />} />
               <Route path="/commands/new" element={<NewCommandPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App



