import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
import type { Batch } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Users, BookOpen, ChevronRight, Sparkles, Building2, Calendar, Award } from 'lucide-react';

export default function BatchesGrid() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>(
    store.batches.map(b => store.getBatchWithDetails(b.id)!)
  );

  // New Batch Modal State
  const [showModal, setShowModal] = useState(false);
  const [collegeId, setCollegeId] = useState(store.colleges[0]?.id || '');
  const [programId, setProgramId] = useState(store.programs[0]?.id || '');
  const [academicYear, setAcademicYear] = useState('2026-29');
  const [currentSemester, setCurrentSemester] = useState(1);
  const [collegeCoordId, setCollegeCoordId] = useState(store.profiles.find(p => p.role === 'college_coordinator')?.id || '');
  const [studentCoordId, setStudentCoordId] = useState(store.profiles.find(p => p.role === 'student_coordinator')?.id || '');
  const [startDate, setStartDate] = useState('2026-01-10');
  const [endDate, setEndDate] = useState('2026-06-30');

  // Derive auto batch code
  const selectedCollege = store.colleges.find(c => c.id === collegeId);
  const selectedProgram = store.programs.find(p => p.id === programId);
  const autoBatchCode = `${selectedCollege?.code || 'COL'}-${selectedProgram?.code || 'PROG'}-${academicYear}`;

  const handleCreateBatch = () => {
    if (!selectedCollege || !selectedProgram || !academicYear) {
      toast.error('Please fill all required fields');
      return;
    }

    const newBatch: Batch = {
      id: `bat-${Date.now()}`,
      code: autoBatchCode,
      college_id: collegeId,
      program_id: programId,
      academic_year: academicYear,
      current_semester: currentSemester,
      college_coordinator_id: collegeCoordId,
      student_coordinator_id: studentCoordId,
      status: 'Active',
      start_date: startDate,
      end_date: endDate,
    };

    store.batches.push(newBatch);
    setBatches(store.batches.map(b => store.getBatchWithDetails(b.id)!));
    setShowModal(false);
    toast.success(`Batch ${autoBatchCode} created successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Training Cohort Batches</h1>
          <p className="text-sm text-muted-foreground">Manage college training batches, course allocations, student rosters, and performance metrics.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> New Batch
        </Button>
      </div>

      {/* Batches Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => {
          const coveragePct = batch.avg_coverage_pct || 0;
          const attendancePct = batch.avg_attendance_pct || 0;

          return (
            <div
              key={batch.id}
              onClick={() => navigate(`/batches/${batch.id}`)}
              className="card-meridian relative overflow-hidden p-6 cursor-pointer hover:shadow-lg transition-all group border-l-[5px] border-l-accent"
            >
              {/* Top Row: Batch Code & Status */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                    {batch.code}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{batch.college?.name || 'Partner College'}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-primary-tint text-primary border border-primary/20">
                  Sem {batch.current_semester}
                </span>
              </div>

              {/* Progress Chips */}
              <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl bg-sunken border border-border/60">
                <div>
                  <div className="text-[11px] font-mono text-muted-foreground uppercase">Avg Attendance</div>
                  <div className="text-lg font-bold font-mono text-success mt-0.5">{attendancePct}%</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-muted-foreground uppercase">Syllabus Coverage</div>
                  <div className="text-lg font-bold font-mono text-primary mt-0.5">{coveragePct}%</div>
                </div>
              </div>

              {/* Coordinator Metadata */}
              <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span>Students:</span>
                  <span className="font-mono font-bold text-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-accent" /> {batch.student_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>College Coord:</span>
                  <span className="font-medium text-foreground truncate max-w-[150px]">
                    {batch.college_coordinator?.full_name || 'Unassigned'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Student Coord:</span>
                  <span className="font-medium text-foreground truncate max-w-[150px]">
                    {batch.student_coordinator?.full_name || 'Unassigned'}
                  </span>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-primary font-semibold group-hover:translate-x-1 transition-transform">
                <span>Enter Workspace</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW BATCH MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading text-foreground">Create New Batch</h3>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-accent/15 text-accent">
                Auto-Code: {autoBatchCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">College</label>
                <select
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {store.colleges.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Program</label>
                <select
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {store.programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Academic Year Span</label>
                <Input
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2026-29"
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Current Semester</label>
                <Input
                  type="number"
                  min="1"
                  max="8"
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(Number(e.target.value))}
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">College Coordinator</label>
                <select
                  value={collegeCoordId}
                  onChange={(e) => setCollegeCoordId(e.target.value)}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {store.profiles.map((p) => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Student Coordinator</label>
                <select
                  value={studentCoordId}
                  onChange={(e) => setStudentCoordId(e.target.value)}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {store.profiles.map((p) => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleCreateBatch} className="bg-primary text-primary-foreground">Create Batch Workspace</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
