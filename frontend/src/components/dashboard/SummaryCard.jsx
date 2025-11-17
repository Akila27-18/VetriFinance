import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";

export default function SummaryCard({ data = [], colors = [] }) {
  return (
    <motion.div className="bg-white rounded-2xl p-6 shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Spending Summary</h3>
          <p className="text-xs text-[#6F6F6F]">Top categories this month</p>
        </div>
        <div className="text-xs text-[#6F6F6F]">Updated: Today</div>
      </div>

      <div className="flex gap-6 items-center">
        <div style={{ width: 180, height: 180 }}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data} dataKey="value" outerRadius={70} innerRadius={40} labelLine={false} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `₹${val}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1">
          {data.length === 0 ? (
            <div className="text-sm text-[#6F6F6F]">No data yet</div>
          ) : (
            data.map((s, idx) => (
              <div key={s.name} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: colors[idx % colors.length] }} />
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-[#6F6F6F]">{s.value}% • ₹{s.raw}</div>
                  </div>
                </div>
                <div className="font-semibold">₹{s.raw}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
