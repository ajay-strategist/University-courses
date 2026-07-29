import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Courses() {
  const dummyCourses = [
    { id: '1', code: 'CS101', name: 'Introduction to Computer Science', department: 'Computer Science', credits: 4, status: 'Active' },
    { id: '2', code: 'EE201', name: 'Digital Logic Design', department: 'Electrical Engineering', credits: 3, status: 'Active' },
    { id: '3', code: 'MA102', name: 'Engineering Mathematics II', department: 'Mathematics', credits: 4, status: 'Active' },
    { id: '4', code: 'PH101', name: 'Engineering Physics', department: 'Physics', credits: 3, status: 'Archived' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">Manage academic courses, syllabus, and assignments.</p>
        </div>
        <Button className="rounded-full shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <CardTitle>Course Directory</CardTitle>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search courses..." className="pl-9 h-9" />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyCourses.map((course) => (
                <TableRow key={course.id} className="hover:bg-muted/30">
                  <TableCell className="pl-6 font-medium">{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      course.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-400'
                    }`}>
                      {course.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm">Manage</Button>
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
