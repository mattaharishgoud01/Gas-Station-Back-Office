import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

const saleSchema = z.object({
  storeId: z.string().uuid(),
  category: z.string().optional(),
  paymentType: z.enum(['CASH', 'CREDIT', 'DEBIT', 'EBT', 'OTHER']),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive('Quantity must be greater than zero')
  })).min(1, 'Sales cannot exist without items')
});

router.post('/', async (req, res) => {
  try {
    const validatedData = saleSchema.parse(req.body);
    const { storeId, category, paymentType, items } = validatedData;

    // Calculate total amount and start transaction
    let totalAmount = 0;
    
    // We use a transaction to ensure inventory is deducted and sale is recorded atomically
    const result = await prisma.$transaction(async (tx) => {
      const saleItemsData = [];

      for (const item of items) {
        // Fetch current product
        const product = await tx.inventory.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        if (product.stockQuantity < item.quantity) throw new Error(`Stock not available for ${product.productName}`);

        // Deduct inventory
        await tx.inventory.update({
          where: { id: item.productId },
          data: { stockQuantity: product.stockQuantity - item.quantity }
        });

        const lineTotal = Number(product.sellingPrice) * item.quantity;
        totalAmount += lineTotal;

        saleItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.sellingPrice
        });
      }

      // Create Sale record
      const sale = await tx.sale.create({
        data: {
          storeId,
          category: category || 'store',
          paymentType,
          totalAmount,
          saleItems: {
            create: saleItemsData
          }
        },
        include: { saleItems: true }
      });

      return sale;
    });

    const io = req.app.get('io');
    if (io) io.to(`store-${storeId}`).emit('sales_updated', { storeId, data: result });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Sale processing failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const storeId = req.query.storeId as string || (req as any).user.storeId;
    const sales = await prisma.sale.findMany({
      where: { storeId },
      include: { saleItems: true },
      orderBy: { date: 'desc' },
      take: 50
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

export default router;
