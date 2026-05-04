import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

router.get('/summary', requireRole(['OWNER', 'MANAGER']), async (req, res) => {
  try {
    const storeId = req.query.storeId as string || (req as any).user.storeId;
    
    const [sales, expenses, fuelLogs] = await Promise.all([
      prisma.sale.aggregate({
        where: { storeId },
        _sum: { totalAmount: true }
      }),
      prisma.expense.aggregate({
        where: { storeId },
        _sum: { amount: true }
      }),
      prisma.fuelLog.aggregate({
        where: { storeId },
        _sum: { gallonsSold: true }
      })
    ]);

    const totalRevenue = Number(sales._sum.totalAmount || 0);
    const totalExpenses = Number(expenses._sum.amount || 0);
    const netProfit = totalRevenue - totalExpenses; // Note: COGS missing here for brevity, usually calculated via SaleItems cost

    res.json({
      totalRevenue,
      totalExpenses,
      netProfit,
      gallonsSold: Number(fuelLogs._sum.gallonsSold || 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
