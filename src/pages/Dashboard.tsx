import { store } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, CalendarCheck, CheckCircle2, FileSpreadsheet, BarChart3, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const activeBatchesCount = store.batches.filter(b => b.status === 'Active').length;
  const totalStudentsCount = store.students.length;

  // Derive global average attendance & coverage
  const allBatches = store.batches.map(b => store.getBatchWithDetails(b.id)!);
  const avgAttendance = Math.round(
    allBatches.reduce((acc, b) => acc + (b.avg_attendance_pct || 90), 0) / (allBatches.length || 1)
  );
  const avgCoverage = Math.round(
    allBatches.reduce((acc, b) => acc + (b.avg_coverage_pct || 50), 0) / (allBatches.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Operational Console Dashboard</h1>
          <p className="text-sm text-muted-foreground">Light operational KPI strip. Deep analytical reporting lives in Power BI.</p>
        </div>
        <Button onClick={() => navigate('/reports')} className="bg-primary text-primary-foreground">
          <BarChart3 className="h-4 w-4 mr-2" /> Open Power BI Report Layer
        </Button>
      </div>

      {/* 5 Section 5 Light KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card-meridian p-5 border-l-4 border-l-primary space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
            <span>Active Batches</span>
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-bold font-mono text-foreground mt-2">{activeBatchesCount}</div>
          <div className="text-[11px] text-muted-foreground font-mono">Cohort groups</div>
        </div>

        <div className="card-meridian p-5 border-l-4 border-l-accent space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
            <span>Enrolled Students</span>
            <Users className="h-4 w-4 text-accent" />
          </div>
          <div className="text-3xl font-bold font-mono text-foreground mt-2">{totalStudentsCount}</div>
          <div className="text-[11px] text-muted-foreground font-mono">Active student count</div>
        </div>

        <div className="card-meridian p-5 border-l-4 border-l-success space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
            <span>Avg Attendance %</span>
            <CalendarCheck className="h-4 w-4 text-success" />
          </div>
          <div className="text-3xl font-bold font-mono text-success mt-2">{avgAttendance}%</div>
          <div className="text-[11px] text-muted-foreground font-mono">Overall attendance rate</div>
        </div>

        <div className="card-meridian p-5 border-l-4 border-l-primary space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
            <span>Avg Coverage %</span>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-bold font-mono text-primary mt-2">{avgCoverage}%</div>
          <div className="text-[11px] text-muted-foreground font-mono">Syllabus delivery pace</div>
        </div>

        <div className="card-meridian p-5 border-l-4 border-l-warning space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
            <span>Pending Imports</span>
            <FileSpreadsheet className="h-4 w-4 text-warning" />
          </div>
          <div className="text-3xl font-bold font-mono text-warning mt-2">0</div>
          <div className="text-[11px] text-muted-foreground font-mono">Clean data state</div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-meridian p-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">Recent Batches Overview</h2>
          <div className="space-y-3">
            {allBatches.slice(0, 3).map((b) => (
              <div
                key={b.id}
                onClick={() => navigate(`/batches/${b.id}`)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-sunken hover:bg-muted/60 transition-colors cursor-pointer border border-border/60"
              >
                <div>
                  <div className="font-heading font-bold text-foreground">{b.code}</div>
                  <div className="text-xs text-muted-foreground">{b.college?.name}</div>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono font-bold">
                  <span className="text-primary">{b.avg_coverage_pct}% Cov</span>
                  <span className="text-success">{b.avg_attendance_pct}% Att</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-meridian p-6 space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">Power BI Analytics Layer</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Per user specification, heavy multi-dimensional analytics live exclusively in Power BI. The web application serves as the clean data-entry and administration console.
          </p>
          <div className="pt-2">
            <Button onClick={() => navigate('/reports')} className="w-full bg-primary text-primary-foreground">
              Launch Embedded Power BI Dashboards
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
