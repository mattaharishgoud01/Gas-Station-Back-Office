import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Save, CheckCircle2, Droplets } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getDepartmentConfig } from '../utils/departments';
import { salesService } from '../services/api';

export default function DailyClose() {
  const { inventory, fuelTanks, recordStoreSale, recordFuelSale, activeStoreId } = useData();
  const [success, setSuccess] = useState('');
  
  const [storeCart, setStoreCart] = useState([{ id: inventory[0]?.id || '', qty: 1 }]);
  const [fuelSale, setFuelSale] = useState({ id: fuelTanks[0]?.id || '', gallons: 10 });

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    const validItems = storeCart.filter(item => item.id && item.qty > 0).map(item => ({
      id: parseInt(item.id),
      qty: parseInt(item.qty)
    }));
    
    if (validItems.length > 0) {
      try {
        await salesService.recordSale({
          storeId: activeStoreId,
          type: 'store',
          items: validItems
        });
        recordStoreSale(validItems);
        setSuccess('Store sale recorded! Inventory automatically updated.');
        setTimeout(() => setSuccess(''), 3000);
        setStoreCart([{ id: inventory[0]?.id || '', qty: 1 }]);
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        console.error("Failed to record store sale", error);
        alert(`Failed to record sale: ${errorMsg}`);
      }
    }
  };

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    if (fuelSale.id && fuelSale.gallons > 0) {
      try {
        await salesService.recordSale({
          storeId: activeStoreId,
          type: 'fuel',
          tankId: parseInt(fuelSale.id),
          gallons: parseFloat(fuelSale.gallons)
        });
        recordFuelSale(parseInt(fuelSale.id), parseFloat(fuelSale.gallons));
        setSuccess(`Fuel sale recorded! Tank level decreased by ${fuelSale.gallons} gal.`);
        setTimeout(() => setSuccess(''), 3000);
        setFuelSale({ ...fuelSale, gallons: 10 });
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        console.error("Failed to record fuel sale", error);
        alert(`Failed to record fuel sale: ${errorMsg}`);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Terminal (Simulator)</h2>
        <p className="text-slate-500 font-medium">Record live sales to see real-time inventory deduction and profit calculation.</p>
      </div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 font-medium shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <p>{success}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Sales */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">C-Store Sale</h3>
          </div>
          
          <form onSubmit={handleStoreSubmit} className="space-y-4">
            {storeCart.map((item, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product</label>
                  <select 
                    value={item.id}
                    onChange={(e) => {
                      const newCart = [...storeCart];
                      newCart[index].id = e.target.value;
                      setStoreCart(newCart);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  >
                    {inventory.map(inv => (
                      <option key={inv.id} value={inv.id}>
                        {inv.name} (Stock: {inv.stock}) - ${inv.price}
                      </option>
                    ))}
                  </select>
                  {item.id && (() => {
                    const selectedInv = inventory.find(i => i.id.toString() === item.id.toString());
                    if (selectedInv) {
                      const dept = getDepartmentConfig(selectedInv.category);
                      return (
                        <div className="mt-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${dept.color}`}>
                            {dept.name}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="w-24">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Qty</label>
                  <input 
                    type="number" min="1" required
                    value={item.qty}
                    onChange={(e) => {
                      const newCart = [...storeCart];
                      newCart[index].qty = e.target.value;
                      setStoreCart(newCart);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>
              </div>
            ))}
            
            <button 
              type="button"
              onClick={() => setStoreCart([...storeCart, { id: inventory[0]?.id || '', qty: 1 }])}
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              + Add Another Item
            </button>

            {/* Live Cart Totals */}
            {(() => {
              let subtotal = 0;
              let taxTotal = 0;
              storeCart.forEach(item => {
                if (!item.id || !item.qty) return;
                const inv = inventory.find(i => i.id.toString() === item.id.toString());
                if (inv) {
                  const dept = getDepartmentConfig(inv.category);
                  const lineTot = inv.price * item.qty;
                  subtotal += lineTot;
                  taxTotal += lineTot * (dept.taxRate || 0);
                }
              });
              const totalOwed = subtotal + taxTotal;

              return (
                <div className="pt-4 mt-6 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Estimated Tax</span>
                    <span>${taxTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 mt-2 pt-2 border-t border-slate-100 border-dashed">
                    <span>Total Owed</span>
                    <span>${totalOwed.toFixed(2)}</span>
                  </div>
                </div>
              );
            })()}

            <div className="pt-4 mt-2 flex justify-end">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save className="w-5 h-5" /> Ring Up Sale
              </button>
            </div>
          </form>
        </div>

        {/* Fuel Sales */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <Droplets className="w-6 h-6 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Fuel Sale</h3>
          </div>
          
          <form onSubmit={handleFuelSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pump / Grade</label>
              <select 
                value={fuelSale.id}
                onChange={(e) => setFuelSale({...fuelSale, id: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              >
                {fuelTanks.map(tank => (
                  <option key={tank.id} value={tank.id}>
                    {tank.type} (Level: {tank.current.toFixed(1)} gal) - ${tank.price}/gal
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gallons Sold</label>
              <input 
                type="number" min="0.1" step="0.1" required
                value={fuelSale.gallons}
                onChange={(e) => setFuelSale({...fuelSale, gallons: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-sm transition-all">
                <Save className="w-5 h-5" /> Record Fuel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
