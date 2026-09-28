import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transportation', 'Shopping', 'Bills', 'Education', 'Entertainment', 'Healthcare', 'Rent', 'Travel', 'Other'],
  },
  amount: { type: Number, required: true, min: 0 },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true, min: 2000 },
  createdAt: { type: Date, default: Date.now },
});

BudgetSchema.index({ userId: 1, year: 1, month: 1, category: 1 }, { unique: true });

export default mongoose.model('Budget', BudgetSchema);
