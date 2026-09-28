import { Router } from 'express';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getExpenses);
router.post('/', requireAuth, createExpense);
router.put('/:id', requireAuth, updateExpense);
router.delete('/:id', requireAuth, deleteExpense);

export default router;
