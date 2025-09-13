export default function FilterBar({
  filter,
  setFilter,
  customRange,
  setCustomRange,
}) {
  const handleFilterClick = (newFilter) => {
    // Reset custom range when switching away from custom
    if (filter === "custom" && newFilter !== "custom") {
      setCustomRange({ start: "", end: "" });
    }
    setFilter(newFilter);
  };

  return (
    <div className="flex gap-3 mb-4 flex-wrap items-center">
      {/* Filter Buttons */}
      <button
        className={`btn ${filter === "month" ? "btn-accent" : "btn-ghost"}`}
        onClick={() => handleFilterClick("month")}
      >
        This Month
      </button>
      <button
        className={`btn ${filter === "year" ? "btn-accent" : "btn-ghost"}`}
        onClick={() => handleFilterClick("year")}
      >
        This Year
      </button>
      <button
        className={`btn ${filter === "custom" ? "btn-accent" : "btn-ghost"}`}
        onClick={() => handleFilterClick("custom")}
      >
        Custom
      </button>

      {/* Custom Date Range Inputs */}
      {filter === "custom" && (
        <div className="flex gap-2 items-center">
          <input
            type="date"
            className="input input-bordered"
            value={customRange.start}
            onChange={(e) =>
              setCustomRange({ ...customRange, start: e.target.value })
            }
          />
          <span>to</span>
          <input
            type="date"
            className="input input-bordered"
            value={customRange.end}
            onChange={(e) =>
              setCustomRange({ ...customRange, end: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );
}
