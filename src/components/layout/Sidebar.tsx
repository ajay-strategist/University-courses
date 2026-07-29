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
  Settings,
  ChevronRight,
  ShieldAlert,
  PenTool
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['super_admin', 'trainer', 'student_coordinator'] },
    { name: 'Master Data', path: '/master', icon: Settings, roles: ['super_admin'] },
    { name: 'Courses', path: '/courses', icon: BookOpen, roles: ['super_admin', 'trainer'] },
    { name: 'Students', path: '/students', icon: Users, roles: ['super_admin', 'student_coordinator'] },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck, roles: ['super_admin', 'student_coordinator'] },
    { name: 'Assessments (Fast Entry)', path: '/assessments', icon: PenTool, roles: ['super_admin', 'trainer', 'student_coordinator'] },
    { name: 'Assignments', path: '/assignments', icon: ClipboardList, roles: ['trainer', 'student_coordinator'] },
    { name: 'Exams', path: '/exams', icon: GraduationCap, roles: ['trainer', 'student_coordinator'] },
  ];

  const allowedNavItems = navItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="flex h-full w-[280px] flex-col border-r bg-card/50 backdrop-blur-xl text-card-foreground shadow-sm">
      <div className="flex h-16 items-center px-6 border-b border-border/50 bg-background/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm mr-3">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">ACTS Platform</span>
      </div>
      
      <div className="flex-1 py-6 overflow-y-auto px-4">
        <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          Main Menu
        </div>
        <nav className="grid gap-1.5">
          {allowedNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border/50 p-4 bg-muted/20">
        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-background border shadow-sm">
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {getInitials(profile?.full_name || 'User')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold truncate leading-tight">{profile?.full_name || 'User'}</span>
            <span className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
              {profile?.role === 'super_admin' && <ShieldAlert className="h-3 w-3 text-amber-500" />}
              {profile?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive/90 transition-colors hover:bg-destructive/10 hover:text-destructive mt-1"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
