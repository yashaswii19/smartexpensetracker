import api from './api';

export const expenseService = {
  list: (params) => api.get('/expenses', { params }).then((r) => r.data),
  create: (data) => api.post('/expenses', data).then((r) => r.data),
  update: (id, data) => api.put(`/expenses/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/expenses/${id}`).then((r) => r.data),
};

export const incomeService = {
  list: (params) => api.get('/income', { params }).then((r) => r.data),
  create: (data) => api.post('/income', data).then((r) => r.data),
  update: (id, data) => api.put(`/income/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/income/${id}`).then((r) => r.data),
};

export const budgetService = {
  list: (params) => api.get('/budgets', { params }).then((r) => r.data),
  create: (data) => api.post('/budgets', data).then((r) => r.data),
  update: (id, data) => api.put(`/budgets/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/budgets/${id}`).then((r) => r.data),
};

export const analyticsService = {
  summary: () => api.get('/analytics/summary').then((r) => r.data),
  categories: (params) => api.get('/analytics/categories', { params }).then((r) => r.data),
  monthly: () => api.get('/analytics/monthly').then((r) => r.data),
  trends: () => api.get('/analytics/trends').then((r) => r.data),
  budgetComparison: (params) => api.get('/analytics/budget-comparison', { params }).then((r) => r.data),
  insights: () => api.get('/analytics/insights').then((r) => r.data),
};
