import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Expense from './models/Expense.js';
import Income from './models/Income.js';
import Budget from './models/Budget.js';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectDB();

  const email = 'demo@expense.com';
  let user = await User.findOne({ email });
  if (!user) {
    const hashed = await bcrypt.hash('password123', 10);
    user = await User.create({ name: 'Demo User', email, password: hashed });
  }

  await Expense.deleteMany({ userId: user._id });
  await Income.deleteMany({ userId: user._id });
  await Budget.deleteMany({ userId: user._id });

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const incomes = [
    { amount: 30000, source: 'Salary', date: new Date(y, m, 1), description: 'Monthly salary' },
    { amount: 5000, source: 'Freelance', date: new Date(y, m, 10), description: 'Freelance project' },
    { amount: 30000, source: 'Salary', date: new Date(y, m - 1, 1), description: 'Last month salary' },
    { amount: 5000, source: 'Freelance', date: new Date(y, m - 1, 12), description: 'Freelance project' },
  ];

  const expenses = [
    { amount: 4500, category: 'Food', date: new Date(y, m, 2), paymentMethod: 'UPI', description: 'Groceries' },
    { amount: 2000, category: 'Transportation', date: new Date(y, m, 5), paymentMethod: 'Cash', description: 'Fuel' },
    { amount: 3000, category: 'Shopping', date: new Date(y, m, 8), paymentMethod: 'Credit Card', description: 'Clothes' },
    { amount: 2500, category: 'Education', date: new Date(y, m, 10), paymentMethod: 'Bank Transfer', description: 'Course fee' },
    { amount: 3000, category: 'Bills', date: new Date(y, m, 12), paymentMethod: 'UPI', description: 'Electricity bill' },
    { amount: 1500, category: 'Entertainment', date: new Date(y, m, 15), paymentMethod: 'Debit Card', description: 'Movie' },
    { amount: 800, category: 'Food', date: new Date(y, m, 16), paymentMethod: 'UPI', description: 'Dinner' },
    { amount: 1200, category: 'Transportation', date: new Date(y, m, 18), paymentMethod: 'Cash', description: 'Cab rides' },
    { amount: 2200, category: 'Food', date: new Date(y, m, 20), paymentMethod: 'UPI', description: 'Groceries' },
    { amount: 4000, category: 'Food', date: new Date(y, m - 1, 3), paymentMethod: 'UPI', description: 'Last month groceries' },
    { amount: 1500, category: 'Transportation', date: new Date(y, m - 1, 7), paymentMethod: 'Cash', description: 'Last month fuel' },
    { amount: 2800, category: 'Bills', date: new Date(y, m - 1, 14), paymentMethod: 'UPI', description: 'Last month bills' },
  ];

  const budgets = [
    { category: 'Food', amount: 5000, month: m + 1, year: y },
    { category: 'Transportation', amount: 2500, month: m + 1, year: y },
    { category: 'Shopping', amount: 3000, month: m + 1, year: y },
    { category: 'Bills', amount: 3500, month: m + 1, year: y },
    { category: 'Entertainment', amount: 2000, month: m + 1, year: y },
    { category: 'Education', amount: 3000, month: m + 1, year: y },
  ];

  await Income.insertMany(incomes.map(i => ({ ...i, userId: user._id })));
  await Expense.insertMany(expenses.map(e => ({ ...e, userId: user._id })));
  await Budget.insertMany(budgets.map(b => ({ ...b, userId: user._id })));

  console.log('Seed data inserted successfully');
  console.log('Login with: demo@expense.com / password123');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
