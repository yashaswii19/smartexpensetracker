import {
  TrendingUp, TrendingDown, Wallet, PiggyBank, Target,
} from 'lucide-react';
import { formatCurrency } from '../utils/constants';

export default function SummaryCards({ summary }) {
  const cards = [
    {
      label: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
      ring: 'ring-emerald-100',
    },
    {
      label: 'Total Expenses',
      value: summary.totalExpenses,
      icon: TrendingDown,
      color: 'bg-red-50 text-red-600',
      ring: 'ring-red-100',
    },
    {
      label: 'Current Balance',
      value: summary.balance,
      icon: Wallet,
      color: 'bg-blue-50 text-blue-600',
      ring: 'ring-blue-100',
    },
    {
      label: 'Monthly Budget',
      value: summary.monthlyBudget,
      icon: Target,
      color: 'bg-purple-50 text-purple-600',
      ring: 'ring-purple-100',
    },
    {
      label: 'Remaining Budget',
      value: summary.remainingBudget,
      icon: PiggyBank,
      color: summary.remainingBudget >= 0 ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600',
      ring: summary.remainingBudget >= 0 ? 'ring-teal-100' : 'ring-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`bg-white rounded-2xl border border-slate-200 p-5 ring-4 ${c.ring} hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>
              <c.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium mb-1">{c.label}</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(c.value)}</p>
        </div>
      ))}
    </div>
  );
}
