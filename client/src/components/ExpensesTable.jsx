export default function ExpensesTable({ expenses, loading, onViewReceipt }) {
  return (
    <div className="overflow-y-auto max-h-[500px]">
      <table className="table table-zebra w-full">
        {/* Table Head */}
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {loading && (
            <tr>
              <td colSpan="5" className="text-center">
                <span className="loading loading-bars loading-xl m-4"></span>
              </td>
            </tr>
          )}

          {!loading && expenses.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No expenses found.
              </td>
            </tr>
          )}

          {!loading &&
            expenses.map((exp) => (
              <tr key={exp._id} className="hover:bg-base-200">
                <td>{exp.vendor}</td>
                <td>₹{exp.amount.toLocaleString("en-IN")}</td>
                <td>{exp.category}</td>
                <td>{new Date(exp.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => onViewReceipt(exp._id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
