import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MasterData from './pages/MasterData';
import Attendance from './pages/Attendance';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Assignments from './pages/Assignments';
import Exams from './pages/Exams';
import Assessments from './pages/Assessments';
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
            <Route path="courses" element={<Courses />} />
            <Route path="/students" element={<Students />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="exams" element={<Exams />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
