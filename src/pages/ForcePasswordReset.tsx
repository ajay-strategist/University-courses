import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { KeyRound, Loader2, LogOut, ShieldAlert } from 'lucide-react';

export default function ForcePasswordReset() {
  const { updateUserPassword, signOut, user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Weak Password', {
        description: 'Password must be at least 6 characters.',
      });
      return;
    }

    if (newPassword === 'password') {
      toast.error('Invalid Password', {
        description: 'You cannot use the default "password" as your new password.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mismatch', {
        description: 'Passwords do not match.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateUserPassword(newPassword);
      toast.success('Success', {
        description: 'Your password has been successfully updated.',
      });
    } catch (err: any) {
      toast.error('Failed to update password', {
        description: err.message || err,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_50%)]" />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Security Action Required</h2>
          <p className="text-sm text-slate-400 max-w-xs">
            For security, please change your password from the default <span className="font-mono text-amber-400">"password"</span> before accessing the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-mono font-medium text-slate-400">Account Email</Label>
            <Input 
              id="email" 
              type="text" 
              value={user?.email || ''} 
              disabled 
              className="bg-slate-950 border-slate-800 text-slate-400 font-mono h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-xs font-mono font-medium text-slate-400">New Password</Label>
            <Input 
              id="newPassword" 
              type="password" 
              placeholder="Min 6 characters" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white h-11 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-mono font-medium text-slate-400">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="Re-enter password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white h-11 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password & Continue
              </>
            )}
          </Button>
        </form>

        <div className="border-t border-slate-800 pt-4 flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut} 
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
