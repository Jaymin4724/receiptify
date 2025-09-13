export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p className="py-4">
          Are you sure you want to delete this expense? This action cannot be
          undone.
        </p>
        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}
