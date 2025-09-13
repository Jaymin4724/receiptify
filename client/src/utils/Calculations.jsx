/**
 * Filters an array of expenses based on a filter type and custom date range.
 * @param {Array} expenses - The array of expense objects.
 * @param {string} filter - The filter type ('all', 'month', 'year', 'custom').
 * @param {Object} customRange - An object with 'start' and 'end' date strings.
 * @returns {Array} The filtered array of expenses.
 */
export const filterExpenses = (expenses, filter, customRange) => {
  if (!expenses) return [];
  const now = new Date();

  switch (filter) {
    case "month":
      return expenses.filter((e) => {
        const expenseDate = new Date(e.date);
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      });

    case "year":
      return expenses.filter(
        (e) => new Date(e.date).getFullYear() === now.getFullYear()
      );

    case "custom":
      if (customRange.start && customRange.end) {
        const start = new Date(customRange.start);
        const end = new Date(customRange.end);
        end.setHours(23, 59, 59, 999); // Include the entire end day

        return expenses.filter((e) => {
          const expenseDate = new Date(e.date);
          return expenseDate >= start && expenseDate <= end;
        });
      }
      return expenses; // Return all if range is incomplete

    case "all":
    default:
      return expenses;
  }
};

/**
 * Calculates the total amount from an array of expenses.
 * @param {Array} expenses - The array of expense objects.
 * @returns {number} The total expense amount.
 */
export const calculateTotalExpense = (expenses) => {
  if (!expenses) return 0;
  return expenses.reduce((acc, e) => acc + e.amount, 0);
};

/**
 * Calculates the total expense for the current month from an array of expenses.
 * @param {Array} expenses - The array of expense objects.
 * @returns {number} The total expense amount for the current month.
 */
export const calculateThisMonthExpense = (expenses) => {
  if (!expenses) return 0;
  const now = new Date();
  const thisMonthExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    return (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  });
  return calculateTotalExpense(thisMonthExpenses);
};

/**
 * Finds the category with the highest total spending.
 * @param {Array} expenses - The array of expense objects.
 * @returns {string} The name of the most spent category or 'N/A'.
 */
export const findMostSpentCategory = (expenses) => {
  if (!expenses || expenses.length === 0) return "N/A";

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const mostSpent = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  )[0];

  return mostSpent ? mostSpent[0] : "N/A";
};
