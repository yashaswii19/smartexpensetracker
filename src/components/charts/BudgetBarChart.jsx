import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { formatCurrency } from '../../utils/constants';

export default function BudgetBarChart({ data }) {
  const chartData = data.map((d) => ({
    category: d.category,
    Budget: d.budget,
    Actual: d.actual,
    over: d.actual > d.budget,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="category" tick={{ fontSize: 10 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `₹${v}`} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Actual" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.over ? '#ef4444' : '#10b981'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
