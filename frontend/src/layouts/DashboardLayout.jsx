import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Fuel, Package, ShoppingCart, BarChart3, Users, Truck, Bell, Search, Settings, ClipboardCheck, ShieldAlert, CreditCard } from 'lucide-react';
import { useData } from '../context/DataContext';
import AIAssistant from '../components/AIAssistant';

const navItems = [
  { name: 'Navigation', path: '/', icon: LayoutDashboard },
  { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { name: 'Daily Close', path: '/daily-close', icon: ClipboardCheck },
  { name: 'Fuel', path: '/fuel', icon: Fuel },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Sales Terminal', path: '/sales-terminal', icon: ShoppingCart },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Employees', path: '/employees', icon: Users },
  { name: 'Vendors', path: '/vendors', icon: Truck },
  { name: 'Audit Logs', path: '/audit-logs', icon: ShieldAlert },
  { name: 'POS Sync', path: '/pos-integration', icon: Settings },
];

export default function DashboardLayout() {
  const { currentUser, stores, activeStoreId, setActiveStoreId } = useData();

  // If Manager or Staff, they shouldn't see 'Global HQ' option
  const canSeeHQ = currentUser.role === 'owner';

  return (
    <div className="flex h-screen bg-background text-slate-900 font-sans">
      
      {/* Dark Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-slate-800 flex flex-col shadow-2xl z-20">
        <div className="p-6 flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Fuel className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">FuelOps Pro</h1>
          </div>
        </div>

        {/* Store Switcher */}
        <div className="px-4 mb-4">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Active Location</label>
          <select 
            value={activeStoreId}
            onChange={(e) => setActiveStoreId(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-800 transition-colors cursor-pointer appearance-none"
          >
            {canSeeHQ && <option value="hq">🌐 Global HQ (All Stores)</option>}
            {stores.map(store => (
              <option key={store.id} value={store.id}>🏪 {store.name}</option>
            ))}
          </select>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            // Hide some items if in HQ view to prevent confusion
            if (activeStoreId === 'hq' && ['/sales-terminal', '/daily-close'].includes(item.path)) {
              return null;
            }
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Sidebar Settings */}
        <div className="p-3 border-t border-slate-800/60 mt-auto">
          {canSeeHQ && (
            <NavLink to="/billing" className={({isActive}) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <CreditCard className="w-4 h-4" />
              Billing & Plans
            </NavLink>
          )}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search reports, inventory, or employees..."
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm ring-2 ring-white group-hover:ring-blue-100 transition-all">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-900 leading-tight">{currentUser.name}</p>
                <p className="text-xs text-slate-500 font-medium capitalize">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <AIAssistant />
    </div>
  );
}
