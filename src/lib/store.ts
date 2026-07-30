import type { 
  College, Program, Course, CourseDefaultSyllabus, AssessmentType, 
  Batch, Student, BatchCourse, BatchCourseSyllabus, Session, 
  Attendance, Assessment, AssessmentMark, Profile, UserEmailConfig, NotificationLog 
} from '@/types';
import { supabase } from './supabase';

export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Admin System Profile
export const INITIAL_PROFILES: Profile[] = [
  { id: 'usr-admin-1', email: 'mail@thestrategist.co.in', full_name: 'Ajay Thomas', role: 'admin', phone: '+1 555-0192' },
];

class DataStore {
  profiles: Profile[] = [...INITIAL_PROFILES];
  colleges: College[] = [];
  programs: Program[] = [];
  courses: Course[] = [];
  defaultSyllabus: CourseDefaultSyllabus[] = [];
  assessmentTypes: AssessmentType[] = [];
  batches: Batch[] = [];
  students: Student[] = [];
  batchCourses: BatchCourse[] = [];
  batchSyllabus: BatchCourseSyllabus[] = [];
  sessions: Session[] = [];
  attendance: Attendance[] = [];
  assessments: Assessment[] = [];
  assessmentMarks: AssessmentMark[] = [];
  emailConfigs: UserEmailConfig[] = [];
  notificationLogs: NotificationLog[] = [];

  powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiZXhhbXBsZS1wb3dlci1iaS1yZXBvcnQtaWQiLCJ0IjoiZGVtbyJ9";
  isInitialized = false;

  private loadLocalCache() {
    try {
      const cCols = localStorage.getItem('uct_colleges');
      if (cCols) this.colleges = JSON.parse(cCols);

      const cProgs = localStorage.getItem('uct_programs');
      if (cProgs) this.programs = JSON.parse(cProgs);

      const cCrses = localStorage.getItem('uct_courses');
      if (cCrses) this.courses = JSON.parse(cCrses);

      const cDefSyl = localStorage.getItem('uct_default_syllabus');
      if (cDefSyl) this.defaultSyllabus = JSON.parse(cDefSyl);

      const cAssTypes = localStorage.getItem('uct_assessment_types');
      if (cAssTypes) this.assessmentTypes = JSON.parse(cAssTypes);

      const cBts = localStorage.getItem('uct_batches');
      if (cBts) this.batches = JSON.parse(cBts);

      const cStds = localStorage.getItem('uct_students');
      if (cStds) this.students = JSON.parse(cStds);

      const cBCrs = localStorage.getItem('uct_batch_courses');
      if (cBCrs) this.batchCourses = JSON.parse(cBCrs);

      const cBSyl = localStorage.getItem('uct_batch_syllabus');
      if (cBSyl) this.batchSyllabus = JSON.parse(cBSyl);

      const cSess = localStorage.getItem('uct_sessions');
      if (cSess) this.sessions = JSON.parse(cSess);

      const cAtts = localStorage.getItem('uct_attendance');
      if (cAtts) this.attendance = JSON.parse(cAtts);

      const cAsms = localStorage.getItem('uct_assessments');
      if (cAsms) this.assessments = JSON.parse(cAsms);

      const cMarks = localStorage.getItem('uct_assessment_marks');
      if (cMarks) this.assessmentMarks = JSON.parse(cMarks);
    } catch (e) {
      console.warn('LocalStorage load warning:', e);
    }
  }

