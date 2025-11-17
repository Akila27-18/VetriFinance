import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category || "Other");
  const [shared, setShared] = useState(expense.shared || false);

  const handleSave = () => {
    onEdit({ ...expense, title, amount: parseFloat(amount), category, shared });
    setIsEditing(false);
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${shared ? "bg-[#FFF7F2]" : "bg-gray-100"}`}>
        <div className="text-[#FF6A00] font-bold">{category?.[0] || "E"}</div>
      </div>

      <div className="flex-1">
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded p-1 text-sm" placeholder="Title"/>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="border rounded p-1 text-sm" placeholder="Amount"/>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded p-1 text-sm" placeholder="Category"/>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} />
              Shared
            </label>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="font-medium">{expense.title}</div>
              <div className="text-sm text-[#6F6F6F]">{expense.date || ""}</div>
            </div>
            <div className="text-sm text-[#6F6F6F]">{expense.category} • {expense.shared ? "Shared" : "Personal"}</div>
          </>
        )}
      </div>

      <div className="font-semibold mr-2">₹{isEditing ? amount : expense.amount}</div>

      <div className="flex flex-col gap-1">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-500 text-xs font-semibold hover:underline">Save</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 text-xs font-semibold hover:underline">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="text-blue-500 text-xs font-semibold hover:underline">Edit</button>
            <button onClick={() => onDelete(expense.id)} className="text-red-500 text-xs font-semibold hover:underline">Delete</button>
          </>
        )}
      </div>
    </motion.div>
  );
}
