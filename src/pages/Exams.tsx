import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, CalendarDays, Award } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Exams() {
  const dummyExams = [
    { id: '1', title: 'Midterm Examination', course: 'CS101', date: '2024-04-15', time: '10:00 AM - 12:00 PM', duration: '2 Hours', status: 'Upcoming' },
    { id: '2', title: 'Final Practical', course: 'EE201', date: '2024-05-20', time: '02:00 PM - 05:00 PM', duration: '3 Hours', status: 'Scheduled' },
    { id: '3', title: 'Unit Test 1', course: 'MA102', date: '2024-02-10', time: '09:00 AM - 10:00 AM', duration: '1 Hour', status: 'Completed' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Examinations</h2>
          <p className="text-muted-foreground">Schedule exams, manage invigilation, and publish results.</p>
        </div>
        <Button className="rounded-full shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Schedule Exam
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border-none shadow-sm bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Upcoming Exams</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Next exam in 15 days</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Results Published</CardTitle>
            <Award className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">For this semester</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <CardTitle>Exam Schedule</CardTitle>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search exams..." className="pl-9 h-9 rounded-full bg-muted/50 border-none" />
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
                <TableHead className="pl-6">Exam Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyExams.map((exam) => (
                <TableRow key={exam.id} className="hover:bg-muted/30">
                  <TableCell className="pl-6 font-medium">{exam.title}</TableCell>
                  <TableCell>{exam.course}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{exam.date}</span>
                      <span className="text-xs text-muted-foreground">{exam.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      exam.status === 'Completed' ? 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-400' : 
                      exam.status === 'Upcoming' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400'
                    }`}>
                      {exam.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm">Details</Button>
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
