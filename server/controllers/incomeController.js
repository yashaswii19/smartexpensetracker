import Income from '../models/Income.js';

export async function getIncomes(req, res) {
  try {
    const { source, startDate, endDate, search, sortBy, sortOrder } = req.query;
    const filter = { userId: req.userId };

    if (source && source !== 'All') filter.source = source;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = {};
    sort[sortBy || 'date'] = sortOrder === 'asc' ? 1 : -1;

    const incomes = await Income.find(filter).sort(sort);
    res.json(incomes);
  } catch (err) {
    console.error('Get incomes error:', err.message);
    res.status(500).json({ message: 'Failed to fetch income records' });
  }
}

export async function createIncome(req, res) {
  try {
    const { amount, source, date, description } = req.body;
    if (!amount || !source || !date) {
      return res.status(400).json({ message: 'Amount, source and date are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    const income = await Income.create({
      userId: req.userId,
      amount,
      source,
      date: new Date(date),
      description: description || '',
    });
    res.status(201).json(income);
  } catch (err) {
    console.error('Create income error:', err.message);
    res.status(500).json({ message: 'Failed to create income record' });
  }
}

export async function updateIncome(req, res) {
  try {
    const { id } = req.params;
    const { amount, source, date, description } = req.body;

    const income = await Income.findOne({ _id: id, userId: req.userId });
    if (!income) return res.status(404).json({ message: 'Income record not found' });

    if (amount !== undefined) {
      if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than zero' });
      income.amount = amount;
    }
    if (source) income.source = source;
    if (date) income.date = new Date(date);
    if (description !== undefined) income.description = description;

    await income.save();
    res.json(income);
  } catch (err) {
    console.error('Update income error:', err.message);
    res.status(500).json({ message: 'Failed to update income record' });
  }
}

export async function deleteIncome(req, res) {
  try {
    const { id } = req.params;
    const result = await Income.findOneAndDelete({ _id: id, userId: req.userId });
    if (!result) return res.status(404).json({ message: 'Income record not found' });
    res.json({ message: 'Income record deleted successfully' });
  } catch (err) {
    console.error('Delete income error:', err.message);
    res.status(500).json({ message: 'Failed to delete income record' });
  }
}
