import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, Bell, Search, Sun, Moon, Palette } from 'lucide-react';
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

export function Header() {
  const { profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : theme === 'desert-teal' ? (
                <Palette className="h-4 w-4 text-primary" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle Theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuLabel className="text-xs font-mono font-medium text-muted-foreground">Select Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme('light')} className={`cursor-pointer ${theme === 'light' ? 'font-bold text-primary bg-muted/40' : ''}`}>
                <Sun className="h-4 w-4 mr-2" /> Light Theme
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className={`cursor-pointer ${theme === 'dark' ? 'font-bold text-primary bg-muted/40' : ''}`}>
                <Moon className="h-4 w-4 mr-2" /> Dark Theme
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('desert-teal')} className={`cursor-pointer ${theme === 'desert-teal' ? 'font-bold text-primary bg-muted/40' : ''}`}>
                <Palette className="h-4 w-4 mr-2 text-primary" /> Desert Teal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
            <DropdownMenuItem className="cursor-pointer">
              Profile Settings
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
    </header>
  );
}
