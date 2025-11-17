import React, { useEffect, useState } from "react";

export default function Payments() {
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settledPayments, setSettledPayments] = useState([]);

  /** Load expenses and settled payments from localStorage */
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    const data = savedExpenses ? JSON.parse(savedExpenses) : [];
    setExpenses(data);

    const balances = computeBalances(data);
    const computedPayments = computePaymentsFromBalances(balances);
    setPayments(computedPayments);

    const savedSettled = localStorage.getItem("settledPayments");
    if (savedSettled) setSettledPayments(JSON.parse(savedSettled));
  }, []);

  /** Compute net balances per user from split expenses */
  const computeBalances = (expenses) => {
    const balances = {};
    expenses.forEach((e) => {
      if (!e.shared || !e.participants || !e.paidBy) return;
      const numPeople = e.participants.length;
      const share = Number(e.amount) / numPeople;

      e.participants.forEach((p) => {
        balances[p] = (balances[p] || 0) - share;
      });

      balances[e.paidBy] = (balances[e.paidBy] || 0) + Number(e.amount);
    });
    return balances;
  };

  /** Compute minimal payments from balances */
  const computePaymentsFromBalances = (balances) => {
    const debtors = [];
    const creditors = [];
    Object.entries(balances).forEach(([user, amount]) => {
      if (amount > 0) creditors.push({ user, amount });
      else if (amount < 0) debtors.push({ user, amount: -amount });
    });

    const payments = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const minAmount = Math.min(debtor.amount, creditor.amount);

      payments.push({
        from: debtor.user,
        to: creditor.user,
        amount: minAmount
      });

      debtor.amount -= minAmount;
      creditor.amount -= minAmount;

      if (debtor.amount === 0) i++;
      if (creditor.amount === 0) j++;
    }

    return payments;
  };

  /** Mark a payment as settled */
  const markSettled = (from, to) => {
    const updated = [...settledPayments, { from, to }];
    setSettledPayments(updated);
    localStorage.setItem("settledPayments", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 px-4 md:px-8">
      <h1 className="text-2xl font-bold">Payments</h1>

      {payments.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {payments.map((p, idx) => {
            const isSettled = settledPayments.some(
              (s) => s.from === p.from && s.to === p.to
            );

            return (
              <div key={idx} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.from} → {p.to}</div>
                  <div className="text-sm text-gray-500">
                    {isSettled ? "Settled" : "Pending"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">₹{p.amount.toFixed(0)}</div>
                  {!isSettled && (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                      onClick={() => markSettled(p.from, p.to)}
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No payments required</div>
      )}
    </div>
  );
}
