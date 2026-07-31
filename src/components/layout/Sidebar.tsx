import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  FileSpreadsheet,
  Mail,
  BarChart3,
  Users,
  LogOut,
  ChevronRight,
  Shield,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { UserRole } from '@/types';

export function Sidebar() {
  const { profile, setRole, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: LayoutDashboard, 
      roles: ['admin', 'trainer', 'student_coordinator', 'college_coordinator'] 
    },
    { 
      name: 'Masters', 
      path: '/masters', 
      icon: Settings, 
      roles: ['admin'] 
    },
    { 
      name: 'Batches', 
      path: '/batches', 
      icon: BookOpen, 
      roles: ['admin', 'trainer', 'student_coordinator', 'college_coordinator'] 
    },
    { 
      name: 'Import Center', 
      path: '/import-center', 
      icon: FileSpreadsheet, 
      roles: ['admin', 'trainer', 'student_coordinator'] 
    },
    { 
      name: 'Email & Notifications', 
      path: '/notifications', 
      icon: Mail, 
      roles: ['admin', 'trainer'] 
    },
    { 
      name: 'Reports (Power BI)', 
      path: '/reports', 
      icon: BarChart3, 
      roles: ['admin', 'trainer', 'student_coordinator', 'college_coordinator'] 
    },
    { 
      name: 'Users & Admin', 
      path: '/users', 
      icon: Users, 
      roles: ['admin'] 
    },
  ];

  const allowedNavItems = navItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const roleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    trainer: 'Trainer',
    student_coordinator: 'Student Coordinator',
    college_coordinator: 'College Coordinator',
  };

  return (
    <div className="flex h-full w-[280px] flex-col border-r border-[#0C2723] bg-[#123A34] dark:bg-[#12241F] text-[#E7EEEB] shadow-sm">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-[#0C2723]/30 bg-[#0C2723]/20">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm mr-3">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-base font-bold tracking-tight text-white leading-tight">
            Training Tracker
          </span>
          <span className="text-[11px] text-accent font-mono font-bold uppercase tracking-wider">
            Meridian Console
          </span>
        </div>
      </div>
      
      {/* Role Switcher Banner (for testing & demonstration) */}
      <div className="p-3 mx-3 mt-3 rounded-xl bg-white/5 border border-white/10 text-xs">
        <div className="flex items-center justify-between mb-1.5 font-semibold text-accent">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Active Role Simulator
          </span>
        </div>
        <select 
          value={profile?.role || 'admin'} 
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full bg-[#0C2723] dark:bg-[#0F1E1A] border border-white/10 rounded-lg px-2 py-1 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="admin">Admin (Full Access)</option>
          <option value="trainer">Trainer (Assigned Courses & Marks)</option>
          <option value="student_coordinator">Student Coordinator (Attendance)</option>
          <option value="college_coordinator">College Coordinator (Read-Only)</option>
        </select>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4 overflow-y-auto px-3">
        <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#E7EEEB]/60 font-mono">
          Main Navigation
        </div>
        <nav className="grid gap-1">
          {allowedNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-[#C8912E]/10 dark:bg-[#E0A94A]/10 text-accent font-bold border-l-4 border-accent pl-2" 
                    : "text-[#E7EEEB]/75 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-accent" : "text-[#E7EEEB]/60 group-hover:text-white")} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-accent/70" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-[#0C2723]/30 p-4 bg-[#0C2723]/10">
        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white/5 border border-white/10 shadow-sm">
          <Avatar className="h-9 w-9 border border-accent/30">
            <AvatarFallback className="bg-white/10 text-white font-bold">
              {getInitials(profile?.full_name || 'User')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold truncate leading-tight text-white">{profile?.full_name || 'User'}</span>
            <span className="text-xs text-accent truncate flex items-center gap-1 mt-0.5 font-mono font-bold">
              <Shield className="h-3 w-3" />
              {profile?.role ? roleLabels[profile.role] : 'Guest'}
            </span>
          </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
