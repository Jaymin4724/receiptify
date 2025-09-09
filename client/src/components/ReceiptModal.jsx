export default function ReceiptModal({ isOpen, loading, receiptUrl, onClose }) {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Receipt</h3>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : receiptUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={receiptUrl}
              alt="Receipt"
              className="w-full max-h-[500px] object-contain rounded-lg border"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-center text-gray-500">No receipt available.</p>
          </div>
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
