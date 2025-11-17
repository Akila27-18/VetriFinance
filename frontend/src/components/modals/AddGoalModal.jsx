// src/components/modals/AddGoalModal.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AddGoalModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "",
    target: "",
    saved: "",
    deadline: "",
  });

  useEffect(() => {
    if (open) {
      setForm({ title: "", target: "", saved: "", deadline: "" });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
      >
        <h3 className="font-semibold mb-4 text-lg">Add Savings Goal</h3>

        <div className="flex flex-col gap-3">
          <input
            value={form.title}
            onChange={e => setForm(s => ({ ...s, title: e.target.value }))}
            placeholder="Goal Title"
            className="border rounded px-3 py-2"
          />

          <input
            value={form.target}
            type="number"
            onChange={e => setForm(s => ({ ...s, target: Number(e.target.value) }))}
            placeholder="Target Amount (₹)"
            className="border rounded px-3 py-2"
          />

          <input
            value={form.saved}
            type="number"
            onChange={e => setForm(s => ({ ...s, saved: Number(e.target.value) }))}
            placeholder="Amount Saved (₹)"
            className="border rounded px-3 py-2"
          />

          <input
            value={form.deadline}
            onChange={e => setForm(s => ({ ...s, deadline: e.target.value }))}
            placeholder="Deadline (YYYY-MM-DD)"
            className="border rounded px-3 py-2"
            type="date"
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onAdd(form);
              onClose();
            }}
            className="px-4 py-2 bg-[#FF6A00] text-white rounded"
          >
            Save Goal
          </button>
        </div>

      </motion.div>

    </div>
  );
}
