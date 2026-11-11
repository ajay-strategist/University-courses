// =====================================================================================
// EduCore by KVJ Analytics — Student Risk Management Engine (REQ-DSH-RISK-01)
// =====================================================================================

import { store } from '@/lib/store';
import type { Student, Assessment, AssessmentMark, Session, Attendance, Batch } from '@/types';

export interface RiskCriteriaConfig {
  id?: string;
  batch_id?: string; // empty for Global Admin Common Configuration
  attendance_threshold_pct: number; // default: 75
  consecutive_absence_days: number; // default: 3
  lookback_days: number; // default: 30
  missed_session_count: number; // default: 5
  academic_threshold_pct: number; // default: 40
  included_assessment_categories: string[]; // ['Internal Exam', 'Exam', 'Assignment', 'Assessment', 'Daily Assessment']
  attendance_weight_pct: number; // default: 50
  academic_weight_pct: number; // default: 50
  critical_risk_threshold_pct: number; // default: 70
  at_risk_threshold_pct: number; // default: 40
}

export const DEFAULT_RISK_CONFIG: RiskCriteriaConfig = {
  attendance_threshold_pct: 75,
  consecutive_absence_days: 3,
  lookback_days: 30,
  missed_session_count: 5,
  academic_threshold_pct: 40,
  included_assessment_categories: ['Internal Exam', 'Exam', 'Assignment', 'Assessment'],
  attendance_weight_pct: 50,
  academic_weight_pct: 50,
  critical_risk_threshold_pct: 70,
  at_risk_threshold_pct: 40,
};

// Local storage keys
const STORAGE_KEY_GLOBAL = 'uct_risk_config_global';
const STORAGE_KEY_OVERRIDES = 'uct_risk_config_overrides';

export function getGlobalRiskConfig(): RiskCriteriaConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GLOBAL);
    if (raw) return { ...DEFAULT_RISK_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Error reading global risk config', e);
  }
  return { ...DEFAULT_RISK_CONFIG };
}

export function saveGlobalRiskConfig(config: RiskCriteriaConfig): void {
  localStorage.setItem(STORAGE_KEY_GLOBAL, JSON.stringify(config));
}

export function getBatchRiskConfigOverrides(): Record<string, RiskCriteriaConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OVERRIDES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading batch risk config overrides', e);
  }
  return {};
}

export function getEffectiveRiskConfig(batchId?: string): RiskCriteriaConfig {
  const globalConfig = getGlobalRiskConfig();
  if (!batchId) return globalConfig;
  const overrides = getBatchRiskConfigOverrides();
  if (overrides[batchId]) {
    return { ...globalConfig, ...overrides[batchId], batch_id: batchId };
  }
  return globalConfig;
}

export function saveBatchRiskConfig(batchId: string, config: RiskCriteriaConfig): void {
  const overrides = getBatchRiskConfigOverrides();
  overrides[batchId] = { ...config, batch_id: batchId };
  localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));
}

export function resetBatchRiskConfig(batchId: string): void {
  const overrides = getBatchRiskConfigOverrides();
  delete overrides[batchId];
  localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));
}

export function resetGlobalRiskConfig(): void {
  localStorage.setItem(STORAGE_KEY_GLOBAL, JSON.stringify(DEFAULT_RISK_CONFIG));
}

// Convert Google Drive share link to thumbnail / direct image
export function getStudentPhotoUrl(photoUrl?: string): string | null {
  if (!photoUrl || !photoUrl.trim()) return null;
  const trimmed = photoUrl.trim();

  if (trimmed.startsWith('data:') || trimmed.match(/\.(jpg|jpeg|png|webp|gif)($|\?)/i)) {
    return trimmed;
  }

  // Google Drive format: /file/d/ID/view
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  // Google Drive format: id=ID
  const idMatch = trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return trimmed;
}

export type RiskLevel = 'Critical' | 'At Risk' | null;

export interface StudentRiskProfile {
  student: Student;
  batch: Batch;
  attendancePct: number;
  consecutiveAbsences: number;
  attendanceRisk: RiskLevel;
  attendanceRiskScore: number; // 0 - 100
  academicPct: number | null;
  academicRisk: RiskLevel;
  academicRiskScore: number; // 0 - 100
  overallRisk: RiskLevel;
  overallWeightedScore: number; // 0 - 100
  isAtRisk: boolean; // True if Attendance Risk != null OR Academic Risk != null OR Overall Risk != null
  assessmentDetails: {
    name: string;
    category: string;
    mark: number;
    maxMark: number;
    pct: number;
  }[];
  recentAbsenceDates: string[];
}

