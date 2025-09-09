export default function SummaryCards({
  totalExpense,
  thisMonthExpense,
  mostSpentCategory,
}) {
  const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-gray-500">Total Displayed</h2>
          <p className="text-2xl font-semibold">
            {formatCurrency(totalExpense)}
          </p>
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-gray-500">This Month</h2>
          <p className="text-2xl font-semibold">
            {formatCurrency(thisMonthExpense)}
          </p>
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-gray-500">Top Category</h2>
          <p className="text-2xl font-semibold">{mostSpentCategory}</p>
        </div>
      </div>
    </div>
  );
}
