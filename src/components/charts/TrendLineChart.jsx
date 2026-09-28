import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { formatCurrency } from '../../utils/constants';

export default function TrendLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" label={{ value: 'Day', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94a3b8' }} />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `₹${v}`} />
        <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(label) => `Day ${label}`} />
        <Area type="monotone" dataKey="total" name="Expenses" stroke="#10b981" strokeWidth={2} fill="url(#trendGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
