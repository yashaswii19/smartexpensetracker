import { useEffect, useState } from 'react';
import { FileText, Download, Calendar, AlertCircle, BarChart3 } from 'lucide-react';
import { analyticsService, expenseService, incomeService } from '../services/services';
import { EXPENSE_CATEGORIES, formatCurrency, formatDate, monthName, currentMonth, currentYear } from '../utils/constants';

export default function Reports() {
  const [reportType, setReportType] = useState('current'); // current, previous, custom
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function getDateRange() {
    const now = new Date();
    if (reportType === 'current') {
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
        label: `${monthName(now.getMonth())} ${currentYear()}`,
      };
    }
    if (reportType === 'previous') {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return {
        start: prev,
        end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
        label: `${monthName(prev.getMonth())} ${prev.getFullYear()}`,
      };
    }
    return {
      start: new Date(customStart),
      end: new Date(customEnd + 'T23:59:59'),
      label: `${customStart} to ${customEnd}`,
    };
  }

  async function loadReport() {
    if (reportType === 'custom' && (!customStart || !customEnd)) {
      setError('Please select both start and end dates');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const range = getDateRange();
      const [categories, expenses, incomes] = await Promise.all([
        analyticsService.categories({
          startDate: range.start.toISOString(),
          endDate: range.end.toISOString(),
        }),
        expenseService.list({
          startDate: range.start.toISOString().slice(0, 10),
          endDate: range.end.toISOString().slice(0, 10),
        }),
        incomeService.list({
          startDate: range.start.toISOString().slice(0, 10),
          endDate: range.end.toISOString().slice(0, 10),
        }),
      ]);

      const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
      const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
      const savings = totalIncome - totalExpenses;
      const highestExpense = categories[0] || null;
      const avgDaily = expenses.length > 0
        ? totalExpenses / Math.max(1, Math.ceil((range.end - range.start) / (1000 * 60 * 60 * 24)))
        : 0;

      setData({
        label: range.label,
        totalIncome,
        totalExpenses,
        savings,
        savingsRate: totalIncome > 0 ? (savings / totalIncome) * 100 : 0,
        categories,
        highestExpense,
        avgDaily,
        expenses,
        incomes,
        transactionCount: expenses.length + incomes.length,
      });
    } catch (err) {
      setError('Failed to generate report. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType]);

  function downloadCSV() {
    if (!data) return;
    const rows = [
      ['Type', 'Date', 'Category/Source', 'Description', 'Payment Method', 'Amount'],
    ];
    for (const e of data.expenses) {
      rows.push(['Expense', formatDate(e.date), e.category, e.description, e.paymentMethod, String(e.amount)]);
    }
    for (const i of data.incomes) {
      rows.push(['Income', formatDate(i.date), i.source, i.description, '', String(i.amount)]);
    }
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${data.label.replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Generate and download financial reports</p>
      </div>

      {/* Report type selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Report Period</label>
            <div className="flex gap-2">
              {[
                { value: 'current', label: 'Current Month' },
                { value: 'previous', label: 'Previous Month' },
                { value: 'custom', label: 'Custom Range' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setReportType(opt.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    reportType === opt.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {reportType === 'custom' && (
            <div className="flex gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={loadReport}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors h-fit mt-5"
              >
                Generate
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">Generating report...</div>
      ) : data ? (
        <>
          {/* Report header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Report: {data.label}</h3>
                  <p className="text-xs text-slate-500">{data.transactionCount} transactions</p>
                </div>
              </div>
              <button
                onClick={downloadCSV}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatBox label="Total Income" value={formatCurrency(data.totalIncome)} color="text-emerald-600" />
              <StatBox label="Total Expenses" value={formatCurrency(data.totalExpenses)} color="text-red-600" />
              <StatBox
                label="Savings"
                value={formatCurrency(data.savings)}
                color={data.savings >= 0 ? 'text-emerald-600' : 'text-red-600'}
                sub={`${Math.round(data.savingsRate)}% rate`}
              />
              <StatBox label="Avg Daily Spending" value={formatCurrency(data.avgDaily)} color="text-blue-600" />
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Category-wise Expenses</h3>
            {data.categories.length > 0 ? (
              <div className="space-y-3">
                {data.categories.map((c) => {
                  const pct = data.totalExpenses > 0 ? (c.total / data.totalExpenses) * 100 : 0;
                  return (
                    <div key={c.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{c.category} <span className="text-slate-400">({c.count} txns)</span></span>
                        <span className="text-slate-600">{formatCurrency(c.total)} · {Math.round(pct)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {data.highestExpense && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg mt-4">
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                    <span className="text-sm text-amber-800">
                      Highest expense: <strong>{data.highestExpense.category}</strong> at {formatCurrency(data.highestExpense.total)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-8">No expense data for this period.</p>
            )}
          </div>

          {/* Transaction list */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category/Source</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.transactionCount === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-sm">No transactions in this period.</td></tr>
                  ) : (
                    <>
                      {data.incomes.map((i) => (
                        <tr key={`i-${i._id}`} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDate(i.date)}</td>
                          <td className="px-4 py-3"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Income</span></td>
                          <td className="px-4 py-3 text-sm text-slate-600">{i.source}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{i.description || '—'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-emerald-600 text-right whitespace-nowrap">{formatCurrency(i.amount)}</td>
                        </tr>
                      ))}
                      {data.expenses.map((e) => (
                        <tr key={`e-${e._id}`} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDate(e.date)}</td>
                          <td className="px-4 py-3"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">Expense</span></td>
                          <td className="px-4 py-3 text-sm text-slate-600">{e.category}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{e.description || '—'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-red-600 text-right whitespace-nowrap">{formatCurrency(e.amount)}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatBox({ label, value, color, sub }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}
