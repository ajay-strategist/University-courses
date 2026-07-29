import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MasterData from './pages/MasterData';
import Attendance from './pages/Attendance';
import { AppLayout } from './components/layout/AppLayout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" />;
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
            <Route path="master" element={<MasterData />} />
            <Route path="courses" element={<div><h1 className="text-3xl font-bold tracking-tight">Courses</h1></div>} />
            <Route path="students" element={<div><h1 className="text-3xl font-bold tracking-tight">Students</h1></div>} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="assignments" element={<div><h1 className="text-3xl font-bold tracking-tight">Assignments</h1></div>} />
            <Route path="exams" element={<div><h1 className="text-3xl font-bold tracking-tight">Exams</h1></div>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
