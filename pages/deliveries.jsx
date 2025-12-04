"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Package, Clock, CheckCircle } from "lucide-react"

const internalDeliveries = [
  { id: 1, user: "John Doe", items: 3, status: "in-progress", eta: "2:30 PM", progress: 65 },
  { id: 2, user: "Jane Smith", items: 5, status: "pending", eta: "3:45 PM", progress: 0 },
  { id: 3, user: "Bob Johnson", items: 2, status: "completed", eta: "1:15 PM", progress: 100 },
]

const externalDeliveries = [
  { id: 1, code: "EXT001", destination: "New York", carrier: "FedEx", status: "in-transit", eta: "2 days" },
  { id: 2, code: "EXT002", destination: "Los Angeles", carrier: "UPS", status: "delivered", eta: "Completed" },
  { id: 3, code: "EXT003", destination: "Chicago", carrier: "DHL", status: "pending", eta: "1 day" },
]

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState(internalDeliveries)

  const statusColors = {
    pending: "bg-yellow-500/20 border-yellow-500 text-yellow-700",
    "in-progress": "bg-blue-500/20 border-blue-500 text-blue-700",
    "in-transit": "bg-purple-500/20 border-purple-500 text-purple-700",
    completed: "bg-green-500/20 border-green-500 text-green-700",
    delivered: "bg-green-500/20 border-green-500 text-green-700",
  }

  const statusIcons = {
    pending: Clock,
    "in-progress": Package,
    "in-transit": MapPin,
    completed: CheckCircle,
    delivered: CheckCircle,
  }

  return (
    <div className="space-y-8">
      {/* Internal Deliveries */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Internal Deliveries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveries.map((delivery, idx) => {
            const StatusIcon = statusIcons[delivery.status]
            return (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{delivery.user}</h3>
                    <p className="text-sm text-muted-foreground">{delivery.items} items</p>
                  </div>
                  <StatusIcon className={`text-${delivery.status === "completed" ? "green" : "blue"}-500`} />
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Progress</span>
                    <span className="text-xs text-muted-foreground">{delivery.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${delivery.progress}%` }}
                      transition={{ duration: 1.5, delay: idx * 0.1 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[delivery.status]}`}
                  >
                    {delivery.status}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">{delivery.eta}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* External Deliveries */}
      <div>
        <h2 className="text-2xl font-bold mb-6">External Deliveries</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Destination</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Carrier</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">ETA</th>
              </tr>
            </thead>
            <tbody>
              {externalDeliveries.map((delivery) => (
                <motion.tr
                  key={delivery.id}
                  whileHover={{ backgroundColor: "var(--color-muted)" }}
                  className="border-b border-border hover:bg-muted transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium">{delivery.code}</td>
                  <td className="px-6 py-4 text-sm">{delivery.destination}</td>
                  <td className="px-6 py-4 text-sm">{delivery.carrier}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[delivery.status]}`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{delivery.eta}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
