import React from "react";
import { motion } from "framer-motion";

export default function DashboardHeader({ title, subtitle, image, action }) {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden p-6"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      style={{ background: "linear-gradient(90deg, #FFE6D5, #FFF7F2)" }}
    >
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#2E2E2E]">{title}</h2>
          <p className="text-sm text-[#6F6F6F] mt-1">{subtitle}</p>

          <div className="flex gap-3 mt-4">
            {action && (
              <button
                onClick={action.onClick}
                className="px-4 py-2 bg-[#FF6A00] text-white rounded-lg shadow hover:bg-[#E85D00] transition"
              >
                {action.label}
              </button>
            )}
          </div>
        </div>

        <div className="w-48 flex-shrink-0">
          {image ? (
            <img src={image} alt="hero" className="w-full h-32 object-cover rounded-lg shadow-lg" />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-lg" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
