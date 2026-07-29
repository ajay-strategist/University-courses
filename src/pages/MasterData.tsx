import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function MasterData() {
  const [activeTab, setActiveTab] = useState('programs');
  
  // Data states
  const [programs, setPrograms] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({ name: '', code: '' });

  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [newYear, setNewYear] = useState({ name: '', start_date: '', end_date: '' });

  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({ name: '', program_id: '', academic_year_id: '' });

  useEffect(() => {
    fetchMasterData();
  }, []);

  async function fetchMasterData() {
    setIsLoading(true);
    try {
      const [programsRes, yearsRes, batchesRes] = await Promise.all([
        supabase.from('uct_programs').select('*').order('created_at', { ascending: false }),
        supabase.from('uct_academic_years').select('*').order('start_date', { ascending: false }),
        supabase.from('uct_batches').select('*, program:uct_programs(name), year:uct_academic_years(name)').order('created_at', { ascending: false })
      ]);

      if (programsRes.error) throw programsRes.error;
      if (yearsRes.error) throw yearsRes.error;
      if (batchesRes.error) throw batchesRes.error;

      setPrograms(programsRes.data || []);
      setAcademicYears(yearsRes.data || []);
      setBatches(batchesRes.data || []);
    } catch (error: any) {
      toast.error('Failed to load master data', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddProgram(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('uct_programs').insert([newProgram]).select();
      if (error) throw error;
      setPrograms([data[0], ...programs]);
      setIsProgramModalOpen(false);
      setNewProgram({ name: '', code: '' });
      toast.success('Program added successfully');
    } catch (error: any) {
      toast.error('Error adding program', { description: error.message });
    }
  }

  async function handleAddYear(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('uct_academic_years').insert([newYear]).select();
      if (error) throw error;
      setAcademicYears([data[0], ...academicYears]);
      setIsYearModalOpen(false);
      setNewYear({ name: '', start_date: '', end_date: '' });
      toast.success('Academic Year added successfully');
    } catch (error: any) {
      toast.error('Error adding academic year', { description: error.message });
    }
  }

  async function handleAddBatch(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('uct_batches').insert([newBatch]).select('*, program:uct_programs(name), year:uct_academic_years(name)');
      if (error) throw error;
      setBatches([data[0], ...batches]);
      setIsBatchModalOpen(false);
      setNewBatch({ name: '', program_id: '', academic_year_id: '' });
      toast.success('Batch added successfully');
    } catch (error: any) {
      toast.error('Error adding batch', { description: error.message });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Master Data Management</h2>
        <p className="text-muted-foreground">Manage core entities like programs, academic years, and batches.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="years">Academic Years</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
        </TabsList>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Programs</CardTitle>
                <CardDescription>Manage academic programs (e.g., B.Tech CS, MBA).</CardDescription>
              </div>
              <Dialog open={isProgramModalOpen} onOpenChange={setIsProgramModalOpen}>
                <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Program
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAddProgram}>
                    <DialogHeader>
                      <DialogTitle>Add New Program</DialogTitle>
                      <DialogDescription>Enter the details for the new academic program.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="prog-name">Name</Label>
                        <Input id="prog-name" required value={newProgram.name} onChange={(e) => setNewProgram({...newProgram, name: e.target.value})} placeholder="e.g. B.Tech Computer Science" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="prog-code">Code</Label>
                        <Input id="prog-code" required value={newProgram.code} onChange={(e) => setNewProgram({...newProgram, code: e.target.value})} placeholder="e.g. BTECH-CS" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Program</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.length === 0 && !isLoading && (
                      <TableRow><TableCell colSpan={3} className="text-center py-4 text-muted-foreground">No programs found.</TableCell></TableRow>
                    )}
                    {programs.map(prog => (
                      <TableRow key={prog.id}>
                        <TableCell className="font-medium">{prog.code}</TableCell>
                        <TableCell>{prog.name}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Years Tab */}
        <TabsContent value="years" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Academic Years</CardTitle>
                <CardDescription>Manage academic timelines (e.g., 2024-2025).</CardDescription>
              </div>
              <Dialog open={isYearModalOpen} onOpenChange={setIsYearModalOpen}>
                <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Year
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAddYear}>
                    <DialogHeader>
                      <DialogTitle>Add Academic Year</DialogTitle>
                      <DialogDescription>Define a new academic year period.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="year-name">Name</Label>
                        <Input id="year-name" required value={newYear.name} onChange={(e) => setNewYear({...newYear, name: e.target.value})} placeholder="e.g. 2024-2025" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input id="start-date" type="date" required value={newYear.start_date} onChange={(e) => setNewYear({...newYear, start_date: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="end-date">End Date</Label>
                          <Input id="end-date" type="date" required value={newYear.end_date} onChange={(e) => setNewYear({...newYear, end_date: e.target.value})} />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Year</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academicYears.length === 0 && !isLoading && (
                      <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No academic years found.</TableCell></TableRow>
                    )}
                    {academicYears.map(yr => (
                      <TableRow key={yr.id}>
                        <TableCell className="font-medium">{yr.name}</TableCell>
                        <TableCell>{new Date(yr.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(yr.end_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Batches Tab */}
        <TabsContent value="batches" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Batches</CardTitle>
                <CardDescription>Manage student batches mapping to programs and years.</CardDescription>
              </div>
              <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
                <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Batch
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAddBatch}>
                    <DialogHeader>
                      <DialogTitle>Add New Batch</DialogTitle>
                      <DialogDescription>Create a new batch (e.g. CS-2024).</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="batch-name">Batch Name</Label>
                        <Input id="batch-name" required value={newBatch.name} onChange={(e) => setNewBatch({...newBatch, name: e.target.value})} placeholder="e.g. CS-Batch-A-2024" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Program</Label>
                        <Select value={newBatch.program_id} onValueChange={(val) => setNewBatch({...newBatch, program_id: val || ''})} required>
                          <SelectTrigger><SelectValue placeholder="Select Program" /></SelectTrigger>
                          <SelectContent>
                            {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Academic Year</Label>
                        <Select value={newBatch.academic_year_id} onValueChange={(val) => setNewBatch({...newBatch, academic_year_id: val || ''})} required>
                          <SelectTrigger><SelectValue placeholder="Select Academic Year" /></SelectTrigger>
                          <SelectContent>
                            {academicYears.map(y => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Batch</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Name</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.length === 0 && !isLoading && (
                      <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No batches found.</TableCell></TableRow>
                    )}
                    {batches.map(batch => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.name}</TableCell>
                        <TableCell>{batch.program?.name || 'N/A'}</TableCell>
                        <TableCell>{batch.year?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
