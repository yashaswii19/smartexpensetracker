import { useEffect, useState } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Award, Calendar, PiggyBank, Lightbulb,
  AlertCircle, ArrowUp, ArrowDown,
} from 'lucide-react';
import { analyticsService } from '../services/services';
import { formatCurrency, monthName, currentMonth, currentYear } from '../utils/constants';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import TrendLineChart from '../components/charts/TrendLineChart';

export default function FinancialAnalysis() {
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [trends, setTrends] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [c, m, t, i] = await Promise.all([
          analyticsService.categories(),
          analyticsService.monthly(),
          analyticsService.trends(),
          analyticsService.insights(),
        ]);
        setCategories(c);
        setMonthly(m);
        setTrends(t);
        setInsights(i);
      } catch (err) {
        setError('Failed to load analysis data. Is the server running?');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded" />
        <div className="h-32 bg-slate-100 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 bg-slate-100 rounded-2xl" />
          <div className="lg:col-span-2 h-72 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
        <p className="text-slate-700 font-medium">{error}</p>
      </div>
    );
  }

  const highestCategory = categories[0] || null;
  const totalCategorySpend = categories.reduce((s, c) => s + c.total, 0);
  const avgDaily = insights?.avgDaily || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Financial Analysis</h1>
        <p className="text-slate-500 text-sm mt-1">Deep dive into your spending patterns</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Award}
          label="Highest Category"
          value={highestCategory ? highestCategory.category : '—'}
          sub={highestCategory ? formatCurrency(highestCategory.total) : 'No data'}
          color="bg-amber-50 text-amber-600"
        />
        <MetricCard
          icon={Calendar}
          label="Avg Daily Spending"
          value={formatCurrency(avgDaily)}
          sub={`${monthName(new Date().getMonth())} average`}
          color="bg-blue-50 text-blue-600"
        />
        <MetricCard
          icon={PiggyBank}
          label="Total Savings"
          value={formatCurrency(insights?.savings || 0)}
          sub={`${Math.round(insights?.savingsRate || 0)}% savings rate`}
          color="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          icon={TrendingUp}
          label="This Month Spending"
          value={formatCurrency(insights?.thisMonthTotal || 0)}
          sub={insights?.spendingUp ? 'Up from last month' : 'Down from last month'}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* Smart Financial Insights */}
      <SmartInsights insights={insights} categories={categories} />

      {/* Category breakdown table + pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Category-wise Spending</h3>
          {categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((c) => {
                const pct = totalCategorySpend > 0 ? (c.total / totalCategorySpend) * 100 : 0;
                return (
                  <div key={c.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{c.category}</span>
                      <span className="text-slate-600">{formatCurrency(c.total)} · {Math.round(pct)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No expense data for this month.</div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Category Distribution</h3>
          {categories.length > 0 ? (
            <CategoryPieChart data={categories} />
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data to display.</div>
          )}
        </div>
      </div>

      {/* Monthly comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Monthly Income vs Expenses</h3>
        {monthly.length > 0 ? (
          <MonthlyBarChart data={monthly} />
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No monthly data available.</div>
        )}
      </div>

      {/* Daily trends */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Daily Spending Trend — {monthName(new Date().getMonth())}</h3>
        {trends.length > 0 ? (
          <TrendLineChart data={trends} />
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No daily data for this month.</div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}

function SmartInsights({ insights, categories }) {
  if (!insights) return null;

  const tips = [];

  if (insights.highestCategory) {
    tips.push({
      icon: Award,
      color: 'text-amber-600 bg-amber-50',
      text: `Your highest spending category this month is ${insights.highestCategory.category} at ${formatCurrency(insights.highestCategory.amount)}.`,
    });
  }

  if (insights.increasedCategories && insights.increasedCategories.length > 0) {
    const top = insights.increasedCategories[0];
    tips.push({
      icon: ArrowUp,
      color: 'text-red-600 bg-red-50',
      text: `Your ${top.category} expenses increased from ${formatCurrency(top.lastMonth)} to ${formatCurrency(top.thisMonth)} compared to last month.`,
    });
  }

  if (insights.monthlyBudget > 0) {
    if (insights.budgetUtilization >= 100) {
      tips.push({
        icon: AlertCircle,
        color: 'text-red-600 bg-red-50',
        text: `You have exceeded your monthly budget. You've used ${Math.round(insights.budgetUtilization)}% of your ${formatCurrency(insights.monthlyBudget)} budget.`,
      });
    } else if (insights.budgetUtilization >= 85) {
      tips.push({
        icon: AlertCircle,
        color: 'text-amber-600 bg-amber-50',
        text: `You have used ${Math.round(insights.budgetUtilization)}% of your monthly budget. Consider slowing down your spending.`,
      });
    } else {
      tips.push({
        icon: PiggyBank,
        color: 'text-emerald-600 bg-emerald-50',
        text: `You are within your monthly budget. You've used only ${Math.round(insights.budgetUtilization)}% of your ${formatCurrency(insights.monthlyBudget)} budget. Keep it up!`,
      });
    }
  }

  tips.push({
    icon: TrendingUp,
    color: insights.savingsRate >= 20 ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50',
    text: `Your current savings rate is ${Math.round(insights.savingsRate)}%. ${insights.savingsRate >= 20 ? 'Great job saving money!' : 'Try to save at least 20% of your income.'}`,
  });

  if (insights.spendingUp) {
    tips.push({
      icon: ArrowDown,
      color: 'text-red-600 bg-red-50',
      text: `Your spending this month (${formatCurrency(insights.thisMonthTotal)}) is higher than last month (${formatCurrency(insights.lastMonthTotal)}).`,
    });
  } else if (insights.lastMonthTotal > 0) {
    tips.push({
      icon: ArrowDown,
      color: 'text-emerald-600 bg-emerald-50',
      text: `Your spending this month (${formatCurrency(insights.thisMonthTotal)}) is lower than last month (${formatCurrency(insights.lastMonthTotal)}). Well done!`,
    });
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-2xl border border-emerald-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Smart Financial Insights</h3>
          <p className="text-xs text-slate-500">Auto-generated from your transaction data</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-slate-100">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tip.color}`}>
              <tip.icon className="w-4 h-4" />
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
