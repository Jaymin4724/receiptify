import { useContext, useState, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

// Hooks
import UseGetExpense from "../hooks/UseGetExpense";
import UseGetReceipt from "../hooks/UseGetReceipt";
import useManageExpense from "../hooks/useManageExpense";

// Components
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import FilterBar from "../components/FilterBar";
import ExpensesTable from "../components/ExpensesTable";
import ReceiptModal from "../components/ReceiptModal";
import ExpenseModal from "../components/ExpenseModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import ActionBar from "../components/ActionBar";

// Utils
import {
  filterExpenses,
  calculateTotalExpense,
  calculateThisMonthExpense,
  findMostSpentCategory,
} from "../utils/calculations";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);

  // Data fetching and management hooks
  const { expenses: allExpenses, loading: loadingExpense } = UseGetExpense();
  const { receiptUrl, fetchReceipt, loading: loadingReceipt } = UseGetReceipt();
  const {
    loading: managingExpense,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useManageExpense();

  // State for filters and modals
  const [filter, setFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Memoized calculations
  const filteredExpenses = useMemo(
    () => filterExpenses(allExpenses, filter, customRange),
    [allExpenses, filter, customRange]
  );

  const summaryStats = useMemo(() => {
    const totalFilteredExpense = calculateTotalExpense(filteredExpenses);
    const thisMonthExpense = calculateThisMonthExpense(allExpenses || []);
    const mostSpentCategory = findMostSpentCategory(filteredExpenses);
    return { totalFilteredExpense, thisMonthExpense, mostSpentCategory };
  }, [filteredExpenses, allExpenses]);

  // Handlers for Modals and Actions
  const handleViewReceipt = (expense) => {
    if (!expense.receiptImageUrl) {
      toast.error("No receipt available!");
      return;
    }
    fetchReceipt(expense._id);
    setSelectedReceiptId(expense._id);
  };

  const handleOpenAddModal = () => {
    setExpenseToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setExpenseToEdit(expense);
    setIsAddModalOpen(true);
  };

  const handleOpenDeleteModal = (expense) => {
    setExpenseToDelete(expense);
  };

  const handleCloseModals = () => {
    setSelectedReceiptId(null);
    setIsAddModalOpen(false);
    setExpenseToEdit(null);
    setExpenseToDelete(null);
  };

  const handleAddEditSubmit = async (formData) => {
    if (expenseToEdit) {
      await updateExpense(expenseToEdit._id, formData);
    } else {
      await addExpense(formData);
    }
    handleCloseModals();
  };

  const handleConfirmDelete = async () => {
    await deleteExpense(expenseToDelete._id);
    handleCloseModals();
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="flex-1 p-3 md:p-5">
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

        {/* Use the new ActionBar component */}
        <ActionBar onAddClick={handleOpenAddModal} />

        <ExpensesTable
          expenses={filteredExpenses}
          loading={loadingExpense}
          onViewReceipt={handleViewReceipt}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      </main>

      {/* Modals */}
      <ReceiptModal
        isOpen={!!selectedReceiptId}
        loading={loadingReceipt}
        receiptUrl={receiptUrl}
        onClose={handleCloseModals}
      />

      <ExpenseModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        expenseToEdit={expenseToEdit}
        onSubmit={handleAddEditSubmit}
        loading={managingExpense}
      />

      <DeleteConfirmationModal
        isOpen={!!expenseToDelete}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        loading={managingExpense}
      />
    </div>
  );
}
