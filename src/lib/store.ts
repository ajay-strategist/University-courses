import type { 
  College, Program, Course, CourseDefaultSyllabus, AssessmentType, 
  Batch, Student, BatchCourse, BatchCourseSyllabus, Session, 
  Attendance, Assessment, AssessmentMark, Profile, UserEmailConfig, NotificationLog 
} from '@/types';

// Initial Demo Seed Data
export const INITIAL_PROFILES: Profile[] = [
  { id: 'usr-admin-1', email: 'admin@university.edu', full_name: 'Dr. Alexander Vance', role: 'admin', phone: '+1 555-0192' },
  { id: 'usr-trainer-1', email: 'trainer.excel@university.edu', full_name: 'Elena Rostova', role: 'trainer', phone: '+1 555-0183' },
  { id: 'usr-trainer-2', email: 'trainer.python@university.edu', full_name: 'Marcus Brody', role: 'trainer', phone: '+1 555-0174' },
  { id: 'usr-sc-1', email: 'student.coord@mim.edu', full_name: 'Liam Chen', role: 'student_coordinator', phone: '+1 555-0165' },
  { id: 'usr-cc-1', email: 'coordinator.mim@university.edu', full_name: 'Dr. Aris Thorne', role: 'college_coordinator', phone: '+1 555-0156' },
  { id: 'usr-cc-2', email: 'coordinator.sct@university.edu', full_name: 'Prof. Sarah Jenkins', role: 'college_coordinator', phone: '+1 555-0147' },
];

export const INITIAL_COLLEGES: College[] = [
  { id: 'col-1', code: 'MIM', name: 'Metropolitan Institute of Management', location: 'North Campus', contact_person: 'Dr. Aris Thorne', contact_email: 'coordinator.mim@university.edu', contact_phone: '+1 555-0156' },
  { id: 'col-2', code: 'SCT', name: 'State College of Technology', location: 'South Campus', contact_person: 'Prof. Sarah Jenkins', contact_email: 'coordinator.sct@university.edu', contact_phone: '+1 555-0147' },
];

export const INITIAL_PROGRAMS: Program[] = [
  { id: 'prog-1', code: 'BBA', name: 'Bachelor of Business Administration' },
  { id: 'prog-2', code: 'BCOM', name: 'Bachelor of Commerce' },
  { id: 'prog-3', code: 'BCA', name: 'Bachelor of Computer Applications' },
];

export const INITIAL_COURSES: Course[] = [
  { id: 'crs-1', code: 'XL', name: 'Excel' },
  { id: 'crs-2', code: 'PBI', name: 'Power BI' },
  { id: 'crs-3', code: 'R', name: 'R' },
  { id: 'crs-4', code: 'PY', name: 'Python' },
  { id: 'crs-5', code: 'SQL', name: 'SQL' },
];

export const INITIAL_DEFAULT_SYLLABUS: CourseDefaultSyllabus[] = [
  { id: 'sy-xl-1', course_id: 'crs-1', topic_no: 1, topic_name: 'Advanced Formulas & XLOOKUP', planned_hours: 3 },
  { id: 'sy-xl-2', course_id: 'crs-1', topic_no: 2, topic_name: 'Pivot Tables & Data Models', planned_hours: 4 },
  { id: 'sy-xl-3', course_id: 'crs-1', topic_no: 3, topic_name: 'Power Query & Data Cleaning', planned_hours: 5 },
  { id: 'sy-pbi-1', course_id: 'crs-2', topic_no: 1, topic_name: 'Data Modeling & Relationships', planned_hours: 4 },
  { id: 'sy-pbi-2', course_id: 'crs-2', topic_no: 2, topic_name: 'DAX Fundamentals (CALCULATE, SUMX)', planned_hours: 6 },
  { id: 'sy-pbi-3', course_id: 'crs-2', topic_no: 3, topic_name: 'Report Design & Visualizations', planned_hours: 5 },
  { id: 'sy-py-1', course_id: 'crs-4', topic_no: 1, topic_name: 'Python Data Structures & Pandas', planned_hours: 5 },
  { id: 'sy-py-2', course_id: 'crs-4', topic_no: 2, topic_name: 'Matplotlib & Seaborn Data Viz', planned_hours: 4 },
  { id: 'sy-sql-1', course_id: 'crs-5', topic_no: 1, topic_name: 'JOINs, Grouping & Aggregations', planned_hours: 4 },
];

