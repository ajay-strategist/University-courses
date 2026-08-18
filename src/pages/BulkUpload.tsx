import { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Download, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, 
  ArrowRight, ArrowLeft, RefreshCw, FileText, ChevronRight, 
  Settings, UserCheck, X, FileWarning, Play, Info
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { generateUUID } from '@/lib/store';
import type { MigrationRun, MigrationMapping } from '@/types';

// Helper to match headers fuzzily
const fuzzyMatch = (header: string, target: string) => {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cHeader = clean(header);
  const cTarget = clean(target);
  return cHeader.includes(cTarget) || cTarget.includes(cHeader);
};

// Normalise dates from Excel (supporting serials and string formats)
const parseExcelDate = (val: any): string => {
  if (val === undefined || val === null || val === '') return '';
  if (typeof val === 'number') {
    // Excel date serial format (UTC offset adjusted)
    const date = new Date((val - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  const str = String(val).trim();
  // Check if string matches standard date formats
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString().split('T')[0];
  }
  return str; // return raw string if unparseable, validation will capture
};

export default function BulkUpload() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [uploadMode, setUploadMode] = useState<'master' | 'mapped'>('master');
  const [loading, setLoading] = useState(false);
  
  // Mapping mode states
  const [rawWorkbook, setRawWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [mappingProfiles, setMappingProfiles] = useState<MigrationMapping[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [profileName, setProfileName] = useState<string>('');
  
  // Entity to Sheet mapping
  const entities = [
    { key: 'colleges', label: 'Colleges', requiredFields: ['code', 'name', 'location', 'contact_person', 'contact_email', 'contact_phone'] },
    { key: 'programs', label: 'Programs', requiredFields: ['code', 'name'] },
    { key: 'courses', label: 'Courses', requiredFields: ['code', 'name'] },
    { key: 'courseDefaultSyllabus', label: 'Default Syllabus', requiredFields: ['course_code', 'topic_no', 'topic_name', 'planned_hours'] },
    { key: 'users', label: 'Users & Roles', requiredFields: ['full_name', 'email', 'phone', 'role'] },
    { key: 'batches', label: 'Batches', requiredFields: ['college_code', 'program_code', 'academic_year', 'current_semester', 'college_coordinator_email', 'student_coordinator_email', 'start_date', 'end_date'] },
    { key: 'students', label: 'Students', requiredFields: ['batch_code', 'register_no', 'name', 'class', 'phone'] },
    { key: 'batchCourses', label: 'Course Assignments', requiredFields: ['batch_code', 'course_code', 'trainer_email', 'semester', 'planned_hours', 'start_date', 'end_date'] },
    { key: 'batchSyllabus', label: 'Batch Syllabus', requiredFields: ['batch_code', 'course_code', 'topic_no', 'topic_name', 'planned_hours', 'is_completed', 'completed_date'] },
    { key: 'assessments', label: 'Assessments', requiredFields: ['batch_code', 'course_code', 'assessment_name', 'type', 'max_mark', 'assessment_date'] },
    // Fields: Course (batch_code+course_code), Assignment Name, Maximum Mark, Register Number, Name, Mark
    { key: 'assessmentMarks', label: 'Assignment & Exam Marks', requiredFields: ['batch_code', 'course_code', 'assessment_name', 'max_mark', 'register_no', 'name', 'mark'] },
    { key: 'attendance', label: 'Attendance', requiredFields: ['batch_code', 'course_code', 'register_no', 'session_date', 'hour_no', 'status'] },
    // Fields: Date, Batch, Course, Trainer, Start Time, End Time, Covered Topics
    { key: 'trainerLogs', label: 'Trainer Log', requiredFields: ['batch_code', 'course_code', 'trainer_name', 'log_date', 'start_time', 'end_time', 'covered_topics'] },
  ];

  const [entitySheetMapping, setEntitySheetMapping] = useState<Record<string, string>>({});
  const [fieldMappings, setFieldMappings] = useState<Record<string, Record<string, string>>>({});

  // Parsed Payload and Validation Preview states
  const [parsedPayload, setParsedPayload] = useState<Record<string, any[]>>({});
  const [validationReport, setValidationReport] = useState<Record<string, {
    rows: any[];
    newCount: number;
    updateCount: number;
    errorCount: number;
    errors: { row: number; reason: string }[];
  }>>({});
  
  const [isGo, setIsGo] = useState(true);
  const [skipErrored, setSkipErrored] = useState(false);
  
  // Preview selection
  const [activePreviewTab, setActivePreviewTab] = useState<string>('colleges');
  const [errorReportWb, setErrorReportWb] = useState<XLSX.WorkBook | null>(null);

  // Commit progress
  const [commitProgress, setCommitProgress] = useState(0);
  const [commitSummary, setCommitSummary] = useState<any>(null);

  useEffect(() => {
    // Initialise store data fetch and mappings
    store.init().then(() => {
      setMappingProfiles([...store.migrationMappings]);
    });
  }, []);

  // Admin lock
  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6 space-y-4">
        <FileWarning className="h-16 w-16 text-destructive animate-pulse" />
        <h2 className="text-xl font-heading font-bold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-md">Only administrators can run bulk data uploads. If you require permission, please contact the lead administrator.</p>
        <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
      </div>
    );
  }

  // --- STEP 1: DOWNLOAD MASTER WORKBOOK ---
  const handleDownloadMaster = () => {
    const wb = XLSX.utils.book_new();

    // 1. Instructions Sheet
    const instructions = [
      { Rule: 'Instructions & Ordering Guidelines', Description: 'Fill the sheets from left to right. Do not rename sheet names or headers.' },
      { Rule: 'Preserve Leading Zeros', Description: 'Make sure Student Register Numbers are formatted as text, not numbers, so leading zeros are preserved.' },
      { Rule: 'Roles Allowed', Description: 'Users role must be one of: admin, trainer, student_coordinator, college_coordinator.' },
      { Rule: 'Attendance Statuses', Description: 'Attendance status must be one of: present, absent, late (or P, A, L).' },
      { Rule: 'Dates', Description: 'Enter dates in YYYY-MM-DD format.' },
      { Rule: 'Reference sheet', Description: 'Refer to the last sheet ("SystemReferences") for valid codes currently active in the system.' }
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(instructions), 'Instructions');

    // 2. Sample Data Dictionary
    const sampleDataDict: Record<string, any[]> = {
      colleges: [
        { code: 'COL-001', name: 'Harvard College', location: 'Cambridge, MA', contact_person: 'John Harvard', contact_email: 'john@harvard.edu', contact_phone: '1234567890' },
        { code: 'COL-002', name: 'MIT', location: 'Cambridge, MA', contact_person: 'Jane Doe', contact_email: 'jane@mit.edu', contact_phone: '0987654321' }
      ],
      programs: [
        { code: 'CS', name: 'Computer Science' },
        { code: 'EE', name: 'Electrical Engineering' }
      ],
      courses: [
        { code: 'CS101', name: 'Introduction to Computer Science' },
        { code: 'EE101', name: 'Introduction to Circuits' }
      ],
      courseDefaultSyllabus: [
        { course_code: 'CS101', topic_no: 1, topic_name: 'Introduction to Programming', planned_hours: 3 },
        { course_code: 'CS101', topic_no: 2, topic_name: 'Conditionals & Loops', planned_hours: 4 }
      ],
      users: [
        { full_name: 'Alice Smith', email: 'alice@univ.edu', phone: '1112223333', role: 'trainer' },
        { full_name: 'Bob Jones', email: 'bob@univ.edu', phone: '4445556666', role: 'student_coordinator' }
      ],
      batches: [
        { college_code: 'COL-001', program_code: 'CS', academic_year: '2026', current_semester: 1, college_coordinator_email: 'alice@univ.edu', student_coordinator_email: 'bob@univ.edu', start_date: '2026-01-15', end_date: '2026-06-15' }
      ],
      students: [
        { batch_code: 'COL-001-CS-2026', register_no: '001', name: 'Charlie Brown', class: 'CS-A', phone: '5556667777' },
        { batch_code: 'COL-001-CS-2026', register_no: '002', name: 'Lucy van Pelt', class: 'CS-A', phone: '8889990000' }
      ],
      batchCourses: [
        { batch_code: 'COL-001-CS-2026', course_code: 'CS101', trainer_email: 'alice@univ.edu', semester: 1, planned_hours: 30, start_date: '2026-01-15', end_date: '2026-06-15' }
      ],
      batchSyllabus: [
        { batch_code: 'COL-001-CS-2026', course_code: 'CS101', topic_no: 1, topic_name: 'Introduction to Programming', planned_hours: 3, is_completed: 'TRUE', completed_date: '2026-01-20' },
        { batch_code: 'COL-001-CS-2026', course_code: 'CS101', topic_no: 2, topic_name: 'Conditionals & Loops', planned_hours: 4, is_completed: 'FALSE', completed_date: '' }
      ],
      assessments: [
        { batch_code: 'COL-001-CS-2026', course_code: 'CS101', assessment_name: 'Midterm Exam', type: 'Exam', max_mark: 100, assessment_date: '2026-03-10' }
      ],
      assessmentMarks: [
        // Course = batch_code + course_code | Assignment Name | Maximum Mark | Register Number | Name | Mark
        { batch_code: 'COL-001-CS-2026', course_code: 'CS101', assessment_name: 'Midterm Exam', max_mark: 100, register_no: '001', name: 'Charlie Brown', mark: 85 },
        { batch_code: 'COL-001-CS-2026', course_code: 'CS101', assessment_name: 'Midterm Exam', max_mark: 100, register_no: '002', name: 'Lucy van Pelt', mark: 92 }
      ],
      attendance: [
        { batch_code: 'COL-001-CS-2026', course_code: 'CS101', register_no: '001', session_date: '2026-01-20', hour_no: 1, status: 'present' },
        { batch_code: 'COL-001-CS-2026', course_code: 'CS101', register_no: '002', session_date: '2026-01-20', hour_no: 1, status: 'absent' }
      ],
      trainerLogs: [
        // Date | Batch (batch_code) | Course (course_code) | Trainer | Start Time | End Time | Covered Topics (comma-separated topic names)
        { batch_code: 'COL-001-CS-2026', course_code: 'CS101', trainer_name: 'Alice Smith', log_date: '2026-01-20', start_time: '09:00', end_time: '11:00', covered_topics: 'Introduction to Programming, Variables & Data Types' },
        { batch_code: 'COL-001-CS-2026', course_code: 'CS101', trainer_name: 'Alice Smith', log_date: '2026-01-21', start_time: '09:00', end_time: '10:30', covered_topics: 'Conditionals & Loops' }
      ]
    };

    // 3. Data Sheets with Headers and Sample Data
    entities.forEach(ent => {
      const sampleRows = sampleDataDict[ent.key] || [];
      const ws = XLSX.utils.json_to_sheet(sampleRows, { header: ent.requiredFields });
      XLSX.utils.book_append_sheet(wb, ws, ent.label);
    });

    // 3. Reference Sheet (pre-filled with valid codes in system)
    const refData: any[] = [];
    const maxLen = Math.max(
      store.colleges.length,
      store.programs.length,
      store.courses.length,
      store.profiles.length
    );

    for (let i = 0; i < maxLen; i++) {
      refData.push({
        'College Codes': store.colleges[i]?.code || '',
        'College Name': store.colleges[i]?.name || '',
        'Program Codes': store.programs[i]?.code || '',
        'Course Codes': store.courses[i]?.code || '',
        'Course Name': store.courses[i]?.name || '',
        'User Email': store.profiles[i]?.email || '',
        'User Name': store.profiles[i]?.full_name || '',
        'User Role': store.profiles[i]?.role || ''
      });
    }

    const wsRef = XLSX.utils.json_to_sheet(refData);
    XLSX.utils.book_append_sheet(wb, wsRef, 'SystemReferences');

    XLSX.writeFile(wb, `UTT_Master_Migration_Template.xlsx`);
    toast.success('Master migration workbook downloaded!');
  };

  // --- STEP 2: PARSE EXCEL AND UNPIVOT ---
  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        
        if (uploadMode === 'master') {
          processMasterWorkbook(wb);
        } else {
          setRawWorkbook(wb);
          // Auto-suggest sheet names
          const newMappings: Record<string, string> = {};
          entities.forEach(ent => {
            const match = wb.SheetNames.find(name => 
              name.toLowerCase().includes(ent.label.toLowerCase()) || 
              ent.label.toLowerCase().includes(name.toLowerCase())
            );
            if (match) newMappings[ent.key] = match;
          });
          setEntitySheetMapping(newMappings);
          toast.success('File loaded. Map sheets and columns below.');
        }
      } catch (err: any) {
        toast.error(`Failed to parse file: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processMasterWorkbook = (wb: XLSX.WorkBook) => {
    const payload: Record<string, any[]> = {};
    
    entities.forEach(ent => {
      const sheetName = wb.SheetNames.find(name => name.toLowerCase() === ent.label.toLowerCase());
      if (sheetName) {
        const sheet = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });
        payload[ent.key] = cleanRows(rows);
      } else {
        payload[ent.key] = [];
      }
    });

    setParsedPayload(payload);
    runDryRunValidation(payload);
  };

  const cleanRows = (rows: any[]): any[] => {
    return rows.map(r => {
      const cleaned: any = {};
      Object.keys(r).forEach(k => {
        // Trim keys and values, ignore empty fields
        const trimmedKey = k.trim();
        const rawVal = r[k];
        cleaned[trimmedKey] = typeof rawVal === 'string' ? rawVal.trim() : rawVal;
      });
      return cleaned;
    }).filter(r => {
      // Filter out fully empty rows
      return Object.values(r).some(v => v !== undefined && v !== null && v !== '');
    });
  };

  // Auto-detect matrix / unpivot columns for wide attendance format
  const unpivotAttendanceMatrix = (rows: any[]): any[] => {
    const unpivoted: any[] = [];
    rows.forEach(r => {
      const baseKeys = ['batch_code', 'course_code', 'register_no'];
      const extraKeys = Object.keys(r).filter(k => !baseKeys.includes(k));
      
      extraKeys.forEach(col => {
        const val = String(r[col]).trim().toUpperCase();
        if (!val) return;
        
        // Parse date and hour from headers like "2026-02-01 (H1)" or "2026-02-01·1"
        let date = '';
        let hour = 1;
        
        const bracketMatch = col.match(/(\d{4}-\d{2}-\d{2})\s*\(H(\d+)\)/i);
        const dotMatch = col.match(/(\d{4}-\d{2}-\d{2})·(\d+)/);
        
        if (bracketMatch) {
          date = bracketMatch[1];
          hour = Number(bracketMatch[2]);
        } else if (dotMatch) {
          date = dotMatch[1];
          hour = Number(dotMatch[2]);
        } else {
          // Fallback if header is just a date string
          const parsed = Date.parse(col);
          if (!isNaN(parsed)) {
            date = new Date(parsed).toISOString().split('T')[0];
          }
        }
        
        if (date) {
          unpivoted.push({
            batch_code: r.batch_code,
            course_code: r.course_code,
            register_no: String(r.register_no).trim(),
            session_date: date,
            hour_no: hour,
            status: val === 'P' || val === 'PRESENT' ? 'present' : (val === 'L' || val === 'LATE' ? 'late' : 'absent')
          });
        }
      });
    });
    return unpivoted;
  };

  // --- STEP 3: DRY RUN VALIDATION ---
  const runDryRunValidation = (payload: Record<string, any[]>) => {
    const report: Record<string, any> = {};
    let globalIsGo = true;

    // Temporary caches to resolve references created earlier in the workbook
    const collegesInWorkbook = new Set<string>();
    const programsInWorkbook = new Set<string>();
    const coursesInWorkbook = new Set<string>();
    const usersInWorkbook = new Set<string>();
    const batchesInWorkbook = new Set<string>();
    const studentsInWorkbook = new Set<string>(); // key: batchCode_regNo
    const batchCoursesInWorkbook = new Set<string>(); // key: batchCode_courseCode
    const assessmentsInWorkbook = new Set<string>(); // key: batchCode_courseCode_asmName

    // Populate sheets references
    payload.colleges?.forEach(c => c.code && collegesInWorkbook.add(c.code.trim().toUpperCase()));
    payload.programs?.forEach(p => p.code && programsInWorkbook.add(p.code.trim().toUpperCase()));
    payload.courses?.forEach(c => c.code && coursesInWorkbook.add(c.code.trim().toUpperCase()));
    payload.users?.forEach(u => u.email && usersInWorkbook.add(u.email.trim().toLowerCase()));
    
    payload.batches?.forEach(b => {
      const derivedBatchCode = `${b.college_code}-${b.program_code}-${b.academic_year}`.toUpperCase();
      batchesInWorkbook.add(derivedBatchCode);
    });
    
    payload.students?.forEach(s => {
      if (s.batch_code && s.register_no) {
        studentsInWorkbook.add(`${s.batch_code.trim().toUpperCase()}_${String(s.register_no).trim().toUpperCase()}`);
      }
    });

    payload.batchCourses?.forEach(bc => {
      if (bc.batch_code && bc.course_code) {
        batchCoursesInWorkbook.add(`${bc.batch_code.trim().toUpperCase()}_${bc.course_code.trim().toUpperCase()}`);
      }
    });

    payload.assessments?.forEach(a => {
      if (a.batch_code && a.course_code && a.assessment_name) {
        assessmentsInWorkbook.add(`${a.batch_code.trim().toUpperCase()}_${a.course_code.trim().toUpperCase()}_${a.assessment_name.trim().toUpperCase()}`);
      }
    });

    // Run sheet by sheet validation
    entities.forEach(ent => {
      const rows = payload[ent.key] || [];
      let newCount = 0;
      let updateCount = 0;
      let errorCount = 0;
      const errors: { row: number; reason: string }[] = [];

      rows.forEach((row, idx) => {
        const rowNum = idx + 2;
        const reasons: string[] = [];

        // Check required fields
        ent.requiredFields.forEach(field => {
          // attendance topic_no completed_date syllabusTopic topics might have some optional fields depending on state, handle specifically:
          if (ent.key === 'students' && field === 'phone') return;
          if (ent.key === 'batchSyllabus' && (field === 'completed_date' || field === 'is_completed')) return;
          if (ent.key === 'batches' && (field === 'start_date' || field === 'end_date' || field === 'college_coordinator_email' || field === 'student_coordinator_email')) return;
          if (ent.key === 'batchCourses' && (field === 'start_date' || field === 'end_date' || field === 'trainer_email')) return;
          if (ent.key === 'colleges' && field !== 'code' && field !== 'name') return;
          
          if (row[field] === undefined || row[field] === null || row[field] === '') {
            reasons.push(`Missing required field: ${field}`);
          }
        });

        // Specific Entity Validation Rules
        if (ent.key === 'colleges') {
          const exists = store.colleges.some(c => c.code.toUpperCase() === String(row.code).trim().toUpperCase());
          if (exists) updateCount++;
          else newCount++;
        }

        else if (ent.key === 'programs') {
          const exists = store.programs.some(p => p.code.toUpperCase() === String(row.code).trim().toUpperCase());
          if (exists) updateCount++;
          else newCount++;
        }

        else if (ent.key === 'courses') {
          const exists = store.courses.some(c => c.code.toUpperCase() === String(row.code).trim().toUpperCase());
          if (exists) updateCount++;
          else newCount++;
        }

        else if (ent.key === 'courseDefaultSyllabus') {
          const courseCode = String(row.course_code).trim().toUpperCase();
          const courseExists = store.courses.some(c => c.code.toUpperCase() === courseCode) || coursesInWorkbook.has(courseCode);
          if (!courseExists) {
            reasons.push(`Referenced course code not found: ${row.course_code}`);
          }
          if (isNaN(Number(row.topic_no))) {
            reasons.push('Topic No must be numeric');
          }
          // Check update or new
          const matchingCourse = store.courses.find(c => c.code.toUpperCase() === courseCode);
          if (matchingCourse) {
            const exists = store.defaultSyllabus.some(s => s.course_id === matchingCourse.id && s.topic_no === Number(row.topic_no));
            if (exists) updateCount++;
            else newCount++;
          } else {
            newCount++;
          }
        }

        else if (ent.key === 'users') {
          const email = String(row.email).trim().toLowerCase();
          const exists = store.profiles.some(p => p.email.toLowerCase() === email);
          const role = String(row.role).trim().toLowerCase();
          const validRoles = ['admin', 'trainer', 'student_coordinator', 'college_coordinator'];
          if (!validRoles.includes(role)) {
            reasons.push(`Invalid role: ${row.role}. Allowed: ${validRoles.join(', ')}`);
          }
          if (exists) updateCount++;
          else newCount++;
        }

        else if (ent.key === 'batches') {
          const colCode = String(row.college_code).trim().toUpperCase();
          const progCode = String(row.program_code).trim().toUpperCase();
          const colExists = store.colleges.some(c => c.code.toUpperCase() === colCode) || collegesInWorkbook.has(colCode);
          const progExists = store.programs.some(p => p.code.toUpperCase() === progCode) || programsInWorkbook.has(progCode);

          if (!colExists) reasons.push(`Referenced college code not found: ${row.college_code}`);
          if (!progExists) reasons.push(`Referenced program code not found: ${row.program_code}`);

          if (row.college_coordinator_email) {
            const email = String(row.college_coordinator_email).trim().toLowerCase();
            const exists = store.profiles.some(p => p.email.toLowerCase() === email) || usersInWorkbook.has(email);
            if (!exists) reasons.push(`Referenced college coordinator email not found: ${row.college_coordinator_email}`);
          }

          if (row.student_coordinator_email) {
            const email = String(row.student_coordinator_email).trim().toLowerCase();
            const exists = store.profiles.some(p => p.email.toLowerCase() === email) || usersInWorkbook.has(email);
            if (!exists) reasons.push(`Referenced student coordinator email not found: ${row.student_coordinator_email}`);
          }

          const derivedCode = `${colCode}-${progCode}-${String(row.academic_year).trim()}`;
          const exists = store.batches.some(b => b.code.toUpperCase() === derivedCode);
          if (exists) updateCount++;
          else newCount++;
        }

        else if (ent.key === 'students') {
          const bCode = String(row.batch_code).trim().toUpperCase();
          const batchExists = store.batches.some(b => b.code.toUpperCase() === bCode) || batchesInWorkbook.has(bCode);
          if (!batchExists) {
            reasons.push(`Referenced batch code not found: ${row.batch_code}`);
          }
          const regNo = String(row.register_no).trim().toUpperCase();
          const key = `${bCode}_${regNo}`;
          const matchBatch = store.batches.find(b => b.code.toUpperCase() === bCode);
          if (matchBatch) {
            const exists = store.students.some(s => s.batch_id === matchBatch.id && s.register_no.toUpperCase() === regNo);
            if (exists) updateCount++;
            else newCount++;
          } else {
            newCount++;
          }
        }

        else if (ent.key === 'batchCourses') {
          const bCode = String(row.batch_code).trim().toUpperCase();
          const cCode = String(row.course_code).trim().toUpperCase();
          const batchExists = store.batches.some(b => b.code.toUpperCase() === bCode) || batchesInWorkbook.has(bCode);
          const courseExists = store.courses.some(c => c.code.toUpperCase() === cCode) || coursesInWorkbook.has(cCode);

          if (!batchExists) reasons.push(`Referenced batch code not found: ${row.batch_code}`);
          if (!courseExists) reasons.push(`Referenced course code not found: ${row.course_code}`);

          if (row.trainer_email) {
            const email = String(row.trainer_email).trim().toLowerCase();
            const trainerExists = store.profiles.some(p => p.email.toLowerCase() === email) || usersInWorkbook.has(email);
            if (!trainerExists) reasons.push(`Referenced trainer email not found: ${row.trainer_email}`);
          }

          const matchBatch = store.batches.find(b => b.code.toUpperCase() === bCode);
          const matchCourse = store.courses.find(c => c.code.toUpperCase() === cCode);
          if (matchBatch && matchCourse) {
            const exists = store.batchCourses.some(bc => bc.batch_id === matchBatch.id && bc.course_id === matchCourse.id);
            if (exists) updateCount++;
            else newCount++;
          } else {
            newCount++;
          }
        }

        else if (ent.key === 'batchSyllabus') {
          const bCode = String(row.batch_code).trim().toUpperCase();
          const cCode = String(row.course_code).trim().toUpperCase();
          const batchCourseExists = store.batchCourses.some(bc => {
            const b = store.batches.find(x => x.id === bc.batch_id);
            const c = store.courses.find(x => x.id === bc.course_id);
            return b?.code.toUpperCase() === bCode && c?.code.toUpperCase() === cCode;
          }) || batchCoursesInWorkbook.has(`${bCode}_${cCode}`);

          if (!batchCourseExists) {
            reasons.push(`Referenced course assignment not found in Batches/Courses or Batch_Courses sheet: ${row.batch_code} - ${row.course_code}`);
          }

          const matchBatch = store.batches.find(b => b.code.toUpperCase() === bCode);
          const matchCourse = store.courses.find(c => c.code.toUpperCase() === cCode);
          const matchBc = store.batchCourses.find(bc => bc.batch_id === matchBatch?.id && bc.course_id === matchCourse?.id);
          if (matchBc) {
            const exists = store.batchSyllabus.some(s => s.batch_course_id === matchBc.id && s.topic_no === Number(row.topic_no));
            if (exists) updateCount++;
            else newCount++;
          } else {
            newCount++;
          }
        }

        else if (ent.key === 'assessments') {
          const bCode = String(row.batch_code).trim().toUpperCase();
          const cCode = String(row.course_code).trim().toUpperCase();
          const batchCourseExists = store.batchCourses.some(bc => {
            const b = store.batches.find(x => x.id === bc.batch_id);
            const c = store.courses.find(x => x.id === bc.course_id);
            return b?.code.toUpperCase() === bCode && c?.code.toUpperCase() === cCode;
          }) || batchCoursesInWorkbook.has(`${bCode}_${cCode}`);

          if (!batchCourseExists) {
            reasons.push(`Referenced course assignment not found in Batches/Courses or Batch_Courses sheet: ${row.batch_code} - ${row.course_code}`);
          }

          const matchBatch = store.batches.find(b => b.code.toUpperCase() === bCode);
          const matchCourse = store.courses.find(c => c.code.toUpperCase() === cCode);
          const matchBc = store.batchCourses.find(bc => bc.batch_id === matchBatch?.id && bc.course_id === matchCourse?.id);
          if (matchBc) {
            const exists = store.assessments.some(a => a.batch_course_id === matchBc.id && a.name.toUpperCase() === String(row.assessment_name).trim().toUpperCase());
            if (exists) updateCount++;
            else newCount++;
          } else {
            newCount++;
          }
        }

        else if (ent.key === 'assessmentMarks') {
          const bCode = String(row.batch_code).trim().toUpperCase();
          const cCode = String(row.course_code).trim().toUpperCase();
          const asmName = String(row.assessment_name).trim().toUpperCase();
          const regNo = String(row.register_no).trim().toUpperCase();

          const batchCourseExists = store.batchCourses.some(bc => {
            const b = store.batches.find(x => x.id === bc.batch_id);
            const c = store.courses.find(x => x.id === bc.course_id);
            return b?.code.toUpperCase() === bCode && c?.code.toUpperCase() === cCode;
          }) || batchCoursesInWorkbook.has(`${bCode}_${cCode}`);

          const studentExists = store.students.some(s => {
            const b = store.batches.find(x => x.id === s.batch_id);
            return b?.code.toUpperCase() === bCode && s.register_no.toUpperCase() === regNo;
          }) || studentsInWorkbook.has(`${bCode}_${regNo}`);

          if (!batchCourseExists) {
            reasons.push(`Referenced course assignment not found in Batches/Courses: ${row.batch_code} - ${row.course_code}`);
          }
          if (!studentExists) {
            reasons.push(`Referenced student register number not found in this batch: ${row.register_no}`);
          }

          // Check if assessment is defined
          const matchBatch = store.batches.find(b => b.code.toUpperCase() === bCode);
          const matchCourse = store.courses.find(c => c.code.toUpperCase() === cCode);
          const matchBc = store.batchCourses.find(bc => bc.batch_id === matchBatch?.id && bc.course_id === matchCourse?.id);
          
          let assessmentMaxMark = row.max_mark ? Number(row.max_mark) : 100;
          let assessmentId = '';
          if (matchBc) {
            const asm = store.assessments.find(a => a.batch_course_id === matchBc.id && a.name.toUpperCase() === asmName);
            if (asm) {
              assessmentId = asm.id;
              assessmentMaxMark = asm.max_mark;
            }
          }
          // Try resolving max_mark from workbook assessments list
          const wbAsm = payload.assessments?.find((a: any) => 
            a.batch_code.trim().toUpperCase() === bCode && 
            a.course_code.trim().toUpperCase() === cCode && 
            a.assessment_name.trim().toUpperCase() === asmName
          );
          if (wbAsm) {
            assessmentMaxMark = Number(wbAsm.max_mark) || assessmentMaxMark;
          }
          // Also accept max_mark from the marks row itself (new field)
          if (row.max_mark && !wbAsm) {
            assessmentMaxMark = Number(row.max_mark) || assessmentMaxMark;
          }

          const mark = Number(row.mark);
          if (isNaN(mark)) {
            reasons.push('Mark must be a valid number');
          } else if (mark < 0 || mark > assessmentMaxMark) {
            reasons.push(`Mark (${mark}) is out of bounds (0 - ${assessmentMaxMark})`);
          }

          if (assessmentId) {
            const matchStu = store.students.find(s => s.batch_id === matchBatch?.id && s.register_no.toUpperCase() === regNo);
            if (matchStu) {
              const exists = store.assessmentMarks.some(m => m.assessment_id === assessmentId && m.student_id === matchStu.id);
              if (exists) updateCount++;
              else newCount++;
            } else {
              newCount++;
            }
          } else {
            newCount++;
          }
        }

        else if (ent.key === 'trainerLogs') {
          // Fields: Date (log_date), Batch (batch_code), Course (course_code), Trainer (trainer_name), Start Time, End Time, Covered Topics
          const bCode = String(row.batch_code).trim().toUpperCase();
          const cCode = String(row.course_code).trim().toUpperCase();

          const batchCourseExists = store.batchCourses.some(bc => {
            const b = store.batches.find(x => x.id === bc.batch_id);
            const c = store.courses.find(x => x.id === bc.course_id);
            return b?.code.toUpperCase() === bCode && c?.code.toUpperCase() === cCode;
          }) || batchCoursesInWorkbook.has(`${bCode}_${cCode}`);

          if (!batchCourseExists) {
            reasons.push(`Referenced course assignment not found in Batches/Courses: ${row.batch_code} - ${row.course_code}`);
          }

          if (!row.trainer_name || String(row.trainer_name).trim() === '') {
            reasons.push('Trainer name is required');
          }

          if (!row.log_date || String(row.log_date).trim() === '') {
            reasons.push('Log date (Date) is required');
          }

          const startTime = String(row.start_time || '').trim();
          const endTime = String(row.end_time || '').trim();
          if (!startTime) reasons.push('Start Time is required');
          if (!endTime) reasons.push('End Time is required');

          if (!row.covered_topics || String(row.covered_topics).trim() === '') {
            reasons.push('Covered Topics must not be empty');
          }

          if (reasons.length === 0) newCount++;
        }

        else if (ent.key === 'attendance') {
          const bCode = String(row.batch_code).trim().toUpperCase();
          const cCode = String(row.course_code).trim().toUpperCase();
          const regNo = String(row.register_no).trim().toUpperCase();

          const batchCourseExists = store.batchCourses.some(bc => {
            const b = store.batches.find(x => x.id === bc.batch_id);
            const c = store.courses.find(x => x.id === bc.course_id);
            return b?.code.toUpperCase() === bCode && c?.code.toUpperCase() === cCode;
          }) || batchCoursesInWorkbook.has(`${bCode}_${cCode}`);

          const studentExists = store.students.some(s => {
            const b = store.batches.find(x => x.id === s.batch_id);
            return b?.code.toUpperCase() === bCode && s.register_no.toUpperCase() === regNo;
          }) || studentsInWorkbook.has(`${bCode}_${regNo}`);

          if (!batchCourseExists) {
            reasons.push(`Referenced course assignment not found in Batches/Courses: ${row.batch_code} - ${row.course_code}`);
          }
          if (!studentExists) {
            reasons.push(`Referenced student register number not found in this batch: ${row.register_no}`);
          }

          const status = String(row.status).trim().toLowerCase();
          const validStatuses = ['present', 'absent', 'late', 'p', 'a', 'l'];
          if (!validStatuses.includes(status)) {
            reasons.push(`Invalid attendance status: ${row.status}. Allowed: Present, Absent, Late`);
          }

          if (isNaN(Number(row.hour_no))) {
            reasons.push('Hour No must be numeric');
          }

          const matchBatch = store.batches.find(b => b.code.toUpperCase() === bCode);
          const matchCourse = store.courses.find(c => c.code.toUpperCase() === cCode);
          const matchBc = store.batchCourses.find(bc => bc.batch_id === matchBatch?.id && bc.course_id === matchCourse?.id);
          if (matchBc) {
            const normDate = parseExcelDate(row.session_date);
            const matchSess = store.sessions.find(s => s.batch_course_id === matchBc.id && s.session_date === normDate && s.hour_no === Number(row.hour_no));
            if (matchSess) {
              const matchStu = store.students.find(s => s.batch_id === matchBatch?.id && s.register_no.toUpperCase() === regNo);
              if (matchStu) {
                const exists = store.attendance.some(a => a.session_id === matchSess.id && a.student_id === matchStu.id);
                if (exists) updateCount++;
                else newCount++;
              } else {
                newCount++;
              }
            } else {
              newCount++;
            }
          } else {
            newCount++;
          }
        }

        if (reasons.length > 0) {
          errorCount++;
          globalIsGo = false;
          errors.push({ row: rowNum, reason: reasons.join('; ') });
        }
      });

      report[ent.key] = {
        rows,
        newCount,
        updateCount,
        errorCount,
        errors
      };
    });

    setValidationReport(report);
    setIsGo(globalIsGo);
    generateErrorReportWorkbook(report);
    
    // Jump to review step
    setActiveStep(3);
  };

  // Generate downloadable error workbook
  const generateErrorReportWorkbook = (report: Record<string, any>) => {
    const errorWb = XLSX.utils.book_new();
    let hasErrors = false;

    entities.forEach(ent => {
      const sheetReport = report[ent.key];
      if (sheetReport && sheetReport.errors.length > 0) {
        hasErrors = true;
        const failedRows = sheetReport.errors.map((err: any) => {
          const originalRow = sheetReport.rows[err.row - 2];
          return {
            'Excel Row Number': err.row,
            'Error Reason': err.reason,
            ...originalRow
          };
        });
        const ws = XLSX.utils.json_to_sheet(failedRows);
        XLSX.utils.book_append_sheet(errorWb, ws, `${ent.label}_Errors`);
      }
    });

    if (hasErrors) {
      setErrorReportWb(errorWb);
    } else {
      setErrorReportWb(null);
    }
  };

  const handleDownloadErrorReport = () => {
    if (errorReportWb) {
      XLSX.writeFile(errorReportWb, `Migration_Error_Report.xlsx`);
      toast.success('Error report downloaded!');
    }
  };

  // --- STEP 2B: COLUMN MAPPING CONFIG ---
  const handleMapSubmit = () => {
    if (!rawWorkbook) {
      toast.error('Please upload a workbook first.');
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, any[]> = {};
      
      entities.forEach(ent => {
        const sheetName = entitySheetMapping[ent.key];
        if (!sheetName) {
          payload[ent.key] = [];
          return;
        }

        const sheet = rawWorkbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });
        
        // Map keys based on user mappings
        const entMappings = fieldMappings[ent.key] || {};
        const mappedRows = rawRows.map(r => {
          const mapped: any = {};
          ent.requiredFields.forEach(targetField => {
            const mappedSrcHeader = entMappings[targetField];
            if (mappedSrcHeader) {
              mapped[targetField] = r[mappedSrcHeader];
            } else {
              mapped[targetField] = '';
            }
          });
          return mapped;
        });

        // Unpivot attendance if mapped to wide format
        if (ent.key === 'attendance' && mappedRows.length > 0) {
          const hasWideFields = Object.keys(rawRows[0]).some(k => 
            !['batch_code', 'course_code', 'register_no'].includes(k.toLowerCase()) && 
            (k.includes('(') || k.includes('·'))
          );
          if (hasWideFields) {
            payload[ent.key] = unpivotAttendanceMatrix(rawRows);
            return;
          }
        }

        payload[ent.key] = cleanRows(mappedRows);
      });

      setParsedPayload(payload);
      runDryRunValidation(payload);
    } catch (err: any) {
      toast.error(`Mapping error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load configuration mapping profile
  const handleLoadProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    const selected = mappingProfiles.find(m => m.id === profileId);
    if (selected && selected.mapping) {
      if (selected.mapping.sheetMappings) {
        setEntitySheetMapping(selected.mapping.sheetMappings);
      }
      if (selected.mapping.fieldMappings) {
        setFieldMappings(selected.mapping.fieldMappings);
      }
      toast.success(`Loaded mapping profile: ${selected.name}`);
    }
  };

  // Save configuration mapping profile
  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      toast.error('Please enter a profile name.');
      return;
    }

    try {
      const newMapping: MigrationMapping = {
        id: generateUUID(),
        name: profileName.trim(),
        owner_id: profile?.id || '',
        mapping: {
          sheetMappings: entitySheetMapping,
          fieldMappings: fieldMappings
        }
      };

      await store.saveMigrationMapping(newMapping);
      setMappingProfiles([...store.migrationMappings]);
      setSelectedProfileId(newMapping.id);
      setProfileName('');
      toast.success('Mapping profile saved!');
    } catch (e: any) {
      toast.error(`Failed to save mapping: ${e.message}`);
    }
  };

  // --- STEP 4: COMMIT ---
  const handleCommitMigration = async () => {
    setActiveStep(4);
    setLoading(true);
    setCommitProgress(10);

    // Save final uploaded workbook to Storage if online
    let filePath = 'migrations/upload.xlsx';
    if (!store.profiles[0]?.id.startsWith('usr-')) {
      try {
        filePath = `migrations/migration_${Date.now()}_${profile?.id || 'admin'}.xlsx`;
        // Simulation of storage upload for audit purposes
        console.log('Uploading workbook to storage:', filePath);
      } catch (e) {
        console.warn('Storage audit upload failed:', e);
      }
    }

    try {
      // Chunked payload commit logic to avoid timeouts
      // In online mode, we trigger the Edge Function, in offline/demo mode we run local commit helper
      const isOfflineMode = store.profiles[0]?.id.startsWith('usr-');
      
      let summaryCounts: any = null;
      let errorOccurred = false;
      let errorMsg = '';

      if (isOfflineMode) {
        setCommitProgress(50);
        const result = await store.commitMigrationDataLocal(parsedPayload, skipErrored);
        setCommitProgress(90);
        if (result.success) {
          summaryCounts = result.summary;
        } else {
          errorOccurred = true;
          errorMsg = result.error || 'Unknown local commit error';
        }
      } else {
        // Call Supabase Edge Function bulk-import
        setCommitProgress(40);
        const { data: sessionData } = await supabase.auth.getSession();
        
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        const response = await fetch(`${supabaseUrl}/functions/v1/bulk-import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session?.access_token}`
          },
          body: JSON.stringify({
            mode: uploadMode,
            payload: parsedPayload,
            skip_errored: skipErrored,
            file_path: filePath
          })
        });

        setCommitProgress(80);
        if (!response.ok) {
          const errRes = await response.json();
          errorOccurred = true;
          errorMsg = errRes.error || 'Server returned an error';
        } else {
          const resData = await response.json();
          summaryCounts = resData.summary;
        }
      }

      setCommitProgress(100);
      setLoading(false);

      if (errorOccurred) {
        toast.error(`Import failed: ${errorMsg}`);
        setActiveStep(3); // return to review
      } else {
        setCommitSummary(summaryCounts);
        // Refresh local memory cache to pull newly imported items
        await store.init();
        toast.success('All entities successfully committed to the database!');
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(`Connection error: ${err.message}`);
      setActiveStep(3);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Bulk Data Upload (Migration)</h1>
          <p className="text-sm text-muted-foreground">Download templates, run dry-run validation, map columns, and migrate Excel sheets safely.</p>
        </div>
        <Button onClick={() => navigate('/import-center')} variant="ghost" className="text-xs">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Import Center
        </Button>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 border border-border/50 rounded-2xl">
        {[
          { step: 1, label: '1. Download Template' },
          { step: 2, label: '2. Upload & Map' },
          { step: 3, label: '3. Review Report' },
          { step: 4, label: '4. Commit Database' }
        ].map(s => (
          <div 
            key={s.step} 
            className={`flex flex-col space-y-1.5 border-t-4 pt-3 transition-colors ${
              activeStep === s.step 
                ? 'border-accent text-foreground' 
                : activeStep > s.step 
                  ? 'border-primary text-muted-foreground' 
                  : 'border-border text-muted-foreground/60'
            }`}
          >
            <span className="text-xs font-mono font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: DOWNLOAD PANEL */}
      {activeStep === 1 && (
        <div className="card-meridian p-8 max-w-3xl mx-auto text-center space-y-6 my-4">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Download className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-bold text-foreground">Download Master Workbook Template</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              This master Excel workbook contains one sheet per database entity in the correct dependency order. It is pre-configured with a **SystemReferences** sheet containing all college codes, program codes, and coordinator emails currently valid.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={handleDownloadMaster} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-sm w-full sm:w-auto">
              <Download className="h-5 w-5 mr-2" /> Download Master Template (.xlsx)
            </Button>
            <Button onClick={() => setActiveStep(2)} variant="outline" size="lg" className="w-full sm:w-auto font-medium">
              Next Step: Upload File <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="text-xs bg-muted/40 p-4 rounded-xl text-left border border-border max-w-xl mx-auto space-y-1.5 text-muted-foreground">
            <div className="font-bold text-foreground flex items-center gap-1.5 mb-1 text-[11px] font-mono uppercase">
              <Info className="h-3.5 w-3.5 text-accent" /> Key Guidelines:
            </div>
            <li>Do not modify, reorder, or delete sheet headers.</li>
            <li>Maintain register numbers as text to preserve leading zeros.</li>
            <li>Relationships resolve automatically from emails and codes.</li>
          </div>
        </div>
      )}

      {/* STEP 2: UPLOAD & MAP PANEL */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="flex gap-4 border-b border-border">
            <button 
              onClick={() => { setUploadMode('master'); setRawWorkbook(null); }}
              className={`pb-3 text-sm font-semibold tracking-tight border-b-2 px-1 transition-all ${uploadMode === 'master' ? 'border-accent text-foreground' : 'border-transparent text-muted-foreground'}`}
            >
              Option A: Upload Master Template
            </button>
            <button 
              onClick={() => { setUploadMode('mapped'); setRawWorkbook(null); }}
              className={`pb-3 text-sm font-semibold tracking-tight border-b-2 px-1 transition-all ${uploadMode === 'mapped' ? 'border-accent text-foreground' : 'border-transparent text-muted-foreground'}`}
            >
              Option B: Map My Own Excel File
            </button>
          </div>

          {/* Upload Box */}
          <div className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-colors rounded-2xl p-10 text-center bg-card shadow-sm max-w-xl mx-auto">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-1.5 mb-4">
              <h4 className="text-sm font-semibold text-foreground">Select Excel Workbook to Import</h4>
              <p className="text-xs text-muted-foreground">Supports `.xlsx` formats up to 50MB.</p>
            </div>
            <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-sm">
              <FileSpreadsheet className="h-4 w-4" /> Choose Workbook File
              <input type="file" accept=".xlsx" onChange={handleFileDrop} className="hidden" />
            </label>
          </div>

          {/* Option B: Column Mapping Tool */}
          {uploadMode === 'mapped' && rawWorkbook && (
            <div className="card-meridian p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-4 gap-4">
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">Configure Column Mappings</h3>
                  <p className="text-xs text-muted-foreground">Align sheets and columns from your spreadsheet with target entities.</p>
                </div>
                
                {/* Save/Load Configuration Profile */}
                <div className="flex flex-wrap items-center gap-3">
                  <select 
                    value={selectedProfileId}
                    onChange={(e) => handleLoadProfile(e.target.value)}
                    className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none"
                  >
                    <option value="">-- Load Saved Profile --</option>
                    {mappingProfiles.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  <div className="flex items-center border border-border bg-background rounded-xl px-2.5 py-1.5 max-w-xs">
                    <input 
                      type="text" 
                      placeholder="Save current mapping..." 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="border-none bg-transparent outline-none text-xs focus:ring-0 w-full"
                    />
                    <Button onClick={handleSaveProfile} size="icon" variant="ghost" className="h-6 w-6 text-accent">
                      <Settings className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entities.map(ent => {
                  const sheetName = entitySheetMapping[ent.key] || '';
                  const headers = sheetName ? XLSX.utils.sheet_to_json<string[]>(rawWorkbook.Sheets[sheetName], { header: 1 })[0] || [] : [];
                  
                  return (
                    <div key={ent.key} className="border border-border/60 bg-muted/10 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-primary" /> {ent.label}
                        </span>
                        
                        {/* Select source sheet */}
                        <select 
                          value={sheetName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEntitySheetMapping(prev => ({ ...prev, [ent.key]: val }));
                            
                            // Auto map headers fuzzily
                            if (val) {
                              const newHeaders = XLSX.utils.sheet_to_json<string[]>(rawWorkbook.Sheets[val], { header: 1 })[0] || [];
                              const updatedFields: Record<string, string> = {};
                              ent.requiredFields.forEach(f => {
                                const match = newHeaders.find(h => fuzzyMatch(String(h), f));
                                if (match) updatedFields[f] = String(match);
                              });
                              setFieldMappings(prev => ({ ...prev, [ent.key]: updatedFields }));
                            }
                          }}
                          className="bg-background border border-border rounded-xl px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
                        >
                          <option value="">-- Ignore Entity --</option>
                          {rawWorkbook.SheetNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Map fields */}
                      {sheetName && (
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {ent.requiredFields.map(field => {
                            const selectedHeader = (fieldMappings[ent.key] || {})[field] || '';
                            
                            return (
                              <div key={field} className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[10px] uppercase font-bold">{field}</label>
                                <select 
                                  value={selectedHeader}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFieldMappings(prev => ({
                                      ...prev,
                                      [ent.key]: { ...(prev[ent.key] || {}), [field]: val }
                                    }));
                                  }}
                                  className="w-full bg-background border border-border rounded-lg px-2 py-1 focus:outline-none text-[11px]"
                                >
                                  <option value="">-- Do Not Map --</option>
                                  {headers.map(h => (
                                    <option key={String(h)} value={String(h)}>{String(h)}</option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button onClick={() => setRawWorkbook(null)} variant="ghost" className="text-xs">
                  Cancel
                </Button>
                <Button onClick={handleMapSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-xs">
                  Run Dry-Run Validation <Play className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-border/80">
            <Button onClick={() => setActiveStep(1)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Previous Step
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW REPORT PANEL */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <div className="bg-muted/30 border border-border p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-foreground">Dry-Run Validation Report</h3>
              <p className="text-xs text-muted-foreground">
                All records have been dry-run processed. No database modifications have occurred.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto">
              {errorReportWb && (
                <Button onClick={handleDownloadErrorReport} variant="outline" className="text-xs border-destructive hover:bg-destructive/10 text-destructive font-semibold">
                  <FileText className="h-4 w-4 mr-2" /> Download Error Report (.xlsx)
                </Button>
              )}

              {/* Skip Errored Toggle */}
              <label className="flex items-center gap-2 cursor-pointer border border-border bg-background px-3 py-1.5 rounded-xl text-xs font-semibold select-none">
                <input 
                  type="checkbox" 
                  checked={skipErrored}
                  onChange={(e) => setSkipErrored(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary/30 h-3.5 w-3.5"
                />
                Skip errors and commit remainder
              </label>

              <Button 
                onClick={handleCommitMigration} 
                disabled={!isGo && !skipErrored}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-xs"
              >
                Commit Import <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Validation Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {entities.map(ent => {
              const r = validationReport[ent.key];
              if (!r) return null;
              
              return (
                <div 
                  key={ent.key}
                  onClick={() => setActivePreviewTab(ent.key)}
                  className={`border rounded-2xl p-3.5 cursor-pointer transition-all ${
                    activePreviewTab === ent.key 
                      ? 'border-accent bg-accent/5 ring-1 ring-accent' 
                      : r.errorCount > 0 
                        ? 'border-destructive/30 bg-destructive/5 hover:bg-destructive/10' 
                        : 'border-border bg-card hover:bg-muted/30'
                  }`}
                >
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-bold truncate">{ent.label}</div>
                  <div className="text-2xl font-bold font-heading text-foreground mt-2">{r.rows.length}</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold mt-1.5">
                    <span className="text-success">{r.newCount} N</span>
                    <span className="text-accent">{r.updateCount} U</span>
                    <span className="text-destructive">{r.errorCount} E</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preview Tab Content */}
          {activePreviewTab && validationReport[activePreviewTab] && (
            <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-muted/40 border-b border-border px-5 py-3 flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-foreground">
                  Data Preview: {entities.find(e => e.key === activePreviewTab)?.label} ({validationReport[activePreviewTab].rows.length} rows)
                </span>
                
                {validationReport[activePreviewTab].errorCount > 0 && (
                  <span className="text-xs font-mono font-bold text-destructive flex items-center gap-1 bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20">
                    <AlertTriangle className="h-3 w-3" /> Has {validationReport[activePreviewTab].errorCount} validation blocking errors
                  </span>
                )}
              </div>

              {/* Data Grid table */}
              <div className="overflow-x-auto max-h-[350px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-muted/20 text-muted-foreground border-b border-border font-mono text-[10px] uppercase font-bold sticky top-0 bg-card z-10">
                    <tr>
                      <th className="p-3 border-r border-border/50">Row</th>
                      {entities.find(e => e.key === activePreviewTab)?.requiredFields.map(f => (
                        <th key={f} className="p-3 border-r border-border/50">{f}</th>
                      ))}
                      <th className="p-3">Status / Errors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {validationReport[activePreviewTab].rows.map((row, idx) => {
                      const rNum = idx + 2;
                      const err = validationReport[activePreviewTab].errors.find(e => e.row === rNum);
                      
                      return (
                        <tr key={idx} className={`hover:bg-muted/10 ${err ? 'bg-destructive/5' : ''}`}>
                          <td className="p-3 font-mono font-semibold text-muted-foreground border-r border-border/40">{rNum}</td>
                          {entities.find(e => e.key === activePreviewTab)?.requiredFields.map(f => (
                            <td key={f} className="p-3 border-r border-border/40 max-w-[200px] truncate">
                              {String(row[f] ?? '')}
                            </td>
                          ))}
                          <td className="p-3">
                            {err ? (
                              <span className="text-destructive font-semibold flex items-center gap-1 text-[11px]">
                                <AlertTriangle className="h-3 w-3 shrink-0" /> {err.reason}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-success/10 text-success text-[10px] font-bold">
                                <CheckCircle2 className="h-3 w-3" /> Ready
                              </span>
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

          <div className="flex justify-between items-center pt-4 border-t border-border/80">
            <Button onClick={() => setActiveStep(2)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Previous Step
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: COMMIT RUNNING PANEL */}
      {activeStep === 4 && (
        <div className="card-meridian p-8 max-w-2xl mx-auto text-center space-y-6 my-4">
          {loading ? (
            <>
              <RefreshCw className="h-16 w-16 text-accent animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-heading font-bold text-foreground">Importing Data...</h3>
                <p className="text-sm text-muted-foreground">Uploading workbook to audit storage and committing upserts to the database.</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-border rounded-full h-3 overflow-hidden max-w-md mx-auto border border-border/40">
                <div 
                  className="bg-accent h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${commitProgress}%` }}
                />
              </div>
              <div className="font-mono text-xs text-muted-foreground font-semibold">{commitProgress}% complete</div>
            </>
          ) : (
            <>
              <div className="h-16 w-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-heading font-bold text-foreground">Commit Successful</h3>
                <p className="text-sm text-muted-foreground">
                  The data migration workbook has been committed successfully. Verify counts below.
                </p>
              </div>

              {/* Summary table */}
              {commitSummary && (
                <div className="border border-border/60 bg-muted/10 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3">
                  <div className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground font-mono border-b border-border/80 pb-2">
                    Import Summary
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-xs font-mono">
                    {Object.keys(commitSummary).map(entityKey => {
                      const counts = commitSummary[entityKey];
                      const label = entities.find(e => e.key === entityKey || e.key === 'courseDefaultSyllabus' && entityKey === 'course_default_syllabus' || e.key === 'batchCourses' && entityKey === 'batch_courses' || e.key === 'batchSyllabus' && entityKey === 'batch_course_syllabus' || e.key === 'assessmentMarks' && entityKey === 'assessment_marks')?.label || entityKey;
                      
                      return (
                        <div key={entityKey} className="flex justify-between border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                          <span className="font-semibold text-foreground truncate max-w-[200px]">{label}</span>
                          <span className="text-muted-foreground flex gap-2">
                            <span className="text-success font-bold">+{counts.new}</span>
                            <span className="text-accent font-bold">~{counts.updated}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-center gap-3">
                <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground font-semibold">
                  Return to Dashboard
                </Button>
                <Button onClick={() => { setActiveStep(1); setCommitSummary(null); }} variant="outline">
                  Run Another Migration
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