  private saveLocalCache() {
    try {
      localStorage.setItem('uct_colleges', JSON.stringify(this.colleges));
      localStorage.setItem('uct_programs', JSON.stringify(this.programs));
      localStorage.setItem('uct_courses', JSON.stringify(this.courses));
      localStorage.setItem('uct_default_syllabus', JSON.stringify(this.defaultSyllabus));
      localStorage.setItem('uct_assessment_types', JSON.stringify(this.assessmentTypes));
      localStorage.setItem('uct_batches', JSON.stringify(this.batches));
      localStorage.setItem('uct_students', JSON.stringify(this.students));
      localStorage.setItem('uct_batch_courses', JSON.stringify(this.batchCourses));
      localStorage.setItem('uct_batch_syllabus', JSON.stringify(this.batchSyllabus));
      localStorage.setItem('uct_sessions', JSON.stringify(this.sessions));
      localStorage.setItem('uct_attendance', JSON.stringify(this.attendance));
      localStorage.setItem('uct_assessments', JSON.stringify(this.assessments));
      localStorage.setItem('uct_assessment_marks', JSON.stringify(this.assessmentMarks));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }

  async init(): Promise<void> {
    // 1. Load local cache immediately so UI shows data
    this.loadLocalCache();

    // 2. Fetch from Supabase and merge
    try {
      const [
        { data: profs, error: eProfs },
        { data: cols, error: eCols },
        { data: progs, error: eProgs },
        { data: crses, error: eCrses },
        { data: defSyl, error: eDefSyl },
        { data: assTypes, error: eAssTypes },
        { data: bts, error: eBts },
        { data: stds, error: eStds },
        { data: bCrs, error: eBCrs },
        { data: bSyl, error: eBSyl },
        { data: sess, error: eSess },
        { data: atts, error: eAtts },
        { data: asms, error: eAsms },
        { data: marks, error: eMarks },
      ] = await Promise.all([
        supabase.from('uct_profiles').select('*'),
        supabase.from('uct_colleges').select('*'),
        supabase.from('uct_programs').select('*'),
        supabase.from('uct_courses').select('*'),
        supabase.from('uct_course_default_syllabus').select('*'),
        supabase.from('uct_assessment_types').select('*'),
        supabase.from('uct_batches').select('*'),
        supabase.from('uct_students').select('*'),
        supabase.from('uct_batch_courses').select('*'),
        supabase.from('uct_batch_course_syllabus').select('*'),
        supabase.from('uct_sessions').select('*'),
        supabase.from('uct_attendance').select('*'),
        supabase.from('uct_assessments').select('*'),
        supabase.from('uct_assessment_marks').select('*'),
      ]);

      if (profs && profs.length > 0) this.profiles = profs as Profile[];
      if (cols && cols.length > 0) this.colleges = cols as College[];
      if (progs && progs.length > 0) this.programs = progs as Program[];
      if (crses && crses.length > 0) this.courses = crses as Course[];
      if (defSyl && defSyl.length > 0) this.defaultSyllabus = defSyl as CourseDefaultSyllabus[];
      if (assTypes && assTypes.length > 0) this.assessmentTypes = assTypes as AssessmentType[];
      if (bts && bts.length > 0) this.batches = bts as Batch[];
      if (stds && stds.length > 0) this.students = stds as Student[];
      if (bCrs && bCrs.length > 0) this.batchCourses = bCrs as BatchCourse[];
      if (bSyl && bSyl.length > 0) this.batchSyllabus = bSyl as BatchCourseSyllabus[];
      if (sess && sess.length > 0) this.sessions = sess as Session[];
      if (atts && atts.length > 0) this.attendance = atts as Attendance[];
      if (asms && asms.length > 0) this.assessments = asms as Assessment[];
      if (marks && marks.length > 0) this.assessmentMarks = marks as AssessmentMark[];

      if (eCols || eBts || eStds || eCrses) {
        console.warn('Supabase fetch returned RLS or table warnings:', { eCols, eBts, eStds, eCrses });
      }

      this.saveLocalCache();
      this.isInitialized = true;
    } catch (err) {
      console.warn('Failed to load initial data from Supabase:', err);
    }
  }

  // -------------------------
  // COLLEGES
  // -------------------------
  async saveCollege(college: Partial<College>): Promise<College> {
    const item: College = {
      id: college.id || generateUUID(),
      code: college.code || '',
      name: college.name || '',
      location: college.location || '',
      logo_url: college.logo_url || '',
      image_url: college.image_url || '',
    };

    const idx = this.colleges.findIndex(c => c.id === item.id);
    if (idx >= 0) this.colleges[idx] = item;
    else this.colleges.push(item);

    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_colleges').upsert(item);
      if (error) console.error('Supabase saveCollege error:', error.message);
    } catch (e) {
      console.warn('Supabase college sync warning:', e);
    }
    return item;
  }

