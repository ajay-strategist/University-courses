import { useState, useMemo } from 'react';
import { store } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Sliders,
  Send,
  Download,
  Upload,
  CheckCircle,
  Eye,
  RefreshCw,
  Search,
  UserX,
  FileSpreadsheet,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  calculateStudentRisks,
  getActiveRiskStudents,
  getEffectiveRiskConfig,
  getGlobalRiskConfig,
  saveGlobalRiskConfig,
  saveBatchRiskConfig,
  resetGlobalRiskConfig,
  resetBatchRiskConfig,
  getBatchRiskConfigOverrides,
  getStudentPhotoUrl,
  generateRiskNotificationEmailHtml,
  type RiskCriteriaConfig,
  type StudentRiskProfile,
  type RiskLevel,
} from '@/lib/riskEngine';
import { sendEmail } from '@/lib/emailService';

export default function StudentRiskManagement() {
  const { profile } = useAuth();
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<'all' | 'attendance' | 'academic' | 'both'>('all');
  const [selectedRiskType, setSelectedRiskType] = useState<'all' | 'Critical' | 'At Risk'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Selection for Trainer Notification
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showPhotoImportModal, setShowPhotoImportModal] = useState(false);

  // Email state
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [includeAcademic, setIncludeAcademic] = useState(true);
  const [trainerRemarks, setTrainerRemarks] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Configuration modal state
  const [configTargetBatchId, setConfigTargetBatchId] = useState<string>('global');
  const [configForm, setConfigForm] = useState<RiskCriteriaConfig>(() => getGlobalRiskConfig());

  // Handle open config modal
  const handleOpenConfig = (batchId: string = 'global') => {
    setConfigTargetBatchId(batchId);
    if (batchId === 'global') {
      setConfigForm(getGlobalRiskConfig());
    } else {
      setConfigForm(getEffectiveRiskConfig(batchId));
    }
    setShowConfigModal(true);
  };

  const handleSaveConfig = () => {
    if (configTargetBatchId === 'global') {
      saveGlobalRiskConfig(configForm);
      toast.success('Admin Common Risk Criteria updated successfully!');
    } else {
      saveBatchRiskConfig(configTargetBatchId, configForm);
      toast.success(`Batch override criteria saved for ${store.batches.find(b => b.id === configTargetBatchId)?.code}!`);
    }
    setShowConfigModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleResetConfig = () => {
    if (configTargetBatchId === 'global') {
      resetGlobalRiskConfig();
      setConfigForm(getGlobalRiskConfig());
      toast.success('Admin Common Risk Criteria reset to defaults.');
    } else {
      resetBatchRiskConfig(configTargetBatchId);
      setConfigForm(getEffectiveRiskConfig(configTargetBatchId));
      toast.success('Batch override removed; reverted to Common Configuration.');
    }
    setRefreshTrigger(prev => prev + 1);
  };

  // Compute Risk Students
  const riskStudents = useMemo(() => {
    const rawBatchId = selectedBatchId === 'all' ? undefined : selectedBatchId;
    let list = getActiveRiskStudents(rawBatchId, selectedRiskCategory, selectedRiskType);

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => 
        p.student.name.toLowerCase().includes(q) ||
        p.student.register_no.toLowerCase().includes(q) ||
        p.student.class?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedBatchId, selectedRiskCategory, selectedRiskType, searchTerm, refreshTrigger]);

  // Overall counts
  const allProfiles = useMemo(() => {
    return calculateStudentRisks(selectedBatchId === 'all' ? undefined : selectedBatchId);
  }, [selectedBatchId, refreshTrigger]);

  const criticalCount = allProfiles.filter(p => p.overallRisk === 'Critical' || p.attendanceRisk === 'Critical' || p.academicRisk === 'Critical').length;
  const atRiskCount = allProfiles.filter(p => (p.overallRisk === 'At Risk' || p.attendanceRisk === 'At Risk' || p.academicRisk === 'At Risk') && !allProfiles.some(c => c.student.id === p.student.id && (c.overallRisk === 'Critical' || c.attendanceRisk === 'Critical' || c.academicRisk === 'Critical'))).length;
  const attendanceRiskCount = allProfiles.filter(p => p.attendanceRisk !== null).length;
  const academicRiskCount = allProfiles.filter(p => p.academicRisk !== null).length;

  // Selected profiles for email
  const selectedProfiles = useMemo(() => {
    return riskStudents.filter(p => selectedStudentIds.includes(p.student.id));
  }, [riskStudents, selectedStudentIds]);

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedStudentIds.length === riskStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(riskStudents.map(p => p.student.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Target batch for email (uses batch of first selected student or selectedBatchId)
  const targetBatch = useMemo(() => {
    if (selectedProfiles.length > 0) return selectedProfiles[0].batch;
    if (selectedBatchId !== 'all') return store.batches.find(b => b.id === selectedBatchId);
    return store.batches[0];
  }, [selectedProfiles, selectedBatchId]);

  const targetCollege = useMemo(() => {
    return store.colleges.find(c => c.id === targetBatch?.college_id);
  }, [targetBatch]);

  // Email Recipients Resolution
  const collegeCoordProfile = store.profiles.find(p => p.id === targetBatch?.college_coordinator_id);
  const studentCoordProfile = store.profiles.find(p => p.id === targetBatch?.student_coordinator_id);
  const toRecipients = [collegeCoordProfile?.email, studentCoordProfile?.email].filter(Boolean) as string[];
  
  // CEO email from settings + College HOD
  const ceoEmail = localStorage.getItem('uct_ceo_email') || 'ceo@kvjanalytics.com';
  const hodEmail = targetCollege?.hod_email || '';
  const ccRecipients = [ceoEmail, hodEmail].filter(Boolean);

  // Generated email preview html
  const emailHtml = useMemo(() => {
    if (!targetBatch || selectedProfiles.length === 0) return '';
    return generateRiskNotificationEmailHtml({
      batchName: targetBatch.code,
      collegeName: targetCollege?.name || 'Partner College',
      trainerName: profile?.full_name || 'Academic Trainer',
      trainerRemarks: trainerRemarks.trim() || undefined,
      selectedProfiles,
      includeAttendance,
      includeAcademic,
    });
  }, [targetBatch, targetCollege, profile, trainerRemarks, selectedProfiles, includeAttendance, includeAcademic]);

  // Send Email Handler
  const handleSendNotification = async () => {
    if (selectedProfiles.length === 0) {
      toast.error('Please select at least one student to notify.');
      return;
    }
    if (toRecipients.length === 0) {
      toast.error('No coordinator emails found for this batch (TO). Please assign batch coordinators.');
      return;
    }

    setIsSendingEmail(true);
    try {
      const subject = `[Intervention Alert] Student Risk Notification — ${targetBatch?.code || 'Cohort'}`;
      const trainerConfig = store.emailConfigs.find(c => c.user_id === profile?.id) || store.emailConfigs[0];

      if (!trainerConfig || !trainerConfig.smtp_user) {
        toast.error('No verified SMTP email configuration found. Please configure your email in Email & Notifications.');
        setIsSendingEmail(false);
        return;
      }

      await sendEmail({
        config: trainerConfig,
        to: toRecipients,
        cc: ccRecipients,
        subject,
        html: emailHtml,
      });

      toast.success(`Risk notification sent to ${toRecipients.join(', ')} (CC: ${ccRecipients.join(', ')})!`);
      setShowEmailModal(false);
      setSelectedStudentIds([]);
      setTrainerRemarks('');
    } catch (err: any) {
      console.error('Email dispatch error:', err);
      toast.error(`Failed to send email: ${err.message || 'SMTP Error'}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Google Drive Photos Import
  const handlePhotoExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(sheet);

        let updated = 0;
        for (const r of rows) {
          const regNo = String(r['Register Number'] || r['Register No'] || r.register_no || r['Reg No'] || '').trim();
          const photoLink = String(r['Photo Link'] || r['Google Drive Link'] || r['Photo URL'] || r.photo_url || '').trim();

          if (regNo && photoLink) {
            const student = store.students.find(s => s.register_no.toLowerCase() === regNo.toLowerCase());
            if (student) {
              await store.saveStudent({
                ...student,
                photo_url: photoLink,
              });
              updated++;
            }
          }
        }

        toast.success(`Successfully mapped ${updated} student photos from Google Drive!`);
        setShowPhotoImportModal(false);
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        toast.error('Failed to parse photo mapping Excel file');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleDownloadPhotoTemplate = () => {
    const activeStudents = selectedBatchId === 'all' 
      ? store.students 
      : store.students.filter(s => s.batch_id === selectedBatchId);

    const ws = XLSX.utils.json_to_sheet(
      activeStudents.map(s => ({
        'Register Number': s.register_no,
        'Student Name': s.name,
        'Google Drive Photo Link': s.photo_url || '',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student Photos');
    XLSX.writeFile(wb, `Student_Photos_GoogleDrive_Template.xlsx`);
    toast.success('Downloaded Google Drive Photo Import Template (.xlsx)');
  };

  const batchOverrides = getBatchRiskConfigOverrides();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            Student Risk Management & Intervention
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Identify at-risk cohorts, analyze attendance & academic degradation, and notify coordinators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPhotoImportModal(true)} className="text-xs">
            <Upload className="h-3.5 w-3.5 mr-1" /> Student Photos
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleOpenConfig('global')} className="text-xs">
            <Sliders className="h-3.5 w-3.5 mr-1" /> Risk Criteria Config
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-meridian p-4 border-l-4 border-l-destructive">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-muted-foreground uppercase">Critical Risk</span>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
          <div className="text-2xl font-bold font-heading text-destructive mt-1">{criticalCount}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Requires immediate intervention</p>
        </div>

        <div className="card-meridian p-4 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-muted-foreground uppercase">At Risk</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-heading text-amber-500 mt-1">{atRiskCount}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Nearing threshold breach</p>
        </div>

        <div className="card-meridian p-4 border-l-4 border-l-primary">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-muted-foreground uppercase">Attendance Breaches</span>
            <UserX className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-heading text-foreground mt-1">{attendanceRiskCount}</div>
          <p className="text-[11px] text-muted-foreground mt-1">&lt;75% or consecutive absences</p>
        </div>

        <div className="card-meridian p-4 border-l-4 border-l-accent">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-muted-foreground uppercase">Academic Breaches</span>
            <FileSpreadsheet className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-heading text-foreground mt-1">{academicRiskCount}</div>
          <p className="text-[11px] text-muted-foreground mt-1">&lt;40% across evaluations</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card p-4 rounded-2xl border border-border flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Batch Selector */}
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
          >
            <option value="all">All Batches ({store.batches.length})</option>
            {store.batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.code} {batchOverrides[b.id] ? '⚡ (Custom Rules)' : ''}
              </option>
            ))}
          </select>

          {/* Risk Category Filter */}
          <div className="flex items-center rounded-xl bg-muted/60 p-0.5 border border-border">
            {(['all', 'attendance', 'academic', 'both'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedRiskCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold capitalize rounded-lg transition-all ${
                  selectedRiskCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat === 'all' ? 'All Risks' : cat}
              </button>
            ))}
          </div>

          {/* Risk Severity Filter */}
          <div className="flex items-center rounded-xl bg-muted/60 p-0.5 border border-border">
            {(['all', 'Critical', 'At Risk'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedRiskType(lvl)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedRiskType === lvl
                    ? 'bg-accent text-accent-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lvl === 'all' ? 'All Severities' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search student or reg no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-8 bg-background"
          />
        </div>
      </div>

      {/* Floating Action Bar for Trainer Selection */}
      {selectedStudentIds.length > 0 && (
        <div className="bg-primary-tint border-2 border-primary rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground font-mono text-xs flex items-center justify-center font-bold">
              {selectedStudentIds.length}
            </span>
            <span className="text-sm font-semibold text-foreground">
              Student{selectedStudentIds.length > 1 ? 's' : ''} Selected for Coordinator Intervention Notice
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStudentIds([])}
              className="text-xs"
            >
              Clear Selection
            </Button>
            <Button
              size="sm"
              onClick={() => setShowEmailModal(true)}
              className="bg-primary text-primary-foreground text-xs"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Preview & Notify Batch Coordinators ({selectedStudentIds.length})
            </Button>
          </div>
        </div>
      )}

      {/* Risk Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
            <tr>
              <th className="p-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={riskStudents.length > 0 && selectedStudentIds.length === riskStudents.length}
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="p-3 w-14 text-center">Photo</th>
              <th className="p-3">Register No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Batch</th>
              <th className="p-3 text-center">Attendance Risk</th>
              <th className="p-3 text-center">Academic Risk</th>
              <th className="p-3 text-center">Overall Risk</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {riskStudents.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-muted-foreground text-xs font-mono">
                  No at-risk students matching the current filter criteria.
                </td>
              </tr>
            ) : (
              riskStudents.map((p) => {
                const photoUrl = getStudentPhotoUrl(p.student.photo_url);
                const isSelected = selectedStudentIds.includes(p.student.id);

                return (
                  <tr
                    key={p.student.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectStudent(p.student.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="p-3 text-center">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={p.student.name}
                          className="h-9 w-9 rounded-full object-cover border border-border mx-auto"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold font-mono text-xs flex items-center justify-center mx-auto">
                          {(p.student.name || 'S').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-accent">{p.student.register_no}</td>
                    <td className="p-3">
                      <div className="font-semibold text-foreground">{p.student.name}</div>
                      <div className="text-[11px] text-muted-foreground">{p.student.class || 'General'}</div>
                    </td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{p.batch.code}</td>
                    <td className="p-3 text-center">
                      {p.attendanceRisk ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
                            p.attendanceRisk === 'Critical'
                              ? 'bg-destructive/15 text-destructive border border-destructive/30'
                              : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          }`}
                        >
                          {p.attendanceRisk} ({p.attendancePct}%)
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-mono text-xs">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {p.academicRisk ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
                            p.academicRisk === 'Critical'
                              ? 'bg-destructive/15 text-destructive border border-destructive/30'
                              : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          }`}
                        >
                          {p.academicRisk} ({p.academicPct ?? 'N/A'}%)
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-mono text-xs">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {p.overallRisk ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                            p.overallRisk === 'Critical'
                              ? 'bg-destructive text-destructive-foreground shadow-xs'
                              : 'bg-amber-500 text-black shadow-xs'
                          }`}
                        >
                          {p.overallRisk}
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-mono text-xs">—</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedStudentIds([p.student.id]);
                          setShowEmailModal(true);
                        }}
                        className="text-xs text-primary hover:bg-primary/10"
                      >
                        <Send className="h-3 w-3 mr-1" /> Notify
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Email Notification & Cross-Check */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Trainer Intervention Notice Dispatch
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cross-check risk parameters before sending notification to batch coordinators.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowEmailModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Recipients Info Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-muted/40 p-4 rounded-xl border border-border">
              <div>
                <span className="font-mono text-muted-foreground font-semibold uppercase block mb-1">
                  TO (Batch Coordinators):
                </span>
                <div className="font-medium text-foreground">
                  {toRecipients.length > 0 ? toRecipients.join(', ') : (
                    <span className="text-destructive font-mono">No coordinator email configured for this batch</span>
                  )}
                </div>
              </div>
              <div>
                <span className="font-mono text-muted-foreground font-semibold uppercase block mb-1">
                  CC (Leadership & HOD):
                </span>
                <div className="font-medium text-foreground">
                  {ccRecipients.length > 0 ? ccRecipients.join(', ') : 'ceo@kvjanalytics.com'}
                </div>
              </div>
              <div className="col-span-full pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                  <CheckCircle className="h-3.5 w-3.5 text-success" />
                  <strong>Security Rule Enforced:</strong> Students are strictly excluded from all risk communications.
                </span>
              </div>
            </div>

            {/* Inclusion Toggles */}
            <div className="flex items-center gap-6 p-3 bg-card border border-border rounded-xl">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase">
                Include Details:
              </span>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAttendance}
                  onChange={(e) => setIncludeAttendance(e.target.checked)}
                  className="rounded border-border"
                />
                Attendance Risk Details
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAcademic}
                  onChange={(e) => setIncludeAcademic(e.target.checked)}
                  className="rounded border-border"
                />
                Academic Risk Details
              </label>
            </div>

            {/* Trainer Remarks */}
            <div>
              <label className="text-xs font-mono font-medium text-muted-foreground uppercase block mb-1">
                Trainer Intervention Remarks (Optional):
              </label>
              <textarea
                value={trainerRemarks}
                onChange={(e) => setTrainerRemarks(e.target.value)}
                placeholder="e.g. Students have missed 3+ consecutive sessions and need urgent parental follow-up..."
                className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
              />
            </div>

            {/* Live HTML Preview Box */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase block">
                Email Live Preview:
              </span>
              <div className="border border-border rounded-xl overflow-hidden max-h-64 overflow-y-auto bg-white p-4">
                <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendNotification}
                disabled={isSendingEmail || selectedProfiles.length === 0}
                className="bg-primary text-primary-foreground font-semibold"
              >
                {isSendingEmail ? 'Dispatching Notice...' : `Send Intervention Notice (${selectedProfiles.length})`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Risk Criteria Configuration */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-primary" />
                  Risk Criteria Configuration
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure global default thresholds or customize specific batch overrides.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowConfigModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Target Scope Switcher */}
            <div>
              <label className="text-xs font-mono font-medium text-muted-foreground uppercase block mb-1">
                Configuration Scope:
              </label>
              <select
                value={configTargetBatchId}
                onChange={(e) => handleOpenConfig(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
              >
                <option value="global">🌐 Admin Common Configuration (Applies to all batches)</option>
                {store.batches.map(b => (
                  <option key={b.id} value={b.id}>
                    Batch Override: {b.code} {batchOverrides[b.id] ? '(Has Custom Overrides)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Criteria */}
            <div className="space-y-3 p-4 bg-muted/20 border border-border rounded-xl">
              <h4 className="text-xs font-mono font-bold text-primary uppercase">Attendance Criteria</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Attendance Threshold %</label>
                  <Input
                    type="number"
                    value={configForm.attendance_threshold_pct}
                    onChange={(e) => setConfigForm({ ...configForm, attendance_threshold_pct: Number(e.target.value) })}
                    className="mt-1 font-mono text-xs"
                  />
                  <span className="text-[11px] text-muted-foreground">Default: &lt; 75% triggers risk</span>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Consecutive Absence Days</label>
                  <Input
                    type="number"
                    value={configForm.consecutive_absence_days}
                    onChange={(e) => setConfigForm({ ...configForm, consecutive_absence_days: Number(e.target.value) })}
                    className="mt-1 font-mono text-xs"
                  />
                  <span className="text-[11px] text-muted-foreground">Default: &ge; 3 consecutive days</span>
                </div>
              </div>
            </div>

            {/* Academic Criteria */}
            <div className="space-y-3 p-4 bg-muted/20 border border-border rounded-xl">
              <h4 className="text-xs font-mono font-bold text-accent uppercase">Academic Criteria</h4>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Academic Threshold %</label>
                <Input
                  type="number"
                  value={configForm.academic_threshold_pct}
                  onChange={(e) => setConfigForm({ ...configForm, academic_threshold_pct: Number(e.target.value) })}
                  className="mt-1 font-mono text-xs"
                />
                <span className="text-[11px] text-muted-foreground">Default: &lt; 40% average score triggers risk</span>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Included Assessment Categories:
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Internal Exam', 'Exam', 'Assignment', 'Assessment', 'Daily Assessment'].map(cat => {
                    const isChecked = configForm.included_assessment_categories.some(c => c.toLowerCase() === cat.toLowerCase());
                    return (
                      <label key={cat} className="flex items-center gap-1.5 text-xs bg-card px-2.5 py-1.5 rounded-lg border border-border cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = configForm.included_assessment_categories;
                            const next = e.target.checked
                              ? [...current, cat]
                              : current.filter(c => c.toLowerCase() !== cat.toLowerCase());
                            setConfigForm({ ...configForm, included_assessment_categories: next });
                          }}
                          className="rounded border-border"
                        />
                        {cat}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Weightages & Severity Thresholds */}
            <div className="space-y-3 p-4 bg-muted/20 border border-border rounded-xl">
              <h4 className="text-xs font-mono font-bold text-foreground uppercase">Overall Risk Weightages</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Attendance Weight %</label>
                  <Input
                    type="number"
                    value={configForm.attendance_weight_pct}
                    onChange={(e) => setConfigForm({ ...configForm, attendance_weight_pct: Number(e.target.value) })}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Academic Weight %</label>
                  <Input
                    type="number"
                    value={configForm.academic_weight_pct}
                    onChange={(e) => setConfigForm({ ...configForm, academic_weight_pct: Number(e.target.value) })}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-medium text-destructive">Critical Risk Threshold (Score &ge;)</label>
                  <Input
                    type="number"
                    value={configForm.critical_risk_threshold_pct}
                    onChange={(e) => setConfigForm({ ...configForm, critical_risk_threshold_pct: Number(e.target.value) })}
                    className="mt-1 font-mono text-xs"
                  />
                  <span className="text-[11px] text-muted-foreground">Default: &ge; 70%</span>
                </div>
                <div>
                  <label className="text-xs font-medium text-amber-500">At Risk Threshold (Score &ge;)</label>
                  <Input
                    type="number"
                    value={configForm.at_risk_threshold_pct}
                    onChange={(e) => setConfigForm({ ...configForm, at_risk_threshold_pct: Number(e.target.value) })}
                    className="mt-1 font-mono text-xs"
                  />
                  <span className="text-[11px] text-muted-foreground">Default: 40% – 69%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={handleResetConfig} className="text-xs text-destructive hover:bg-destructive/10">
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset to Defaults
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowConfigModal(false)}>Cancel</Button>
                <Button onClick={handleSaveConfig} className="bg-primary text-primary-foreground font-semibold">
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Google Drive Photo Import */}
      {showPhotoImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Google Drive Photos Import
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowPhotoImportModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Map student photos by uploading an Excel roster with Register Numbers and Google Drive share links. 
              Our engine automatically transforms Google Drive links into embedded thumbnail views.
            </p>

            <div className="space-y-3 pt-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPhotoTemplate} className="w-full text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download Template (.xlsx)
              </Button>

              <label className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors">
                <Upload className="h-3.5 w-3.5" /> Upload Photo Mapping (.xlsx)
                <input type="file" accept=".xlsx, .csv" onChange={handlePhotoExcelImport} className="hidden" />
              </label>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setShowPhotoImportModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

