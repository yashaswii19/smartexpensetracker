import { useEffect, useState } from 'react';
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank, Calendar,
  ArrowUpRight, ArrowDownRight, AlertTriangle,
} from 'lucide-react';
import { analyticsService } from '../services/services';
import { formatCurrency, monthName, currentMonth, currentYear } from '../utils/constants';
import SummaryCards from '../components/SummaryCards';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import TrendLineChart from '../components/charts/TrendLineChart';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [s, c, m, t] = await Promise.all([
          analyticsService.summary(),
          analyticsService.categories(),
          analyticsService.monthly(),
          analyticsService.trends(),
        ]);
        setSummary(s);
        setCategories(c);
        setMonthly(m);
        setTrends(t);
      } catch (err) {
        setError('Failed to load dashboard data. Is the server running?');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
        <p className="text-slate-700 font-medium">{error}</p>
        <p className="text-slate-500 text-sm mt-1">Make sure the backend server is running on port 5000.</p>
      </div>
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          {monthName(new Date().getMonth())} {currentYear()} overview
        </p>
      </div>

      <SummaryCards summary={summary} />

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Category Breakdown</h3>
          {categories.length > 0 ? (
            <CategoryPieChart data={categories} />
          ) : (
            <EmptyChart text="No expense data for this month yet." />
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Monthly Income vs Expenses</h3>
          {monthly.length > 0 ? (
            <MonthlyBarChart data={monthly} />
          ) : (
            <EmptyChart text="No monthly data available yet." />
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Daily Spending — {monthName(new Date().getMonth())}</h3>
        {trends.length > 0 ? (
          <TrendLineChart data={trends} />
        ) : (
          <EmptyChart text="No daily spending data for this month yet." />
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickStat
          icon={Calendar}
          label="Today's Expenses"
          value={formatCurrency(summary.todayExpenses)}
          color="bg-blue-50 text-blue-600"
        />
        <QuickStat
          icon={Calendar}
          label="This Week's Expenses"
          value={formatCurrency(summary.weekExpenses)}
          color="bg-purple-50 text-purple-600"
        />
        <QuickStat
          icon={Calendar}
          label="This Month's Expenses"
          value={formatCurrency(summary.monthExpenses)}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {summary.monthlyBudget > 0 && summary.budgetUtilization >= 85 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            You have used {Math.round(summary.budgetUtilization)}% of your monthly budget.
            {summary.budgetUtilization >= 100 ? ' You have exceeded your budget!' : ' Consider slowing down your spending.'}
          </p>
        </div>
      )}
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function EmptyChart({ text }) {
  return (
    <div className="h-64 flex items-center justify-center text-slate-400 text-sm">{text}</div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 w-40 bg-slate-200 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-72 bg-slate-100 rounded-2xl" />
        <div className="lg:col-span-2 h-72 bg-slate-100 rounded-2xl" />
      </div>
      <div className="h-72 bg-slate-100 rounded-2xl" />
    </div>
  );
}
