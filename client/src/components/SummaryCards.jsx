export default function SummaryCards({
  totalExpense,
  thisMonthExpense,
  mostSpentCategory,
}) {
  const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
      {/* Total Displayed */}
      <div className="card bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-lg rounded-xl p-2">
        <div className="card-body p-3">
          <h2 className="card-title text-emerald-100 text-sm">Total</h2>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(totalExpense)}
          </p>
        </div>
      </div>

      {/* This Month */}
      <div className="card bg-gradient-to-br from-green-700 to-green-900 shadow-lg rounded-xl p-2">
        <div className="card-body p-3">
          <h2 className="card-title text-green-100 text-sm">This Month</h2>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(thisMonthExpense)}
          </p>
        </div>
      </div>

      {/* Top Category */}
      <div className="card bg-gradient-to-br from-teal-700 to-teal-900 shadow-lg rounded-xl p-2">
        <div className="card-body p-3">
          <h2 className="card-title text-teal-100 text-sm">Top Category</h2>
          <p className="text-sm break-words font-semibold text-white">
            {mostSpentCategory}
          </p>
        </div>
      </div>
    </div>
  );
}
