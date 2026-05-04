import { calculateProfit, validateInventoryUpdate } from '../utils/businessLogic';

describe('FuelOps Pro Business Logic Tests', () => {

  describe('Profit Calculations', () => {
    it('should calculate net profit correctly', () => {
      expect(calculateProfit(15000, 5000)).toBe(10000);
      expect(calculateProfit(5000, 6000)).toBe(-1000); // Loss
    });

    it('should throw Invalid input for negative values', () => {
      expect(() => calculateProfit(-100, 50)).toThrow('Invalid input');
      expect(() => calculateProfit(100, -50)).toThrow('Invalid input');
    });
  });

  describe('Inventory Validation Logic', () => {
    it('should validate successful inventory deduction', () => {
      expect(validateInventoryUpdate(50, 10)).toBe(true);
      expect(validateInventoryUpdate(50, 50)).toBe(true); // Exact match
    });

    it('should prevent invalid data entry (negative quantities)', () => {
      expect(() => validateInventoryUpdate(50, -5)).toThrow('Invalid input');
    });

    it('should throw Stock not available when deducting more than stock', () => {
      expect(() => validateInventoryUpdate(10, 15)).toThrow('Stock not available');
      expect(() => validateInventoryUpdate(0, 1)).toThrow('Stock not available');
    });
  });

});
