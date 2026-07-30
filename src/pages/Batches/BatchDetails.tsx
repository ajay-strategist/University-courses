import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import type { 
  Student, BatchCourse, BatchCourseSyllabus, Session, Attendance, 
  Assessment, AssessmentMark, Course, AbsenteePreview 
} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  ArrowLeft, Users, BookOpen, CalendarCheck, Award, FileCheck2, 
  CheckSquare, Plus, Download, Upload, Mail, CheckCircle2, Clock, 
  AlertTriangle, Check, X, FileSpreadsheet, Send, Edit2, Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function BatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const batch = store.getBatchWithDetails(id || '');

  const { profile } = useAuth();
  const isStudentCoordinator = profile?.role === 'student_coordinator';

  const [activeTab, setActiveTab] = useState<
    'students' | 'courses' | 'attendance' | 'marks' | 'assessment_types' | 'syllabus' | 'coverage'
  >(isStudentCoordinator ? 'attendance' : 'students');

  // Local reactive states for this batch
  const [students, setStudents] = useState<Student[]>(
    store.students.filter(s => s.batch_id === id)
  );
  const [batchCourses, setBatchCourses] = useState<BatchCourse[]>(
    store.batchCourses.filter(bc => bc.batch_id === id)
  );
  const [selectedBatchCourseId, setSelectedBatchCourseId] = useState<string>(
    batchCourses[0]?.id || ''
  );

  // Modals & Dialogs
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddAssessmentModal, setShowAddAssessmentModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showAbsenteeModal, setShowAbsenteeModal] = useState(false);

  // Student Form Inputs
  const [studentForm, setStudentForm] = useState({ register_no: '', name: '', class: 'Div A', phone: '' });

  // Selected Student IDs for bulk delete
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Edit Allocated Course Modal State
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingBatchCourse, setEditingBatchCourse] = useState<BatchCourse | null>(null);
  const [editCourseTrainerId, setEditCourseTrainerId] = useState('');
  const [editCoursePlannedHours, setEditCoursePlannedHours] = useState(30);
  const [editCourseStatus, setEditCourseStatus] = useState<string>('Active');

  // Add Batch Course Inputs
  const [newCourseId, setNewCourseId] = useState(store.courses[0]?.id || '');
  const [newTrainerId, setNewTrainerId] = useState(store.profiles.find(p => p.role === 'trainer')?.id || '');
  const [newPlannedHours, setNewPlannedHours] = useState(30);

  // Attendance Register State
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceHour, setAttendanceHour] = useState(1);
  const [registerStatusMap, setRegisterStatusMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [attendanceViewMode, setAttendanceViewMode] = useState<'register' | 'matrix'>('register');
  const [attendanceReportMode, setAttendanceReportMode] = useState<'single' | 'range'>('single');
  const [attendanceStartDate, setAttendanceStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceEndDate, setAttendanceEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Marks State
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    store.assessments.filter(a => a.batch_course_id === selectedBatchCourseId)[0]?.id || ''
  );
  const [marksState, setMarksState] = useState<Record<string, number>>({});
  const [marksImportPreview, setMarksImportPreview] = useState<{
    validRows: { student_id: string; register_no: string; name: string; mark: number }[];
    errorRows: { register_no: string; name: string; mark: number; error: string }[];
  } | null>(null);

  // Assessment Form Input
  const [assessmentForm, setAssessmentForm] = useState({ name: '', type_id: store.assessmentTypes[0]?.id || '', max_mark: 50 });

  // Absentee Email Preview Modal State
  const [absenteePreview, setAbsenteePreview] = useState<AbsenteePreview | null>(null);

  // Edit Batch Modal State
  const [showEditBatchModal, setShowEditBatchModal] = useState(false);
  const [editBatchForm, setEditBatchForm] = useState({
    current_semester: batch?.current_semester || 1,
    status: batch?.status || 'Active',
    college_coordinator_id: batch?.college_coordinator_id || '',
    student_coordinator_id: batch?.student_coordinator_id || '',
    start_date: batch?.start_date || '',
    end_date: batch?.end_date || '',
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

  const handleSaveEditStudent = () => {
    if (!editingStudent) return;
    if (!studentEditForm.register_no || !studentEditForm.name || !studentEditForm.class) {
      toast.error('Register number, name, and class are required');
      return;
    }
    const idx = store.students.findIndex(s => s.id === editingStudent.id);
    if (idx !== -1) {
      store.students[idx] = {
        ...store.students[idx],
        register_no: studentEditForm.register_no,
        name: studentEditForm.name,
        class: studentEditForm.class,
        phone: studentEditForm.phone,
      };
      setStudents(store.students.filter(s => s.batch_id === id));
      setShowEditStudentModal(false);
      toast.success('Student details updated successfully!');
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

  const handleSaveBatchEdit = () => {
    if (!batch) return;
    const targetBatch = store.batches.find(b => b.id === batch.id);
    if (targetBatch) {
      targetBatch.current_semester = Number(editBatchForm.current_semester);
      targetBatch.status = editBatchForm.status as 'Active' | 'Completed';
      targetBatch.college_coordinator_id = editBatchForm.college_coordinator_id;
      targetBatch.student_coordinator_id = editBatchForm.student_coordinator_id;
      targetBatch.start_date = editBatchForm.start_date;
      targetBatch.end_date = editBatchForm.end_date;
    }
    setShowEditBatchModal(false);
    toast.success(`Batch ${batch.code} updated successfully!`);
  };

  const handleUpdateSingleMark = (studentId: string, valStr: string) => {
    const curAsm = store.assessments.find(a => a.id === selectedAssessmentId);
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

    const idx = store.assessmentMarks.findIndex(m => m.assessment_id === curAsm.id && m.student_id === studentId);
    if (idx >= 0) {
      store.assessmentMarks[idx].mark = num;
    } else {
      store.assessmentMarks.push({
        id: `mk-${Date.now()}-${studentId}`,
        assessment_id: curAsm.id,
        student_id: studentId,
        mark: num,
      });
    }
    setMarksState(prev => ({ ...prev, [studentId]: num }));
    toast.success('Mark saved');
  };

  if (!batch) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Batch Not Found</h2>
        <Button onClick={() => navigate('/batches')}>Return to Batches</Button>
      </div>
    );
  }

  const activeCourse = store.courses.find(c => c.id === store.batchCourses.find(bc => bc.id === selectedBatchCourseId)?.course_id);

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
        const wb = XLSX.read(evt.target?.result, { type: 'binary' });
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
    reader.readAsBinaryString(file);
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
      semester: batch.current_semester,
      planned_hours: newPlannedHours,
      start_date: new Date().toISOString().split('T')[0],
      status: 'Active',
    });

    setBatchCourses(store.batchCourses.filter(bc => bc.batch_id === batch.id));
    setSelectedBatchCourseId(newBC.id);
    setShowAddCourseModal(false);
    toast.success(`Course ${targetCourse.name} added to batch with auto-seeded syllabus!`);
  };

  const handleOpenEditBatchCourse = (bc: BatchCourse) => {
    setEditingBatchCourse(bc);
    setEditCourseTrainerId(bc.trainer_id || '');
    setEditCoursePlannedHours(bc.planned_hours || 30);
    setEditCourseStatus(bc.status || 'Active');
    setShowEditCourseModal(true);
  };

  const handleSaveEditBatchCourse = async () => {
    if (!editingBatchCourse) return;

    await store.saveBatchCourse({
      ...editingBatchCourse,
      trainer_id: editCourseTrainerId || undefined,
      planned_hours: Number(editCoursePlannedHours),
      status: editCourseStatus,
    });

    setBatchCourses(store.batchCourses.filter(bc => bc.batch_id === batch.id));
    setShowEditCourseModal(false);
    toast.success('Course allocation updated successfully!');
  };

  const handleDeleteBatchCourse = async (bcId: string, courseName: string) => {
    if (confirm(`Are you sure you want to delete the course "${courseName}" from this batch? This will permanently delete all attendance registers and marks associated with this course.`)) {
      await store.deleteBatchCourse(bcId);
      setBatchCourses(store.batchCourses.filter(bc => bc.batch_id === batch.id));
      const remaining = store.batchCourses.filter(bc => bc.batch_id === batch.id);
      if (selectedBatchCourseId === bcId) {
        setSelectedBatchCourseId(remaining[0]?.id || '');
      }
      toast.success(`Course ${courseName} removed from batch successfully`);
    }
  };

  // -------------------------------------------------------------------------------------
  // 7.3 ATTENDANCE REGISTER & MATRIX WORKFLOW
  // -------------------------------------------------------------------------------------
  const handleSaveAttendanceRegister = () => {
    if (!selectedBatchCourseId) return;

    // Find or create session
    let session = store.sessions.find(
      s => s.batch_course_id === selectedBatchCourseId && s.session_date === attendanceDate && s.hour_no === attendanceHour
    );
    if (!session) {
      session = {
        id: `ses-${Date.now()}`,
        batch_course_id: selectedBatchCourseId,
        session_date: attendanceDate,
        hour_no: attendanceHour,
      };
      store.sessions.push(session);
    }

    // Save attendance for every student in batch
    students.forEach((stu) => {
      const status = registerStatusMap[stu.id] || 'present';
      const existingIdx = store.attendance.findIndex(a => a.session_id === session!.id && a.student_id === stu.id);
      if (existingIdx >= 0) {
        store.attendance[existingIdx].status = status;
      } else {
        store.attendance.push({
          id: `att-${Date.now()}-${stu.id}`,
          session_id: session!.id,
          student_id: stu.id,
          status,
        });
      }
    });

    toast.success(`Attendance saved for ${attendanceDate} (Hour ${attendanceHour})!`);
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

      const trainer = store.profiles.find(p => p.id === store.batchCourses.find(bc => bc.id === selectedBatchCourseId)?.trainer_id);
      const recipientName = batch.college_coordinator?.full_name || batch.college?.contact_person || 'College Coordinator';
      const recipientEmail = batch.college_coordinator?.email || batch.college?.contact_email || '';

      setAbsenteePreview({
        recipient_name: recipientName,
        recipient_email: recipientEmail,
        sender_email: trainer?.email || 'trainer.excel@gmail.com',
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

    const trainer = store.profiles.find(p => p.id === store.batchCourses.find(bc => bc.id === selectedBatchCourseId)?.trainer_id);
    const recipientName = batch.college_coordinator?.full_name || batch.college?.contact_person || 'College Coordinator';
    const recipientEmail = batch.college_coordinator?.email || batch.college?.contact_email || '';

    setAbsenteePreview({
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      sender_email: trainer?.email || 'trainer.excel@gmail.com',
      session_date: titleDate,
      batch_code: batch.code,
      course_name: activeCourse?.name || 'Excel',
      absentees: absenteesList,
    });
    setShowAbsenteeModal(true);
  };

  const handleConfirmSendAbsenteeEmail = () => {
    if (!absenteePreview) return;
    store.notificationLogs.push({
      id: `log-${Date.now()}`,
      batch_course_id: selectedBatchCourseId,
      session_date: absenteePreview.session_date,
      sender_id: store.profiles[0].id,
      recipient_email: absenteePreview.recipient_email,
      absentee_count: absenteePreview.absentees.length,
      status: 'sent',
      sent_at: new Date().toISOString(),
    });
    setShowAbsenteeModal(false);
    toast.success(`Absentee notification sent via SMTP to ${absenteePreview.recipient_email}!`);
  };

  // -------------------------------------------------------------------------------------
  // 7.4 MARKS & PRE-FILLED EXCEL TEMPLATE WORKFLOW
  // -------------------------------------------------------------------------------------
  const currentAssessment = store.assessments.find(a => a.id === selectedAssessmentId);
  const currentAssessmentMarks = store.assessmentMarks.filter(m => m.assessment_id === selectedAssessmentId);

  const handleDownloadMarksTemplate = () => {
    if (!currentAssessment) {
      toast.error('Please select or create an assessment first');
      return;
    }
    const excelData = students.map(stu => ({
      'Register Number': stu.register_no,
      'Name': stu.name,
      'Mark': '',
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Marks Roster');
    XLSX.writeFile(wb, `${batch.code}_${activeCourse?.code || 'Tool'}_${currentAssessment.name.replace(/\s+/g, '_')}_Template.xlsx`);
    toast.success('Downloaded 3-column Excel template (Register Number, Name, Mark)!');
  };

  const handleUploadMarksFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentAssessment) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'binary' });
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
          } else if (markVal > currentAssessment.max_mark) {
            errorRows.push({ 
              register_no: student.register_no, 
              name: student.name, 
              mark: markVal, 
              error: `Mark (${markVal}) exceeds assessment max mark limit of ${currentAssessment.max_mark}` 
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
    reader.readAsBinaryString(file);
  };

  const handleCommitMarksImport = () => {
    if (!marksImportPreview || !currentAssessment) return;

    marksImportPreview.validRows.forEach(row => {
      const idx = store.assessmentMarks.findIndex(m => m.assessment_id === currentAssessment.id && m.student_id === row.student_id);
      if (idx >= 0) {
        store.assessmentMarks[idx].mark = row.mark;
      } else {
        store.assessmentMarks.push({
          id: `mk-${Date.now()}-${row.student_id}`,
          assessment_id: currentAssessment.id,
          student_id: row.student_id,
          mark: row.mark,
        });
      }
    });

    setMarksImportPreview(null);
    toast.success(`Successfully committed marks for ${marksImportPreview.validRows.length} students!`);
  };

  // -------------------------------------------------------------------------------------
  // DATA EXPORT HANDLERS (EXCEL / CSV DOWNLOAD)
  // -------------------------------------------------------------------------------------
  const handleExportStudents = () => {
    if (!batch || students.length === 0) {
      toast.error('No student data available to export');
      return;
    }
    const data = students.map(s => ({
      'Register Number': s.register_no,
      'Name': s.name,
      'Class': s.class,
      'Phone': s.phone || '',
    }));
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
      'Planned Hours': s.planned_hours,
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
  const currentSyllabus = store.batchSyllabus.filter(s => s.batch_course_id === selectedBatchCourseId);
  const totalTopics = currentSyllabus.length;
  const completedTopics = currentSyllabus.filter(s => s.is_completed).length;
  const coveragePct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  
  const plannedHours = store.batchCourses.find(bc => bc.id === selectedBatchCourseId)?.planned_hours || 30;
  const deliveredHours = currentSyllabus.filter(s => s.is_completed).reduce((sum, s) => sum + s.planned_hours, 0);
  const remainingHours = Math.max(0, plannedHours - deliveredHours);

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

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-xl shrink-0" onClick={() => navigate('/batches')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>

            {/* College Logo */}
            {batch.college?.logo_url ? (
              <img 
                src={batch.college.logo_url} 
                alt={batch.college.name} 
                className="h-12 w-12 rounded-xl object-cover border border-border bg-background shadow-xs shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold font-mono text-sm text-primary shrink-0">
                {batch.college?.code}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight">{batch.code}</h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-accent/15 text-accent font-bold">
                  Sem {batch.current_semester}
                </span>
                {!isStudentCoordinator && (
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setEditBatchForm({
                          current_semester: batch.current_semester,
                          status: batch.status,
                          college_coordinator_id: batch.college_coordinator_id || '',
                          student_coordinator_id: batch.student_coordinator_id || '',
                          start_date: batch.start_date || '',
                          end_date: batch.end_date || '',
                        });
                        setShowEditBatchModal(true);
                      }} 
                      className="h-7 text-xs rounded-xl ml-1"
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
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className="font-semibold text-foreground">{batch.college?.name}</span> · {batch.program?.name} ({batch.academic_year})
              </p>
            </div>
          </div>

          {/* Course Filter Dropdown */}
          {batchCourses.length > 0 && (
            <div className="flex items-center gap-2 bg-sunken p-2 rounded-xl border border-border/80">
              <span className="text-xs font-mono text-muted-foreground uppercase font-medium px-1">Active Tool Course:</span>
              <select
                value={selectedBatchCourseId}
                onChange={(e) => setSelectedBatchCourseId(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-semibold text-primary focus:outline-none"
              >
                {batchCourses.map((bc) => {
                  const c = store.courses.find(crs => crs.id === bc.course_id);
                  return <option key={bc.id} value={bc.id}>{c?.name} ({c?.code})</option>;
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 7 Workspace Tabs */}
      <div className="flex border-b border-border bg-card rounded-2xl p-1 gap-1 overflow-x-auto">
        {!isStudentCoordinator && (
          <>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'students' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="h-3.5 w-3.5" /> 7.1 Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'courses' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" /> 7.2 Courses ({batchCourses.length})
            </button>
          </>
        )}
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'attendance' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <CalendarCheck className="h-3.5 w-3.5" /> 7.3 Attendance Register & Matrix
        </button>
        {!isStudentCoordinator && (
          <>
            <button
              onClick={() => setActiveTab('marks')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'marks' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Award className="h-3.5 w-3.5" /> 7.4 Marks & Excel Import
            </button>
            <button
              onClick={() => setActiveTab('assessment_types')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'assessment_types' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCheck2 className="h-3.5 w-3.5" /> 7.5 Assessment Types
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'syllabus' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5" /> 7.6 Syllabus
            </button>
            <button
              onClick={() => setActiveTab('coverage')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'coverage' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> 7.7 Course Coverage ({coveragePct}%)
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
                  <th className="p-4 text-center">Derived Attendance %</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((stu) => {
                  const attPct = store.getStudentAttendancePct(stu.id);
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
                        <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full ${
                          attPct >= 85 ? 'bg-success/15 text-success' : attPct >= 75 ? 'bg-warning/15 text-warning' : 'bg-destructive/15 text-destructive'
                        }`}>
                          {attPct}%
                        </span>
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

      {/* TAB 7.2: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold font-heading">Allocated Tool Courses</h2>
            <Button size="sm" onClick={() => setShowAddCourseModal(true)} className="bg-primary text-primary-foreground">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Course to Batch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batchCourses.map((bc) => {
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

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-sunken p-3 rounded-xl">
                    <div>Trainer: <span className="text-foreground font-bold">{trainer?.full_name || 'Unassigned'}</span></div>
                    <div>Planned: <span className="text-foreground font-bold">{bc.planned_hours} hrs</span></div>
                    <div>Coverage: <span className="text-primary font-bold">{covPct}%</span></div>
                    <div>Topics: <span className="text-foreground font-bold">{completed}/{syllabus.length}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7.3: ATTENDANCE */}
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((stu) => {
                    const status = registerStatusMap[stu.id] || 'present';
                    return (
                      <tr key={stu.id} className="hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-accent">{stu.register_no}</td>
                        <td className="p-3 font-medium text-foreground">{stu.name}</td>
                        <td className="p-3 text-muted-foreground font-mono text-xs">{stu.class}</td>
                        <td className="p-3 text-center">
                          <div className="inline-flex rounded-xl bg-sunken p-1 border border-border gap-1">
                            <button
                              onClick={() => setRegisterStatusMap({ ...registerStatusMap, [stu.id]: 'present' })}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                status === 'present' ? 'bg-success text-white' : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => setRegisterStatusMap({ ...registerStatusMap, [stu.id]: 'absent' })}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                status === 'absent' ? 'bg-destructive text-white' : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => setRegisterStatusMap({ ...registerStatusMap, [stu.id]: 'late' })}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                status === 'late' ? 'bg-warning text-white' : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              Late
                            </button>
                          </div>
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
                    {store.sessions.filter(s => s.batch_course_id === selectedBatchCourseId).map(s => (
                      <th key={s.id} className="p-2 text-center">{s.session_date} (H{s.hour_no})</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map(stu => (
                    <tr key={stu.id}>
                      <td className="p-2 font-bold text-accent">{stu.register_no}</td>
                      <td className="p-2 font-sans font-medium text-foreground">{stu.name}</td>
                      {store.sessions.filter(s => s.batch_course_id === selectedBatchCourseId).map(s => {
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

      {/* TAB 7.4: ASSIGNMENT / EXAM MARKS */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono font-medium text-muted-foreground">Select Assessment:</label>
              <select
                value={selectedAssessmentId}
                onChange={(e) => setSelectedAssessmentId(e.target.value)}
                className="bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
              >
                {store.assessments.filter(a => a.batch_course_id === selectedBatchCourseId).map(a => (
                  <option key={a.id} value={a.id}>{a.name} (Max Mark: {a.max_mark})</option>
                ))}
              </select>
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

      {/* TAB 7.5: ASSESSMENT TYPES */}
      {activeTab === 'assessment_types' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold font-heading">Batch Assessments</h2>
            <Button size="sm" onClick={() => setShowAddAssessmentModal(true)} className="bg-primary text-primary-foreground">
              <Plus className="h-3.5 w-3.5 mr-1" /> Create Assessment for Batch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {store.assessments.filter(a => a.batch_course_id === selectedBatchCourseId).map((asm) => (
              <div key={asm.id} className="card-meridian p-5 space-y-2">
                <h3 className="font-bold text-foreground font-heading">{asm.name}</h3>
                <div className="text-xs text-muted-foreground font-mono">
                  Max Mark: <span className="font-bold text-accent">{asm.max_mark}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7.6: SYLLABUS */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold font-heading">Batch Course Syllabus Topic List</h2>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleExportSyllabus} className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1" /> Export Syllabus (.xlsx)
              </Button>
              <Button size="sm" onClick={() => setShowAddTopicModal(true)} className="bg-primary text-primary-foreground">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Custom Topic
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
                <tr>
                  <th className="p-3 w-16 text-center">#</th>
                  <th className="p-3">Topic Title</th>
                  <th className="p-3 text-center">Planned Hours</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentSyllabus.map((topic) => (
                  <tr key={topic.id} className="hover:bg-muted/30">
                    <td className="p-3 text-center font-mono font-bold text-muted-foreground">{topic.topic_no}</td>
                    <td className="p-3 font-medium text-foreground">{topic.topic_name}</td>
                    <td className="p-3 text-center font-mono text-xs">{topic.planned_hours} hrs</td>
                    <td className="p-3 text-center">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                        topic.is_completed ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {topic.is_completed ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
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
              <div className="text-[11px] text-muted-foreground mt-0.5">Semester {batch.current_semester}</div>
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
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    topic.is_completed ? 'bg-primary-tint/50 border-primary/30 text-foreground' : 'bg-sunken border-border/80 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-md flex items-center justify-center border ${
                      topic.is_completed ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background'
                    }`}>
                      {topic.is_completed && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className="font-mono text-xs font-bold w-6">{topic.topic_no}.</span>
                    <span className="font-medium text-sm text-foreground">{topic.topic_name}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span>{topic.planned_hours} hrs</span>
                    {topic.completed_date && (
                      <span className="text-success font-bold">Done ({topic.completed_date})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABSENTEE EMAIL PREVIEW MODAL */}
      {showAbsenteeModal && absenteePreview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading text-foreground">Absentee Email Preview</h3>
              <span className="text-xs font-mono font-bold text-accent">Explicit Confirm</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-sunken p-3 rounded-xl space-y-1">
                <div>Recipient: <span className="font-bold text-foreground">{absenteePreview.recipient_name}</span> ({absenteePreview.recipient_email})</div>
                <div>Sender: <span className="font-bold text-foreground">{absenteePreview.sender_email}</span> (Trainer SMTP)</div>
                <div>Subject: <span className="font-bold text-primary">Absentee Report - {absenteePreview.batch_code} ({absenteePreview.course_name}) - {absenteePreview.session_date}</span></div>
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
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      isAbsent ? 'bg-destructive/15 text-destructive' : 'bg-success/15 text-success'
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
              <Button variant="outline" onClick={() => setShowAbsenteeModal(false)}>Cancel</Button>
              <Button onClick={handleConfirmSendAbsenteeEmail} className="bg-primary text-primary-foreground">
                <Send className="h-3.5 w-3.5 mr-1" /> Send Absentee Email Now
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

      {/* MODAL: ADD ASSESSMENT */}
      {showAddAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">Create Assessment for {activeCourse?.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Assessment Title</label>
                <Input value={assessmentForm.name} onChange={(e) => setAssessmentForm({ ...assessmentForm, name: e.target.value })} placeholder="Assignment 1 / Exam" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Assessment Type</label>
                <select value={assessmentForm.type_id} onChange={(e) => setAssessmentForm({ ...assessmentForm, type_id: e.target.value })} className="w-full mt-1 bg-background border border-border rounded-xl p-2 text-sm">
                  {store.assessmentTypes.map(at => <option key={at.id} value={at.id}>{at.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Max Mark (Specific to this Assessment)</label>
                <Input type="number" value={assessmentForm.max_mark} onChange={(e) => setAssessmentForm({ ...assessmentForm, max_mark: Number(e.target.value) })} className="mt-1 font-mono" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddAssessmentModal(false)}>Cancel</Button>
              <Button onClick={() => {
                if (!assessmentForm.name) return;
                const newAsm: Assessment = {
                  id: `asm-${Date.now()}`,
                  batch_course_id: selectedBatchCourseId,
                  name: assessmentForm.name,
                  type_id: assessmentForm.type_id,
                  max_mark: assessmentForm.max_mark,
                };
                store.assessments.push(newAsm);
                setSelectedAssessmentId(newAsm.id);
                setShowAddAssessmentModal(false);
                toast.success('Assessment created!');
              }} className="bg-primary text-primary-foreground">Create Assessment</Button>
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
    </div>
  );
}
