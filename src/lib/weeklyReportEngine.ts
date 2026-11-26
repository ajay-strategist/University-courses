import type {
  Batch,
  BatchCoordinatorMapping,
  BatchCourse,
  College,
  Course,
  Profile,
  Session,
  Attendance,
  Assessment,
  AssessmentMark,
  Student,
  TrainerLog,
  AcademicSemester,
} from '@/types';

export type WeeklyApprovalMode = 'with_approval' | 'without_approval';

export interface WeeklyReportDataset {
  batches: Batch[];
  colleges: College[];
  courses: Course[];
  batchCourses: BatchCourse[];
  batchCoordinators: BatchCoordinatorMapping[];
  profiles: Profile[];
  students: Student[];
  sessions: Session[];
  attendance: Attendance[];
  assessments: Assessment[];
  assessmentMarks: AssessmentMark[];
  trainerLogs: TrainerLog[];
  academicSemesters?: AcademicSemester[];
  ceoEmail?: string;
}

export interface DateWiseHourCell {
  hourNo: number;
  present: number;
  absent: number;
  pct: number | null;
}

export interface DateWiseRow {
  date: string; // YYYY-MM-DD
  formattedDate: string; // DD-MM-YYYY
  hours: Record<number, DateWiseHourCell>;
  dayAttendancePct: number | null;
  totalHoursDelivered: number;
}

export interface RepeatedAbsenteeItem {
  student: Student;
  absentHoursCount: number;
  datesAbsent: string[];
}

export interface WeeklyAssessmentSummary {
  id: string;
  name: string;
  category: string;
  avgScorePct: number | null;
  passPct: number | null;
  failedCount: number;
}

export interface FailedStudentItem {
  student: Student;
  assessmentName: string;
  mark: number;
  maxMark: number;
  pct: number;
}

export interface WeeklyRiskSummaryRow {
  student: Student;
  overallAttendancePct: number;
  weekAttendancePct: number | null;
  weekSessionsAbsent: number;
  categoryStats: Record<string, { avgPct: number | null; passPct: number | null }>;
  attendanceRisk: 'Critical' | 'At Risk' | null;
  academicRisk: 'Critical' | 'At Risk' | null;
}

export interface WeeklyToolReport {
  key: string; // `${batch.id}_${course.id}`
  batch: Batch;
  college: College | undefined;
  course: Course;
  batchCourse: BatchCourse;
  semester: number;
  weekStart: string; // Mon YYYY-MM-DD
  weekEnd: string;   // Sat YYYY-MM-DD
  prevWeekStart: string;
  prevWeekEnd: string;
  toRecipients: string[];
  ccRecipients: string[];
  // 7 KPIs
  totalStudents: number;
  overallAttendancePct: number | null;
  prevWeekAttendancePct: number | null;
  currWeekAttendancePct: number | null;
  variationPct: number | null;
  totalHoursDelivered: number;
  currWeekHoursDelivered: number;
  // Section 1: Date Wise Details
  hourColumns: number[];
  dateWiseRows: DateWiseRow[];
  // Section 2: Repeated Absentees
  repeatedAbsentees: RepeatedAbsenteeItem[];
  // Section 3: Assessments & Failed Students
  weeklyAssessments: WeeklyAssessmentSummary[];
  failedStudents: FailedStudentItem[];
  // Section 4: Risk Summary
  riskCategories: string[];
  riskRows: WeeklyRiskSummaryRow[];
  // Meta
  subject: string;
  html: string;
}

/**
 * Pure Google Drive / direct image URL resolver (safe in both browser & Node.js)
 */
