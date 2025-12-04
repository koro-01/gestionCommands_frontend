"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, User, MapPin, Loader } from "lucide-react"

const initialColis = [
  { id: 1, code: "COL001", weight: "2.5kg", destination: "New York", status: "pending", assignedTo: null },
  { id: 2, code: "COL002", weight: "1.2kg", destination: "Los Angeles", status: "assigned", assignedTo: "John" },
  { id: 3, code: "COL003", weight: "3.1kg", destination: "Chicago", status: "pending", assignedTo: null },
  { id: 4, code: "COL004", weight: "0.8kg", destination: "Houston", status: "in-transit", assignedTo: "Jane" },
]

const deliveryPersonnel = ["John", "Jane", "Bob", "Alice"]

export default function Colis() {
  const [colis, setColis] = useState(initialColis)
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOver, setDragOver] = useState(null)

  const handleDragStart = (e, coliId) => {
    setDraggedItem(coliId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(e.currentTarget.id)
  }

  const handleDrop = (e, personnel) => {
    e.preventDefault()
    if (draggedItem) {
      setColis(colis.map((c) => (c.id === draggedItem ? { ...c, assignedTo: personnel, status: "assigned" } : c)))
      setDraggedItem(null)
      setDragOver(null)
    }
  }

  const statusColors = {
    pending: "bg-yellow-500/20 border-yellow-500 text-yellow-700",
    assigned: "bg-blue-500/20 border-blue-500 text-blue-700",
    "in-transit": "bg-purple-500/20 border-purple-500 text-purple-700",
    delivered: "bg-green-500/20 border-green-500 text-green-700",
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Colis Management & Assignment</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unassigned Colis */}
        <div className="lg:col-span-2">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Package size={20} className="text-primary" />
            Unassigned Colis
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {colis
                .filter((c) => c.status === "pending")
                .map((item) => (
                  <motion.div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="bg-card border border-border rounded-lg p-4 cursor-move hover:border-primary transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{item.code}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Package size={14} /> {item.weight}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> {item.destination}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Personnel Slots */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User size={20} className="text-primary" />
            Delivery Personnel
          </h3>
          <div className="space-y-3">
            {deliveryPersonnel.map((person) => {
              const assignedCount = colis.filter((c) => c.assignedTo === person).length
              return (
                <motion.div
                  key={person}
                  id={person}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, person)}
                  whileHover={{ scale: 1.02 }}
                  className={`border-2 border-dashed rounded-lg p-4 transition-all ${
                    dragOver === person ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <p className="font-semibold mb-2">{person}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{assignedCount} assigned</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="text-primary"
                    >
                      <Loader size={16} />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Current Assignments</h3>
        <div className="space-y-3">
          {colis
            .filter((c) => c.assignedTo)
            .map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.code}</p>
                  <p className="text-sm text-muted-foreground">{item.destination}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{item.assignedTo}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.status}</p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}
