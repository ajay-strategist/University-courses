import { useState } from 'react';
import { store } from '@/lib/store';
import type { Profile, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Shield, Plus, Trash2, Mail, Phone, UserCheck, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Users() {
  const [profiles, setProfiles] = useState<Profile[]>([...store.profiles]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{ full_name: string; email: string; phone: string; role: UserRole }>({
    full_name: '',
    email: '',
    phone: '',
    role: 'trainer',
  });

  const handleSaveUser = async () => {
    if (!form.full_name || !form.email) {
      toast.error('Name and Email are required');
      return;
    }

    try {
      const { data: newUserId, error } = await supabase.rpc('admin_create_user', {
        p_email: form.email,
        p_full_name: form.full_name,
        p_phone: form.phone || null,
        p_role: form.role,
      });

      if (error) throw error;

      const newUser: Profile = {
        id: newUserId,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        must_change_password: true,
      };

      await store.saveProfile(newUser);
      setProfiles([...store.profiles]);
      setShowModal(false);
      setForm({ full_name: '', email: '', phone: '', role: 'trainer' });
      toast.success(`User ${newUser.full_name} created. Default password is "password".`);
    } catch (err: any) {
      console.warn('Failed to create user on Supabase:', err);
      // Fallback for offline/demo mode
      const newUser: Profile = {
        id: `usr-${Date.now()}`,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        must_change_password: true,
      };
      await store.saveProfile(newUser);
      setProfiles([...store.profiles]);
      setShowModal(false);
      setForm({ full_name: '', email: '', phone: '', role: 'trainer' });
      toast.success(`User ${newUser.full_name} created locally (Demo Mode).`);
    }
  };

  const roleBadges: Record<UserRole, string> = {
    admin: 'bg-accent/15 text-accent border-accent/30',
    trainer: 'bg-primary-tint text-primary border-primary/30',
    student_coordinator: 'bg-success/15 text-success border-success/30',
    college_coordinator: 'bg-warning/15 text-warning border-warning/30',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Users & Role Administration</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts and assign permissions for Admins, Trainers, Student Coordinators, and College Coordinators.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Add User Account
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
            <tr>
              <th className="p-4">User Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Role</th>
              <th className="p-4">Phone</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {profiles.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  {p.full_name}
                </td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{p.email}</td>
                <td className="p-4">
                  <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${roleBadges[p.role]}`}>
                    {p.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{p.phone || '—'}</td>
                <td className="p-4 text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Reset password to default ('password')"
                    className="h-8 w-8 text-amber-500 hover:bg-amber-500/10"
                    onClick={async () => {
                      try {
                        const { error } = await supabase.rpc('reset_user_password', {
                          target_user_id: p.id
                        });
                        if (error) throw error;
                        toast.success(`Password for ${p.full_name} has been reset to "password".`);
                      } catch (err: any) {
                        toast.error('Failed to reset password', { description: err.message || err });
                      }
                    }}
                  >
                    <KeyRound className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={async () => {
                      try {
                        await store.deleteProfile(p.id);
                        setProfiles([...store.profiles]);
                        toast.success('User removed');
                      } catch (err: any) {
                        console.warn('Failed to delete user:', err);
                        toast.error('Failed to delete user');
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD USER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">Add User Account</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Full Name</label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Dr. Jane Smith" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Email Address</label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane.smith@university.edu" className="mt-1 font-mono" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Phone Number</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555-0199" className="mt-1 font-mono" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="trainer">Trainer</option>
                  <option value="student_coordinator">Student Coordinator</option>
                  <option value="college_coordinator">College Coordinator</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSaveUser} className="bg-primary text-primary-foreground">Save User</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
