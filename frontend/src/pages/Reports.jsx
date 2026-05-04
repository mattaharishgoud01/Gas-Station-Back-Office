import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, TrendingDown, TrendingUp, AlertTriangle, Lightbulb, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Reports() {
  const { deptSales, taxByDept, inventory, getSmartInsights, reportDateRange, setReportDateRange } = useData();
  const insights = getSmartInsights();
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

  // Sort inventory by profit margin for Top/Bottom products
  const productsWithMargin = inventory.map(item => ({
    ...item,
    margin: ((item.price - item.cost) / item.price) * 100
  })).sort((a, b) => b.margin - a.margin);

  const topProducts = productsWithMargin.slice(0, 3);
  const bottomProducts = productsWithMargin.slice(-3).reverse();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h2>
          <p className="text-slate-500 font-medium">Comprehensive view of business performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
          <Calendar className="w-5 h-5 text-slate-400" />
          <select 
            value={reportDateRange}
            onChange={(e) => setReportDateRange(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none appearance-none cursor-pointer pr-4"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Smart Insights */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-xl border flex gap-3 ${
                insight.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                insight.type === 'warning' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              <Lightbulb className={`w-5 h-5 shrink-0 ${
                insight.type === 'success' ? 'text-emerald-600' :
                insight.type === 'warning' ? 'text-rose-600' :
                'text-blue-600'
              }`} />
              <p className="text-sm font-semibold leading-relaxed">{insight.text}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dept Performance Chart */}
        <div className="glass-panel p-6 flex flex-col lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Department Revenue</h3>
          <div className="h-80 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptSales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94A3B8" tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 600 }}
                  labelStyle={{ color: '#64748B', fontWeight: 500, marginBottom: '4px' }}
                />
                <Bar dataKey="revenue" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Split */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Revenue Split</h3>
          <div className="h-80 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptSales}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {deptSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 600 }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Performance Table */}
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Department Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-right">Revenue</th>
                <th className="px-6 py-4 text-right">Profit</th>
                <th className="px-6 py-4 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {deptSales.map((dept, i) => (
                <tr key={i} className="table-row group">
                  <td className="px-6 py-4 font-semibold text-slate-900">{dept.name}</td>
                  <td className="px-6 py-4 font-mono text-slate-700 text-right">${dept.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 font-mono text-emerald-600 font-bold text-right">${dept.profit.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md font-bold text-xs ${dept.margin >= 20 ? 'bg-emerald-100 text-emerald-700' : dept.margin < 10 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {dept.margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Liability Report */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Tax Liability Report</h3>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Tax Collected</p>
            <p className="text-2xl font-black text-slate-900">${taxByDept.total.toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {taxByDept.breakdown.map((dept, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-blue-200 transition-colors"
            >
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate mb-1" title={dept.name}>{dept.name}</p>
              <p className="text-lg font-bold text-slate-900">${dept.value.toFixed(2)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Highest Margin Products</h3>
          </div>
          <div className="space-y-4">
            {topProducts.map((item, idx) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-600 font-bold text-lg">{item.margin.toFixed(1)}%</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Margin</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Low Margin Products */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingDown className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Lowest Margin Products</h3>
          </div>
          <div className="space-y-4">
            {bottomProducts.map((item, idx) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-rose-600 font-bold text-lg">{item.margin.toFixed(1)}%</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Margin</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