/**
 * Calculates risk profiles for all students in given batches
 */
export function calculateStudentRisks(
  batchId?: string,
  customConfig?: RiskCriteriaConfig
): StudentRiskProfile[] {
  const batches = batchId 
    ? store.batches.filter(b => b.id === batchId)
    : store.batches;

  const results: StudentRiskProfile[] = [];

  for (const b of batches) {
    const config = customConfig || getEffectiveRiskConfig(b.id);
    const batchStudents = store.students.filter(s => s.batch_id === b.id);
    const batchCourses = store.batchCourses.filter(bc => bc.batch_id === b.id);
    const bcIds = new Set(batchCourses.map(bc => bc.id));

    // Sessions and attendance for this batch
    const batchSessions = store.sessions.filter(s => bcIds.has(s.batch_course_id));
    const sessionDateMap = new Map<string, Session[]>();
    batchSessions.forEach(sess => {
      if (!sessionDateMap.has(sess.session_date)) sessionDateMap.set(sess.session_date, []);
      sessionDateMap.get(sess.session_date)!.push(sess);
    });
    const sortedDates = Array.from(sessionDateMap.keys()).sort();

    // Assessments for this batch
    const batchAssessments = store.assessments.filter(a => bcIds.has(a.batch_course_id));
    const relevantAssessments = batchAssessments.filter(a => {
      if (!a.assignment_category) return true;
      return config.included_assessment_categories.some(
        c => c.toLowerCase() === a.assignment_category?.toLowerCase()
      );
    });

    for (const stu of batchStudents) {
      // 1. Attendance Analysis
      let totalSessions = 0;
      let presentSessions = 0;
      let consecutiveAbsences = 0;
      let currentStreak = 0;
      const recentAbsenceDates: string[] = [];

      for (const d of sortedDates) {
        const daySessions = sessionDateMap.get(d) || [];
        let dayHasAbsent = false;
        let dayPresents = 0;

        for (const sess of daySessions) {
          const att = store.attendance.find(a => a.session_id === sess.id && a.student_id === stu.id);
          if (att) {
            totalSessions++;
            if (att.status === 'present') {
              presentSessions++;
              dayPresents++;
            } else if (att.status === 'absent') {
              dayHasAbsent = true;
            }
          }
        }

        // Daily consecutive absent calculation
        if (daySessions.length > 0) {
          if (dayHasAbsent && dayPresents === 0) {
            currentStreak++;
            recentAbsenceDates.push(d);
            if (currentStreak > consecutiveAbsences) consecutiveAbsences = currentStreak;
          } else if (dayPresents > 0) {
            currentStreak = 0;
          }
        }
      }

      const attPct = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 100;
      
      let attendanceRisk: RiskLevel = null;
      let attendanceRiskScore = 0;

      if (totalSessions > 0) {
        attendanceRiskScore = Math.max(0, Math.min(100, Math.round(100 - attPct)));
        if (attPct < config.attendance_threshold_pct || consecutiveAbsences >= config.consecutive_absence_days) {
          if (attPct < 60 || consecutiveAbsences >= (config.consecutive_absence_days + 2)) {
            attendanceRisk = 'Critical';
          } else {
            attendanceRisk = 'At Risk';
          }
        }
      }

      // 2. Academic Analysis
      const assessmentDetails: StudentRiskProfile['assessmentDetails'] = [];
      let totalScorePct = 0;
      let assessedCount = 0;

      for (const asm of relevantAssessments) {
        const m = store.assessmentMarks.find(mark => mark.assessment_id === asm.id && mark.student_id === stu.id);
        const maxM = asm.max_mark > 0 ? asm.max_mark : 100;
        
        if (m && m.mark !== undefined && m.mark !== null) {
          const pct = (m.mark / maxM) * 100;
          totalScorePct += pct;
          assessedCount++;
          assessmentDetails.push({
            name: asm.name,
            category: asm.assignment_category || 'Assessment',
            mark: m.mark,
            maxMark: maxM,
            pct: Math.round(pct * 10) / 10,
          });
        }
      }

      const academicPct = assessedCount > 0 ? totalScorePct / assessedCount : null;
      let academicRisk: RiskLevel = null;
      let academicRiskScore = 0;

      if (academicPct !== null) {
        academicRiskScore = Math.max(0, Math.min(100, Math.round(100 - academicPct)));
        if (academicPct < config.academic_threshold_pct) {
          if (academicPct < 25) {
            academicRisk = 'Critical';
          } else {
            academicRisk = 'At Risk';
          }
        }
      }

      // 3. Overall Weighted Risk
      const attWeight = config.attendance_weight_pct;
      const acadWeight = academicPct !== null ? config.academic_weight_pct : 0;
      const totalWeight = attWeight + acadWeight;

      const overallWeightedScore = totalWeight > 0
        ? Math.round((attendanceRiskScore * attWeight + academicRiskScore * acadWeight) / totalWeight)
        : 0;

      let overallRisk: RiskLevel = null;
      if (overallWeightedScore >= config.critical_risk_threshold_pct) {
        overallRisk = 'Critical';
      } else if (overallWeightedScore >= config.at_risk_threshold_pct) {
        overallRisk = 'At Risk';
      }

      // If either individual risk is critical, elevate overall risk to at least At Risk/Critical
      if (attendanceRisk === 'Critical' || academicRisk === 'Critical') {
        if (!overallRisk || overallRisk === 'At Risk') {
          overallRisk = attendanceRisk === 'Critical' && academicRisk === 'Critical' ? 'Critical' : 'At Risk';
        }
      }

      const isAtRisk = attendanceRisk !== null || academicRisk !== null || overallRisk !== null;

      results.push({
        student: stu,
        batch: b,
        attendancePct: Math.round(attPct * 10) / 10,
        consecutiveAbsences,
        attendanceRisk,
        attendanceRiskScore,
        academicPct: academicPct !== null ? Math.round(academicPct * 10) / 10 : null,
        academicRisk,
        academicRiskScore,
        overallRisk,
        overallWeightedScore,
        isAtRisk,
        assessmentDetails,
        recentAbsenceDates,
      });
    }
  }

  return results;
}

