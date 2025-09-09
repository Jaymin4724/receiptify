import { useContext, useState, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

import UseGetExpense from "../hooks/UseGetExpense";
import UseGetReceipt from "../hooks/UseGetReceiept";

import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import FilterBar from "../components/FilterBar";
import ExpensesTable from "../components/ExpensesTable";
import ReceiptModal from "../components/ReceiptModal";

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const { expenses, loading: loadingExpense } = UseGetExpense();
  const { receiptUrl, fetchReceipt, loading: loadingReceipt } = UseGetReceipt();
  const [filter, setFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    const now = new Date();

    if (filter === "month") {
      return expenses.filter(
        (e) => new Date(e.createdAt).getMonth() === now.getMonth()
      );
    }
    if (filter === "year") {
      return expenses.filter(
        (e) => new Date(e.createdAt).getFullYear() === now.getFullYear()
      );
    }
    if (filter === "custom" && customRange.start && customRange.end) {
      const start = new Date(customRange.start);
      const end = new Date(customRange.end);
      return expenses.filter((e) => {
        const date = new Date(e.createdAt);
        return date >= start && date <= end;
      });
    }
    return expenses;
  }, [expenses, filter, customRange]);

  // Summary values
  const totalExpense = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const thisMonthExpense = expenses
    ? expenses
        .filter(
          (e) => new Date(e.createdAt).getMonth() === new Date().getMonth()
        )
        .reduce((acc, e) => acc + e.amount, 0)
    : 0;
  const mostSpentCategory = useMemo(() => {
    if (!filteredExpenses.length) return "N/A";
    const categoryTotals = {};
    filteredExpenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    return Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0];
  }, [filteredExpenses]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 p-6 bg-base-100">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {currentUser?.name || "User"}
        </h1>

        {/* Summary Cards */}
        <SummaryCards
          totalExpense={totalExpense}
          thisMonthExpense={thisMonthExpense}
          mostSpentCategory={mostSpentCategory}
        />

        {/* Filters */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          customRange={customRange}
          setCustomRange={setCustomRange}
        />

        {/* Expenses Table */}
        <ExpensesTable
          expenses={filteredExpenses}
          loading={loadingExpense}
          fetchReceipt={fetchReceipt}
          setSelectedReceipt={setSelectedReceipt}
        />
      </main>

      {/* Modal */}
      <ReceiptModal
        selectedReceipt={selectedReceipt}
        loading={loadingReceipt}
        receiptUrl={receiptUrl}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
