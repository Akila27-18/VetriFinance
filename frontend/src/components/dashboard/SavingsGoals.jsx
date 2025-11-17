import React from "react";
import { motion } from "framer-motion";

export default function SavingsGoals({ goals = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <div className="font-semibold mb-3">Savings Goals</div>

      <div className="space-y-4">
        {goals.map((g, i) => (
          <div key={i}>
            {/* Label Row */}
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium">{g.title}</div>
              <div className="text-sm text-gray-500">{g.percent}%</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${g.percent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #FF6A00, #FFA86B)", // Landing page theme
                }}
              />
            </div>

            {/* Summary */}
            {g.saved !== undefined && g.target !== undefined && (
              <div className="text-xs text-gray-500 mt-1">
                ₹{g.saved} / ₹{g.target}
              </div>
            )}
          </div>
        ))}

        {/* Empty state */}
        {goals.length === 0 && (
          <div className="text-sm text-gray-500 py-2">
            No savings goals added yet.
          </div>
        )}
      </div>
    </div>
  );
}
