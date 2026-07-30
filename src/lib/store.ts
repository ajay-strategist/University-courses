import type { 
  College, Program, Course, CourseDefaultSyllabus, AssessmentType, 
  Batch, Student, BatchCourse, BatchCourseSyllabus, Session, 
  Attendance, Assessment, AssessmentMark, Profile, UserEmailConfig, NotificationLog 
} from '@/types';

// Admin System Profile
export const INITIAL_PROFILES: Profile[] = [
  { id: 'usr-admin-1', email: 'mail@thestrategist.co.in', full_name: 'Ajay Thomas', role: 'admin', phone: '+1 555-0192' },
];

export const INITIAL_COLLEGES: College[] = [];
export const INITIAL_PROGRAMS: Program[] = [];
export const INITIAL_COURSES: Course[] = [];
export const INITIAL_DEFAULT_SYLLABUS: CourseDefaultSyllabus[] = [];
export const INITIAL_ASSESSMENT_TYPES: AssessmentType[] = [];
export const INITIAL_BATCHES: Batch[] = [];
export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_BATCH_COURSES: BatchCourse[] = [];
export const INITIAL_BATCH_COURSE_SYLLABUS: BatchCourseSyllabus[] = [];
export const INITIAL_SESSIONS: Session[] = [];
export const INITIAL_ATTENDANCE: Attendance[] = [];
export const INITIAL_ASSESSMENTS: Assessment[] = [];
export const INITIAL_ASSESSMENT_MARKS: AssessmentMark[] = [];
export const INITIAL_EMAIL_CONFIGS: UserEmailConfig[] = [];
export const INITIAL_NOTIFICATION_LOGS: NotificationLog[] = [];

// In-Memory Reactive Local Store for Production & Dynamic Data Entry
class DataStore {
  profiles = [...INITIAL_PROFILES];
  colleges = [...INITIAL_COLLEGES];
  programs = [...INITIAL_PROGRAMS];
  courses = [...INITIAL_COURSES];
  defaultSyllabus = [...INITIAL_DEFAULT_SYLLABUS];
  assessmentTypes = [...INITIAL_ASSESSMENT_TYPES];
  batches = [...INITIAL_BATCHES];
  students = [...INITIAL_STUDENTS];
  batchCourses = [...INITIAL_BATCH_COURSES];
  batchSyllabus = [...INITIAL_BATCH_COURSE_SYLLABUS];
  sessions = [...INITIAL_SESSIONS];
  attendance = [...INITIAL_ATTENDANCE];
  assessments = [...INITIAL_ASSESSMENTS];
  assessmentMarks = [...INITIAL_ASSESSMENT_MARKS];
  emailConfigs = [...INITIAL_EMAIL_CONFIGS];
  notificationLogs = [...INITIAL_NOTIFICATION_LOGS];

  powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiZXhhbXBsZS1wb3dlci1iaS1yZXBvcnQtaWQiLCJ0IjoiZGVtbyJ9";

  // Derived helpers
  getBatchWithDetails(batchId: string): Batch | undefined {
    const batch = this.batches.find(b => b.id === batchId);
    if (!batch) return undefined;
    
    const college = this.colleges.find(c => c.id === batch.college_id);
    const program = this.programs.find(p => p.id === batch.program_id);
    const college_coordinator = this.profiles.find(p => p.id === batch.college_coordinator_id);
    const student_coordinator = this.profiles.find(p => p.id === batch.student_coordinator_id);
    const batchStudents = this.students.filter(s => s.batch_id === batchId);
    
    // Compute avg attendance
    const batchCourses = this.batchCourses.filter(bc => bc.batch_id === batchId);
    const bcIds = batchCourses.map(bc => bc.id);
    const sessions = this.sessions.filter(s => bcIds.includes(s.batch_course_id));
    const sessionIds = sessions.map(s => s.id);
    const attendanceRecords = this.attendance.filter(a => sessionIds.includes(a.session_id));
    
    let avg_attendance_pct = 0;
    if (attendanceRecords.length > 0) {
      const presentCount = attendanceRecords.filter(a => a.status === 'present' || a.status === 'late').length;
      avg_attendance_pct = Math.round((presentCount / attendanceRecords.length) * 100);
    }

    // Compute avg coverage
    const bcsyllabus = this.batchSyllabus.filter(s => bcIds.includes(s.batch_course_id));
    let avg_coverage_pct = 0;
    if (bcsyllabus.length > 0) {
      const completed = bcsyllabus.filter(s => s.is_completed).length;
      avg_coverage_pct = Math.round((completed / bcsyllabus.length) * 100);
    }

    return {
      ...batch,
      college,
      program,
      college_coordinator,
      student_coordinator,
      student_count: batchStudents.length,
      avg_attendance_pct,
      avg_coverage_pct
    };
  }

  getStudentAttendancePct(studentId: string): number {
    const studentRecords = this.attendance.filter(a => a.student_id === studentId);
    if (studentRecords.length === 0) return 0;
    const present = studentRecords.filter(a => a.status === 'present' || a.status === 'late').length;
    return Math.round((present / studentRecords.length) * 100);
  }
}

export const store = new DataStore();
