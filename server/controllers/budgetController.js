import Budget from '../models/Budget.js';

export async function getBudgets(req, res) {
  try {
    const { month, year } = req.query;
    const filter = { userId: req.userId };
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    const budgets = await Budget.find(filter).sort({ category: 1 });
    res.json(budgets);
  } catch (err) {
    console.error('Get budgets error:', err.message);
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
}

export async function createBudget(req, res) {
  try {
    const { category, amount, month, year } = req.body;
    if (!category || !amount || !month || !year) {
      return res.status(400).json({ message: 'Category, amount, month and year are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Budget amount must be greater than zero' });
    }
    const existing = await Budget.findOne({ userId: req.userId, category, month: parseInt(month), year: parseInt(year) });
    if (existing) {
      existing.amount = amount;
      await existing.save();
      return res.json(existing);
    }
    const budget = await Budget.create({
      userId: req.userId,
      category,
      amount,
      month: parseInt(month),
      year: parseInt(year),
    });
    res.status(201).json(budget);
  } catch (err) {
    console.error('Create budget error:', err.message);
    res.status(500).json({ message: 'Failed to create budget' });
  }
}

export async function updateBudget(req, res) {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Budget amount must be greater than zero' });
    }
    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { amount },
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    console.error('Update budget error:', err.message);
    res.status(500).json({ message: 'Failed to update budget' });
  }
}

export async function deleteBudget(req, res) {
  try {
    const { id } = req.params;
    const result = await Budget.findOneAndDelete({ _id: id, userId: req.userId });
    if (!result) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    console.error('Delete budget error:', err.message);
    res.status(500).json({ message: 'Failed to delete budget' });
  }
}
