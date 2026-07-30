import { useState } from 'react';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { BarChart3, Database, ShieldCheck, ExternalLink, RefreshCw, Key } from 'lucide-react';

export default function Reports() {
  const [reportUrl, setReportUrl] = useState(store.powerBiUrl);

  const reportingViews = [
    { name: 'reporting.vw_dim_college', desc: 'College code, name, location, contact info' },
    { name: 'reporting.vw_dim_batch', desc: 'Batch code, college, program, academic year, student count, coordinators' },
    { name: 'reporting.vw_dim_course', desc: 'Course code, tool name (Excel, Power BI, R, Python, SQL)' },
    { name: 'reporting.vw_dim_student', desc: 'Student register_no, name, class, batch' },
    { name: 'reporting.vw_fact_attendance', desc: 'Attendance fact table (date, hour_no, status present/absent/late)' },
    { name: 'reporting.vw_fact_marks', desc: 'Marks fact table (assessment, type, mark, max_mark, % percentage)' },
    { name: 'reporting.vw_attendance_summary', desc: 'Summary per student x course (sessions held, present, absent, attendance_pct)' },
    { name: 'reporting.vw_course_coverage', desc: 'Coverage per batch-course (delivered hours, status_flag on_track/behind)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Power BI Analytics Layer</h1>
        <p className="text-sm text-muted-foreground">Embedded Power BI report connected directly to Postgres via dedicated read-only reporting schema.</p>
      </div>

      {/* Embedded Report Container */}
      <div className="card-meridian p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-sunken p-3 rounded-xl border border-border">
          <div className="flex items-center gap-2 flex-1">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono font-medium text-muted-foreground">Power BI Embed URL:</span>
            <Input
              value={reportUrl}
              onChange={(e) => setReportUrl(e.target.value)}
              className="h-8 text-xs font-mono flex-1 bg-background"
            />
          </div>
          <Button size="sm" onClick={() => { store.powerBiUrl = reportUrl; toast.success('Report URL saved!'); }} className="h-8 text-xs bg-primary text-primary-foreground">
            Save URL
          </Button>
        </div>

        {/* Embedded IFrame Container */}
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border bg-black/5 flex items-center justify-center">
          {reportUrl ? (
            <iframe
              title="Power BI Report Embed"
              width="100%"
              height="100%"
              src={reportUrl}
              frameBorder="0"
              allowFullScreen={true}
              className="w-full h-full"
            />
          ) : (
            <div className="text-center space-y-2 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto text-primary/40" />
              <p className="font-mono text-sm font-bold">No Power BI Embed URL Configured</p>
              <p className="text-xs max-w-md">Paste your published Power BI report URL above to view live interactive dashboards inside Meridian Console.</p>
            </div>
          )}
        </div>
      </div>

      {/* Connection & Schema Guidance */}
      <div className="card-meridian p-6 space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
            <Database className="h-5 w-5 text-accent" /> Power BI Postgres Native Connection Guide
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connect Power BI Desktop using the native PostgreSQL connector targeting the <code className="font-mono bg-sunken px-1.5 py-0.5 rounded text-accent">reporting</code> schema.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-sunken p-4 rounded-xl space-y-2">
            <div className="font-bold text-foreground font-sans text-sm flex items-center gap-1">
              <Key className="h-4 w-4 text-primary" /> Connection String Parameters:
            </div>
            <div>Server: <span className="text-primary font-bold">db.supabase.co</span> (Port 5432)</div>
            <div>Database: <span className="text-foreground font-bold">postgres</span></div>
            <div>Schema: <span className="text-accent font-bold">reporting</span></div>
            <div>Role: <span className="text-foreground font-bold">pbi_reporting_role (SELECT ONLY)</span></div>
          </div>

          <div className="bg-sunken p-4 rounded-xl space-y-2">
            <div className="font-bold text-foreground font-sans text-sm flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-success" /> Filtering & RLS Strategy:
            </div>
            <div>• One report serves all colleges and batches</div>
            <div>• Report slicers filter by <code className="text-accent">College Code</code> and <code className="text-accent">Batch Code</code></div>
            <div>• Direct Query or Scheduled Refresh supported</div>
          </div>
        </div>

        {/* 8 Reporting Views Table */}
        <div className="space-y-2 pt-2">
          <h3 className="font-heading font-bold text-sm text-foreground">Exposed Read-Only Reporting Views</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
            {reportingViews.map((vw, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-border bg-card flex flex-col justify-center">
                <span className="font-bold text-primary">{vw.name}</span>
                <span className="text-muted-foreground text-[11px] font-sans mt-0.5">{vw.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
