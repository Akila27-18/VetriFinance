import React from "react";
import { motion } from "framer-motion";

export default function QuickActions({ img, title, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-white rounded-xl shadow p-4 flex items-center gap-3 justify-center flex-col text-center"
      onClick={onClick}
    >
      {img ? <img src={img} alt={title} className="w-14 h-14 object-contain" /> : <div className="w-14 h-14 bg-gray-100 rounded" />}
      <div className="font-medium text-sm mt-1">{title}</div>
    </motion.button>
  );
}
