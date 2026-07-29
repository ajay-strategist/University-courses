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

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [studentsRes, batchesRes] = await Promise.all([
        supabase.from('uct_students').select('*, batch:uct_batches(name, program:uct_programs(name))').order('created_at', { ascending: false }),
        supabase.from('uct_batches').select('*, program:uct_programs(name)').order('created_at', { ascending: false })
      ]);

      if (studentsRes.error) throw studentsRes.error;
      if (batchesRes.error) throw batchesRes.error;

      setStudents(studentsRes.data || []);
      setBatches(batchesRes.data || []);
    } catch (error: any) {
      toast.error('Failed to load students data', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('uct_students').insert([newStudent]).select('*, batch:uct_batches(name, program:uct_programs(name))');
      if (error) throw error;
      setStudents([data[0], ...students]);
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
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">Manage student enrollments, profiles, and academic records.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shadow-sm">
            Import CSV
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> Add Student
              </Button>
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
                    <Input id="email" type="email" required value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} placeholder="student@university.edu" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={newStudent.phone} onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})} placeholder="+1 234 567 890" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Batch Assignment</Label>
                      <Select value={newStudent.batch_id} onValueChange={(val) => setNewStudent({...newStudent, batch_id: val})} required>
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
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>View Attendance</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
