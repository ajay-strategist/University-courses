import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
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
  AlertTriangle, Check, X, FileSpreadsheet, Send
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function BatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const batch = store.getBatchWithDetails(id || '');

  const [activeTab, setActiveTab] = useState<
    'students' | 'courses' | 'attendance' | 'marks' | 'assessment_types' | 'syllabus' | 'coverage'
  >('students');

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

  // Add Batch Course Inputs
  const [newCourseId, setNewCourseId] = useState(store.courses[0]?.id || '');
  const [newTrainerId, setNewTrainerId] = useState(store.profiles.find(p => p.role === 'trainer')?.id || '');
  const [newPlannedHours, setNewPlannedHours] = useState(30);

  // Attendance Register State
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceHour, setAttendanceHour] = useState(1);
  const [registerStatusMap, setRegisterStatusMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [attendanceViewMode, setAttendanceViewMode] = useState<'register' | 'matrix'>('register');

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

  // Absentee Email Preview
  const [absenteePreview, setAbsenteePreview] = useState<AbsenteePreview | null>(null);

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
  const handleAddStudent = () => {
    if (!studentForm.register_no || !studentForm.name) {
      toast.error('Register Number and Name are required');
      return;
    }
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      batch_id: batch.id,
      register_no: studentForm.register_no,
      name: studentForm.name,
      class: studentForm.class,
      phone: studentForm.phone,
    };
    store.students.push(newStudent);
    setStudents(store.students.filter(s => s.batch_id === batch.id));
    setShowAddStudentModal(false);
    setStudentForm({ register_no: '', name: '', class: 'Div A', phone: '' });
    toast.success(`Student ${newStudent.name} added`);
  };

  const handleStudentCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'binary' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(sheet);
        let added = 0;
        rows.forEach((r, idx) => {
          const regNo = r.register_no || r['Register No'] || r.reg_no;
          const name = r.name || r['Student Name'] || r.Name;
          if (regNo && name) {
            store.students.push({
              id: `stu-imp-${Date.now()}-${idx}`,
              batch_id: batch.id,
              register_no: String(regNo),
              name: String(name),
              class: r.class || r['Class'] || 'Div A',
              phone: String(r.phone || ''),
            });
            added++;
          }
        });
        setStudents(store.students.filter(s => s.batch_id === batch.id));
        toast.success(`Successfully imported ${added} students!`);
      } catch (err) {
        toast.error('Failed to parse CSV/Excel file');
      }
    };
    reader.readAsBinaryString(file);
  };

  // -------------------------------------------------------------------------------------
  // 7.2 COURSES ALLOCATION WORKFLOW
  // -------------------------------------------------------------------------------------
  const handleAddBatchCourse = () => {
    const targetCourse = store.courses.find(c => c.id === newCourseId);
    if (!targetCourse) return;

    const newBC: BatchCourse = {
      id: `bc-${Date.now()}`,
      batch_id: batch.id,
      course_id: newCourseId,
      trainer_id: newTrainerId,
      semester: batch.current_semester,
      planned_hours: newPlannedHours,
      start_date: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    store.batchCourses.push(newBC);

    // Auto-seed syllabus from default course syllabus!
    const defaults = store.defaultSyllabus.filter(s => s.course_id === newCourseId);
    defaults.forEach((def, idx) => {
      store.batchSyllabus.push({
        id: `bcs-${Date.now()}-${idx}`,
        batch_course_id: newBC.id,
        topic_no: def.topic_no,
        topic_name: def.topic_name,
        planned_hours: def.planned_hours,
        is_completed: false,
      });
    });

    setBatchCourses(store.batchCourses.filter(bc => bc.batch_id === batch.id));
    setSelectedBatchCourseId(newBC.id);
    setShowAddCourseModal(false);
    toast.success(`Course ${targetCourse.name} added to batch with auto-seeded syllabus!`);
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

  const handleGenerateAbsenteeList = () => {
    const session = store.sessions.find(
      s => s.batch_course_id === selectedBatchCourseId && s.session_date === attendanceDate
    );
    
    // Find absentees
    const absenteesList: AbsenteePreview['absentees'] = [];
    students.forEach((stu) => {
      const st = registerStatusMap[stu.id] || 'present';
      if (st === 'absent') {
        absenteesList.push({
          register_no: stu.register_no,
          name: stu.name,
          class: stu.class,
          hours_absent: [attendanceHour],
        });
      }
    });

    const trainer = store.profiles.find(p => p.id === store.batchCourses.find(bc => bc.id === selectedBatchCourseId)?.trainer_id);
    const recipientName = batch.college_coordinator?.full_name || 'Dr. Aris Thorne';
    const recipientEmail = batch.college_coordinator?.email || 'coordinator.mim@university.edu';

    setAbsenteePreview({
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      sender_email: trainer?.email || 'trainer.excel@gmail.com',
      session_date: attendanceDate,
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
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'attendance' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <CalendarCheck className="h-3.5 w-3.5" /> 7.3 Attendance
        </button>
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
      </div>

      {/* TAB 7.1: STUDENTS */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-semibold font-heading">Student Roster</h2>
            <div className="flex items-center gap-2">
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
                  <th className="p-4">Register No</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Class (Division)</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 text-center">Derived Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((stu) => {
                  const attPct = store.getStudentAttendancePct(stu.id);
                  return (
                    <tr key={stu.id} className="hover:bg-muted/30 transition-colors">
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
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-success/15 text-success font-bold">
                      {bc.status}
                    </span>
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
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono font-medium text-muted-foreground">Session Date:</label>
              <Input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-40 h-9 text-xs font-mono"
              />
              <label className="text-xs font-mono font-medium text-muted-foreground ml-2">Hour No:</label>
              <Input
                type="number"
                min="1"
                max="8"
                value={attendanceHour}
                onChange={(e) => setAttendanceHour(Number(e.target.value))}
                className="w-20 h-9 text-xs font-mono"
              />
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
                <Download className="h-3.5 w-3.5 mr-1" /> Download .xlsx Template
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
                      <td className="p-3 text-center font-mono font-bold text-primary">{markVal}</td>
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
            <Button size="sm" onClick={() => setShowAddTopicModal(true)} className="bg-primary text-primary-foreground">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Custom Topic
            </Button>
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
                  onClick={() => {
                    topic.is_completed = !topic.is_completed;
                    topic.completed_date = topic.is_completed ? new Date().toISOString().split('T')[0] : undefined;
                    // Trigger reactivity
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
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
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

              <div className="border border-border rounded-xl p-3 space-y-2">
                <div className="font-sans font-bold text-foreground">Absent Students List ({absenteePreview.absentees.length}):</div>
                {absenteePreview.absentees.length === 0 ? (
                  <div className="text-success">No absentees reported for this session!</div>
                ) : (
                  absenteePreview.absentees.map((a, idx) => (
                    <div key={idx} className="flex justify-between items-center text-destructive">
                      <span>{a.register_no} - {a.name} ({a.class})</span>
                      <span>Hour {a.hours_absent.join(', ')}</span>
                    </div>
                  ))
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
                <select value={newCourseId} onChange={(e) => setNewCourseId(e.target.value)} className="w-full mt-1 bg-background border border-border rounded-xl p-2 text-sm">
                  {store.courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Assigned Trainer</label>
                <select value={newTrainerId} onChange={(e) => setNewTrainerId(e.target.value)} className="w-full mt-1 bg-background border border-border rounded-xl p-2 text-sm">
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
    </div>
  );
}
