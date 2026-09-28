import { Router } from 'express';
import { getSummary, getCategories, getMonthly, getTrends, getBudgetComparison, getInsights } from '../controllers/analyticsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/summary', requireAuth, getSummary);
router.get('/categories', requireAuth, getCategories);
router.get('/monthly', requireAuth, getMonthly);
router.get('/trends', requireAuth, getTrends);
router.get('/budget-comparison', requireAuth, getBudgetComparison);
router.get('/insights', requireAuth, getInsights);

export default router;
