import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShieldAlert, Clock, ArrowRight, User, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function AuditLogs() {
  const { auditLogs } = useData();
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterUser, setFilterUser] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  // Extract unique users and modules for filters
  const uniqueModules = ['All', ...new Set(auditLogs.map(log => log.module))];
  const uniqueUsers = ['All', ...new Set(auditLogs.map(log => log.user))];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());
      
    const matchesModule = filterModule === 'All' || log.module === filterModule;
    const matchesUser = filterUser === 'All' || log.user === filterUser;
    const matchesDate = filterDate === '' || log.timestamp.startsWith(filterDate);

    return matchesSearch && matchesModule && matchesUser && matchesDate;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            Audit Logs
          </h2>
          <p className="text-slate-500 font-medium mt-1">Track system changes, inventory adjustments, and security events.</p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col xl:flex-row items-center gap-4 bg-white">
          <div className="relative flex-1 w-full xl:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search actions, users, or modules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg py-2.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 min-w-max">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input 
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 min-w-max">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
              >
                {uniqueModules.map(mod => (
                  <option key={mod} value={mod}>{mod} Module</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 min-w-max">
              <User className="w-4 h-4 text-slate-400" />
              <select 
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
              >
                {uniqueUsers.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Module</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Value Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {filteredLogs.map((log, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={log.id} 
                  className="table-row group hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                        {log.user.charAt(0)}
                      </div>
                      {log.user}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge bg-indigo-50 text-indigo-700 border-indigo-200">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4">
                    {log.oldValue !== 'None' ? (
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100">{log.oldValue}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">{log.newValue}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-200">None</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">{log.newValue}</span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
              <ShieldAlert className="w-8 h-8 mb-3 text-slate-300" />
              <p className="font-medium text-slate-600">No audit logs found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
