import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import DashboardLayout from './layouts/DashboardLayout';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import SalesTerminal from './pages/SalesTerminal';
import DailyClose from './pages/DailyClose';
import FuelManagement from './pages/FuelManagement';
import Reports from './pages/Reports';
import Employees from './pages/Employees';
import Vendors from './pages/Vendors';
import AuditLogs from './pages/AuditLogs';
import Billing from './pages/Billing';
import PosIntegration from './pages/PosIntegration';
import HomeDashboard from './pages/HomeDashboard';

export default function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<HomeDashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="fuel" element={<FuelManagement />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="sales-terminal" element={<SalesTerminal />} />
            <Route path="daily-close" element={<DailyClose />} />
            <Route path="reports" element={<Reports />} />
            <Route path="employees" element={<Employees />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="pos-integration" element={<PosIntegration />} />
            <Route path="billing" element={<Billing />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}
