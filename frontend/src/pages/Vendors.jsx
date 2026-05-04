import { useState } from 'react';
import { Truck, Plus, Eye, Edit2, MoreHorizontal } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Vendors() {
  const { vendors, setVendors, addAuditLog } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', category: 'Groceries/Tobacco' });

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!newVendor.name) return;
    setVendors([...vendors, { 
      id: Date.now(), 
      ...newVendor, 
      lastOrder: 'N/A',
      status: 'Active',
      rating: 'New'
    }]);

    addAuditLog('Admin User', `Added new vendor: ${newVendor.name}`, 'Vendors', 'None', `${newVendor.category}`);

    setShowAddModal(false);
    setNewVendor({ name: '', category: 'Groceries/Tobacco' });
  };

  const getStatusStyle = (status) => {
    if (status === 'Active' || status === 'Delivered') return 'badge badge-success';
    if (status === 'Pending') return 'badge badge-warning';
    return 'badge badge-danger';
  };

  const getStatusText = (status) => {
    if (status === 'Delivered') return 'Active';
    if (status === 'No Orders') return 'Inactive';
    return status;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Management</h2>
          <p className="text-slate-500 font-medium mt-1">Track suppliers, purchase orders, and deliveries.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" /> Add Vendor
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Last Order</th>
                <th className="px-6 py-4">Reliability</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {vendors.map(vendor => (
                <tr key={vendor.id} className="table-row group">
                  <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-primary group-hover:border-primary/20 group-hover:shadow-sm transition-all duration-300">
                      <Truck className="w-4 h-4" />
                    </div>
                    {vendor.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{vendor.category}</td>
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">{vendor.lastOrder}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{vendor.rating}</td>
                  <td className="px-6 py-4">
                    <span className={getStatusStyle(vendor.status)}>
                      {getStatusText(vendor.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-md transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vendors.length === 0 && (
            <div className="p-12 text-center font-medium text-slate-500">No vendors found.</div>
          )}
        </div>
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Add New Vendor</h3>
            </div>
            <form onSubmit={handleAddVendor} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vendor Name</label>
                <input 
                  type="text" required
                  value={newVendor.name}
                  onChange={e => setNewVendor({...newVendor, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <select 
                  value={newVendor.category}
                  onChange={e => setNewVendor({...newVendor, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                >
                  <option>Groceries/Tobacco</option>
                  <option>Beverages</option>
                  <option>Beer/Liquor</option>
                  <option>Fuel</option>
                  <option>Supplies</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
