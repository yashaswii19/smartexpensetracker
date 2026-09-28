import { useEffect, useState, useMemo } from 'react';
import {
  Plus, Search, Pencil, Trash2, TrendingUp, AlertCircle,
} from 'lucide-react';
import { incomeService } from '../services/services';
import { INCOME_SOURCES, formatCurrency, formatDate } from '../utils/constants';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const emptyForm = {
  amount: '',
  source: 'Salary',
  date: new Date().toISOString().slice(0, 10),
  description: '',
};

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const { toast, show } = useToast();

  async function loadIncomes() {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (sourceFilter !== 'All') params.source = sourceFilter;
      const data = await incomeService.list(params);
      setIncomes(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load income records');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncomes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sourceFilter]);

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setModalOpen(true);
  }

  function openEdit(income) {
    setForm({
      amount: String(income.amount),
      source: income.source,
      date: new Date(income.date).toISOString().slice(0, 10),
      description: income.description || '',
    });
    setEditId(income._id);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      show('Please enter a valid amount', 'error');
      return;
    }
    try {
      const payload = {
        amount: Number(form.amount),
        source: form.source,
        date: form.date,
        description: form.description,
      };
      if (editId) {
        await incomeService.update(editId, payload);
        show('Income updated successfully');
      } else {
        await incomeService.create(payload);
        show('Income added successfully');
      }
      setModalOpen(false);
      loadIncomes();
    } catch (err) {
      show(err.response?.data?.message || 'Failed to save income', 'error');
    }
  }

  async function handleDelete() {
    try {
      await incomeService.remove(deleteId);
      show('Income deleted successfully');
      setDeleteId(null);
      loadIncomes();
    } catch (err) {
      show('Failed to delete income', 'error');
    }
  }

  const totalAmount = useMemo(() => incomes.reduce((s, i) => s + i.amount, 0), [incomes]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Toast toast={toast} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Income</h1>
          <p className="text-slate-500 text-sm mt-1">{incomes.length} records · {formatCurrency(totalAmount)} total</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Income
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search description or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Sources</option>
            {INCOME_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Description</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-sm">Loading income records...</td></tr>
              ) : incomes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No income records found. Click "Add Income" to create one.</p>
                  </td>
                </tr>
              ) : (
                incomes.map((i) => (
                  <tr key={i._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDate(i.date)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">{i.source}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{i.description || '—'}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-emerald-600 text-right whitespace-nowrap">{formatCurrency(i.amount)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(i)} className="inline-flex items-center justify-center w-8 h-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(i._id)} className="inline-flex items-center justify-center w-8 h-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editId ? 'Edit Income' : 'Add Income'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Source</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {INCOME_SOURCES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Optional note..."
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
              {editId ? 'Update' : 'Add'} Income
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Income"
        message="Are you sure you want to delete this income record?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
