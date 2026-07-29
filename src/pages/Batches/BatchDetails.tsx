import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function BatchDetails() {
  const { id: batchId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [batch, setBatch] = useState<any>(null);
  const [syllabus, setSyllabus] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  
  // Assessments state
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [isSavingMarks, setIsSavingMarks] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', max_marks: '' });

  // Student Edit state
  const [editingStudent, setEditingStudent] = useState<any>(null);

  useEffect(() => {
    if (batchId) {
      fetchBatchDetails();
      fetchStudents();
      fetchAssignments();
    }
  }, [batchId]);

  useEffect(() => {
    if (selectedAssignment) fetchExistingMarks();
  }, [selectedAssignment]);

  async function fetchBatchDetails() {
    const { data, error } = await supabase
      .from('uct_batches')
      .select('*, program:uct_programs(name), academic_year:uct_academic_years(name), coordinator:uct_profiles(full_name)')
      .eq('id', batchId)
      .single();
    
    if (data) {
      setBatch(data);
      setSyllabus(data.syllabus || '');
    }
  }

  async function fetchStudents() {
    const { data } = await supabase.from('uct_students').select('*').eq('batch_id', batchId).order('full_name');
    if (data) setStudents(data);
  }

  async function fetchAssignments() {
    const { data } = await supabase.from('uct_assignments').select('*').eq('batch_id', batchId).order('created_at', { ascending: false });
    if (data) setAssignments(data);
    setSelectedAssignment(''); 
  }

  async function fetchExistingMarks() {
    const { data } = await supabase.from('uct_assignment_marks').select('*').eq('assignment_id', selectedAssignment);
    if (data) {
      const marksObj: Record<string, string> = {};
      data.forEach(mark => {
        marksObj[mark.student_id] = mark.marks_obtained?.toString() || '';
      });
      setMarks(marksObj);
    }
  }

  async function handleUpdateSyllabus() {
    const { error } = await supabase.from('uct_batches').update({ syllabus }).eq('id', batchId);
    if (error) toast.error('Failed to update syllabus');
    else toast.success('Syllabus updated successfully');
  }

  async function handleUpdateStudent(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('uct_students').update({
        register_number: editingStudent.register_number,
        full_name: editingStudent.full_name,
        email: editingStudent.email,
        phone: editingStudent.phone
      }).eq('id', editingStudent.id);
      
      if (error) throw error;
      toast.success('Student updated successfully');
      setEditingStudent(null);
      fetchStudents();
    } catch (error: any) {
      toast.error('Error updating student', { description: error.message });
    }
  }

  // --- Assessments Logic ---
  async function handleAddAssignment(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('uct_assignments').insert([{
        batch_id: batchId,
        title: newAssignment.title,
        max_marks: parseFloat(newAssignment.max_marks),
        created_by: profile?.id
      }]).select();
      
      if (error) throw error;
      setAssignments([data[0], ...assignments]);
      setSelectedAssignment(data[0].id);
      setIsAddAssignmentOpen(false);
      setNewAssignment({ title: '', max_marks: '' });
      toast.success('Assessment created successfully');
    } catch (error: any) {
      toast.error('Error creating assessment', { description: error.message });
    }
  }

  async function handleSaveMarks() {
    if (!selectedAssignment) return;
    setIsSavingMarks(true);
    
    try {
      const currentAssignment = assignments.find(a => a.id === selectedAssignment);
      const maxMarks = currentAssignment ? parseFloat(currentAssignment.max_marks) : 100;
      
      const upsertData = Object.entries(marks).map(([studentId, markValue]) => {
        const numValue = parseFloat(markValue);
        return {
          assignment_id: selectedAssignment,
          student_id: studentId,
          marks_obtained: isNaN(numValue) ? null : numValue,
          status: isNaN(numValue) ? 'pending' : 'submitted',
          updated_by: profile?.id
        };
      });

      const invalid = upsertData.find(d => d.marks_obtained !== null && d.marks_obtained > maxMarks);
      if (invalid) {
        toast.error(`Marks cannot exceed the maximum (${maxMarks})`);
        setIsSavingMarks(false);
        return;
      }

      if (upsertData.length > 0) {
        const { error } = await supabase.from('uct_assignment_marks').upsert(upsertData, { onConflict: 'assignment_id,student_id' });
        if (error) throw error;
        toast.success('All marks saved successfully!');
      }
    } catch (error: any) {
      toast.error('Failed to save marks', { description: error.message });
    } finally {
      setIsSavingMarks(false);
    }
  }

  if (!batch) return <div className="p-8 text-center text-muted-foreground">Loading Batch Details...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/batches')} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {batch.name}-{batch.program?.name}-{batch.academic_year?.name}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Coordinator: {batch.coordinator?.full_name || 'Unassigned'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview & Syllabus</TabsTrigger>
          <TabsTrigger value="students">Students Data</TabsTrigger>
          <TabsTrigger value="assessments">Assessments & Marks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle>Course Syllabus & Details</CardTitle>
              <CardDescription>Manage the syllabus outline and course objectives for this batch.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <textarea 
                  placeholder="Enter syllabus details, modules, or course description here..." 
                  className="w-full min-h-[300px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={syllabus}
                  onChange={(e: any) => setSyllabus(e.target.value)}
                />
                <Button onClick={handleUpdateSyllabus}><Save className="mr-2 h-4 w-4" /> Save Syllabus</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/30 pb-4 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>Batch Students</CardTitle>
                <CardDescription>Update student details like register numbers and contact info.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/students')}>
                Add Students to Batch
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="pl-6">Register Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email ID</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No students in this batch.</TableCell></TableRow>
                  )}
                  {students.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="pl-6 font-medium text-muted-foreground">{student.register_number}</TableCell>
                      <TableCell className="font-semibold">{student.full_name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phone || 'N/A'}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Dialog open={editingStudent?.id === student.id} onOpenChange={(open) => !open && setEditingStudent(null)}>
                          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 px-3" onClick={() => setEditingStudent({...student})}>
                            Edit
                          </DialogTrigger>
                          <DialogContent>
                            <form onSubmit={handleUpdateStudent}>
                              <DialogHeader>
                                <DialogTitle>Edit Student Details</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label>Register Number</Label>
                                  <Input required value={editingStudent?.register_number || ''} onChange={e => setEditingStudent({...editingStudent, register_number: e.target.value})} />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Full Name</Label>
                                  <Input required value={editingStudent?.full_name || ''} onChange={e => setEditingStudent({...editingStudent, full_name: e.target.value})} />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Email ID</Label>
                                  <Input type="email" required value={editingStudent?.email || ''} onChange={e => setEditingStudent({...editingStudent, email: e.target.value})} />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Phone Number</Label>
                                  <Input value={editingStudent?.phone || ''} onChange={e => setEditingStudent({...editingStudent, phone: e.target.value})} />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                <div className="space-y-2 w-full max-w-sm">
                  <Label>Select Assessment</Label>
                  <div className="flex gap-2">
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={selectedAssignment}
                      onChange={e => setSelectedAssignment(e.target.value)}
                    >
                      <option value="" disabled>Select Assessment...</option>
                      {assignments.map(a => <option key={a.id} value={a.id}>{a.title} (Max: {a.max_marks})</option>)}
                    </select>
                    
                    <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
                      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9">
                        <Plus className="h-4 w-4" />
                      </DialogTrigger>
                      <DialogContent>
                        <form onSubmit={handleAddAssignment}>
                          <DialogHeader>
                            <DialogTitle>New Assessment</DialogTitle>
                            <DialogDescription>Create a new assignment or exam for this batch.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label>Assessment Title</Label>
                              <Input required value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} placeholder="e.g. Midterm Exam" />
                            </div>
                            <div className="grid gap-2">
                              <Label>Maximum Marks</Label>
                              <Input type="number" required value={newAssignment.max_marks} onChange={e => setNewAssignment({...newAssignment, max_marks: e.target.value})} placeholder="100" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Create</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <Button onClick={handleSaveMarks} disabled={!selectedAssignment || students.length === 0 || isSavingMarks}>
                  <Save className="mr-2 h-4 w-4" /> 
                  {isSavingMarks ? 'Saving...' : 'Save All Marks'}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {students.length === 0 ? (
                 <div className="flex items-center justify-center py-10"><p className="text-muted-foreground">No students enrolled in this batch.</p></div>
              ) : !selectedAssignment ? (
                 <div className="flex items-center justify-center py-10"><p className="text-muted-foreground">Please select or create an assessment to enter marks.</p></div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/10">
                    <TableRow>
                      <TableHead className="pl-6 w-16">#</TableHead>
                      <TableHead>Register Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="w-48">Marks Obtained</TableHead>
                      <TableHead className="w-32">Max Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => {
                      const currentAssignment = assignments.find(a => a.id === selectedAssignment);
                      const maxMarks = currentAssignment?.max_marks || 0;
                      const currentMark = marks[student.id] || '';
                      
                      return (
                        <TableRow key={student.id} className="hover:bg-transparent">
                          <TableCell className="pl-6 text-muted-foreground">{index + 1}</TableCell>
                          <TableCell className="font-medium text-muted-foreground">{student.register_number}</TableCell>
                          <TableCell className="font-semibold">{student.full_name}</TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              placeholder="-" 
                              value={currentMark}
                              onChange={(e) => setMarks(prev => ({ ...prev, [student.id]: e.target.value }))}
                              className="h-9 w-24"
                              min="0"
                              max={maxMarks}
                              step="0.5"
                            />
                          </TableCell>
                          <TableCell className="text-muted-foreground">/ {maxMarks}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
