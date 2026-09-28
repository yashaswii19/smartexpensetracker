import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import Budget from '../models/Budget.js';

function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function startOfWeek(d) { const x = startOfDay(d); const day = x.getDay(); x.setDate(x.getDate() - day); return x; }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth()+1, 0, 23,59,59,999); }
function monthLabel(m) { return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m]; }

export async function getSummary(req, res) {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const userId = req.userId;

    const totalIncomeAgg = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalExpenseAgg = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const todayExpenseAgg = await Expense.aggregate([
      { $match: { userId, date: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const weekExpenseAgg = await Expense.aggregate([
      { $match: { userId, date: { $gte: weekStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const monthExpenseAgg = await Expense.aggregate([
      { $match: { userId, date: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const monthIncomeAgg = await Income.aggregate([
      { $match: { userId, date: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const budgets = await Budget.find({ userId, month: now.getMonth()+1, year: now.getFullYear() });
    const monthlyBudget = budgets.reduce((s, b) => s + b.amount, 0);

    const totalIncome = totalIncomeAgg[0]?.total || 0;
    const totalExpenses = totalExpenseAgg[0]?.total || 0;
    const balance = totalIncome - totalExpenses;
    const monthExpenses = monthExpenseAgg[0]?.total || 0;
    const monthIncome = monthIncomeAgg[0]?.total || 0;
    const remainingBudget = monthlyBudget - monthExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      monthlyBudget,
      remainingBudget,
      monthExpenses,
      monthIncome,
      todayExpenses: todayExpenseAgg[0]?.total || 0,
      weekExpenses: weekExpenseAgg[0]?.total || 0,
      budgetUtilization: monthlyBudget > 0 ? (monthExpenses / monthlyBudget) * 100 : 0,
    });
  } catch (err) {
    console.error('Summary error:', err.message);
    res.status(500).json({ message: 'Failed to compute summary' });
  }
}

export async function getCategories(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const now = new Date();
    const start = startDate ? new Date(startDate) : startOfMonth(now);
    const end = endDate ? new Date(endDate) : endOfMonth(now);

    const data = await Expense.aggregate([
      { $match: { userId: req.userId, date: { $gte: start, $lte: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    res.json(data.map(d => ({ category: d._id, total: d.total, count: d.count })));
  } catch (err) {
    console.error('Categories error:', err.message);
    res.status(500).json({ message: 'Failed to compute category breakdown' });
  }
}

export async function getMonthly(req, res) {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const expenses = await Expense.aggregate([
      { $match: { userId: req.userId, date: { $gte: start } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          expenses: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const income = await Income.aggregate([
      { $match: { userId: req.userId, date: { $gte: start } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          income: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const map = new Map();
    for (const e of expenses) {
      const key = `${e._id.year}-${e._id.month}`;
      map.set(key, { label: `${monthLabel(e._id.month-1)} ${String(e._id.year).slice(2)}`, expenses: e.expenses, income: 0 });
    }
    for (const i of income) {
      const key = `${i._id.year}-${i._id.month}`;
      if (map.has(key)) map.get(key).income = i.income;
      else map.set(key, { label: `${monthLabel(i._id.month-1)} ${String(i._id.year).slice(2)}`, expenses: 0, income: i.income });
    }

    res.json(Array.from(map.values()));
  } catch (err) {
    console.error('Monthly error:', err.message);
    res.status(500).json({ message: 'Failed to compute monthly comparison' });
  }
}

export async function getTrends(req, res) {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endOfMonth(now);

    const daily = await Expense.aggregate([
      { $match: { userId: req.userId, date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { day: { $dayOfMonth: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.day': 1 } },
    ]);

    res.json(daily.map(d => ({ day: d._id.day, total: d.total })));
  } catch (err) {
    console.error('Trends error:', err.message);
    res.status(500).json({ message: 'Failed to compute daily trends' });
  }
}

export async function getBudgetComparison(req, res) {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = month ? parseInt(month) : now.getMonth() + 1;
    const y = year ? parseInt(year) : now.getFullYear();

    const budgets = await Budget.find({ userId: req.userId, month: m, year: y });
    if (budgets.length === 0) return res.json([]);

    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59, 999);

    const spending = await Expense.aggregate([
      { $match: { userId: req.userId, date: { $gte: start, $lte: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const spendMap = new Map(spending.map(s => [s._id, s.total]));

    const result = budgets.map(b => ({
      category: b.category,
      budget: b.amount,
      actual: spendMap.get(b.category) || 0,
      remaining: b.amount - (spendMap.get(b.category) || 0),
      percentage: b.amount > 0 ? ((spendMap.get(b.category) || 0) / b.amount) * 100 : 0,
    }));

    res.json(result);
  } catch (err) {
    console.error('Budget comparison error:', err.message);
    res.status(500).json({ message: 'Failed to compute budget comparison' });
  }
}

export async function getInsights(req, res) {
  try {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const userId = req.userId;

    const thisMonthCategories = await Expense.aggregate([
      { $match: { userId, date: { $gte: thisMonthStart, $lte: thisMonthEnd } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);

    const lastMonthCategories = await Expense.aggregate([
      { $match: { userId, date: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const thisMonthTotal = thisMonthCategories.reduce((s, c) => s + c.total, 0);
    const lastMonthTotal = lastMonthCategories.reduce((s, c) => s + c.total, 0);

    const thisMonthIncome = await Income.aggregate([
      { $match: { userId, date: { $gte: thisMonthStart, $lte: thisMonthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const monthIncome = thisMonthIncome[0]?.total || 0;

    const budgets = await Budget.find({ userId, month: now.getMonth()+1, year: now.getFullYear() });
    const monthlyBudget = budgets.reduce((s, b) => s + b.amount, 0);
    const budgetUtilization = monthlyBudget > 0 ? (thisMonthTotal / monthlyBudget) * 100 : 0;

    const allExpenses = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const allIncome = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalIncomeAll = allIncome[0]?.total || 0;
    const totalExpenseAll = allExpenses[0]?.total || 0;
    const savings = totalIncomeAll - totalExpenseAll;
    const savingsRate = totalIncomeAll > 0 ? (savings / totalIncomeAll) * 100 : 0;

    const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    const avgDaily = thisMonthTotal / daysInMonth;

    const lastMonthMap = new Map(lastMonthCategories.map(c => [c._id, c.total]));
    const increasedCategories = thisMonthCategories
      .filter(c => (lastMonthMap.get(c._id) || 0) < c.total && c.total > 0)
      .map(c => ({ category: c._id, thisMonth: c.total, lastMonth: lastMonthMap.get(c._id) || 0 }));

    res.json({
      highestCategory: thisMonthCategories[0] ? { category: thisMonthCategories[0]._id, amount: thisMonthCategories[0].total } : null,
      thisMonthTotal,
      lastMonthTotal,
      monthIncome,
      monthlyBudget,
      budgetUtilization,
      savings,
      savingsRate,
      avgDaily,
      increasedCategories,
      spendingUp: thisMonthTotal > lastMonthTotal && lastMonthTotal > 0,
      withinBudget: monthlyBudget > 0 && thisMonthTotal <= monthlyBudget,
    });
  } catch (err) {
    console.error('Insights error:', err.message);
    res.status(500).json({ message: 'Failed to generate insights' });
  }
}
