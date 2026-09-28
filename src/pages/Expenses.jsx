import { useEffect, useState, useMemo } from 'react';
import {
  Plus, Search, Pencil, Trash2, Receipt, ArrowUpDown, AlertCircle,
} from 'lucide-react';
import { expenseService } from '../services/services';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, formatCurrency, formatDate } from '../utils/constants';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const emptyForm = {
  amount: '',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: 'UPI',
  description: '',
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const { toast, show } = useToast();

  async function loadExpenses() {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;
      const data = await expenseService.list(params);
      setExpenses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, startDate, endDate, sortBy, sortOrder]);

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setModalOpen(true);
  }

  function openEdit(expense) {
    setForm({
      amount: String(expense.amount),
      category: expense.category,
      date: new Date(expense.date).toISOString().slice(0, 10),
      paymentMethod: expense.paymentMethod,
      description: expense.description || '',
    });
    setEditId(expense._id);
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
        category: form.category,
        date: form.date,
        paymentMethod: form.paymentMethod,
        description: form.description,
      };
      if (editId) {
        await expenseService.update(editId, payload);
        show('Expense updated successfully');
      } else {
        await expenseService.create(payload);
        show('Expense added successfully');
      }
      setModalOpen(false);
      loadExpenses();
    } catch (err) {
      show(err.response?.data?.message || 'Failed to save expense', 'error');
    }
  }

  async function handleDelete() {
    try {
      await expenseService.remove(deleteId);
      show('Expense deleted successfully');
      setDeleteId(null);
      loadExpenses();
    } catch (err) {
      show('Failed to delete expense', 'error');
    }
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }

  const totalAmount = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Toast toast={toast} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expenses</h1>
          <p className="text-slate-500 text-sm mt-1">{expenses.length} transactions · {formatCurrency(totalAmount)} total</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search description or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <Th label="Date" sortable onClick={() => toggleSort('date')} active={sortBy === 'date'} order={sortOrder} />
                <Th label="Category" />
                <Th label="Description" />
                <Th label="Payment" />
                <Th label="Amount" sortable onClick={() => toggleSort('amount')} active={sortBy === 'amount'} order={sortOrder} align="right" />
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">Loading expenses...</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No expenses found. Click "Add Expense" to create one.</p>
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDate(e.date)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">{e.category}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{e.description || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{e.paymentMethod}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-600 text-right whitespace-nowrap">{formatCurrency(e.amount)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(e)}
                        className="inline-flex items-center justify-center w-8 h-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(e._id)}
                        className="inline-flex items-center justify-center w-8 h-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                      >
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

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} title={editId ? 'Edit Expense' : 'Add Expense'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Amount (₹)">
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
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Payment Method">
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </FormField>
          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Optional note..."
            />
          </FormField>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
              {editId ? 'Update' : 'Add'} Expense
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function Th({ label, sortable, onClick, active, order, align = 'left' }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold text-slate-600 uppercase ${align === 'right' ? 'text-right' : 'text-left'} ${sortable ? 'cursor-pointer select-none hover:text-slate-900' : ''}`}
      onClick={onClick}
    >
      <span className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        {label}
        {sortable && <ArrowUpDown className={`w-3 h-3 ${active ? 'text-emerald-600' : 'text-slate-300'}`} />}
      </span>
    </th>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
