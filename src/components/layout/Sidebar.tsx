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
  ShieldAlert,
  GraduationCap,
  CalendarDays,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { UserRole } from '@/types';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const { profile, signOut } = useAuth();
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
      name: 'Academic Calendar', 
      path: '/calendar', 
      icon: CalendarDays, 
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
      name: 'Student Risk', 
      path: '/risk-management', 
      icon: ShieldAlert, 
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
    <aside 
      className={cn(
        "flex h-full flex-col border-r border-[#0C2723] bg-[#123A34] dark:bg-[#12241F] text-[#E7EEEB] shadow-sm transition-all duration-300 ease-in-out shrink-0 select-none",
        isCollapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Brand Header */}
      <div 
        className={cn(
          "flex h-16 items-center border-b border-[#0C2723]/30 bg-[#0C2723]/20 transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "justify-between px-5"
        )}
      >
        <div className="flex items-center overflow-hidden">
          {isCollapsed ? (
            <button
              onClick={onToggle}
              title="Expand sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm hover:scale-105 transition-all cursor-pointer"
            >
              <GraduationCap className="h-5 w-5" />
            </button>
          ) : (
            <>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm mr-3">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col whitespace-nowrap overflow-hidden">
                <span className="font-heading text-base font-bold tracking-tight text-white leading-tight">
                  EduCore
                </span>
                <span className="text-[11px] text-accent font-mono font-bold uppercase tracking-wider">
                  KVJ Analytics
                </span>
              </div>
            </>
          )}
        </div>

        {!isCollapsed && onToggle && (
          <button
            onClick={onToggle}
            title="Collapse sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#E7EEEB]/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className={cn("flex-1 py-4 overflow-y-auto", isCollapsed ? "px-2" : "px-3")}>
        {!isCollapsed ? (
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#E7EEEB]/60 font-mono">
            Main Navigation
          </div>
        ) : (
          <div className="my-2 border-t border-white/10 mx-1" />
        )}

        <nav className="grid gap-1">
          {allowedNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "group flex items-center rounded-xl transition-all duration-200",
                  isCollapsed
                    ? cn(
                        "h-11 w-11 mx-auto justify-center",
                        isActive
                          ? "bg-accent/20 text-accent font-bold ring-1 ring-accent/40"
                          : "text-[#E7EEEB]/75 hover:bg-white/10 hover:text-white"
                      )
                    : cn(
                        "justify-between px-3 py-2.5 text-sm font-medium",
                        isActive
                          ? "bg-[#C8912E]/10 dark:bg-[#E0A94A]/10 text-accent font-bold border-l-4 border-accent pl-2"
                          : "text-[#E7EEEB]/75 hover:bg-white/5 hover:text-white"
                      )
                )}
              >
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                  <item.icon
                    className={cn(
                      "transition-colors",
                      isCollapsed ? "h-5 w-5" : "h-4 w-4",
                      isActive ? "text-accent" : "text-[#E7EEEB]/60 group-hover:text-white"
                    )}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && isActive && <ChevronRight className="h-4 w-4 text-accent/70" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Collapse Toggle Footer */}
      <div className={cn("border-t border-[#0C2723]/30 bg-[#0C2723]/10", isCollapsed ? "p-2" : "p-4")}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white/5 border border-white/10 shadow-sm">
              <Avatar className="h-9 w-9 border border-accent/30 shrink-0">
                <AvatarFallback className="bg-white/10 text-white font-bold">
                  {getInitials(profile?.full_name || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm font-semibold truncate leading-tight text-white">
                  {profile?.full_name || 'User'}
                </span>
                <span className="text-xs text-accent truncate flex items-center gap-1 mt-0.5 font-mono font-bold">
                  <Shield className="h-3 w-3" />
                  {profile?.role ? roleLabels[profile.role] : 'Guest'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => signOut()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
              {onToggle && (
                <button
                  onClick={onToggle}
                  title="Collapse side panel"
                  className="flex items-center justify-center h-8 w-8 rounded-xl text-[#E7EEEB]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <Avatar 
              className="h-9 w-9 border border-accent/30 cursor-pointer"
              title={`${profile?.full_name || 'User'} (${profile?.role ? roleLabels[profile.role] : 'Guest'})`}
            >
              <AvatarFallback className="bg-white/10 text-white font-bold text-xs">
                {getInitials(profile?.full_name || 'User')}
              </AvatarFallback>
            </Avatar>

            <button 
              onClick={() => signOut()}
              title="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>

            {onToggle && (
              <button
                onClick={onToggle}
                title="Expand side panel"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-accent hover:bg-white/10 transition-colors cursor-pointer"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
