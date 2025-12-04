"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, AlertCircle, Info } from "lucide-react"

const toastVariants = {
  hidden: { x: 400, opacity: 0 },
  show: { x: 0, opacity: 1 },
  exit: { x: 400, opacity: 0 },
}

const typeConfig = {
  success: { icon: Check, bg: "bg-green-500/20", border: "border-green-500", text: "text-green-700" },
  error: { icon: AlertCircle, bg: "bg-red-500/20", border: "border-red-500", text: "text-red-700" },
  info: { icon: Info, bg: "bg-blue-500/20", border: "border-blue-500", text: "text-blue-700" },
}

export default function Toast({ type = "info", title, message, isVisible }) {
  const config = typeConfig[type] || typeConfig.info
  const Icon = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={toastVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className={`fixed bottom-6 right-6 p-4 rounded-lg border ${config.bg} ${config.border} z-50 max-w-md`}
        >
          <div className="flex gap-3">
            <Icon className={`${config.text}`} size={20} />
            <div>
              <h4 className="font-semibold">{title}</h4>
              <p className="text-sm opacity-90">{message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
