import { useState } from 'react';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  BarChart3,
  Database,
  ShieldCheck,
  ExternalLink,
  Key,
  Copy,
  Check,
  CheckCircle2,
  CircleDot,
  Plug,
  Eye,
  TableProperties,
  Info,
  Layers,
} from 'lucide-react';

/* ── helpers ── */
function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="flex items-center justify-between gap-2 bg-sunken border border-border rounded-xl px-4 py-2.5">
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] uppercase tracking-widest font-mono font-semibold text-muted-foreground mb-0.5">{label}</span>
        <span className="font-mono text-sm font-bold text-foreground truncate">{value}</span>
      </div>
      <button
        onClick={copy}
        className="ml-2 flex-shrink-0 p-1.5 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
        title="Copy to clipboard"
      >
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-xs">
      {n}
    </div>
  );
}

/* ── Reporting Views Data ── */
const REPORTING_VIEWS = [
  {
    schema: 'public',
    name: 'uct_vw_dim_college',
    type: 'Dimension',
    columns: 'college_id, college_code, college_name, location, logo_url, image_url',
    desc: 'Master college dimension — code, name, location, and media URLs.',
  },
  {
    schema: 'public',
    name: 'uct_vw_dim_batch',
    type: 'Dimension',
    columns: 'batch_id, batch_code, college_code, program_code, academic_year, student_count, coordinators',
    desc: 'Batch dimension with college, program, academic year, coordinators and student count.',
  },
  {
    schema: 'public',
    name: 'uct_vw_dim_course',
    type: 'Dimension',
    columns: 'course_id, course_code, course_name',
    desc: 'Course master — Excel, Power BI, R, Python, SQL.',
  },
  {
    schema: 'public',
    name: 'uct_vw_dim_batch_course',
    type: 'Dimension',
    columns: 'batch_course_id, batch_code, course_code, course_name, semester, planned_hours, status',
    desc: 'Allocated batch courses dimension, mapping each course to its specific batch and semester.',
  },
  {
    schema: 'public',
    name: 'uct_vw_dim_student',
    type: 'Dimension',
    columns: 'student_id, register_no, student_name, class, batch_code, college_name',
    desc: 'Student dimension with register number, class, and batch linkage.',
  },
  {
    schema: 'public',
    name: 'uct_vw_fact_attendance',
    type: 'Fact',
    columns: 'attendance_id, college_code, batch_code, semester, course_name, register_no, session_date, hour_no, attendance_status',
    desc: 'Grain: one row per student × session hour. Status: present / absent / late.',
  },
  {
    schema: 'public',
    name: 'uct_vw_fact_marks',
    type: 'Fact',
    columns: 'mark_id, college_code, batch_code, semester, course_name, assessment_name, register_no, mark, max_mark, percentage',
    desc: 'Grain: one row per student × assessment. Includes percentage computed column.',
  },
  {
    schema: 'public',
    name: 'uct_vw_attendance_summary',
    type: 'Summary',
    columns: 'student_id, register_no, batch_code, semester, course_name, sessions_held, present_count, absent_count, attendance_pct',
    desc: 'Pre-aggregated attendance % per student × course — ideal for scorecards.',
  },
  {
    schema: 'public',
    name: 'uct_vw_course_coverage',
    type: 'Summary',
    columns: 'batch_course_id, college_code, batch_code, semester, course_name, coverage_pct, planned_hours, delivered_hours, status_flag',
    desc: 'Syllabus coverage % and on_track / behind flag per batch-course.',
  },
  {
    schema: 'public',
    name: 'uct_vw_trainer_logs',
    type: 'Fact',
    columns: 'log_id, college_code, college_name, batch_code, academic_year, semester, course_code, course_name, trainer_name, log_date, start_time, end_time, duration_minutes, notes',
    desc: 'Parent view: session logs containing Date, Trainer Name (text column), Start/End times, and Duration.',
  },
  {
    schema: 'public',
    name: 'uct_vw_trainer_log_topics',
    type: 'Fact',
    columns: 'trainer_log_id, topic_no, topic_name, planned_hours',
    desc: 'Child view: individual topics covered during each trainer log session (connected via trainer_log_id).',
  },
];

const TYPE_STYLES: Record<string, string> = {
  Dimension: 'bg-info-tint text-info-text',
  Fact:      'bg-warning-tint text-warning-text',
  Summary:   'bg-success-tint text-success-text',
};

/* ── Connection credentials (read from .env via Supabase URL) ── */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const getHost = () => {
  try {
    const url = new URL(SUPABASE_URL);
    return url.hostname;
  } catch {
    return 'your-project.supabase.co';
  }
};

