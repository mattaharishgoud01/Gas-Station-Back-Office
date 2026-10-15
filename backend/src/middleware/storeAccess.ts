import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';

/** Validate that the signed-in user can access the requested store. */
export const requireStoreAccess = (resolveStoreId: (req: Request) => string | undefined) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = resolveStoreId(req);
    if (!storeId) return res.status(400).json({ error: 'storeId is required' });
    const user = (req as any).user;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const store = await prisma.store.findUnique({ where: { id: storeId }, select: { ownerId: true } });
      if (!store) return res.status(404).json({ error: 'Store not found' });
      const allowed = store.ownerId === user.id || (user.storeId === storeId && ['MANAGER', 'STAFF'].includes(user.role));
      if (!allowed) return res.status(403).json({ error: 'Forbidden: Store access denied' });
      next();
    } catch {
      return res.status(500).json({ error: 'Unable to verify store access' });
    }
  };