  async deleteCollege(id: string): Promise<void> {
    this.colleges = this.colleges.filter(c => c.id !== id);
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_colleges').delete().eq('id', id);
      if (error) console.error('Supabase deleteCollege error:', error.message);
    } catch (e) {
      console.warn('Supabase college delete warning:', e);
    }
  }

  // -------------------------
  // PROGRAMS
  // -------------------------
  async saveProgram(program: Partial<Program>): Promise<Program> {
    const item: Program = {
      id: program.id || generateUUID(),
      code: program.code || '',
      name: program.name || '',
    };

    const idx = this.programs.findIndex(p => p.id === item.id);
    if (idx >= 0) this.programs[idx] = item;
    else this.programs.push(item);

    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_programs').upsert(item);
      if (error) console.error('Supabase saveProgram error:', error.message);
    } catch (e) {
      console.warn('Supabase program sync warning:', e);
    }
    return item;
  }

  async deleteProgram(id: string): Promise<void> {
    this.programs = this.programs.filter(p => p.id !== id);
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_programs').delete().eq('id', id);
      if (error) console.error('Supabase deleteProgram error:', error.message);
    } catch (e) {
      console.warn('Supabase program delete warning:', e);
    }
  }

  // -------------------------
  // COURSES
  // -------------------------
  async saveCourse(course: Partial<Course>): Promise<Course> {
    const item: Course = {
      id: course.id || generateUUID(),
      code: course.code || '',
      name: course.name || '',
    };

    const idx = this.courses.findIndex(c => c.id === item.id);
    if (idx >= 0) this.courses[idx] = item;
    else this.courses.push(item);

    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_courses').upsert(item);
      if (error) console.error('Supabase saveCourse error:', error.message);
    } catch (e) {
      console.warn('Supabase course sync warning:', e);
    }
    return item;
  }

  async deleteCourse(id: string): Promise<void> {
    this.courses = this.courses.filter(c => c.id !== id);
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_courses').delete().eq('id', id);
      if (error) console.error('Supabase deleteCourse error:', error.message);
    } catch (e) {
      console.warn('Supabase course delete warning:', e);
    }
  }

  // -------------------------
  // DEFAULT SYLLABUS TOPICS
  // -------------------------
  async saveDefaultSyllabusTopic(topic: Partial<CourseDefaultSyllabus>): Promise<CourseDefaultSyllabus> {
    const item: CourseDefaultSyllabus = {
      id: topic.id || generateUUID(),
      course_id: topic.course_id!,
      topic_no: topic.topic_no!,
      topic_name: topic.topic_name!,
      planned_hours: topic.planned_hours || 1,
    };

    const idx = this.defaultSyllabus.findIndex(s => s.id === item.id);
    if (idx >= 0) this.defaultSyllabus[idx] = item;
    else this.defaultSyllabus.push(item);

    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_course_default_syllabus').upsert(item);
      if (error) console.error('Supabase saveDefaultSyllabusTopic error:', error.message);
    } catch (e) {
      console.warn('Supabase syllabus topic sync warning:', e);
    }
    return item;
  }

  async deleteDefaultSyllabusTopic(id: string): Promise<void> {
    this.defaultSyllabus = this.defaultSyllabus.filter(s => s.id !== id);
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_course_default_syllabus').delete().eq('id', id);
      if (error) console.error('Supabase deleteDefaultSyllabusTopic error:', error.message);
    } catch (e) {
      console.warn('Supabase syllabus delete warning:', e);
    }
  }

  // -------------------------
  // ASSESSMENT TYPES
  // -------------------------
  async saveAssessmentType(at: Partial<AssessmentType>): Promise<AssessmentType> {
    const item: AssessmentType = {
      id: at.id || generateUUID(),
      name: at.name || '',
      default_max_mark: at.default_max_mark || 100,
    };

    const idx = this.assessmentTypes.findIndex(a => a.id === item.id);
    if (idx >= 0) this.assessmentTypes[idx] = item;
    else this.assessmentTypes.push(item);

    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_assessment_types').upsert(item);
      if (error) console.error('Supabase saveAssessmentType error:', error.message);
    } catch (e) {
      console.warn('Supabase assessment type sync warning:', e);
    }
    return item;
  }

  async deleteAssessmentType(id: string): Promise<void> {
    this.assessmentTypes = this.assessmentTypes.filter(a => a.id !== id);
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_assessment_types').delete().eq('id', id);
      if (error) console.error('Supabase deleteAssessmentType error:', error.message);
    } catch (e) {
      console.warn('Supabase assessment type delete warning:', e);
    }
  }

  // -------------------------
  // BATCHES
  // -------------------------
  async saveBatch(batch: Partial<Batch>): Promise<Batch> {
    const item: Batch = {
      id: batch.id || generateUUID(),
      code: batch.code || '',
      college_id: batch.college_id!,
      program_id: batch.program_id!,
      academic_year: batch.academic_year || '',
      current_semester: batch.current_semester || 1,
      college_coordinator_id: batch.college_coordinator_id,
      student_coordinator_id: batch.student_coordinator_id,
      status: batch.status || 'Active',
      start_date: batch.start_date,
      end_date: batch.end_date,
    };

    const idx = this.batches.findIndex(b => b.id === item.id);
    if (idx >= 0) this.batches[idx] = item;
    else this.batches.push(item);

    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_batches').upsert({
        id: item.id,
        code: item.code,
        college_id: item.college_id,
        program_id: item.program_id,
        academic_year: item.academic_year,
        current_semester: item.current_semester,
        college_coordinator_id: item.college_coordinator_id,
        student_coordinator_id: item.student_coordinator_id,
        status: item.status,
        start_date: item.start_date,
        end_date: item.end_date,
      });
      if (error) console.error('Supabase saveBatch error:', error.message);
    } catch (e) {
      console.warn('Supabase batch sync warning:', e);
    }
    return item;
  }

  async deleteBatch(id: string): Promise<void> {
    this.batches = this.batches.filter(b => b.id !== id);
    this.students = this.students.filter(s => s.batch_id !== id);
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_batches').delete().eq('id', id);
      if (error) console.error('Supabase deleteBatch error:', error.message);
    } catch (e) {
      console.warn('Supabase batch delete warning:', e);
    }
  }

  // -------------------------
  // STUDENTS
  // -------------------------
  async saveStudent(student: Partial<Student>): Promise<Student> {
    const item: Student = {
      id: student.id || generateUUID(),
      batch_id: student.batch_id!,
      register_no: student.register_no!,
      name: student.name!,
      class: student.class || '',
      phone: student.phone || '',
    };

    const idx = this.students.findIndex(s => s.id === item.id);
    if (idx >= 0) this.students[idx] = item;
    else this.students.push(item);

    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_students').upsert(item);
      if (error) console.error('Supabase saveStudent error:', error.message);
    } catch (e) {
      console.warn('Supabase student sync warning:', e);
    }
    return item;
  }

  async deleteStudent(id: string): Promise<void> {
    this.students = this.students.filter(s => s.id !== id);
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_students').delete().eq('id', id);
      if (error) console.error('Supabase deleteStudent error:', error.message);
    } catch (e) {
      console.warn('Supabase student delete warning:', e);
    }
  }

  // -------------------------
  // BATCH COURSES & SYLLABUS
  // -------------------------
  async saveBatchCourse(bc: Partial<BatchCourse>): Promise<BatchCourse> {
    const item: BatchCourse = {
      id: bc.id || generateUUID(),
      batch_id: bc.batch_id!,
      course_id: bc.course_id!,
      trainer_id: bc.trainer_id,
      semester: bc.semester || 1,
      planned_hours: bc.planned_hours || 30,
      start_date: bc.start_date,
      end_date: bc.end_date,
      status: bc.status || 'Active',
    };

    const idx = this.batchCourses.findIndex(b => b.id === item.id);
    if (idx >= 0) this.batchCourses[idx] = item;
    else this.batchCourses.push(item);

    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_batch_courses').upsert(item);
      if (error) console.error('Supabase saveBatchCourse error:', error.message);
    } catch (e) {
      console.warn('Supabase batch course sync warning:', e);
    }

    // Auto copy default syllabus if new
    const defTopics = this.defaultSyllabus.filter(s => s.course_id === item.course_id);
    for (const topic of defTopics) {
      const sylItem: BatchCourseSyllabus = {
        id: generateUUID(),
        batch_course_id: item.id,
        topic_no: topic.topic_no,
        topic_name: topic.topic_name,
        planned_hours: topic.planned_hours,
        is_completed: false,
      };
      this.batchSyllabus.push(sylItem);
      try {
        await supabase.from('uct_batch_course_syllabus').upsert(sylItem);
      } catch (e) {
        console.warn('Supabase batch syllabus sync warning:', e);
      }
    }

    this.saveLocalCache();
    return item;
  }

  async toggleBatchSyllabusTopic(id: string, isCompleted: boolean, completedDate?: string): Promise<void> {
    const idx = this.batchSyllabus.findIndex(s => s.id === id);
    if (idx >= 0) {
      this.batchSyllabus[idx].is_completed = isCompleted;
      this.batchSyllabus[idx].completed_date = isCompleted ? (completedDate || new Date().toISOString().split('T')[0]) : undefined;
      this.saveLocalCache();
      try {
        const { error } = await supabase.from('uct_batch_course_syllabus').update({
          is_completed: isCompleted,
          completed_date: this.batchSyllabus[idx].completed_date,
        }).eq('id', id);
        if (error) console.error('Supabase toggleBatchSyllabusTopic error:', error.message);
      } catch (e) {
        console.warn('Supabase syllabus toggle warning:', e);
      }
    }
  }

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
