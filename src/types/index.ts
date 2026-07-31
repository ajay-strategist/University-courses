export type UserRole = 'admin' | 'trainer' | 'student_coordinator' | 'college_coordinator';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  must_change_password?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserEmailConfig {
  user_id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_app_password?: string;
  from_name: string;
  is_verified: boolean;
}

export interface NotificationLog {
  id: string;
  batch_course_id?: string;
  session_date: string;
  sender_id?: string;
  recipient_email: string;
  absentee_count: number;
  status: 'sent' | 'failed';
  error?: string;
  sent_at: string;
}

export interface College {
  id: string;
  code: string; // unique, e.g. MIM
  name: string;
  location?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  image_url?: string;
  created_at?: string;
}

export interface Program {
  id: string;
  code: string; // e.g. BBA
  name: string;
  created_at?: string;
}

export interface Course {
  id: string;
  code: string; // e.g. XL, PBI
  name: string; // Excel, Power BI, R, Python, SQL
  created_at?: string;
}

export interface CourseDefaultSyllabus {
  id: string;
  course_id: string;
  topic_no: number;
  topic_name: string;
  planned_hours: number;
}

export interface AssessmentType {
  id: string;
  name: string; // Assignment, Exam
  default_max_mark: number;
}

export interface Batch {
  id: string;
  code: string; // Auto = college.code-program.code-academic_year
  college_id: string;
  program_id: string;
  academic_year: string;
  current_semester: number;
  college_coordinator_id?: string;
  student_coordinator_id?: string;
  status: 'Active' | 'Completed';
  start_date?: string;
  end_date?: string;
  college?: College;
  program?: Program;
  college_coordinator?: Profile;
  student_coordinator?: Profile;
  student_count?: number;
  avg_attendance_pct?: number;
  avg_coverage_pct?: number;
  created_at?: string;
}

export interface Student {
  id: string;
  batch_id: string;
  register_no: string; // Unique within batch
  name: string;
  class: string; // Division
  phone?: string;
  attendance_pct?: number;
}

export interface BatchCourse {
  id: string;
  batch_id: string;
  course_id: string;
  trainer_id?: string;
  semester: number;
  planned_hours: number;
  start_date?: string;
  end_date?: string;
  status: string;
  course?: Course;
  trainer?: Profile;
  batch?: Batch;
  coverage_pct?: number;
  sessions_held?: number;
  delivered_hours?: number;
}

export interface BatchCourseSyllabus {
  id: string;
  batch_course_id: string;
  topic_no: number;
  topic_name: string;
  planned_hours: number;
  is_completed: boolean;
  completed_date?: string;
}

export interface Session {
  id: string;
  batch_course_id: string;
  session_date: string;
  hour_no: number;
}

export interface TrainerLog {
  id: string;
  batch_course_id: string;
  trainer_id?: string;
  log_date: string;        // YYYY-MM-DD
  start_time: string;      // HH:MM
  end_time: string;        // HH:MM
  duration_minutes: number; // auto-computed
  topics_covered: string[]; // array of BatchCourseSyllabus IDs
  notes?: string;
  created_at?: string;
}

export interface Attendance {
  id: string;
  session_id: string;
  student_id: string;
  status: 'present' | 'absent' | 'late';
}

export interface Assessment {
  id: string;
  batch_course_id: string;
  name: string;
  type_id?: string;
  max_mark: number;
  assessment_date?: string;
  type?: AssessmentType;
}

export interface AssessmentMark {
  id: string;
  assessment_id: string;
  student_id: string;
  mark: number;
  student?: Student;
}

export interface AbsenteePreview {
  recipient_email: string;
  recipient_name: string;
  sender_email: string;
  session_date: string;
  batch_code: string;
  course_name: string;
  absentees: {
    register_no: string;
    name: string;
    class: string;
    hours_absent: number[];
  }[];
}

export interface MigrationRunSummary {
  [sheetName: string]: {
    new: number;
    updated: number;
    errored: number;
  };
}

export interface MigrationRun {
  id: string;
  uploaded_by?: string;
  file_path: string;
  mode: 'master' | 'mapped';
  status: 'dry_run' | 'committed' | 'failed';
  summary: MigrationRunSummary;
  created_at?: string;
}

export interface MigrationMapping {
  id: string;
  name: string;
  owner_id: string;
  mapping: any;
  created_at?: string;
}
