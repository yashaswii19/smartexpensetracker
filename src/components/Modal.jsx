export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full my-8 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-xl"
          >
            &times;
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }`}</style>
    </div>
  );
}
