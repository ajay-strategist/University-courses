import { useMemo } from 'react';
import { store } from '@/lib/store';
import type { Student, Batch } from '@/types';
import { Button } from '@/components/ui/button';
import {
  X,
  ExternalLink,
  Calendar,
  Award,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';
import { getStudentPhotoUrl } from '@/lib/riskEngine';

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

interface StudentProfileDrawerProps {
  student: Student | null;
  batch: Batch | null;
  onClose: () => void;
}

export function StudentProfileDrawer({ student, batch, onClose }: StudentProfileDrawerProps) {
  if (!student) return null;

  const photoUrl = getStudentPhotoUrl(student.photo_url);

  // Student Attendance
  const studentAttendanceStats = useMemo(() => {
    const studentRecords = store.attendance.filter(a => a.student_id === student.id);
    const total = studentRecords.length;
    const presents = studentRecords.filter(a => a.status === 'present').length;
    const absents = studentRecords.filter(a => a.status === 'absent').length;
    const pct = total > 0 ? Math.round((presents / total) * 100) : 100;
    return { total, presents, absents, pct };
  }, [student.id, store.attendance]);

  // Student Assessment Marks
  const studentMarks = useMemo(() => {
    const marks = store.assessmentMarks.filter(m => m.student_id === student.id);
    return marks.map(m => {
      const asm = store.assessments.find(a => a.id === m.assessment_id);
      const bc = store.batchCourses.find(c => c.id === asm?.batch_course_id);
      const course = store.courses.find(c => c.id === bc?.course_id);
      const maxMark = asm?.max_mark || 100;
      const pct = maxMark > 0 ? Math.round((m.mark / maxMark) * 100) : 0;
      return {
        id: m.id,
        assessmentName: asm?.name || 'Assessment',
        category: asm?.assignment_category || 'Assessment',
        toolCode: course?.code || 'Tool',
        mark: m.mark,
        maxMark,
        pct,
        isPass: pct >= 40,
      };
    });
  }, [student.id, store.assessmentMarks, store.assessments, store.batchCourses, store.courses]);

  // Overall Academic Average
  const academicAvg = useMemo(() => {
    if (studentMarks.length === 0) return null;
    const sum = studentMarks.reduce((acc, m) => acc + m.pct, 0);
    return Math.round(sum / studentMarks.length);
  }, [studentMarks]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-card w-full max-w-xl h-full shadow-2xl border-l border-border flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={student.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-primary shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 border-2 border-primary/20 text-primary font-bold font-mono text-base flex items-center justify-center">
                {(student.name || 'S').substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="font-heading font-bold text-lg text-foreground">{student.name}</h2>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-0.5">
                <span className="font-bold text-accent">{student.register_no}</span>
                <span>•</span>
                <span>{batch?.code || 'Batch'}</span>
                <span>•</span>
                <span>{student.class || 'Div A'}</span>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card-meridian p-4 border border-border">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Overall Attendance
              </span>
              <div className="text-2xl font-bold font-heading text-foreground mt-1.5">
                {studentAttendanceStats.pct}%
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {studentAttendanceStats.presents} / {studentAttendanceStats.total} hours attended
              </p>
            </div>

            <div className="card-meridian p-4 border border-border">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-accent" /> Academic Average
              </span>
              <div className="text-2xl font-bold font-heading text-foreground mt-1.5">
                {academicAvg !== null ? `${academicAvg}%` : 'N/A'}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Across {studentMarks.length} recorded assessment{studentMarks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Demographics & LinkedIn Profile */}
          <div className="p-4 bg-muted/20 border border-border rounded-2xl space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
              Student Details & Portfolio
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block">Gender:</span>
                <span className="font-semibold text-foreground">{student.gender || 'Not Specified'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Prior Qualification:</span>
                <span className="font-semibold text-foreground">{student.previous_qualification || 'Plus Two'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Division:</span>
                <span className="font-semibold text-foreground">{student.division || student.class || 'A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Contact Phone:</span>
                <span className="font-mono text-foreground">{student.phone || '—'}</span>
              </div>
            </div>

            {/* LinkedIn Post Activity */}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <LinkedinIcon className="h-4 w-4 text-[#0077B5]" />
                <span className="font-medium text-foreground">LinkedIn Activity:</span>
                <span className="px-2 py-0.5 rounded-full bg-[#0077B5]/15 text-[#0077B5] font-mono font-bold text-xs">
                  {student.linkedin_post_count || 0} Posts Tracked
                </span>
              </div>

              {student.linkedin_url ? (
                <a
                  href={student.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-primary flex items-center gap-1 hover:underline"
                >
                  View Profile <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-[11px] text-muted-foreground font-mono">No profile linked</span>
              )}
            </div>
          </div>

          {/* Assessment Marks Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-primary" /> Evaluation Performance Roster
            </h3>

            <div className="border border-border rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono uppercase">
                  <tr>
                    <th className="p-2.5">Tool</th>
                    <th className="p-2.5">Assessment</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-center">Marks</th>
                    <th className="p-2.5 text-center">Score %</th>
                    <th className="p-2.5 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {studentMarks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground font-mono">
                        No marks recorded for this student yet.
                      </td>
                    </tr>
                  ) : (
                    studentMarks.map((m) => (
                      <tr key={m.id} className="hover:bg-muted/30">
                        <td className="p-2.5 font-mono font-bold text-primary">{m.toolCode}</td>
                        <td className="p-2.5 font-medium text-foreground">{m.assessmentName}</td>
                        <td className="p-2.5 text-muted-foreground">{m.category}</td>
                        <td className="p-2.5 text-center font-mono">
                          {m.mark} / {m.maxMark}
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-foreground">
                          {m.pct}%
                        </td>
                        <td className="p-2.5 text-center">
                          {m.isPass ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-success/15 text-success">
                              PASS
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-destructive/15 text-destructive">
                              FAIL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border flex justify-end bg-muted/20">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Drawer
          </Button>
        </div>
      </div>
    </div>
  );
}
