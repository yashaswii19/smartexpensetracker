export const EXPENSE_CATEGORIES = [
  'Food', 'Transportation', 'Shopping', 'Bills', 'Education',
  'Entertainment', 'Healthcare', 'Rent', 'Travel', 'Other',
];

export const PAYMENT_METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'];

export const INCOME_SOURCES = ['Salary', 'Part-time', 'Freelance', 'Scholarship', 'Business', 'Other'];

export const CATEGORY_COLORS = {
  Food: '#10b981',
  Transportation: '#3b82f6',
  Shopping: '#f59e0b',
  Bills: '#ef4444',
  Education: '#8b5cf6',
  Entertainment: '#ec4899',
  Healthcare: '#14b8a6',
  Rent: '#f97316',
  Travel: '#06b6d4',
  Other: '#6b7280',
};

export function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function monthName(m) {
  return ['January','February','March','April','May','June','July','August','September','October','November','December'][m] || '';
}

export function currentMonth() {
  return new Date().getMonth() + 1;
}

export function currentYear() {
  return new Date().getFullYear();
}
