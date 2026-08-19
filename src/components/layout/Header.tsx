import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { store } from '@/lib/store';
import { Menu, Bell, Search, Sun, Moon, RefreshCw, KeyRound, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function Header() {
  const { profile, signOut, updateUserPassword } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Password change states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4 lg:hidden">
        <Button variant="ghost" size="icon" className="-ml-2 text-muted-foreground hover:text-foreground">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      
      <div className="flex-1 flex items-center gap-4 max-w-md hidden md:flex">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search students, courses..." 
            className="w-full bg-muted/50 pl-9 border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 h-9 rounded-full" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-auto">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-accent" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
          title="Sync from Database — clears local cache and reloads fresh data from Supabase"
          onClick={() => {
            if (confirm('Sync from database? This will clear the local cache and reload all data fresh from Supabase.')) {
              store.clearCacheAndReload();
            }
          }}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Sync from Database</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>

        <div className="h-6 w-px bg-border/50 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full ml-1 border hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50">
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{getInitials(profile?.full_name || 'User')}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-semibold leading-none">{profile?.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground font-medium">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsPasswordModalOpen(true)} className="cursor-pointer">
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <KeyRound className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground">Change Password</h3>
              <p className="text-xs text-muted-foreground">
                Set a secure password for your account.
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (newPassword.length < 6) {
                toast.error('Weak Password', { description: 'Password must be at least 6 characters.' });
                return;
              }
              if (newPassword !== confirmPassword) {
                toast.error('Mismatch', { description: 'Passwords do not match.' });
                return;
              }
              setIsChangingPassword(true);
              try {
                await updateUserPassword(newPassword);
                toast.success('Success', { description: 'Your password has been successfully updated.' });
                setIsPasswordModalOpen(false);
                setNewPassword('');
                setConfirmPassword('');
              } catch (err: any) {
                toast.error('Failed to update password', { description: err.message || err });
              } finally {
                setIsChangingPassword(false);
              }
            }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-muted-foreground">New Password</label>
                <Input
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-background text-foreground h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-muted-foreground">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-background text-foreground h-10"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsPasswordModalOpen(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }} disabled={isChangingPassword}>Cancel</Button>
                <Button type="submit" className="bg-primary text-primary-foreground" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
