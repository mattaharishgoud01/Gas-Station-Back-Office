import { z } from 'zod';

export const calculateProfit = (totalSales: number, totalExpenses: number): number => {
  if (totalSales < 0 || totalExpenses < 0) throw new Error('Invalid input');
  return totalSales - totalExpenses;
};

export const validateInventoryUpdate = (currentStock: number, deductQty: number): boolean => {
  if (deductQty < 0) throw new Error('Invalid input');
  if (currentStock < deductQty) throw new Error('Stock not available');
  return true;
};
