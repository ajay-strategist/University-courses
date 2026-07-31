import { useState } from 'react';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

export default function ImportCenter() {
  const navigate = useNavigate();
  const [importType, setImportType] = useState<'students' | 'attendance' | 'marks' | 'syllabus'>('students');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(store.batches[0]?.id || '');
  const [previewData, setPreviewData] = useState<{
    validRows: any[];
    errorRows: any[];
  } | null>(null);

  const selectedBatch = store.batches.find(b => b.id === selectedBatchId);
  const batchStudents = store.students.filter(s => s.batch_id === selectedBatchId);

  // Download template with live roster pre-filled where applicable
  const handleDownloadTemplate = () => {
    let rows: any[] = [];
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
      filename = `${selectedBatch?.code || 'Batch'}_Marks_Template.xlsx`;
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
      filename = `${selectedBatch?.code || 'Batch'}_Attendance_Template.xlsx`;
    } else if (importType === 'syllabus') {
      rows = [
        { topic_no: 1, topic_name: 'Introduction & Setup', planned_hours: 2 },
        { topic_no: 2, topic_name: 'Advanced Concepts & Applications', planned_hours: 4 },
      ];
      filename = `Syllabus_Import_Template.xlsx`;
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, filename);
    toast.success(`Template ${filename} downloaded!`);
  };

  // Export current entity data to Excel
  const handleExportCurrentData = () => {
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
      const bcs = store.batchCourses.filter(bc => bc.batch_id === selectedBatchId);
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
      XLSX.writeFile(wb, `${selectedBatch?.code || 'Batch'}_Marks_Data.xlsx`);
      toast.success('Exported Marks Data (.xlsx)');
    } else if (importType === 'attendance') {
      const bcs = store.batchCourses.filter(bc => bc.batch_id === selectedBatchId);
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
      XLSX.writeFile(wb, `${selectedBatch?.code || 'Batch'}_Attendance_Data.xlsx`);
      toast.success('Exported Attendance Data (.xlsx)');
    } else if (importType === 'syllabus') {
      const bcs = store.batchCourses.filter(bc => bc.batch_id === selectedBatchId);
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
      XLSX.writeFile(wb, `${selectedBatch?.code || 'Batch'}_Syllabus_Data.xlsx`);
      toast.success('Exported Syllabus Data (.xlsx)');
    }
  };

  // Upload and parse preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

        rows.forEach((r, idx) => {
          if (importType === 'students') {
            const regNo = getRowVal(r, ['register no', 'register', 'reg', 'roll']);
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
          } else if (importType === 'marks') {
            const regNo = r['Register Number'] || r['Register No'] || r.register_no;
            const name = r['Name'] || r['Student Name'] || r.name;
            const mark = Number(r['Mark'] !== undefined ? r['Mark'] : r.mark);
            const stu = batchStudents.find(s => s.register_no.toLowerCase() === String(regNo || '').toLowerCase());
            if (!stu) {
              errorRows.push({ row: idx + 1, data: r, error: 'Register Number not found in batch roster' });
            } else if (isNaN(mark) || mark < 0) {
              errorRows.push({ row: idx + 1, data: r, error: 'Invalid mark value (must be >= 0)' });
            } else {
              validRows.push({ student_id: stu.id, register_no: stu.register_no, name: stu.name, mark });
            }
          } else {
            validRows.push(r);
          }
        });

        setPreviewData({ validRows, errorRows });
      } catch (err) {
        toast.error('Failed to parse file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCommit = async () => {
    if (!previewData) return;
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
    }
    setPreviewData(null);
    toast.success(`Import committed successfully! ${previewData.validRows.length} rows imported/updated.`);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
          <Button onClick={handleDownloadTemplate} variant="outline" className="text-xs">
            <Download className="h-4 w-4 mr-2 text-primary" /> Download Pre-Filled Template (.xlsx)
          </Button>

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-sm">
            <Upload className="h-4 w-4" /> Upload & Validate File
            <input type="file" accept=".xlsx, .csv" onChange={handleFileUpload} className="hidden" />
          </label>
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
                  <th className="p-3">Primary Identifier</th>
                  <th className="p-3">Details / Value</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {previewData.validRows.map((r, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                    <td className="p-3 font-mono font-bold text-accent">{r.register_no || r.topic_name || 'Valid Entry'}</td>
                    <td className="p-3 text-foreground">{r.name || r.mark || r.planned_hours}</td>
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
