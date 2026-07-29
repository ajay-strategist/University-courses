import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShieldAlert, UserCog, Mail, Key, ExternalLink, Mailbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Users() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Profile update states
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('uct_profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Failed to load users', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function updateRole(userId: string, newRole: string) {
    try {
      const { error } = await supabase.from('uct_profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      toast.success('User role updated');
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to update role', { description: error.message });
    }
  }

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail) return;
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast.success('Confirmation email sent! Please check your inbox to verify the change.');
      setNewEmail('');
    } catch (error: any) {
      toast.error('Error updating email', { description: error.message });
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully!');
      setNewPassword('');
    } catch (error: any) {
      toast.error('Error updating password', { description: error.message });
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const isSuperAdminOrTrainer = profile?.role === 'super_admin' || profile?.role === 'trainer';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Users & Security</h2>
          <p className="text-muted-foreground">Manage application access, update your security settings, and configure roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Account Settings */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> My Security Settings</CardTitle>
            <CardDescription>Update your personal login credentials.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <form onSubmit={handleUpdateEmail} className="space-y-3">
              <Label>Update Email Address</Label>
              <div className="flex gap-2">
                <Input type="email" placeholder="new.email@example.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
                <Button type="submit" variant="secondary">Update Mail ID</Button>
              </div>
            </form>
            <hr />
            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <Label>Change Password</Label>
              <div className="flex gap-2">
                <Input type="password" placeholder="New Secure Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
                <Button type="submit" variant="secondary">Update Password</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Mail Configuration (Only Admins & Trainers) */}
        {isSuperAdminOrTrainer && (
          <Card className="border-none shadow-md bg-primary/5 border-primary/20">
            <CardHeader className="pb-3 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2 text-primary"><Mailbox className="h-5 w-5" /> Mail Server Configuration</CardTitle>
              <CardDescription>Configure SMTP settings for system emails.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm mb-4">
                System emails (like password resets and magic links) are handled directly by the Supabase authentication server. To configure a custom SMTP server (like SendGrid or AWS SES), you must use the Supabase Dashboard.
              </p>
              <Button className="w-full" onClick={() => window.open("https://supabase.com/dashboard/project/_/auth/emails", "_blank")}>
                  Open Supabase Email Settings <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <CardTitle>User Directory</CardTitle>
          {profile?.role === 'super_admin' && (
             <div className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1.5 rounded-md flex items-center gap-2 font-medium">
               <ShieldAlert className="h-4 w-4" /> To reset another user's password, use the Supabase Dashboard.
             </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="pl-6">User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead className="text-right pr-6">Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 && !isLoading && (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No users found.</TableCell></TableRow>
              )}
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user.full_name)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.full_name || 'Unnamed User'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'trainer' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'student_coordinator' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'super_admin' && <ShieldAlert className="h-3 w-3" />}
                      {user.role === 'student_coordinator' && <UserCog className="h-3 w-3" />}
                      {user.role?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                     <select 
                       value={user.role} 
                       onChange={(e) => updateRole(user.id, e.target.value)}
                       disabled={profile?.role !== 'super_admin'}
                       className="border rounded px-2 py-1 text-sm bg-background disabled:opacity-50"
                     >
                       <option value="super_admin">Super Admin</option>
                       <option value="trainer">Trainer</option>
                       <option value="student_coordinator">Student Coordinator</option>
                     </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
