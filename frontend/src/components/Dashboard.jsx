import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

/* Dashboard components */
import DashboardHeader from "./dashboard/DashboardHeader";
import QuickActions from "./dashboard/QuickActions";
import WeeklyTrend from "./dashboard/WeeklyTrend";
import ExpenseCard from "./ExpenseCard";
import AddExpenseModal from "./AddExpenseModal";
import ChatPanel from "./ChatPanel";
import NewsFeed from "./NewsFeed";
import SplitBillModal from "./SplitBillModal";


/* Assets */
import heroImg from "../assets/dashboard/hero.jpg";
import addExpenseImg from "../assets/dashboard/add-expense.jpg";
import splitBillImg from "../assets/dashboard/split-bill.jpg";
import insightsImg from "../assets/dashboard/insights.jpg";
import paymentsImg from "../assets/dashboard/payments.jpg";
import featurePhoto1 from "../assets/dashboard/feature-photo-1.jpg";
import featurePhoto2 from "../assets/dashboard/feature-photo-2.jpg";

const COLORS = ["#FF6A00", "#FFD6B8", "#F0F0F0", "#FFA86B"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [trend, setTrend] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showSplit, setShowSplit] = useState(false);
  const dashboardUsers = ["Alice", "Bob", "Charlie"];


  /** Initialize expenses from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      const data = JSON.parse(saved);
      setExpenses(data);
      updateSummaryAndTrend(data);
    }
  }, []);

  /** Update category summary and weekly trend */
  const updateSummaryAndTrend = (data) => {
    // Category summary
    const categoryMap = {};
    data.forEach((e) => {
      const cat = e.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0);
    });
    const total = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1;
    setSummary(
      Object.entries(categoryMap).map(([name, raw]) => ({
        name,
        raw,
        value: Math.round((raw / total) * 100),
      }))
    );

    // Weekly trend
    updateWeeklyTrend(data);
  };

  /** Compute actual weekly spending */
  const updateWeeklyTrend = (data) => {
    const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const today = new Date();

    const weekly = weekDays.map((d) => ({ day: d, spend: 0 }));

    data.forEach((e) => {
      if (!e.date) return;
      const expenseDate = new Date(e.date);
      const diff = today.getTime() - expenseDate.getTime();
      const diffDays = Math.floor(diff / (1000*60*60*24));
      if (diffDays < 7 && diffDays >= 0) {
        const dayName = weekDays[expenseDate.getDay()];
        const idx = weekly.findIndex((w) => w.day === dayName);
        if (idx !== -1) weekly[idx].spend += Number(e.amount || 0);
      }
    });

    setTrend(weekly);
  };

  /** Save expenses and update summary/trend */
  const saveExpenses = (data) => {
    setExpenses(data);
    localStorage.setItem("expenses", JSON.stringify(data));
    updateSummaryAndTrend(data);
  };

  /** Handlers */
  const handleAddExpense = (expense) => {
    const newExpense = {
      id: Date.now(),
      ...expense,
      date: expense.date || new Date().toISOString().split("T")[0],
    };
    saveExpenses([newExpense, ...expenses]);
    setShowAdd(false);
  };

  const handleEditExpense = (updatedExpense) => {
    const updated = expenses.map((e) => (e.id === updatedExpense.id ? updatedExpense : e));
    saveExpenses(updated);
  };

  const handleDeleteExpense = (id) => {
    const filtered = expenses.filter((e) => e.id !== id);
    saveExpenses(filtered);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(expenses);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    saveExpenses(reordered);
  };

  const quickActions = [
    { img: addExpenseImg, title: "Add Expense", onClick: () => setShowAdd(true) },
    { img: insightsImg, title: "Insights", onClick: () => navigate("/dashboard/insights") },
    { img: paymentsImg, title: "Payments", onClick: () => navigate("/dashboard/payments") },
    { img: splitBillImg, title: "Split Bill", onClick: () => setShowSplit(true) },

  ];

  return (
    <div className="space-y-6 px-4 md:px-8">
      <DashboardHeader
        title="Welcome back"
        subtitle="Overview of your shared and personal finances."
        image={heroImg}
        action={{ label: "View Insights", onClick: () => navigate("/dashboard/insights") }}
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((a, i) => (
          <QuickActions key={i} {...a} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={summary} dataKey="raw" nameKey="name" outerRadius={80} label>
                  {summary.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Trend */}
          <WeeklyTrend data={trend} color={COLORS[0]} />

          {/* Drag-and-Drop Expenses */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="expenses">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {expenses.map((expense, index) => (
                    <Draggable key={expense.id} draggableId={expense.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ExpenseCard
                            expense={expense}
                            onEdit={handleEditExpense}
                            onDelete={handleDeleteExpense}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <ChatPanel />
          <NewsFeed />
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Featured</div>
              <div className="text-xs text-gray-500">Useful links</div>
            </div>
            <div className="grid gap-3">
              <a href="/resources/budget-templates" className="rounded-lg overflow-hidden">
                <img src={featurePhoto1} alt="feature1" className="w-full h-24 object-cover rounded-lg" />
              </a>
              <a href="/resources/saving-tips" className="rounded-lg overflow-hidden">
                <img src={featurePhoto2} alt="feature2" className="w-full h-24 object-cover rounded-lg" />
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAddExpense}
      />

     
            <SplitBillModal
        open={showSplit}
        users={dashboardUsers}  // ✔️ use dashboardUsers
        onClose={() => setShowSplit(false)}
        onAdd={(newExpenses) => saveExpenses([...newExpenses, ...expenses])}
      />


    </div>
  );
}
