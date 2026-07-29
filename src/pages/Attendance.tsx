import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarIcon, Save } from 'lucide-react';

export default function Attendance() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Mock students data
  const students = [
    { id: 'STU-001', name: 'Alice Johnson', rollNo: '101' },
    { id: 'STU-002', name: 'Bob Smith', rollNo: '102' },
    { id: 'STU-003', name: 'Charlie Brown', rollNo: '103' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Attendance Module</h2>
        <p className="text-muted-foreground">Mark and track student attendance for your courses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Select a course and date to mark attendance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CS101">Introduction to Computer Science (CS101)</SelectItem>
                  <SelectItem value="MTH201">Advanced Calculus (MTH201)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <div className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent outline-none flex-1"
                />
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </div>
            </div>
          </div>

          {selectedCourse && (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-right">Present</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-right">
                          <Checkbox defaultChecked className="ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" /> Save Attendance
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
