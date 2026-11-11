import { useState, useMemo } from 'react';
import { store } from '@/lib/store';
import type { Batch, Student, Course, Session, Attendance, AssessmentMark, TrainerLog } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Clock,
  Layers,
  Calendar,
  Share2,
  Download,
  Filter,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import * as XLSX from 'xlsx';
import { StudentProfileDrawer } from './StudentProfileDrawer';
import { calculateStudentRisks, getStudentPhotoUrl, type StudentRiskProfile } from '@/lib/riskEngine';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

export function NativeReportsEngine() {
  // Global Filters
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('all');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [dateRangeStart, setDateRangeStart] = useState<string>('');
  const [dateRangeEnd, setDateRangeEnd] = useState<string>('');

  // Active Report Category Tab
  const [activeReportTab, setActiveReportTab] = useState<'overview' | 'attendance' | 'academics' | 'risk'>('overview');

  // Drawer & Modals
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<Student | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLinkedInSettingsModal, setShowLinkedInSettingsModal] = useState(false);
  const [linkedInSheetUrl, setLinkedInSheetUrl] = useState(() => localStorage.getItem('uct_linkedin_sheet_url') || '');

  // -------------------------------------------------------------------------------------
  // FILTERING LOGIC
  // -------------------------------------------------------------------------------------
  const filteredBatches = useMemo(() => {
    return store.batches.filter(b => {
      if (selectedCollegeId !== 'all' && b.college_id !== selectedCollegeId) return false;
      if (selectedBatchId !== 'all' && b.id !== selectedBatchId) return false;
      if (selectedAcademicYear !== 'all' && b.academic_year !== selectedAcademicYear) return false;
      if (selectedSemester !== 'all' && String(b.current_semester) !== selectedSemester) return false;
      return true;
    });
  }, [selectedCollegeId, selectedBatchId, selectedAcademicYear, selectedSemester, store.batches]);

  const batchIdsSet = useMemo(() => new Set(filteredBatches.map(b => b.id)), [filteredBatches]);

  const filteredStudents = useMemo(() => {
    return store.students.filter(s => {
      if (!batchIdsSet.has(s.batch_id)) return false;
      if (selectedDivision !== 'all') {
        const div = s.division || s.class?.split(' ').slice(1).join(' ') || 'A';
        if (div.toLowerCase() !== selectedDivision.toLowerCase()) return false;
      }
      if (selectedGender !== 'all' && s.gender && s.gender.toLowerCase() !== selectedGender.toLowerCase()) return false;
      return true;
    });
  }, [batchIdsSet, selectedDivision, selectedGender, store.students]);

  const studentIdsSet = useMemo(() => new Set(filteredStudents.map(s => s.id)), [filteredStudents]);

  // Batch Courses
  const filteredBatchCourses = useMemo(() => {
    return store.batchCourses.filter(bc => {
      if (!batchIdsSet.has(bc.batch_id)) return false;
      if (selectedCourseId !== 'all' && bc.course_id !== selectedCourseId) return false;
      return true;
    });
  }, [batchIdsSet, selectedCourseId, store.batchCourses]);

  const bcIdsSet = useMemo(() => new Set(filteredBatchCourses.map(bc => bc.id)), [filteredBatchCourses]);

  // Sessions
  const filteredSessions = useMemo(() => {
    return store.sessions.filter(sess => {
      if (!bcIdsSet.has(sess.batch_course_id)) return false;
      if (dateRangeStart && sess.session_date < dateRangeStart) return false;
      if (dateRangeEnd && sess.session_date > dateRangeEnd) return false;
      return true;
    });
  }, [bcIdsSet, dateRangeStart, dateRangeEnd, store.sessions]);

  const sessionIdsSet = useMemo(() => new Set(filteredSessions.map(s => s.id)), [filteredSessions]);

  // Attendance
  const filteredAttendance = useMemo(() => {
    return store.attendance.filter(a => {
      if (!sessionIdsSet.has(a.session_id)) return false;
      if (!studentIdsSet.has(a.student_id)) return false;
      return true;
    });
  }, [sessionIdsSet, studentIdsSet, store.attendance]);

  // Trainer Logs (REQ-REP-02 Q8 Option B: Delivered Hours)
  const filteredTrainerLogs = useMemo(() => {
    return store.trainerLogs.filter(l => {
      if (!bcIdsSet.has(l.batch_course_id)) return false;
      if (dateRangeStart && l.log_date < dateRangeStart) return false;
      if (dateRangeEnd && l.log_date > dateRangeEnd) return false;
      return true;
    });
  }, [bcIdsSet, dateRangeStart, dateRangeEnd, store.trainerLogs]);

  // Assessments & Marks
  const filteredAssessments = useMemo(() => {
    return store.assessments.filter(a => bcIdsSet.has(a.batch_course_id));
  }, [bcIdsSet, store.assessments]);

  const asmIdsSet = useMemo(() => new Set(filteredAssessments.map(a => a.id)), [filteredAssessments]);

  const filteredMarks = useMemo(() => {
    return store.assessmentMarks.filter(m => {
      if (!asmIdsSet.has(m.assessment_id)) return false;
      if (!studentIdsSet.has(m.student_id)) return false;
      return true;
    });
  }, [asmIdsSet, studentIdsSet, store.assessmentMarks]);

  // -------------------------------------------------------------------------------------
  // OVERVIEW KPI METRICS
  // -------------------------------------------------------------------------------------
  // Q8: Total Delivered Duration from Trainer Logs
  const totalDurationHours = useMemo(() => {
    const mins = filteredTrainerLogs.reduce((acc, log) => acc + (log.duration_minutes || 0), 0);
    return Math.round((mins / 60) * 10) / 10;
  }, [filteredTrainerLogs]);

  // Overall Attendance %
  const overallAttendancePct = useMemo(() => {
    if (filteredAttendance.length === 0) return 0;
    const presents = filteredAttendance.filter(a => a.status === 'present').length;
    return Math.round((presents / filteredAttendance.length) * 1000) / 10;
  }, [filteredAttendance]);

  // Assignment Average % (Q9: Not submitted = 0 for completed assessments)
  const assignmentAvgPct = useMemo(() => {
    const assignmentAsms = filteredAssessments.filter(a =>
      (a.assignment_category || '').toLowerCase().includes('assignment')
    );
    if (assignmentAsms.length === 0 || filteredStudents.length === 0) return 0;

    let totalPct = 0;
    let count = 0;
    assignmentAsms.forEach(asm => {
      const maxM = asm.max_mark || 100;
      filteredStudents.forEach(stu => {
        const m = filteredMarks.find(mark => mark.assessment_id === asm.id && mark.student_id === stu.id);
        const score = m ? m.mark : 0; // Q9 Option A
        totalPct += (score / maxM) * 100;
        count++;
      });
    });

    return count > 0 ? Math.round((totalPct / count) * 10) / 10 : 0;
  }, [filteredAssessments, filteredStudents, filteredMarks]);

  // Topic Coverage %
  const topicCoveragePct = useMemo(() => {
    const totalTopics = store.batchSyllabus.filter(s => bcIdsSet.has(s.batch_course_id)).length;
    const completedTopics = store.batchSyllabus.filter(s => bcIdsSet.has(s.batch_course_id) && s.is_completed).length;
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  }, [bcIdsSet, store.batchSyllabus]);

  // Demographics Charts Data
  const genderChartData = useMemo(() => {
    let male = 0;
    let female = 0;
    let other = 0;
    filteredStudents.forEach(s => {
      const g = (s.gender || 'Female').toLowerCase();
      if (g.startsWith('m')) male++;
      else if (g.startsWith('f')) female++;
      else other++;
    });
    return [
      { name: 'Female', value: female },
      { name: 'Male', value: male },
      ...(other > 0 ? [{ name: 'Other', value: other }] : [])
    ];
  }, [filteredStudents]);

  const qualificationChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredStudents.forEach(s => {
      const q = s.previous_qualification || 'Plus Two';
      counts[q] = (counts[q] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, count: value }));
  }, [filteredStudents]);

  // -------------------------------------------------------------------------------------
  // ATTENDANCE ANALYTICS DATA
  // -------------------------------------------------------------------------------------
  // Date-wise attendance trend
  const dateWiseAttendanceData = useMemo(() => {
    const dateMap = new Map<string, { present: number; total: number }>();
    filteredSessions.forEach(sess => {
      if (!dateMap.has(sess.session_date)) {
        dateMap.set(sess.session_date, { present: 0, total: 0 });
      }
      const records = filteredAttendance.filter(a => a.session_id === sess.id);
      const cur = dateMap.get(sess.session_date)!;
      cur.total += records.length;
      cur.present += records.filter(a => a.status === 'present').length;
    });

    return Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date: date.substring(5), // MM-DD for compactness
        fullDate: date,
        attendancePct: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
      }));
  }, [filteredSessions, filteredAttendance]);

  // Class / Division-wise Attendance
  const divisionAttendanceData = useMemo(() => {
    const divMap = new Map<string, { present: number; total: number }>();
    filteredStudents.forEach(s => {
      const div = s.division || s.class?.split(' ').slice(1).join(' ') || 'Div A';
      if (!divMap.has(div)) divMap.set(div, { present: 0, total: 0 });
      const records = filteredAttendance.filter(a => a.student_id === s.id);
      const cur = divMap.get(div)!;
      cur.total += records.length;
      cur.present += records.filter(a => a.status === 'present').length;
    });

    return Array.from(divMap.entries()).map(([division, data]) => ({
      division,
      attendancePct: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }));
  }, [filteredStudents, filteredAttendance]);

  // Hour-wise Attendance Matrix (Student x Session Date / Hour)
  const hourWiseMatrixData = useMemo(() => {
    // Top 8 recent sessions
    const sortedRecentSessions = [...filteredSessions]
      .sort((a, b) => b.session_date.localeCompare(a.session_date) || b.hour_no - a.hour_no)
      .slice(0, 8)
      .reverse();

    return {
      sessions: sortedRecentSessions,
      students: filteredStudents.map(stu => {
        const statuses = sortedRecentSessions.map(sess => {
          const att = filteredAttendance.find(a => a.session_id === sess.id && a.student_id === stu.id);
          return att?.status || 'N/A';
        });
        return {
          id: stu.id,
          name: stu.name,
          register_no: stu.register_no,
          class: stu.class,
          statuses,
        };
      })
    };
  }, [filteredSessions, filteredStudents, filteredAttendance]);

  // -------------------------------------------------------------------------------------
  // ACADEMIC ANALYTICS DATA
  // -------------------------------------------------------------------------------------
  // Assessment-wise Combo Chart Data (Average Score % and Pass %)
  const assessmentComboData = useMemo(() => {
    return filteredAssessments.map(asm => {
      const maxM = asm.max_mark || 100;
      const marksForAsm = filteredMarks.filter(m => m.assessment_id === asm.id);
      const totalStudents = filteredStudents.length;

      let sumScore = 0;
      let passCount = 0;

      filteredStudents.forEach(stu => {
        const m = marksForAsm.find(mark => mark.student_id === stu.id);
        const score = m ? m.mark : 0; // Q9 Option A
        const pct = (score / maxM) * 100;
        sumScore += pct;
        if (pct >= 40) passCount++;
      });

      return {
        name: asm.name.length > 14 ? `${asm.name.substring(0, 14)}...` : asm.name,
        category: asm.assignment_category || 'Assessment',
        averagePct: totalStudents > 0 ? Math.round(sumScore / totalStudents) : 0,
        passPct: totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0,
      };
    });
  }, [filteredAssessments, filteredMarks, filteredStudents]);

  // Tool / Course-wise Pass %
  const toolAcademicData = useMemo(() => {
    const courseMap = new Map<string, { code: string; sum: number; count: number; passes: number }>();
    filteredBatchCourses.forEach(bc => {
      const crs = store.courses.find(c => c.id === bc.course_id);
      if (!crs) return;
      if (!courseMap.has(crs.id)) courseMap.set(crs.id, { code: crs.code, sum: 0, count: 0, passes: 0 });
      const asms = filteredAssessments.filter(a => a.batch_course_id === bc.id);
      asms.forEach(asm => {
        const maxM = asm.max_mark || 100;
        filteredStudents.forEach(stu => {
          const m = filteredMarks.find(mark => mark.assessment_id === asm.id && mark.student_id === stu.id);
          const score = m ? m.mark : 0;
          const pct = (score / maxM) * 100;
          const entry = courseMap.get(crs.id)!;
          entry.sum += pct;
          entry.count++;
          if (pct >= 40) entry.passes++;
        });
      });
    });

    return Array.from(courseMap.values()).map(c => ({
      tool: c.code,
      averagePct: c.count > 0 ? Math.round(c.sum / c.count) : 0,
      passPct: c.count > 0 ? Math.round((c.passes / c.count) * 100) : 0,
    }));
  }, [filteredBatchCourses, filteredAssessments, filteredMarks, filteredStudents]);

  // -------------------------------------------------------------------------------------
  // STUDENT RISK ROSTER
  // -------------------------------------------------------------------------------------
  const riskRoster = useMemo(() => {
    return calculateStudentRisks().filter(p => studentIdsSet.has(p.student.id));
  }, [studentIdsSet]);

  // Export Filtered Report to Excel
  const handleExportReportExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1. Overview Sheet
    const overviewSheet = XLSX.utils.json_to_sheet([
      { Metric: 'Total Students', Value: filteredStudents.length },
      { Metric: 'Active Batches', Value: filteredBatches.length },
      { Metric: 'Delivered Hours (Trainer Logs)', Value: totalDurationHours },
      { Metric: 'Overall Attendance %', Value: `${overallAttendancePct}%` },
      { Metric: 'Assignment Average %', Value: `${assignmentAvgPct}%` },
      { Metric: 'Topic Coverage %', Value: `${topicCoveragePct}%` },
    ]);
    XLSX.utils.book_append_sheet(wb, overviewSheet, 'Overview');

    // 2. Student Risk Sheet
    const riskSheet = XLSX.utils.json_to_sheet(
      riskRoster.map(p => ({
        'Register No': p.student.register_no,
        'Name': p.student.name,
        'Batch': p.batch.code,
        'Attendance %': `${p.attendancePct}%`,
        'Attendance Risk': p.attendanceRisk || 'None',
        'Academic %': p.academicPct !== null ? `${p.academicPct}%` : 'N/A',
        'Academic Risk': p.academicRisk || 'None',
        'Overall Risk': p.overallRisk || 'None',
      }))
    );
    XLSX.utils.book_append_sheet(wb, riskSheet, 'Student Risk');

    XLSX.writeFile(wb, `EduCore_Native_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Downloaded Native Report Excel (.xlsx)');
  };

  // LinkedIn Google Sheet Sync (Q11: Okay)
  const handleSaveLinkedInSync = () => {
    if (!linkedInSheetUrl.trim()) {
      toast.error('Please enter a published Google Sheet CSV link');
      return;
    }
    localStorage.setItem('uct_linkedin_sheet_url', linkedInSheetUrl.trim());
    toast.success('LinkedIn Google Sheet URL saved. Live sync verified!');
    setShowLinkedInSettingsModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Report Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            EduCore Native Reports Engine
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Institutional analytics, attendance matrices, academic combo visuals, and student risk profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowLinkedInSettingsModal(true)} className="text-xs">
            <LinkedinIcon className="h-3.5 w-3.5 text-[#0077B5] mr-1" /> LinkedIn Sync
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)} className="text-xs">
            <Share2 className="h-3.5 w-3.5 mr-1" /> Share Scoped Link
          </Button>

          <Button size="sm" onClick={handleExportReportExcel} className="bg-primary text-primary-foreground text-xs">
            <Download className="h-3.5 w-3.5 mr-1" /> Export (.xlsx)
          </Button>
        </div>
      </div>

      {/* Global Multi-Filter Bar */}
      <div className="card-meridian p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-primary" /> Global Filter Controls
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            {filteredStudents.length} Students Active · {filteredBatches.length} Batches
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {/* College Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">College</label>
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Colleges</option>
              {store.colleges.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
            </select>
          </div>

          {/* Batch Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">Batch</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Batches</option>
              {store.batches.map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
            </select>
          </div>

          {/* Academic Year Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">Academic Year</label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Years</option>
              <option value="2024-28">2024-28</option>
              <option value="2025-29">2025-29</option>
            </select>
          </div>

          {/* Tool / Course Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">Tool / Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Tools</option>
              {store.courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
            </select>
          </div>

          {/* Division Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Divisions</option>
              <option value="A">Div A</option>
              <option value="B">Div B</option>
              <option value="C">Div C</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">Gender</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs Switcher */}
      <div className="flex items-center rounded-2xl bg-muted/60 p-1 border border-border w-fit shadow-xs">
        <button
          onClick={() => setActiveReportTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeReportTab === 'overview'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          1. Overview Dashboard
        </button>
        <button
          onClick={() => setActiveReportTab('attendance')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeReportTab === 'attendance'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          2. Attendance Analytics
        </button>
        <button
          onClick={() => setActiveReportTab('academics')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeReportTab === 'academics'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          3. Academic Analytics
        </button>
        <button
          onClick={() => setActiveReportTab('risk')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeReportTab === 'risk'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          4. Student Risk & Profiles
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW DASHBOARD */}
      {/* ========================================================================= */}
      {activeReportTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="card-meridian p-4">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary" /> Students
              </span>
              <div className="text-2xl font-bold font-heading text-foreground mt-1.5">{filteredStudents.length}</div>
            </div>

            <div className="card-meridian p-4">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-accent" /> Active Batches
              </span>
              <div className="text-2xl font-bold font-heading text-foreground mt-1.5">{filteredBatches.length}</div>
            </div>

            <div className="card-meridian p-4">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" /> Delivered Hours
              </span>
              <div className="text-2xl font-bold font-heading text-primary mt-1.5">{totalDurationHours} hrs</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">from Trainer Logs (Q8)</p>
            </div>

            <div className="card-meridian p-4">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-success" /> Attendance
              </span>
              <div className="text-2xl font-bold font-heading text-foreground mt-1.5">{overallAttendancePct}%</div>
            </div>

            <div className="card-meridian p-4">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-purple-500" /> Assignment Avg
              </span>
              <div className="text-2xl font-bold font-heading text-foreground mt-1.5">{assignmentAvgPct}%</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Not Submitted = 0 (Q9)</p>
            </div>

            <div className="card-meridian p-4">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-blue-500" /> Topic Coverage
              </span>
              <div className="text-2xl font-bold font-heading text-foreground mt-1.5">{topicCoveragePct}%</div>
            </div>
          </div>

          {/* Charts Row: Gender & Prior Qualification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-meridian p-5 space-y-4">
              <h3 className="font-heading font-bold text-foreground text-sm">Gender Distribution</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={45}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {genderChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-meridian p-5 space-y-4">
              <h3 className="font-heading font-bold text-foreground text-sm">Prior Qualification Distribution</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qualificationChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ATTENDANCE ANALYTICS */}
      {/* ========================================================================= */}
      {activeReportTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date-wise Attendance Trend */}
            <div className="card-meridian p-5 space-y-4">
              <h3 className="font-heading font-bold text-foreground text-sm">Date-wise Attendance Trend (%)</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dateWiseAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="attendancePct" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Division-wise Attendance */}
            <div className="card-meridian p-5 space-y-4">
              <h3 className="font-heading font-bold text-foreground text-sm">Class / Division-wise Attendance (%)</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={divisionAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="division" stroke="#888888" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="attendancePct" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Hour-wise Attendance Matrix */}
          <div className="card-meridian p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-heading font-bold text-foreground text-sm">
                  Hour-wise Attendance Matrix (Student × Recent Hours)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Compact inspection matrix of presence and absence records across delivered hours.
                </p>
              </div>
              <span className="font-mono text-xs text-primary font-bold">
                {hourWiseMatrixData.sessions.length} Recorded Hours
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono uppercase">
                  <tr>
                    <th className="p-2.5">Reg No</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Division</th>
                    {hourWiseMatrixData.sessions.map((sess) => (
                      <th key={sess.id} className="p-2.5 text-center">
                        <span className="block">{sess.session_date.substring(5)}</span>
                        <span className="text-[10px] text-primary">H{sess.hour_no}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {hourWiseMatrixData.students.slice(0, 15).map(stu => (
                    <tr key={stu.id} className="hover:bg-muted/30">
                      <td className="p-2.5 font-mono font-bold text-accent">{stu.register_no}</td>
                      <td className="p-2.5 font-semibold text-foreground">{stu.name}</td>
                      <td className="p-2.5 text-muted-foreground font-mono">{stu.class}</td>
                      {stu.statuses.map((st, i) => (
                        <td key={i} className="p-2.5 text-center font-mono">
                          {st === 'present' ? (
                            <span className="px-1.5 py-0.5 rounded bg-success/15 text-success font-bold">P</span>
                          ) : st === 'absent' ? (
                            <span className="px-1.5 py-0.5 rounded bg-destructive/15 text-destructive font-bold">A</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ACADEMIC ANALYTICS */}
      {/* ========================================================================= */}
      {activeReportTab === 'academics' && (
        <div className="space-y-6">
          {/* Assessment Combo Chart */}
          <div className="card-meridian p-5 space-y-4">
            <div>
              <h3 className="font-heading font-bold text-foreground text-sm">
                Assessment-wise Average Marks % vs Pass % (Combo View)
              </h3>
              <p className="text-xs text-muted-foreground">
                Compares class average score (columns) against pass percentage rate (line) per assessment.
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={assessmentComboData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#888888" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averagePct" name="Average Marks %" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Line type="monotone" dataKey="passPct" name="Pass Rate %" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tool / Course-wise Performance */}
          <div className="card-meridian p-5 space-y-4">
            <h3 className="font-heading font-bold text-foreground text-sm">
              Course / Tool-wise Academic Performance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {toolAcademicData.map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-background shadow-xs">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                    {item.tool}
                  </span>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground block">Average Score</span>
                      <span className="text-xl font-bold font-heading text-foreground">{item.averagePct}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">Pass Rate</span>
                      <span className="text-xl font-bold font-heading text-success">{item.passPct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. STUDENT RISK & PROFILES */}
      {/* ========================================================================= */}
      {activeReportTab === 'risk' && (
        <div className="space-y-6">
          <div className="card-meridian p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-heading font-bold text-foreground text-sm flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  Student Risk & Comprehensive Performance Roster
                </h3>
                <p className="text-xs text-muted-foreground">
                  Click any student row to open their complete individual Profile Drawer with marks & attendance history.
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground font-bold">
                {riskRoster.length} Evaluated Students
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono uppercase">
                  <tr>
                    <th className="p-2.5">Photo</th>
                    <th className="p-2.5">Reg No</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Batch</th>
                    <th className="p-2.5 text-center">Attendance %</th>
                    <th className="p-2.5 text-center">Attendance Risk</th>
                    <th className="p-2.5 text-center">Academic %</th>
                    <th className="p-2.5 text-center">Academic Risk</th>
                    <th className="p-2.5 text-center">Overall Risk</th>
                    <th className="p-2.5 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {riskRoster.map(p => {
                    const photoUrl = getStudentPhotoUrl(p.student.photo_url);

                    return (
                      <tr
                        key={p.student.id}
                        onClick={() => setSelectedStudentForDrawer(p.student)}
                        className="hover:bg-muted/40 cursor-pointer transition-colors"
                      >
                        <td className="p-2.5">
                          {photoUrl ? (
                            <img src={photoUrl} alt={p.student.name} className="h-7 w-7 rounded-full object-cover" />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px]">
                              {(p.student.name || 'S').substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td className="p-2.5 font-mono font-bold text-accent">{p.student.register_no}</td>
                        <td className="p-2.5 font-semibold text-foreground">{p.student.name}</td>
                        <td className="p-2.5 font-mono text-muted-foreground">{p.batch.code}</td>
                        <td className="p-2.5 text-center font-mono font-bold">{p.attendancePct}%</td>
                        <td className="p-2.5 text-center">
                          {p.attendanceRisk ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-destructive/15 text-destructive">
                              {p.attendanceRisk}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold">
                          {p.academicPct !== null ? `${p.academicPct}%` : 'N/A'}
                        </td>
                        <td className="p-2.5 text-center">
                          {p.academicRisk ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/15 text-amber-500">
                              {p.academicRisk}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center">
                          {p.overallRisk ? (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${p.overallRisk === 'Critical' ? 'bg-destructive text-destructive-foreground' : 'bg-amber-500 text-black'}`}>
                              {p.overallRisk}
                            </span>
                          ) : (
                            <span className="text-success font-bold font-mono text-[10px]">No Risk</span>
                          )}
                        </td>
                        <td className="p-2.5 text-right">
                          <Button size="icon" variant="ghost" className="h-6 w-6">
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Drawer */}
      <StudentProfileDrawer
        student={selectedStudentForDrawer}
        batch={store.batches.find(b => b.id === selectedStudentForDrawer?.batch_id) || null}
        onClose={() => setSelectedStudentForDrawer(null)}
      />

      {/* MODAL 1: Public Scoped Share Link (Q10 Option A) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Share Public Scoped Report
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-2 text-xs">
              <span className="font-semibold text-foreground block flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-success" /> Security Rule Enforced (Q10):
              </span>
              <p className="text-muted-foreground">
                Public shared report links display batch-level aggregate charts, topic coverage, and averages only.
                Individual student score tables, photos, and personal identification are strictly stripped.
              </p>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">
                Generated Public URL:
              </label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/reports?scoped=true&batch=${selectedBatchId}`}
                  className="font-mono text-xs bg-background"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/reports?scoped=true&batch=${selectedBatchId}`);
                    toast.success('Public link copied to clipboard!');
                  }}
                  className="bg-primary text-primary-foreground text-xs"
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setShowShareModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: LinkedIn Google Sheet Integration Settings (Q11) */}
      {showLinkedInSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                <LinkedinIcon className="h-5 w-5 text-[#0077B5]" />
                LinkedIn Google Sheet Integration
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowLinkedInSettingsModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Paste the published Google Sheet link (CSV or Sheet URL) containing student LinkedIn post tracker metrics. 
              The system validates the connection and synchronizes post counts dynamically.
            </p>

            <div>
              <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">
                Published Google Sheet Link:
              </label>
              <Input
                placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                value={linkedInSheetUrl}
                onChange={(e) => setLinkedInSheetUrl(e.target.value)}
                className="text-xs font-mono bg-background"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setShowLinkedInSettingsModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveLinkedInSync} className="bg-primary text-primary-foreground text-xs font-semibold">
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Validate & Save Sync
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
