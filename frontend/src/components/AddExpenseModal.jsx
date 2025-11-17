import React, { useState, useEffect } from "react";

const defaultCategories = ["Food", "Housing", "Utilities", "Transport", "Entertainment", "Other"];

export default function AddExpenseModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(defaultCategories[0]);
  const [date, setDate] = useState("");
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset fields when modal opens
      setTitle("");
      setAmount("");
      setCategory(defaultCategories[0]);
      setDate(new Date().toISOString().split("T")[0]); // default to today
      setShared(false);
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || isNaN(amount)) {
      alert("Please enter a valid title and amount");
      return;
    }

    onAdd({
      title,
      amount: Number(amount),
      category,
      date,
      shared,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {defaultCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={shared}
              onChange={(e) => setShared(e.target.checked)}
              id="shared-checkbox"
            />
            <label htmlFor="shared-checkbox" className="text-sm">Shared Expense</label>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
