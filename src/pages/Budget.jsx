import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, PiggyBank, AlertTriangle, AlertCircle } from 'lucide-react';
import { budgetService, analyticsService } from '../services/services';
import { EXPENSE_CATEGORIES, formatCurrency, monthName, currentMonth, currentYear } from '../utils/constants';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    category: 'Food',
    amount: '',
    month: currentMonth(),
    year: currentYear(),
  });
  const { toast, show } = useToast();

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [b, c] = await Promise.all([
        budgetService.list({ month: currentMonth(), year: currentYear() }),
        analyticsService.budgetComparison({ month: currentMonth(), year: currentYear() }),
      ]);
      setBudgets(b);
      setComparison(c);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load budget data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAdd() {
    setForm({ category: 'Food', amount: '', month: currentMonth(), year: currentYear() });
    setEditId(null);
    setModalOpen(true);
  }

  function openEdit(b) {
    setForm({ category: b.category, amount: String(b.amount), month: b.month, year: b.year });
    setEditId(b._id);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      show('Please enter a valid budget amount', 'error');
      return;
    }
    try {
      const payload = {
        category: form.category,
        amount: Number(form.amount),
        month: Number(form.month),
        year: Number(form.year),
      };
      if (editId) {
        await budgetService.update(editId, payload);
        show('Budget updated successfully');
      } else {
        await budgetService.create(payload);
        show('Budget saved successfully');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      show(err.response?.data?.message || 'Failed to save budget', 'error');
    }
  }

  async function handleDelete() {
    try {
      await budgetService.remove(deleteId);
      show('Budget deleted successfully');
      setDeleteId(null);
      load();
    } catch (err) {
      show('Failed to delete budget', 'error');
    }
  }

  const totalBudget = comparison.reduce((s, c) => s + c.budget, 0);
  const totalActual = comparison.reduce((s, c) => s + c.actual, 0);
  const totalRemaining = totalBudget - totalActual;
  const overallPct = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Toast toast={toast} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Budget</h1>
          <p className="text-slate-500 text-sm mt-1">{monthName(currentMonth() - 1)} {currentYear()}</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Set Budget
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Overall progress */}
      {comparison.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-slate-600">Overall Budget Usage</p>
              <p className="text-2xl font-bold text-slate-800">{Math.round(overallPct)}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Spent / Budget</p>
              <p className="text-sm font-semibold text-slate-700">{formatCurrency(totalActual)} / {formatCurrency(totalBudget)}</p>
            </div>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${overallPct >= 100 ? 'bg-red-500' : overallPct >= 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(overallPct, 100)}%` }}
            />
          </div>
          <p className={`text-sm mt-2 font-medium ${totalRemaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {totalRemaining < 0
              ? `Over budget by ${formatCurrency(Math.abs(totalRemaining))}`
              : `${formatCurrency(totalRemaining)} remaining`}
          </p>
        </div>
      )}

      {/* Category budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="md:col-span-2 text-center py-10 text-slate-400 text-sm">Loading budgets...</div>
        ) : comparison.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200">
            <PiggyBank className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No budgets set for this month yet.</p>
            <p className="text-slate-400 text-xs mt-1">Click "Set Budget" to create category-wise budgets.</p>
          </div>
        ) : (
          comparison.map((c) => {
            const pct = c.percentage;
            const over = c.actual > c.budget;
            return (
              <div key={c.category} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">{c.category}</span>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(budgets.find((b) => b.category === c.category))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(budgets.find((b) => b.category === c.category)?._id)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${over ? 'text-red-600' : 'text-slate-700'}`}>{Math.round(pct)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct >= 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-slate-500">Budget: </span>
                    <span className="font-semibold text-slate-700">{formatCurrency(c.budget)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Spent: </span>
                    <span className="font-semibold text-slate-700">{formatCurrency(c.actual)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Left: </span>
                    <span className={`font-semibold ${c.remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{formatCurrency(c.remaining)}</span>
                  </div>
                </div>
                {over && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-700 font-medium">Exceeded budget by {formatCurrency(Math.abs(c.remaining))}</span>
                  </div>
                )}
                {!over && pct >= 85 && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-amber-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-amber-700 font-medium">Approaching budget limit</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal open={modalOpen} title={editId ? 'Edit Budget' : 'Set Budget'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              disabled={!!editId}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Budget Amount (₹)</label>
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Month</label>
              <select
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i + 1}>{monthName(i)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
              {editId ? 'Update' : 'Save'} Budget
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Budget"
        message="Are you sure you want to delete this budget?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
