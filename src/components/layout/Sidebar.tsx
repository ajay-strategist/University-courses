import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  ClipboardList,
  LogOut,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['super_admin', 'trainer', 'student_coordinator'] },
    { name: 'Master Data', path: '/master', icon: Settings, roles: ['super_admin'] },
    { name: 'Courses', path: '/courses', icon: BookOpen, roles: ['super_admin', 'trainer'] },
    { name: 'Students', path: '/students', icon: Users, roles: ['super_admin', 'student_coordinator'] },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck, roles: ['super_admin', 'student_coordinator'] },
    { name: 'Assignments', path: '/assignments', icon: ClipboardList, roles: ['trainer', 'student_coordinator'] },
    { name: 'Exams', path: '/exams', icon: GraduationCap, roles: ['trainer', 'student_coordinator'] },
  ];

  const allowedNavItems = navItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center px-6 border-b">
        <GraduationCap className="h-6 w-6 mr-2 text-primary" />
        <span className="text-lg font-bold tracking-tight">ACTS Platform</span>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="grid gap-1 px-4">
          {allowedNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</span>
            <span className="text-xs text-muted-foreground mt-1 capitalize">{profile?.role?.replace('_', ' ')}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
