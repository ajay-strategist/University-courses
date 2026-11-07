import { useState, useMemo } from 'react';
import { store } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { Student } from '@/types';
import {
  Building2,
  BookOpen,
  Layers,
  GraduationCap,
  Calendar,
  BarChart3,
  ChevronRight,
  Eye,
  UserCheck,
  Users,
  UserX,
  X,
  CalendarCheck
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // 1. DATE SELECTION (Defaults to Today, supports quick pick)
  // -------------------------------------------------------------
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const formatDateDDMMYYYY = (isoDate: string): string => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return isoDate;
  };

  // -------------------------------------------------------------
  // 2. SECTION 1: MASTER KPI CARDS
  // -------------------------------------------------------------
  // 1. Colleges
  const collegesCount = store.colleges.length;

  // 2. Active Batches
  const activeBatches = useMemo(
    () => store.batches.filter((b) => b.status === 'Active'),
    [store.batches]
  );
  const activeBatchesCount = activeBatches.length;

  // 3. Tools (Total configured tool courses)
  const toolsCount = store.courses.length;

  // 4. Current Sem Tools (Decision 2 - Option A: Distinct active tool courses in current semesters)
  const currentSemToolsCount = useMemo(() => {
    const activeBatchDetails = activeBatches.map((b) => store.getBatchWithDetails(b.id)!);
    const uniqueToolIds = new Set<string>();

    activeBatchDetails.forEach((b) => {
      const curSem = b.current_semester || 1;
      const curBatchCourses = store.batchCourses.filter(
        (bc) => bc.batch_id === b.id && bc.semester === curSem && bc.status !== 'Completed'
      );
      curBatchCourses.forEach((bc) => uniqueToolIds.add(bc.course_id));
    });

    return uniqueToolIds.size;
  }, [activeBatches, store.batchCourses]);

  // 5. Students (Total enrolled students)
  const totalStudentsCount = store.students.length;

  // -------------------------------------------------------------
  // 3. SECTION 2: TODAY'S CLASS ACTIVITY (BATCH-WISE)
  // -------------------------------------------------------------
  // Find sessions and trainer logs on the selected date
  const sessionsOnDate = useMemo(
    () => store.sessions.filter((s) => s.session_date === selectedDate),
    [store.sessions, selectedDate]
  );

  const trainerLogsOnDate = useMemo(
    () => store.trainerLogs.filter((t) => t.log_date === selectedDate),
    [store.trainerLogs, selectedDate]
  );

  // Discover all batches that have activity on the selected date
  const batchesWithActivity = useMemo(() => {
    const activeBatchIds = new Set<string>();

    sessionsOnDate.forEach((s) => {
      const bc = store.batchCourses.find((b) => b.id === s.batch_course_id);
      if (bc?.batch_id) activeBatchIds.add(bc.batch_id);
    });

    trainerLogsOnDate.forEach((t) => {
      const bc = store.batchCourses.find((b) => b.id === t.batch_course_id);
      if (bc?.batch_id) activeBatchIds.add(bc.batch_id);
    });

    return store.batches
      .filter((b) => activeBatchIds.has(b.id))
      .map((b) => store.getBatchWithDetails(b.id)!);
  }, [sessionsOnDate, trainerLogsOnDate, store.batches, store.batchCourses]);

  // Selected batch for activity view
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');

  // Active selected batch object
  const activeSelectedBatch = useMemo(() => {
    if (batchesWithActivity.length === 0) return null;
    const found = batchesWithActivity.find((b) => b.id === selectedBatchId);
    return found || batchesWithActivity[0];
  }, [batchesWithActivity, selectedBatchId]);

  // Sessions and attendance for the active selected batch on selectedDate
  const batchDayData = useMemo(() => {
    if (!activeSelectedBatch) return null;

    const batchCourseIds = store.batchCourses
      .filter((bc) => bc.batch_id === activeSelectedBatch.id)
      .map((bc) => bc.id);

    // Sessions for this batch on this day, sorted by hour
    const sessions = sessionsOnDate
      .filter((s) => batchCourseIds.includes(s.batch_course_id))
      .sort((a, b) => a.hour_no - b.hour_no);

    const sessionIds = sessions.map((s) => s.id);
    const dayAttendance = store.attendance.filter((a) => sessionIds.includes(a.session_id));

    // Batch students
    const batchStudents = store.students.filter((st) => st.batch_id === activeSelectedBatch.id);
    const studentCount = batchStudents.length;

    // Hour-wise rows
    const hourRows = sessions.map((sess) => {
      const sessAtt = dayAttendance.filter((a) => a.session_id === sess.id);
      const presentCount = sessAtt.filter((a) => a.status === 'present' || a.status === 'late').length;
      const absentCount = sessAtt.filter((a) => a.status === 'absent').length;
      const totalRecorded = sessAtt.length;
      const attPct = totalRecorded > 0 ? (presentCount / totalRecorded) * 100 : 0;

      const absentStudentIds = sessAtt.filter((a) => a.status === 'absent').map((a) => a.student_id);
      const absentees = batchStudents.filter((st) => absentStudentIds.includes(st.id));

      return {
        session: sess,
        hourNo: sess.hour_no,
        presentCount,
        absentCount,
        attPct,
        absentees
      };
    });

    // Decision 1 - Option A (Aggregate / Weighted Attendance):
    // (Total Present Marks across all hours) / (Total Attendance Opportunities) * 100
    const totalPresentMarks = hourRows.reduce((acc, h) => acc + h.presentCount, 0);
    const totalSlots = hourRows.reduce((acc, h) => acc + (h.presentCount + h.absentCount), 0);
    const averageAttendancePct = totalSlots > 0 ? (totalPresentMarks / totalSlots) * 100 : 0;

    // Summary card figures (if single hour, use hour; if multi-hour, average per hour)
    const summaryPresent = hourRows.length > 0 ? Math.round(totalPresentMarks / hourRows.length) : 0;
    const summaryAbsent = studentCount - summaryPresent;

    // Trainer logs for this batch on selectedDate
    // Consolidate multi-hour trainer logs into ONE entry per specification
    const rawTrainerLogs = trainerLogsOnDate.filter((t) => batchCourseIds.includes(t.batch_course_id));

    const consolidatedLogs = rawTrainerLogs.map((log) => {
      const bc = store.batchCourses.find((b) => b.id === log.batch_course_id);
      const course = store.courses.find((c) => c.id === bc?.course_id);

      // Associated hours from matching sessions on this date
      const matchingHours = sessions
        .filter((s) => s.batch_course_id === log.batch_course_id)
        .map((s) => s.hour_no)
        .sort((a, b) => a - b);

      let hourLabel = 'Class Session';
      if (matchingHours.length === 1) {
        hourLabel = `Hour ${matchingHours[0]}`;
      } else if (matchingHours.length > 1) {
        hourLabel = `Hour ${matchingHours[0]} - ${matchingHours[matchingHours.length - 1]}`;
      }

      // Resolved topics
      const syllabusItems = store.batchSyllabus.filter((s) => s.batch_course_id === log.batch_course_id);
      const topicsCoveredNames = (log.topics_covered || [])
        .map((tid) => syllabusItems.find((sy) => sy.id === tid)?.topic_name)
        .filter(Boolean) as string[];

      const topicDescription =
        topicsCoveredNames.length > 0
          ? `${course?.name || 'Course'} - ${topicsCoveredNames.slice(0, 2).join(', ')}${
              topicsCoveredNames.length > 2 ? ` (+${topicsCoveredNames.length - 2} more)` : ''
            }`
          : course?.name || 'Class Session';

      return {
        id: log.id,
        trainerName: log.trainer_name || 'Assigned Trainer',
        startTime: log.start_time,
        endTime: log.end_time,
        hourLabel,
        topicDescription
      };
    });

    return {
      studentCount,
      summaryPresent,
      summaryAbsent,
      averageAttendancePct,
      hourRows,
      consolidatedLogs
    };
  }, [activeSelectedBatch, sessionsOnDate, trainerLogsOnDate, store.batchCourses, store.students, store.attendance, store.batchSyllabus, store.courses]);

  // -------------------------------------------------------------
  // 4. SECTION 3: ACTIVE BATCHES OVERVIEW TABLE
  // -------------------------------------------------------------
  const activeBatchesOverview = useMemo(() => {
    return activeBatches.map((b) => {
      const detailed = store.getBatchWithDetails(b.id)!;
      const curSem = detailed.current_semester || 1;

      // Find current semester batch courses
      const curSemBCs = store.batchCourses.filter(
        (bc) => bc.batch_id === b.id && bc.semester === curSem
      );
      const curSemBCIds = curSemBCs.map((bc) => bc.id);

      // Current Avg Attendance % for Current Semester
      const curSemSessions = store.sessions.filter((s) => curSemBCIds.includes(s.batch_course_id));
      const curSemSessionIds = curSemSessions.map((s) => s.id);
      const curSemAtt = store.attendance.filter((a) => curSemSessionIds.includes(a.session_id));
      const curSemPresent = curSemAtt.filter((a) => a.status === 'present' || a.status === 'late').length;

      const currentAvgAttendancePct =
        curSemAtt.length > 0
          ? (curSemPresent / curSemAtt.length) * 100
          : detailed.avg_attendance_pct || 0;

      // Current Semester Topic Coverage % (EXACT LABEL REQUIRED)
      const curSemSyllabus = store.batchSyllabus.filter((s) => curSemBCIds.includes(s.batch_course_id));
      const completedTopics = curSemSyllabus.filter((s) => s.is_completed).length;

      const currentSemTopicCoveragePct =
        curSemSyllabus.length > 0
          ? (completedTopics / curSemSyllabus.length) * 100
          : 0;

      return {
        id: b.id,
        code: b.code,
        collegeName: detailed.college?.name || 'Assigned College',
        currentSemester: curSem,
        studentCount: detailed.student_count || 0,
        currentAvgAttendancePct,
        currentSemTopicCoveragePct
      };
    });
  }, [activeBatches, store.batchCourses, store.sessions, store.attendance, store.batchSyllabus]);

  // -------------------------------------------------------------
  // 5. ABSENTEE DETAILS MODAL (Decision 4 - Option A)
  // -------------------------------------------------------------
  const [absenteeModal, setAbsenteeModal] = useState<{
    batchCode: string;
    hourNo: number;
    date: string;
    absentees: Student[];
  } | null>(null);

  // Quick helper to jump to latest active date
  const handleJumpToLatestActiveDate = () => {
    setSelectedDate('2026-11-06');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight">
            Operational Console Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Academic operations, batch activity, and performance insights at a glance.
          </p>
        </div>
        <Button
          onClick={() => navigate('/reports')}
          className="bg-[#103C35] hover:bg-[#21483D] text-white shadow-sm transition-colors font-medium"
        >
          <BarChart3 className="h-4 w-4 mr-2" /> Open Power BI Report Layer
        </Button>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: MASTER KPI CARDS                                */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Colleges */}
        <div className="card-meridian p-4 border-l-4 border-l-[#103C35] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Colleges
            </span>
            <span className="text-3xl font-bold font-mono text-foreground tracking-tight block">
              {collegesCount}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-[#103C35]/10 flex items-center justify-center text-[#103C35]">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        {/* 2. Active Batches */}
        <div className="card-meridian p-4 border-l-4 border-l-[#D99A20] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Active Batches
            </span>
            <span className="text-3xl font-bold font-mono text-foreground tracking-tight block">
              {activeBatchesCount}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-[#D99A20]/15 flex items-center justify-center text-[#D99A20]">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        {/* 3. Tools */}
        <div className="card-meridian p-4 border-l-4 border-l-teal-600 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Tools
            </span>
            <span className="text-3xl font-bold font-mono text-foreground tracking-tight block">
              {toolsCount}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* 4. Current Sem Tools */}
        <div className="card-meridian p-4 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Current Sem Tools
            </span>
            <span className="text-3xl font-bold font-mono text-foreground tracking-tight block">
              {currentSemToolsCount}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* 5. Students */}
        <div className="card-meridian p-4 border-l-4 border-l-[#103C35] flex items-center justify-between col-span-2 sm:col-span-1">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Students
            </span>
            <span className="text-3xl font-bold font-mono text-foreground tracking-tight block">
              {totalStudentsCount.toLocaleString()}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-[#103C35]/10 flex items-center justify-center text-[#103C35]">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: TODAY'S CLASS ACTIVITY (BATCH-WISE)            */}
      {/* ========================================================= */}
      <div className="card-meridian p-5 sm:p-6 space-y-5">
        {/* Section Header with Date Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-[#103C35]" />
            <h2 className="text-lg font-bold font-heading text-foreground">
              Today's Class Activity (Batch-wise)
            </h2>
          </div>

          {/* Date Picker & Jump Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-border/70 text-xs font-mono text-foreground">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold">
                {selectedDate === todayStr ? 'Today, ' : ''}
                {formatDateDDMMYYYY(selectedDate)}
              </span>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-border/70 bg-background text-foreground font-mono cursor-pointer"
              title="Select date"
            />

            {selectedDate !== '2026-11-06' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleJumpToLatestActiveDate}
                className="text-xs h-8 text-[#103C35] hover:text-[#103C35] hover:bg-[#103C35]/10 border-[#103C35]/30"
              >
                View Latest Activity (06-11-2026)
              </Button>
            )}

            {selectedDate !== todayStr && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(todayStr)}
                className="text-xs h-8 text-muted-foreground"
              >
                Reset to Today
              </Button>
            )}
          </div>
        </div>

        {/* Body: Activity Content or Clean Empty State */}
        {batchesWithActivity.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-muted/30 border border-dashed border-border flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                No class activity recorded for {formatDateDDMMYYYY(selectedDate)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                No session attendance or trainer logs are scheduled or marked for this date. You can select another date using the date selector above.
              </p>
            </div>
            <Button
              onClick={handleJumpToLatestActiveDate}
              className="bg-[#103C35] hover:bg-[#21483D] text-white text-xs mt-2"
            >
              Inspect Latest Active Class Day (06-11-2026)
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 3.1 Batch Selection List (Left Column) */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block px-1">
                Active Cohorts Today ({batchesWithActivity.length})
              </span>
              <div className="space-y-2">
                {batchesWithActivity.map((b) => {
                  const isSelected = activeSelectedBatch?.id === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBatchId(b.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#D99A20]/10 border-[#D99A20] shadow-xs'
                          : 'bg-background hover:bg-muted/50 border-border/70'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div
                          className={`font-heading font-bold text-sm ${
                            isSelected ? 'text-foreground' : 'text-foreground/90'
                          }`}
                        >
                          {b.code}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {b.college?.name || 'Marian College'}
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          isSelected ? 'text-[#D99A20] translate-x-0.5' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3.2 Right Column: Batch Details & Activity Breakdown */}
            {activeSelectedBatch && batchDayData && (
              <div className="lg:col-span-8 xl:col-span-9 space-y-4">
                {/* Batch Summary Header Bar */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/70 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-foreground">
                      {activeSelectedBatch.code}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {activeSelectedBatch.college?.name} &bull; Semester {activeSelectedBatch.current_semester}
                    </p>
                  </div>

                  {/* Stat Chips */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono">
                    {/* Students */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background border border-border/60">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase leading-none">Students</span>
                        <span className="font-bold text-foreground leading-tight mt-0.5">
                          {batchDayData.studentCount}
                        </span>
                      </div>
                    </div>

                    {/* Present */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background border border-border/60">
                      <UserCheck className="h-4 w-4 text-emerald-600" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase leading-none">Present</span>
                        <span className="font-bold text-emerald-600 leading-tight mt-0.5">
                          {batchDayData.summaryPresent}
                        </span>
                      </div>
                    </div>

                    {/* Absent */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background border border-border/60">
                      <UserX className="h-4 w-4 text-rose-600" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase leading-none">Absent</span>
                        <span className="font-bold text-rose-600 leading-tight mt-0.5">
                          {batchDayData.summaryAbsent}
                        </span>
                      </div>
                    </div>

                    {/* Attendance % */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background border border-border/60">
                      <BarChart3 className="h-4 w-4 text-[#103C35]" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase leading-none">Attendance</span>
                        <span className="font-bold text-[#103C35] dark:text-emerald-400 leading-tight mt-0.5">
                          {batchDayData.averageAttendancePct.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-grid: Trainer Log (Left) vs Hour-wise Attendance (Right) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                  {/* 3.4 Trainer Log – Today's Activity */}
                  <div className="xl:col-span-6 p-4 rounded-xl border border-border/70 bg-background space-y-3">
                    <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                      <UserCheck className="h-4 w-4 text-[#103C35]" />
                      <span>Trainer Log (Today)</span>
                    </div>

                    {batchDayData.consolidatedLogs.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground italic">
                        No trainer log entries recorded for this batch today.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {batchDayData.consolidatedLogs.map((log) => (
                          <div
                            key={log.id}
                            className="p-3 rounded-lg bg-muted/40 border border-border/50 flex items-start justify-between gap-3"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                {log.hourLabel}
                              </span>
                              <div className="space-y-0.5">
                                <div className="text-xs font-bold text-foreground">
                                  {log.trainerName}
                                </div>
                                <div className="text-[11px] text-muted-foreground font-mono">
                                  {log.startTime} &ndash; {log.endTime}
                                </div>
                              </div>
                            </div>
                            <div className="text-right max-w-[180px]">
                              <div className="text-xs font-medium text-foreground truncate" title={log.topicDescription}>
                                {log.topicDescription}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3.2 Hour-wise Attendance & 3.3 Average Attendance */}
                  <div className="xl:col-span-6 p-4 rounded-xl border border-border/70 bg-background space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                        <BarChart3 className="h-4 w-4 text-[#103C35]" />
                        <span>Hour-wise Attendance</span>
                      </div>
                    </div>

                    {batchDayData.hourRows.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground italic">
                        No hour-wise session attendance recorded for this batch today.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-border/60 text-muted-foreground font-mono uppercase text-[10px]">
                                <th className="text-left pb-2 font-semibold">Hour</th>
                                <th className="text-center pb-2 font-semibold">Present</th>
                                <th className="text-center pb-2 font-semibold">Absent</th>
                                <th className="text-center pb-2 font-semibold">Attendance</th>
                                <th className="text-right pb-2 font-semibold">Absentees</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                              {batchDayData.hourRows.map((row) => (
                                <tr key={row.session.id} className="hover:bg-muted/30">
                                  <td className="py-2.5 font-bold text-foreground">
                                    Hour {row.hourNo}
                                  </td>
                                  <td className="py-2.5 text-center font-mono text-emerald-600 font-medium">
                                    {row.presentCount}
                                  </td>
                                  <td className="py-2.5 text-center font-mono text-rose-600 font-medium">
                                    {row.absentCount}
                                  </td>
                                  <td className="py-2.5 text-center font-mono font-bold text-foreground">
                                    {row.attPct.toFixed(2)}%
                                  </td>
                                  <td className="py-2.5 text-right">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setAbsenteeModal({
                                          batchCode: activeSelectedBatch.code,
                                          hourNo: row.hourNo,
                                          date: selectedDate,
                                          absentees: row.absentees
                                        })
                                      }
                                      className="p-1 rounded-md text-muted-foreground hover:text-[#103C35] hover:bg-muted transition-colors cursor-pointer"
                                      title={`View absentees for Hour ${row.hourNo}`}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* 3.3 Average Attendance Card */}
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                              Average Attendance
                            </span>
                            <span className="text-[10px] text-emerald-800/80 dark:text-emerald-300/80 block">
                              Aggregate weighted attendance across all hours
                            </span>
                          </div>
                          <div className="text-2xl font-bold font-mono text-[#103C35] dark:text-emerald-400">
                            {batchDayData.averageAttendancePct.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: ACTIVE BATCHES OVERVIEW                        */}
      {/* ========================================================= */}
      <div className="card-meridian p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
          <Layers className="h-5 w-5 text-[#103C35]" />
          <h2 className="text-lg font-bold font-heading text-foreground">
            Active Batches Overview
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-mono uppercase text-[11px]">
                <th className="text-left pb-3 font-semibold">Batch</th>
                <th className="text-left pb-3 font-semibold">College</th>
                <th className="text-center pb-3 font-semibold">Current Semester</th>
                <th className="text-center pb-3 font-semibold">Students</th>
                <th className="text-left pb-3 font-semibold min-w-[180px]">Current Avg. Attendance %</th>
                {/* MANDATORY EXACT LABEL PER SECTION 4 */}
                <th className="text-left pb-3 font-semibold min-w-[200px]">Current Semester Topic Coverage %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {activeBatchesOverview.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/batches/${item.id}`)}
                  className="hover:bg-muted/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 font-bold font-heading text-foreground group-hover:text-[#103C35] transition-colors">
                    {item.code}
                  </td>
                  <td className="py-3.5 text-muted-foreground">
                    {item.collegeName}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      Semester {item.currentSemester}
                    </span>
                  </td>
                  <td className="py-3.5 text-center font-mono font-medium text-foreground">
                    {item.studentCount}
                  </td>
                  {/* Current Avg. Attendance % with Progress Bar */}
                  <td className="py-3.5">
                    <div className="space-y-1.5 max-w-[180px]">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-foreground">
                          {item.currentAvgAttendancePct.toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-[#103C35] rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, item.currentAvgAttendancePct))}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  {/* Current Semester Topic Coverage % with Progress Bar */}
                  <td className="py-3.5">
                    <div className="space-y-1.5 max-w-[200px]">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-foreground">
                          {item.currentSemTopicCoveragePct.toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-[#103C35] rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, item.currentSemTopicCoveragePct))}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. ABSENTEE DETAILS MODAL (Decision 4 - Option A)          */}
      {/* ========================================================= */}
      {absenteeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
        >
          <div className="bg-background rounded-2xl border border-border shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-border/60 flex items-start justify-between gap-4 bg-muted/30">
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">
                  Absentee Details &ndash; {absenteeModal.batchCode}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Hour {absenteeModal.hourNo} &bull; Date: {formatDateDDMMYYYY(absenteeModal.date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAbsenteeModal(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Absentees Table */}
            <div className="p-5 overflow-y-auto flex-1">
              {absenteeModal.absentees.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  Full attendance recorded! No absentees for this hour.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Total Absentees:</span>
                    <span className="font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                      {absenteeModal.absentees.length} Students
                    </span>
                  </div>

                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground font-mono uppercase text-[10px]">
                        <th className="text-left pb-2 font-semibold">Register No</th>
                        <th className="text-left pb-2 font-semibold">Student Name</th>
                        <th className="text-left pb-2 font-semibold">Class</th>
                        <th className="text-right pb-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {absenteeModal.absentees.map((st) => (
                        <tr key={st.id} className="hover:bg-muted/30">
                          <td className="py-2.5 font-mono font-bold text-[#103C35] dark:text-emerald-400">
                            {st.register_no || '—'}
                          </td>
                          <td className="py-2.5 font-medium text-foreground">
                            {st.name}
                          </td>
                          <td className="py-2.5 text-muted-foreground font-mono">
                            {st.class || '—'}
                          </td>
                          <td className="py-2.5 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                              Absent
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border/60 bg-muted/20 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAbsenteeModal(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
