import React from "react";
import ExpenseCard from "../ExpenseCard";

export default function ExpenseList({ expenses = [], onEdit, onDelete }) {
  if (!expenses.length) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow text-sm text-[#6F6F6F]">
        No expenses yet
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {expenses.map((e) => (
        <ExpenseCard key={e.id} expense={e} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
