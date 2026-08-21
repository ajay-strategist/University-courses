import type { 
  College, Program, Course, CourseDefaultSyllabus, AssessmentType, 
  Batch, Student, BatchCourse, BatchCourseSyllabus, Session, TrainerLog,
  Attendance, Assessment, AssessmentMark, Profile, UserEmailConfig, NotificationLog,
  MigrationRun, MigrationMapping
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

export const INITIAL_PROFILES: Profile[] = [];

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
  migrationRuns: MigrationRun[] = [];
  migrationMappings: MigrationMapping[] = [];
  trainerLogs: TrainerLog[] = [];

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

      const cProfs = localStorage.getItem('uct_profiles');
      if (cProfs) this.profiles = JSON.parse(cProfs);

      const cEmailConfigs = localStorage.getItem('uct_user_email_config');
      if (cEmailConfigs) this.emailConfigs = JSON.parse(cEmailConfigs);

      const cNotificationLogs = localStorage.getItem('uct_notification_logs');
      if (cNotificationLogs) this.notificationLogs = JSON.parse(cNotificationLogs);

      const cMigrationRuns = localStorage.getItem('uct_migration_runs');
      if (cMigrationRuns) this.migrationRuns = JSON.parse(cMigrationRuns);

      const cMigrationMappings = localStorage.getItem('uct_migration_mappings');
      if (cMigrationMappings) this.migrationMappings = JSON.parse(cMigrationMappings);

      const cTrainerLogs = localStorage.getItem('uct_trainer_logs');
      if (cTrainerLogs) this.trainerLogs = JSON.parse(cTrainerLogs);
    } catch (e) {
      console.warn('LocalStorage load warning:', e);
    }
  }

  // Clears the local cache and reloads the page — forces a fresh sync from Supabase
  clearCacheAndReload() {
    const cacheKeys = [
      'uct_colleges', 'uct_programs', 'uct_courses', 'uct_default_syllabus',
      'uct_assessment_types', 'uct_batches', 'uct_students', 'uct_batch_courses',
      'uct_batch_syllabus', 'uct_sessions', 'uct_attendance', 'uct_assessments',
      'uct_assessment_marks', 'uct_profiles', 'uct_user_email_config',
      'uct_notification_logs', 'uct_migration_runs', 'uct_migration_mappings', 'uct_trainer_logs',
    ];
    cacheKeys.forEach(k => localStorage.removeItem(k));
    window.location.reload();
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
      localStorage.setItem('uct_profiles', JSON.stringify(this.profiles));
      localStorage.setItem('uct_user_email_config', JSON.stringify(this.emailConfigs));
      localStorage.setItem('uct_notification_logs', JSON.stringify(this.notificationLogs));
      localStorage.setItem('uct_migration_runs', JSON.stringify(this.migrationRuns));
      localStorage.setItem('uct_migration_mappings', JSON.stringify(this.migrationMappings));
      localStorage.setItem('uct_trainer_logs', JSON.stringify(this.trainerLogs));
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
        { data: emails, error: eEmails },
        { data: logs, error: eLogs },
        { data: runs, error: eRuns },
        { data: mappings, error: eMappings },
        { data: tLogs, error: eTLogs },
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
        supabase.from('uct_user_email_config').select('*'),
        supabase.from('uct_notification_log').select('*'),
        supabase.from('uct_migration_runs').select('*').order('created_at', { ascending: false }),
        supabase.from('uct_migration_mappings').select('*').order('created_at', { ascending: false }),
        supabase.from('uct_trainer_logs').select('*').order('log_date', { ascending: false }),
      ]);

      // Supabase is the single source of truth.
      // Do NOT re-push local cache to DB — that would resurrect records deleted from the DB.

      // Always use Supabase data directly — overwrite local cache completely.
      // This ensures records deleted from the DB are never shown from stale cache.
      if (profs !== null) this.profiles = (profs || []) as Profile[];
      if (cols !== null) this.colleges = (cols || []) as College[];
      if (progs !== null) this.programs = (progs || []) as Program[];
      if (crses !== null) this.courses = (crses || []) as Course[];
      if (defSyl !== null) this.defaultSyllabus = (defSyl || []) as CourseDefaultSyllabus[];
      if (assTypes !== null) this.assessmentTypes = (assTypes || []) as AssessmentType[];
      if (bts !== null) this.batches = (bts || []) as Batch[];
      if (stds !== null) this.students = (stds || []) as Student[];
      if (bCrs !== null) this.batchCourses = (bCrs || []) as BatchCourse[];
      if (bSyl !== null) this.batchSyllabus = (bSyl || []) as BatchCourseSyllabus[];
      if (sess !== null) this.sessions = (sess || []) as Session[];
      if (atts !== null) this.attendance = (atts || []) as Attendance[];
      if (asms !== null) this.assessments = (asms || []) as Assessment[];
      if (marks !== null) this.assessmentMarks = (marks || []) as AssessmentMark[];
      if (emails !== null) this.emailConfigs = (emails || []) as UserEmailConfig[];
      if (logs !== null) this.notificationLogs = (logs || []) as NotificationLog[];
      if (runs !== null) this.migrationRuns = (runs || []) as MigrationRun[];
      if (mappings !== null) this.migrationMappings = (mappings || []) as MigrationMapping[];
      if (tLogs !== null) this.trainerLogs = (tLogs || []) as TrainerLog[];
      const allErrors = {
        eProfs, eCols, eProgs, eCrses, eDefSyl, eAssTypes, eBts, eStds, eBCrs, eBSyl, eSess, eAtts, eAsms, eMarks, eEmails, eLogs, eRuns, eMappings, eTLogs
      };
      const errorCount = Object.values(allErrors).filter(Boolean).length;
      if (errorCount > 0) {
        console.warn('Supabase fetch returned warnings/errors:', allErrors);
      }

      this.saveLocalCache();
      this.isInitialized = true;
    } catch (err) {
      console.warn('Failed to load initial data from Supabase:', err);
    }
  }

  // -------------------------
  // TRAINER LOGS
  // -------------------------
  async saveTrainerLog(log: Partial<TrainerLog>): Promise<TrainerLog> {
    const trainerProfile = this.profiles.find(p => p.id === log.trainer_id);
    const trainerName = trainerProfile ? trainerProfile.full_name : 'Unassigned';

    const item: TrainerLog = {
      id: log.id || generateUUID(),
      batch_course_id: log.batch_course_id!,
      trainer_id: log.trainer_id,
      trainer_name: trainerName,
      log_date: log.log_date!,
      start_time: log.start_time!,
      end_time: log.end_time!,
      duration_minutes: log.duration_minutes ?? 0,
      topics_covered: log.topics_covered ?? [],
      notes: log.notes,
      created_at: log.created_at || new Date().toISOString(),
    };

    const idx = this.trainerLogs.findIndex(l => l.id === item.id);
    const oldLog = idx >= 0 ? { ...this.trainerLogs[idx] } : null;

    if (idx >= 0) this.trainerLogs[idx] = item;
    else this.trainerLogs.push(item);
    this.saveLocalCache();

    // Auto-mark covered topics as completed / uncompleted in the batch syllabus
    const today = item.log_date;

    // 1. Un-mark removed topics
    if (oldLog) {
      const removedTopics = oldLog.topics_covered.filter(id => !item.topics_covered.includes(id));
      for (const topicId of removedTopics) {
        const sylIdx = this.batchSyllabus.findIndex(s => s.id === topicId);
        if (sylIdx >= 0) {
          this.batchSyllabus[sylIdx].is_completed = false;
          this.batchSyllabus[sylIdx].completed_date = undefined;
          const { error } = await supabase.from('uct_batch_course_syllabus').update({
            is_completed: false,
            completed_date: null,
          }).eq('id', topicId);
          if (error) {
            console.error('Auto-uncomplete topic error:', error.message);
            throw new Error(`Failed to update topic completion in database: ${error.message}`);
          }
        }
      }
    }

    // 2. Mark current topics as completed
    for (const topicId of item.topics_covered) {
      const sylIdx = this.batchSyllabus.findIndex(s => s.id === topicId);
      if (sylIdx >= 0) {
        this.batchSyllabus[sylIdx].is_completed = true;
        this.batchSyllabus[sylIdx].completed_date = today;
        const { error } = await supabase.from('uct_batch_course_syllabus').update({
          is_completed: true,
          completed_date: today,
        }).eq('id', topicId);
        if (error) {
          console.error('Auto-complete topic error:', error.message);
          throw new Error(`Failed to update topic completion in database: ${error.message}`);
        }
      }
    }
    this.saveLocalCache();

    const dbItem = {
      ...item,
      trainer_id: item.trainer_id && !item.trainer_id.startsWith('usr-') ? item.trainer_id : null,
      notes: item.notes || null,
      topics_covered: item.topics_covered, // stored as jsonb array
    };
    const { error } = await supabase.from('uct_trainer_logs').upsert(dbItem);
    if (error) {
      console.error('Supabase saveTrainerLog error:', error.message);
      throw new Error(`Failed to save trainer log in database: ${error.message}`);
    }
    return item;
  }

  async deleteTrainerLog(id: string): Promise<void> {
    this.trainerLogs = this.trainerLogs.filter(l => l.id !== id);
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_trainer_logs').delete().eq('id', id);
      if (error) console.error('Supabase deleteTrainerLog error:', error.message);
    } catch (e) {
      console.warn('Supabase trainer log delete warning:', e);
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
      const { error } = await supabase.from('uct_course_default_syllabus').upsert(item, { onConflict: 'course_id,topic_no' });
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
        college_coordinator_id: item.college_coordinator_id && !item.college_coordinator_id.startsWith('usr-') ? item.college_coordinator_id : null,
        student_coordinator_id: item.student_coordinator_id && !item.student_coordinator_id.startsWith('usr-') ? item.student_coordinator_id : null,
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
    const regNoUpper = student.register_no?.trim().toUpperCase();
    const existing = this.students.find(
      s => s.batch_id === student.batch_id && s.register_no?.trim().toUpperCase() === regNoUpper
    );
    const item: Student = {
      id: student.id || existing?.id || generateUUID(),
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
      const { error } = await supabase.from('uct_students').upsert(item, { onConflict: 'batch_id,register_no' });
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

  async deleteStudents(ids: string[]): Promise<void> {
    this.students = this.students.filter(s => !ids.includes(s.id));
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_students').delete().in('id', ids);
      if (error) console.error('Supabase deleteStudents error:', error.message);
    } catch (e) {
      console.warn('Supabase student bulk delete warning:', e);
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
    const isNew = idx < 0;
    if (idx >= 0) this.batchCourses[idx] = item;
    else this.batchCourses.push(item);

    this.saveLocalCache();

    try {
      const dbItem = {
        ...item,
        trainer_id: item.trainer_id && !item.trainer_id.startsWith('usr-') ? item.trainer_id : null
      };
      const { error } = await supabase.from('uct_batch_courses').upsert(dbItem, { onConflict: 'batch_id,course_id,semester' });
      if (error) console.error('Supabase saveBatchCourse error:', error.message);
    } catch (e) {
      console.warn('Supabase batch course sync warning:', e);
    }

    if (isNew) {
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
    }

    this.saveLocalCache();
    return item;
  }

  async deleteBatchCourse(id: string): Promise<void> {
    this.batchCourses = this.batchCourses.filter(bc => bc.id !== id);
    this.batchSyllabus = this.batchSyllabus.filter(s => s.batch_course_id !== id);
    this.saveLocalCache();

    try {
      await supabase.from('uct_batch_course_syllabus').delete().eq('batch_course_id', id);
      const { error } = await supabase.from('uct_batch_courses').delete().eq('id', id);
      if (error) console.error('Supabase deleteBatchCourse error:', error.message);
    } catch (e) {
      console.warn('Supabase delete batch course warning:', e);
    }
  }

  async toggleBatchSyllabusTopic(id: string, isCompleted: boolean, completedDate?: string): Promise<void> {
    const idx = this.batchSyllabus.findIndex(s => s.id === id);
    if (idx >= 0) {
      this.batchSyllabus[idx].is_completed = isCompleted;
      this.batchSyllabus[idx].completed_date = isCompleted ? (completedDate || new Date().toISOString().split('T')[0]) : undefined;
      this.saveLocalCache();
      const { error } = await supabase.from('uct_batch_course_syllabus').update({
        is_completed: isCompleted,
        completed_date: this.batchSyllabus[idx].completed_date || null,
      }).eq('id', id);
      if (error) {
        console.error('Supabase toggleBatchSyllabusTopic error:', error.message);
        throw new Error(`Failed to toggle syllabus topic in database: ${error.message}`);
      }
    }
  }

  async saveBatchSyllabusTopic(topic: Partial<BatchCourseSyllabus>): Promise<BatchCourseSyllabus> {
    const item: BatchCourseSyllabus = {
      id: topic.id || generateUUID(),
      batch_course_id: topic.batch_course_id!,
      topic_no: topic.topic_no ?? 1,
      topic_name: topic.topic_name!,
      planned_hours: topic.planned_hours ?? 0,
      is_completed: topic.is_completed ?? false,
      completed_date: topic.completed_date || null,
    };
    // DB call FIRST — only update local state if DB succeeds
    const { error } = await supabase.from('uct_batch_course_syllabus').upsert(item);
    if (error) {
      console.error('Supabase saveBatchSyllabusTopic error:', error.message);
      throw new Error(`Failed to save syllabus topic in database: ${error.message}`);
    }
    const idx = this.batchSyllabus.findIndex(s => s.id === item.id);
    if (idx >= 0) this.batchSyllabus[idx] = item;
    else this.batchSyllabus.push(item);
    this.saveLocalCache();
    return item;
  }

  async deleteBatchSyllabusTopic(id: string): Promise<void> {
    this.batchSyllabus = this.batchSyllabus.filter(s => s.id !== id);
    this.saveLocalCache();
    const { error } = await supabase.from('uct_batch_course_syllabus').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteBatchSyllabusTopic error:', error.message);
      throw new Error(`Failed to delete syllabus topic in database: ${error.message}`);
    }
  }

  async syncBatchSyllabusFromDefault(batchCourseId: string, courseId: string): Promise<number> {
    const existing = this.batchSyllabus.filter(s => s.batch_course_id === batchCourseId);
    const defTopics = this.defaultSyllabus.filter(s => s.course_id === courseId);
    let added = 0;
    for (const def of defTopics) {
      // Check if topic_no already exists in batch syllabus
      const alreadyExists = existing.some(s => s.topic_no === def.topic_no);
      if (!alreadyExists) {
        const sylItem: BatchCourseSyllabus = {
          id: generateUUID(),
          batch_course_id: batchCourseId,
          topic_no: def.topic_no,
          topic_name: def.topic_name,
          planned_hours: def.planned_hours,
          is_completed: false,
        };
        this.batchSyllabus.push(sylItem);
        try {
          await supabase.from('uct_batch_course_syllabus').upsert(sylItem);
        } catch (e) {
          console.warn('Supabase syllabus sync warning:', e);
        }
        added++;
      }
    }
    if (added > 0) this.saveLocalCache();
    return added;
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

  async saveAssessmentMark(mark: AssessmentMark): Promise<AssessmentMark> {
    const idx = this.assessmentMarks.findIndex(
      m => m.assessment_id === mark.assessment_id && m.student_id === mark.student_id
    );
    if (idx >= 0) {
      this.assessmentMarks[idx] = mark;
    } else {
      this.assessmentMarks.push(mark);
    }
    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_assessment_marks').upsert(mark, { onConflict: 'assessment_id,student_id' });
      if (error) {
        console.error('Supabase saveAssessmentMark error:', error.message);
        throw error;
      }
    } catch (e) {
      console.warn('Supabase assessment mark sync warning:', e);
      throw e;
    }
    return mark;
  }

  async saveAssessmentMarks(marks: AssessmentMark[]): Promise<void> {
    marks.forEach(mark => {
      const idx = this.assessmentMarks.findIndex(
        m => m.assessment_id === mark.assessment_id && m.student_id === mark.student_id
      );
      if (idx >= 0) {
        this.assessmentMarks[idx] = mark;
      } else {
        this.assessmentMarks.push(mark);
      }
    });
    this.saveLocalCache();

    // De-duplicate rows by conflict target (assessment_id, student_id) for the database query
    const uniqueMarksMap = new Map<string, AssessmentMark>();
    marks.forEach(m => {
      const key = `${m.assessment_id}_${m.student_id}`;
      uniqueMarksMap.set(key, m);
    });
    const uniqueMarks = Array.from(uniqueMarksMap.values());

    try {
      const { error } = await supabase.from('uct_assessment_marks').upsert(uniqueMarks, { onConflict: 'assessment_id,student_id' });
      if (error) {
        console.error('Supabase saveAssessmentMarks error:', error.message);
        throw error;
      }
    } catch (e) {
      console.warn('Supabase assessment marks sync warning:', e);
      throw e;
    }
  }

  async saveSession(session: Session): Promise<Session> {
    const idx = this.sessions.findIndex(s => s.id === session.id);
    if (idx >= 0) {
      this.sessions[idx] = session;
    } else {
      this.sessions.push(session);
    }
    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_sessions').upsert(session, { onConflict: 'batch_course_id,session_date,hour_no' });
      if (error) console.error('Supabase saveSession error:', error.message);
    } catch (e) {
      console.warn('Supabase session sync warning:', e);
    }
    return session;
  }

  async saveAttendanceRecords(records: Attendance[]): Promise<void> {
    records.forEach(rec => {
      const idx = this.attendance.findIndex(a => a.session_id === rec.session_id && a.student_id === rec.student_id);
      if (idx >= 0) {
        this.attendance[idx] = rec;
      } else {
        this.attendance.push(rec);
      }
    });
    this.saveLocalCache();

    // De-duplicate records by conflict target (session_id, student_id) for the database query
    const uniqueRecordsMap = new Map<string, Attendance>();
    records.forEach(r => {
      const key = `${r.session_id}_${r.student_id}`;
      uniqueRecordsMap.set(key, r);
    });
    const uniqueRecords = Array.from(uniqueRecordsMap.values());

    try {
      const { error } = await supabase.from('uct_attendance').upsert(uniqueRecords, { onConflict: 'session_id,student_id' });
      if (error) {
        console.error('Supabase saveAttendanceRecords error:', error.message);
        throw error;
      }
    } catch (e) {
      console.warn('Supabase attendance sync warning:', e);
      throw e;
    }
  }

  // Deletes a session + all its attendance rows (ON DELETE CASCADE handles DB side)
  async deleteSession(id: string): Promise<void> {
    this.attendance = this.attendance.filter(a => a.session_id !== id);
    this.sessions = this.sessions.filter(s => s.id !== id);
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_sessions').delete().eq('id', id);
      if (error) console.error('Supabase deleteSession error:', error.message);
    } catch (e) {
      console.warn('Supabase session delete warning:', e);
    }
  }

  // Deletes a single student attendance record (leaves the session intact)
  async deleteAttendanceRecord(id: string): Promise<void> {
    this.attendance = this.attendance.filter(a => a.id !== id);
    this.saveLocalCache();
    try {
      const { error } = await supabase.from('uct_attendance').delete().eq('id', id);
      if (error) console.error('Supabase deleteAttendanceRecord error:', error.message);
    } catch (e) {
      console.warn('Supabase attendance record delete warning:', e);
    }
  }

  // -------------------------
  // PROFILES
  // -------------------------
  async saveProfile(profile: Profile): Promise<Profile> {
    const idx = this.profiles.findIndex(p => p.id === profile.id);
    if (idx >= 0) this.profiles[idx] = profile;
    else this.profiles.push(profile);

    this.saveLocalCache();

    if (!profile.id.startsWith('usr-')) {
      try {
        const { error } = await supabase.from('uct_profiles').upsert(profile);
        if (error) console.error('Supabase saveProfile error:', error.message);
      } catch (e) {
        console.warn('Supabase profile sync warning:', e);
      }
    }
    return profile;
  }

  async deleteProfile(id: string): Promise<void> {
    this.profiles = this.profiles.filter(p => p.id !== id);
    this.saveLocalCache();

    if (!id.startsWith('usr-')) {
      try {
        const { error } = await supabase.rpc('admin_delete_user', { target_user_id: id });
        if (error) console.error('Supabase deleteProfile error:', error.message);
      } catch (e) {
        console.warn('Supabase profile delete warning:', e);
      }
    }
  }

  // -------------------------
  // EMAIL CONFIGURATION
  // -------------------------
  async saveEmailConfig(config: UserEmailConfig): Promise<UserEmailConfig> {
    const idx = this.emailConfigs.findIndex(c => c.user_id === config.user_id);
    if (idx >= 0) this.emailConfigs[idx] = config;
    else this.emailConfigs.push(config);

    this.saveLocalCache();

    if (!config.user_id.startsWith('usr-')) {
      try {
        const { error } = await supabase.from('uct_user_email_config').upsert(config);
        if (error) console.error('Supabase saveEmailConfig error:', error.message);
      } catch (e) {
        console.warn('Supabase email config sync warning:', e);
      }
    }
    return config;
  }

  // -------------------------
  // NOTIFICATION LOGS
  // -------------------------
  async saveNotificationLog(log: NotificationLog): Promise<NotificationLog> {
    const idx = this.notificationLogs.findIndex(l => l.id === log.id);
    if (idx >= 0) this.notificationLogs[idx] = log;
    else this.notificationLogs.unshift(log);

    this.saveLocalCache();

    if (log.id && !log.id.startsWith('log-test-') && !log.id.startsWith('log-')) {
      try {
        const dbItem = {
          ...log,
          sender_id: log.sender_id && !log.sender_id.startsWith('usr-') ? log.sender_id : null
        };
        const { error } = await supabase.from('uct_notification_log').upsert(dbItem);
        if (error) console.error('Supabase saveNotificationLog error:', error.message);
      } catch (e) {
        console.warn('Supabase notification log sync warning:', e);
      }
    }
    return log;
  }

  // -------------------------
  // ASSESSMENTS
  // -------------------------
  async saveAssessment(assessment: Assessment): Promise<Assessment> {
    let typeId = assessment.type_id;
    if (!typeId) {
      // Find or create default assessment type
      let defaultType = this.assessmentTypes.find(t => t.name.toLowerCase() === 'default' || t.name.toLowerCase() === 'assignment');
      if (!defaultType) {
        defaultType = {
          id: generateUUID(),
          name: 'Default',
          default_max_mark: 100,
        };
        this.assessmentTypes.push(defaultType);
        this.saveLocalCache();
        try {
          await supabase.from('uct_assessment_types').upsert(defaultType);
        } catch (e) {
          console.warn('Failed to save default assessment type:', e);
        }
      }
      typeId = defaultType.id;
    }

    const item: Assessment = {
      ...assessment,
      type_id: typeId,
      assignment_category: assessment.assignment_category || null,
    };

    const idx = this.assessments.findIndex(a => a.id === item.id);
    if (idx >= 0) this.assessments[idx] = item;
    else this.assessments.push(item);

    this.saveLocalCache();

    const { error } = await supabase.from('uct_assessments').upsert(item);
    if (error) {
      console.error('Supabase saveAssessment error:', error.message);
      throw new Error(`Failed to save assessment in database: ${error.message}`);
    }
    return item;
  }

  // -------------------------
  // MIGRATIONS
  // -------------------------
  async saveMigrationRun(run: MigrationRun): Promise<MigrationRun> {
    const idx = this.migrationRuns.findIndex(r => r.id === run.id);
    if (idx >= 0) this.migrationRuns[idx] = run;
    else this.migrationRuns.unshift(run);

    this.saveLocalCache();

    try {
      const dbItem = {
        ...run,
        uploaded_by: run.uploaded_by && !run.uploaded_by.startsWith('usr-') ? run.uploaded_by : null
      };
      const { error } = await supabase.from('uct_migration_runs').upsert(dbItem);
      if (error) console.error('Supabase saveMigrationRun error:', error.message);
    } catch (e) {
      console.warn('Supabase migration run sync warning:', e);
    }
    return run;
  }

  async saveMigrationMapping(mapping: MigrationMapping): Promise<MigrationMapping> {
    const idx = this.migrationMappings.findIndex(m => m.id === mapping.id);
    if (idx >= 0) this.migrationMappings[idx] = mapping;
    else this.migrationMappings.push(mapping);

    this.saveLocalCache();

    try {
      const dbItem = {
        ...mapping,
        owner_id: mapping.owner_id && !mapping.owner_id.startsWith('usr-') ? mapping.owner_id : null
      };
      const { error } = await supabase.from('uct_migration_mappings').upsert(dbItem);
      if (error) console.error('Supabase saveMigrationMapping error:', error.message);
    } catch (e) {
      console.warn('Supabase migration mapping sync warning:', e);
    }
    return mapping;
  }

  async deleteMigrationMapping(id: string): Promise<void> {
    this.migrationMappings = this.migrationMappings.filter(m => m.id !== id);
    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_migration_mappings').delete().eq('id', id);
      if (error) console.error('Supabase deleteMigrationMapping error:', error.message);
    } catch (e) {
      console.warn('Supabase migration mapping delete warning:', e);
    }
  }

  async saveBatchCourseSyllabusTopic(sylItem: BatchCourseSyllabus): Promise<BatchCourseSyllabus> {
    const idx = this.batchSyllabus.findIndex(s => s.id === sylItem.id);
    if (idx >= 0) this.batchSyllabus[idx] = sylItem;
    else this.batchSyllabus.push(sylItem);

    this.saveLocalCache();

    try {
      const { error } = await supabase.from('uct_batch_course_syllabus').upsert(sylItem, { onConflict: 'batch_course_id,topic_no' });
      if (error) console.error('Supabase saveBatchCourseSyllabusTopic error:', error.message);
    } catch (e) {
      console.warn('Supabase batch course syllabus sync warning:', e);
    }
    return sylItem;
  }

  async commitMigrationDataLocal(payload: any, skipErrored: boolean): Promise<{ success: boolean; summary: any; error?: string }> {
    const summary: any = {
      colleges: { new: 0, updated: 0, errored: 0 },
      programs: { new: 0, updated: 0, errored: 0 },
      courses: { new: 0, updated: 0, errored: 0 },
      course_default_syllabus: { new: 0, updated: 0, errored: 0 },
      users: { new: 0, updated: 0, errored: 0 },
      batches: { new: 0, updated: 0, errored: 0 },
      students: { new: 0, updated: 0, errored: 0 },
      batch_courses: { new: 0, updated: 0, errored: 0 },
      batch_course_syllabus: { new: 0, updated: 0, errored: 0 },
      assessments: { new: 0, updated: 0, errored: 0 },
      assessment_marks: { new: 0, updated: 0, errored: 0 },
      attendance: { new: 0, updated: 0, errored: 0 },
      trainer_logs: { new: 0, updated: 0, errored: 0 },
    };

    const collegeCodeToId: Record<string, string> = {};
    const programCodeToId: Record<string, string> = {};
    const courseCodeToId: Record<string, string> = {};
    const userEmailToId: Record<string, string> = {};
    const batchCodeToId: Record<string, string> = {};
    const batchCourseKeyToId: Record<string, string> = {};
    const studentRegToId: Record<string, string> = {}; 
    const assessmentKeyToId: Record<string, string> = {}; 

    this.colleges.forEach(c => collegeCodeToId[c.code.toUpperCase()] = c.id);
    this.programs.forEach(p => programCodeToId[p.code.toUpperCase()] = p.id);
    this.courses.forEach(c => courseCodeToId[c.code.toUpperCase()] = c.id);
    this.profiles.forEach(u => userEmailToId[u.email.toLowerCase()] = u.id);
    this.batches.forEach(b => batchCodeToId[b.code.toUpperCase()] = b.id);
    this.batchCourses.forEach(bc => {
      const b = this.batches.find(x => x.id === bc.batch_id);
      const c = this.courses.find(x => x.id === bc.course_id);
      if (b && c) {
        batchCourseKeyToId[`${b.code.toUpperCase()}_${c.code.toUpperCase()}`] = bc.id;
      }
    });
    this.students.forEach(s => {
      const b = this.batches.find(x => x.id === s.batch_id);
      if (b) {
        studentRegToId[`${b.code.toUpperCase()}_${s.register_no.toUpperCase()}`] = s.id;
      }
    });
    this.assessments.forEach(a => {
      assessmentKeyToId[`${a.batch_course_id}_${a.name.toUpperCase()}`] = a.id;
    });

    try {
      // 1. COLLEGES
      if (payload.colleges) {
        for (const row of payload.colleges) {
          try {
            const codeUpper = row.code.trim().toUpperCase();
            const existingId = collegeCodeToId[codeUpper];
            const isUpdate = !!existingId;
            const saved = await this.saveCollege({
              id: existingId,
              code: row.code.trim(),
              name: row.name.trim(),
              location: row.location || '',
              contact_person: row.contact_person || '',
              contact_email: row.contact_email || '',
              contact_phone: row.contact_phone || '',
            });
            collegeCodeToId[codeUpper] = saved.id;
            if (isUpdate) summary.colleges.updated++;
            else summary.colleges.new++;
          } catch (e: any) {
            summary.colleges.errored++;
            if (!skipErrored) throw new Error(`Colleges error: ${e.message}`);
          }
        }
      }

      // 2. PROGRAMS
      if (payload.programs) {
        for (const row of payload.programs) {
          try {
            const codeUpper = row.code.trim().toUpperCase();
            const existingId = programCodeToId[codeUpper];
            const isUpdate = !!existingId;
            const saved = await this.saveProgram({
              id: existingId,
              code: row.code.trim(),
              name: row.name.trim(),
            });
            programCodeToId[codeUpper] = saved.id;
            if (isUpdate) summary.programs.updated++;
            else summary.programs.new++;
          } catch (e: any) {
            summary.programs.errored++;
            if (!skipErrored) throw new Error(`Programs error: ${e.message}`);
          }
        }
      }

      // 3. COURSES
      if (payload.courses) {
        for (const row of payload.courses) {
          try {
            const codeUpper = row.code.trim().toUpperCase();
            const existingId = courseCodeToId[codeUpper];
            const isUpdate = !!existingId;
            const saved = await this.saveCourse({
              id: existingId,
              code: row.code.trim(),
              name: row.name.trim(),
            });
            courseCodeToId[codeUpper] = saved.id;
            if (isUpdate) summary.courses.updated++;
            else summary.courses.new++;
          } catch (e: any) {
            summary.courses.errored++;
            if (!skipErrored) throw new Error(`Courses error: ${e.message}`);
          }
        }
      }

      // 4. COURSE DEFAULT SYLLABUS
      if (payload.courseDefaultSyllabus) {
        for (const row of payload.courseDefaultSyllabus) {
          try {
            const cCode = row.course_code.trim().toUpperCase();
            const courseId = courseCodeToId[cCode];
            if (!courseId) throw new Error(`Course code not found: ${row.course_code}`);
            
            const existing = this.defaultSyllabus.find(s => s.course_id === courseId && s.topic_no === Number(row.topic_no));
            const isUpdate = !!existing;
            const saved = await this.saveDefaultSyllabusTopic({
              id: existing?.id,
              course_id: courseId,
              topic_no: Number(row.topic_no),
              topic_name: row.topic_name.trim(),
              planned_hours: Number(row.planned_hours) || 2,
            });
            if (isUpdate) summary.course_default_syllabus.updated++;
            else summary.course_default_syllabus.new++;
          } catch (e: any) {
            summary.course_default_syllabus.errored++;
            if (!skipErrored) throw new Error(`Course Default Syllabus error: ${e.message}`);
          }
        }
      }

      // 5. USERS
      if (payload.users) {
        for (const row of payload.users) {
          try {
            const emailLower = row.email.trim().toLowerCase();
            const existingId = userEmailToId[emailLower];
            const isUpdate = !!existingId;
            const userId = existingId || generateUUID();
            
            const saved = await this.saveProfile({
              id: userId,
              email: emailLower,
              full_name: row.full_name.trim(),
              phone: row.phone || '',
              role: row.role.trim().toLowerCase(),
            });
            userEmailToId[emailLower] = saved.id;
            if (isUpdate) summary.users.updated++;
            else summary.users.new++;
          } catch (e: any) {
            summary.users.errored++;
            if (!skipErrored) throw new Error(`Users error: ${e.message}`);
          }
        }
      }

      // 6. BATCHES
      if (payload.batches) {
        for (const row of payload.batches) {
          try {
            const collegeId = collegeCodeToId[row.college_code.trim().toUpperCase()];
            const programId = programCodeToId[row.program_code.trim().toUpperCase()];
            if (!collegeId) throw new Error(`College code not found: ${row.college_code}`);
            if (!programId) throw new Error(`Program code not found: ${row.program_code}`);

            const derivedBatchCode = `${row.college_code.trim().toUpperCase()}-${row.program_code.trim().toUpperCase()}-${row.academic_year.trim()}`;
            const existingId = batchCodeToId[derivedBatchCode];
            const isUpdate = !!existingId;

            const ccEmail = row.college_coordinator_email?.trim().toLowerCase();
            const scEmail = row.student_coordinator_email?.trim().toLowerCase();
            const ccId = ccEmail ? userEmailToId[ccEmail] : undefined;
            const scId = scEmail ? userEmailToId[scEmail] : undefined;

            const saved = await this.saveBatch({
              id: existingId,
              code: derivedBatchCode,
              college_id: collegeId,
              program_id: programId,
              academic_year: row.academic_year.trim(),
              current_semester: Number(row.current_semester) || 1,
              college_coordinator_id: ccId,
              student_coordinator_id: scId,
              start_date: row.start_date || undefined,
              end_date: row.end_date || undefined,
            });

            batchCodeToId[derivedBatchCode] = saved.id;
            if (isUpdate) summary.batches.updated++;
            else summary.batches.new++;
          } catch (e: any) {
            summary.batches.errored++;
            if (!skipErrored) throw new Error(`Batches error: ${e.message}`);
          }
        }
      }

      // 7. STUDENTS
      if (payload.students) {
        for (const row of payload.students) {
          try {
            const bCode = row.batch_code.trim().toUpperCase();
            const batchId = batchCodeToId[bCode];
            if (!batchId) throw new Error(`Batch code not found: ${row.batch_code}`);

            const regKey = `${bCode}_${String(row.register_no).trim().toUpperCase()}`;
            const existingId = studentRegToId[regKey];
            const isUpdate = !!existingId;

            const saved = await this.saveStudent({
              id: existingId,
              batch_id: batchId,
              register_no: String(row.register_no).trim(),
              name: row.name.trim(),
              class: row.class || '',
              phone: row.phone || '',
            });

            studentRegToId[regKey] = saved.id;
            if (isUpdate) summary.students.updated++;
            else summary.students.new++;
          } catch (e: any) {
            summary.students.errored++;
            if (!skipErrored) throw new Error(`Students error: ${e.message}`);
          }
        }
      }

      // 8. BATCH COURSES
      if (payload.batchCourses) {
        for (const row of payload.batchCourses) {
          try {
            const bCode = row.batch_code.trim().toUpperCase();
            const cCode = row.course_code.trim().toUpperCase();
            const batchId = batchCodeToId[bCode];
            const courseId = courseCodeToId[cCode];
            if (!batchId) throw new Error(`Batch code not found: ${row.batch_code}`);
            if (!courseId) throw new Error(`Course code not found: ${row.course_code}`);

            const tEmail = row.trainer_email?.trim().toLowerCase();
            const trainerId = tEmail ? userEmailToId[tEmail] : undefined;

            const key = `${bCode}_${cCode}`;
            const existingId = batchCourseKeyToId[key];
            const isUpdate = !!existingId;

            const saved = await this.saveBatchCourse({
              id: existingId,
              batch_id: batchId,
              course_id: courseId,
              trainer_id: trainerId,
              semester: Number(row.semester) || 1,
              planned_hours: Number(row.planned_hours) || 30,
              start_date: row.start_date || undefined,
              end_date: row.end_date || undefined,
              status: 'Active',
            });

            batchCourseKeyToId[key] = saved.id;
            if (isUpdate) summary.batch_courses.updated++;
            else summary.batch_courses.new++;
          } catch (e: any) {
            summary.batch_courses.errored++;
            if (!skipErrored) throw new Error(`Batch Courses error: ${e.message}`);
          }
        }
      }

      // 9. BATCH COURSE SYLLABUS
      if (payload.batchSyllabus) {
        for (const row of payload.batchSyllabus) {
          try {
            const bCode = row.batch_code.trim().toUpperCase();
            const cCode = row.course_code.trim().toUpperCase();
            const batchCourseId = batchCourseKeyToId[`${bCode}_${cCode}`];
            if (!batchCourseId) throw new Error(`Batch course not assigned: ${row.batch_code} - ${row.course_code}`);

            const existing = this.batchSyllabus.find(s => s.batch_course_id === batchCourseId && s.topic_no === Number(row.topic_no));
            const isUpdate = !!existing;

            await this.saveBatchCourseSyllabusTopic({
              id: existing?.id || generateUUID(),
              batch_course_id: batchCourseId,
              topic_no: Number(row.topic_no),
              topic_name: row.topic_name.trim(),
              planned_hours: Number(row.planned_hours) || 2,
              is_completed: String(row.is_completed).toLowerCase() === 'true' || row.is_completed === true || row.is_completed === 1 || row.is_completed === '1',
              completed_date: row.completed_date || undefined,
            });

            if (isUpdate) summary.batch_course_syllabus.updated++;
            else summary.batch_course_syllabus.new++;
          } catch (e: any) {
            summary.batch_course_syllabus.errored++;
            if (!skipErrored) throw new Error(`Batch Syllabus error: ${e.message}`);
          }
        }
      }

      // 10. ASSESSMENTS
      if (payload.assessments) {
        for (const row of payload.assessments) {
          try {
            const bCode = row.batch_code.trim().toUpperCase();
            const cCode = row.course_code.trim().toUpperCase();
            const batchCourseId = batchCourseKeyToId[`${bCode}_${cCode}`];
            if (!batchCourseId) throw new Error(`Batch course not assigned: ${row.batch_code} - ${row.course_code}`);

            const nameUpper = row.assessment_name.trim().toUpperCase();
            const existingId = assessmentKeyToId[`${batchCourseId}_${nameUpper}`];
            const isUpdate = !!existingId;

            const typeName = row.type.trim();
            let typeObj: AssessmentType | undefined = this.assessmentTypes.find(t => t.name.toLowerCase() === typeName.toLowerCase());
            if (!typeObj) {
              const newType: AssessmentType = {
                id: generateUUID(),
                name: typeName,
                default_max_mark: 100,
              };
              typeObj = newType;
              this.assessmentTypes.push(newType);
              await supabase.from('uct_assessment_types').upsert(newType);
            }

            const saved = await this.saveAssessment({
              id: existingId || generateUUID(),
              batch_course_id: batchCourseId,
              name: row.assessment_name.trim(),
              type_id: typeObj.id,
              max_mark: Number(row.max_mark) || 100,
              assessment_date: row.assessment_date || undefined,
              assignment_category: row.assignment_category || undefined,
            });

            assessmentKeyToId[`${batchCourseId}_${nameUpper}`] = saved.id;
            if (isUpdate) summary.assessments.updated++;
            else summary.assessments.new++;
          } catch (e: any) {
            summary.assessments.errored++;
            if (!skipErrored) throw new Error(`Assessments error: ${e.message}`);
          }
        }
      }

      // 11. ASSESSMENT MARKS
      if (payload.assessmentMarks) {
        for (const row of payload.assessmentMarks) {
          try {
            const bCode = row.batch_code.trim().toUpperCase();
            const cCode = row.course_code.trim().toUpperCase();
            const batchCourseId = batchCourseKeyToId[`${bCode}_${cCode}`];
            if (!batchCourseId) throw new Error(`Batch course not assigned: ${row.batch_code} - ${row.course_code}`);

            const assessmentId = assessmentKeyToId[`${batchCourseId}_${row.assessment_name.trim().toUpperCase()}`];
            if (!assessmentId) throw new Error(`Assessment not found: ${row.assessment_name}`);

            const studentId = studentRegToId[`${bCode}_${String(row.register_no).trim().toUpperCase()}`];
            if (!studentId) throw new Error(`Student not found in batch: ${row.register_no}`);

            const existing = this.assessmentMarks.find(m => m.assessment_id === assessmentId && m.student_id === studentId);
            const isUpdate = !!existing;

            const markItem = {
              id: existing?.id || generateUUID(),
              assessment_id: assessmentId,
              student_id: studentId,
              mark: Number(row.mark) || 0,
            };
            const idx = this.assessmentMarks.findIndex(m => m.id === markItem.id);
            if (idx >= 0) this.assessmentMarks[idx] = markItem;
            else this.assessmentMarks.push(markItem);

            const { error: upsertError } = await supabase.from('uct_assessment_marks').upsert(markItem, { onConflict: 'assessment_id,student_id' });
            if (upsertError) throw upsertError;

            if (isUpdate) summary.assessment_marks.updated++;
            else summary.assessment_marks.new++;
          } catch (e: any) {
            summary.assessment_marks.errored++;
            if (!skipErrored) throw new Error(`Assessment Marks error: ${e.message}`);
          }
        }
      }

      // 12. ATTENDANCE
      if (payload.attendance) {
        for (const row of payload.attendance) {
          try {
            const bCode = row.batch_code.trim().toUpperCase();
            const cCode = row.course_code.trim().toUpperCase();
            const batchCourseId = batchCourseKeyToId[`${bCode}_${cCode}`];
            if (!batchCourseId) throw new Error(`Batch course not assigned: ${row.batch_code} - ${row.course_code}`);

            const studentId = studentRegToId[`${bCode}_${String(row.register_no).trim().toUpperCase()}`];
            if (!studentId) throw new Error(`Student not found in batch: ${row.register_no}`);

            const sDate = row.session_date;
            const hourNo = Number(row.hour_no);

            let session = this.sessions.find(s => s.batch_course_id === batchCourseId && s.session_date === sDate && s.hour_no === hourNo);
            if (!session) {
              session = {
                id: generateUUID(),
                batch_course_id: batchCourseId,
                session_date: sDate,
                hour_no: hourNo,
              };
              this.sessions.push(session);
              const { error: sessError } = await supabase.from('uct_sessions').upsert(session, { onConflict: 'batch_course_id,session_date,hour_no' });
              if (sessError) throw sessError;
            }

            const existing = this.attendance.find(a => a.session_id === session!.id && a.student_id === studentId);
            const isUpdate = !!existing;

            const attStatus = String(row.status).trim().toLowerCase();
            const statusMapped = attStatus === 'absent' || attStatus === 'a' ? 'absent' : (attStatus === 'late' || attStatus === 'l' ? 'late' : 'present');

            const attItem: Attendance = {
              id: existing?.id || generateUUID(),
              session_id: session.id,
              student_id: studentId,
              status: statusMapped,
            };

            const idx = this.attendance.findIndex(a => a.id === attItem.id);
            if (idx >= 0) this.attendance[idx] = attItem;
            else this.attendance.push(attItem);

            const { error: attError } = await supabase.from('uct_attendance').upsert(attItem, { onConflict: 'session_id,student_id' });
            if (attError) throw attError;

            if (isUpdate) summary.attendance.updated++;
            else summary.attendance.new++;
          } catch (e: any) {
            summary.attendance.errored++;
            if (!skipErrored) throw new Error(`Attendance error: ${e.message}`);
          }
        }
      }

      // 13. TRAINER LOGS
      // Fields: Date (log_date), Batch (batch_code), Course (course_code), Trainer (trainer_name),
      //         Start Time (start_time), End Time (end_time), Covered Topics (covered_topics - comma-separated topic names as free text in notes)
      if (payload.trainerLogs) {
        for (const row of payload.trainerLogs) {
          try {
            const bCode = String(row.batch_code).trim().toUpperCase();
            const cCode = String(row.course_code).trim().toUpperCase();
            const batchCourseId = batchCourseKeyToId[`${bCode}_${cCode}`];
            if (!batchCourseId) throw new Error(`Batch course not assigned: ${row.batch_code} - ${row.course_code}`);

            const trainerName = String(row.trainer_name || 'Unassigned').trim();

            // Try to resolve trainer_id from profiles by name
            const trainerProfile = this.profiles.find(
              p => p.full_name.toLowerCase() === trainerName.toLowerCase()
            );

            const logDate = String(row.log_date || '').trim();
            const startTime = String(row.start_time || '').trim();
            const endTime = String(row.end_time || '').trim();

            // Compute duration_minutes from start/end times (HH:MM format)
            let durationMinutes = 0;
            try {
              const [sh, sm] = startTime.split(':').map(Number);
              const [eh, em] = endTime.split(':').map(Number);
              durationMinutes = (eh * 60 + em) - (sh * 60 + sm);
              if (durationMinutes < 0) durationMinutes = 0;
            } catch (_) {
              durationMinutes = 0;
            }

            // Resolve covered topics to syllabus UUIDs
            const coveredTopicsText = String(row.covered_topics || '').trim();
            const topicNames = coveredTopicsText.split(',').map(s => s.trim()).filter(Boolean);
            const syllabus = this.batchSyllabus.filter(s => s.batch_course_id === batchCourseId);

            const topicsCoveredIds: string[] = [];
            const unmatchedNames: string[] = [];

            const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            topicNames.forEach(name => {
              const cName = clean(name);
              const match = syllabus.find(s => {
                const cSName = clean(s.topic_name);
                return cSName === cName || cSName.includes(cName) || cName.includes(cSName);
              });

              if (match) {
                topicsCoveredIds.push(match.id);
              } else {
                unmatchedNames.push(name);
              }
            });

            await this.saveTrainerLog({
              id: generateUUID(),
              batch_course_id: batchCourseId,
              trainer_id: trainerProfile?.id,
              trainer_name: trainerName,
              log_date: logDate,
              start_time: startTime,
              end_time: endTime,
              duration_minutes: durationMinutes,
              topics_covered: topicsCoveredIds,
              notes: unmatchedNames.join(', '),
            });

            summary.trainer_logs.new++;
          } catch (e: any) {
            summary.trainer_logs.errored++;
            if (!skipErrored) throw new Error(`Trainer Log error: ${e.message}`);
          }
        }
      }

      this.saveLocalCache();
      return { success: true, summary };
    } catch (err: any) {
      this.saveLocalCache();
      return { success: false, summary, error: err.message };
    }
  }

  private async syncTable<T extends { id?: string; user_id?: string }>(
    tableName: string,
    localItems: T[],
    remoteItems: T[],
    sanitizeFn?: (item: T) => any
  ): Promise<void> {
    const toSync = localItems.filter(localItem => {
      const localKey = localItem.id || localItem.user_id;
      if (!localKey) return false;
      
      // Skip test items or items starting with temp structures
      if (localKey.startsWith?.('usr-') && (tableName === 'uct_profiles' || tableName === 'uct_user_email_config')) {
        return false;
      }
      if (tableName === 'uct_notification_log' && (localKey.startsWith?.('log-test-') || localKey.startsWith?.('log-'))) {
        return false;
      }

      const remoteItem = remoteItems.find(r => (r.id || r.user_id) === localKey);
      if (!remoteItem) {
        return true; // Local only
      }

      const localClean = { ...localItem };
      const remoteClean = { ...remoteItem };
      const stripKeys = [
        'created_at', 'updated_at', 
        'college', 'program', 'college_coordinator', 'student_coordinator', 
        'student_count', 'avg_attendance_pct', 'avg_coverage_pct', 
        'course', 'trainer', 'batch', 'coverage_pct', 'sessions_held', 'delivered_hours'
      ];
      stripKeys.forEach(k => {
        delete (localClean as any)[k];
        delete (remoteClean as any)[k];
      });

      return JSON.stringify(localClean) !== JSON.stringify(remoteClean);
    });

    if (toSync.length === 0) return;

    console.log(`[Sync] Pushing ${toSync.length} modified/new records to Supabase table ${tableName}...`);

    const chunkSize = 50;
    for (let i = 0; i < toSync.length; i += chunkSize) {
      const chunk = toSync.slice(i, i + chunkSize).map(item => {
        const sanitized = sanitizeFn ? sanitizeFn(item) : item;
        const dbItem = { ...sanitized };
        
        // Clean metadata fields
        const nonDbKeys = [
          'college', 'program', 'college_coordinator', 'student_coordinator', 
          'student_count', 'avg_attendance_pct', 'avg_coverage_pct', 
          'course', 'trainer', 'batch', 'coverage_pct', 'sessions_held', 'delivered_hours',
          'attendance_pct', 'type'
        ];
        nonDbKeys.forEach(k => delete (dbItem as any)[k]);
        return dbItem;
      });

      try {
        const { error } = await supabase.from(tableName).upsert(chunk);
        if (error) console.error(`[Sync] Failed to sync ${tableName} chunk:`, error.message);
      } catch (err) {
        console.warn(`[Sync] Error syncing ${tableName} chunk:`, err);
      }
    }
  }
}

export const store = new DataStore();
