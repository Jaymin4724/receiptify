import { useContext, useState, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

// Hooks
import UseGetExpense from "../hooks/UseGetExpense";
import UseGetReceipt from "../hooks/UseGetReceipt";

// Components
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import FilterBar from "../components/FilterBar";
import ExpensesTable from "../components/ExpensesTable";
import ReceiptModal from "../components/ReceiptModal";

// Utils
import {
  filterExpenses,
  calculateTotalExpense,
  calculateThisMonthExpense,
  findMostSpentCategory,
} from "../utils/calculations";

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);

  // Data fetching hooks
  const { expenses: allExpenses, loading: loadingExpense } = UseGetExpense();
  const { receiptUrl, fetchReceipt, loading: loadingReceipt } = UseGetReceipt();

  // State for filters and modal visibility
  const [filter, setFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);

  // Memoized calculations using utility functions
  const filteredExpenses = useMemo(
    () => filterExpenses(allExpenses, filter, customRange),
    [allExpenses, filter, customRange]
  );

  const summaryStats = useMemo(() => {
    // Note: This month's expense is calculated from all expenses, not just filtered ones.
    const totalFilteredExpense = calculateTotalExpense(filteredExpenses);
    const thisMonthExpense = calculateThisMonthExpense(allExpenses || []);
    const mostSpentCategory = findMostSpentCategory(filteredExpenses);

    return { totalFilteredExpense, thisMonthExpense, mostSpentCategory };
  }, [filteredExpenses, allExpenses]);

  // Event Handlers for clarity
  const handleViewReceipt = (expenseId) => {
    fetchReceipt(expenseId);
    setSelectedReceiptId(expenseId);
  };

  const handleCloseModal = () => {
    setSelectedReceiptId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {currentUser?.name || "User"}
        </h1>

        <SummaryCards
          totalExpense={summaryStats.totalFilteredExpense}
          thisMonthExpense={summaryStats.thisMonthExpense}
          mostSpentCategory={summaryStats.mostSpentCategory}
        />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          customRange={customRange}
          setCustomRange={setCustomRange}
        />

        <ExpensesTable
          expenses={filteredExpenses}
          loading={loadingExpense}
          onViewReceipt={handleViewReceipt}
        />
      </main>

      <ReceiptModal
        isOpen={!!selectedReceiptId}
        loading={loadingReceipt}
        receiptUrl={receiptUrl}
        onClose={handleCloseModal}
      />
    </div>
  );
}