/**
 * Filter for Risk Dashboard: ONLY return students with a defined risk.
 * Never return Low Risk, Other Risk, or No Risk students.
 */
export function getActiveRiskStudents(
  batchId?: string,
  riskCategory?: 'all' | 'attendance' | 'academic' | 'both',
  riskType?: 'all' | 'Critical' | 'At Risk'
): StudentRiskProfile[] {
  const allProfiles = calculateStudentRisks(batchId);

  return allProfiles.filter(p => {
    // Must have at least one valid risk
    if (!p.isAtRisk) return false;

    // Filter by risk category
    if (riskCategory === 'attendance' && !p.attendanceRisk) return false;
    if (riskCategory === 'academic' && !p.academicRisk) return false;
    if (riskCategory === 'both' && (!p.attendanceRisk || !p.academicRisk)) return false;

    // Filter by risk type (Critical vs At Risk)
    if (riskType && riskType !== 'all') {
      const matchesOverall = p.overallRisk === riskType;
      const matchesAtt = p.attendanceRisk === riskType;
      const matchesAcad = p.academicRisk === riskType;
      if (!matchesOverall && !matchesAtt && !matchesAcad) return false;
    }

    return true;
  });
}

/**
 * Generates official EduCore Student Risk Notification HTML Email
 */
