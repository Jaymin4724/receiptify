export default function FilterBar({
  filter,
  setFilter,
  customRange,
  setCustomRange,
}) {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      <button
        className={`btn ${filter === "month" ? "btn-accent" : ""}`}
        onClick={() => setFilter("month")}
      >
        This Month
      </button>
      <button
        className={`btn ${filter === "year" ? "btn-accent" : ""}`}
        onClick={() => setFilter("year")}
      >
        This Year
      </button>
      <button
        className={`btn ${filter === "custom" ? "btn-accent" : ""}`}
        onClick={() => setFilter("custom")}
      >
        Custom
      </button>

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
