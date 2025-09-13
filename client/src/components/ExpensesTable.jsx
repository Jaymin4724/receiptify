export default function ExpensesTable({
  expenses,
  loading,
  onViewReceipt,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-y-auto max-h-[500px] rounded-xl shadow-lg">
      <table className="table w-full">
        {/* Table Head */}
        <thead>
          <tr className="text-gray-300">
            <th>Vendor</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {loading && (
            <tr>
              <td colSpan="5" className="text-center py-6">
                <span className="loading loading-bars loading-xl"></span>
              </td>
            </tr>
          )}

          {!loading && expenses.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-400">
                No expenses found.
              </td>
            </tr>
          )}

          {!loading &&
            expenses.map((exp, idx) => (
              <tr
                key={exp._id}
                className={
                  idx % 2 === 0
                    ? "bg-gradient-to-r from-emerald-900 to-green-900 text-emerald-50"
                    : "bg-gradient-to-r from-teal-800 to-emerald-800 text-emerald-50"
                }
              >
                <td>{exp.vendor}</td>
                <td>₹{exp.amount.toLocaleString("en-IN")}</td>
                <td>{exp.category}</td>
                <td>{new Date(exp.createdAt).toLocaleDateString()}</td>
                <td className="flex gap-2 justify-center">
                  <button
                    className="btn btn-sm bg-emerald-600 hover:bg-emerald-500 text-white border-none"
                    onClick={() => onViewReceipt(exp)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm border border-yellow-500 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                    onClick={() => onEdit(exp)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm border border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
                    onClick={() => onDelete(exp)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
