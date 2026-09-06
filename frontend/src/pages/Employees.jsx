import { useState } from 'react';
import { Plus, Eye, Edit2, MoreHorizontal, Search } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Employees() {
  const { employees, setEmployees, addAuditLog } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [newEmployee, setNewEmployee] = useState({ name: '', role: 'Staff', shift: 'Morning (6AM-2PM)' });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.name) return;
    setEmployees([...employees, { 
      id: Date.now(), 
      ...newEmployee, 
      salesHandled: 0 
    }]);
    
    addAuditLog('Admin User', `Added new employee: ${newEmployee.name}`, 'Employees', 'None', `${newEmployee.role}`);
    
    setShowAddModal(false);
    setNewEmployee({ name: '', role: 'Staff', shift: 'Morning (6AM-2PM)' });
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredEmployees = employees.filter((employee) =>
    [employee.name, employee.role, employee.shift]
      .some((value) => value?.toLowerCase().includes(normalizedSearch))
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Management</h2>
          <p className="text-slate-500 font-medium mt-1">Manage staff roles, shifts, and performance.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" /> Add Employee
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-slate-100/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees by name, role, or shift..."
              aria-label="Search employees"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Shift</th>
                <th className="px-6 py-4 text-right">Sales Handled</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="table-row group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-500 font-bold text-sm group-hover:bg-white group-hover:text-primary group-hover:border-primary/20 group-hover:shadow-sm transition-all duration-300">
                        {emp.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex w-fit ${
                      emp.role === 'Owner' ? 'bg-primary/10 text-primary border-primary/20' :
                      emp.role === 'Manager' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{emp.shift}</td>
                  <td className="px-6 py-4 font-mono text-slate-700 font-semibold text-right">${emp.salesHandled.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
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
          {filteredEmployees.length === 0 && (
            <div className="p-12 text-center font-medium text-slate-500">
              {search ? 'No employees match your search.' : 'No employees found.'}
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Add New Employee</h3>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input 
                  type="text" required
                  value={newEmployee.name}
                  onChange={e => setNewEmployee({...newEmployee, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                <select 
                  value={newEmployee.role}
                  onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                >
                  <option>Staff</option>
                  <option>Manager</option>
                  <option>Owner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Shift</label>
                <select 
                  value={newEmployee.shift}
                  onChange={e => setNewEmployee({...newEmployee, shift: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                >
                  <option>Morning (6AM-2PM)</option>
                  <option>Evening (2PM-10PM)</option>
                  <option>Night (10PM-6AM)</option>
                  <option>All</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
