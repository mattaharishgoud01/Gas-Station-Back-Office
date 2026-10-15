import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BarChart3, ClipboardCheck, Droplets, Package, RefreshCw, ShoppingCart, Store, Truck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { inventoryService, reportsService } from '../services/api';

const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const number = (value) => new Intl.NumberFormat('en-US').format(value);
const links = [
  { title: 'Inventory', subtitle: 'Products, stock counts and reorders', to: '/inventory', icon: Package },
  { title: 'Fuel operations', subtitle: 'Tank readings and deliveries', to: '/fuel', icon: Droplets },
  { title: 'Daily close', subtitle: 'Reconcile the business day', to: '/daily-close', icon: ClipboardCheck },
  { title: 'POS imports', subtitle: 'Connect or review store sales', to: '/pos-integration', icon: ShoppingCart },
  { title: 'Reports', subtitle: 'Understand store performance', to: '/reports', icon: BarChart3 },
  { title: 'Vendors', subtitle: 'Suppliers and purchase activity', to: '/vendors', icon: Truck }
];

function Stat({ label, value, note }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    <p className="mt-2 text-xs text-slate-500">{note}</p>
  </div>;
}

export default function HomeDashboard() {
  const { stores, activeStoreId, setActiveStoreId } = useData();
  const { user } = useAuth();
  const isOwner = ['OWNER', 'owner', 'admin'].includes(user?.role);
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const selectedStore = stores.find(store => store.id === activeStoreId);
  const lowStock = useMemo(() => inventory.filter(item => item.stockQuantity <= (item.reorderLevel ?? 10)), [inventory]);

  const load = async () => {
    if (activeStoreId === 'hq') {
      setStatus('select-store');
      setInventory([]);
      setSummary(null);
      return;
    }
    setStatus('loading');
    setError('');
    const [inventoryResult, reportResult] = await Promise.allSettled([
      inventoryService.getInventory(activeStoreId),
      reportsService.getSummary(activeStoreId)
    ]);
    if (inventoryResult.status === 'fulfilled') setInventory(inventoryResult.value.data || []);
    else setInventory([]);
    if (reportResult.status === 'fulfilled') setSummary(reportResult.value.data);
    else setSummary(null);
    if (inventoryResult.status === 'rejected' || reportResult.status === 'rejected') {
      setError('Some live data could not be loaded. Check your connection, store access, and backend.');
      setStatus('partial');
    } else setStatus('ready');
  };

  useEffect(() => { load(); }, [activeStoreId]);

  return <div className="space-y-7 pb-12">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">FuelOps / Operations</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{isOwner ? 'Owner command center' : 'Store workspace'}</h1>
        <p className="mt-2 text-slate-600">{activeStoreId === 'hq' ? 'Select a location to see verified operational data.' : selectedStore?.name || 'Your assigned store'} · {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
      <button type="button" onClick={load} disabled={status === 'loading'} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={17} /> Refresh data</button>
    </div>

    {activeStoreId === 'hq' ? <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
      <div className="flex items-center gap-2 text-blue-900"><Store size={20}/><h2 className="font-bold">Choose a store to begin</h2></div>
      <p className="mt-2 text-sm text-blue-800">This screen intentionally does not combine demo data with real financial figures. Select a location to view its live records.</p>
      <div className="mt-4 flex flex-wrap gap-2">{stores.map(store => <button key={store.id} onClick={() => setActiveStoreId(store.id)} className="min-h-11 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm hover:bg-blue-100">{store.name} →</button>)}</div>
    </section> : <>
      {status === 'loading' && <div role="status" className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">Loading store information…</div>}
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle size={18} className="shrink-0"/>{error}</div>}
      <section aria-label="Store performance" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue · recorded" value={summary ? money(summary.totalRevenue) : 'Unavailable'} note="All recorded sales; not necessarily today" />
        <Stat label="Expenses · recorded" value={summary ? money(summary.totalExpenses) : 'Unavailable'} note="All recorded expenses" />
        <Stat label="Fuel volume · recorded" value={summary ? number(summary.gallonsSold) + ' gal' : 'Unavailable'} note="Meter-based gallons sold" />
        <Stat label="Low-stock products" value={status === 'ready' || status === 'partial' && inventory.length ? number(lowStock.length) : 'Unavailable'} note="At or below reorder threshold" />
      </section>
      <p className="text-xs text-slate-500">Financial figures are all-time aggregates from the existing API. Net profit is not displayed because the current backend calculation excludes cost of goods sold.</p>
      <section className="grid gap-5 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold text-slate-900">Needs attention</h2><Link to="/inventory" className="text-sm font-semibold text-blue-700 hover:underline">View inventory</Link></div>
          {status === 'loading' ? <p className="mt-5 text-sm text-slate-500">Checking store inventory…</p> : lowStock.length ? <ul className="mt-4 divide-y divide-slate-100">{lowStock.slice(0,5).map(item => <li key={item.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-semibold text-slate-900">{item.productName}</p><p className="text-xs text-slate-500">Reorder threshold: {item.reorderLevel ?? 10}</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">{item.stockQuantity} left</span></li>)}</ul> : <p className="mt-5 text-sm text-slate-500">{status === 'ready' ? 'No low-stock products found.' : 'Stock alerts are unavailable until inventory loads.'}</p>}
        </div>
        <div className="rounded-2xl bg-slate-900 p-6 text-white lg:col-span-2">
          <h2 className="text-lg font-bold">Today's workflow</h2>
          <p className="mt-2 text-sm text-slate-300">Use these operational shortcuts to complete your store routines.</p>
          <div className="mt-5 space-y-3">
            <Link to="/fuel" className="flex min-h-12 items-center justify-between rounded-xl bg-white/10 px-4 py-3 hover:bg-white/20">Record fuel readings <ArrowRight size={17}/></Link>
            <Link to="/inventory" className="flex min-h-12 items-center justify-between rounded-xl bg-white/10 px-4 py-3 hover:bg-white/20">Review stock levels <ArrowRight size={17}/></Link>
            <Link to="/daily-close" className="flex min-h-12 items-center justify-between rounded-xl bg-white/10 px-4 py-3 hover:bg-white/20">Prepare daily close <ArrowRight size={17}/></Link>
          </div>
        </div>
      </section>
    </>}
    <section><h2 className="mb-4 text-lg font-bold text-slate-900">Operations</h2><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{links.filter(item => isOwner || item.to !== '/reports').map(item => <Link key={item.to} to={item.to} className="group flex min-h-28 items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"><div className="rounded-xl bg-blue-50 p-3 text-blue-700"><item.icon size={21}/></div><div className="flex-1"><h3 className="font-bold text-slate-900">{item.title}</h3><p className="mt-1 text-sm text-slate-500">{item.subtitle}</p></div><ArrowRight size={16} className="mt-1 text-slate-400 group-hover:text-blue-700"/></Link>)}</div></section>
  </div>;
}
