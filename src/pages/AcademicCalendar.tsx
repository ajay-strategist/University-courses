import { useState, useMemo, useEffect } from 'react';
import { store } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import type { AcademicSemester, AcademicActivity, AcademicActivityType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit2,
  Calendar as CalendarIcon,
  Building2,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

const ACTIVITY_TYPES: { type: AcademicActivityType; label: string; badgeClass: string }[] = [
  {
    type: 'Holiday / Break',
    label: 'Holiday / Break',
    badgeClass: 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 font-semibold'
  },
  {
    type: 'Exam Window',
    label: 'Exam Window',
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-medium'
  },
  {
    type: 'Marks Deadline',
    label: 'Marks Deadline',
    badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-medium'
  },
  {
    type: 'Syllabus Milestone',
    label: 'Syllabus Milestone',
    badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-medium'
  },
  {
    type: 'Guest Lecture / Workshop',
    label: 'Guest Lecture / Workshop',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-medium'
  },
  {
    type: 'General Event',
    label: 'General Event',
    badgeClass: 'bg-muted text-muted-foreground border border-border font-medium'
  }
];

export default function AcademicCalendar() {
  const { profile } = useAuth();
  const canEdit = profile?.role === 'admin' || profile?.role === 'trainer';

  // Master filters
  const colleges = store.colleges;
  const programs = store.programs;

  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(colleges[0]?.id || '');
  const [selectedProgramId, setSelectedProgramId] = useState<string>(programs[0]?.id || '');

  // Store data states
  const [batches] = useState(() => store.batches);
  const [semesters, setSemesters] = useState<AcademicSemester[]>([...store.academicSemesters]);
  const [activities, setActivities] = useState<AcademicActivity[]>([...store.academicActivities]);

  // Dynamically derive available Academic Years from Batches
  const availableAcademicYears = useMemo(() => {
    // 1. Batches matching selected college and program
    const matchedBatches = batches.filter(
      b => b.college_id === selectedCollegeId && b.program_id === selectedProgramId
    );
    const matchedYears = Array.from(
      new Set(matchedBatches.map(b => b.academic_year?.trim()).filter(Boolean))
    );

    // 2. Batches matching selected college across all programs
    const collegeBatches = batches.filter(b => b.college_id === selectedCollegeId);
    const collegeYears = Array.from(
      new Set(collegeBatches.map(b => b.academic_year?.trim()).filter(Boolean))
    );

    // 3. Batches system-wide
    const allBatchYears = Array.from(
      new Set(batches.map(b => b.academic_year?.trim()).filter(Boolean))
    );

    // 4. Any academic years already recorded in academicSemesters
    const semesterYears = Array.from(
      new Set(semesters.map(s => s.academic_year?.trim()).filter(Boolean))
    );

    // Prioritize: matched program batches -> college batches -> all batches -> semester records
    let result: string[] = [];
    if (matchedYears.length > 0) {
      result = matchedYears;
    } else if (collegeYears.length > 0) {
      result = collegeYears;
    } else if (allBatchYears.length > 0) {
      result = allBatchYears;
    } else if (semesterYears.length > 0) {
      result = semesterYears;
    }

    // Include any other configured semester years so existing schedules are never hidden
    semesterYears.forEach(y => {
      if (!result.includes(y)) result.push(y);
    });

    return result.sort((a, b) => b.localeCompare(a));
  }, [selectedCollegeId, selectedProgramId, batches, semesters]);

  const [selectedYear, setSelectedYear] = useState<string>(() => {
    return availableAcademicYears[0] || '2024-28';
  });

  // Keep selectedYear in sync whenever available batch academic years change
  useEffect(() => {
    if (availableAcademicYears.length > 0) {
      if (!selectedYear || !availableAcademicYears.includes(selectedYear)) {
        setSelectedYear(availableAcademicYears[0]);
      }
    }
  }, [availableAcademicYears, selectedYear]);

  const [calendarViewMode, setCalendarViewMode] = useState<'calendar' | 'agenda'>('calendar');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');

  // Month navigation state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Modals state
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  // Form states
  const [editingSemesterId, setEditingSemesterId] = useState<string | null>(null);
  const [semesterForm, setSemesterForm] = useState<{
    semester_no: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
  }>({
    semester_no: 1,
    start_date: '',
    end_date: '',
    is_active: true
  });

  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState<{
    college_id: string;
    batch_id: string;
    semester_no: string;
    title: string;
    description: string;
    activity_type: AcademicActivityType;
    start_date: string;
    end_date: string;
    status: 'Planned' | 'Completed' | 'Cancelled';
  }>({
    college_id: selectedCollegeId,
    batch_id: '',
    semester_no: '',
    title: '',
    description: '',
    activity_type: 'Holiday / Break',
    start_date: '',
    end_date: '',
    status: 'Planned'
  });

  // Filtered semesters for selected college, program, and year
  const currentSemesters = useMemo(() => {
    return semesters
      .filter(s => 
        s.college_id === selectedCollegeId &&
        s.program_id === selectedProgramId &&
        s.academic_year === selectedYear
      )
      .sort((a, b) => a.semester_no - b.semester_no);
  }, [semesters, selectedCollegeId, selectedProgramId, selectedYear]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return activities.filter(a => {
      if (a.college_id !== selectedCollegeId) return false;
      if (activityTypeFilter !== 'all' && a.activity_type !== activityTypeFilter) return false;
      return true;
    }).sort((a, b) => a.start_date.localeCompare(b.start_date));
  }, [activities, selectedCollegeId, activityTypeFilter]);

  // Batches for the selected college
  const collegeBatches = useMemo(() => {
    return store.batches.filter(b => b.college_id === selectedCollegeId);
  }, [selectedCollegeId]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days: { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthLastDate - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNumber: d, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= lastDate; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNumber: d, isCurrentMonth: true });
    }

    // Next month padding to round up to complete weeks (multiple of 7)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const m = month === 11 ? 1 : month + 2;
        const y = month === 11 ? year + 1 : year;
        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push({ dateStr, dayNumber: d, isCurrentMonth: false });
      }
    }

    return days;
  }, [year, month]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Activities happening on a given date
  const getActivitiesForDate = (dateStr: string) => {
    return filteredActivities.filter(a => a.start_date <= dateStr && a.end_date >= dateStr);
  };

  // Semester save
  const handleSaveSemester = async () => {
    if (!semesterForm.start_date || !semesterForm.end_date) {
      toast.error('Both Start Date and End Date are required.');
      return;
    }
    if (semesterForm.end_date < semesterForm.start_date) {
      toast.error('End Date cannot be earlier than Start Date.');
      return;
    }

    try {
      await store.saveAcademicSemester({
        id: editingSemesterId || undefined,
        college_id: selectedCollegeId,
        program_id: selectedProgramId,
        academic_year: selectedYear,
        semester_no: Number(semesterForm.semester_no),
        start_date: semesterForm.start_date,
        end_date: semesterForm.end_date,
        is_active: semesterForm.is_active
      });

      setSemesters([...store.academicSemesters]);
      setShowSemesterModal(false);
      setEditingSemesterId(null);
      toast.success(editingSemesterId ? 'Semester updated successfully.' : 'Semester scheduled successfully.');
    } catch (e: any) {
      toast.error('Failed to save semester: ' + (e.message || 'Unknown error'));
    }
  };

  const handleDeleteSemester = async (id: string, semNo: number) => {
    if (!confirm(`Delete schedule for Semester ${semNo}?`)) return;
    await store.deleteAcademicSemester(id);
    setSemesters([...store.academicSemesters]);
    toast.success(`Semester ${semNo} schedule removed.`);
  };

  // Activity save
  const handleSaveActivity = async () => {
    if (!activityForm.title.trim()) {
      toast.error('Activity title is required.');
      return;
    }
    if (!activityForm.start_date || !activityForm.end_date) {
      toast.error('Start and End dates are required.');
      return;
    }
    if (activityForm.end_date < activityForm.start_date) {
      toast.error('End Date cannot be earlier than Start Date.');
      return;
    }

    try {
      await store.saveAcademicActivity({
        id: editingActivityId || undefined,
        college_id: activityForm.college_id || selectedCollegeId,
        batch_id: activityForm.batch_id || null,
        semester_no: activityForm.semester_no ? Number(activityForm.semester_no) : null,
        title: activityForm.title.trim(),
        description: activityForm.description.trim(),
        activity_type: activityForm.activity_type,
        start_date: activityForm.start_date,
        end_date: activityForm.end_date,
        status: activityForm.status
      });

      setActivities([...store.academicActivities]);
      setShowActivityModal(false);
      setEditingActivityId(null);
      toast.success(editingActivityId ? 'Activity updated.' : 'Activity added to calendar.');
    } catch (e: any) {
      toast.error('Failed to save activity: ' + (e.message || 'Unknown error'));
    }
  };

  const handleDeleteActivity = async (id: string, title: string) => {
    if (!confirm(`Remove "${title}" from the calendar?`)) return;
    await store.deleteAcademicActivity(id);
    setActivities([...store.academicActivities]);
    toast.success('Activity removed.');
  };

  const getActivityBadge = (type: AcademicActivityType) => {
    const found = ACTIVITY_TYPES.find(t => t.type === type);
    return found ? found.badgeClass : 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" /> Academic Calendar & Semester Tracking
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Centralized schedule of academic semesters, exams, milestone dates, and holidays.
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setEditingSemesterId(null);
                setSemesterForm({
                  semester_no: currentSemesters.length > 0 ? Math.max(...currentSemesters.map(s => s.semester_no)) + 1 : 1,
                  start_date: '',
                  end_date: '',
                  is_active: true
                });
                setShowSemesterModal(true);
              }}
              variant="outline"
              className="gap-2"
            >
              <CalendarIcon className="h-4 w-4 text-primary" /> Set Semester Dates
            </Button>

            <Button
              onClick={() => {
                setEditingActivityId(null);
                setActivityForm({
                  college_id: selectedCollegeId,
                  batch_id: '',
                  semester_no: '',
                  title: '',
                  description: '',
                  activity_type: 'Holiday / Break',
                  start_date: todayStr,
                  end_date: todayStr,
                  status: 'Planned'
                });
                setShowActivityModal(true);
              }}
              className="bg-primary text-primary-foreground gap-2"
            >
              <Plus className="h-4 w-4" /> Add Activity / Holiday
            </Button>
          </div>
        )}
      </div>

      {/* Global Filter Bar */}
      <div className="card-meridian p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="text-xs font-mono font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <Building2 className="h-3.5 w-3.5 text-primary" /> Partner College
          </label>
          <select
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
          >
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-mono font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-primary" /> Degree Program
          </label>
          <select
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-mono font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-primary" /> Academic Year (from Batches)
          </label>
          {availableAcademicYears.length > 0 ? (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              {availableAcademicYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          ) : (
            <Input
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              placeholder="e.g. 2024-28"
              className="w-full font-mono text-sm"
            />
          )}
        </div>
      </div>

      {/* Section 1: Semester Boundaries & Auto-Selection Status */}
      <div className="card-meridian p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Configured Semester Windows ({selectedYear})
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              These dates power automatic current-semester detection across all batches for this college and program.
            </p>
          </div>
          {canEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingSemesterId(null);
                setSemesterForm({
                  semester_no: currentSemesters.length > 0 ? Math.max(...currentSemesters.map(s => s.semester_no)) + 1 : 1,
                  start_date: '',
                  end_date: '',
                  is_active: true
                });
                setShowSemesterModal(true);
              }}
              className="text-xs h-8"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Semester
            </Button>
          )}
        </div>

        {currentSemesters.length === 0 ? (
          <div className="p-8 text-center bg-muted/20 border border-dashed border-border rounded-xl">
            <p className="text-xs font-mono text-muted-foreground">
              No semester schedules defined for this academic year yet.
            </p>
            {canEdit && (
              <Button
                size="sm"
                variant="link"
                onClick={() => setShowSemesterModal(true)}
                className="text-primary text-xs mt-1"
              >
                + Define Semester 1 start & end dates
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentSemesters.map((sem) => {
              const isCurrent = todayStr >= sem.start_date && todayStr <= sem.end_date && sem.is_active;
              return (
                <div
                  key={sem.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-primary/50 bg-primary/5 shadow-xs ring-1 ring-primary/20'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-sm text-foreground">
                      Semester {sem.semester_no}
                    </span>
                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary text-primary-foreground">
                        ACTIVE NOW
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {sem.is_active ? 'Scheduled' : 'Inactive'}
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Start:</span>
                      <span className="text-foreground font-medium">{sem.start_date}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>End:</span>
                      <span className="text-foreground font-medium">{sem.end_date}</span>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-primary hover:bg-primary/10"
                        onClick={() => {
                          setEditingSemesterId(sem.id);
                          setSemesterForm({
                            semester_no: sem.semester_no,
                            start_date: sem.start_date,
                            end_date: sem.end_date,
                            is_active: sem.is_active
                          });
                          setShowSemesterModal(true);
                        }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteSemester(sem.id, sem.semester_no)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Interactive Calendar & Activities */}
      <div className="card-meridian p-5 space-y-4">
        {/* View Switcher & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border w-fit">
            <button
              onClick={() => setCalendarViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                calendarViewMode === 'calendar'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Month Calendar View
            </button>
            <button
              onClick={() => setCalendarViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                calendarViewMode === 'agenda'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Activity Agenda ({filteredActivities.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-muted-foreground hidden sm:inline">Type:</label>
            <select
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value)}
              className="bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="all">All Activities & Events</option>
              {ACTIVITY_TYPES.map(t => (
                <option key={t.type} value={t.type}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-mono text-[11px] mr-1">Legend:</span>
          {ACTIVITY_TYPES.map(t => (
            <span
              key={t.type}
              className={`px-2 py-0.5 rounded-md text-[11px] ${t.badgeClass}`}
            >
              {t.label}
            </span>
          ))}
        </div>

        {/* Calendar View */}
        {calendarViewMode === 'calendar' && (
          <div className="space-y-4">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between py-2">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {monthNames[month]} {year}
              </h3>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="outline" onClick={handleToday} className="text-xs h-8">
                  Today
                </Button>
                <Button size="icon" variant="outline" onClick={handlePrevMonth} className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={handleNextMonth} className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border border-border rounded-2xl overflow-hidden bg-card">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-muted/40 border-b border-border text-center font-mono text-xs font-semibold text-muted-foreground py-2.5">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 divide-x divide-y divide-border">
                {daysInMonth.map((day, idx) => {
                  const dayActivities = getActivitiesForDate(day.dateStr);
                  const isToday = day.dateStr === todayStr;

                  return (
                    <div
                      key={idx}
                      className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors ${
                        day.isCurrentMonth ? 'bg-card' : 'bg-muted/15 text-muted-foreground'
                      } ${isToday ? 'ring-2 ring-inset ring-primary/40 bg-primary/5' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-mono text-xs font-bold ${
                            isToday
                              ? 'bg-primary text-primary-foreground h-5 w-5 rounded-full flex items-center justify-center'
                              : day.isCurrentMonth
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {day.dayNumber}
                        </span>
                        {dayActivities.length > 0 && (
                          <span className="text-[10px] font-mono text-muted-foreground font-medium">
                            {dayActivities.length} {dayActivities.length === 1 ? 'event' : 'events'}
                          </span>
                        )}
                      </div>

                      {/* Event Chips */}
                      <div className="mt-1.5 space-y-1">
                        {dayActivities.slice(0, 3).map((act) => {
                          const isHoliday = act.activity_type === 'Holiday / Break';
                          return (
                            <div
                              key={act.id}
                              title={`${act.title} (${act.activity_type})`}
                              className={`text-[10px] truncate px-1.5 py-0.5 rounded-sm border ${
                                isHoliday
                                  ? 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40 font-bold'
                                  : getActivityBadge(act.activity_type)
                              }`}
                            >
                              {act.title}
                            </div>
                          );
                        })}
                        {dayActivities.length > 3 && (
                          <div className="text-[10px] font-mono text-muted-foreground text-center">
                            +{dayActivities.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Agenda View */}
        {calendarViewMode === 'agenda' && (
          <div className="border border-border rounded-2xl overflow-hidden bg-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
                <tr>
                  <th className="p-3.5">Activity Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Date Window</th>
                  <th className="p-3.5">Scope / Batch</th>
                  <th className="p-3.5">Status</th>
                  {canEdit && <th className="p-3.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canEdit ? 6 : 5}
                      className="p-8 text-center text-muted-foreground text-xs font-mono"
                    >
                      No academic activities or holidays recorded for this college.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => {
                    const batchObj = act.batch_id ? store.batches.find(b => b.id === act.batch_id) : null;
                    const isHoliday = act.activity_type === 'Holiday / Break';

                    return (
                      <tr
                        key={act.id}
                        className={`hover:bg-muted/30 transition-colors ${
                          isHoliday ? 'bg-red-500/5' : ''
                        }`}
                      >
                        <td className="p-3.5">
                          <div className="font-semibold text-foreground">{act.title}</div>
                          {act.description && (
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {act.description}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getActivityBadge(act.activity_type)}`}>
                            {act.activity_type}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-xs">
                          {act.start_date === act.end_date ? (
                            <span>{act.start_date}</span>
                          ) : (
                            <span>
                              {act.start_date} &rarr; {act.end_date}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-xs">
                          {batchObj ? (
                            <span className="font-mono bg-muted px-2 py-0.5 rounded border border-border">
                              {batchObj.code}
                            </span>
                          ) : act.semester_no ? (
                            <span className="font-mono text-muted-foreground">
                              Semester {act.semester_no} (All)
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">College-wide</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                              act.status === 'Completed'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : act.status === 'Cancelled'
                                ? 'bg-muted text-muted-foreground line-through'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {act.status}
                          </span>
                        </td>
                        {canEdit && (
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-primary hover:bg-primary/10"
                                onClick={() => {
                                  setEditingActivityId(act.id);
                                  setActivityForm({
                                    college_id: act.college_id,
                                    batch_id: act.batch_id || '',
                                    semester_no: act.semester_no ? String(act.semester_no) : '',
                                    title: act.title,
                                    description: act.description || '',
                                    activity_type: act.activity_type,
                                    start_date: act.start_date,
                                    end_date: act.end_date,
                                    status: act.status
                                  });
                                  setShowActivityModal(true);
                                }}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteActivity(act.id, act.title)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Add / Edit Semester */}
      {showSemesterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">
              {editingSemesterId ? 'Edit Semester Schedule' : 'Schedule Semester Window'}
            </h3>
            <p className="text-xs text-muted-foreground">
              Define the academic start and end dates for automatic semester detection.
            </p>

            <div className="p-3 bg-muted/30 rounded-xl border border-border text-xs font-mono space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>College:</span>
                <span className="text-foreground font-semibold">
                  {colleges.find(c => c.id === selectedCollegeId)?.name || 'Selected College'}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Program:</span>
                <span className="text-foreground font-semibold">
                  {programs.find(p => p.id === selectedProgramId)?.name || 'Selected Program'}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Academic Year (Cohort):</span>
                <span className="text-primary font-bold">{selectedYear}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">
                  Semester Number (1 to 10)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={semesterForm.semester_no}
                  onChange={(e) =>
                    setSemesterForm({ ...semesterForm, semester_no: Number(e.target.value) })
                  }
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">
                  Semester Start Date
                </label>
                <Input
                  type="date"
                  value={semesterForm.start_date}
                  onChange={(e) =>
                    setSemesterForm({ ...semesterForm, start_date: e.target.value })
                  }
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">
                  Semester End Date
                </label>
                <Input
                  type="date"
                  value={semesterForm.end_date}
                  onChange={(e) =>
                    setSemesterForm({ ...semesterForm, end_date: e.target.value })
                  }
                  className="mt-1 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="semIsActive"
                  checked={semesterForm.is_active}
                  onChange={(e) =>
                    setSemesterForm({ ...semesterForm, is_active: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="semIsActive" className="text-xs text-foreground cursor-pointer font-medium">
                  Semester is Active
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSemesterModal(false);
                  setEditingSemesterId(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveSemester} className="bg-primary text-primary-foreground">
                {editingSemesterId ? 'Update Schedule' : 'Save Schedule'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Activity */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold font-heading">
              {editingActivityId ? 'Edit Academic Activity' : 'Add Activity or Holiday'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">
                  Activity Title *
                </label>
                <Input
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  placeholder="e.g. Mid-Term Exam Window, Diwali Break, ISA Submission"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">
                  Activity Category *
                </label>
                <select
                  value={activityForm.activity_type}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      activity_type: e.target.value as AcademicActivityType
                    })
                  }
                  className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                >
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t.type} value={t.type}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {activityForm.activity_type === 'Holiday / Break' && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium mt-1 flex items-center gap-1">
                    <Info className="h-3 w-3" /> Holidays will be rendered with distinct Red badges on the calendar.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-medium text-muted-foreground">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={activityForm.start_date}
                    onChange={(e) =>
                      setActivityForm({ ...activityForm, start_date: e.target.value })
                    }
                    className="mt-1 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-medium text-muted-foreground">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    value={activityForm.end_date}
                    onChange={(e) =>
                      setActivityForm({ ...activityForm, end_date: e.target.value })
                    }
                    className="mt-1 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-medium text-muted-foreground">
                    Specific Batch (Optional)
                  </label>
                  <select
                    value={activityForm.batch_id}
                    onChange={(e) => setActivityForm({ ...activityForm, batch_id: e.target.value })}
                    className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    <option value="">All Batches (College-wide)</option>
                    {collegeBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-medium text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={activityForm.status}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        status: e.target.value as 'Planned' | 'Completed' | 'Cancelled'
                      })
                    }
                    className="w-full mt-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">
                  Description / Instructions (Optional)
                </label>
                <textarea
                  value={activityForm.description}
                  onChange={(e) =>
                    setActivityForm({ ...activityForm, description: e.target.value })
                  }
                  placeholder="Additional notes, instructions, or exam timings..."
                  rows={2}
                  className="w-full mt-1 bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowActivityModal(false);
                  setEditingActivityId(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveActivity} className="bg-primary text-primary-foreground">
                {editingActivityId ? 'Update Activity' : 'Add to Calendar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
