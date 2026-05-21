import { createContext, useContext, useState, useMemo } from 'react';
import { getDepartmentConfig } from '../utils/departments';
const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // --- MULTI-STORE & SAAS STATE ---
  const [currentUser] = useState({ id: 'u1', name: 'Alex Owner', role: 'owner' });
  const [subscription] = useState({ plan: 'Pro', status: 'Active' });
  
  const [stores] = useState([
    { id: 's1', name: 'FuelOps Downtown' },
    { id: 's2', name: 'FuelOps Highway' }
  ]);
  
  const [activeStoreId, setActiveStoreId] = useState('hq'); // 'hq' = owner view
  const [reportDateRange, setReportDateRange] = useState('all'); // 'today', '7d', '30d', 'all'

  const [globalData, setGlobalData] = useState({
    's1': {
      fuelTanks: [
        { id: 1, type: 'Regular 87', capacity: 10000, current: 4500, cost: 2.85, price: 3.19, deliveryHistory: [], totalSold: 0 },
        { id: 2, type: 'Premium 93', capacity: 8000, current: 3200, cost: 3.25, price: 3.79, deliveryHistory: [], totalSold: 0 }
      ],
      inventory: [
        { id: 1, name: 'Marlboro Red', category: 'Cigarettes Packs', sku: '283749283', cost: 6.50, price: 9.50, stock: 45, lowStockAlert: 50 },
        { id: 2, name: 'Bud Light 12pk', category: 'Beer', sku: '982736482', cost: 11.00, price: 15.99, stock: 120, lowStockAlert: 30 }
      ],
      salesLog: [],
      dailyHistory: [
        { id: 1, date: '2026-04-26', totalRevenue: 15420.50, totalExpenses: 800, netProfit: 3200.25, highestCategory: 'Fuel', lowestCategory: 'Hot Food' }
      ],
      shrinkageLogs: [],
      auditLogs: [],
      employees: [
        { id: 1, name: 'Alice Smith', role: 'Manager', shift: 'Morning', salesHandled: 4500 }
      ],
      vendors: [
        { id: 1, name: 'Core-Mark', category: 'Grocery (Pop/Beverages)', lastOrder: '2026-04-25', status: 'Delivered', rating: '98%' }
      ]
    },
    's2': {
      fuelTanks: [
        { id: 1, type: 'Regular 87', capacity: 12000, current: 8000, cost: 2.80, price: 3.15, deliveryHistory: [], totalSold: 0 },
        { id: 3, type: 'Diesel', capacity: 12000, current: 8000, cost: 3.15, price: 3.59, deliveryHistory: [], totalSold: 0 }
      ],
      inventory: [
        { id: 3, name: 'Red Bull 8oz', category: 'Grocery (Pop/Beverages)', sku: '192837465', cost: 1.50, price: 2.99, stock: 200, lowStockAlert: 50 },
        { id: 4, name: 'Hot Dog', category: 'Hot Food', sku: 'HOTDOG01', cost: 0.80, price: 2.50, stock: 15, lowStockAlert: 20 },
        { id: 5, name: 'Lottery Payout', category: 'Lottery Payout', sku: 'PAYOUT', cost: 1.00, price: 1.00, stock: 9999, lowStockAlert: 0 },
        { id: 6, name: 'Scratchers', category: 'Lottery Sales', sku: 'LOTTO1', cost: 0.90, price: 1.00, stock: 500, lowStockAlert: 50 }
      ],
      salesLog: [],
      dailyHistory: [
        { id: 1, date: '2026-04-26', totalRevenue: 18500.00, totalExpenses: 900, netProfit: 4100.00, highestCategory: 'Fuel', lowestCategory: 'Grocery (Pop/Beverages)' }
      ],
      shrinkageLogs: [],
      auditLogs: [],
      employees: [
        { id: 3, name: 'Bob Jones', role: 'Staff', shift: 'Evening', salesHandled: 2100 }
      ],
      vendors: [
        { id: 2, name: 'PepsiCo', category: 'Grocery (Pop/Beverages)', lastOrder: '2026-04-26', status: 'Pending', rating: '95%' }
      ]
    }
  });

  // Getters for active store
  const safeStoreId = activeStoreId === 'hq' ? 's1' : activeStoreId; // fallback for non-HQ screens if forced
  const storeData = globalData[safeStoreId];

  const fuelTanks = storeData.fuelTanks;
  const inventory = storeData.inventory;
  const salesLog = storeData.salesLog;
  const dailyHistory = storeData.dailyHistory;
  const shrinkageLogs = storeData.shrinkageLogs;
  const auditLogs = storeData.auditLogs;
  const employees = storeData.employees;
  const vendors = storeData.vendors;

  // Setters wrapper
  const updateStoreData = (storeId, key, updater) => {
    setGlobalData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        [key]: typeof updater === 'function' ? updater(prev[storeId][key]) : updater
      }
    }));
  };

  const setFuelTanks = (updater) => updateStoreData(safeStoreId, 'fuelTanks', updater);
  const setInventory = (updater) => updateStoreData(safeStoreId, 'inventory', updater);
  const setSalesLog = (updater) => updateStoreData(safeStoreId, 'salesLog', updater);
  const setDailyHistory = (updater) => updateStoreData(safeStoreId, 'dailyHistory', updater);
  const setAuditLogs = (updater) => updateStoreData(safeStoreId, 'auditLogs', updater);
  const setShrinkageLogs = (updater) => updateStoreData(safeStoreId, 'shrinkageLogs', updater);
  const setEmployees = (updater) => updateStoreData(safeStoreId, 'employees', updater);
  const setVendors = (updater) => updateStoreData(safeStoreId, 'vendors', updater);

  const [hourlyTrends] = useState([
    { time: '6AM', sales: 400 }, { time: '8AM', sales: 1200 }, { time: '10AM', sales: 800 },
    { time: '12PM', sales: 1500 }, { time: '2PM', sales: 900 }, { time: '4PM', sales: 1800 },
    { time: '6PM', sales: 2100 }, { time: '8PM', sales: 1100 }, { time: '10PM', sales: 600 }
  ]);

  const addAuditLog = (user, action, module, oldValue, newValue) => {
    setAuditLogs(prev => [{
      id: Date.now() + Math.random(),
      user, action, module,
      oldValue: String(oldValue), newValue: String(newValue),
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  const recordStoreSale = (itemsSold) => {
    let saleRevenue = 0; let saleProfit = 0; let saleTax = 0;
    
    // Process inventory updates and calculate sale totals
    setInventory(prev => prev.map(item => {
      const sold = itemsSold.find(s => s.id === item.id);
      if (sold) {
        if (item.stock - sold.qty < 0) return item;
        
        const config = getDepartmentConfig(item.category);
        const lineTotal = item.price * sold.qty;
        const lineProfit = (item.price - item.cost) * sold.qty;
        const lineTax = lineTotal * (config.taxRate || 0);

        if (config.id === 'lottery_payout') {
          saleProfit -= lineTotal; // Treated as expense, reduces net profit
        } else {
          saleRevenue += lineTotal;
          saleProfit += lineProfit;
          saleTax += lineTax;
        }

        // Tag the sold item with tax info for reporting
        sold.taxCollected = lineTax;
        sold.department = config.name;

        const newStock = item.stock - sold.qty;
        addAuditLog(currentUser.name, `Sold ${sold.qty}x ${item.name}`, 'Inventory', `${item.stock}`, `${newStock}`);
        return { ...item, stock: newStock };
      }
      return item;
    }));
    
    setSalesLog(prev => [{ 
      id: Date.now(), 
      type: 'store', 
      date: new Date().toISOString().split('T')[0], 
      revenue: saleRevenue, 
      profit: saleProfit, 
      taxCollected: saleTax,
      items: itemsSold 
    }, ...prev]);
  };

  const recordFuelSale = (tankId, gallonsSold) => {
    let saleRevenue = 0; let saleProfit = 0;
    setFuelTanks(prev => prev.map(tank => {
      if (tank.id === tankId) {
        saleRevenue = tank.price * gallonsSold; saleProfit = (tank.price - tank.cost) * gallonsSold;
        const newLevel = tank.current - gallonsSold;
        addAuditLog(currentUser.name, `Sold ${gallonsSold} gal of ${tank.type}`, 'Fuel', `${tank.current.toFixed(1)} gal`, `${newLevel.toFixed(1)} gal`);
        return { ...tank, current: newLevel, totalSold: tank.totalSold + gallonsSold };
      }
      return tank;
    }));
    setSalesLog(prev => [{ id: Date.now(), type: 'fuel', date: new Date().toISOString().split('T')[0], revenue: saleRevenue, profit: saleProfit, gallons: gallonsSold }, ...prev]);
  };

  const addFuelDelivery = (tankId, gallonsAdded) => {
    setFuelTanks(prev => prev.map(tank => {
      if (tank.id === tankId) {
        const newLevel = Math.min(tank.capacity, tank.current + gallonsAdded);
        addAuditLog(currentUser.name, `Received Fuel Delivery`, 'Fuel', `${tank.current.toFixed(1)} gal`, `${newLevel.toFixed(1)} gal`);
        return { ...tank, current: newLevel, deliveryHistory: [...(tank.deliveryHistory||[]), { date: new Date().toISOString(), qty: gallonsAdded }] };
      }
      return tank;
    }));
  };

  const recordPhysicalCount = (type, itemId, actualCount) => {
    if (type === 'inventory') {
      setInventory(prev => prev.map(item => {
        if (item.id === itemId) {
          if (actualCount < item.stock) {
            const lossQty = item.stock - actualCount;
            const lossValue = lossQty * item.cost;
            setShrinkageLogs(logs => [{ id: Date.now(), type: 'inventory', name: item.name, expected: item.stock, actual: actualCount, lossQty, lossValue, date: new Date().toISOString() }, ...logs]);
            addAuditLog(currentUser.name, `Reported shrinkage on ${item.name}`, 'Loss Prevention', item.stock, actualCount);
          }
          return { ...item, stock: actualCount };
        }
        return item;
      }));
    } else if (type === 'fuel') {
      setFuelTanks(prev => prev.map(tank => {
        if (tank.id === itemId) {
          if (actualCount < tank.current) {
            const lossQty = tank.current - actualCount;
            const lossValue = lossQty * tank.cost;
            setShrinkageLogs(logs => [{ id: Date.now(), type: 'fuel', name: tank.type, expected: tank.current.toFixed(1), actual: parseFloat(actualCount).toFixed(1), lossQty: lossQty.toFixed(1), lossValue, date: new Date().toISOString() }, ...logs]);
            addAuditLog(currentUser.name, `Reported fuel loss on ${tank.type}`, 'Loss Prevention', `${tank.current.toFixed(1)} gal`, `${parseFloat(actualCount).toFixed(1)} gal`);
          }
          return { ...tank, current: parseFloat(actualCount) };
        }
        return tank;
      }));
    }
  };

  useEffect(() => {
    import('../services/api').then(({ socket }) => {
      if (activeStoreId && activeStoreId !== 'hq') {
        socket.emit('join_store', activeStoreId);

        const handleSalesUpdate = (payload) => {
          console.log('LIVE SALE RECEIVED:', payload);
          // Refetch or append to sales logs (in a real app, we'd append to state or refetch KPI endpoints)
          // For now we add a visual notification or append to state
          if (payload.data && payload.data.totalAmount) {
            setSalesLog(prev => [{ 
              id: payload.data.id || Date.now(),
              type: payload.data.category === 'fuel' ? 'fuel' : 'store',
              date: new Date().toISOString().split('T')[0],
              revenue: payload.data.totalAmount,
              profit: payload.data.totalAmount * 0.3, // Mock profit for real-time insert
              gallons: payload.data.category === 'fuel' ? (payload.data.totalAmount / 3.0) : 0,
              items: payload.data.saleItems || []
            }, ...prev]);
          }
        };

        const handleFuelUpdate = (payload) => {
          console.log('LIVE FUEL DROP RECEIVED:', payload);
        };

        socket.on('sales_updated', handleSalesUpdate);
        socket.on('fuel_updated', handleFuelUpdate);

        return () => {
          socket.off('sales_updated', handleSalesUpdate);
          socket.off('fuel_updated', handleFuelUpdate);
        };
      }
    });
  }, [activeStoreId]);

  const calculateKPIs = () => {
    let baseRevenue = 0; let baseProfit = 0; let baseGallons = 0;
    const today = new Date().toISOString().split('T')[0];
    salesLog.filter(s => s.date === today).forEach(sale => {
      baseRevenue += sale.revenue; baseProfit += sale.profit;
      if (sale.type === 'fuel') baseGallons += sale.gallons;
    });
    return {
      revenue: baseRevenue + (safeStoreId === 's1' ? 14500 : 18500),
      profit: baseProfit + (safeStoreId === 's1' ? 3200 : 4100),
      gallons: baseGallons + (safeStoreId === 's1' ? 3450 : 4200),
      lowStockCount: inventory.filter(item => item.stock <= item.lowStockAlert).length
    };
  };

  const getHQStats = () => {
    // Aggregates for all stores
    const s1Rev = globalData['s1'].dailyHistory[0]?.totalRevenue || 14500;
    const s2Rev = globalData['s2'].dailyHistory[0]?.totalRevenue || 18500;
    
    const s1Prof = globalData['s1'].dailyHistory[0]?.netProfit || 3200;
    const s2Prof = globalData['s2'].dailyHistory[0]?.netProfit || 4100;
    
    return {
      totalRevenue: s1Rev + s2Rev,
      totalProfit: s1Prof + s2Prof,
      storeComparisons: [
        { name: 'FuelOps Downtown', revenue: s1Rev, profit: s1Prof },
        { name: 'FuelOps Highway', revenue: s2Rev, profit: s2Prof }
      ]
    };
  };

  const deptSales = useMemo(() => {
    let deptData = {};
    
    // Default initial mock state for testing visual display
    if (activeStoreId === 'hq' || salesLog.length === 0) {
      deptData = { 
        'Fuel': { revenue: 8500, profit: 425 }, 
        'Cigarettes Packs': { revenue: 2100, profit: 105 }, 
        'Beer': { revenue: 1800, profit: 450 }, 
        'Grocery (Pop/Beverages)': { revenue: 1200, profit: 600 }, 
        'Hot Food': { revenue: 900, profit: 630 }, 
        'Lottery Sales': { revenue: 500, profit: 25 }, 
        'Vapes': { revenue: 300, profit: 120 } 
      };
    }

    const today = new Date();
    const filteredLogs = salesLog.filter(sale => {
      if (reportDateRange === 'all') return true;
      const saleDate = new Date(sale.date);
      if (reportDateRange === 'today') return sale.date === today.toISOString().split('T')[0];
      if (reportDateRange === '7d') return (today - saleDate) / (1000 * 60 * 60 * 24) <= 7;
      if (reportDateRange === '30d') return (today - saleDate) / (1000 * 60 * 60 * 24) <= 30;
      return true;
    });

    filteredLogs.forEach(sale => {
      if (sale.type === 'fuel') { 
        if (!deptData['Fuel']) deptData['Fuel'] = { revenue: 0, profit: 0 };
        deptData['Fuel'].revenue += sale.revenue; 
        deptData['Fuel'].profit += sale.profit; 
      } else {
        sale.items.forEach(soldItem => {
          const itemDef = inventory.find(i => i.id === soldItem.id);
          if (itemDef) {
            const config = getDepartmentConfig(itemDef.category);
            if (config.id !== 'lottery_payout') {
               const rev = itemDef.price * soldItem.qty;
               const prof = (itemDef.price - itemDef.cost) * soldItem.qty;
               if (!deptData[config.name]) deptData[config.name] = { revenue: 0, profit: 0 };
               deptData[config.name].revenue += rev;
               deptData[config.name].profit += prof;
            }
          }
        });
      }
    });

    return Object.entries(deptData).map(([name, data]) => {
      const margin = data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0;
      return { name, value: data.revenue, revenue: data.revenue, profit: data.profit, margin };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [salesLog, inventory, activeStoreId]);

  const taxByDept = useMemo(() => {
    let deptTaxes = {};
    let totalTax = 0;

    // Default mock data for visual display
    if (activeStoreId === 'hq' || salesLog.length === 0) {
      deptTaxes = {
        'Cigarettes Packs': 315.00,
        'Fuel': 595.00,
        'Beer': 180.00,
        'Grocery (Pop/Beverages)': 84.00,
        'Hard Liquor': 225.00
      };
      totalTax = Object.values(deptTaxes).reduce((a, b) => a + b, 0);
    }

    const today = new Date();
    const filteredLogs = salesLog.filter(sale => {
      if (reportDateRange === 'all') return true;
      const saleDate = new Date(sale.date);
      if (reportDateRange === 'today') return sale.date === today.toISOString().split('T')[0];
      if (reportDateRange === '7d') return (today - saleDate) / (1000 * 60 * 60 * 24) <= 7;
      if (reportDateRange === '30d') return (today - saleDate) / (1000 * 60 * 60 * 24) <= 30;
      return true;
    });

    filteredLogs.forEach(sale => {
      if (sale.type === 'store') {
        sale.items.forEach(soldItem => {
          const itemDef = inventory.find(i => i.id === soldItem.id);
          if (itemDef) {
            const config = getDepartmentConfig(itemDef.category);
            const lineTax = (itemDef.price * soldItem.qty) * (config.taxRate || 0);
            if (lineTax > 0) {
              deptTaxes[config.name] = (deptTaxes[config.name] || 0) + lineTax;
              totalTax += lineTax;
            }
          }
        });
      }
    });

    return {
      breakdown: Object.entries(deptTaxes).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      total: totalTax
    };
  }, [salesLog, inventory, activeStoreId]);

  const getSmartInsights = () => {
    if (!deptSales || deptSales.length === 0) return [];
    
    const sortedByMargin = [...deptSales].sort((a, b) => b.margin - a.margin);
    const highestMargin = sortedByMargin[0];
    const lowestMargin = sortedByMargin[sortedByMargin.length - 1];
    const topRevenue = deptSales[0]; // already sorted by revenue

    const insights = [];
    if (highestMargin) {
      insights.push({ id: 'm1', type: 'success', text: `${highestMargin.name} has the highest margin at ${highestMargin.margin.toFixed(1)}%. Consider running promotions.` });
    }
    
    if (lowestMargin) {
      insights.push({ id: 'm2', type: 'warning', text: `${lowestMargin.name} profit margin is extremely low (${lowestMargin.margin.toFixed(1)}%). Re-evaluate pricing.` });
    }
    
    if (topRevenue && topRevenue.margin < 10) {
      insights.push({ id: 'm3', type: 'info', text: `${topRevenue.name} revenue is high but margin is low (${topRevenue.margin.toFixed(1)}%).` });
    }

    if (insights.length === 0) {
      insights.push({ id: '1', type: 'success', text: `Store revenue is up 12% across all locations compared to last week.` });
    }

    return insights;
  };

  const value = {
    currentUser, subscription, stores, activeStoreId, setActiveStoreId,
    reportDateRange, setReportDateRange,
    fuelTanks, setFuelTanks, inventory, setInventory, salesLog, setSalesLog,
    hourlyTrends, deptSales, taxByDept, employees, setEmployees, vendors, setVendors,
    auditLogs, addAuditLog, dailyHistory, setDailyHistory, shrinkageLogs, recordPhysicalCount,
    calculateKPIs, getHQStats, getSmartInsights, recordStoreSale, recordFuelSale, addFuelDelivery
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
