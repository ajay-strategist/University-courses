import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Students() {
  const dummyStudents = [
    { id: '1', register: 'REG2024001', name: 'Alex Johnson', email: 'alex.j@university.edu', phone: '+1 234 567 8900', program: 'B.Tech CS', batch: '2024-2028', status: 'Active' },
    { id: '2', register: 'REG2024002', name: 'Maria Garcia', email: 'maria.g@university.edu', phone: '+1 234 567 8901', program: 'B.Tech CS', batch: '2024-2028', status: 'Active' },
    { id: '3', register: 'REG2024003', name: 'James Smith', email: 'james.s@university.edu', phone: '+1 234 567 8902', program: 'B.Tech EE', batch: '2024-2028', status: 'On Leave' },
    { id: '4', register: 'REG2024004', name: 'Linda Chen', email: 'linda.c@university.edu', phone: '+1 234 567 8903', program: 'B.Tech ME', batch: '2024-2028', status: 'Active' },
  ];

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
          <Button className="rounded-full shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Button>
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
              {dummyStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary">{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{student.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">{student.register}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {student.email}</div>
                      <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {student.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{student.program}</span>
                      <span className="text-xs text-muted-foreground">{student.batch}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      student.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
