export default function SummaryCards({
  totalExpense,
  thisMonthExpense,
  mostSpentCategory,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Total Expenses</h2>
          <p>₹{totalExpense}</p>
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title">This Month</h2>
          <p>₹{thisMonthExpense}</p>
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Most Spent Category</h2>
          <p>{mostSpentCategory}</p>
        </div>
      </div>
    </div>
  );
}
