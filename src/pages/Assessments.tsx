import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Save, Plus, FileSpreadsheet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function Assessments() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', max_marks: '' });

  // 1. Fetch all courses
  useEffect(() => {
    async function fetchCourses() {
      const { data } = await supabase.from('uct_courses').select('*').order('name');
      if (data) setCourses(data);
    }
    fetchCourses();
  }, []);

  // 2. When course changes, fetch assignments and students
  useEffect(() => {
    if (!selectedCourse) return;
    fetchAssignments();
    fetchStudents();
  }, [selectedCourse]);

  // 3. When assignment changes, fetch existing marks
  useEffect(() => {
    if (!selectedAssignment) return;
    fetchExistingMarks();
  }, [selectedAssignment]);

  async function fetchAssignments() {
    const { data } = await supabase.from('uct_assignments').select('*').eq('course_id', selectedCourse).order('created_at', { ascending: false });
    if (data) setAssignments(data);
    setSelectedAssignment(''); // reset
  }

  async function fetchStudents() {
    setIsLoading(true);
    try {
      // First, get all batch_ids assigned to this course
      const { data: assignmentsData } = await supabase.from('uct_course_assignments').select('batch_id').eq('course_id', selectedCourse);
      
      if (!assignmentsData || assignmentsData.length === 0) {
        setStudents([]);
        return;
      }
      
      const batchIds = assignmentsData.map(a => a.batch_id);
      
      // Then get all students in those batches
      const { data: studentsData } = await supabase.from('uct_students')
        .select('*')
        .in('batch_id', batchIds)
        .order('full_name');
        
      setStudents(studentsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

  const handleMarkChange = (studentId: string, value: string) => {
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  async function handleSaveMarks() {
    if (!selectedAssignment) return;
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const currentAssignment = assignments.find(a => a.id === selectedAssignment);
      const maxMarks = currentAssignment ? parseFloat(currentAssignment.max_marks) : 100;
      
      const upsertData = Object.entries(marks).map(([studentId, markValue]) => {
        const numValue = parseFloat(markValue);
        return {
          assignment_id: selectedAssignment,
          student_id: studentId,
          marks_obtained: isNaN(numValue) ? null : numValue,
          status: isNaN(numValue) ? 'pending' : 'submitted',
          updated_by: user?.id
        };
      });

      // Filter out invalid or excessive marks
      const invalid = upsertData.find(d => d.marks_obtained !== null && d.marks_obtained > maxMarks);
      if (invalid) {
        toast.error(`Marks cannot exceed the maximum (${maxMarks})`);
        setIsSaving(false);
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
      setIsSaving(false);
    }
  }

  async function handleAddAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourse) return toast.error('Select a course first');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from('uct_assignments').insert([{
        course_id: selectedCourse,
        title: newAssignment.title,
        max_marks: parseFloat(newAssignment.max_marks),
        created_by: user?.id
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assessments & Marks</h2>
          <p className="text-muted-foreground">Fast bulk-entry grid for recording student marks.</p>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>1. Select Course</Label>
              <Select value={selectedCourse} onValueChange={(val) => val && setSelectedCourse(val)}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select Course..." /></SelectTrigger>
                <SelectContent>
                  {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>2. Select Assessment</Label>
              <div className="flex gap-2">
                <Select value={selectedAssignment} onValueChange={(val) => val && setSelectedAssignment(val)} disabled={!selectedCourse}>
                  <SelectTrigger className="bg-background flex-1"><SelectValue placeholder="Select Assessment..." /></SelectTrigger>
                  <SelectContent>
                    {assignments.length === 0 && <SelectItem value="none" disabled>No assessments found</SelectItem>}
                    {assignments.map(a => <SelectItem key={a.id} value={a.id}>{a.title} (Max: {a.max_marks})</SelectItem>)}
                  </SelectContent>
                </Select>
                
                <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
                  <DialogTrigger disabled={!selectedCourse} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9">
                    <Plus className="h-4 w-4" />
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleAddAssignment}>
                      <DialogHeader>
                        <DialogTitle>New Assessment</DialogTitle>
                        <DialogDescription>Create a new assignment or exam for this course.</DialogDescription>
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
            
            <div className="space-y-2 flex flex-col justify-end">
               <Button onClick={handleSaveMarks} disabled={!selectedAssignment || students.length === 0 || isSaving} className="w-full">
                 <Save className="mr-2 h-4 w-4" /> 
                 {isSaving ? 'Saving...' : 'Save All Marks'}
               </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {!selectedCourse ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <FileSpreadsheet className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a course and assessment to enter marks.</p>
            </div>
          ) : isLoading ? (
             <div className="flex items-center justify-center py-10"><p className="text-muted-foreground">Loading students...</p></div>
          ) : students.length === 0 ? (
             <div className="flex items-center justify-center py-10"><p className="text-muted-foreground">No students enrolled in this course.</p></div>
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
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
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
    </div>
  );
}
