import { useState, useMemo } from 'react';
import { store, generateUUID } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import type { Batch, Session, Course, BatchCourse } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  CalendarDays,
  Clock,
  Download,
  Upload,
  Search,
  Lock,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Calendar,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';

export function BatchScheduleView() {
  const { profile } = useAuth();
  const canEdit = profile?.role === 'admin' || profile?.role === 'trainer';

  const [selectedBatchId, setSelectedBatchId] = useState<string>(store.batches[0]?.id || '');
  const [effectiveDate, setEffectiveDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'date_wise' | 'weekly_grid'>('date_wise');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMode, setImportMode] = useState<'merge' | 'override'>('merge');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const selectedBatch = store.batches.find(b => b.id === selectedBatchId);
  const batchCourses = store.batchCourses.filter(bc => bc.batch_id === selectedBatchId);
  const bcIdMap = useMemo(() => new Set(batchCourses.map(bc => bc.id)), [batchCourses]);

  // All sessions for this batch
  const batchSessions = useMemo(() => {
    return store.sessions
      .filter(s => bcIdMap.has(s.batch_course_id))
      .sort((a, b) => {
        if (a.session_date !== b.session_date) {
          return a.session_date.localeCompare(b.session_date);
        }
        return a.hour_no - b.hour_no;
      });
  }, [bcIdMap, refreshTrigger, store.sessions]);

  // Compute Day index (Day 1, Day 2, Day 3...) by unique session dates
  const dateToDayIndexMap = useMemo(() => {
    const uniqueDates = Array.from(new Set(batchSessions.map(s => s.session_date))).sort();
    const map = new Map<string, number>();
    uniqueDates.forEach((d, idx) => map.set(d, idx + 1));
    return map;
  }, [batchSessions]);

  // Filtered session records for table
  const displaySessions = useMemo(() => {
    let list = batchSessions.map(sess => {
      const bc = batchCourses.find(c => c.id === sess.batch_course_id);
      const course = store.courses.find(c => c.id === bc?.course_id);
      const dayIndex = dateToDayIndexMap.get(sess.session_date) || 1;

      // Check attendance
      const attRecords = store.attendance.filter(a => a.session_id === sess.id);
      const totalAtt = attRecords.length;
      const presentCount = attRecords.filter(a => a.status === 'present').length;
      const attPct = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : null;

      // Check trainer log
      const log = store.trainerLogs.find(
        l => l.batch_course_id === sess.batch_course_id && l.log_date === sess.session_date
      );

      // Lock status (Q7: Past historical sessions prior to effective date remain strictly locked)
      const isHistoricalLocked = sess.session_date < effectiveDate;

      // Day of week
      const dateObj = new Date(sess.session_date);
      const dayOfWeek = isNaN(dateObj.getTime())
        ? ''
        : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        session: sess,
        dayIndex,
        dayOfWeek,
        courseCode: course?.code || 'Tool',
        courseName: course?.name || 'General Tool',
        attPct,
        totalAtt,
        logTrainer: log?.trainer_name || 'Assigned Trainer',
        isHistoricalLocked,
      };
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        item.courseCode.toLowerCase().includes(q) ||
        item.courseName.toLowerCase().includes(q) ||
        item.session.session_date.includes(q) ||
        item.logTrainer.toLowerCase().includes(q)
      );
    }

    return list;
  }, [batchSessions, batchCourses, dateToDayIndexMap, effectiveDate, searchQuery, store.attendance, store.trainerLogs]);

  // Download blank / prefilled Excel template (Q6)
  const handleDownloadTemplate = () => {
    if (!selectedBatch) return;

    const sampleRows = [
      {
        'Date (DD-MM-YYYY)': '15-11-2026',
        'Hour / Session No (1 to 8)': 1,
        'Course / Tool Name': batchCourses[0] ? (store.courses.find(c => c.id === batchCourses[0].course_id)?.code || 'XL') : 'XL',
        'Topic Name': 'Introduction & Data Modeling',
        'Trainer Name': 'Anoop Baiju',
        'Activity / Exam Category': 'Lecture',
      },
      {
        'Date (DD-MM-YYYY)': '15-11-2026',
        'Hour / Session No (1 to 8)': 2,
        'Course / Tool Name': batchCourses[0] ? (store.courses.find(c => c.id === batchCourses[0].course_id)?.code || 'XL') : 'XL',
        'Topic Name': 'Hands-on Practice & Exercises',
        'Trainer Name': 'Anoop Baiju',
        'Activity / Exam Category': 'Lab Session',
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
    XLSX.writeFile(wb, `${selectedBatch.code}_Schedule_Template.xlsx`);
    toast.success('Downloaded Schedule Import Template (.xlsx)');
  };

  // Import Schedule from Excel
  const handleImportSchedule = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBatch) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(sheet);

        let imported = 0;
        let skippedLocked = 0;

        for (const r of rows) {
          const rawDate = String(r['Date (DD-MM-YYYY)'] || r['Date'] || r.date || '').trim();
          const rawHour = Number(r['Hour / Session No (1 to 8)'] || r['Hour'] || r.hour || 1);
          const toolName = String(r['Course / Tool Name'] || r['Tool'] || r['Course'] || '').trim();

          if (!rawDate) continue;

          // Convert DD-MM-YYYY -> YYYY-MM-DD
          let sessionDate = rawDate;
          const ddmmyyyy = rawDate.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (ddmmyyyy) {
            sessionDate = `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
          }

          // Q7: Historical lock check: Do NOT modify historical sessions prior to effective date
          if (sessionDate < effectiveDate) {
            skippedLocked++;
            continue;
          }

          // Match course to batch courses
          let targetBC = batchCourses.find(bc => {
            const crs = store.courses.find(c => c.id === bc.course_id);
            return crs?.code.toLowerCase() === toolName.toLowerCase() ||
                   crs?.name.toLowerCase() === toolName.toLowerCase();
          });

          // Fallback to first batch course if not matched
          if (!targetBC && batchCourses.length > 0) {
            targetBC = batchCourses[0];
          }

          if (targetBC) {
            await store.saveSession({
              id: generateUUID(),
              batch_course_id: targetBC.id,
              session_date: sessionDate,
              hour_no: Math.max(1, Math.min(8, rawHour)),
            });
            imported++;
          }
        }

        toast.success(
          `Schedule imported: ${imported} sessions scheduled!${skippedLocked > 0 ? ` (${skippedLocked} locked historical sessions preserved).` : ''}`
        );
        setShowImportModal(false);
        setRefreshTrigger(prev => prev + 1);
      } catch (err: any) {
        console.error('Schedule import error:', err);
        toast.error('Failed to parse schedule Excel file');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Filter Bar */}
      <div className="card-meridian p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-xs font-mono font-medium text-muted-foreground block mb-1">
              Select Batch:
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
            >
              {store.batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.code} · Sem {b.current_semester || 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono font-medium text-muted-foreground block mb-1">
              🔒 Effective Date (Lock History):
            </label>
            <Input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="h-8 text-xs font-mono bg-background"
            />
          </div>

          <div className="flex items-center rounded-xl bg-muted/60 p-0.5 border border-border self-end">
            <button
              onClick={() => setViewMode('date_wise')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'date_wise'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Date-wise Table (Day 1, 2...)
            </button>
            <button
              onClick={() => setViewMode('weekly_grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'weekly_grid'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Weekly Grid (Mon-Sat)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end">
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="text-xs h-8">
            <Download className="h-3.5 w-3.5 mr-1" /> Template (.xlsx)
          </Button>

          {canEdit && (
            <Button size="sm" onClick={() => setShowImportModal(true)} className="bg-primary text-primary-foreground text-xs h-8">
              <Upload className="h-3.5 w-3.5 mr-1" /> Import Schedule
            </Button>
          )}
        </div>
      </div>

      {/* Info Banner for Historical Lock */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary shrink-0" />
          <span>
            Sessions prior to <strong className="text-foreground font-mono">{effectiveDate}</strong> are locked historical records with immutable attendance.
          </span>
        </div>
        <span className="font-mono text-primary font-bold">
          {displaySessions.length} Total Sessions
        </span>
      </div>

      {/* View Mode 1: Date-wise Table View */}
      {viewMode === 'date_wise' && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search date, tool or trainer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8 bg-background"
              />
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
              <tr>
                <th className="p-3 w-16 text-center">Day</th>
                <th className="p-3">Date</th>
                <th className="p-3 w-16 text-center">Hour</th>
                <th className="p-3">Tool / Course</th>
                <th className="p-3">Assigned Trainer</th>
                <th className="p-3 text-center">Attendance Status</th>
                <th className="p-3 text-center">Schedule State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displaySessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs font-mono">
                    No scheduled sessions found for this batch. Import schedule via Excel template.
                  </td>
                </tr>
              ) : (
                displaySessions.map((row) => (
                  <tr key={row.session.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-center font-mono font-bold text-accent">
                      Day {row.dayIndex}
                    </td>
                    <td className="p-3 font-mono text-xs text-foreground">
                      {row.session.session_date} <span className="text-muted-foreground">({row.dayOfWeek})</span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-primary">
                      H{row.session.hour_no}
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold mr-2">
                        {row.courseCode}
                      </span>
                      <span className="font-medium text-foreground">{row.courseName}</span>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {row.logTrainer}
                    </td>
                    <td className="p-3 text-center">
                      {row.attPct !== null ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-success/15 text-success">
                          Delivered ({row.attPct}%)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-muted text-muted-foreground">
                          Scheduled
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.isHistoricalLocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono text-muted-foreground bg-muted/80">
                          <Lock className="h-3 w-3" /> Locked Historical
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono text-primary bg-primary/10 font-bold">
                          🟢 Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Mode 2: Weekly Timetable Grid */}
      {viewMode === 'weekly_grid' && (
        <div className="bg-card rounded-2xl border border-border p-4 shadow-xs space-y-4">
          <div className="border-b border-border pb-2">
            <h3 className="font-heading font-bold text-foreground text-sm">
              Standard Weekly Recurring Schedule ({selectedBatch?.code})
            </h3>
            <p className="text-xs text-muted-foreground">
              Hourly class assignments across weekdays (Monday – Saturday).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 font-mono uppercase text-muted-foreground border-b border-border">
                  <th className="p-3 text-left w-24">Day</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                    <th key={h} className="p-3">Hour {h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName) => (
                  <tr key={dayName} className="hover:bg-muted/20">
                    <td className="p-3 text-left font-mono font-bold text-foreground bg-muted/10">
                      {dayName}
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(hourNo => {
                      // Find sessions matching this day of week and hour
                      const match = displaySessions.find(
                        s => s.dayOfWeek.toLowerCase() === dayName.substring(0, 3).toLowerCase() && s.session.hour_no === hourNo
                      );

                      return (
                        <td key={hourNo} className="p-2 border-l border-border/50">
                          {match ? (
                            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-center">
                              <span className="font-mono font-bold text-primary block">{match.courseCode}</span>
                              <span className="text-[10px] text-muted-foreground truncate block">{match.logTrainer}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground font-mono text-[11px]">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Import Batch Schedule from Excel
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowImportModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Upload an Excel timetable file with columns:
              <br />
              <code className="text-primary font-mono text-[11px]">
                Date (DD-MM-YYYY) | Hour / Session No | Course / Tool Name | Topic Name | Trainer Name
              </code>
            </p>

            <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-2 text-xs">
              <span className="font-semibold text-foreground block">Import Rules Enforced:</span>
              <p className="text-muted-foreground">
                • Sessions before <strong className="text-foreground">{effectiveDate}</strong> are locked and will NEVER be overwritten.
              </p>
              <p className="text-muted-foreground">
                • Sessions on or after {effectiveDate} will be updated or created safely.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="w-full text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download Blank Template (.xlsx)
              </Button>

              <label className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors">
                <Upload className="h-3.5 w-3.5" /> Select & Import Schedule (.xlsx)
                <input type="file" accept=".xlsx, .csv" onChange={handleImportSchedule} className="hidden" />
              </label>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setShowImportModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