export function generateRiskNotificationEmailHtml(options: {
  batchName: string;
  collegeName: string;
  trainerName: string;
  trainerRemarks?: string;
  selectedProfiles: StudentRiskProfile[];
  includeAttendance: boolean;
  includeAcademic: boolean;
}): string {
  const {
    batchName,
    collegeName,
    trainerName,
    trainerRemarks,
    selectedProfiles,
    includeAttendance,
    includeAcademic,
  } = options;

  const rowsHtml = selectedProfiles.map(p => {
    const photoUrl = getStudentPhotoUrl(p.student.photo_url);
    const photoImg = photoUrl
      ? `<img src="${photoUrl}" alt="${p.student.name}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid #173D32;" />`
      : `<div style="width:36px;height:36px;border-radius:50%;background:#e2e8f0;color:#173D32;font-weight:bold;font-size:12px;line-height:36px;text-align:center;">${(p.student.name || 'S').substring(0, 2).toUpperCase()}</div>`;

    const attBadge = p.attendanceRisk === 'Critical'
      ? `<span style="background:#fee2e2;color:#C62828;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:bold;">Critical (${p.attendancePct}%)</span>`
      : p.attendanceRisk === 'At Risk'
      ? `<span style="background:#fef3c7;color:#b45309;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:bold;">At Risk (${p.attendancePct}%)</span>`
      : `<span style="color:#94a3b8;font-size:12px;">—</span>`;

    const acadBadge = p.academicRisk === 'Critical'
      ? `<span style="background:#fee2e2;color:#C62828;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:bold;">Critical (${p.academicPct ?? 'N/A'}%)</span>`
      : p.academicRisk === 'At Risk'
      ? `<span style="background:#fef3c7;color:#b45309;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:bold;">At Risk (${p.academicPct ?? 'N/A'}%)</span>`
      : `<span style="color:#94a3b8;font-size:12px;">—</span>`;

    const overallBadge = p.overallRisk === 'Critical'
      ? `<span style="background:#C62828;color:#ffffff;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:bold;">Critical Risk</span>`
      : `<span style="background:#E6A817;color:#1e293b;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:bold;">At Risk</span>`;

    return `
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:10px;text-align:center;">${photoImg}</td>
        <td style="padding:10px;font-family:monospace;font-weight:bold;color:#0f172a;">${p.student.register_no}</td>
        <td style="padding:10px;font-weight:600;color:#0f172a;">${p.student.name}</td>
        ${includeAttendance ? `<td style="padding:10px;text-align:center;">${attBadge}</td>` : ''}
        ${includeAcademic ? `<td style="padding:10px;text-align:center;">${acadBadge}</td>` : ''}
        <td style="padding:10px;text-align:center;">${overallBadge}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Student Risk Notification</title>
    </head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:24px;background-color:#f1f5f9;color:#334155;">
      <div style="max-width:700px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
        <!-- Header -->
        <div style="background:#173D32;padding:24px;color:#ffffff;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h1 style="margin:0;font-size:20px;font-weight:bold;letter-spacing:-0.5px;">EduCore by KVJ Analytics</h1>
              <p style="margin:4px 0 0 0;font-size:13px;opacity:0.85;">Student Risk Alert & Intervention Notice</p>
            </div>
          </div>
          <div style="margin-top:16px;padding:12px 16px;background:rgba(255,255,255,0.1);border-radius:10px;font-size:13px;">
            <strong>Batch:</strong> ${batchName} &nbsp;|&nbsp; <strong>College:</strong> ${collegeName}
          </div>
        </div>

        <!-- Body -->
        <div style="padding:24px;">
          <p style="font-size:14px;line-height:1.6;margin-top:0;">
            This is an automated intervention report prepared by <strong>${trainerName}</strong>. 
            The following <strong>${selectedProfiles.length} student(s)</strong> have breached academic or attendance intervention thresholds and require immediate attention.
          </p>

          ${trainerRemarks ? `
            <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:14px 16px;border-radius:0 8px 8px 0;margin:18px 0;">
              <strong style="color:#b45309;font-size:13px;display:block;margin-bottom:4px;">Trainer Intervention Remarks:</strong>
              <div style="font-size:13px;color:#78350f;line-height:1.5;">${trainerRemarks.replace(/\n/g, '<br/>')}</div>
            </div>
          ` : ''}

          <!-- Students Table -->
          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:13px;text-align:left;">
            <thead>
              <tr style="background:#f8fafc;border-bottom:2px solid #cbd5e1;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">
                <th style="padding:10px;text-align:center;width:48px;">Photo</th>
                <th style="padding:10px;">Reg No</th>
                <th style="padding:10px;">Student Name</th>
                ${includeAttendance ? `<th style="padding:10px;text-align:center;">Attendance</th>` : ''}
                ${includeAcademic ? `<th style="padding:10px;text-align:center;">Academic</th>` : ''}
                <th style="padding:10px;text-align:center;">Overall</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div style="margin-top:24px;padding:14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;font-size:12px;color:#64748b;line-height:1.5;">
            <strong>Confidentiality Notice:</strong> This notification is intended solely for College and Student Coordinators, HODs, and academic management. 
            Individual students are not copied on this communication.
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#f8fafc;padding:16px 24px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;">
          EduCore — KVJ Analytics Academic Operations Engine &copy; ${new Date().getFullYear()}
        </div>
      </div>
    </body>
    </html>
  `;
}