export function resolveStudentPhotoUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  const trimmed = String(rawUrl).trim();
  if (!trimmed) return null;

  const idMatch =
    trimmed.match(/\/d\/([a-zA-Z0-9_-]{25,})/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/);

  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}=s200`;
  }
  return trimmed;
}

export function formatIsoToDDMMYYYY(iso: string): string {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return iso;
}

function toLocalIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Given any reference date (YYYY-MM-DD or Date), returns the Mon–Sat reporting week
 * and the previous Mon–Sat week.
 */
export function getReportingWeekRange(refDate?: string | Date): {
  weekStart: string;
  weekEnd: string;
  prevWeekStart: string;
  prevWeekEnd: string;
} {
  const base = refDate
    ? typeof refDate === 'string'
      ? new Date(`${refDate}T12:00:00`)
      : new Date(refDate)
    : new Date();

  const dayOfWeek = base.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const mon = new Date(base);
  mon.setDate(base.getDate() + diffToMonday);

  const sat = new Date(mon);
  sat.setDate(mon.getDate() + 5);

  const prevMon = new Date(mon);
  prevMon.setDate(mon.getDate() - 7);

  const prevSat = new Date(mon);
  prevSat.setDate(mon.getDate() - 2);

  return {
    weekStart: toLocalIsoDate(mon),
    weekEnd: toLocalIsoDate(sat),
    prevWeekStart: toLocalIsoDate(prevMon),
    prevWeekEnd: toLocalIsoDate(prevSat),
  };
}

function getEffectiveSemesterForBatch(batch: Batch, dataset: WeeklyReportDataset): number {
  if (dataset.academicSemesters && dataset.academicSemesters.length > 0) {
    const today = toLocalIsoDate(new Date());
    const active = dataset.academicSemesters.find(
      (s) =>
        s.college_id === batch.college_id &&
        s.program_id === batch.program_id &&
        s.academic_year === batch.academic_year &&
        s.start_date <= today &&
        s.end_date >= today
    );
    if (active) return active.semester_no;
  }
  return batch.current_semester || 1;
}

/**
 * Computes Per-Batch + Per-Active-Current-Semester-Tool Weekly Reports.
 * Activity Gate: Only returns reports for tools that had at least 1 session,
 * trainer log, or assessment during [weekStart, weekEnd].
 */
export function buildWeeklyToolReports(
  dataset: WeeklyReportDataset,
  refDate?: string | Date
): WeeklyToolReport[] {
  const { weekStart, weekEnd, prevWeekStart, prevWeekEnd } = getReportingWeekRange(refDate);
  const reports: WeeklyToolReport[] = [];

  const adminEmails = dataset.profiles
    .filter((p) => p.role === 'admin' && p.email)
    .map((p) => p.email.trim());

  const ceoEmail = (dataset.ceoEmail || 'ceo@kvjanalytics.com').trim();

  for (const batch of dataset.batches) {
    if (batch.status !== 'Active') continue;

    const currentSem = getEffectiveSemesterForBatch(batch, dataset);
    const college = dataset.colleges.find((c) => c.id === batch.college_id);
    const batchStudents = dataset.students.filter((s) => s.batch_id === batch.id);

    // Resolve College Coordinators -> TO
    const ccMappings = dataset.batchCoordinators.filter(
      (m) => m.batch_id === batch.id && m.role === 'college_coordinator'
    );
    const ccIds =
      ccMappings.length > 0
        ? ccMappings.map((m) => m.profile_id)
        : batch.college_coordinator_id
        ? [batch.college_coordinator_id]
        : [];
    const toRecipients = Array.from(
      new Set(
        ccIds
          .map((id) => dataset.profiles.find((p) => p.id === id)?.email?.trim())
          .filter((e): e is string => !!e)
      )
    );
    if (toRecipients.length === 0 && college?.contact_email) {
      toRecipients.push(college.contact_email.trim());
    }

    // Current Semester Batch Courses
    const semBatchCourses = dataset.batchCourses.filter(
      (bc) => bc.batch_id === batch.id && Number(bc.semester) === Number(currentSem)
    );

    for (const bc of semBatchCourses) {
      const course = dataset.courses.find((c) => c.id === bc.course_id);
      if (!course) continue;

      const toolSessionsAll = dataset.sessions.filter((s) => s.batch_course_id === bc.id);
      const toolSessionsWeek = toolSessionsAll.filter(
        (s) => s.session_date >= weekStart && s.session_date <= weekEnd
      );
      const toolSessionsPrevWeek = toolSessionsAll.filter(
        (s) => s.session_date >= prevWeekStart && s.session_date <= prevWeekEnd
      );

      const toolLogsAll = dataset.trainerLogs.filter(
        (l) =>
          l.batch_course_id === bc.id &&
          l.log_type !== 'missed' &&
          !l.notes?.startsWith('[MISSED:')
      );
      const toolLogsWeek = toolLogsAll.filter(
        (l) => l.log_date >= weekStart && l.log_date <= weekEnd
      );

      const toolAssessmentsAll = dataset.assessments.filter((a) => a.batch_course_id === bc.id);
      const toolAssessmentsWeek = toolAssessmentsAll.filter(
        (a) => !!a.assessment_date && a.assessment_date >= weekStart && a.assessment_date <= weekEnd
      );

      // ACTIVITY GATE: Skip if zero activity this week for this tool
      const hasActivity =
        toolSessionsWeek.length > 0 || toolLogsWeek.length > 0 || toolAssessmentsWeek.length > 0;
      if (!hasActivity) continue;

      // CC: Assigned Trainer + Admin + CEO
      const trainerEmail = bc.trainer_id
        ? dataset.profiles.find((p) => p.id === bc.trainer_id)?.email?.trim()
        : undefined;
      const ccRecipients = Array.from(
        new Set(
          [trainerEmail, ...adminEmails, ceoEmail].filter(
            (e): e is string => !!e && !toRecipients.includes(e)
          )
        )
      );

      // Helper for attendance % over a set of sessions
      const calcAttPctForSessions = (sessList: Session[]): number | null => {
        if (sessList.length === 0) return null;
        const sessIds = new Set(sessList.map((s) => s.id));
        const recs = dataset.attendance.filter((a) => sessIds.has(a.session_id));
        if (recs.length === 0) return null;
        const present = recs.filter((a) => a.status === 'present' || a.status === 'late').length;
        return Math.round((present / recs.length) * 1000) / 10;
      };

      const overallAttendancePct = calcAttPctForSessions(toolSessionsAll);
      const prevWeekAttendancePct = calcAttPctForSessions(toolSessionsPrevWeek);
      const currWeekAttendancePct = calcAttPctForSessions(toolSessionsWeek);
      const variationPct =
        currWeekAttendancePct !== null && prevWeekAttendancePct !== null
          ? Math.round((currWeekAttendancePct - prevWeekAttendancePct) * 10) / 10
          : null;

      const totalHoursDelivered =
        Math.round((toolLogsAll.reduce((acc, l) => acc + (l.duration_minutes || 0), 0) / 60) * 10) /
        10;
      const currWeekHoursDelivered =
        Math.round((toolLogsWeek.reduce((acc, l) => acc + (l.duration_minutes || 0), 0) / 60) * 10) /
        10;

      // Section 1: Date Wise Details
      const weekDatesSet = new Set<string>([
        ...toolSessionsWeek.map((s) => s.session_date),
        ...toolLogsWeek.map((l) => l.log_date),
      ]);
      const sortedWeekDates = Array.from(weekDatesSet).sort();

      const hourSet = new Set<number>();
      toolSessionsWeek.forEach((s) => hourSet.add(Number(s.hour_no)));
      const hourColumns = Array.from(hourSet).sort((a, b) => a - b);

      const dateWiseRows: DateWiseRow[] = sortedWeekDates.map((date) => {
        const daySessions = toolSessionsWeek.filter((s) => s.session_date === date);
        const hoursMap: Record<number, DateWiseHourCell> = {};
        let dayTotalPresent = 0;
        let dayTotalRecorded = 0;

        daySessions.forEach((sess) => {
          const hNo = Number(sess.hour_no);
          const recs = dataset.attendance.filter((a) => a.session_id === sess.id);
          const present = recs.filter((a) => a.status === 'present' || a.status === 'late').length;
          const absent = recs.filter((a) => a.status === 'absent').length;
          const total = present + absent;
          dayTotalPresent += present;
          dayTotalRecorded += total;
          hoursMap[hNo] = {
            hourNo: hNo,
            present,
            absent,
            pct: total > 0 ? Math.round((present / total) * 1000) / 10 : null,
          };
        });

        const dayLogs = toolLogsWeek.filter((l) => l.log_date === date);
        const dayHours =
          Math.round((dayLogs.reduce((acc, l) => acc + (l.duration_minutes || 0), 0) / 60) * 10) / 10;

        return {
          date,
          formattedDate: formatIsoToDDMMYYYY(date),
          hours: hoursMap,
          dayAttendancePct:
            dayTotalRecorded > 0 ? Math.round((dayTotalPresent / dayTotalRecorded) * 1000) / 10 : null,
          totalHoursDelivered: dayHours,
        };
      });

      // Section 2: Repeated Absentees (students absent 2+ sessions this week, or 1+ if only 1 session held)
      const weekSessionIds = new Set(toolSessionsWeek.map((s) => s.id));
      const repeatedAbsentees: RepeatedAbsenteeItem[] = [];
      for (const stu of batchStudents) {
        const absentRecs = dataset.attendance.filter(
          (a) => weekSessionIds.has(a.session_id) && a.student_id === stu.id && a.status === 'absent'
        );
        if (absentRecs.length >= (toolSessionsWeek.length <= 1 ? 1 : 2)) {
          const datesAbsent = Array.from(
            new Set(
              absentRecs
                .map((a) => toolSessionsWeek.find((s) => s.id === a.session_id)?.session_date)
                .filter((d): d is string => !!d)
            )
          ).sort();
          repeatedAbsentees.push({
            student: stu,
            absentHoursCount: absentRecs.length,
            datesAbsent,
          });
        }
      }
      repeatedAbsentees.sort((a, b) => b.absentHoursCount - a.absentHoursCount);

      // Section 3: Assessments & Failed Students (Pass threshold = 40%)
      const PASS_THRESHOLD = 40;
      const weeklyAssessments: WeeklyAssessmentSummary[] = [];
      const failedStudents: FailedStudentItem[] = [];

      for (const asm of toolAssessmentsWeek) {
        const marks = dataset.assessmentMarks.filter((m) => m.assessment_id === asm.id);
        const maxM = asm.max_mark > 0 ? asm.max_mark : 100;
        let pctSum = 0;
        let passed = 0;
        let failed = 0;

        for (const m of marks) {
          if (m.mark === undefined || m.mark === null) continue;
          const pct = Math.round(((m.mark / maxM) * 100) * 10) / 10;
          pctSum += pct;
          if (pct >= PASS_THRESHOLD) {
            passed++;
          } else {
            failed++;
            const stu = batchStudents.find((s) => s.id === m.student_id);
            if (stu) {
              failedStudents.push({
                student: stu,
                assessmentName: asm.name,
                mark: m.mark,
                maxMark: maxM,
                pct,
              });
            }
          }
        }

        const totalAssessed = passed + failed;
        weeklyAssessments.push({
          id: asm.id,
          name: asm.name,
          category: asm.assignment_category || 'Assessment',
          avgScorePct: totalAssessed > 0 ? Math.round((pctSum / totalAssessed) * 10) / 10 : null,
          passPct: totalAssessed > 0 ? Math.round((passed / totalAssessed) * 1000) / 10 : null,
          failedCount: failed,
        });
      }

      // Section 4: Risk Summary (Current Semester + Tool)
      const riskCategories = Array.from(
        new Set(toolAssessmentsAll.map((a) => a.assignment_category || 'Assessment'))
      );
      const allToolSessionIds = new Set(toolSessionsAll.map((s) => s.id));
      const riskRows: WeeklyRiskSummaryRow[] = [];

      for (const stu of batchStudents) {
        // Overall attendance for this tool in current semester
        const stuAllRecs = dataset.attendance.filter(
          (a) => allToolSessionIds.has(a.session_id) && a.student_id === stu.id
        );
        const allPresent = stuAllRecs.filter((a) => a.status === 'present' || a.status === 'late').length;
        const stuOverallAttPct =
          stuAllRecs.length > 0 ? Math.round((allPresent / stuAllRecs.length) * 1000) / 10 : 100;

        // Current week attendance & absent count
        const stuWeekRecs = dataset.attendance.filter(
          (a) => weekSessionIds.has(a.session_id) && a.student_id === stu.id
        );
        const weekPresent = stuWeekRecs.filter(
          (a) => a.status === 'present' || a.status === 'late'
        ).length;
        const weekAbsent = stuWeekRecs.filter((a) => a.status === 'absent').length;
        const stuWeekAttPct =
          stuWeekRecs.length > 0 ? Math.round((weekPresent / stuWeekRecs.length) * 1000) / 10 : null;

        // Category-wise Avg & Pass %
        const categoryStats: Record<string, { avgPct: number | null; passPct: number | null }> = {};
        let totalAcadPctSum = 0;
        let totalAcadCount = 0;

        for (const cat of riskCategories) {
          const catAsms = toolAssessmentsAll.filter(
            (a) => (a.assignment_category || 'Assessment') === cat
          );
          let catSum = 0;
          let catPassed = 0;
          let catCount = 0;
          for (const asm of catAsms) {
            const m = dataset.assessmentMarks.find(
              (mk) => mk.assessment_id === asm.id && mk.student_id === stu.id
            );
            if (m && m.mark !== undefined && m.mark !== null) {
              const maxM = asm.max_mark > 0 ? asm.max_mark : 100;
              const pct = (m.mark / maxM) * 100;
              catSum += pct;
              totalAcadPctSum += pct;
              catCount++;
              totalAcadCount++;
              if (pct >= PASS_THRESHOLD) catPassed++;
            }
          }
          categoryStats[cat] = {
            avgPct: catCount > 0 ? Math.round((catSum / catCount) * 10) / 10 : null,
            passPct: catCount > 0 ? Math.round((catPassed / catCount) * 1000) / 10 : null,
          };
        }

        const stuAcadPct = totalAcadCount > 0 ? totalAcadPctSum / totalAcadCount : null;

        let attendanceRisk: 'Critical' | 'At Risk' | null = null;
        if (stuAllRecs.length > 0) {
          if (stuOverallAttPct < 60) attendanceRisk = 'Critical';
          else if (stuOverallAttPct < 75) attendanceRisk = 'At Risk';
        }

        let academicRisk: 'Critical' | 'At Risk' | null = null;
        if (stuAcadPct !== null) {
          if (stuAcadPct < 25) academicRisk = 'Critical';
          else if (stuAcadPct < 40) academicRisk = 'At Risk';
        }

        if (attendanceRisk !== null || academicRisk !== null) {
          riskRows.push({
            student: stu,
            overallAttendancePct: stuOverallAttPct,
            weekAttendancePct: stuWeekAttPct,
            weekSessionsAbsent: weekAbsent,
            categoryStats,
            attendanceRisk,
            academicRisk,
          });
        }
      }

      const partialReport = {
        key: `${batch.id}_${course.id}`,
        batch,
        college,
        course,
        batchCourse: bc,
        semester: currentSem,
        weekStart,
        weekEnd,
        prevWeekStart,
        prevWeekEnd,
        toRecipients,
        ccRecipients,
        totalStudents: batchStudents.length,
        overallAttendancePct,
        prevWeekAttendancePct,
        currWeekAttendancePct,
        variationPct,
        totalHoursDelivered,
        currWeekHoursDelivered,
        hourColumns,
        dateWiseRows,
        repeatedAbsentees,
        weeklyAssessments,
        failedStudents,
        riskCategories,
        riskRows,
        subject: `Weekly Summary - ${batch.code} (${course.name}) - ${formatIsoToDDMMYYYY(weekStart)} to ${formatIsoToDDMMYYYY(weekEnd)}`,
        html: '',
      };

      partialReport.html = generateWeeklySummaryEmailHtml(partialReport);
      reports.push(partialReport);
    }
  }

  return reports;
}

function renderEmailAvatar(name: string, photoUrl?: string | null): string {
  const resolved = resolveStudentPhotoUrl(photoUrl);
  const initials = (name || 'S')
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (resolved) {
    return `<img src="${resolved}" alt="${name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid #cbd5e1;vertical-align:middle;" />`;
  }
  return `<div style="display:inline-block;width:32px;height:32px;line-height:32px;border-radius:50%;background:linear-gradient(135deg,#0f766e,#0369a1);color:#ffffff;font-weight:bold;font-size:11px;text-align:center;vertical-align:middle;">${initials || 'ST'}</div>`;
}

function pctColor(pct: number | null): string {
  if (pct === null) return '#64748b';
  if (pct >= 85) return '#15803d';
  if (pct >= 75) return '#b45309';
  return '#dc2626';
}

export function generateWeeklySummaryEmailHtml(report: WeeklyToolReport): string {
  const {
    batch,
    college,
    course,
    semester,
    weekStart,
    weekEnd,
    totalStudents,
    overallAttendancePct,
    prevWeekAttendancePct,
    currWeekAttendancePct,
    variationPct,
    totalHoursDelivered,
    currWeekHoursDelivered,
    hourColumns,
    dateWiseRows,
    repeatedAbsentees,
    weeklyAssessments,
    failedStudents,
    riskCategories,
    riskRows,
  } = report;

  const variationText =
    variationPct === null ? '—' : `${variationPct >= 0 ? '+' : ''}${variationPct}%`;
  const variationColor =
    variationPct === null ? '#64748b' : variationPct >= 0 ? '#15803d' : '#dc2626';
  const variationBg =
    variationPct === null ? '#f1f5f9' : variationPct >= 0 ? '#dcfce7' : '#fee2e2';

  // Section 1: Date Wise Details Table
  const dateWiseHtml = `
    <div style="margin-top:24px;">
      <div style="display:flex;align-items:center;margin-bottom:10px;">
        <span style="display:inline-block;width:4px;height:18px;background:#0284c7;border-radius:2px;margin-right:8px;vertical-align:middle;"></span>
        <h2 style="margin:0;font-size:15px;font-weight:700;color:#0f172a;display:inline-block;vertical-align:middle;">Date Wise Details</h2>
      </div>
      ${
        dateWiseRows.length === 0
          ? `<div style="padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:12px;color:#64748b;">No sessions recorded during this week.</div>`
          : `
        <div style="overflow-x:auto;border:1px solid #cbd5e1;border-radius:12px;">
          <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
            <thead>
              <tr style="background:linear-gradient(90deg,#0f172a,#1e3a5f);color:#ffffff;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;">
                <th style="padding:10px 12px;">Date</th>
                ${hourColumns.map((h) => `<th style="padding:10px 8px;text-align:center;">H${h} (Attendance %)</th>`).join('')}
                <th style="padding:10px 10px;text-align:center;">Attendance %</th>
                <th style="padding:10px 12px;text-align:center;">Total Hours</th>
              </tr>
            </thead>
            <tbody>
              ${dateWiseRows
                .map((row, idx) => {
                  const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
                  return `
                  <tr style="background:${bg};border-bottom:1px solid #e2e8f0;">
                    <td style="padding:10px 12px;font-family:monospace;font-weight:700;color:#0f172a;white-space:nowrap;">${row.formattedDate}</td>
                    ${hourColumns
                      .map((h) => {
                        const cell = row.hours[h];
                        if (!cell || cell.pct === null) {
                          return `<td style="padding:8px;text-align:center;color:#94a3b8;">—</td>`;
                        }
                        return `
                          <td style="padding:8px;text-align:center;line-height:1.35;">
                            <div style="font-weight:800;font-size:12px;color:${pctColor(cell.pct)};">${cell.pct}%</div>
                            <div style="font-size:10px;font-family:monospace;margin-top:2px;">
                              <span style="color:#15803d;font-weight:700;">${cell.present} P</span>
                              <span style="color:#94a3b8;"> &middot; </span>
                              <span style="color:#dc2626;font-weight:700;">${cell.absent} A</span>
                            </div>
                          </td>
                        `;
                      })
                      .join('')}
                    <td style="padding:10px;text-align:center;font-weight:800;color:${pctColor(row.dayAttendancePct)};">
                      ${row.dayAttendancePct !== null ? `${row.dayAttendancePct}%` : '—'}
                    </td>
                    <td style="padding:10px 12px;text-align:center;font-family:monospace;font-weight:700;color:#0369a1;">
                      ${row.totalHoursDelivered} hrs
                    </td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      `
      }
    </div>
  `;

  // Section 2: Attendance & Repeated Absentees (This Week)
  const repeatedAbsenteesHtml = `
    <div style="margin-top:24px;">
      <div style="margin-bottom:10px;">
        <span style="display:inline-block;width:4px;height:18px;background:#d97706;border-radius:2px;margin-right:8px;vertical-align:middle;"></span>
        <h2 style="margin:0;font-size:15px;font-weight:700;color:#0f172a;display:inline-block;vertical-align:middle;">Attendance &amp; Repeated Absentees (This Week)</h2>
      </div>
      ${
        repeatedAbsentees.length === 0
          ? `<div style="padding:12px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;font-size:12px;color:#15803d;font-weight:600;">&#10003; Great news! No students had repeated absences during this week.</div>`
          : `
        <div style="overflow-x:auto;border:1px solid #fde68a;border-radius:12px;">
          <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
            <thead>
              <tr style="background:#fef3c7;color:#92400e;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;border-bottom:2px solid #fcd34d;">
                <th style="padding:9px 10px;text-align:center;width:44px;">Photo</th>
                <th style="padding:9px 10px;">Reg No</th>
                <th style="padding:9px 10px;">Student Name</th>
                <th style="padding:9px 10px;">Class</th>
                <th style="padding:9px 10px;text-align:center;">Hours Absent</th>
              </tr>
            </thead>
            <tbody>
              ${repeatedAbsentees
                .map((item, idx) => {
                  const bg = idx % 2 === 0 ? '#ffffff' : '#fffbeb';
                  return `
                  <tr style="background:${bg};border-bottom:1px solid #fef3c7;">
                    <td style="padding:8px 10px;text-align:center;">${renderEmailAvatar(item.student.name, item.student.photo_url)}</td>
                    <td style="padding:8px 10px;font-family:monospace;font-weight:700;color:#0284c7;">${item.student.register_no}</td>
                    <td style="padding:8px 10px;font-weight:600;color:#0f172a;">${item.student.name}</td>
                    <td style="padding:8px 10px;color:#64748b;font-family:monospace;">${item.student.class || '—'}</td>
                    <td style="padding:8px 10px;text-align:center;">
                      <span style="background:#fee2e2;color:#dc2626;padding:3px 10px;border-radius:9999px;font-weight:700;font-size:11px;">
                        ${item.absentHoursCount} ${item.absentHoursCount === 1 ? 'Hour' : 'Hours'}
                      </span>
                    </td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      `
      }
    </div>
  `;

  // Section 3: Assessments & Academic Snapshot (if conducted this week)
  const assessmentsHtml =
    weeklyAssessments.length === 0
      ? ''
      : `
    <div style="margin-top:24px;">
      <div style="margin-bottom:10px;">
        <span style="display:inline-block;width:4px;height:18px;background:#7c3aed;border-radius:2px;margin-right:8px;vertical-align:middle;"></span>
        <h2 style="margin:0;font-size:15px;font-weight:700;color:#0f172a;display:inline-block;vertical-align:middle;">Assessments &amp; Academic Snapshot (This Week)</h2>
      </div>
      <div style="overflow-x:auto;border:1px solid #ddd6fe;border-radius:12px;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
          <thead>
            <tr style="background:#ede9fe;color:#5b21b6;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;border-bottom:2px solid #c4b5fd;">
              <th style="padding:9px 12px;">Assessment Name</th>
              <th style="padding:9px 12px;">Category</th>
              <th style="padding:9px 10px;text-align:center;">Avg Score %</th>
              <th style="padding:9px 10px;text-align:center;">Pass %</th>
              <th style="padding:9px 10px;text-align:center;">No. of Failed</th>
            </tr>
          </thead>
          <tbody>
            ${weeklyAssessments
              .map((asm, idx) => {
                const bg = idx % 2 === 0 ? '#ffffff' : '#faf5ff';
                return `
                <tr style="background:${bg};border-bottom:1px solid #ede9fe;">
                  <td style="padding:9px 12px;font-weight:700;color:#0f172a;">${asm.name}</td>
                  <td style="padding:9px 12px;color:#6d28d9;font-weight:600;">${asm.category}</td>
                  <td style="padding:9px 10px;text-align:center;font-weight:700;color:${pctColor(asm.avgScorePct)};">
                    ${asm.avgScorePct !== null ? `${asm.avgScorePct}%` : '—'}
                  </td>
                  <td style="padding:9px 10px;text-align:center;font-weight:700;color:${pctColor(asm.passPct)};">
                    ${asm.passPct !== null ? `${asm.passPct}%` : '—'}
                  </td>
                  <td style="padding:9px 10px;text-align:center;">
                    <span style="background:${asm.failedCount > 0 ? '#fee2e2' : '#dcfce7'};color:${asm.failedCount > 0 ? '#dc2626' : '#15803d'};padding:2px 10px;border-radius:9999px;font-weight:700;font-size:11px;">
                      ${asm.failedCount}
                    </span>
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>

      ${
        failedStudents.length > 0
          ? `
        <div style="margin-top:12px;border:1px solid #fecaca;border-radius:12px;overflow-x:auto;">
          <div style="background:#fef2f2;padding:8px 12px;font-size:12px;font-weight:700;color:#b91c1c;border-bottom:1px solid #fecaca;">
            Failed Students List (${failedStudents.length})
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
            <thead>
              <tr style="background:#fff5f5;color:#991b1b;font-size:10px;text-transform:uppercase;border-bottom:1px solid #fecaca;">
                <th style="padding:8px 10px;text-align:center;width:44px;">Photo</th>
                <th style="padding:8px 10px;">Student Name</th>
                <th style="padding:8px 10px;">Assessment</th>
                <th style="padding:8px 10px;text-align:center;">Mark</th>
              </tr>
            </thead>
            <tbody>
              ${failedStudents
                .map((f, idx) => {
                  const bg = idx % 2 === 0 ? '#ffffff' : '#fffafa';
                  return `
                  <tr style="background:${bg};border-bottom:1px solid #fee2e2;">
                    <td style="padding:8px 10px;text-align:center;">${renderEmailAvatar(f.student.name, f.student.photo_url)}</td>
                    <td style="padding:8px 10px;">
                      <div style="font-weight:600;color:#0f172a;">${f.student.name}</div>
                      <div style="font-size:10px;font-family:monospace;color:#64748b;">${f.student.register_no}</div>
                    </td>
                    <td style="padding:8px 10px;color:#475569;">${f.assessmentName}</td>
                    <td style="padding:8px 10px;text-align:center;font-family:monospace;font-weight:700;color:#dc2626;">
                      ${f.mark} / ${f.maxMark} (${f.pct}%)
                    </td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      `
          : ''
      }
    </div>
  `;

  // Section 4: Risk Summary (Current Semester + Tool)
  const riskHtml = `
    <div style="margin-top:24px;">
      <div style="margin-bottom:10px;">
        <span style="display:inline-block;width:4px;height:18px;background:#dc2626;border-radius:2px;margin-right:8px;vertical-align:middle;"></span>
        <h2 style="margin:0;font-size:15px;font-weight:700;color:#0f172a;display:inline-block;vertical-align:middle;">Risk Summary (Semester ${semester} &bull; ${course.name})</h2>
      </div>
      ${
        riskRows.length === 0
          ? `<div style="padding:12px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;font-size:12px;color:#15803d;font-weight:600;">&#10003; No Critical or At-Risk students flagged for this tool in Semester ${semester}.</div>`
          : `
        <div style="overflow-x:auto;border:1px solid #fecaca;border-radius:12px;">
          <table style="width:100%;border-collapse:collapse;font-size:11px;text-align:left;">
            <thead>
              <tr style="background:linear-gradient(90deg,#991b1b,#b91c1c);color:#ffffff;font-size:10px;text-transform:uppercase;letter-spacing:0.3px;">
                <th style="padding:9px 8px;text-align:center;width:42px;">Photo</th>
                <th style="padding:9px 8px;">Reg No</th>
                <th style="padding:9px 8px;">Name</th>
                <th style="padding:9px 8px;text-align:center;">Attendance %</th>
                <th style="padding:9px 8px;text-align:center;">Current Week Att % &amp; Absent</th>
                ${riskCategories.map((cat) => `<th style="padding:9px 8px;text-align:center;">${cat}<br/><span style="font-weight:400;opacity:0.85;">(Avg &amp; Pass %)</span></th>`).join('')}
                <th style="padding:9px 8px;text-align:center;">Attendance Risk</th>
                <th style="padding:9px 8px;text-align:center;">Academic Risk</th>
              </tr>
            </thead>
            <tbody>
              ${riskRows
                .map((r, idx) => {
                  const bg = idx % 2 === 0 ? '#ffffff' : '#fff5f5';
                  const attRiskBadge =
                    r.attendanceRisk === 'Critical'
                      ? `<span style="background:#fee2e2;color:#b91c1c;padding:2px 8px;border-radius:9999px;font-weight:700;">Critical</span>`
                      : r.attendanceRisk === 'At Risk'
                      ? `<span style="background:#fef3c7;color:#b45309;padding:2px 8px;border-radius:9999px;font-weight:700;">At Risk</span>`
                      : `<span style="color:#94a3b8;">—</span>`;

                  const acadRiskBadge =
                    r.academicRisk === 'Critical'
                      ? `<span style="background:#fee2e2;color:#b91c1c;padding:2px 8px;border-radius:9999px;font-weight:700;">Critical</span>`
                      : r.academicRisk === 'At Risk'
                      ? `<span style="background:#fef3c7;color:#b45309;padding:2px 8px;border-radius:9999px;font-weight:700;">At Risk</span>`
                      : `<span style="color:#94a3b8;">—</span>`;

                  return `
                  <tr style="background:${bg};border-bottom:1px solid #fee2e2;">
                    <td style="padding:8px;text-align:center;">${renderEmailAvatar(r.student.name, r.student.photo_url)}</td>
                    <td style="padding:8px;font-family:monospace;font-weight:700;color:#0284c7;">${r.student.register_no}</td>
                    <td style="padding:8px;font-weight:600;color:#0f172a;">${r.student.name}</td>
                    <td style="padding:8px;text-align:center;font-weight:700;color:${pctColor(r.overallAttendancePct)};">${r.overallAttendancePct}%</td>
                    <td style="padding:8px;text-align:center;">
                      <div style="font-weight:700;color:${pctColor(r.weekAttendancePct)};">${r.weekAttendancePct !== null ? `${r.weekAttendancePct}%` : '—'}</div>
                      <div style="font-size:10px;color:#dc2626;font-weight:600;">${r.weekSessionsAbsent} Absent</div>
                    </td>
                    ${riskCategories
                      .map((cat) => {
                        const st = r.categoryStats[cat];
                        if (!st || st.avgPct === null) {
                          return `<td style="padding:8px;text-align:center;color:#94a3b8;">—</td>`;
                        }
                        return `
                          <td style="padding:8px;text-align:center;line-height:1.3;">
                            <div style="font-weight:700;color:${pctColor(st.avgPct)};">Avg: ${st.avgPct}%</div>
                            <div style="font-size:10px;color:#475569;">Pass: ${st.passPct ?? 0}%</div>
                          </td>
                        `;
                      })
                      .join('')}
                    <td style="padding:8px;text-align:center;">${attRiskBadge}</td>
                    <td style="padding:8px;text-align:center;">${acadRiskBadge}</td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      `
      }
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${report.subject}</title>
    </head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:20px;background-color:#f1f5f9;color:#1e293b;">
      <div style="max-width:820px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(15,23,42,0.08);border:1px solid #cbd5e1;">
        
        <!-- Header Banner (No EduCore by KVJ Analytics text) -->
        <div style="background:linear-gradient(135deg,#0f3d32 0%,#155e4c 55%,#0e7490 100%);padding:24px 28px;color:#ffffff;">
          <h1 style="margin:0;font-size:22px;font-weight:800;letter-spacing:-0.4px;">Weekly Summary</h1>
          <div style="margin-top:12px;padding:12px 16px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:10px;font-size:13px;line-height:1.6;">
            <strong>Batch:</strong> ${batch.code} &nbsp;|&nbsp;
            <strong>Semester:</strong> Semester ${semester} &nbsp;|&nbsp;
            <strong>Tool:</strong> ${course.name} (${course.code}) &nbsp;|&nbsp;
            <strong>College:</strong> ${college?.name || 'Partner College'}
            <br/>
            <strong>Reporting Week:</strong> Mon ${formatIsoToDDMMYYYY(weekStart)} to Sat ${formatIsoToDDMMYYYY(weekEnd)}
          </div>
        </div>

        <!-- Body -->
        <div style="padding:24px 28px;">
          
          <!-- 7 Executive KPI Cards (Row 1: 4 cards, Row 2: 3 cards) -->
          <table style="width:100%;border-collapse:separate;border-spacing:8px;margin:0 -8px;">
            <tr>
              <td style="width:25%;background:#f8fafc;border:1px solid #e2e8f0;border-top:3px solid #0284c7;border-radius:10px;padding:12px;text-align:center;">
                <div style="font-size:10px;text-transform:uppercase;color:#64748b;font-weight:700;letter-spacing:0.4px;">Total Students</div>
                <div style="font-size:20px;font-weight:800;color:#0f172a;margin-top:4px;">${totalStudents}</div>
              </td>
              <td style="width:25%;background:#f0fdf4;border:1px solid #bbf7d0;border-top:3px solid #16a34a;border-radius:10px;padding:12px;text-align:center;">
                <div style="font-size:10px;text-transform:uppercase;color:#166534;font-weight:700;letter-spacing:0.4px;">Overall Attendance</div>
                <div style="font-size:20px;font-weight:800;color:${pctColor(overallAttendancePct)};margin-top:4px;">${overallAttendancePct !== null ? `${overallAttendancePct}%` : '—'}</div>
              </td>
              <td style="width:25%;background:#f8fafc;border:1px solid #e2e8f0;border-top:3px solid #6366f1;border-radius:10px;padding:12px;text-align:center;">
                <div style="font-size:10px;text-transform:uppercase;color:#4338ca;font-weight:700;letter-spacing:0.4px;">Previous Week Att %</div>
                <div style="font-size:20px;font-weight:800;color:${pctColor(prevWeekAttendancePct)};margin-top:4px;">${prevWeekAttendancePct !== null ? `${prevWeekAttendancePct}%` : '—'}</div>
              </td>
              <td style="width:25%;background:#eff6ff;border:1px solid #bfdbfe;border-top:3px solid #2563eb;border-radius:10px;padding:12px;text-align:center;">
                <div style="font-size:10px;text-transform:uppercase;color:#1e40af;font-weight:700;letter-spacing:0.4px;">Current Week Att %</div>
                <div style="font-size:20px;font-weight:800;color:${pctColor(currWeekAttendancePct)};margin-top:4px;">${currWeekAttendancePct !== null ? `${currWeekAttendancePct}%` : '—'}</div>
              </td>
            </tr>
          </table>
          <table style="width:100%;border-collapse:separate;border-spacing:8px;margin:0 -8px;">
            <tr>
              <td style="width:33.3%;background:${variationBg};border:1px solid #e2e8f0;border-top:3px solid ${variationColor};border-radius:10px;padding:12px;text-align:center;">
                <div style="font-size:10px;text-transform:uppercase;color:#475569;font-weight:700;letter-spacing:0.4px;">% of Variation</div>
                <div style="font-size:20px;font-weight:800;color:${variationColor};margin-top:4px;">${variationText}</div>
              </td>
              <td style="width:33.3%;background:#f8fafc;border:1px solid #e2e8f0;border-top:3px solid #0d9488;border-radius:10px;padding:12px;text-align:center;">
                <div style="font-size:10px;text-transform:uppercase;color:#0f766e;font-weight:700;letter-spacing:0.4px;">Total No. of Hours</div>
                <div style="font-size:20px;font-weight:800;color:#0f172a;margin-top:4px;">${totalHoursDelivered} hrs</div>
              </td>
              <td style="width:33.3%;background:#fffbeb;border:1px solid #fde68a;border-top:3px solid #d97706;border-radius:10px;padding:12px;text-align:center;">
                <div style="font-size:10px;text-transform:uppercase;color:#92400e;font-weight:700;letter-spacing:0.4px;">Current Week Hours</div>
                <div style="font-size:20px;font-weight:800;color:#b45309;margin-top:4px;">${currWeekHoursDelivered} hrs</div>
              </td>
            </tr>
          </table>

          ${dateWiseHtml}
          ${repeatedAbsenteesHtml}
          ${assessmentsHtml}
          ${riskHtml}

        </div>

        <!-- Footer -->
        <div style="background:#f8fafc;padding:14px 28px;text-align:center;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0;">
          Automated Weekly Academic &amp; Operations Summary &bull; ${batch.code} &bull; ${course.name}
        </div>
      </div>
    </body>
    </html>
  `;
}
