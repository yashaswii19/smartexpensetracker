import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  source: {
    type: String,
    required: true,
    enum: ['Salary', 'Part-time', 'Freelance', 'Scholarship', 'Business', 'Other'],
  },
  date: { type: Date, required: true, index: true },
  description: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now },
});

IncomeSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Income', IncomeSchema);
