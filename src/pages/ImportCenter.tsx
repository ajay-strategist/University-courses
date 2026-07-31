import { useState, useEffect } from 'react';
import { store, generateUUID } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

export default function ImportCenter() {
  const navigate = useNavigate();
  const [importType, setImportType] = useState<'students' | 'attendance' | 'marks' | 'syllabus'>('students');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(store.batches[0]?.id || '');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('new');
  const [newAssessmentName, setNewAssessmentName] = useState<string>('');
  const [newAssessmentTypeId, setNewAssessmentTypeId] = useState<string>('');
  const [newAssessmentMaxMark, setNewAssessmentMaxMark] = useState<number>(100);
  
  const [previewData, setPreviewData] = useState<{
    validRows: any[];
    errorRows: any[];
  } | null>(null);

  const selectedBatch = store.batches.find(b => b.id === selectedBatchId);
  const batchStudents = store.students.filter(s => s.batch_id === selectedBatchId);

  const batchCourses = store.batchCourses.filter(bc => bc.batch_id === selectedBatchId);
  const coursesForBatch = batchCourses.map(bc => {
    const course = store.courses.find(c => c.id === bc.course_id);
    return {
      batchCourseId: bc.id,
      courseId: bc.course_id,
      code: course?.code || '',
      name: course?.name || '',
      semester: bc.semester
    };
  }).filter(c => c.courseId);

  const currentBatchCourse = store.batchCourses.find(
    bc => bc.batch_id === selectedBatchId && bc.course_id === selectedCourseId
  );

  const courseAssessments = currentBatchCourse
    ? store.assessments.filter(a => a.batch_course_id === currentBatchCourse.id)
    : [];

  useEffect(() => {
    if (coursesForBatch.length > 0) {
      setSelectedCourseId(coursesForBatch[0].courseId);
    } else {
      setSelectedCourseId('');
    }
    setPreviewData(null);
  }, [selectedBatchId]);

  useEffect(() => {
    if (courseAssessments.length > 0) {
      setSelectedAssessmentId(courseAssessments[0].id);
    } else {
      setSelectedAssessmentId('new');
    }
    setPreviewData(null);
  }, [selectedBatchId, selectedCourseId, courseAssessments.length]);

  useEffect(() => {
    if (store.assessmentTypes.length > 0 && !newAssessmentTypeId) {
      setNewAssessmentTypeId(store.assessmentTypes[0].id);
    }
  }, [store.assessmentTypes]);


  // Download template with live roster pre-filled where applicable
  const handleDownloadTemplate = () => {
    let rows: any[] = [];
    const selectedCourse = store.courses.find(c => c.id === selectedCourseId);
    let filename = `UTT_${importType.toUpperCase()}_Template.xlsx`;

    if (importType === 'students') {
      rows = [
        { register_no: '2026BBA101', name: 'Sample Student 1', class: 'Div A', phone: '+1 555-0191' },
        { register_no: '2026BBA102', name: 'Sample Student 2', class: 'Div B', phone: '+1 555-0192' },
      ];
      filename = `${selectedBatch?.code || 'Batch'}_Students_Template.xlsx`;
    } else if (importType === 'marks') {
      rows = batchStudents.map(stu => ({
        'Register Number': stu.register_no,
        'Name': stu.name,
        'Mark': '',
      }));
      if (rows.length === 0) {
        rows = [
          { 'Register Number': '2026BBA101', 'Name': 'Charlie Brown', 'Mark': 85 },
          { 'Register Number': '2026BBA102', 'Name': 'Lucy van Pelt', 'Mark': 92 }
        ];
      }
      filename = `${selectedBatch?.code || 'Batch'}_${selectedCourse?.code || 'Course'}_Marks_Template.xlsx`;
    } else if (importType === 'attendance') {
      rows = batchStudents.map(stu => ({
        'Register No': stu.register_no,
        'Student Name': stu.name,
        'Class': stu.class,
        '2026-02-01 (H1)': 'P',
        '2026-02-01 (H2)': 'P',
      }));
      if (rows.length === 0) {
        rows = [
          { 'Register No': '2026BBA101', 'Student Name': 'Charlie Brown', 'Class': 'CS-A', '2026-02-01 (H1)': 'P', '2026-02-01 (H2)': 'P' },
          { 'Register No': '2026BBA102', 'Student Name': 'Lucy van Pelt', 'Class': 'CS-A', '2026-02-01 (H1)': 'A', '2026-02-01 (H2)': 'P' }
        ];
      }
      filename = `${selectedBatch?.code || 'Batch'}_${selectedCourse?.code || 'Course'}_Attendance_Template.xlsx`;
    } else if (importType === 'syllabus') {
      rows = [
        { topic_no: 1, topic_name: 'Introduction & Setup', planned_hours: 2 },
        { topic_no: 2, topic_name: 'Advanced Concepts & Applications', planned_hours: 4 },
      ];
      filename = `${selectedBatch?.code || 'Batch'}_${selectedCourse?.code || 'Course'}_Syllabus_Template.xlsx`;
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, filename);
    toast.success(`Template ${filename} downloaded!`);
  };

  // Export current entity data to Excel
  const handleExportCurrentData = () => {
    const selectedCourse = store.courses.find(c => c.id === selectedCourseId);
    if (importType === 'students') {
      const data = batchStudents.map(s => ({
        'Register Number': s.register_no,
        'Name': s.name,
        'Class': s.class,
        'Phone': s.phone || '',
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Students');
      XLSX.writeFile(wb, `${selectedBatch?.code || 'Batch'}_Students_Data.xlsx`);
      toast.success('Exported Students Data (.xlsx)');
    } else if (importType === 'marks') {
      const bcs = store.batchCourses.filter(bc => bc.batch_id === selectedBatchId && bc.course_id === selectedCourseId);
      const bcsIds = bcs.map(b => b.id);
      const assessments = store.assessments.filter(a => bcsIds.includes(a.batch_course_id));
      const data = batchStudents.map(stu => {
        const row: any = { 'Register Number': stu.register_no, 'Name': stu.name };
        assessments.forEach(asm => {
          const markObj = store.assessmentMarks.find(m => m.assessment_id === asm.id && m.student_id === stu.id);
          row[asm.name] = markObj?.mark !== undefined ? markObj.mark : '';
        });
        return row;
      });
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Marks');
      XLSX.writeFile(wb, `${selectedBatch?.code || 'Batch'}_${selectedCourse?.code || 'Course'}_Marks_Data.xlsx`);
      toast.success('Exported Marks Data (.xlsx)');
    } else if (importType === 'attendance') {
      const bcs = store.batchCourses.filter(bc => bc.batch_id === selectedBatchId && bc.course_id === selectedCourseId);
      const bcsIds = bcs.map(b => b.id);
      const sessions = store.sessions.filter(s => bcsIds.includes(s.batch_course_id));
      const data = batchStudents.map(stu => {
        const row: any = { 'Register Number': stu.register_no, 'Name': stu.name };
        sessions.forEach(sess => {
          const rec = store.attendance.find(a => a.session_id === sess.id && a.student_id === stu.id);
          row[`${sess.session_date} (H${sess.hour_no})`] = rec ? rec.status.toUpperCase() : 'PRESENT';
        });
        return row;
      });
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
      XLSX.writeFile(wb, `${selectedBatch?.code || 'Batch'}_${selectedCourse?.code || 'Course'}_Attendance_Data.xlsx`);
      toast.success('Exported Attendance Data (.xlsx)');
    } else if (importType === 'syllabus') {
      const bcs = store.batchCourses.filter(bc => bc.batch_id === selectedBatchId && bc.course_id === selectedCourseId);
      const bcsIds = bcs.map(b => b.id);
      const syllabus = store.batchSyllabus.filter(s => bcsIds.includes(s.batch_course_id));
      const data = syllabus.map(s => ({
        'Topic No': s.topic_no,
        'Topic Name': s.topic_name,
        'Planned Hours': s.planned_hours,
        'Status': s.is_completed ? 'Completed' : 'Pending',
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Syllabus');
      XLSX.writeFile(wb, `${selectedBatch?.code || 'Batch'}_${selectedCourse?.code || 'Course'}_Syllabus_Data.xlsx`);
      toast.success('Exported Syllabus Data (.xlsx)');
    }
  };

  // Helper to parse Excel date serials and string dates to YYYY-MM-DD
  const parseExcelDate = (val: any): string => {
    if (val === undefined || val === null || val === '') return '';
    if (typeof val === 'number') {
      const date = new Date((val - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }
    const str = String(val).trim();
    const parsed = Date.parse(str);
    if (!isNaN(parsed)) return new Date(parsed).toISOString().split('T')[0];
    return str;
  };

  // Upload and parse preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset the input so the same file can be re-uploaded if needed
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(sheet);

        const validRows: any[] = [];
        const errorRows: any[] = [];

        const getRowVal = (row: any, searchKeys: string[], defaultVal = '') => {
          const keys = Object.keys(row);
          for (const sk of searchKeys) {
            const foundKey = keys.find(k => k.trim().toLowerCase() === sk.trim().toLowerCase());
            if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) return row[foundKey];
          }
          for (const sk of searchKeys) {
            const foundKey = keys.find(k => k.toLowerCase().includes(sk.toLowerCase()));
            if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) return row[foundKey];
          }
          return defaultVal;
        };

        // Determine max mark for validation (used by marks parser)
        const existingAssessment = selectedAssessmentId !== 'new'
          ? courseAssessments.find(a => a.id === selectedAssessmentId)
          : null;
        const maxMark = existingAssessment ? existingAssessment.max_mark : newAssessmentMaxMark;

        if (importType === 'students') {
          rows.forEach((r, idx) => {
            const regNo = getRowVal(r, ['register no', 'register_no', 'register', 'reg', 'roll']);
            const name = getRowVal(r, ['student name', 'name', 'student']);
            const phone = getRowVal(r, ['phone number', 'phone', 'mobile', 'contact'], '');
            const classVal = getRowVal(r, ['class (division)', 'class', 'division', 'div'], 'Div A');
            if (!regNo || !name) {
              errorRows.push({ row: idx + 1, data: r, error: 'Missing register number or student name' });
            } else {
              validRows.push({
                register_no: String(regNo).trim().toUpperCase(),
                name: String(name).trim(),
                class: String(classVal).trim(),
                phone: String(phone).trim()
              });
            }
          });

        } else if (importType === 'marks') {
          rows.forEach((r, idx) => {
            const regNo = getRowVal(r, ['register number', 'register no', 'register_no', 'reg no', 'roll']);
            const mark = Number(getRowVal(r, ['mark', 'marks', 'score'], ''));
            const stu = batchStudents.find(s => s.register_no.toLowerCase() === String(regNo || '').toLowerCase());
            if (!regNo) {
              errorRows.push({ row: idx + 1, data: r, error: 'Missing register number' });
            } else if (!stu) {
              errorRows.push({ row: idx + 1, data: r, error: `Register No "${regNo}" not found in batch roster` });
            } else if (isNaN(mark) || mark < 0) {
              errorRows.push({ row: idx + 1, data: r, error: 'Mark must be a non-negative number' });
            } else if (mark > maxMark) {
              errorRows.push({ row: idx + 1, data: r, error: `Mark ${mark} exceeds max mark ${maxMark}` });
            } else {
              validRows.push({ student_id: stu.id, register_no: stu.register_no, name: stu.name, mark });
            }
          });

        } else if (importType === 'attendance') {
          // Wide matrix format: Register No | Student Name | Class | 2026-02-01 (H1) | 2026-02-01 (H2) ...
          const BASE_KEYS = ['register no', 'register_no', 'student name', 'name', 'class', 'division'];
          rows.forEach((r, idx) => {
            const regNo = getRowVal(r, ['register no', 'register_no', 'register', 'reg', 'roll']);
            if (!regNo) {
              errorRows.push({ row: idx + 1, data: r, error: 'Missing register number' });
              return;
            }
            const stu = batchStudents.find(s => s.register_no.toLowerCase() === String(regNo).toLowerCase());
            if (!stu) {
              errorRows.push({ row: idx + 1, data: r, error: `Register No "${regNo}" not found in batch roster` });
              return;
            }
            // Extract date/hour columns
            const dateKeys = Object.keys(r).filter(k => {
              const kl = k.toLowerCase();
              return !BASE_KEYS.some(bk => kl.includes(bk));
            });
            let sessionCount = 0;
            dateKeys.forEach(col => {
              const bracketMatch = col.match(/(\d{4}-\d{2}-\d{2})\s*\(H(\d+)\)/i);
              const dotMatch = col.match(/(\d{4}-\d{2}-\d{2})[·.\-](\d+)/);
              let date = '';
              let hour = 1;
              if (bracketMatch) { date = bracketMatch[1]; hour = Number(bracketMatch[2]); }
              else if (dotMatch) { date = dotMatch[1]; hour = Number(dotMatch[2]); }
              else {
                const parsed = parseExcelDate(col);
                if (parsed) date = parsed;
              }
              if (!date) return;
              const val = String(r[col] || 'P').trim().toUpperCase();
              const status: 'present' | 'absent' | 'late' =
                val === 'A' || val === 'ABSENT' ? 'absent' :
                val === 'L' || val === 'LATE' ? 'late' : 'present';
              validRows.push({ student_id: stu.id, register_no: stu.register_no, name: stu.name, session_date: date, hour_no: hour, status });
              sessionCount++;
            });
            if (sessionCount === 0) {
              errorRows.push({ row: idx + 1, data: r, error: 'No valid date/session columns found in this row' });
            }
          });

        } else if (importType === 'syllabus') {
          rows.forEach((r, idx) => {
            const topicNo = Number(getRowVal(r, ['topic no', 'topic_no', 'no', 'number', '#'], ''));
            const topicName = String(getRowVal(r, ['topic name', 'topic_name', 'topic', 'name', 'title'], '')).trim();
            const plannedHours = Number(getRowVal(r, ['planned hours', 'planned_hours', 'hours'], ''));
            if (!topicName) {
              errorRows.push({ row: idx + 1, data: r, error: 'Missing topic name' });
            } else if (isNaN(plannedHours) || plannedHours <= 0) {
              errorRows.push({ row: idx + 1, data: r, error: 'Planned hours must be a positive number' });
            } else {
              validRows.push({ topic_no: isNaN(topicNo) ? idx + 1 : topicNo, topic_name: topicName, planned_hours: plannedHours });
            }
          });
        }

        setPreviewData({ validRows, errorRows });
      } catch (err) {
        toast.error('Failed to parse file. Make sure it is a valid .xlsx or .csv file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCommit = async () => {
    if (!previewData) return;
    const count = previewData.validRows.length;

    try {
      if (importType === 'students') {
        for (const r of previewData.validRows) {
          await store.saveStudent({
            batch_id: selectedBatchId,
            register_no: r.register_no,
            name: r.name,
            class: r.class,
            phone: r.phone,
          });
        }

      } else if (importType === 'attendance') {
        if (!currentBatchCourse) {
          toast.error('No batch-course found. Please select a valid batch and course.');
          return;
        }
        // Group rows by (session_date, hour_no) to upsert sessions then attendance
        const sessionMap = new Map<string, { date: string; hour: number; records: typeof previewData.validRows }>();
        for (const r of previewData.validRows) {
          const key = `${r.session_date}_H${r.hour_no}`;
          if (!sessionMap.has(key)) sessionMap.set(key, { date: r.session_date, hour: r.hour_no, records: [] });
          sessionMap.get(key)!.records.push(r);
        }
        for (const [, sess] of sessionMap) {
          // Find or create session
          let session = store.sessions.find(
            s => s.batch_course_id === currentBatchCourse.id && s.session_date === sess.date && s.hour_no === sess.hour
          );
          if (!session) {
            session = await store.saveSession({
              id: generateUUID(),
              batch_course_id: currentBatchCourse.id,
              session_date: sess.date,
              hour_no: sess.hour,
            });
          }
          const attendanceRecords = sess.records.map(r => ({
            id: store.attendance.find(a => a.session_id === session!.id && a.student_id === r.student_id)?.id || generateUUID(),
            session_id: session!.id,
            student_id: r.student_id,
            status: r.status as 'present' | 'absent' | 'late',
          }));
          await store.saveAttendanceRecords(attendanceRecords);
        }

      } else if (importType === 'marks') {
        if (!currentBatchCourse) {
          toast.error('No batch-course found. Please select a valid batch and course.');
          return;
        }
        // Resolve or create the assessment
        let assessmentId = selectedAssessmentId;
        if (selectedAssessmentId === 'new') {
          if (!newAssessmentName.trim()) {
            toast.error('Please enter a name for the new assessment before committing.');
            return;
          }
          const newAssessment = await store.saveAssessment({
            id: generateUUID(),
            batch_course_id: currentBatchCourse.id,
            name: newAssessmentName.trim(),
            type_id: newAssessmentTypeId,
            max_mark: newAssessmentMaxMark,
          });
          assessmentId = newAssessment.id;
        }
        const marks = previewData.validRows.map(r => ({
          id: store.assessmentMarks.find(m => m.assessment_id === assessmentId && m.student_id === r.student_id)?.id || generateUUID(),
          assessment_id: assessmentId,
          student_id: r.student_id,
          mark: r.mark,
        }));
        await store.saveAssessmentMarks(marks);

      } else if (importType === 'syllabus') {
        if (!currentBatchCourse) {
          toast.error('No batch-course found. Please select a valid batch and course.');
          return;
        }
        for (const r of previewData.validRows) {
          const existing = store.batchSyllabus.find(
            s => s.batch_course_id === currentBatchCourse.id && s.topic_no === r.topic_no
          );
          await store.saveBatchCourseSyllabusTopic({
            id: existing?.id || generateUUID(),
            batch_course_id: currentBatchCourse.id,
            topic_no: r.topic_no,
            topic_name: r.topic_name,
            planned_hours: r.planned_hours,
            is_completed: existing?.is_completed || false,
            completed_date: existing?.completed_date,
          });
        }
      }

      setPreviewData(null);
      toast.success(`Import committed successfully! ${count} rows imported/updated.`);
    } catch (err: any) {
      toast.error(`Commit failed: ${err?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Import Center</h1>
        <p className="text-sm text-muted-foreground">Unified hub for downloading pre-filled templates and running validate-before-commit data imports.</p>
      </div>

      {/* Bulk Upload Banner for Admin users */}
      {store.profiles.find(p => p.email === store.profiles[0]?.email)?.role === 'admin' && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-accent" /> Bulk Data Migration
            </h4>
            <p className="text-xs text-muted-foreground max-w-2xl">
              Are you setting up a new semester or importing historical sheets? Use the Bulk Data Upload system to upload all colleges, programs, users, courses, batches, and records via a single workbook.
            </p>
          </div>
          <Button onClick={() => navigate('/import-center/bulk')} className="text-xs shrink-0 self-stretch md:self-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            Go to Bulk Upload <ArrowRight className="h-3.5 w-3.5 ml-2" />
          </Button>
        </div>
      )}

      {/* Target Selection Card */}
      <div className="card-meridian p-6 space-y-4">
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${importType !== 'students' ? 'md:grid-cols-3' : ''} gap-4`}>
          <div>
            <label className="text-xs font-mono font-medium text-muted-foreground uppercase">1. Select Import Entity Type</label>
            <select
              value={importType}
              onChange={(e) => { setImportType(e.target.value as any); setPreviewData(null); }}
              className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
            >
              <option value="students">Students Roster Import</option>
              <option value="marks">Assessment Marks Import</option>
              <option value="attendance">Attendance Register Import</option>
              <option value="syllabus">Syllabus Topics Import</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono font-medium text-muted-foreground uppercase">2. Target Training Batch</label>
            <select
              value={selectedBatchId}
              onChange={(e) => { setSelectedBatchId(e.target.value); setPreviewData(null); }}
              className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
            >
              {store.batches.map(b => (
                <option key={b.id} value={b.id}>{b.code} ({b.academic_year})</option>
              ))}
            </select>
          </div>

          {importType !== 'students' && (
            <div>
              <label className="text-xs font-mono font-medium text-muted-foreground uppercase">3. Target Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => { setSelectedCourseId(e.target.value); setPreviewData(null); }}
                className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
              >
                {coursesForBatch.length === 0 ? (
                  <option value="">No courses assigned to batch</option>
                ) : (
                  coursesForBatch.map(c => (
                    <option key={c.courseId} value={c.courseId}>
                      {c.name} ({c.code}) - Sem {c.semester}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>

        {importType === 'marks' && currentBatchCourse && (
          <div className="pt-3 border-t border-border space-y-4">
            <div className="font-heading font-semibold text-sm text-foreground">Assessment Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground uppercase">Assessment Option</label>
                <select
                  value={selectedAssessmentId}
                  onChange={(e) => { setSelectedAssessmentId(e.target.value); setPreviewData(null); }}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
                >
                  {courseAssessments.map(a => (
                    <option key={a.id} value={a.id}>{a.name} (Max: {a.max_mark})</option>
                  ))}
                  <option value="new">+ Create New Assessment</option>
                </select>
              </div>

              {selectedAssessmentId === 'new' && (
                <>
                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground uppercase">New Assessment Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Midterm Exam"
                      value={newAssessmentName}
                      onChange={(e) => { setNewAssessmentName(e.target.value); setNewAssessmentName(e.target.value); setPreviewData(null); }}
                      className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground uppercase">Assessment Type</label>
                    <select
                      value={newAssessmentTypeId}
                      onChange={(e) => { setNewAssessmentTypeId(e.target.value); setPreviewData(null); }}
                      className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
                    >
                      {store.assessmentTypes.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-medium text-muted-foreground uppercase">Max Marks</label>
                    <input
                      type="number"
                      value={newAssessmentMaxMark}
                      onChange={(e) => { setNewAssessmentMaxMark(Number(e.target.value)); setPreviewData(null); }}
                      className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {importType !== 'students' && coursesForBatch.length === 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-xs text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> No courses are assigned to this batch. Please assign courses to this batch in the Batches tab first.
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
          <Button 
            onClick={handleDownloadTemplate} 
            variant="outline" 
            className="text-xs"
            disabled={importType !== 'students' && coursesForBatch.length === 0}
          >
            <Download className="h-4 w-4 mr-2 text-primary" /> Download Pre-Filled Template (.xlsx)
          </Button>

          {importType !== 'students' && coursesForBatch.length === 0 ? (
            <div className="opacity-50 cursor-not-allowed inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm">
              <Upload className="h-4 w-4" /> Upload & Validate File
            </div>
          ) : (
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-sm">
              <Upload className="h-4 w-4" /> Upload & Validate File
              <input type="file" accept=".xlsx, .csv" onChange={handleFileUpload} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {previewData && (
        <div className="card-meridian p-6 space-y-4 border-2 border-primary">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-heading font-bold text-lg text-foreground">Validate-Before-Commit Preview</h3>
            <div className="flex gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-full bg-success/15 text-success font-bold">
                {previewData.validRows.length} Valid Rows
              </span>
              <span className="px-2.5 py-1 rounded-full bg-destructive/15 text-destructive font-bold">
                {previewData.errorRows.length} Error Rows
              </span>
            </div>
          </div>

          {previewData.errorRows.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-xs text-destructive space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" /> The following rows have validation errors and will be skipped:
              </div>
              {previewData.errorRows.map((err, i) => (
                <div key={i} className="font-mono">
                  • Row {err.row}: {err.error}
                </div>
              ))}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border font-mono text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">#</th>
                  {importType === 'attendance' ? (
                    <>
                      <th className="p-3">Register No</th>
                      <th className="p-3">Session Date</th>
                      <th className="p-3">Hour</th>
                      <th className="p-3">Status</th>
                    </>
                  ) : importType === 'syllabus' ? (
                    <>
                      <th className="p-3">Topic No</th>
                      <th className="p-3">Topic Name</th>
                      <th className="p-3">Planned Hrs</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3">Primary Identifier</th>
                      <th className="p-3">Details / Value</th>
                    </>
                  )}
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {previewData.validRows.map((r, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                    {importType === 'attendance' ? (
                      <>
                        <td className="p-3 font-mono font-bold text-accent">{r.register_no}</td>
                        <td className="p-3 text-foreground font-mono text-xs">{r.session_date}</td>
                        <td className="p-3 text-foreground">H{r.hour_no}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            r.status === 'present' ? 'bg-success/15 text-success' :
                            r.status === 'late' ? 'bg-warning/15 text-warning' :
                            'bg-destructive/15 text-destructive'
                          }`}>{r.status}</span>
                        </td>
                      </>
                    ) : importType === 'syllabus' ? (
                      <>
                        <td className="p-3 font-mono font-bold text-accent">{r.topic_no}</td>
                        <td className="p-3 text-foreground">{r.topic_name}</td>
                        <td className="p-3 text-foreground font-mono">{r.planned_hours}h</td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 font-mono font-bold text-accent">{r.register_no || r.topic_name || 'Valid Entry'}</td>
                        <td className="p-3 text-foreground">{r.name || r.mark !== undefined ? (importType === 'marks' ? `Mark: ${r.mark}` : r.name) : r.planned_hours}</td>
                      </>
                    )}
                    <td className="p-3 text-right text-success font-mono font-bold text-xs">Ready to Commit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="outline" onClick={() => setPreviewData(null)}>Cancel</Button>
            <Button onClick={handleCommit} disabled={previewData.validRows.length === 0} className="bg-primary text-primary-foreground">
              Confirm & Commit {previewData.validRows.length} Rows
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
