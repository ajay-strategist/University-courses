import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase';
import { store } from '@/lib/store';
import { toast } from 'sonner';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    register_number: '',
    full_name: '',
    email: '',
    phone: '',
    batch_id: ''
  });

  // Edit/Delete State
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to delete student "${studentName}"?`)) return;
    try {
      await store.deleteStudent(studentId);
      setStudents(students.filter(s => s.id !== studentId));
      toast.success(`Student ${studentName} deleted successfully`);
    } catch (err: any) {
      toast.error('Failed to delete student', { description: err.message });
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const saved = await store.saveStudent({
        id: editingStudent.id,
        batch_id: editingStudent.batch_id,
        register_no: editingStudent.register_number || editingStudent.register_no,
        name: editingStudent.full_name || editingStudent.name,
        class: editingStudent.class || 'Div A',
        phone: editingStudent.phone || '',
      });

      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...saved, register_number: saved.register_no, full_name: saved.name } : s));
      setIsEditOpen(false);
      toast.success('Student details updated successfully!');
    } catch (err: any) {
      toast.error('Failed to update student', { description: err.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      await store.init();
      setStudents(store.students as any[]);
      setBatches(store.batches as any[]);
    } catch (error: any) {
      toast.error('Failed to load students data', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    try {
      const saved = await store.saveStudent({
        batch_id: newStudent.batch_id,
        register_no: newStudent.register_number || '',
        name: newStudent.full_name || '',
        class: 'Div A',
        phone: newStudent.phone || '',
      });
      setStudents([saved as any, ...students]);
      setIsAddOpen(false);
      setNewStudent({ register_number: '', full_name: '', email: '', phone: '', batch_id: '' });
      toast.success('Student added successfully');
    } catch (error: any) {
      toast.error('Error adding student', { description: error.message });
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Master Students Data</h2>
          <p className="text-muted-foreground">Master directory of all registered students.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shadow-sm">
            Import CSV
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-full shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddStudent}>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Register a new student into the system.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="reg-no">Register Number</Label>
                      <Input id="reg-no" required value={newStudent.register_number} onChange={(e) => setNewStudent({...newStudent, register_number: e.target.value})} placeholder="e.g. REG2024001" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" required value={newStudent.full_name} onChange={(e) => setNewStudent({...newStudent, full_name: e.target.value})} placeholder="e.g. John Doe" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} placeholder="student@example.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={newStudent.phone} onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})} placeholder="+1 234 567 890" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Batch Assignment</Label>
                      <Select value={newStudent.batch_id} onValueChange={(val) => setNewStudent({...newStudent, batch_id: val || ''})} required>
                        <SelectTrigger><SelectValue placeholder="Select Batch" /></SelectTrigger>
                        <SelectContent>
                          {batches.map(b => (
                            <SelectItem key={b.id} value={b.id}>{b.name} ({b.program?.name})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Student</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <CardTitle>Student Directory</CardTitle>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search by name, reg no..." className="pl-9 h-9 rounded-full bg-muted/50 border-none" />
              </div>
              <Button variant="outline" size="sm" className="h-9 rounded-full">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="pl-6">Student</TableHead>
                <TableHead>Register No.</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Program & Batch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 && !isLoading && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No students found. Add one to get started.</TableCell></TableRow>
              )}
              {students.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary">{student.full_name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{student.full_name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">{student.register_number}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {student.email}</div>
                      {student.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {student.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{student.batch?.program?.name || 'N/A'}</span>
                      <span className="text-xs text-muted-foreground">{student.batch?.name || 'Unassigned'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      student.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {student.status || 'active'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setEditingStudent({ ...student });
                          setIsEditOpen(true);
                        }}>
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteStudent(student.id, student.full_name || student.name)} className="text-destructive font-semibold">
                          Delete Student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* EDIT STUDENT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <form onSubmit={handleUpdateStudent}>
            <DialogHeader>
              <DialogTitle>Edit Student Details</DialogTitle>
              <DialogDescription>Modify register number, full name, or phone details.</DialogDescription>
            </DialogHeader>
            {editingStudent && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Register Number</Label>
                    <Input 
                      required 
                      value={editingStudent.register_number || editingStudent.register_no || ''} 
                      onChange={(e) => setEditingStudent({ ...editingStudent, register_number: e.target.value, register_no: e.target.value })} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Full Name</Label>
                    <Input 
                      required 
                      value={editingStudent.full_name || editingStudent.name || ''} 
                      onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value, name: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Phone Number</Label>
                  <Input 
                    value={editingStudent.phone || ''} 
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })} 
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
