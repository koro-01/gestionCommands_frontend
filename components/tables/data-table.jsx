"use client"

import { motion } from "framer-motion"
import { Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  searchable = true,
  searchValue = "",
  onSearchChange = () => {},
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  }

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    })
  }

  const sortedData = [...data]
  if (sortConfig.key) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      return sortConfig.direction === "asc" ? 1 : -1
    })
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary"
        />
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-6 py-3 text-left text-sm font-semibold ${col.sortable ? "cursor-pointer hover:bg-border" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable &&
                      sortConfig.key === col.key &&
                      (sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <motion.tbody variants={containerVariants} initial="hidden" animate="show">
              {sortedData.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  variants={rowVariants}
                  whileHover={{ backgroundColor: "var(--color-muted)" }}
                  className="border-b border-border hover:bg-muted transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm">
                      {row[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(row)}
                        className="p-2 hover:bg-border rounded-lg transition-colors"
                      >
                        <Edit2 size={16} className="text-blue-500" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(row.id)}
                        className="p-2 hover:bg-border rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </tbody>
        </table>
      </div>
    </div>
  )
}
