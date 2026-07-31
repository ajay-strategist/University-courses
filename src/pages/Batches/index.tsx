import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
import type { Batch } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Users, BookOpen, ChevronRight, Sparkles, Building2, Calendar, Award, Edit2, Trash2, X } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

export default function BatchesGrid() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const allBatches = store.batches.map(b => store.getBatchWithDetails(b.id)!);
  const filteredBatches = allBatches.filter(b => {
    if (profile?.role === 'college_coordinator') {
      return b.college_coordinator_id === profile.id || b.college_coordinator?.email === profile.email;
    }
    if (profile?.role === 'student_coordinator') {
      return b.student_coordinator_id === profile.id || b.student_coordinator?.email === profile.email;
    }
    return true;
  });

  const [batches, setBatches] = useState<Batch[]>(filteredBatches);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);

  const handleBulkDeleteBatches = async () => {
    if (confirm(`Are you sure you want to delete the ${selectedBatchIds.length} selected batches? This will permanently delete all student rosters, course allocations, attendance registers, and marks for these batches.`)) {
      for (const id of selectedBatchIds) {
        await store.deleteBatch(id);
      }
      setBatches(store.batches.map(b => store.getBatchWithDetails(b.id)!));
      setSelectedBatchIds([]);
      toast.success('Selected batches deleted successfully');
    }
  };

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

  // Edit Batch Modal State
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    current_semester: 1,
    status: 'Active' as 'Active' | 'Completed',
    college_coordinator_id: '',
    student_coordinator_id: '',
    start_date: '',
    end_date: '',
  });

  const handleDeleteBatchInGrid = async (batchId: string, batchCode: string) => {
    if (confirm(`Are you sure you want to delete batch "${batchCode}"? This will remove all student roster data, courses, attendance, and assessment marks for this batch.`)) {
      await store.deleteBatch(batchId);
      setBatches(store.batches.map(b => store.getBatchWithDetails(b.id)!));
      toast.success(`Batch ${batchCode} deleted successfully`);
    }
  };

  const handleSaveEditBatch = async () => {
    if (!editingBatchId) return;
    const target = store.batches.find(b => b.id === editingBatchId);
    if (target) {
      await store.saveBatch({
        ...target,
        current_semester: editForm.current_semester,
        status: editForm.status,
        college_coordinator_id: editForm.college_coordinator_id || undefined,
        student_coordinator_id: editForm.student_coordinator_id || undefined,
        start_date: editForm.start_date,
        end_date: editForm.end_date,
      });
      setBatches(store.batches.map(b => store.getBatchWithDetails(b.id)!));
      setShowEditModal(false);
      toast.success('Batch details updated successfully!');
    }
  };

  // Derive auto batch code
  const selectedCollege = store.colleges.find(c => c.id === collegeId);
  const selectedProgram = store.programs.find(p => p.id === programId);
  const autoBatchCode = `${selectedCollege?.code || 'COL'}-${selectedProgram?.code || 'PROG'}-${academicYear}`;

  const handleCreateBatch = async () => {
    if (!collegeId || !programId || !academicYear) {
      toast.error('Please fill all required fields');
      return;
    }

    const saved = await store.saveBatch({
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
    });

    setBatches(store.batches.map(b => store.getBatchWithDetails(b.id)!));
    setShowModal(false);
    toast.success(`Batch ${saved.code} created successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Training Cohort Batches</h1>
          <p className="text-sm text-muted-foreground">Manage college training batches, course allocations, student rosters, and performance metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedBatchIds.length > 0 && (
            <Button 
              onClick={handleBulkDeleteBatches} 
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm animate-in fade-in zoom-in duration-200"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedBatchIds.length})
            </Button>
          )}
          <Button onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm">
            <Plus className="h-4 w-4 mr-2" /> New Batch
          </Button>
        </div>
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
              className="card-meridian relative overflow-hidden cursor-pointer hover:shadow-xl transition-all group pl-[5px] flex flex-col justify-between"
            >
              {/* Left Spine Fill Height Tracking Overall Coverage */}
              <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-muted/40 z-20 flex flex-col justify-end">
                <div 
                  className="bg-accent w-full transition-all duration-500" 
                  style={{ height: `${coveragePct}%` }}
                />
              </div>
              {/* College Campus Banner Image */}
              <div className="relative h-28 w-full overflow-hidden bg-muted">
                {batch.college?.image_url ? (
                  <img 
                    src={batch.college.image_url} 
                    alt={`${batch.college.name} Campus`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary/30 to-accent/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Selection Checkbox */}
                <div 
                  className="absolute top-3.5 left-3.5 z-20 flex items-center justify-center bg-black/40 border border-white/20 rounded p-1 hover:bg-black/60 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedBatchIds.includes(batch.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBatchIds(prev => [...prev, batch.id]);
                      } else {
                        setSelectedBatchIds(prev => prev.filter(id => id !== batch.id));
                      }
                    }}
                    className="rounded border-white/40 bg-black/60 text-primary focus:ring-primary h-4.5 w-4.5 cursor-pointer"
                  />
                </div>

                {/* College Logo Floating Badge */}
                <div className="absolute top-3 left-12 flex items-center gap-2">
                  {batch.college?.logo_url ? (
                    <img 
                      src={batch.college.logo_url} 
                      alt={batch.college.name} 
                      className="h-8 w-8 rounded-lg object-cover bg-background border border-white/40 shadow-md"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-background text-primary font-bold font-mono text-xs flex items-center justify-center border border-white/40 shadow-md">
                      {batch.college?.code}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-white drop-shadow-sm truncate max-w-[140px]">
                    {batch.college?.name}
                  </span>
                </div>

                {/* Semester Pill */}
                <span className="absolute top-3 right-3 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-background/90 text-primary border border-primary/20 backdrop-blur-sm shadow-xs">
                  Sem {batch.current_semester}
                </span>

                {/* Batch Code overlay at bottom of banner */}
                <div className="absolute bottom-2 left-3">
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-accent transition-colors tracking-tight drop-shadow-md">
                    {batch.code}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                {/* Progress Chips */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-sunken border border-border/60">
                  <div>
                    <div className="text-[11px] font-mono text-muted-foreground uppercase">Avg Attendance</div>
                    <div className="text-base font-bold font-mono text-success mt-0.5">{attendancePct}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-muted-foreground uppercase">Syllabus Coverage</div>
                    <div className="text-base font-bold font-mono text-primary mt-0.5">{coveragePct}%</div>
                  </div>
                </div>

                {/* Coordinator Metadata */}
                <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border pt-3">
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
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBatchId(batch.id);
                        setEditForm({
                          current_semester: batch.current_semester,
                          status: batch.status,
                          college_coordinator_id: batch.college_coordinator_id || '',
                          student_coordinator_id: batch.student_coordinator_id || '',
                          start_date: batch.start_date || '',
                          end_date: batch.end_date || '',
                        });
                        setShowEditModal(true);
                      }}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBatchInGrid(batch.id, batch.code);
                      }}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>Enter</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
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

      {/* EDIT BATCH MODAL */}
      {showEditModal && editingBatchId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading">Edit Batch</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="font-medium text-muted-foreground">Current Semester</label>
                <select 
                  value={editForm.current_semester} 
                  onChange={(e) => setEditForm({ ...editForm, current_semester: Number(e.target.value) })}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm font-sans font-semibold text-foreground focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-muted-foreground">Batch Status</label>
                <select 
                  value={editForm.status} 
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm font-sans font-semibold text-foreground focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-muted-foreground">College Coordinator</label>
                <select 
                  value={editForm.college_coordinator_id} 
                  onChange={(e) => setEditForm({ ...editForm, college_coordinator_id: e.target.value })}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm font-sans text-foreground focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {store.profiles.filter(p => p.role === 'college_coordinator').map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-muted-foreground">Student Coordinator</label>
                <select 
                  value={editForm.student_coordinator_id} 
                  onChange={(e) => setEditForm({ ...editForm, student_coordinator_id: e.target.value })}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm font-sans text-foreground focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {store.profiles.filter(p => p.role === 'student_coordinator').map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-muted-foreground">Start Date</label>
                  <Input 
                    type="date" 
                    value={editForm.start_date} 
                    onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })} 
                    className="mt-1 font-sans"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">End Date</label>
                  <Input 
                    type="date" 
                    value={editForm.end_date} 
                    onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })} 
                    className="mt-1 font-sans"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button onClick={handleSaveEditBatch} className="bg-primary text-primary-foreground">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
