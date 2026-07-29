import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, GraduationCap, Users, Calendar, ArrowRight, Plus, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function Batches() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  async function fetchBatches() {
    setIsLoading(true);
    try {
      // Fetch batches along with program name, academic year, and coordinator
      const { data, error } = await supabase
        .from('uct_batches')
        .select('*, program:uct_programs(name), academic_year:uct_academic_years(name), coordinator:uct_profiles(full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // We also want to know how many students are in each batch.
      // We can do this with a separate count query or by joining uct_students.
      // For simplicity here, we will just fetch the students and group them.
      const { data: studentsData } = await supabase.from('uct_students').select('batch_id');
      
      const counts: Record<string, number> = {};
      if (studentsData) {
        studentsData.forEach(s => {
          if (s.batch_id) counts[s.batch_id] = (counts[s.batch_id] || 0) + 1;
        });
      }

      const batchesWithCounts = (data || []).map(b => ({
        ...b,
        studentCount: counts[b.id] || 0
      }));

      setBatches(batchesWithCounts);
    } catch (error: any) {
      toast.error('Failed to load batches', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Batches</h2>
          <p className="text-muted-foreground">Select a batch to manage its students, syllabus, attendance, and assessments.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">Loading batches...</div>
      ) : batches.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No batches found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Batches are the core of the system. Go to Master Data to create your first Batch.
            </p>
            <Button className="gap-2 mt-4" onClick={() => navigate('/master')}>
              <Plus className="h-4 w-4" /> New Batch
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <Card key={batch.id} className="hover:shadow-md transition-all group">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {batch.name}-{batch.program?.name}-{batch.academic_year?.name}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-1 text-xs">
                      Coordinator: <span className="font-medium text-foreground">{batch.coordinator?.full_name || 'Unassigned'}</span>
                    </CardDescription>
                  </div>
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center text-muted-foreground gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{batch.studentCount} Students</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate(`/batches/${batch.id}`)}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