export const INITIAL_ASSESSMENT_TYPES: AssessmentType[] = [
  { id: 'at-1', name: 'Assignment', default_max_mark: 50 },
  { id: 'at-2', name: 'Exam', default_max_mark: 100 },
  { id: 'at-3', name: 'Internal Series', default_max_mark: 40 },
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'bat-1',
    code: 'MIM-BBA-2026-29',
    college_id: 'col-1',
    program_id: 'prog-1',
    academic_year: '2026-29',
    current_semester: 2,
    college_coordinator_id: 'usr-cc-1',
    student_coordinator_id: 'usr-sc-1',
    status: 'Active',
    start_date: '2026-01-10',
    end_date: '2026-06-30',
  },
  {
    id: 'bat-2',
    code: 'SCT-BCA-2025-28',
    college_id: 'col-2',
    program_id: 'prog-3',
    academic_year: '2025-28',
    current_semester: 3,
    college_coordinator_id: 'usr-cc-2',
    student_coordinator_id: 'usr-sc-1',
    status: 'Active',
    start_date: '2025-08-01',
    end_date: '2026-05-15',
  }
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 'stu-1', batch_id: 'bat-1', register_no: '2026BBA001', name: 'Aarav Patel', class: 'Div A', phone: '+1 555-0101' },
  { id: 'stu-2', batch_id: 'bat-1', register_no: '2026BBA002', name: 'Beatrix Vance', class: 'Div A', phone: '+1 555-0102' },
  { id: 'stu-3', batch_id: 'bat-1', register_no: '2026BBA003', name: 'Cyrus Sterling', class: 'Div B', phone: '+1 555-0103' },
  { id: 'stu-4', batch_id: 'bat-1', register_no: '2026BBA004', name: 'Diana Prince', class: 'Div B', phone: '+1 555-0104' },
  { id: 'stu-5', batch_id: 'bat-1', register_no: '2026BBA005', name: 'Ethan Hunt', class: 'Div A', phone: '+1 555-0105' },
  { id: 'stu-6', batch_id: 'bat-2', register_no: '2025BCA010', name: 'Fiona Gallagher', class: 'Sec C', phone: '+1 555-0106' },
  { id: 'stu-7', batch_id: 'bat-2', register_no: '2025BCA011', name: 'George Clark', class: 'Sec C', phone: '+1 555-0107' },
];

export const INITIAL_BATCH_COURSES: BatchCourse[] = [
  {
    id: 'bc-1',
    batch_id: 'bat-1',
    course_id: 'crs-1',
    trainer_id: 'usr-trainer-1',
    semester: 2,
    planned_hours: 30,
    start_date: '2026-01-15',
    end_date: '2026-03-30',
    status: 'Active',
  },
  {
    id: 'bc-2',
    batch_id: 'bat-1',
    course_id: 'crs-2',
    trainer_id: 'usr-trainer-2',
    semester: 2,
    planned_hours: 25,
    start_date: '2026-02-01',
    end_date: '2026-04-15',
    status: 'Active',
  }
];

