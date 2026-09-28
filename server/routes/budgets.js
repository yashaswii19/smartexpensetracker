import { Router } from 'express';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../controllers/budgetController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getBudgets);
router.post('/', requireAuth, createBudget);
router.put('/:id', requireAuth, updateBudget);
router.delete('/:id', requireAuth, deleteBudget);

export default router;
