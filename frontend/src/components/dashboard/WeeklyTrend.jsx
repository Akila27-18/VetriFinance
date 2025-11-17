import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function WeeklyTrend({ data = [], color = "#FF6A00" }) {
  return (
    <div className="mt-6 bg-[#FFF7F2] p-4 rounded-xl">
      <h4 className="font-semibold mb-2">Weekly spending</h4>
      <div style={{ width: "100%", height: 160 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(v) => `₹${v}`} />
            <Tooltip formatter={(val) => `₹${val}`} />
            <Line type="monotone" dataKey="spend" stroke={color} strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
