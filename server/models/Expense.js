import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transportation', 'Shopping', 'Bills', 'Education', 'Entertainment', 'Healthcare', 'Rent', 'Travel', 'Other'],
  },
  date: { type: Date, required: true, index: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'],
  },
  description: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now },
});

ExpenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Expense', ExpenseSchema);
