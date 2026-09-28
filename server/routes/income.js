import { Router } from 'express';
import { getIncomes, createIncome, updateIncome, deleteIncome } from '../controllers/incomeController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getIncomes);
router.post('/', requireAuth, createIncome);
router.put('/:id', requireAuth, updateIncome);
router.delete('/:id', requireAuth, deleteIncome);

export default router;
