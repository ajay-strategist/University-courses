import { useAuth } from '@/contexts/AuthContext';
import { SuperAdminDashboard } from '@/components/dashboard/SuperAdminDashboard';
import { TrainerDashboard } from '@/components/dashboard/TrainerDashboard';
import { CoordinatorDashboard } from '@/components/dashboard/CoordinatorDashboard';

export default function Dashboard() {
  const { profile } = useAuth();

  if (!profile) return null;

  switch (profile.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'trainer':
      return <TrainerDashboard />;
    case 'student_coordinator':
      return <CoordinatorDashboard />;
    default:
      return <div>Access Denied</div>;
  }
}