export const INITIAL_BATCH_COURSE_SYLLABUS: BatchCourseSyllabus[] = [
  { id: 'bcs-1', batch_course_id: 'bc-1', topic_no: 1, topic_name: 'Advanced Formulas & XLOOKUP', planned_hours: 3, is_completed: true, completed_date: '2026-01-20' },
  { id: 'bcs-2', batch_course_id: 'bc-1', topic_no: 2, topic_name: 'Pivot Tables & Data Models', planned_hours: 4, is_completed: true, completed_date: '2026-01-28' },
  { id: 'bcs-3', batch_course_id: 'bc-1', topic_no: 3, topic_name: 'Power Query & Data Cleaning', planned_hours: 5, is_completed: false },
  { id: 'bcs-4', batch_course_id: 'bc-1', topic_no: 4, topic_name: 'Financial Modeling & What-If Analysis', planned_hours: 6, is_completed: false },
];

export const INITIAL_SESSIONS: Session[] = [
  { id: 'ses-1', batch_course_id: 'bc-1', session_date: '2026-01-20', hour_no: 1 },
  { id: 'ses-2', batch_course_id: 'bc-1', session_date: '2026-01-20', hour_no: 2 },
  { id: 'ses-3', batch_course_id: 'bc-1', session_date: '2026-01-28', hour_no: 1 },
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  { id: 'att-1', session_id: 'ses-1', student_id: 'stu-1', status: 'present' },
  { id: 'att-2', session_id: 'ses-1', student_id: 'stu-2', status: 'present' },
  { id: 'att-3', session_id: 'ses-1', student_id: 'stu-3', status: 'absent' },
  { id: 'att-4', session_id: 'ses-1', student_id: 'stu-4', status: 'present' },
  { id: 'att-5', session_id: 'ses-1', student_id: 'stu-5', status: 'late' },
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  { id: 'asm-1', batch_course_id: 'bc-1', name: 'Excel Dashboard Assignment 1', type_id: 'at-1', max_mark: 50, assessment_date: '2026-02-10' },
  { id: 'asm-2', batch_course_id: 'bc-1', name: 'Mid-Term Practical Exam', type_id: 'at-2', max_mark: 100, assessment_date: '2026-03-01' },
];

export const INITIAL_ASSESSMENT_MARKS: AssessmentMark[] = [
  { id: 'mk-1', assessment_id: 'asm-1', student_id: 'stu-1', mark: 48 },
  { id: 'mk-2', assessment_id: 'asm-1', student_id: 'stu-2', mark: 45 },
  { id: 'mk-3', assessment_id: 'asm-1', student_id: 'stu-3', mark: 38 },
  { id: 'mk-4', assessment_id: 'asm-1', student_id: 'stu-4', mark: 50 },
  { id: 'mk-5', assessment_id: 'asm-1', student_id: 'stu-5', mark: 42 },
];

export const INITIAL_EMAIL_CONFIGS: UserEmailConfig[] = [
  {
    user_id: 'usr-trainer-1',
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: 'trainer.excel@gmail.com',
    from_name: 'Elena Rostova (Excel Trainer)',
    is_verified: true,
  }
];

export const INITIAL_NOTIFICATION_LOGS: NotificationLog[] = [
  {
    id: 'log-1',
    batch_course_id: 'bc-1',
    session_date: '2026-01-20',
    sender_id: 'usr-trainer-1',
    recipient_email: 'coordinator.mim@university.edu',
    absentee_count: 1,
    status: 'sent',
    sent_at: '2026-01-20T11:30:00Z'
  }
];

// In-Memory Reactive Local Store for immediate UI reactivity
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
    } else {
      avg_attendance_pct = 92; // default reasonable estimate for UI card ring
    }

    // Compute avg coverage
    const bcsyllabus = this.batchSyllabus.filter(s => bcIds.includes(s.batch_course_id));
    let avg_coverage_pct = 0;
    if (bcsyllabus.length > 0) {
      const completed = bcsyllabus.filter(s => s.is_completed).length;
      avg_coverage_pct = Math.round((completed / bcsyllabus.length) * 100);
    } else {
      avg_coverage_pct = 50;
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
    if (studentRecords.length === 0) return 100;
    const present = studentRecords.filter(a => a.status === 'present' || a.status === 'late').length;
    return Math.round((present / studentRecords.length) * 100);
  }
}

export const store = new DataStore();
