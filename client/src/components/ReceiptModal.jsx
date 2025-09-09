export default function ReceiptModal({
  selectedReceipt,
  loading,
  receiptUrl,
  onClose,
}) {
  if (!selectedReceipt) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Receipt</h3>

        {receiptUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={receiptUrl}
              alt="Receipt"
              className="w-full max-h-[500px] object-contain rounded-lg border"
            />
            {loading && <span className="loading loading-bars mt-4"></span>}
          </div>
        ) : (
          <p className="text-center text-gray-500">No receipt available</p>
        )}

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
