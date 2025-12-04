"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useState } from "react"

export default function EditModal({ isOpen, title, data, fields, onClose, onSave }) {
  const [formData, setFormData] = useState(data || {})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const contentVariants = {
    hidden: { scale: 0.8, y: 20 },
    show: { scale: 1, y: 0 },
    exit: { scale: 0.8, y: 20 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative bg-card border border-border rounded-xl max-w-md w-full mx-4 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{title}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="space-y-4 mb-6">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                      rows={3}
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
