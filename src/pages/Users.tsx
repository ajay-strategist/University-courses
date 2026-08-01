import { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import type { Profile, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Shield, Plus, Trash2, Mail, Phone, UserCheck, KeyRound, FileSpreadsheet, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([...store.profiles]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // null = create, id = edit
  const [form, setForm] = useState<{ full_name: string; email: string; phone: string; role: UserRole }>({
    full_name: '',
    email: '',
    phone: '',
    role: 'trainer',
  });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        await store.init();
        setProfiles([...store.profiles]);
      } catch (err: any) {
        toast.error('Failed to load user profiles', { description: err.message });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ full_name: '', email: '', phone: '', role: 'trainer' });
    setShowModal(true);
  };

  const openEditModal = (p: Profile) => {
    setEditingId(p.id);
    setForm({ full_name: p.full_name, email: p.email, phone: p.phone || '', role: p.role });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ full_name: '', email: '', phone: '', role: 'trainer' });
  };

  // ── CREATE new user ──────────────────────────────────────────────
  const handleCreateUser = async () => {
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
      closeModal();
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
      closeModal();
      toast.success(`User ${newUser.full_name} created locally (Demo Mode).`);
    }
  };

  // ── UPDATE existing user ─────────────────────────────────────────
  const handleUpdateUser = async () => {
    if (!form.full_name) {
      toast.error('Name is required');
      return;
    }
    if (!editingId) return;

    const existing = store.profiles.find(p => p.id === editingId);
    if (!existing) return;

    const updated: Profile = {
      ...existing,
      full_name: form.full_name,
      phone: form.phone,
      role: form.role,
    };

    // Update in store + Supabase
    await store.saveProfile(updated);

    // Also update role in Supabase auth metadata via RPC if not a local demo user
    if (!editingId.startsWith('usr-')) {
      try {
        const { error } = await supabase.rpc('admin_update_user_role', {
          target_user_id: editingId,
          new_role: form.role,
        });
        if (error) console.warn('Role update RPC error (non-fatal):', error.message);
      } catch (e) {
        console.warn('admin_update_user_role not available, profile saved only:', e);
      }
    }

    setProfiles([...store.profiles]);
    closeModal();
    toast.success(`${updated.full_name} updated successfully.`);
  };

  const handleSave = () => (editingId ? handleUpdateUser() : handleCreateUser());

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
          <h1 className="text-2xl font-bold font-heading text-foreground">Users &amp; Role Administration</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts and assign permissions for Admins, Trainers, Student Coordinators, and College Coordinators.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/import-center/bulk')} variant="outline" className="text-xs">
            <FileSpreadsheet className="h-4 w-4 mr-2 text-primary" /> Bulk Data Migration
          </Button>
          <Button onClick={openAddModal} className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Add User Account
          </Button>
        </div>
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
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                  Loading user accounts...
                </td>
              </tr>
            ) : profiles.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                  No user accounts found.
                </td>
              </tr>
            ) : (
              profiles.map((p) => (
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
                    {/* Edit */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit user"
                      className="h-8 w-8 text-primary hover:bg-primary/10"
                      onClick={() => openEditModal(p)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    {/* Reset Password */}
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

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete user"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={async () => {
                        if (!confirm(`Delete user "${p.full_name}"? This cannot be undone.`)) return;
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT USER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">
              {editingId ? 'Edit User' : 'Add User Account'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Full Name</label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Dr. Jane Smith"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">
                  Email Address {editingId && <span className="text-muted-foreground/60">(cannot be changed)</span>}
                </label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane.smith@university.edu"
                  className="mt-1 font-mono"
                  disabled={!!editingId}
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Phone Number</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="mt-1 font-mono"
                />
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
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                {editingId ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