const DB_HOST   = getHost();
const DB_PORT   = '5432';
const DB_NAME   = 'postgres';
const DB_SCHEMA = 'public';
const DB_ROLE   = 'pbi_reporting_role';

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function Reports() {
  const [urlDraft, setUrlDraft] = useState(store.powerBiUrl);
  const [reportUrl, setReportUrl] = useState(store.powerBiUrl);
  const [activeTab, setActiveTab] = useState<'embed' | 'connect' | 'views'>('embed');

  const saveUrl = () => {
    store.powerBiUrl = urlDraft;
    setReportUrl(urlDraft);
    toast.success('Power BI embed URL saved!');
  };

  const TABS = [
    { key: 'embed',   label: 'Embedded Report',  icon: Eye },
    { key: 'connect', label: 'Connect Power BI',  icon: Plug },
    { key: 'views',   label: 'Reporting Views',   icon: TableProperties },
  ] as const;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-foreground">Power BI Analytics</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Embed live reports &amp; connect Power BI Desktop directly to your Postgres reporting schema.
          </p>
        </div>

        {/* Connection Status Pill */}
        <div className="flex items-center gap-2 bg-success-tint text-success-text text-xs font-mono font-semibold px-3 py-1.5 rounded-full border border-success/30 self-start sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          reporting schema · 11 views · SELECT-only
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 p-1 bg-sunken rounded-xl border border-border w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === key
                ? 'bg-card text-foreground shadow-sm border border-border font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ══ TAB: EMBED ══════════════════════════════════════ */}
      {activeTab === 'embed' && (
        <div className="space-y-4">
          {/* URL Bar */}
          <div className="card-meridian p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-1 bg-sunken border border-border rounded-xl px-3 py-2">
                <BarChart3 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">Embed URL:</span>
                <Input
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  placeholder="https://app.powerbi.com/view?r=..."
                  className="h-7 text-xs font-mono flex-1 border-0 bg-transparent focus-visible:ring-0 p-0"
                />
              </div>
              <Button size="sm" onClick={saveUrl} className="h-9 text-xs px-4 bg-primary text-primary-foreground hover:bg-primary-hover shrink-0">
                Save URL
              </Button>
              {reportUrl && (
                <a href={reportUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline" className="h-9 text-xs gap-1.5 shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Full
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Iframe */}
          <div className="card-meridian overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '60%' }}>
              {reportUrl ? (
                <iframe
                  title="Power BI Report Embed"
                  src={reportUrl}
                  frameBorder="0"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground bg-sunken">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-primary/50" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-heading font-bold text-foreground text-base">No Embed URL Configured</p>
                    <p className="text-xs max-w-xs text-muted-foreground">
                      Paste your published Power BI report URL above to display live interactive dashboards here.
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs mt-1" onClick={() => setActiveTab('connect')}>
                    <Plug className="h-3.5 w-3.5 mr-1.5" />
                    Set up connection first →
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB: CONNECT ════════════════════════════════════ */}
      {activeTab === 'connect' && (
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="flex gap-3 items-start p-4 bg-info-tint border border-info-text/20 rounded-xl text-info-text text-sm">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Direct PostgreSQL connection</span> — Power BI Desktop connects natively to Supabase Postgres on port&nbsp;5432.{' '}
              Use the dedicated read-only <code className="font-mono bg-black/10 px-1.5 py-0.5 rounded">pbi_reporting_role</code> and target the{' '}
              <code className="font-mono bg-black/10 px-1.5 py-0.5 rounded">reporting</code> schema only.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Step-by-step */}
            <div className="card-meridian p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Plug className="h-5 w-5 text-primary" />
                <h2 className="font-heading font-bold text-base text-foreground">Connection Steps</h2>
              </div>

              {[
                {
                  title: 'Install PostgreSQL ODBC Driver',
                  body: (
                    <span>
                      Download <strong>npgsql</strong> or the official{' '}
                      <a className="text-primary underline underline-offset-2" href="https://www.postgresql.org/ftp/odbc/versions/msi/" target="_blank" rel="noreferrer">
                        psqlODBC
                      </a>{' '}
                      driver. Required for Power BI's native PostgreSQL connector.
                    </span>
                  ),
                },
                {
                  title: 'Get Data → PostgreSQL Database',
                  body: 'In Power BI Desktop: Home → Get Data → Database → PostgreSQL Database.',
                },
                {
                  title: 'Enter Server & Database',
                  body: (
                    <>
                      Server: <code className="font-mono bg-sunken border border-border px-1.5 py-0.5 rounded text-xs">{DB_HOST}:{DB_PORT}</code>
                      <br />
                      Database: <code className="font-mono bg-sunken border border-border px-1.5 py-0.5 rounded text-xs">{DB_NAME}</code>
                    </>
                  ),
                },
                {
                  title: 'Select DirectQuery or Import',
                  body: 'Choose DirectQuery for live data, or Import for scheduled refresh. DirectQuery recommended for live dashboards.',
                },
                {
                  title: 'Authenticate with database credentials',
                  body: (
                    <>
                      Username: <code className="font-mono bg-sunken border border-border px-1.5 py-0.5 rounded text-xs">{DB_ROLE}</code>
                      <br />
                      Password: Contact your DBA for the <code className="font-mono bg-sunken border border-border px-1.5 py-0.5 rounded text-xs">pbi_reporting_role</code> password.
                    </>
                  ),
                },
                {
                  title: 'Select the reporting schema',
                  body: (
                    <>
                      In the Navigator, expand <code className="font-mono bg-sunken border border-border px-1.5 py-0.5 rounded text-xs">reporting</code> schema and select the views you need (see the Reporting Views tab).
                    </>
                  ),
                },
                {
                  title: 'Build your star-schema model',
                  body: 'Join dim_ views (college, batch, course, student) to fact_ views using the matching _code or _id columns. Add slicers for College Code & Batch Code.',
                },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <StepBadge n={idx + 1} />
                  <div className="flex-1 pt-0.5">
                    <p className="font-semibold text-sm text-foreground mb-0.5">{step.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Credentials & Tips */}
            <div className="space-y-4">
              {/* Connection Parameters */}
              <div className="card-meridian p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Key className="h-5 w-5 text-accent" />
                  <h2 className="font-heading font-bold text-base text-foreground">Connection Parameters</h2>
                </div>
                <div className="space-y-2">
                  <CopyField label="Server (Host)" value={DB_HOST} />
                  <CopyField label="Port" value={DB_PORT} />
                  <CopyField label="Database" value={DB_NAME} />
                  <CopyField label="Schema" value={DB_SCHEMA} />
                  <CopyField label="Role / Username" value={DB_ROLE} />
                </div>
                <div className="flex gap-2 items-start mt-2 p-3 rounded-xl bg-warning-tint border border-warning-text/20 text-warning-text text-xs">
                  <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    The <strong>{DB_ROLE}</strong> has <strong>SELECT-only</strong> access scoped to the{' '}
                    <strong>reporting</strong> schema. No write or DDL access is granted.
                  </span>
                </div>
              </div>

              {/* RLS & Filtering */}
              <div className="card-meridian p-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <ShieldCheck className="h-5 w-5 text-success" />
                  <h2 className="font-heading font-bold text-base text-foreground">Filtering Strategy</h2>
                </div>
                {[
                  { icon: CircleDot,    text: 'One report serves all colleges and all batches.' },
                  { icon: Layers,       text: 'Use report slicers on College Code & Batch Code to filter contextually.' },
                  { icon: CheckCircle2, text: 'DirectQuery or Scheduled Refresh are both supported.' },
                  { icon: Database,     text: 'All 8 views join cleanly on college_code and batch_code — no custom bridge tables needed.' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    <Icon className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB: VIEWS ══════════════════════════════════════ */}
      {activeTab === 'views' && (
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs text-muted-foreground font-mono">View Types:</span>
            {Object.entries(TYPE_STYLES).map(([type, cls]) => (
              <span key={type} className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full ${cls}`}>
                {type}
              </span>
            ))}
          </div>

          {/* Views Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REPORTING_VIEWS.map((vw) => (
              <div
                key={vw.name}
                className="card-meridian p-5 space-y-3 hover:shadow-md transition-shadow"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <TableProperties className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="font-mono text-xs text-muted-foreground">{vw.schema}.</div>
                      <div className="font-mono font-bold text-sm text-foreground leading-tight truncate">{vw.name}</div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_STYLES[vw.type]}`}>
                    {vw.type}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">{vw.desc}</p>

                {/* Columns preview */}
                <div className="bg-sunken border border-border rounded-lg p-2.5">
                  <div className="text-[10px] uppercase tracking-widest font-mono font-semibold text-muted-foreground mb-1">Key Columns</div>
                  <div className="font-mono text-xs text-foreground/80 leading-relaxed break-all">
                    {vw.columns}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SQL quick tip */}
          <div className="card-meridian p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-accent" />
              <h3 className="font-heading font-bold text-sm text-foreground">Quick SQL Test in Supabase SQL Editor</h3>
            </div>
            <div className="bg-sunken border border-border rounded-xl p-4 font-mono text-xs text-foreground/80 space-y-1 overflow-x-auto">
              <div><span className="text-primary font-semibold">SELECT</span> * <span className="text-primary font-semibold">FROM</span> public.uct_vw_dim_batch <span className="text-muted-foreground">-- verify batch dimension</span></div>
              <div><span className="text-primary font-semibold">LIMIT</span> 10;</div>
              <div className="pt-2"><span className="text-primary font-semibold">SELECT</span> batch_code, course_name, attendance_pct</div>
              <div className="pl-4"><span className="text-primary font-semibold">FROM</span> public.uct_vw_attendance_summary</div>
              <div className="pl-4"><span className="text-primary font-semibold">WHERE</span> college_code = <span className="text-accent">'MIM'</span></div>
              <div className="pl-4"><span className="text-primary font-semibold">ORDER BY</span> attendance_pct <span className="text-primary font-semibold">ASC</span>;</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
