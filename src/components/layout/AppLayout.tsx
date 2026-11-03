import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('uct_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('uct_sidebar_collapsed', String(next));
      } catch (e) {
        console.warn('LocalStorage save warning:', e);
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        >
          <div 
            className="fixed inset-y-0 left-0 w-[280px] z-50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isCollapsed={false} onToggle={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}
      
      <div className="flex w-full flex-col overflow-hidden min-w-0">
        <Header 
          isCollapsed={isCollapsed} 
          onToggleSidebar={toggleSidebar}
          onMobileToggle={() => setIsMobileOpen(prev => !prev)}
        />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
