"use client";

import { motion } from "framer-motion";

export default function AnimatedIcon({ children }) {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.2, rotate: 5 }}
      style={{ display: "inline-flex" }}
    >
      {children}
    </motion.div>
  );
}
