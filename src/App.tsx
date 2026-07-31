import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MasterData from './pages/MasterData';
import Users from './pages/Users';
import Batches from './pages/Batches';
import BatchDetails from './pages/Batches/BatchDetails';
import ImportCenter from './pages/ImportCenter';
import BulkUpload from './pages/BulkUpload';
import EmailNotifications from './pages/EmailNotifications';
import Reports from './pages/Reports';
import { AppLayout } from './components/layout/AppLayout';
import ForcePasswordReset from './pages/ForcePasswordReset';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, profile, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
        <span className="font-mono text-sm text-muted-foreground">Loading Meridian Console...</span>
      </div>
    );
  }
  
  if (!session) {
    return <Navigate to="/login" />;
  }

  if (profile?.must_change_password) {
    return <ForcePasswordReset />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="masters" element={<MasterData />} />
            <Route path="users" element={<Users />} />
            <Route path="batches" element={<Batches />} />
            <Route path="batches/:id" element={<BatchDetails />} />
            <Route path="import-center" element={<ImportCenter />} />
            <Route path="import-center/bulk" element={<BulkUpload />} />
            <Route path="notifications" element={<EmailNotifications />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
