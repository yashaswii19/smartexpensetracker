import Expense from '../models/Expense.js';

export async function getExpenses(req, res) {
  try {
    const { category, paymentMethod, startDate, endDate, search, sortBy, sortOrder, limit } = req.query;
    const filter = { userId: req.userId };

    if (category && category !== 'All') filter.category = category;
    if (paymentMethod && paymentMethod !== 'All') filter.paymentMethod = paymentMethod;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = {};
    sort[sortBy || 'date'] = sortOrder === 'asc' ? 1 : -1;

    const expenses = await Expense.find(filter).sort(sort).limit(parseInt(limit) || 1000);
    res.json(expenses);
  } catch (err) {
    console.error('Get expenses error:', err.message);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
}

export async function createExpense(req, res) {
  try {
    const { amount, category, date, paymentMethod, description } = req.body;
    if (!amount || !category || !date || !paymentMethod) {
      return res.status(400).json({ message: 'Amount, category, date and payment method are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    const expense = await Expense.create({
      userId: req.userId,
      amount,
      category,
      date: new Date(date),
      paymentMethod,
      description: description || '',
    });
    res.status(201).json(expense);
  } catch (err) {
    console.error('Create expense error:', err.message);
    res.status(500).json({ message: 'Failed to create expense' });
  }
}

export async function updateExpense(req, res) {
  try {
    const { id } = req.params;
    const { amount, category, date, paymentMethod, description } = req.body;

    const expense = await Expense.findOne({ _id: id, userId: req.userId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (amount !== undefined) {
      if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than zero' });
      expense.amount = amount;
    }
    if (category) expense.category = category;
    if (date) expense.date = new Date(date);
    if (paymentMethod) expense.paymentMethod = paymentMethod;
    if (description !== undefined) expense.description = description;

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error('Update expense error:', err.message);
    res.status(500).json({ message: 'Failed to update expense' });
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    const result = await Expense.findOneAndDelete({ _id: id, userId: req.userId });
    if (!result) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Delete expense error:', err.message);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
}
