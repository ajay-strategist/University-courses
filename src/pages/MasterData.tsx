import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus } from 'lucide-react';

export default function MasterData() {
  const [activeTab, setActiveTab] = useState('colleges');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Master Data Management</h2>
        <p className="text-muted-foreground">Manage core entities like colleges, branches, and subjects.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="colleges">Colleges</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="mail">Mail Settings</TabsTrigger>
        </TabsList>

        {/* Colleges Tab */}
        <TabsContent value="colleges" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Colleges</CardTitle>
                <CardDescription>Manage all partner colleges in the system.</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add College
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search colleges..." className="pl-8" />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">COL-001</TableCell>
                      <TableCell>Engineering Institute of Tech</TableCell>
                      <TableCell>Bangalore</TableCell>
                      <TableCell>Active</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    {/* Add more placeholder rows here if needed */}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branches Tab */}
        <TabsContent value="branches" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Branches</CardTitle>
                <CardDescription>Manage academic branches (e.g., Computer Science, Mechanical).</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Branch
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search branches..." className="pl-8" />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">CSE</TableCell>
                      <TableCell>Computer Science Engineering</TableCell>
                      <TableCell>COL-001</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Subjects Tab */}
        <TabsContent value="subjects">
            <Card>
                <CardHeader>
                    <CardTitle>Subjects</CardTitle>
                    <CardDescription>Subject management coming soon.</CardDescription>
                </CardHeader>
            </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
            <Card>
                <CardHeader>
                    <CardTitle>Users & Roles</CardTitle>
                    <CardDescription>User management coming soon.</CardDescription>
                </CardHeader>
            </Card>
        </TabsContent>

        {/* Mail Settings Tab */}
        <TabsContent value="mail">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Mail Configuration</CardTitle>
              <CardDescription>Configure SMTP settings for system-automated emails.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Host</label>
                  <Input placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Port</label>
                  <Input placeholder="587" type="number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Username</label>
                  <Input placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Password</label>
                  <Input placeholder="••••••••" type="password" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Email</label>
                  <Input placeholder="noreply@university.edu" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Name (Optional)</label>
                  <Input placeholder="ACTS System" />
                </div>
              </div>
              <Button className="mt-4">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
