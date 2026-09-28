export default function Toast({ toast }) {
  if (!toast) return null;

  const styles = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-amber-600',
  };

  return (
    <div className="fixed top-5 right-5 z-[100] animate-[slideIn_0.3s_ease-out]">
      <div className={`${styles[toast.type] || styles.success} text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[200px]`}>
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(120%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>
    </div>
  );
}
