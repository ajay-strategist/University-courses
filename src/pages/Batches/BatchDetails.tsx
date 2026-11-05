import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store, generateUUID } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import type {
  Student, BatchCourse, BatchCourseSyllabus, Session, Attendance,
  Assessment, AssessmentMark, Course, AbsenteePreview, TrainerLog, BatchTask, MissedReason,
  NotificationLog
} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  ArrowLeft, Users, BookOpen, CalendarCheck, Award,
  CheckSquare, Plus, Download, Upload, Mail, CheckCircle2, Clock,
  AlertTriangle, Check, X, FileSpreadsheet, Send, Edit2, Trash2,
  ListTodo, Calendar, Loader2, ShieldCheck, UserCheck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { CollegeLogo } from '@/components/common/CollegeLogo';
import { sendEmail, buildAbsenteeReportHtml, formatDateToDDMMYYYY } from '@/lib/emailService';

export default function BatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const batch = store.getBatchWithDetails(id || '');

  const { profile } = useAuth();
  const isStudentCoordinator = profile?.role === 'student_coordinator';

  const [activeTab, setActiveTab] = useState<
    'students' | 'attendance' | 'marks' | 'trainer_log' | 'task_list' | 'syllabus' | 'coverage' | 'courses'
  >(isStudentCoordinator ? 'attendance' : 'students');

  // Local reactive states for this batch
  const [students, setStudents] = useState<Student[]>(
    store.students.filter(s => s.batch_id === id)
  );
  const [batchCourses, setBatchCourses] = useState<BatchCourse[]>(
    store.batchCourses.filter(bc => bc.batch_id === id)
  );
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<number | 'all'>(() => {
    if (batch?.college_id && batch?.program_id) {
      const activeSem = store.getActiveSemester(batch.college_id, batch.program_id, batch.academic_year);
      if (activeSem) return activeSem.semester_no;
    }
    return batch?.current_semester || 'all';
  });
  const [selectedBatchCourseId, setSelectedBatchCourseId] = useState<string>(() => {
    let targetSem = batch?.current_semester || 1;
    if (batch?.college_id && batch?.program_id) {
      const activeSem = store.getActiveSemester(batch.college_id, batch.program_id, batch.academic_year);
      if (activeSem) targetSem = activeSem.semester_no;
    }
    return batchCourses.find(bc => bc.semester === targetSem)?.id || batchCourses[0]?.id || '';
  });

  // Modals & Dialogs
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showAbsenteeModal, setShowAbsenteeModal] = useState(false);
  const [isSendingAbsenteeEmail, setIsSendingAbsenteeEmail] = useState(false);
  const [absenteeSenderId, setAbsenteeSenderId] = useState<string>('');

  // Task List state
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskScope, setNewTaskScope] = useState<'semester' | 'common'>('semester');
  const [, setTasksVersion] = useState(0);

  const handleAddCustomTask = async (courseId: string, currentSemester: number) => {
    if (!newTaskText.trim()) {
      toast.error('Please enter a task description');
      return;
    }
    if (!courseId) {
      toast.error('Please select an active tool course first');
      return;
    }

    try {
      await store.saveBatchTask({
        batch_id: id!,
        course_id: courseId,
        semester: newTaskScope === 'semester' ? currentSemester : null,
        title: newTaskText.trim(),
        due_date: newTaskDueDate ? newTaskDueDate : null,
        is_completed: false,
      });
      setTasksVersion(v => v + 1);
      setNewTaskText('');
      setNewTaskDueDate('');
      toast.success(newTaskScope === 'semester' ? `Task added to Semester ${currentSemester}!` : 'Common course task added!');
    } catch (err: any) {
      toast.error('Failed to add task', { description: err.message });
    }
  };

  const handleToggleCustomTask = async (taskId: string) => {
    try {
      await store.toggleBatchTask(taskId);
      setTasksVersion(v => v + 1);
    } catch (err: any) {
      toast.error('Failed to update task', { description: err.message });
    }
  };

  const handleDeleteCustomTask = async (taskId: string) => {
    try {
      await store.deleteBatchTask(taskId);
      setTasksVersion(v => v + 1);
      toast.success('Task deleted');
    } catch (err: any) {
      toast.error('Failed to delete task', { description: err.message });
    }
  };

  // Syllabus Topic Editing State
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [topicEditForm, setTopicEditForm] = useState<{
    topic_no: number; topic_name: string;
  }>({ topic_no: 1, topic_name: '' });
  const [newTopicForm, setNewTopicForm] = useState<{
    topic_no: number; topic_name: string;
  }>({ topic_no: 1, topic_name: '' });

  // Trainer Log Tab State
  const today = new Date().toISOString().split('T')[0];
  const [sessionLogType, setSessionLogType] = useState<'conducted' | 'missed'>('conducted');
  const [trainerLogFilter, setTrainerLogFilter] = useState<'all' | 'conducted' | 'missed'>('all');
  const [trainerLogForm, setTrainerLogForm] = useState({
    log_date: today,
    trainer_id: '',
    start_time: '',
    end_time: '',
    notes: '',
  });
  const [missedSessionForm, setMissedSessionForm] = useState({
    log_date: today,
    trainer_id: '',
    missed_hours: 2,
    missed_reason: 'trainer_leave' as MissedReason,
    notes: '',
  });
  const [trainerLogTopics, setTrainerLogTopics] = useState<string[]>([]); // selected topic IDs
  const [showCompletedInLog, setShowCompletedInLog] = useState(false);

  // Student Form Inputs
  const [studentForm, setStudentForm] = useState({ register_no: '', name: '', class: 'Div A', phone: '' });

  // Selected Student IDs for bulk delete
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Edit Allocated Course Modal State
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingBatchCourse, setEditingBatchCourse] = useState<BatchCourse | null>(null);
  const [editCourseTrainerId, setEditCourseTrainerId] = useState('');
  const [editCoursePlannedHours, setEditCoursePlannedHours] = useState(30);
  const [editCourseSemester, setEditCourseSemester] = useState(1);
  const [editCourseStatus, setEditCourseStatus] = useState<string>('Active');

  // Add Batch Course Inputs
  const [newCourseId, setNewCourseId] = useState(store.courses[0]?.id || '');
  const [newTrainerId, setNewTrainerId] = useState(store.profiles.find(p => p.role === 'trainer')?.id || '');
  const [newPlannedHours, setNewPlannedHours] = useState(30);
  const [newCourseSemester, setNewCourseSemester] = useState(1);

  // Attendance Register State
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceHour, setAttendanceHour] = useState(1);
  const [registerStatusMap, setRegisterStatusMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [attendanceViewMode, setAttendanceViewMode] = useState<'register' | 'matrix'>('register');
  const [attendanceReportMode, setAttendanceReportMode] = useState<'single' | 'range'>('single');
  const [attendanceStartDate, setAttendanceStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceEndDate, setAttendanceEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Reset manual overrides when session parameters change so saved records take effect
  useEffect(() => {
    setRegisterStatusMap({});
  }, [selectedBatchCourseId, attendanceDate, attendanceHour]);

  // Marks State
  const initialAssessments = store.assessments.filter(a => a.batch_course_id === selectedBatchCourseId);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    initialAssessments[0]?.id || 'new'
  );
  const [assessmentName, setAssessmentName] = useState<string>(
    initialAssessments[0]?.name || ''
  );
  const [assessmentMaxMark, setAssessmentMaxMark] = useState<number>(
    initialAssessments[0]?.max_mark || 100
  );
  const [assessmentCategory, setAssessmentCategory] = useState<string>(
    initialAssessments[0]?.assignment_category || ''
  );

  const changeSelectedAssessment = (id: string) => {
    setSelectedAssessmentId(id);
    if (id === 'new') {
      setAssessmentName('');
      setAssessmentMaxMark(100);
      setAssessmentCategory('');
    } else {
      const ass = store.assessments.find(a => a.id === id);
      if (ass) {
        setAssessmentName(ass.name);
        setAssessmentMaxMark(ass.max_mark);
        setAssessmentCategory(ass.assignment_category || '');
      }
    }
  };

  const [marksState, setMarksState] = useState<Record<string, number>>({});
  const [marksImportPreview, setMarksImportPreview] = useState<{
    validRows: { student_id: string; register_no: string; name: string; mark: number }[];
    errorRows: { register_no: string; name: string; mark: number; error: string }[];
  } | null>(null);

  // Absentee Email Preview Modal State
  const [absenteePreview, setAbsenteePreview] = useState<AbsenteePreview | null>(null);

  // Trainer Log Edit Modal State
  const [showEditTrainerLogModal, setShowEditTrainerLogModal] = useState(false);
  const [editingTrainerLog, setEditingTrainerLog] = useState<TrainerLog | null>(null);
  const [editTrainerLogForm, setEditTrainerLogForm] = useState({
    log_date: '',
    trainer_id: '',
    start_time: '',
    end_time: '',
    notes: '',
    log_type: 'conducted' as 'conducted' | 'missed',
    missed_hours: 2,
    missed_reason: 'trainer_leave' as MissedReason,
  });
  const [editTrainerLogTopics, setEditTrainerLogTopics] = useState<string[]>([]);
  const [trainerLogSearch, setTrainerLogSearch] = useState('');
  const [editTrainerLogSearch, setEditTrainerLogSearch] = useState('');

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Edit Batch Modal State
  const [showEditBatchModal, setShowEditBatchModal] = useState(false);
  const [editBatchForm, setEditBatchForm] = useState({
    code: '',
    current_semester: batch?.current_semester || 1,
    status: batch?.status || 'Active',
    college_coordinator_id: batch?.college_coordinator_id || '',
    student_coordinator_id: batch?.student_coordinator_id || '',
    start_date: batch?.start_date || '',
    end_date: batch?.end_date || '',
    academic_year: batch?.academic_year || '',
  });

  // Edit/Delete Student State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [studentEditForm, setStudentEditForm] = useState({ register_no: '', name: '', class: '', phone: '' });

  const handleDeleteBatch = async () => {
    if (!batch) return;
    if (confirm(`Are you sure you want to delete batch "${batch.code}"? This will permanently delete all students, courses, attendance, and assessment records associated with this batch.`)) {
      await store.deleteBatch(batch.id);
      toast.success(`Batch ${batch.code} deleted successfully`);
      navigate('/batches');
    }
  };

  const handleOpenEditStudent = (stu: Student) => {
    setEditingStudent(stu);
    setStudentEditForm({
      register_no: stu.register_no,
      name: stu.name,
      class: stu.class,
      phone: stu.phone || '',
    });
    setShowEditStudentModal(true);
  };

  const handleSaveEditStudent = async () => {
    if (!editingStudent) return;
    if (!studentEditForm.register_no || !studentEditForm.name || !studentEditForm.class) {
      toast.error('Register number, name, and class are required');
      return;
    }
    const idx = store.students.findIndex(s => s.id === editingStudent.id);
    if (idx !== -1) {
      await store.saveStudent({
        ...store.students[idx],
        register_no: studentEditForm.register_no,
        name: studentEditForm.name,
        class: studentEditForm.class,
        phone: studentEditForm.phone,
      });
      setStudents(store.students.filter(s => s.batch_id === id));
      setShowEditStudentModal(false);
      toast.success('Student details updated successfully!');
    }
  };

  const handleSaveEditTrainerLog = async () => {
    if (!editingTrainerLog) return;

    if (editTrainerLogForm.log_type === 'missed') {
      if (!editTrainerLogForm.log_date) {
        toast.error('Date of missed session is required');
        return;
      }
      if (!editTrainerLogForm.missed_hours || editTrainerLogForm.missed_hours <= 0) {
        toast.error('Missed hours must be greater than 0');
        return;
      }
      try {
        const durationMins = Math.round(Number(editTrainerLogForm.missed_hours) * 60);
        await store.saveTrainerLog({
          ...editingTrainerLog,
          log_date: editTrainerLogForm.log_date,
          trainer_id: editTrainerLogForm.trainer_id || undefined,
          start_time: '00:00',
          end_time: '00:00',
          duration_minutes: durationMins,
          topics_covered: [],
          notes: editTrainerLogForm.notes || '',
          log_type: 'missed',
          missed_reason: editTrainerLogForm.missed_reason,
        });

        setShowEditTrainerLogModal(false);
        setEditingTrainerLog(null);
        setEditTrainerLogSearch('');
        setRefreshTrigger(r => r + 1);
        toast.success('Missed session log updated successfully!');
        return;
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to update missed session log', {
          description: err.message || 'Unknown database error',
        });
        return;
      }
    }

    if (!editTrainerLogForm.log_date || !editTrainerLogForm.start_time || !editTrainerLogForm.end_time) {
      toast.error('Date, Start Time, and End Time are required');
      return;
    }
    const calcDuration = (start: string, end: string): number => {
      if (!start || !end) return 0;
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      return Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
    };
    const durationMins = calcDuration(editTrainerLogForm.start_time, editTrainerLogForm.end_time);
    if (durationMins <= 0) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      await store.saveTrainerLog({
        ...editingTrainerLog,
        log_date: editTrainerLogForm.log_date,
        trainer_id: editTrainerLogForm.trainer_id || undefined,
        start_time: editTrainerLogForm.start_time,
        end_time: editTrainerLogForm.end_time,
        duration_minutes: durationMins,
        topics_covered: editTrainerLogTopics,
        notes: editTrainerLogForm.notes || undefined,
        log_type: 'conducted',
      });

      setShowEditTrainerLogModal(false);
      setEditingTrainerLog(null);
      setEditTrainerLogSearch('');
      setRefreshTrigger(r => r + 1);
      toast.success('Session log updated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update session log', {
        description: err.message || 'Unknown database error',
      });
    }
  };

  const handleDeleteStudent = async (stuId: string, stuName: string) => {
    if (confirm(`Are you sure you want to delete student "${stuName}"?`)) {
      await store.deleteStudent(stuId);
      setStudents(store.students.filter(s => s.batch_id === id));
      setSelectedStudentIds(prev => prev.filter(x => x !== stuId));
      toast.success(`Student ${stuName} deleted successfully`);
    }
  };

  const handleBulkDeleteStudents = async () => {
    if (confirm(`Are you sure you want to delete the ${selectedStudentIds.length} selected students?`)) {
      await store.deleteStudents(selectedStudentIds);
      setStudents(store.students.filter(s => s.batch_id === id));
      setSelectedStudentIds([]);
      toast.success('Selected students deleted successfully');
    }
  };

  const handleSaveBatchEdit = async () => {
    if (!batch) return;
    if (!editBatchForm.code.trim()) {
      toast.error('Batch Name cannot be empty');
      return;
    }
    if (!editBatchForm.academic_year.trim()) {
      toast.error('Academic Year/Course Duration cannot be empty');
      return;
    }
    const targetBatch = store.batches.find(b => b.id === batch.id);
    if (targetBatch) {
      await store.saveBatch({
        ...targetBatch,
        code: editBatchForm.code.toUpperCase().trim(),
        academic_year: editBatchForm.academic_year.trim(),
        current_semester: Number(editBatchForm.current_semester),
        status: editBatchForm.status as 'Active' | 'Completed',
        college_coordinator_id: editBatchForm.college_coordinator_id || undefined,
        student_coordinator_id: editBatchForm.student_coordinator_id || undefined,
        start_date: editBatchForm.start_date,
        end_date: editBatchForm.end_date,
      });
      setRefreshTrigger(prev => prev + 1);
    }
    setShowEditBatchModal(false);
    toast.success('Batch details updated successfully!');
  };

  const handleUpdateSingleMark = async (studentId: string, valStr: string) => {
    let targetAssessmentId = selectedAssessmentId;
    if (selectedAssessmentId === 'new') {
      if (!assessmentName.trim()) {
        toast.error('Please enter an Assessment Name first');
        return;
      }
      const newAsm: Assessment = {
        id: generateUUID(),
        batch_course_id: selectedBatchCourseId,
        name: assessmentName.trim(),
        max_mark: assessmentMaxMark,
        assignment_category: assessmentCategory.trim() || undefined,
      };
      const saved = await store.saveAssessment(newAsm);
      targetAssessmentId = saved.id;
      setSelectedAssessmentId(saved.id);
    }

    const curAsm = store.assessments.find(a => a.id === targetAssessmentId);
    if (!curAsm) return;
    const num = Number(valStr);
    if (isNaN(num) || num < 0) {
      toast.error('Mark must be a non-negative number');
      return;
    }
    if (num > curAsm.max_mark) {
      toast.error(`Mark (${num}) cannot exceed assessment Max Mark of ${curAsm.max_mark}`);
      return;
    }

    const existingMark = store.assessmentMarks.find(m => m.assessment_id === curAsm.id && m.student_id === studentId);
    try {
      await store.saveAssessmentMark({
        id: existingMark?.id || generateUUID(),
        assessment_id: curAsm.id,
        student_id: studentId,
        mark: num,
      });

      setMarksState(prev => ({ ...prev, [studentId]: num }));
      toast.success('Mark saved');
    } catch (err: any) {
      console.error('Error saving mark:', err);
      toast.error(`Failed to save mark: ${err.message || 'Database error'}`);
    }
  };

  if (!batch) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Batch Not Found</h2>
        <Button onClick={() => navigate('/batches')}>Return to Batches</Button>
      </div>
    );
  }

  const activeBatchCourse = store.batchCourses.find(bc => bc.id === selectedBatchCourseId);
  const activeCourse = store.courses.find(c => c.id === activeBatchCourse?.course_id);

  // -------------------------------------------------------------------------------------
  // 7.1 STUDENTS WORKFLOW
  // -------------------------------------------------------------------------------------
  const handleAddStudent = async () => {
    if (!studentForm.register_no || !studentForm.name) {
      toast.error('Register Number and Name are required');
      return;
    }
    const newStudent = await store.saveStudent({
      batch_id: batch.id,
      register_no: studentForm.register_no,
      name: studentForm.name,
      class: studentForm.class || 'Div A',
      phone: studentForm.phone || '',
    });
    setStudents(store.students.filter(s => s.batch_id === batch.id));
    setShowAddStudentModal(false);
    setStudentForm({ register_no: '', name: '', class: 'Div A', phone: '' });
    toast.success(`Student ${newStudent.name} added`);
  };

  const handleStudentCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(sheet);
        let added = 0;

        const getRowVal = (row: any, searchKeys: string[], defaultVal = '') => {
          const keys = Object.keys(row);
          // Try exact match first (case-insensitive)
          for (const sk of searchKeys) {
            const foundKey = keys.find(k => k.trim().toLowerCase() === sk.trim().toLowerCase());
            if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
              return row[foundKey];
            }
          }
          // Try fuzzy substring match second (case-insensitive)
          for (const sk of searchKeys) {
            const foundKey = keys.find(k => k.toLowerCase().includes(sk.toLowerCase()));
            if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
              return row[foundKey];
            }
          }
          return defaultVal;
        };

        for (const r of rows) {
          const regNo = getRowVal(r, ['register no', 'register', 'reg', 'roll']);
          const name = getRowVal(r, ['student name', 'name', 'student']);
          const phone = getRowVal(r, ['phone number', 'phone', 'mobile', 'contact'], '');
          const classVal = getRowVal(r, ['class (division)', 'class', 'division', 'div'], 'Div A');

          if (regNo && name) {
            await store.saveStudent({
              batch_id: batch.id,
              register_no: String(regNo).trim().toUpperCase(),
              name: String(name).trim(),
              class: String(classVal).trim(),
              phone: String(phone).trim(),
            });
            added++;
          }
        }
        setStudents(store.students.filter(s => s.batch_id === batch.id));
        toast.success(`Successfully imported/updated ${added} students!`);
      } catch (err) {
        toast.error('Failed to parse CSV/Excel file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // -------------------------------------------------------------------------------------
  // 7.2 COURSES ALLOCATION WORKFLOW
  // -------------------------------------------------------------------------------------
  const handleAddBatchCourse = async () => {
    const targetCourse = store.courses.find(c => c.id === newCourseId);
    if (!targetCourse) return;

    const newBC = await store.saveBatchCourse({
      batch_id: batch.id,
      course_id: newCourseId,
      trainer_id: newTrainerId,
      semester: Number(newCourseSemester),
      planned_hours: newPlannedHours,
      start_date: new Date().toISOString().split('T')[0],
      status: 'Active',
    });

    setBatchCourses(store.batchCourses.filter(bc => bc.batch_id === batch.id));
    setSelectedBatchCourseId(newBC.id);
    const firstAss = store.assessments.find(a => a.batch_course_id === newBC.id);
    changeSelectedAssessment(firstAss?.id || 'new');
    setShowAddCourseModal(false);
    toast.success(`Course ${targetCourse.name} added to batch with auto-seeded syllabus!`);
  };

  const handleOpenEditBatchCourse = (bc: BatchCourse) => {
    setEditingBatchCourse(bc);
    setEditCourseTrainerId(bc.trainer_id || '');
    setEditCoursePlannedHours(bc.planned_hours || 30);
    setEditCourseSemester(bc.semester || 1);
    setEditCourseStatus(bc.status || 'Active');
    setShowEditCourseModal(true);
  };

  const handleSaveEditBatchCourse = async () => {
    if (!editingBatchCourse) return;

    await store.saveBatchCourse({
      ...editingBatchCourse,
      trainer_id: editCourseTrainerId || undefined,
      planned_hours: Number(editCoursePlannedHours),
      semester: Number(editCourseSemester),
      status: editCourseStatus,
    });

    setBatchCourses(store.batchCourses.filter(bc => bc.batch_id === batch.id));
    setShowEditCourseModal(false);
    toast.success('Course allocation updated successfully!');
  };

  const filteredBatchCourses = batchCourses.filter(bc =>
    selectedSemesterFilter === 'all' || bc.semester === Number(selectedSemesterFilter)
  );

  const handleSemesterFilterChange = (sem: number | 'all') => {
    setSelectedSemesterFilter(sem);
    const semCourses = batchCourses.filter(bc => sem === 'all' || bc.semester === Number(sem));
    if (semCourses.length > 0) {
      const isCurrentInNewSem = semCourses.some(bc => bc.id === selectedBatchCourseId);
      if (!isCurrentInNewSem) {
        const newBcId = semCourses[0].id;
        setSelectedBatchCourseId(newBcId);
        const firstAss = store.assessments.find(a => a.batch_course_id === newBcId);
        changeSelectedAssessment(firstAss?.id || 'new');
      }
    } else {
      setSelectedBatchCourseId('');
      changeSelectedAssessment('new');
    }
  };

  const handleDeleteBatchCourse = async (bcId: string, courseName: string) => {
    if (confirm(`Are you sure you want to delete the course "${courseName}" from this batch? This will permanently delete all attendance registers and marks associated with this course.`)) {
      await store.deleteBatchCourse(bcId);
      setBatchCourses(store.batchCourses.filter(bc => bc.batch_id === batch.id));
      const remaining = store.batchCourses.filter(bc => bc.batch_id === batch.id);
      if (selectedBatchCourseId === bcId) {
        const nextBcId = remaining[0]?.id || '';
        setSelectedBatchCourseId(nextBcId);
        const nextAss = store.assessments.find(a => a.batch_course_id === nextBcId);
        changeSelectedAssessment(nextAss?.id || 'new');
      }
      toast.success(`Course ${courseName} removed from batch successfully`);
    }
  };

  // -------------------------------------------------------------------------------------
  // 7.3 ATTENDANCE REGISTER & MATRIX WORKFLOW
  // -------------------------------------------------------------------------------------
  const handleSaveAttendanceRegister = async () => {
    if (!selectedBatchCourseId) return;

    // Find or create session
    let session = store.sessions.find(
      s => s.batch_course_id === selectedBatchCourseId && s.session_date === attendanceDate && Number(s.hour_no) === Number(attendanceHour)
    );
    const isNew = !session;
    if (isNew) {
      session = {
        id: generateUUID(),
        batch_course_id: selectedBatchCourseId,
        session_date: attendanceDate,
        hour_no: Number(attendanceHour),
      };
    }

    const savedSession = await store.saveSession(session!);

    // Save attendance for every student in batch
    const attendanceToSave: Attendance[] = [];
    students.forEach((stu) => {
      const existing = store.attendance.find(a => a.session_id === savedSession.id && a.student_id === stu.id);
      const status = registerStatusMap[stu.id] ?? existing?.status ?? 'present';
      attendanceToSave.push({
        id: existing?.id || generateUUID(),
        session_id: savedSession.id,
        student_id: stu.id,
        status,
      });
    });

    await store.saveAttendanceRecords(attendanceToSave);
    setRefreshTrigger(r => r + 1);
    toast.success(`Attendance saved for ${attendanceDate} (Hour ${attendanceHour})!`);
  };

  const handleDeleteSession = async (sessionId: string, sessionDate: string, hourNo: number) => {
    if (!confirm(`Delete the entire session for ${sessionDate} (Hour ${hourNo})? This will remove all attendance records for this session.`)) return;
    await store.deleteSession(sessionId);
    setRefreshTrigger(r => r + 1);
    toast.success(`Session ${sessionDate} (Hour ${hourNo}) deleted.`);
  };

  const handleDeleteAttendanceRecord = async (attendanceId: string, studentName: string) => {
    if (!confirm(`Delete attendance record for ${studentName} in this session?`)) return;
    await store.deleteAttendanceRecord(attendanceId);
    setRefreshTrigger(r => r + 1);
    toast.success(`Attendance record for ${studentName} deleted.`);
  };

  const getSessionHeaders = () => {
    if (!absenteePreview) return [];

    const isRange = absenteePreview.session_date.includes(' to ');
    if (!isRange) {
      const daySessions = store.sessions.filter(
        s => s.batch_course_id === selectedBatchCourseId && s.session_date === absenteePreview.session_date
      ).sort((a, b) => a.hour_no - b.hour_no);

      if (daySessions.length === 0) {
        return [`Hour ${attendanceHour}`];
      }
      return daySessions.map(s => `Hour ${s.hour_no}`);
    }

    const parts = absenteePreview.session_date.split(' to ');
    const start = parts[0];
    const end = parts[1];
    const rangeSessions = store.sessions.filter(
      s => s.batch_course_id === selectedBatchCourseId &&
        s.session_date >= start &&
        s.session_date <= end
    ).sort((a, b) => {
      if (a.session_date !== b.session_date) return a.session_date.localeCompare(b.session_date);
      return a.hour_no - b.hour_no;
    });

    return rangeSessions.map(s => {
      const dateStr = s.session_date.substring(5).replace('-', '/');
      return `${dateStr} H${s.hour_no}`;
    });
  };

  const handleGenerateAbsenteeList = () => {
    let daySessions: Session[] = [];
    let titleDate = '';

    if (attendanceReportMode === 'single') {
      daySessions = store.sessions.filter(
        s => s.batch_course_id === selectedBatchCourseId && s.session_date === attendanceDate
      );
      titleDate = attendanceDate;
    } else {
      daySessions = store.sessions.filter(
        s => s.batch_course_id === selectedBatchCourseId &&
          s.session_date >= attendanceStartDate &&
          s.session_date <= attendanceEndDate
      );
      titleDate = `${attendanceStartDate} to ${attendanceEndDate}`;
    }

    daySessions.sort((a, b) => {
      if (a.session_date !== b.session_date) {
        return a.session_date.localeCompare(b.session_date);
      }
      return a.hour_no - b.hour_no;
    });

    const getStatusForSession = (stuId: string, s: Session) => {
      const att = store.attendance.find(a => a.session_id === s.id && a.student_id === stuId);
      return att ? att.status : 'present';
    };

    if (attendanceReportMode === 'single' && daySessions.length === 0) {
      const absenteesList: AbsenteePreview['absentees'] = [];
      students.forEach((stu) => {
        const st = registerStatusMap[stu.id] || 'present';
        if (st === 'absent') {
          absenteesList.push({
            register_no: stu.register_no,
            name: stu.name,
            class: stu.class || 'Div A',
            hours_absent: [0],
          });
        }
      });

      absenteesList.sort((a, b) => {
        const classA = (a.class || '').toLowerCase();
        const classB = (b.class || '').toLowerCase();
        if (classA !== classB) return classA.localeCompare(classB);
        return (a.register_no || '').localeCompare(b.register_no || '');
      });

      const trainerCourse = store.batchCourses.find(bc => bc.id === selectedBatchCourseId);
      const assignedTrainer = store.profiles.find(p => p.id === trainerCourse?.trainer_id);
      const defaultSender = (profile?.role === 'trainer' ? profile : null)
        || assignedTrainer
        || profile
        || store.profiles.find(p => p.role === 'trainer' || p.role === 'admin')
        || store.profiles[0];

      const defaultSenderId = defaultSender?.id || '';
      setAbsenteeSenderId(defaultSenderId);

      const senderConfig = store.emailConfigs.find(c => c.user_id === defaultSenderId);
      const senderEmail = senderConfig?.smtp_user || defaultSender?.email || 'teamthestrategist@gmail.com';
      const senderName = senderConfig?.from_name || defaultSender?.full_name || 'Team The Strategist';
      const recipientName = batch.college_coordinator?.full_name || batch.college?.contact_person || 'College Coordinator';
      const recipientEmail = batch.college_coordinator?.email || batch.college?.contact_email || '';

      setAbsenteePreview({
        recipient_name: recipientName,
        recipient_email: recipientEmail,
        sender_email: senderEmail,
        sender_name: senderName,
        session_date: titleDate,
        batch_code: batch.code,
        course_name: activeCourse?.name || 'Excel',
        absentees: absenteesList,
      });
      setShowAbsenteeModal(true);
      return;
    }

    const absenteesList: AbsenteePreview['absentees'] = [];
    students.forEach((stu) => {
      const absentIndices = daySessions
        .map((s, idx) => (getStatusForSession(stu.id, s) === 'absent' ? idx : -1))
        .filter(idx => idx !== -1);

      if (absentIndices.length > 0) {
        absenteesList.push({
          register_no: stu.register_no,
          name: stu.name,
          class: stu.class || 'Div A',
          hours_absent: absentIndices,
        });
      }
    });

    absenteesList.sort((a, b) => {
      const classA = (a.class || '').toLowerCase();
      const classB = (b.class || '').toLowerCase();
      if (classA !== classB) {
        return classA.localeCompare(classB);
      }
      return (a.register_no || '').localeCompare(b.register_no || '');
    });

    const trainerCourse = store.batchCourses.find(bc => bc.id === selectedBatchCourseId);
    const assignedTrainer = store.profiles.find(p => p.id === trainerCourse?.trainer_id);
    const defaultSender = (profile?.role === 'trainer' ? profile : null)
      || assignedTrainer
      || profile
      || store.profiles.find(p => p.role === 'trainer' || p.role === 'admin')
      || store.profiles[0];

    const defaultSenderId = defaultSender?.id || '';
    setAbsenteeSenderId(defaultSenderId);

    const senderConfig = store.emailConfigs.find(c => c.user_id === defaultSenderId);
    const senderEmail = senderConfig?.smtp_user || defaultSender?.email || 'teamthestrategist@gmail.com';
    const senderName = senderConfig?.from_name || defaultSender?.full_name || 'Team The Strategist';
    const recipientName = batch.college_coordinator?.full_name || batch.college?.contact_person || 'College Coordinator';
    const recipientEmail = batch.college_coordinator?.email || batch.college?.contact_email || '';

    setAbsenteePreview({
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      sender_email: senderEmail,
      sender_name: senderName,
      session_date: titleDate,
      batch_code: batch.code,
      course_name: activeCourse?.name || 'Excel',
      absentees: absenteesList,
    });
    setShowAbsenteeModal(true);
  };

  const handleConfirmSendAbsenteeEmail = async () => {
    if (!absenteePreview) return;
    if (!absenteePreview.recipient_email) {
      toast.error('Recipient email address is missing for this batch.');
      return;
    }

    setIsSendingAbsenteeEmail(true);

    try {
      const trainerCourse = store.batchCourses.find(bc => bc.id === selectedBatchCourseId);
      const activeSender = store.profiles.find(p => p.id === absenteeSenderId)
        || store.profiles.find(p => p.id === trainerCourse?.trainer_id)
        || profile;

      const personalConfig = store.emailConfigs.find(c => c.user_id === activeSender?.id && c.is_verified);
      const relayConfig = store.emailConfigs.find(c => c.is_verified) || store.emailConfigs[0];
      const activeConfig = personalConfig || relayConfig;

      if (!activeConfig) {
        toast.error('No SMTP configuration found. Please configure an SMTP account in Email & Notifications first.');
        return;
      }

      const isDirectPersonal = !!personalConfig;
      const sendingAccountProfile = store.profiles.find(p => p.id === activeConfig.user_id);

      // When sending from Team The Strategist account, From must show "Team The Strategist"
      const senderDisplayName = isDirectPersonal
        ? (personalConfig.from_name || activeSender?.full_name || 'Trainer')
        : (activeConfig.from_name || sendingAccountProfile?.full_name || 'Team The Strategist');

      const senderEmailAddress = activeConfig.smtp_user;
      const trainerReplyTo = activeSender?.email || senderEmailAddress;

      // Build real email body
      let savedTemplate = localStorage.getItem('uct_absentee_template');
      if (savedTemplate && (savedTemplate.includes('University Training Tracker') || savedTemplate.includes('Official Attendance') || !savedTemplate.includes('<b>Batch:</b>'))) {
        localStorage.removeItem('uct_absentee_template');
        savedTemplate = null;
      }
      const sessionHeaders = getSessionHeaders();
      const { html, text } = buildAbsenteeReportHtml({
        preview: {
          ...absenteePreview,
          sender_name: senderDisplayName,
          sender_email: senderEmailAddress,
        },
        sessionHeaders,
        template: savedTemplate || undefined,
      });

      const subject = `Absentees Report - ${absenteePreview.batch_code} (${absenteePreview.course_name}) - ${formatDateToDDMMYYYY(absenteePreview.session_date)}`;

      const sendResult = await sendEmail({
        to: absenteePreview.recipient_email,
        subject,
        html,
        text,
        config: activeConfig,
        sender_name: senderDisplayName,
        sender_email: senderEmailAddress,
        reply_to: trainerReplyTo,
      });

      const logEntry: NotificationLog = {
        id: generateUUID(),
        batch_course_id: selectedBatchCourseId,
        session_date: absenteePreview.session_date,
        sender_id: activeSender?.id || activeConfig.user_id || store.profiles[0]?.id,
        recipient_email: absenteePreview.recipient_email,
        absentee_count: absenteePreview.absentees.length,
        status: sendResult.success ? 'sent' : 'failed',
        error: sendResult.error,
        sent_at: new Date().toISOString(),
      };

      await store.saveNotificationLog(logEntry);

      if (sendResult.success) {
        setShowAbsenteeModal(false);
        toast.success(`Absentee notification sent via SMTP to ${absenteePreview.recipient_email}!`);
      } else {
        toast.error(`Email delivery failed: ${sendResult.error}`);
      }
    } catch (err: any) {
      console.error('Absentee email dispatch failed:', err);
      toast.error(`Failed to send email: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSendingAbsenteeEmail(false);
    }
  };

  // -------------------------------------------------------------------------------------
  // 7.4 MARKS & PRE-FILLED EXCEL TEMPLATE WORKFLOW
  // -------------------------------------------------------------------------------------
  const currentAssessment = store.assessments.find(a => a.id === selectedAssessmentId);
  const currentAssessmentMarks = store.assessmentMarks.filter(m => m.assessment_id === selectedAssessmentId);

  const handleDownloadMarksTemplate = () => {
    const nameToUse = selectedAssessmentId === 'new' ? (assessmentName.trim() || 'New_Assessment') : (currentAssessment?.name || 'Assessment');
    const excelData = students.map(stu => ({
      'Register Number': stu.register_no,
      'Name': stu.name,
      'Mark': '',
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Marks Roster');
    XLSX.writeFile(wb, `${batch.code}_${activeCourse?.code || 'Tool'}_${nameToUse.replace(/\s+/g, '_')}_Template.xlsx`);
    toast.success('Downloaded 3-column Excel template (Register Number, Name, Mark)!');
  };

  const handleUploadMarksFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const limitMark = selectedAssessmentId === 'new' ? assessmentMaxMark : (currentAssessment?.max_mark || 100);

    if (selectedAssessmentId === 'new' && !assessmentName.trim()) {
      toast.error('Please enter an Assessment Name first');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(sheet);

        const validRows: any[] = [];
        const errorRows: any[] = [];

        rows.forEach((r) => {
          const regNo = String(r['Register Number'] || r['Register No'] || r.register_no || r['Reg No'] || '').trim();
          const name = String(r['Name'] || r['Student Name'] || r.name || '').trim();
          const markVal = Number(r['Mark'] !== undefined ? r['Mark'] : r.mark);

          const student = students.find(s => s.register_no.toLowerCase() === regNo.toLowerCase());

          if (!student) {
            errorRows.push({ register_no: regNo || 'N/A', name: name || 'Unknown', mark: markVal, error: 'Register Number not found in batch roster' });
          } else if (isNaN(markVal) || markVal < 0) {
            errorRows.push({ register_no: student.register_no, name: student.name, mark: markVal, error: 'Invalid mark value (must be >= 0)' });
          } else if (markVal > limitMark) {
            errorRows.push({
              register_no: student.register_no,
              name: student.name,
              mark: markVal,
              error: `Mark (${markVal}) exceeds assessment max mark limit of ${limitMark}`
            });
          } else {
            validRows.push({ student_id: student.id, register_no: student.register_no, name: student.name, mark: markVal });
          }
        });

        setMarksImportPreview({ validRows, errorRows });
      } catch (err) {
        toast.error('Failed to parse Excel file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCommitMarksImport = async () => {
    if (!marksImportPreview) return;

    let targetAssessmentId = selectedAssessmentId;

    if (selectedAssessmentId === 'new') {
      const newAsm: Assessment = {
        id: generateUUID(),
        batch_course_id: selectedBatchCourseId,
        name: assessmentName.trim() || 'New Assessment',
        max_mark: assessmentMaxMark,
        assignment_category: assessmentCategory.trim() || undefined,
      };
      const savedAsm = await store.saveAssessment(newAsm);
      targetAssessmentId = savedAsm.id;
      setSelectedAssessmentId(savedAsm.id);
    } else if (currentAssessment) {
      if (
        currentAssessment.name !== assessmentName.trim() ||
        currentAssessment.max_mark !== assessmentMaxMark ||
        currentAssessment.assignment_category !== assessmentCategory.trim()
      ) {
        const updatedAsm: Assessment = {
          ...currentAssessment,
          name: assessmentName.trim(),
          max_mark: assessmentMaxMark,
          assignment_category: assessmentCategory.trim() || undefined,
        };
        await store.saveAssessment(updatedAsm);
      }
    }

    const marksToSave: AssessmentMark[] = [];
    marksImportPreview.validRows.forEach(row => {
      const existing = store.assessmentMarks.find(m => m.assessment_id === targetAssessmentId && m.student_id === row.student_id);
      marksToSave.push({
        id: existing?.id || generateUUID(),
        assessment_id: targetAssessmentId,
        student_id: row.student_id,
        mark: row.mark,
      });
    });

    try {
      await store.saveAssessmentMarks(marksToSave);
      setMarksImportPreview(null);
      toast.success(`Successfully committed marks for ${marksImportPreview.validRows.length} students!`);
    } catch (err: any) {
      console.error('Error committing marks:', err);
      toast.error(`Failed to commit marks: ${err.message || 'Database error'}`);
    }
  };

  // -------------------------------------------------------------------------------------
  // DATA EXPORT HANDLERS (EXCEL / CSV DOWNLOAD)
  // -------------------------------------------------------------------------------------
  const handleExportStudents = () => {
    if (!batch || students.length === 0) {
      toast.error('No student data available to export');
      return;
    }
    const semLabel = selectedSemesterFilter !== 'all' ? `Sem ${selectedSemesterFilter}` : 'Overall';
    const data = students.map(s => {
      const pct = store.getStudentAttendancePct(s.id, {
        batchId: batch.id,
        semester: selectedSemesterFilter,
      });
      return {
        'Register Number': s.register_no,
        'Name': s.name,
        'Class': s.class,
        'Phone': s.phone || '',
        [`Attendance % (${semLabel})`]: pct !== null ? `${pct}%` : '—',
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students Roster');
    XLSX.writeFile(wb, `${batch.code}_Students_Roster.xlsx`);
    toast.success('Exported Student Roster (.xlsx)');
  };

  const handleExportAttendance = () => {
    if (!batch) return;
    const courseSessions = store.sessions.filter(s => s.batch_course_id === selectedBatchCourseId);
    if (students.length === 0) {
      toast.error('No attendance data available to export');
      return;
    }
    const data = students.map(stu => {
      const row: any = {
        'Register Number': stu.register_no,
        'Name': stu.name,
        'Class': stu.class,
      };
      courseSessions.forEach(sess => {
        const rec = store.attendance.find(a => a.session_id === sess.id && a.student_id === stu.id);
        const colHeader = `${sess.session_date} (H${sess.hour_no})`;
        row[colHeader] = rec ? rec.status.toUpperCase() : 'PRESENT';
      });
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Register');
    XLSX.writeFile(wb, `${batch.code}_Attendance_Register.xlsx`);
    toast.success('Exported Attendance Register (.xlsx)');
  };

  const handleExportMarks = () => {
    if (!batch || !currentAssessment) {
      toast.error('No assessment selected to export');
      return;
    }
    const data = students.map(stu => {
      const markObj = currentAssessmentMarks.find(m => m.student_id === stu.id);
      return {
        'Register Number': stu.register_no,
        'Name': stu.name,
        'Assessment': currentAssessment.name,
        'Mark Obtained': markObj?.mark !== undefined ? markObj.mark : '',
        'Max Mark': currentAssessment.max_mark,
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Assessment Marks');
    XLSX.writeFile(wb, `${batch.code}_${currentAssessment.name.replace(/\s+/g, '_')}_Marks.xlsx`);
    toast.success('Exported Assessment Marks (.xlsx)');
  };

  const handleExportSyllabus = () => {
    if (!batch || currentSyllabus.length === 0) {
      toast.error('No syllabus data available to export');
      return;
    }
    const data = currentSyllabus.map(s => ({
      'Topic No': s.topic_no,
      'Topic Name': s.topic_name,
      'Completed Date': s.completed_date || 'N/A',
      'Status': s.is_completed ? 'Completed' : 'Pending',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Syllabus Tracker');
    XLSX.writeFile(wb, `${batch.code}_Syllabus_Tracker.xlsx`);
    toast.success('Exported Batch Syllabus (.xlsx)');
  };

  // -------------------------------------------------------------------------------------
  // 7.7 SYLLABUS & COVERAGE COMPUTATIONS
  // -------------------------------------------------------------------------------------
  const currentSyllabus = store.batchSyllabus.filter(s => s.batch_course_id === selectedBatchCourseId).sort((a, b) => a.topic_no - b.topic_no);
  const displayedEditTopics = currentSyllabus.filter(t => {
    if (!editTrainerLogSearch.trim()) return true;
    const query = editTrainerLogSearch.trim().toLowerCase();
    return t.topic_name.toLowerCase().includes(query) || String(t.topic_no).includes(query);
  });
  const totalTopics = currentSyllabus.length;
  const completedTopics = currentSyllabus.filter(s => s.is_completed).length;
  const coveragePct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const plannedHours = store.batchCourses.find(bc => bc.id === selectedBatchCourseId)?.planned_hours || 30;
  // Delivered Hours: Total Hours Trainer Engaged (including Paper valuation, Class, Supervision, etc.)
  const deliveredHours = store.getBatchCourseDeliveredHours(selectedBatchCourseId);
  const remainingHours = Math.max(0, Math.round((plannedHours - deliveredHours) * 10) / 10);

  const isOnTrack = coveragePct >= 50;

  return (
    <div className="space-y-6">
      {/* Top Header Card with College Campus Image Banner & College Logo */}
      <div className="card-meridian relative overflow-hidden p-6 border-l-[5px] border-l-accent">
        {/* Background Overlay Campus Image */}
        {batch.college?.image_url && (
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none overflow-hidden">
            <img src={batch.college.image_url} alt={`${batch.college.name} Campus`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-xl shrink-0 mt-1 sm:mt-0" onClick={() => navigate('/batches')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>

            {/* College Logo */}
            <CollegeLogo
              logoUrl={batch.college?.logo_url}
              collegeCode={batch.college?.code}
              collegeName={batch.college?.name}
              className="h-14 w-14 rounded-xl object-contain p-1 border border-border bg-background shadow-xs shrink-0 mt-1 sm:mt-0"
              fallbackClassName="h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold font-mono text-sm text-primary shrink-0 mt-1 sm:mt-0"
            />

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-heading text-foreground tracking-tight whitespace-nowrap">{batch.code}</h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-accent/15 text-accent font-bold shrink-0">
                  Sem {batch.current_semester}
                </span>
              </div>
              {!isStudentCoordinator && (
                <div className="flex items-center gap-2 pt-0.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditBatchForm({
                        code: batch.code,
                        current_semester: batch.current_semester,
                        status: batch.status,
                        college_coordinator_id: batch.college_coordinator_id || '',
                        student_coordinator_id: batch.student_coordinator_id || '',
                        start_date: batch.start_date || '',
                        end_date: batch.end_date || '',
                        academic_year: batch.academic_year || '',
                      });
                      setShowEditBatchModal(true);
                    }}
                    className="h-7 text-xs rounded-xl"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit Batch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDeleteBatch}
                    className="h-7 text-xs rounded-xl text-destructive hover:bg-destructive/10 border-destructive/30"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Batch
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Semester & Course Filter Dropdowns */}
          {batchCourses.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Semester Filter */}
              <div className="flex items-center gap-2 bg-sunken p-2 rounded-xl border border-border/80">
                <span className="text-xs font-mono text-muted-foreground uppercase font-medium px-1">View Semester:</span>
                <select
                  value={selectedSemesterFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    const semVal = val === 'all' ? 'all' : Number(val);
                    handleSemesterFilterChange(semVal);
                  }}
                  className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-semibold text-primary focus:outline-none"
                >
                  <option value="all">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              {/* Active Course Selector */}
              {filteredBatchCourses.length > 0 && (
                <div className="flex items-center gap-2 bg-sunken p-1.5 px-2.5 rounded-xl border border-border/80 max-w-full">
                  <span className="text-xs font-mono text-muted-foreground uppercase font-medium whitespace-nowrap px-1">Active Tool Course:</span>
                  <select
                    value={selectedBatchCourseId}
                    onChange={(e) => {
                      const bcId = e.target.value;
                      setSelectedBatchCourseId(bcId);
                      const firstAss = store.assessments.find(a => a.batch_course_id === bcId);
                      changeSelectedAssessment(firstAss?.id || 'new');
                    }}
                    className="bg-background border border-border rounded-lg px-2.5 py-1 text-sm font-semibold text-primary focus:outline-none max-w-[180px] sm:max-w-[260px] md:max-w-[340px] truncate cursor-pointer"
                  >
                    {filteredBatchCourses.map((bc) => {
                      const c = store.courses.find(crs => crs.id === bc.course_id);
                      return <option key={bc.id} value={bc.id}>{c?.name} ({c?.code})</option>;
                    })}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex border-b border-border bg-card rounded-2xl p-1 gap-1 overflow-x-auto">
        {!isStudentCoordinator && (
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === 'students' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Users className="h-3.5 w-3.5" /> Students
          </button>
        )}
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === 'attendance' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          <CalendarCheck className="h-3.5 w-3.5" /> Attendance
        </button>
        {!isStudentCoordinator && (
          <>
            <button
              onClick={() => setActiveTab('marks')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === 'marks' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Award className="h-3.5 w-3.5" /> Marks
            </button>
            <button
              onClick={() => setActiveTab('trainer_log')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === 'trainer_log' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Clock className="h-3.5 w-3.5" /> Trainer Log
            </button>
            <button
              onClick={() => setActiveTab('task_list')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === 'task_list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <ListTodo className="h-3.5 w-3.5" /> Task List
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === 'syllabus' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <CheckSquare className="h-3.5 w-3.5" /> Syllabus
            </button>
            <button
              onClick={() => setActiveTab('coverage')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === 'coverage' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Course Coverage
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === 'courses' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <BookOpen className="h-3.5 w-3.5" /> Courses
            </button>
          </>
        )}
      </div>


      {/* TAB 7.1: STUDENTS */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-semibold font-heading">Student Roster</h2>
            <div className="flex items-center gap-2">
              {selectedStudentIds.length > 0 && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkDeleteStudents}
                  className="h-8 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-in fade-in zoom-in duration-200"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Selected ({selectedStudentIds.length})
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleExportStudents} className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1" /> Export Roster (.xlsx)
              </Button>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80">
                <Upload className="h-3.5 w-3.5" /> CSV Import
                <input type="file" accept=".csv, .xlsx" onChange={handleStudentCSVImport} className="hidden" />
              </label>
              <Button size="sm" onClick={() => setShowAddStudentModal(true)} className="bg-primary text-primary-foreground">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Student
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
                <tr>
                  <th className="p-4 pl-6 w-12">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.length === students.length && students.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudentIds(students.map(s => s.id));
                        } else {
                          setSelectedStudentIds([]);
                        }
                      }}
                      className="rounded border-border bg-background focus:ring-primary h-4 w-4"
                    />
                  </th>
                  <th className="p-4">Register No</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Class (Division)</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 text-center">
                    Derived Attendance % {selectedSemesterFilter !== 'all' ? `(Sem ${selectedSemesterFilter})` : ''}
                  </th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((stu) => {
                  const attPct = store.getStudentAttendancePct(stu.id, {
                    batchId: batch?.id,
                    semester: selectedSemesterFilter,
                  });
                  return (
                    <tr key={stu.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 pl-6">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(stu.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds(prev => [...prev, stu.id]);
                            } else {
                              setSelectedStudentIds(prev => prev.filter(id => id !== stu.id));
                            }
                          }}
                          className="rounded border-border bg-background focus:ring-primary h-4 w-4"
                        />
                      </td>
                      <td className="p-4 font-mono font-bold text-accent">{stu.register_no}</td>
                      <td className="p-4 font-medium text-foreground">{stu.name}</td>
                      <td className="p-4 text-muted-foreground font-mono text-xs">{stu.class}</td>
                      <td className="p-4 text-muted-foreground font-mono text-xs">{stu.phone || '—'}</td>
                      <td className="p-4 text-center">
                        {attPct !== null ? (
                          <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full ${attPct >= 85 ? 'bg-success/15 text-success' : attPct >= 75 ? 'bg-warning/15 text-warning' : 'bg-destructive/15 text-destructive'
                            }`}>
                            {attPct}%
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted/40" title="No sessions recorded for this semester yet">
                            —
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right pr-6 space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenEditStudent(stu)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteStudent(stu.id, stu.name)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7.8: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold font-heading">Allocated Tool Courses</h2>
            <Button size="sm" onClick={() => { setNewCourseSemester(batch?.current_semester || 1); setShowAddCourseModal(true); }} className="bg-primary text-primary-foreground">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Course to Batch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBatchCourses.map((bc) => {
              const crs = store.courses.find(c => c.id === bc.course_id);
              const trainer = store.profiles.find(p => p.id === bc.trainer_id);
              const syllabus = store.batchSyllabus.filter(s => s.batch_course_id === bc.id);
              const completed = syllabus.filter(s => s.is_completed).length;
              const covPct = syllabus.length > 0 ? Math.round((completed / syllabus.length) * 100) : 0;

              return (
                <div key={bc.id} className="card-meridian p-5 border-l-4 border-l-primary space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">{crs?.code}</span>
                      <h3 className="font-heading text-lg font-bold text-foreground mt-1">{crs?.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-success/15 text-success font-bold">
                        {bc.status}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEditBatchCourse(bc)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBatchCourse(bc.id, crs?.name || '')}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono bg-sunken p-3 rounded-xl">
                    <div>Trainer: <span className="text-foreground font-bold">{trainer?.full_name || 'Unassigned'}</span></div>
                    <div>Semester: <span className="text-foreground font-bold">Sem {bc.semester}</span></div>
                    <div>Planned: <span className="text-foreground font-bold">{bc.planned_hours} hrs</span></div>
                    <div>Delivered: <span className="text-primary font-bold">{store.getBatchCourseDeliveredHours(bc.id)} hrs</span></div>
                    <div>Coverage: <span className="text-primary font-bold">{covPct}%</span></div>
                    <div>Topics: <span className="text-foreground font-bold">{completed}/{syllabus.length}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7.2: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Attendance Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
            <div className="flex items-center flex-wrap gap-3">
              <select
                value={attendanceReportMode}
                onChange={(e) => setAttendanceReportMode(e.target.value as 'single' | 'range')}
                className="bg-background border border-border rounded-xl px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-9"
              >
                <option value="single">Single Date</option>
                <option value="range">Custom Range</option>
              </select>

              {attendanceReportMode === 'single' ? (
                <>
                  <label className="text-xs font-mono font-medium text-muted-foreground">Session Date:</label>
                  <Input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-40 h-9 text-xs font-mono bg-background"
                  />
                  <label className="text-xs font-mono font-medium text-muted-foreground ml-2">Hour No:</label>
                  <Input
                    type="number"
                    min="1"
                    max="8"
                    value={attendanceHour}
                    onChange={(e) => setAttendanceHour(Number(e.target.value))}
                    className="w-20 h-9 text-xs font-mono bg-background"
                  />
                </>
              ) : (
                <>
                  <label className="text-xs font-mono font-medium text-muted-foreground">Start Date:</label>
                  <Input
                    type="date"
                    value={attendanceStartDate}
                    onChange={(e) => setAttendanceStartDate(e.target.value)}
                    className="w-40 h-9 text-xs font-mono bg-background"
                  />
                  <label className="text-xs font-mono font-medium text-muted-foreground">End Date:</label>
                  <Input
                    type="date"
                    value={attendanceEndDate}
                    onChange={(e) => setAttendanceEndDate(e.target.value)}
                    className="w-40 h-9 text-xs font-mono bg-background"
                  />
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={attendanceViewMode === 'register' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAttendanceViewMode('register')}
                className="h-8 text-xs"
              >
                Register View
              </Button>
              <Button
                variant={attendanceViewMode === 'matrix' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAttendanceViewMode('matrix')}
                className="h-8 text-xs"
              >
                Matrix View
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportAttendance} className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1" /> Export Attendance (.xlsx)
              </Button>
              <Button size="sm" onClick={handleSaveAttendanceRegister} className="bg-primary text-primary-foreground h-8 text-xs">
                Save Register
              </Button>
              <Button size="sm" onClick={handleGenerateAbsenteeList} className="bg-accent text-accent-foreground h-8 text-xs">
                <Mail className="h-3.5 w-3.5 mr-1" /> Generate Absentee List
              </Button>
            </div>
          </div>

          {/* REGISTER VIEW */}
          {attendanceViewMode === 'register' && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="p-3 bg-muted/40 text-xs font-mono text-muted-foreground border-b border-border flex justify-between">
                <span>Default: Every student is Present. Tap status to toggle Absent / Late.</span>
                <span>Active Tool: {activeCourse?.name}</span>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
                  <tr>
                    <th className="p-3">Register No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class</th>
                    <th className="p-3 text-center">Status Action</th>
                    <th className="p-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((stu) => {
                    // Find existing saved attendance record for this student in current session
                    const currentSession = store.sessions.find(
                      s => s.batch_course_id === selectedBatchCourseId && s.session_date === attendanceDate && Number(s.hour_no) === Number(attendanceHour)
                    );
                    const savedRecord = currentSession
                      ? store.attendance.find(a => a.session_id === currentSession.id && a.student_id === stu.id)
                      : undefined;
                    const status = registerStatusMap[stu.id] ?? savedRecord?.status ?? 'present';
                    return (
                      <tr key={stu.id} className="hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-accent">{stu.register_no}</td>
                        <td className="p-3 font-medium text-foreground">{stu.name}</td>
                        <td className="p-3 text-muted-foreground font-mono text-xs">{stu.class}</td>
                        <td className="p-3 text-center">
                          <div className="inline-flex rounded-xl bg-sunken p-1 border border-border gap-1">
                            <button
                              onClick={() => setRegisterStatusMap({ ...registerStatusMap, [stu.id]: 'present' })}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${status === 'present' ? 'bg-success text-white' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => setRegisterStatusMap({ ...registerStatusMap, [stu.id]: 'absent' })}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${status === 'absent' ? 'bg-destructive text-white' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => setRegisterStatusMap({ ...registerStatusMap, [stu.id]: 'late' })}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${status === 'late' ? 'bg-warning text-white' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {savedRecord ? (
                            <button
                              onClick={() => handleDeleteAttendanceRecord(savedRecord.id, stu.name)}
                              title="Delete this student's attendance record for this session"
                              className="text-destructive hover:text-destructive/70 p-1 rounded transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <span className="text-muted-foreground/40 text-xs font-mono">not saved</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* MATRIX VIEW */}
          {attendanceViewMode === 'matrix' && (
            <div className="bg-card rounded-2xl border border-border p-4 overflow-x-auto">
              <h3 className="font-heading font-bold mb-3 text-sm">Attendance Matrix (Students × Sessions)</h3>
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-2">Reg No</th>
                    <th className="p-2">Name</th>
                    {store.sessions
                      .filter(s => s.batch_course_id === selectedBatchCourseId)
                      .sort((a, b) => a.session_date.localeCompare(b.session_date) || Number(a.hour_no) - Number(b.hour_no))
                      .map(s => (
                      <th key={s.id} className="p-2 text-center min-w-[100px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>{s.session_date}</span>
                          <span className="text-muted-foreground">H{s.hour_no}</span>
                          <button
                            onClick={() => handleDeleteSession(s.id, s.session_date, s.hour_no)}
                            title="Delete entire session"
                            className="text-destructive hover:text-destructive/70 p-0.5 rounded transition-colors">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map(stu => (
                    <tr key={stu.id}>
                      <td className="p-2 font-bold text-accent">{stu.register_no}</td>
                      <td className="p-2 font-sans font-medium text-foreground">{stu.name}</td>
                      {store.sessions
                        .filter(s => s.batch_course_id === selectedBatchCourseId)
                        .sort((a, b) => a.session_date.localeCompare(b.session_date) || Number(a.hour_no) - Number(b.hour_no))
                        .map(s => {
                        const rec = store.attendance.find(a => a.session_id === s.id && a.student_id === stu.id);
                        const st = rec?.status || 'present';
                        return (
                          <td key={s.id} className="p-2 text-center font-bold">
                            {st === 'present' ? <span className="text-success">P</span> : st === 'absent' ? <span className="text-destructive">A</span> : <span className="text-warning">L</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 7.3: ASSIGNMENT / EXAM MARKS */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-mono font-medium text-muted-foreground whitespace-nowrap">Select Assessment:</label>
                <select
                  value={selectedAssessmentId}
                  onChange={(e) => changeSelectedAssessment(e.target.value)}
                  className="bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                >
                  {store.assessments.filter(a => a.batch_course_id === selectedBatchCourseId).map(a => (
                    <option key={a.id} value={a.id}>{a.name} (Max Mark: {a.max_mark})</option>
                  ))}
                  <option value="new">+ Create New Assessment</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-mono font-medium text-muted-foreground whitespace-nowrap">Name:</label>
                <Input
                  value={assessmentName}
                  onChange={(e) => setAssessmentName(e.target.value)}
                  placeholder="e.g. Assignment 1"
                  className="w-40 h-8 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-mono font-medium text-muted-foreground whitespace-nowrap">Max Mark:</label>
                <Input
                  type="number"
                  value={assessmentMaxMark}
                  onChange={(e) => setAssessmentMaxMark(Number(e.target.value) || 0)}
                  className="w-16 h-8 text-center font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-mono font-medium text-muted-foreground whitespace-nowrap">Category:</label>
                <Input
                  list="assessment-standard-categories"
                  value={assessmentCategory}
                  onChange={(e) => setAssessmentCategory(e.target.value)}
                  placeholder="e.g. Internal Exam"
                  className="w-36 h-8 text-sm"
                />
                <datalist id="assessment-standard-categories">
                  <option value="Assignment" />
                  <option value="Assessment" />
                  <option value="Internal Exam" />
                  <option value="Internal Assessment" />
                  <option value="Exam" />
                </datalist>
              </div>

              {selectedAssessmentId === 'new' ? (
                <Button
                  size="sm"
                  onClick={async () => {
                    if (!assessmentName.trim()) {
                      toast.error('Assessment Name cannot be empty');
                      return;
                    }
                    if (assessmentMaxMark <= 0) {
                      toast.error('Max Mark must be greater than 0');
                      return;
                    }
                    const newAsm: Assessment = {
                      id: generateUUID(),
                      batch_course_id: selectedBatchCourseId,
                      name: assessmentName.trim(),
                      max_mark: assessmentMaxMark,
                      assignment_category: assessmentCategory.trim() || undefined,
                    };
                    try {
                      const saved = await store.saveAssessment(newAsm);
                      setSelectedAssessmentId(saved.id);
                      toast.success(`Assessment "${saved.name}" created!`);
                    } catch (err: any) {
                      console.error(err);
                      toast.error('Failed to create assessment', {
                        description: err.message || 'Unknown database error',
                      });
                    }
                  }}
                  className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Create Assessment
                </Button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    onClick={async () => {
                      if (!assessmentName.trim()) {
                        toast.error('Assessment Name cannot be empty');
                        return;
                      }
                      const existing = store.assessments.find(a => a.id === selectedAssessmentId);
                      if (existing) {
                        const updated = {
                          ...existing,
                          name: assessmentName.trim(),
                          max_mark: assessmentMaxMark,
                          assignment_category: assessmentCategory.trim() || undefined,
                        };
                        try {
                          await store.saveAssessment(updated);
                          toast.success('Assessment details updated successfully!');
                        } catch (err: any) {
                          console.error(err);
                          toast.error('Failed to update assessment details', {
                            description: err.message || 'Unknown database error',
                          });
                        }
                      }
                    }}
                    className="h-8 px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold"
                  >
                    Save Details
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      const asmToDelete = store.assessments.find(a => a.id === selectedAssessmentId);
                      if (!asmToDelete) return;
                      if (!confirm(`Delete assessment "${asmToDelete.name}" and all its recorded marks?`)) return;
                      try {
                        await store.deleteAssessment(asmToDelete.id);
                        const remaining = store.assessments.filter(a => a.batch_course_id === selectedBatchCourseId && a.id !== asmToDelete.id);
                        if (remaining.length > 0) {
                          changeSelectedAssessment(remaining[0].id);
                        } else {
                          changeSelectedAssessment('new');
                        }
                        toast.success(`Assessment "${asmToDelete.name}" deleted.`);
                      } catch (err: any) {
                        toast.error('Failed to delete assessment: ' + (err.message || 'Error'));
                      }
                    }}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    title="Delete this assessment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleDownloadMarksTemplate} className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1" /> Blank Template (.xlsx)
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportMarks} className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1" /> Export Marks (.xlsx)
              </Button>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover">
                <Upload className="h-3.5 w-3.5" /> Upload & Validate Marks
                <input type="file" accept=".xlsx, .csv" onChange={handleUploadMarksFile} className="hidden" />
              </label>
            </div>
          </div>

          {/* Validation Preview Modal/Box */}
          {marksImportPreview && (
            <div className="bg-card border-2 border-primary rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="font-heading font-bold text-foreground">Import Validation Preview</h3>
                <span className="text-xs font-mono font-bold text-success">
                  {marksImportPreview.validRows.length} Valid Rows · {marksImportPreview.errorRows.length} Errors
                </span>
              </div>

              {marksImportPreview.errorRows.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-xs space-y-1 text-destructive">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> Row-Level Validation Errors (Commit Blocked for Invalid Rows):
                  </div>
                  {marksImportPreview.errorRows.map((err, i) => (
                    <div key={i} className="font-mono">
                      • Reg {err.register_no}: {err.error} (Attempted Mark: {err.mark})
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setMarksImportPreview(null)}>Cancel</Button>
                <Button size="sm" onClick={handleCommitMarksImport} disabled={marksImportPreview.validRows.length === 0} className="bg-primary text-primary-foreground">
                  Commit {marksImportPreview.validRows.length} Valid Marks
                </Button>
              </div>
            </div>
          )}

          {/* Marks Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
                <tr>
                  <th className="p-3">Register No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Tool</th>
                  <th className="p-3">Assignment</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Marks Obtained</th>
                  <th className="p-3 text-center">Max Mark</th>
                  <th className="p-3 text-center">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((stu) => {
                  const markObj = currentAssessmentMarks.find(m => m.student_id === stu.id);
                  const markVal = markObj?.mark !== undefined ? markObj.mark : '—';
                  const maxMark = currentAssessment?.max_mark || 100;
                  const pct = typeof markVal === 'number' ? Math.round((markVal / maxMark) * 100) : '—';

                  return (
                    <tr key={stu.id} className="hover:bg-muted/30">
                      <td className="p-3 font-mono font-bold text-accent">{stu.register_no}</td>
                      <td className="p-3 font-medium text-foreground">{stu.name}</td>
                      <td className="p-3 text-xs font-mono">{activeCourse?.name}</td>
                      <td className="p-3 text-xs font-mono font-semibold text-primary">
                        {selectedAssessmentId === 'new' ? (assessmentName || 'New Assessment') : (currentAssessment?.name || '—')}
                      </td>
                      <td className="p-3 text-xs font-mono text-muted-foreground">
                        {(selectedAssessmentId === 'new' ? assessmentCategory : currentAssessment?.assignment_category) || <span className="text-muted-foreground/30 italic">None</span>}
                      </td>
                      <td className="p-3 text-center font-mono">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number"
                            min="0"
                            max={maxMark}
                            key={`${stu.id}-${selectedAssessmentId}-${markVal}`}
                            defaultValue={markVal !== '—' ? markVal : ''}
                            placeholder="—"
                            onBlur={(e) => {
                              if (e.target.value !== '') {
                                handleUpdateSingleMark(stu.id, e.target.value);
                              }
                            }}
                            className="w-20 h-8 text-center font-mono font-bold text-primary bg-background border border-border rounded-lg focus:outline-none"
                          />
                        </div>
                      </td>
                      <td className="p-3 text-center font-mono text-muted-foreground">{maxMark}</td>
                      <td className="p-3 text-center font-mono text-xs font-bold text-foreground">
                        {typeof pct === 'number' ? `${pct}%` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7.6: SYLLABUS */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <h2 className="text-lg font-semibold font-heading">Batch Course Syllabus Topic List</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={async () => {
                  const bc = store.batchCourses.find(b => b.id === selectedBatchCourseId);
                  if (!bc) return;
                  const added = await store.syncBatchSyllabusFromDefault(selectedBatchCourseId, bc.course_id);
                  if (added > 0) {
                    setRefreshTrigger(r => r + 1);
                    toast.success(`Synced ${added} new topic(s) from default syllabus!`);
                  } else {
                    toast.info('All default topics already present — no new topics to sync.');
                  }
                }}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Sync from Default Syllabus
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportSyllabus} className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1" /> Export (.xlsx)
              </Button>
              <Button size="sm" onClick={() => {
                const nextNo = currentSyllabus.length > 0 ? Math.max(...currentSyllabus.map(s => s.topic_no)) + 1 : 1;
                setNewTopicForm({ topic_no: nextNo, topic_name: '' });
                setShowAddTopicModal(true);
              }} className="bg-primary text-primary-foreground">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Custom Topic
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-x-auto shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
                <tr>
                  <th className="p-3 w-14 text-center">#</th>
                  <th className="p-3">Topic Title</th>
                  <th className="p-3 text-center w-28">Status</th>
                  <th className="p-3 text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentSyllabus.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-muted-foreground text-xs font-mono">
                      No topics found. Use "Sync from Default Syllabus" or "Add Custom Topic".
                    </td>
                  </tr>
                )}
                {currentSyllabus.map((topic) => {
                  const isEditing = editingTopicId === topic.id;
                  return (
                    <tr key={topic.id} className={`${isEditing ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                      <td className="p-2 text-center font-mono font-bold text-muted-foreground text-xs">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={topicEditForm.topic_no}
                            onChange={e => setTopicEditForm({ ...topicEditForm, topic_no: Number(e.target.value) })}
                            className="h-7 w-14 text-center text-xs font-mono px-1"
                          />
                        ) : topic.topic_no}
                      </td>
                      <td className="p-2 font-medium text-foreground">
                        {isEditing ? (
                          <Input
                            value={topicEditForm.topic_name}
                            onChange={e => setTopicEditForm({ ...topicEditForm, topic_name: e.target.value })}
                            className="h-7 text-sm"
                            placeholder="Topic name..."
                          />
                        ) : topic.topic_name}
                      </td>
                      <td className="p-2 text-center">
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${topic.is_completed ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'
                          }`}>
                          {topic.is_completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="icon"
                              className="h-7 w-7 bg-primary text-primary-foreground"
                              onClick={async () => {
                                if (!topicEditForm.topic_name.trim()) {
                                  toast.error('Topic name is required');
                                  return;
                                }
                                // Validate: topic_no must be unique (ignoring the topic being edited)
                                const duplicateNo = currentSyllabus.some(
                                  s => s.topic_no === topicEditForm.topic_no && s.id !== topic.id
                                );
                                if (duplicateNo) {
                                  toast.error(`Topic No. ${topicEditForm.topic_no} already exists`, {
                                    description: `Choose a different number. Next available: ${Math.max(...currentSyllabus.map(s => s.topic_no)) + 1}`,
                                  });
                                  return;
                                }
                                try {
                                  await store.saveBatchSyllabusTopic({
                                    ...topic,
                                    topic_no: topicEditForm.topic_no,
                                    topic_name: topicEditForm.topic_name.trim(),
                                    planned_hours: topic.planned_hours ?? 0,
                                  });
                                  setEditingTopicId(null);
                                  setRefreshTrigger(r => r + 1);
                                  toast.success('Topic updated!');
                                } catch (err: any) {
                                  console.error(err);
                                  toast.error('Failed to update topic', {
                                    description: err.message || 'Unknown database error',
                                  });
                                }
                              }}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => setEditingTopicId(null)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                              onClick={() => {
                                setEditingTopicId(topic.id);
                                setTopicEditForm({
                                  topic_no: topic.topic_no,
                                  topic_name: topic.topic_name,
                                });
                              }}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={async () => {
                                if (confirm(`Delete topic "${topic.topic_name}"?`)) {
                                  try {
                                    await store.deleteBatchSyllabusTopic(topic.id);
                                    setRefreshTrigger(r => r + 1);
                                    toast.success('Topic deleted');
                                  } catch (err: any) {
                                    console.error(err);
                                    toast.error('Failed to delete topic', {
                                      description: err.message || 'Unknown database error',
                                    });
                                  }
                                }
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* TAB 7.7: COURSE COVERAGE */}
      {activeTab === 'coverage' && (
        <div className="space-y-6">
          {/* KPI Dashboard Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card-meridian p-4">
              <div className="text-xs font-mono text-muted-foreground uppercase">Coverage %</div>
              <div className="text-2xl font-bold font-mono text-primary mt-1">{coveragePct}%</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{completedTopics} of {totalTopics} topics completed</div>
            </div>

            <div className="card-meridian p-4">
              <div className="text-xs font-mono text-muted-foreground uppercase">Hours Delivered</div>
              <div className="text-2xl font-bold font-mono text-foreground mt-1">{deliveredHours} / {plannedHours} hrs</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{remainingHours} hrs remaining</div>
            </div>

            <div className="card-meridian p-4">
              <div className="text-xs font-mono text-muted-foreground uppercase">Pace Projection</div>
              <div className={`text-lg font-bold font-mono mt-1 ${isOnTrack ? 'text-success' : 'text-warning'}`}>
                {isOnTrack ? 'On Track' : 'Behind Pace'}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Est. completion: 14 days</div>
            </div>

            <div className="card-meridian p-4">
              <div className="text-xs font-mono text-muted-foreground uppercase">Tool Name</div>
              <div className="text-lg font-bold font-heading text-accent mt-1">{activeCourse?.name}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Semester {activeBatchCourse?.semester || batch.current_semester}</div>
            </div>
          </div>

          {/* Interactive Topic Checklist */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <h3 className="font-heading font-bold text-foreground">Interactive Syllabus Delivery Checklist</h3>
            <p className="text-xs text-muted-foreground">Tick a topic when completed in class to automatically update coverage % and pace projections.</p>

            <div className="space-y-2 pt-2">
              {currentSyllabus.map((topic) => (
                <div
                  key={topic.id}
                  onClick={async () => {
                    const newCompletedState = !topic.is_completed;
                    const date = newCompletedState ? new Date().toISOString().split('T')[0] : undefined;
                    await store.toggleBatchSyllabusTopic(topic.id, newCompletedState, date);
                    setSelectedBatchCourseId(selectedBatchCourseId);
                    toast.success(`Topic "${topic.topic_name}" status updated!`);
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${topic.is_completed ? 'bg-primary-tint/50 border-primary/30 text-foreground' : 'bg-sunken border-border/80 text-muted-foreground'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-md flex items-center justify-center border ${topic.is_completed ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background'
                      }`}>
                      {topic.is_completed && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className="font-mono text-xs font-bold w-6">{topic.topic_no}.</span>
                    <span className="font-medium text-sm text-foreground">{topic.topic_name}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    {topic.is_completed && (
                      <span className="text-success font-bold">Done {topic.completed_date ? `(${topic.completed_date})` : ''}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7.4: TRAINER LOG */}
      {activeTab === 'trainer_log' && (() => {
        const pendingTopics = currentSyllabus.filter(s => !s.is_completed);
        const searchFiltered = (topics: typeof currentSyllabus) => {
          if (!trainerLogSearch.trim()) return topics;
          const query = trainerLogSearch.trim().toLowerCase();
          return topics.filter(t => 
            t.topic_name.toLowerCase().includes(query) || 
            String(t.topic_no).includes(query)
          );
        };
        const displayedTopics = searchFiltered(showCompletedInLog ? currentSyllabus : pendingTopics);
        const batchTrainerId = store.batchCourses.find(bc => bc.id === selectedBatchCourseId)?.trainer_id || '';
        const courseTrainerLogs = store.trainerLogs
          .filter(l => l.batch_course_id === selectedBatchCourseId)
          .sort((a, b) => b.log_date.localeCompare(a.log_date));

        // Separate conducted vs missed sessions
        const conductedLogs = courseTrainerLogs.filter(l => l.log_type !== 'missed' && !l.notes?.startsWith('[MISSED:'));
        const missedLogs = courseTrainerLogs.filter(l => l.log_type === 'missed' || (Boolean(l.notes) && l.notes!.startsWith('[MISSED:')));

        const totalDeliveredMins = conductedLogs.reduce((acc, l) => acc + (l.duration_minutes || 0), 0);
        const totalDeliveredHours = Math.round((totalDeliveredMins / 60) * 10) / 10;

        const totalMissedMins = missedLogs.reduce((acc, l) => acc + (l.duration_minutes || 0), 0);
        const totalMissedHours = Math.round((totalMissedMins / 60) * 10) / 10;

        // Breakdown by reason
        const getLogReason = (l: TrainerLog): MissedReason => {
          if (l.missed_reason) return l.missed_reason;
          const parsed = store.parseTrainerLogNotes(l.notes);
          return (parsed.reason || 'other') as MissedReason;
        };

        const missedByReason = {
          trainer_leave: missedLogs.filter(l => getLogReason(l) === 'trainer_leave').reduce((acc, l) => acc + (l.duration_minutes || 0), 0),
          college_program: missedLogs.filter(l => getLogReason(l) === 'college_program').reduce((acc, l) => acc + (l.duration_minutes || 0), 0),
          natural_calamity: missedLogs.filter(l => getLogReason(l) === 'natural_calamity').reduce((acc, l) => acc + (l.duration_minutes || 0), 0),
          other: missedLogs.filter(l => getLogReason(l) === 'other').reduce((acc, l) => acc + (l.duration_minutes || 0), 0),
        };

        const displayedLogs = courseTrainerLogs.filter(l => {
          const isMissed = l.log_type === 'missed' || (Boolean(l.notes) && l.notes!.startsWith('[MISSED:'));
          if (trainerLogFilter === 'conducted') return !isMissed;
          if (trainerLogFilter === 'missed') return isMissed;
          return true;
        });

        const calcDuration = (start: string, end: string): number => {
          if (!start || !end) return 0;
          const [sh, sm] = start.split(':').map(Number);
          const [eh, em] = end.split(':').map(Number);
          return Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
        };

        const durationMins = calcDuration(trainerLogForm.start_time, trainerLogForm.end_time);

        const handleLogSession = async () => {
          if (!trainerLogForm.log_date || !trainerLogForm.start_time || !trainerLogForm.end_time) {
            toast.error('Date, Start Time, and End Time are required');
            return;
          }
          if (durationMins <= 0) {
            toast.error('End time must be after start time');
            return;
          }
          try {
            await store.saveTrainerLog({
              batch_course_id: selectedBatchCourseId,
              trainer_id: trainerLogForm.trainer_id || batchTrainerId || undefined,
              log_date: trainerLogForm.log_date,
              start_time: trainerLogForm.start_time,
              end_time: trainerLogForm.end_time,
              duration_minutes: durationMins,
              topics_covered: trainerLogTopics,
              notes: trainerLogForm.notes || undefined,
              log_type: 'conducted',
            });
            setTrainerLogForm({ log_date: today, trainer_id: '', start_time: '', end_time: '', notes: '' });
            setTrainerLogTopics([]);
            setRefreshTrigger(r => r + 1);
            const coveredCount = trainerLogTopics.length;
            toast.success(`Session logged! ${coveredCount > 0 ? `${coveredCount} topic(s) marked as completed.` : 'No topics marked.'}`);
          } catch (err: any) {
            console.error(err);
            toast.error('Failed to log session', {
              description: err.message || 'Unknown database error',
            });
          }
        };

        const handleLogMissedSession = async () => {
          if (!missedSessionForm.log_date) {
            toast.error('Date of missed session is required');
            return;
          }
          if (!missedSessionForm.missed_hours || missedSessionForm.missed_hours <= 0) {
            toast.error('Missed hours must be greater than 0');
            return;
          }
          try {
            const durationMins = Math.round(Number(missedSessionForm.missed_hours) * 60);
            await store.saveTrainerLog({
              batch_course_id: selectedBatchCourseId,
              trainer_id: missedSessionForm.trainer_id || batchTrainerId || undefined,
              log_date: missedSessionForm.log_date,
              start_time: '00:00',
              end_time: '00:00',
              duration_minutes: durationMins,
              topics_covered: [],
              notes: missedSessionForm.notes || '',
              log_type: 'missed',
              missed_reason: missedSessionForm.missed_reason,
            });
            setMissedSessionForm({
              log_date: today,
              trainer_id: '',
              missed_hours: 2,
              missed_reason: 'trainer_leave',
              notes: '',
            });
            setRefreshTrigger(r => r + 1);
            toast.success(`Missed session recorded (${missedSessionForm.missed_hours} hrs due to ${store.getMissedReasonLabel(missedSessionForm.missed_reason)})`);
          } catch (err: any) {
            console.error(err);
            toast.error('Failed to log missed session', {
              description: err.message || 'Unknown database error',
            });
          }
        };

        return (
          <div className="space-y-6">
            {/* KPI DASHBOARD ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-meridian p-4">
                <div className="text-xs font-mono text-muted-foreground uppercase">Delivered Hours</div>
                <div className="text-2xl font-bold font-mono text-primary mt-1">{totalDeliveredHours} hrs</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{conductedLogs.length} classes completed</div>
              </div>

              <div className="card-meridian p-4 border-amber-500/30 bg-amber-500/[0.04]">
                <div className="text-xs font-mono text-amber-700 dark:text-amber-400 uppercase font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> Total Missed Hours
                </div>
                <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-1">{totalMissedHours} hrs</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{missedLogs.length} missed session(s)</div>
              </div>

              <div className="card-meridian p-4 lg:col-span-2 space-y-1.5">
                <div className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
                  <span>Missed Hours Breakdown</span>
                  <span className="font-bold font-mono text-amber-700 dark:text-amber-400">{totalMissedHours}h total</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-background border border-border/60">
                    <span className="text-muted-foreground flex items-center gap-1">👨‍🏫 Trainer Leave:</span>
                    <span className="font-bold text-foreground">{Math.round(missedByReason.trainer_leave / 60 * 10) / 10}h</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-background border border-border/60">
                    <span className="text-muted-foreground flex items-center gap-1">🏫 College Program:</span>
                    <span className="font-bold text-foreground">{Math.round(missedByReason.college_program / 60 * 10) / 10}h</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-background border border-border/60">
                    <span className="text-muted-foreground flex items-center gap-1">🌧️ Calamity / Alert:</span>
                    <span className="font-bold text-foreground">{Math.round(missedByReason.natural_calamity / 60 * 10) / 10}h</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-background border border-border/60">
                    <span className="text-muted-foreground flex items-center gap-1">⚙️ Other / Closure:</span>
                    <span className="font-bold text-foreground">{Math.round(missedByReason.other / 60 * 10) / 10}h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LOG SESSION FORM */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h2 className="text-base font-semibold font-heading">
                    {sessionLogType === 'conducted' ? 'Log Training Delivery' : 'Record Missed Session'}
                  </h2>
                  <span className="text-xs font-mono text-muted-foreground">
                    · {activeCourse?.name || 'Course'}
                  </span>
                </div>

                {/* Segmented Toggle: Conducted Class vs Missed Session */}
                <div className="flex items-center gap-1.5 p-1 bg-muted/70 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setSessionLogType('conducted')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      sessionLogType === 'conducted'
                        ? 'bg-background text-primary shadow-xs font-bold border border-border/60'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Conducted Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionLogType('missed')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      sessionLogType === 'missed'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 shadow-xs font-bold border border-amber-500/30'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> Missed Session
                  </button>
                </div>
              </div>

              {/* CONDUCTED CLASS FORM */}
              {sessionLogType === 'conducted' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Date */}
                    <div>
                      <label className="text-xs font-mono font-medium text-muted-foreground">Date <span className="text-destructive">*</span></label>
                      <Input
                        type="date"
                        value={trainerLogForm.log_date}
                        onChange={e => setTrainerLogForm({ ...trainerLogForm, log_date: e.target.value })}
                        className="mt-1 font-mono text-sm"
                      />
                    </div>
                    {/* Trainer */}
                    <div>
                      <label className="text-xs font-mono font-medium text-muted-foreground">Trainer</label>
                      <select
                        value={trainerLogForm.trainer_id || batchTrainerId}
                        onChange={e => setTrainerLogForm({ ...trainerLogForm, trainer_id: e.target.value })}
                        className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select Trainer</option>
                        {store.profiles.filter(p => p.role === 'trainer' || p.role === 'admin').map(p => (
                          <option key={p.id} value={p.id}>{p.full_name}</option>
                        ))}
                      </select>
                    </div>
                    {/* Start Time */}
                    <div>
                      <label className="text-xs font-mono font-medium text-muted-foreground">Start Time <span className="text-destructive">*</span></label>
                      <Input
                        type="time"
                        value={trainerLogForm.start_time}
                        onChange={e => setTrainerLogForm({ ...trainerLogForm, start_time: e.target.value })}
                        className="mt-1 font-mono text-sm"
                      />
                    </div>
                    {/* End Time */}
                    <div>
                      <label className="text-xs font-mono font-medium text-muted-foreground">End Time <span className="text-destructive">*</span></label>
                      <Input
                        type="time"
                        value={trainerLogForm.end_time}
                        onChange={e => setTrainerLogForm({ ...trainerLogForm, end_time: e.target.value })}
                        className="mt-1 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {durationMins > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">Auto-computed duration:</span>
                      <span className="bg-primary/10 text-primary font-mono font-bold text-xs px-3 py-1 rounded-full">
                        {Math.floor(durationMins / 60) > 0 ? `${Math.floor(durationMins / 60)}h ` : ''}{durationMins % 60}m ({durationMins} mins)
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground">Notes (optional)</label>
                    <textarea
                      value={trainerLogForm.notes}
                      onChange={e => setTrainerLogForm({ ...trainerLogForm, notes: e.target.value })}
                      placeholder="Trainer engagement details (e.g. Class, Paper valuation, Supervision, remarks)..."
                      rows={2}
                      className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Pending Topics Checklist */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <label className="text-xs font-mono font-medium text-muted-foreground">
                        Topics Covered in this Session
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                          onClick={() => {
                            const nextNo = currentSyllabus.length > 0 ? Math.max(...currentSyllabus.map(s => s.topic_no)) + 1 : 1;
                            setNewTopicForm({ topic_no: nextNo, topic_name: '' });
                            setShowAddTopicModal(true);
                          }}
                        >
                          <Plus className="h-3 w-3" /> Add Custom Topic
                        </button>
                        <label className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={showCompletedInLog}
                            onChange={e => setShowCompletedInLog(e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          Show Completed
                        </label>
                        {displayedTopics.length > 0 && (
                          <button
                            type="button"
                            className="text-xs font-mono text-primary hover:underline"
                            onClick={() => setTrainerLogTopics(
                              trainerLogTopics.length === displayedTopics.length
                                ? []
                                : displayedTopics.map(t => t.id)
                            )}
                          >
                            {trainerLogTopics.length === displayedTopics.length ? 'Deselect All' : 'Select All'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 max-w-md">
                      <Input
                        type="text"
                        value={trainerLogSearch}
                        onChange={e => setTrainerLogSearch(e.target.value)}
                        placeholder="Search topics..."
                        className="text-xs h-9 rounded-xl bg-background border border-border"
                      />
                    </div>

                    {displayedTopics.length === 0 ? (
                      <div className="bg-success/10 border border-success/30 rounded-xl p-4 text-center">
                        <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-1" />
                        <p className="text-xs font-mono text-success font-bold">All topics completed! 🎉</p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-1">
                          Toggle "Show Completed" or click "Add Custom Topic" to log additional topics.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                        {displayedTopics.map(topic => {
                          const isChecked = trainerLogTopics.includes(topic.id);
                          return (
                            <div
                              key={topic.id}
                              onClick={() => setTrainerLogTopics(prev =>
                                isChecked ? prev.filter(id => id !== topic.id) : [...prev, topic.id]
                              )}
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${isChecked
                                  ? 'bg-primary/10 border-primary/40 text-foreground'
                                  : 'bg-sunken border-border/80 text-muted-foreground hover:border-primary/30'
                                }`}
                            >
                              <div className={`flex-shrink-0 h-5 w-5 rounded-md flex items-center justify-center border ${isChecked ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background'
                                }`}>
                                {isChecked && <Check className="h-3 w-3" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-mono text-muted-foreground">{topic.topic_no}.</span>
                                  {topic.is_completed && (
                                    <span className="text-[9px] font-mono font-bold bg-success/20 text-success px-1.5 py-0.2 rounded">
                                      Completed
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm font-medium text-foreground leading-tight truncate">{topic.topic_name}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs font-mono text-muted-foreground">
                      {trainerLogTopics.length > 0 ? (
                        <span className="text-primary font-bold">{trainerLogTopics.length} topic(s) selected to mark as covered</span>
                      ) : (
                        <span>No topics selected (session only, no topics marked)</span>
                      )}
                    </div>
                    <Button onClick={handleLogSession} className="bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5 mr-1" /> Save Session Log
                    </Button>
                  </div>
                </div>
              )}

              {/* MISSED SESSION FORM */}
              {sessionLogType === 'missed' && (
                <div className="space-y-4 bg-amber-500/[0.02] border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-700 dark:text-amber-400 font-semibold">
                    <AlertTriangle className="h-4 w-4" />
                    Record a missed or cancelled class session (Trainer leave, College event, Natural calamity)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Date */}
                    <div>
                      <label className="text-xs font-mono font-medium text-muted-foreground">Missed Date <span className="text-destructive">*</span></label>
                      <Input
                        type="date"
                        value={missedSessionForm.log_date}
                        onChange={e => setMissedSessionForm({ ...missedSessionForm, log_date: e.target.value })}
                        className="mt-1 font-mono text-sm"
                      />
                    </div>

                    {/* Trainer */}
                    <div>
                      <label className="text-xs font-mono font-medium text-muted-foreground">Trainer Assigned</label>
                      <select
                        value={missedSessionForm.trainer_id || batchTrainerId}
                        onChange={e => setMissedSessionForm({ ...missedSessionForm, trainer_id: e.target.value })}
                        className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select Trainer</option>
                        {store.profiles.filter(p => p.role === 'trainer' || p.role === 'admin').map(p => (
                          <option key={p.id} value={p.id}>{p.full_name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Hours Missed */}
                    <div>
                      <label className="text-xs font-mono font-medium text-muted-foreground">Hours Missed <span className="text-destructive">*</span></label>
                      <Input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="12"
                        value={missedSessionForm.missed_hours}
                        onChange={e => setMissedSessionForm({ ...missedSessionForm, missed_hours: Number(e.target.value) })}
                        className="mt-1 font-mono text-sm font-bold text-amber-600 dark:text-amber-400"
                        placeholder="e.g. 2"
                      />
                    </div>

                    {/* Reason Category */}
                    <div>
                      <label className="text-xs font-mono font-medium text-muted-foreground">Reason Category <span className="text-destructive">*</span></label>
                      <select
                        value={missedSessionForm.missed_reason}
                        onChange={e => setMissedSessionForm({ ...missedSessionForm, missed_reason: e.target.value as MissedReason })}
                        className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                      >
                        <option value="trainer_leave">👨‍🏫 Trainer on Leave</option>
                        <option value="college_program">🏫 College Program / Event</option>
                        <option value="natural_calamity">🌧️ Natural Calamity / Weather Alert</option>
                        <option value="other">⚙️ Other / Institutional</option>
                      </select>
                    </div>
                  </div>

                  {/* Specific Reason Details */}
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground">
                      Reason Remarks / Specific Details <span className="text-muted-foreground/60">(optional)</span>
                    </label>
                    <textarea
                      value={missedSessionForm.notes}
                      onChange={e => setMissedSessionForm({ ...missedSessionForm, notes: e.target.value })}
                      placeholder="e.g. College annual arts festival, District Collector declared flood holiday, Trainer sick leave..."
                      rows={2}
                      className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
                    <div className="text-xs font-mono text-muted-foreground">
                      Missed hours are tracked separately for audit and workload accounting.
                    </div>
                    <Button onClick={handleLogMissedSession} className="bg-amber-600 hover:bg-amber-700 text-white font-medium">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1.5" /> Log Missed Session ({missedSessionForm.missed_hours} hrs)
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* SESSION HISTORY */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 border-b border-border bg-muted/30 gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold font-heading">Session History</h3>
                  <span className="text-xs font-mono text-muted-foreground">
                    ({courseTrainerLogs.length} total: {conductedLogs.length} conducted · {missedLogs.length} missed)
                  </span>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setTrainerLogFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      trainerLogFilter === 'all'
                        ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                        : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All ({courseTrainerLogs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrainerLogFilter('conducted')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      trainerLogFilter === 'conducted'
                        ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                        : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Conducted ({conductedLogs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrainerLogFilter('missed')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      trainerLogFilter === 'missed'
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/30'
                        : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Missed ({missedLogs.length})
                  </button>
                </div>
              </div>

              {displayedLogs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-xs font-mono">
                  {trainerLogFilter === 'missed'
                    ? 'No missed sessions recorded for this course. Excellent attendance continuity!'
                    : 'No sessions logged yet. Log your first session above.'}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
                    <tr>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Trainer</th>
                      <th className="p-3 text-center">Time Slot</th>
                      <th className="p-3 text-center">Duration</th>
                      <th className="p-3 text-left">Topics / Missed Reason</th>
                      <th className="p-3 text-left">Notes</th>
                      <th className="p-3 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {displayedLogs.map(log => {
                      const isMissed = log.log_type === 'missed' || (Boolean(log.notes) && log.notes!.startsWith('[MISSED:'));
                      const parsed = store.parseTrainerLogNotes(log.notes);
                      const trainer = store.profiles.find(p => p.id === log.trainer_id);

                      return (
                        <tr key={log.id} className={isMissed ? 'bg-amber-500/[0.03] hover:bg-amber-500/[0.07] transition-colors' : 'hover:bg-muted/20 transition-colors'}>
                          <td className="p-3 font-mono text-xs font-bold whitespace-nowrap">{log.log_date}</td>
                          
                          {/* Status Badge */}
                          <td className="p-3">
                            {isMissed ? (
                              <span className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> Missed
                              </span>
                            ) : (
                              <span className="bg-primary/10 text-primary border border-primary/20 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Conducted
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-sm">{trainer?.full_name || log.trainer_name || <span className="text-muted-foreground/50 italic">—</span>}</td>
                          
                          {/* Time */}
                          <td className="p-3 text-center font-mono text-xs">
                            {isMissed ? (
                              <span className="text-muted-foreground/60 italic font-mono text-[11px]">Suspended</span>
                            ) : (
                              `${log.start_time} – ${log.end_time}`
                            )}
                          </td>

                          {/* Duration */}
                          <td className="p-3 text-center whitespace-nowrap">
                            {isMissed ? (
                              <span className="bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                                {Math.round((log.duration_minutes / 60) * 10) / 10}h missed
                              </span>
                            ) : (
                              <span className="bg-primary/10 text-primary font-mono text-xs font-bold px-2 py-0.5 rounded-full">
                                {Math.floor(log.duration_minutes / 60) > 0 ? `${Math.floor(log.duration_minutes / 60)}h ` : ''}{log.duration_minutes % 60}m
                              </span>
                            )}
                          </td>

                          {/* Topics / Reason */}
                          <td className="p-3">
                            {isMissed ? (
                              <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                                {log.missed_reason === 'trainer_leave' || parsed.reason === 'trainer_leave' ? '👨‍🏫 Trainer on Leave' :
                                 log.missed_reason === 'college_program' || parsed.reason === 'college_program' ? '🏫 College Program / Event' :
                                 log.missed_reason === 'natural_calamity' || parsed.reason === 'natural_calamity' ? '🌧️ Natural Calamity / Alert' :
                                 '⚙️ Other / Institutional'}
                              </span>
                            ) : log.topics_covered.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-w-[320px]">
                                {log.topics_covered.map(tid => {
                                  const name = currentSyllabus.find(s => s.id === tid)?.topic_name || tid;
                                  return (
                                    <span
                                      key={tid}
                                      className="bg-success/10 text-success text-[11px] font-medium px-2 py-0.5 rounded"
                                      title={name}
                                    >
                                      {name}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-muted-foreground/40 text-xs font-mono">—</span>
                            )}
                          </td>

                          {/* Notes */}
                          <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate" title={isMissed ? parsed.cleanNotes : log.notes}>
                            {(isMissed ? parsed.cleanNotes : log.notes) || <span className="text-muted-foreground/40 italic">—</span>}
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {profile?.role === 'admin' && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                                  onClick={() => {
                                    setEditingTrainerLog(log);
                                    setEditTrainerLogForm({
                                      log_date: log.log_date,
                                      trainer_id: log.trainer_id || '',
                                      start_time: log.start_time,
                                      end_time: log.end_time,
                                      notes: isMissed ? parsed.cleanNotes : (log.notes || ''),
                                      log_type: isMissed ? 'missed' : 'conducted',
                                      missed_hours: Math.round((log.duration_minutes / 60) * 10) / 10 || 2,
                                      missed_reason: (isMissed ? (parsed.reason || log.missed_reason || 'trainer_leave') : 'trainer_leave') as MissedReason,
                                    });
                                    setEditTrainerLogTopics(log.topics_covered || []);
                                    setShowEditTrainerLogModal(true);
                                  }}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={async () => {
                                  const confirmMsg = isMissed
                                    ? 'Delete this missed session log?'
                                    : 'Delete this session log? Note: completed topics will NOT be un-marked.';
                                  if (confirm(confirmMsg)) {
                                    await store.deleteTrainerLog(log.id);
                                    setRefreshTrigger(r => r + 1);
                                    toast.success(isMissed ? 'Missed session log deleted' : 'Session log deleted');
                                  }
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 7.5: TASK LIST */}
      {activeTab === 'task_list' && (() => {
        const currentBc = store.batchCourses.find(bc => bc.id === selectedBatchCourseId);
        const currentCourseId = currentBc?.course_id || (batchCourses[0]?.course_id || '');
        const currentCourse = store.courses.find(c => c.id === currentCourseId);
        const activeSemesterNum = typeof selectedSemesterFilter === 'number' 
          ? selectedSemesterFilter 
          : (currentBc?.semester || batch?.current_semester || 1);

        const allToolTasks = store.batchTasks.filter(
          t => t.batch_id === id && t.course_id === currentCourseId
        );
        const semesterTasks = allToolTasks.filter(t => t.semester === activeSemesterNum);
        const commonTasks = allToolTasks.filter(t => t.semester === null || t.semester === undefined);

        const isOverdue = (dateStr?: string | null) => {
          if (!dateStr) return false;
          const today = new Date().toISOString().split('T')[0];
          return dateStr < today;
        };

        const formatDueDate = (dateStr?: string | null) => {
          if (!dateStr) return null;
          try {
            const [y, m, d] = dateStr.split('-');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
          } catch {
            return dateStr;
          }
        };

        return (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card with Task Creation Form */}
            <div className="card-meridian p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
                <div>
                  <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-primary" />
                    Cohort Tasks &amp; Actions
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Managing tasks for <span className="font-semibold text-primary">{currentCourse?.name || 'Selected Course'}</span> ({currentCourse?.code || 'N/A'})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">
                    Sem {activeSemesterNum} Active
                  </span>
                  <span className="text-[11px] font-mono bg-accent/10 text-accent px-2.5 py-1 rounded-full font-bold">
                    {allToolTasks.filter(t => t.is_completed).length}/{allToolTasks.length} Done
                  </span>
                </div>
              </div>

              {/* Add Task Form */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-7">
                    <Input
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder="Task description (e.g. Mock Test 1, ISA Evaluation, Project Clearance)..."
                      className="text-xs rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCustomTask(currentCourseId, activeSemesterNum);
                      }}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="text-xs rounded-xl cursor-pointer"
                      title="Optional Due Date / Deadline"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button
                      onClick={() => handleAddCustomTask(currentCourseId, activeSemesterNum)}
                      className="w-full bg-primary text-primary-foreground rounded-xl text-xs font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Task
                    </Button>
                  </div>
                </div>

                {/* Scope selector */}
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-1">
                  <span className="text-[11px] uppercase tracking-wider font-mono font-semibold text-foreground/70">Scope:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
                    <input
                      type="radio"
                      name="taskScope"
                      checked={newTaskScope === 'semester'}
                      onChange={() => setNewTaskScope('semester')}
                      className="text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>Semester {activeSemesterNum} Task</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
                    <input
                      type="radio"
                      name="taskScope"
                      checked={newTaskScope === 'common'}
                      onChange={() => setNewTaskScope('common')}
                      className="text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>Common to Entire Course</span>
                  </label>
                </div>
              </div>
            </div>

            {/* SECTION 1: SEMESTER SPECIFIC TASKS */}
            <div className="card-meridian p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold font-mono">
                    S{activeSemesterNum}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-foreground">
                    Semester {activeSemesterNum} Tasks
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {semesterTasks.filter(t => t.is_completed).length} of {semesterTasks.length} done
                </span>
              </div>

              {semesterTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground italic border border-dashed border-border/80 rounded-xl bg-sunken/10">
                  <ListTodo className="h-6 w-6 text-muted-foreground/40 mb-1.5" />
                  <p className="text-xs">No tasks specifically assigned to Semester {activeSemesterNum}.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {semesterTasks.map(task => {
                    const overdue = !task.is_completed && isOverdue(task.due_date);
                    return (
                      <div
                        key={task.id}
                        className={`flex gap-3 items-center border p-3 rounded-xl transition-all group ${
                          task.is_completed ? 'bg-sunken/30 border-border/40 opacity-75' : 'bg-sunken/60 border-border/70 hover:bg-sunken'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.is_completed}
                          onChange={() => handleToggleCustomTask(task.id)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                          <span className={`text-xs truncate ${task.is_completed ? 'line-through text-muted-foreground font-normal' : 'text-foreground font-medium'}`}>
                            {task.title}
                          </span>
                          {task.due_date && (
                            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                              overdue
                                ? 'bg-destructive/15 text-destructive border border-destructive/30'
                                : task.is_completed
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-primary/10 text-primary border border-primary/20'
                            }`}>
                              <Calendar className="h-3 w-3" />
                              {overdue ? 'Overdue: ' : 'Due: '}
                              {formatDueDate(task.due_date)}
                            </span>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all rounded-lg"
                          onClick={() => handleDeleteCustomTask(task.id)}
                          title="Delete task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 2: COMMON COURSE TASKS */}
            <div className="card-meridian p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-bold font-mono">
                    🌐
                  </span>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-foreground">
                      Common Course Tasks
                    </h4>
                    <p className="text-[11px] text-muted-foreground">General milestones valid across all semesters for {currentCourse?.name || 'this course'}.</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {commonTasks.filter(t => t.is_completed).length} of {commonTasks.length} done
                </span>
              </div>

              {commonTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground italic border border-dashed border-border/80 rounded-xl bg-sunken/10">
                  <ListTodo className="h-6 w-6 text-muted-foreground/40 mb-1.5" />
                  <p className="text-xs">No common tasks for this tool course. Select &quot;Common to Entire Course&quot; to add one.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {commonTasks.map(task => {
                    const overdue = !task.is_completed && isOverdue(task.due_date);
                    return (
                      <div
                        key={task.id}
                        className={`flex gap-3 items-center border p-3 rounded-xl transition-all group ${
                          task.is_completed ? 'bg-sunken/30 border-border/40 opacity-75' : 'bg-sunken/60 border-border/70 hover:bg-sunken'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.is_completed}
                          onChange={() => handleToggleCustomTask(task.id)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                          <span className={`text-xs truncate ${task.is_completed ? 'line-through text-muted-foreground font-normal' : 'text-foreground font-medium'}`}>
                            {task.title}
                          </span>
                          {task.due_date && (
                            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                              overdue
                                ? 'bg-destructive/15 text-destructive border border-destructive/30'
                                : task.is_completed
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-accent/15 text-accent border border-accent/25'
                            }`}>
                              <Calendar className="h-3 w-3" />
                              {overdue ? 'Overdue: ' : 'Due: '}
                              {formatDueDate(task.due_date)}
                            </span>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all rounded-lg"
                          onClick={() => handleDeleteCustomTask(task.id)}
                          title="Delete task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ABSENTEE EMAIL PREVIEW MODAL */}

      {showAbsenteeModal && absenteePreview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading text-foreground">Absentees Report Preview</h3>
              <span className="text-xs font-mono font-bold text-accent">Explicit Confirm</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-sunken p-3.5 rounded-xl space-y-2.5 border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="text-muted-foreground font-medium">Recipient Coordinator:</span>
                  <span className="font-bold text-foreground">{absenteePreview.recipient_name} <span className="text-muted-foreground font-normal">({absenteePreview.recipient_email})</span></span>
                </div>

                {(() => {
                  const directCfg = store.emailConfigs.find(c => c.user_id === absenteeSenderId && c.is_verified);
                  const relayCfg = store.emailConfigs.find(c => c.is_verified) || store.emailConfigs[0];
                  const activeCfg = directCfg || relayCfg;
                  const activeSender = store.profiles.find(p => p.id === absenteeSenderId);
                  const isDirect = !!directCfg;
                  const sendingName = isDirect ? (directCfg.from_name || activeSender?.full_name) : (activeCfg?.from_name || 'Team The Strategist');
                  const sendingEmail = activeCfg?.smtp_user || 'teamthestrategist@gmail.com';

                  return (
                    <>
                      {/* Sending Account Details */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs pt-1 border-t border-border/60">
                        <span className="text-muted-foreground font-medium flex items-center gap-1">
                          <UserCheck className="h-3.5 w-3.5 text-primary" /> Sender (From Account):
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-foreground">{sendingName}</span>
                          <span className="text-muted-foreground ml-1">&lt;{sendingEmail}&gt;</span>
                        </div>
                      </div>

                      {/* Course Trainer / Reply-To */}
                      {!isDirect && activeSender && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs pt-1 border-t border-border/60">
                          <span className="text-muted-foreground font-medium">Trainer In-Charge:</span>
                          <div className="text-right">
                            <span className="font-semibold text-foreground">{activeSender.full_name}</span>
                            <span className="text-muted-foreground ml-1">(Reply-To: {activeSender.email})</span>
                          </div>
                        </div>
                      )}

                      {/* Trainer Selection */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1 border-t border-border/60">
                        <label className="text-muted-foreground font-medium flex items-center gap-1">
                          Select Sender / Trainer:
                        </label>
                        <select
                          value={absenteeSenderId}
                          onChange={(e) => {
                            const newSenderId = e.target.value;
                            setAbsenteeSenderId(newSenderId);
                            const p = store.profiles.find(prof => prof.id === newSenderId);
                            const cfg = store.emailConfigs.find(c => c.user_id === newSenderId);
                            if (p) {
                              setAbsenteePreview({
                                ...absenteePreview,
                                sender_name: cfg?.from_name || p.full_name,
                                sender_email: cfg?.smtp_user || p.email,
                              });
                            }
                          }}
                          className="bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary max-w-sm"
                        >
                          {store.profiles
                            .filter(p => p.role === 'admin' || p.role === 'trainer')
                            .map(p => {
                              const hasConfig = store.emailConfigs.some(c => c.user_id === p.id && c.is_verified);
                              return (
                                <option key={p.id} value={p.id}>
                                  {p.full_name} ({p.email}) - {hasConfig ? '✓ (Direct Personal SMTP)' : '(via Team The Strategist)'}
                                </option>
                              );
                            })}
                        </select>
                      </div>

                      {/* Delivery Mode Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] pt-1 border-t border-border/60">
                        <span className="text-muted-foreground font-medium">Delivery Route:</span>
                        {isDirect ? (
                          <span className="text-success font-semibold flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5" /> Direct SMTP ({sendingEmail}) &bull; From: {sendingName}
                          </span>
                        ) : activeCfg ? (
                          <span className="text-accent font-semibold flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5" /> Sent from Team The Strategist ({sendingEmail}) &bull; Reply-To: {activeSender?.email}
                          </span>
                        ) : (
                          <span className="text-destructive font-semibold">
                            ⚠️ No verified SMTP configured in system
                          </span>
                        )}
                      </div>
                    </>
                  );
                })()}

                <div className="pt-1 border-t border-border/60">
                  <span className="text-muted-foreground font-medium">Subject:</span>{' '}
                  <span className="font-bold text-primary">Absentees Report - {absenteePreview.batch_code} ({absenteePreview.course_name}) - {formatDateToDDMMYYYY(absenteePreview.session_date)}</span>
                </div>
              </div>

              <div className="border border-border rounded-xl p-4 space-y-3 bg-card overflow-hidden">
                <div className="font-sans font-bold text-foreground text-sm flex items-center justify-between">
                  <span>Absentee Matrix Table ({absenteePreview.absentees.length} Students)</span>
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Sorted by Class</span>
                </div>
                {absenteePreview.absentees.length === 0 ? (
                  <div className="text-success py-2 text-center font-sans text-xs">No absentees reported for this date!</div>
                ) : (
                  <div className="overflow-x-auto border border-border/85 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-muted/60 border-b border-border text-muted-foreground font-mono text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5">Register No</th>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Class (Division)</th>
                          {getSessionHeaders().map((header, idx) => (
                            <th key={idx} className="p-2.5 text-center whitespace-nowrap">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {absenteePreview.absentees.map((a, idx) => {
                          const sessionHeaders = getSessionHeaders();
                          return (
                            <tr key={idx} className="hover:bg-muted/30">
                              <td className="p-2.5 font-mono font-bold text-accent">{a.register_no}</td>
                              <td className="p-2.5 font-medium text-foreground">{a.name}</td>
                              <td className="p-2.5 text-muted-foreground font-mono">{a.class}</td>
                              {sessionHeaders.map((_, hIdx) => {
                                const isAbsent = a.hours_absent.includes(hIdx);
                                return (
                                  <td key={hIdx} className="p-2.5 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isAbsent ? 'bg-destructive/15 text-destructive' : 'bg-success/15 text-success'
                                      }`}>
                                      {isAbsent ? 'Absent' : 'Present'}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setShowAbsenteeModal(false)} disabled={isSendingAbsenteeEmail}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSendAbsenteeEmail} disabled={isSendingAbsenteeEmail} className="bg-primary text-primary-foreground">
                {isSendingAbsenteeEmail ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Sending via SMTP...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1" /> Send Absentee Email Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">Add Student to Batch</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Register Number (Primary Key)</label>
                <Input value={studentForm.register_no} onChange={(e) => setStudentForm({ ...studentForm, register_no: e.target.value })} placeholder="2026BBA099" className="mt-1 font-mono uppercase" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Full Name</label>
                <Input value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} placeholder="John Doe" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Class / Division</label>
                <Input value={studentForm.class} onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })} placeholder="Div A" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Phone Number</label>
                <Input value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} placeholder="+1 555-0199" className="mt-1 font-mono" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddStudentModal(false)}>Cancel</Button>
              <Button onClick={handleAddStudent} className="bg-primary text-primary-foreground">Add Student</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD COURSE */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">Allocate Course to Batch</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Course</label>
                <select value={newCourseId} onChange={(e) => setNewCourseId(e.target.value)} className="w-full mt-1 bg-background border border-border rounded-xl p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  {store.courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Assigned Trainer</label>
                <select value={newTrainerId} onChange={(e) => setNewTrainerId(e.target.value)} className="w-full mt-1 bg-background border border-border rounded-xl p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  {store.profiles.filter(p => p.role === 'trainer' || p.role === 'admin').map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Planned Hours</label>
                <Input type="number" value={newPlannedHours} onChange={(e) => setNewPlannedHours(Number(e.target.value))} className="mt-1 font-mono" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Semester</label>
                <select value={newCourseSemester} onChange={(e) => setNewCourseSemester(Number(e.target.value))} className="w-full mt-1 bg-background border border-border rounded-xl p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddCourseModal(false)}>Cancel</Button>
              <Button onClick={handleAddBatchCourse} className="bg-primary text-primary-foreground">Allocate Course</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ALLOCATED COURSE */}
      {showEditCourseModal && editingBatchCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">Edit Course Allocation</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Course</label>
                <Input
                  value={store.courses.find(c => c.id === editingBatchCourse.course_id)?.name || ''}
                  disabled
                  className="mt-1 bg-muted font-bold font-sans"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Assigned Trainer</label>
                <select
                  value={editCourseTrainerId}
                  onChange={(e) => setEditCourseTrainerId(e.target.value)}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Unassigned</option>
                  {store.profiles.filter(p => p.role === 'trainer' || p.role === 'admin').map(p => (
                    <option key={p.id} value={p.id}>{p.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Planned Hours</label>
                <Input
                  type="number"
                  value={editCoursePlannedHours}
                  onChange={(e) => setEditCoursePlannedHours(Number(e.target.value))}
                  className="mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Semester</label>
                <select
                  value={editCourseSemester}
                  onChange={(e) => setEditCourseSemester(Number(e.target.value))}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Status</label>
                <select
                  value={editCourseStatus}
                  onChange={(e) => setEditCourseStatus(e.target.value as 'Active' | 'Completed')}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowEditCourseModal(false)}>Cancel</Button>
              <Button onClick={handleSaveEditBatchCourse} className="bg-primary text-primary-foreground">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD TOPIC */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading">Add Custom Topic</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddTopicModal(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Topic No</label>
                <Input
                  type="number"
                  value={newTopicForm.topic_no}
                  onChange={e => setNewTopicForm({ ...newTopicForm, topic_no: Number(e.target.value) })}
                  className="mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Topic Name <span className="text-destructive">*</span></label>
                <Input
                  value={newTopicForm.topic_name}
                  onChange={e => setNewTopicForm({ ...newTopicForm, topic_name: e.target.value })}
                  placeholder="e.g. Introduction to Excel"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setShowAddTopicModal(false)}>Cancel</Button>
              <Button
                onClick={async () => {
                  if (!newTopicForm.topic_name.trim()) {
                    toast.error('Topic name is required');
                    return;
                  }
                  // Validate: topic_no must be unique within this batch course
                  const duplicateNo = currentSyllabus.some(
                    s => s.topic_no === newTopicForm.topic_no
                  );
                  if (duplicateNo) {
                    toast.error(`Topic No. ${newTopicForm.topic_no} already exists`, {
                      description: `Choose a different number. Next available: ${Math.max(...currentSyllabus.map(s => s.topic_no)) + 1}`,
                    });
                    return;
                  }
                  try {
                    const newTopic = await store.saveBatchSyllabusTopic({
                      batch_course_id: selectedBatchCourseId,
                      topic_no: newTopicForm.topic_no,
                      topic_name: newTopicForm.topic_name.trim(),
                      planned_hours: 0,
                      is_completed: false,
                    });
                    if (activeTab === 'trainer_log') {
                      setTrainerLogTopics(prev => [...prev, newTopic.id]);
                    }
                    setShowAddTopicModal(false);
                    setRefreshTrigger(r => r + 1);
                    toast.success('Topic added!');
                  } catch (err: any) {
                    console.error(err);
                    toast.error('Failed to add topic', {
                      description: err.message || 'Unknown database error',
                    });
                  }
                }}
                className="bg-primary text-primary-foreground"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Topic
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* MODAL: EDIT BATCH DETAILS */}

      {showEditBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading">Edit Batch ({batch.code})</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowEditBatchModal(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="font-medium text-muted-foreground">Batch Name / Code</label>
                <Input
                  value={editBatchForm.code}
                  onChange={(e) => setEditBatchForm({ ...editBatchForm, code: e.target.value })}
                  placeholder="MIM-BBA-2026-29"
                  className="mt-1 font-sans text-sm font-semibold"
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground">Academic Year / Course Duration</label>
                <Input
                  value={editBatchForm.academic_year}
                  onChange={(e) => setEditBatchForm({ ...editBatchForm, academic_year: e.target.value })}
                  placeholder="2026-29"
                  className="mt-1 font-sans text-sm font-semibold"
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground">Current Semester</label>
                <select
                  value={editBatchForm.current_semester}
                  onChange={(e) => setEditBatchForm({ ...editBatchForm, current_semester: Number(e.target.value) })}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm font-sans font-semibold text-foreground focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-muted-foreground">Batch Status</label>
                <select
                  value={editBatchForm.status}
                  onChange={(e) => setEditBatchForm({ ...editBatchForm, status: e.target.value as any })}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm font-sans font-semibold text-foreground focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-muted-foreground">College Coordinator</label>
                <select
                  value={editBatchForm.college_coordinator_id}
                  onChange={(e) => setEditBatchForm({ ...editBatchForm, college_coordinator_id: e.target.value })}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm font-sans text-foreground focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {store.profiles.filter(p => p.role === 'college_coordinator').map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-muted-foreground">Student Coordinator</label>
                <select
                  value={editBatchForm.student_coordinator_id}
                  onChange={(e) => setEditBatchForm({ ...editBatchForm, student_coordinator_id: e.target.value })}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm font-sans text-foreground focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {store.profiles.filter(p => p.role === 'student_coordinator').map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-muted-foreground">Start Date</label>
                  <Input
                    type="date"
                    value={editBatchForm.start_date}
                    onChange={(e) => setEditBatchForm({ ...editBatchForm, start_date: e.target.value })}
                    className="mt-1 font-sans"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">End Date</label>
                  <Input
                    type="date"
                    value={editBatchForm.end_date}
                    onChange={(e) => setEditBatchForm({ ...editBatchForm, end_date: e.target.value })}
                    className="mt-1 font-sans"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setShowEditBatchModal(false)}>Cancel</Button>
              <Button onClick={handleSaveBatchEdit} className="bg-primary text-primary-foreground">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT STUDENT DETAILS */}
      {showEditStudentModal && editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading">Edit Student Details</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowEditStudentModal(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Register Number</label>
                <Input
                  value={studentEditForm.register_no}
                  onChange={(e) => setStudentEditForm({ ...studentEditForm, register_no: e.target.value })}
                  className="mt-1 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Student Name</label>
                <Input
                  value={studentEditForm.name}
                  onChange={(e) => setStudentEditForm({ ...studentEditForm, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Class / Division</label>
                <Input
                  value={studentEditForm.class}
                  onChange={(e) => setStudentEditForm({ ...studentEditForm, class: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Phone Number</label>
                <Input
                  value={studentEditForm.phone}
                  onChange={(e) => setStudentEditForm({ ...studentEditForm, phone: e.target.value })}
                  className="mt-1 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setShowEditStudentModal(false)}>Cancel</Button>
              <Button onClick={handleSaveEditStudent} className="bg-primary text-primary-foreground">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {showEditTrainerLogModal && editingTrainerLog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="flex items-center gap-2">
                {editTrainerLogForm.log_type === 'missed' ? (
                  <>
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-lg font-bold font-heading">Edit Missed Session</h3>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold font-heading">Edit Trainer Log Session</h3>
                  </>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setShowEditTrainerLogModal(false); setEditingTrainerLog(null); }} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {editTrainerLogForm.log_type === 'missed' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground">Date of Missed Session <span className="text-destructive">*</span></label>
                    <Input
                      type="date"
                      value={editTrainerLogForm.log_date}
                      onChange={e => setEditTrainerLogForm({ ...editTrainerLogForm, log_date: e.target.value })}
                      className="mt-1 font-mono text-sm"
                    />
                  </div>

                  {/* Trainer */}
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground">Trainer</label>
                    <select
                      value={editTrainerLogForm.trainer_id}
                      onChange={e => setEditTrainerLogForm({ ...editTrainerLogForm, trainer_id: e.target.value })}
                      className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select Trainer</option>
                      {store.profiles.filter(p => p.role === 'trainer' || p.role === 'admin').map(p => (
                        <option key={p.id} value={p.id}>{p.full_name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Missed Hours */}
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground">Hours Missed <span className="text-destructive">*</span></label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="12"
                      value={editTrainerLogForm.missed_hours}
                      onChange={e => setEditTrainerLogForm({ ...editTrainerLogForm, missed_hours: Number(e.target.value) })}
                      className="mt-1 font-mono text-sm font-bold text-amber-600 dark:text-amber-400"
                    />
                  </div>

                  {/* Reason Category */}
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground">Reason Category <span className="text-destructive">*</span></label>
                    <select
                      value={editTrainerLogForm.missed_reason}
                      onChange={e => setEditTrainerLogForm({ ...editTrainerLogForm, missed_reason: e.target.value as MissedReason })}
                      className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    >
                      <option value="trainer_leave">👨‍🏫 Trainer on Leave</option>
                      <option value="college_program">🏫 College Program / Event</option>
                      <option value="natural_calamity">🌧️ Natural Calamity / Weather Alert</option>
                      <option value="other">⚙️ Other / Institutional</option>
                    </select>
                  </div>
                </div>

                {/* Specific Notes */}
                <div>
                  <label className="text-xs font-mono font-medium text-muted-foreground">Reason Remarks / Specific Details</label>
                  <textarea
                    value={editTrainerLogForm.notes}
                    onChange={e => setEditTrainerLogForm({ ...editTrainerLogForm, notes: e.target.value })}
                    placeholder="e.g. Annual sports meet held by college, Trainer sick leave, Red alert rainfall..."
                    rows={3}
                    className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground">Date <span className="text-destructive">*</span></label>
                    <Input
                      type="date"
                      value={editTrainerLogForm.log_date}
                      onChange={e => setEditTrainerLogForm({ ...editTrainerLogForm, log_date: e.target.value })}
                      className="mt-1 font-mono text-sm"
                    />
                  </div>

                  {/* Trainer */}
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground">Trainer</label>
                    <select
                      value={editTrainerLogForm.trainer_id}
                      onChange={e => setEditTrainerLogForm({ ...editTrainerLogForm, trainer_id: e.target.value })}
                      className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select Trainer</option>
                      {store.profiles.filter(p => p.role === 'trainer' || p.role === 'admin').map(p => (
                        <option key={p.id} value={p.id}>{p.full_name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground">Start Time <span className="text-destructive">*</span></label>
                    <Input
                      type="time"
                      value={editTrainerLogForm.start_time}
                      onChange={e => setEditTrainerLogForm({ ...editTrainerLogForm, start_time: e.target.value })}
                      className="mt-1 font-mono text-sm"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground">End Time <span className="text-destructive">*</span></label>
                    <Input
                      type="time"
                      value={editTrainerLogForm.end_time}
                      onChange={e => setEditTrainerLogForm({ ...editTrainerLogForm, end_time: e.target.value })}
                      className="mt-1 font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-mono font-medium text-muted-foreground">Notes (optional)</label>
                  <textarea
                    value={editTrainerLogForm.notes}
                    onChange={e => setEditTrainerLogForm({ ...editTrainerLogForm, notes: e.target.value })}
                    placeholder="Any remarks, observations, or session notes..."
                    rows={2}
                    className="w-full mt-1 bg-background border border-border rounded-xl p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                {/* Syllabus Topics Checklist */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-mono font-medium text-muted-foreground">
                      Topics Covered in this Session
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                        onClick={() => {
                          const nextNo = currentSyllabus.length > 0 ? Math.max(...currentSyllabus.map(s => s.topic_no)) + 1 : 1;
                          setNewTopicForm({ topic_no: nextNo, topic_name: '' });
                          setShowAddTopicModal(true);
                        }}
                      >
                        <Plus className="h-3 w-3" /> Add Custom Topic
                      </button>
                      {displayedEditTopics.length > 0 && (
                        <button
                          type="button"
                          className="text-xs font-mono text-primary hover:underline"
                          onClick={() => setEditTrainerLogTopics(
                            editTrainerLogTopics.length === displayedEditTopics.length
                              ? []
                              : displayedEditTopics.map(t => t.id)
                          )}
                        >
                          {editTrainerLogTopics.length === displayedEditTopics.length ? 'Deselect All' : 'Select All'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-2 max-w-md">
                    <Input
                      type="text"
                      value={editTrainerLogSearch}
                      onChange={e => setEditTrainerLogSearch(e.target.value)}
                      placeholder="Search topics..."
                      className="text-xs h-9 rounded-xl bg-background border border-border"
                    />
                  </div>

                  {currentSyllabus.length === 0 ? (
                    <p className="text-xs text-muted-foreground font-mono italic">No syllabus topics defined for this course.</p>
                  ) : displayedEditTopics.length === 0 ? (
                    <p className="text-xs text-muted-foreground font-mono italic">No matching syllabus topics found.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                      {displayedEditTopics.map(topic => {
                        const isChecked = editTrainerLogTopics.includes(topic.id);
                        return (
                          <div
                            key={topic.id}
                            onClick={() => setEditTrainerLogTopics(prev =>
                              isChecked ? prev.filter(id => id !== topic.id) : [...prev, topic.id]
                            )}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${isChecked
                                ? 'bg-primary/10 border-primary/40 text-foreground'
                                : 'bg-sunken border-border/80 text-muted-foreground hover:border-primary/30'
                              }`}
                          >
                            <div className={`flex-shrink-0 h-5 w-5 rounded-md flex items-center justify-center border ${isChecked ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background'
                              }`}>
                              {isChecked && <Check className="h-3 w-3" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-muted-foreground">{topic.topic_no}.</span>
                                {topic.is_completed && !isChecked && (
                                  <span className="text-[9px] font-mono font-bold bg-success/20 text-success px-1.5 py-0.2 rounded">
                                    Completed in other session
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-medium text-foreground leading-tight truncate">{topic.topic_name}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => { setShowEditTrainerLogModal(false); setEditingTrainerLog(null); }}>Cancel</Button>
              <Button onClick={handleSaveEditTrainerLog} className="bg-primary text-primary-foreground">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
