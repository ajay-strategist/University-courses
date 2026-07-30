import { useState } from 'react';
import { store } from '@/lib/store';
import type { College, Course, Program, AssessmentType, CourseDefaultSyllabus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Building2, BookOpen, GraduationCap, Award, Plus, Trash2, Edit2, Upload, FileText, Download 
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function MasterData() {
  const [activeTab, setActiveTab] = useState<'colleges' | 'courses' | 'programs' | 'assessments'>('colleges');
  const [colleges, setColleges] = useState<College[]>([...store.colleges]);
  const [courses, setCourses] = useState<Course[]>([...store.courses]);
  const [programs, setPrograms] = useState<Program[]>([...store.programs]);
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([...store.assessmentTypes]);
  const [defaultSyllabus, setDefaultSyllabus] = useState<CourseDefaultSyllabus[]>([...store.defaultSyllabus]);

  // Selected course for syllabus editing
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');

  // Form Modals State
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showSyllabusTopicModal, setShowSyllabusTopicModal] = useState(false);

  // Form Inputs
  const [collegeForm, setCollegeForm] = useState<Partial<College>>({ 
    code: '', 
    name: '', 
    location: '', 
    logo_url: '', 
    image_url: '' 
  });
  const [courseForm, setCourseForm] = useState<Partial<Course>>({ code: '', name: '' });
  const [programForm, setProgramForm] = useState<Partial<Program>>({ code: '', name: '' });
  const [assessmentForm, setAssessmentForm] = useState<Partial<AssessmentType>>({ name: '', default_max_mark: 100 });
  const [topicForm, setTopicForm] = useState<{ topic_no: number; topic_name: string; planned_hours: number }>({ topic_no: 1, topic_name: '', planned_hours: 2 });

  const [editingCollegeId, setEditingCollegeId] = useState<string | null>(null);

  // Add / Edit College
  const handleSaveCollege = () => {
    if (!collegeForm.code || !collegeForm.name) {
      toast.error('Code and Name are required');
      return;
    }

    if (editingCollegeId) {
      const target = store.colleges.find(c => c.id === editingCollegeId);
      if (target) {
        target.code = collegeForm.code.toUpperCase();
        target.name = collegeForm.name;
        target.location = collegeForm.location || '';
        target.logo_url = collegeForm.logo_url;
        target.image_url = collegeForm.image_url;
      }
      toast.success(`College ${collegeForm.name} updated!`);
    } else {
      const newCol: College = {
        id: `col-${Date.now()}`,
        code: collegeForm.code.toUpperCase(),
        name: collegeForm.name,
        location: collegeForm.location || '',
        logo_url: collegeForm.logo_url || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80',
        image_url: collegeForm.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
      };
      store.colleges.push(newCol);
      toast.success(`College ${newCol.code} added`);
    }

    setColleges([...store.colleges]);
    setShowCollegeModal(false);
    setEditingCollegeId(null);
    setCollegeForm({ code: '', name: '', location: '', logo_url: '', image_url: '' });
  };

  // Add Course
  const handleSaveCourse = () => {
    if (!courseForm.code || !courseForm.name) {
      toast.error('Course Code and Name are required');
      return;
    }
    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      code: courseForm.code.toUpperCase(),
      name: courseForm.name,
    };
    store.courses.push(newCourse);
    setCourses([...store.courses]);
    if (!selectedCourseId) {
      setSelectedCourseId(newCourse.id);
    }
    setShowCourseModal(false);
    setCourseForm({ code: '', name: '' });
    toast.success(`Course ${newCourse.name} created`);
  };

  // Add Program
  const handleSaveProgram = () => {
    if (!programForm.code || !programForm.name) {
      toast.error('Program Code and Name are required');
      return;
    }
    const newProg: Program = {
      id: `prog-${Date.now()}`,
      code: programForm.code.toUpperCase(),
      name: programForm.name,
    };
    store.programs.push(newProg);
    setPrograms([...store.programs]);
    setShowProgramModal(false);
    setProgramForm({ code: '', name: '' });
    toast.success(`Program ${newProg.code} created`);
  };

  // Add Assessment Type
  const handleSaveAssessment = () => {
    if (!assessmentForm.name) {
      toast.error('Name is required');
      return;
    }
    const newAt: AssessmentType = {
      id: `at-${Date.now()}`,
      name: assessmentForm.name,
      default_max_mark: Number(assessmentForm.default_max_mark) || 100,
    };
    store.assessmentTypes.push(newAt);
    setAssessmentTypes([...store.assessmentTypes]);
    setShowAssessmentModal(false);
    setAssessmentForm({ name: '', default_max_mark: 100 });
    toast.success(`Assessment Type ${newAt.name} added`);
  };

  // Add Default Syllabus Topic
  const handleSaveTopic = () => {
    if (!topicForm.topic_name || !selectedCourseId) {
      toast.error('Topic name is required');
      return;
    }
    const newTopic: CourseDefaultSyllabus = {
      id: `sy-def-${Date.now()}`,
      course_id: selectedCourseId,
      topic_no: topicForm.topic_no,
      topic_name: topicForm.topic_name,
      planned_hours: Number(topicForm.planned_hours) || 1,
    };
    store.defaultSyllabus.push(newTopic);
    setDefaultSyllabus([...store.defaultSyllabus]);
    setShowSyllabusTopicModal(false);
    setTopicForm({ topic_no: (store.defaultSyllabus.filter(s => s.course_id === selectedCourseId).length + 1), topic_name: '', planned_hours: 2 });
    toast.success('Topic added to default syllabus');
  };

  // CSV/Excel Import for Syllabus Topics
  const handleImportTopics = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourseId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const wb = XLSX.read(event.target?.result, { type: 'binary' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<any>(sheet);
        
        let count = 0;
        data.forEach((row: any, idx: number) => {
          const topic_name = row.topic_name || row['Topic Name'] || row.topic || row.Topic;
          if (topic_name) {
            const topic_no = Number(row.topic_no || row['Topic No'] || (idx + 1));
            const planned_hours = Number(row.planned_hours || row['Planned Hours'] || 2);
            store.defaultSyllabus.push({
              id: `sy-imp-${Date.now()}-${idx}`,
              course_id: selectedCourseId,
              topic_no,
              topic_name,
              planned_hours
            });
            count++;
          }
        });
        setDefaultSyllabus([...store.defaultSyllabus]);
        toast.success(`Imported ${count} syllabus topics!`);
      } catch (err) {
        toast.error('Failed to parse file. Please upload a valid CSV/Excel file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExportDefaultSyllabus = () => {
    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const topics = defaultSyllabus.filter(s => s.course_id === selectedCourseId);
    if (topics.length === 0) {
      toast.error('No default syllabus topics to export');
      return;
    }
    const data = topics.map(t => ({
      'Topic No': t.topic_no,
      'Topic Name': t.topic_name,
      'Planned Hours': t.planned_hours,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Default Syllabus');
    XLSX.writeFile(wb, `${selectedCourse?.code || 'Course'}_Default_Syllabus.xlsx`);
    toast.success('Exported Default Syllabus (.xlsx)');
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const currentCourseSyllabus = defaultSyllabus.filter(s => s.course_id === selectedCourseId).sort((a, b) => a.topic_no - b.topic_no);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Master Data Directory</h1>
          <p className="text-sm text-muted-foreground">Manage partner colleges, degree programs, tool courses, and default syllabi.</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-border bg-card rounded-xl p-1 gap-1">
        <button
          onClick={() => setActiveTab('colleges')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'colleges' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" /> Colleges ({colleges.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'courses' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Courses & Default Syllabus ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('programs')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'programs' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Programs ({programs.length})
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'assessments' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="h-4 w-4" /> Assessment Types ({assessmentTypes.length})
        </button>
      </div>

      {/* Tab 1: Colleges */}
      {activeTab === 'colleges' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold font-heading">Partner Colleges</h2>
            <Button onClick={() => setShowCollegeModal(true)} className="bg-primary text-primary-foreground hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" /> Add College
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
                <tr>
                  <th className="p-4">Logo</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">College Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Campus Image</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {colleges.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs font-mono">
                      No partner colleges added yet. Click "+ Add College" to register your first college.
                    </td>
                  </tr>
                ) : (
                  colleges.map((col) => (
                    <tr key={col.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        {col.logo_url ? (
                          <img src={col.logo_url} alt={col.name} className="h-9 w-9 rounded-lg object-cover border border-border bg-background shadow-xs" />
                        ) : (
                          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold font-mono text-xs text-primary">
                            {col.code}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-accent">{col.code}</td>
                      <td className="p-4 font-medium text-foreground">{col.name}</td>
                      <td className="p-4 text-muted-foreground">{col.location || '—'}</td>
                      <td className="p-4">
                        {col.image_url ? (
                          <img src={col.image_url} alt={`${col.name} Campus`} className="h-10 w-20 rounded-lg object-cover border border-border shadow-xs" />
                        ) : (
                          <span className="text-xs text-muted-foreground font-mono">No image</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary hover:bg-primary/10" 
                          onClick={() => {
                            setEditingCollegeId(col.id);
                            setCollegeForm({
                              code: col.code,
                              name: col.name,
                              location: col.location || '',
                              logo_url: col.logo_url || '',
                              image_url: col.image_url || '',
                            });
                            setShowCollegeModal(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                          onClick={() => {
                            store.colleges = store.colleges.filter(c => c.id !== col.id);
                            setColleges([...store.colleges]);
                            toast.success('College removed');
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Courses & Default Syllabus */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Courses list */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold font-heading">Tool Courses</h2>
              <Button size="sm" onClick={() => setShowCourseModal(true)} className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-1" /> Add Course
              </Button>
            </div>
            <div className="bg-card rounded-2xl border border-border p-2 space-y-1">
              {courses.map((crs) => {
                const topicCount = defaultSyllabus.filter(s => s.course_id === crs.id).length;
                return (
                  <button
                    key={crs.id}
                    onClick={() => setSelectedCourseId(crs.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                      selectedCourseId === crs.id 
                        ? 'bg-primary-tint/80 border border-primary/30 text-primary font-semibold' 
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">{crs.code}</span>
                      <span>{crs.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{topicCount} topics</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Default Syllabus Editor */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
              <div>
                <h3 className="font-heading font-bold text-foreground">
                  Default Syllabus: <span className="text-primary font-mono">{selectedCourse?.name} ({selectedCourse?.code})</span>
                </h3>
                <p className="text-xs text-muted-foreground">Template syllabus copied automatically when adding this course to a batch.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleExportDefaultSyllabus} className="h-8 text-xs">
                  <Download className="h-3.5 w-3.5 mr-1" /> Export Syllabus (.xlsx)
                </Button>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80">
                  <Upload className="h-3.5 w-3.5" /> CSV Import
                  <input type="file" accept=".csv, .xlsx" onChange={handleImportTopics} className="hidden" />
                </label>
                <Button size="sm" onClick={() => {
                  setTopicForm({ topic_no: currentCourseSyllabus.length + 1, topic_name: '', planned_hours: 2 });
                  setShowSyllabusTopicModal(true);
                }} className="bg-primary text-primary-foreground">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Topic
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
                  <tr>
                    <th className="p-3 w-16 text-center">#</th>
                    <th className="p-3">Topic Description</th>
                    <th className="p-3 w-28 text-center">Planned Hours</th>
                    <th className="p-3 w-16 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentCourseSyllabus.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted-foreground text-xs font-mono">
                        No default syllabus topics configured for this course yet.
                      </td>
                    </tr>
                  ) : (
                    currentCourseSyllabus.map((topic) => (
                      <tr key={topic.id} className="hover:bg-muted/30">
                        <td className="p-3 text-center font-mono font-bold text-muted-foreground">{topic.topic_no}</td>
                        <td className="p-3 font-medium text-foreground">{topic.topic_name}</td>
                        <td className="p-3 text-center font-mono text-xs">{topic.planned_hours} hrs</td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => {
                            store.defaultSyllabus = store.defaultSyllabus.filter(s => s.id !== topic.id);
                            setDefaultSyllabus([...store.defaultSyllabus]);
                          }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Programs */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold font-heading">Academic Programs</h2>
            <Button onClick={() => setShowProgramModal(true)} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" /> Add Program
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {programs.length === 0 ? (
              <div className="col-span-full card-meridian p-8 text-center text-xs font-mono text-muted-foreground">
                No academic programs added yet. Click "+ Add Program" to create degree programs.
              </div>
            ) : (
              programs.map((prog) => (
                <div key={prog.id} className="card-meridian p-5 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-accent/15 text-accent font-bold">{prog.code}</span>
                    <h3 className="font-bold text-foreground mt-2">{prog.name}</h3>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => {
                    store.programs = store.programs.filter(p => p.id !== prog.id);
                    setPrograms([...store.programs]);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Assessment Types */}
      {activeTab === 'assessments' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold font-heading">Assessment Types & Default Max Marks</h2>
            <Button onClick={() => setShowAssessmentModal(true)} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" /> Add Assessment Type
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assessmentTypes.length === 0 ? (
              <div className="col-span-full card-meridian p-8 text-center text-xs font-mono text-muted-foreground">
                No assessment types added yet. Click "+ Add Assessment Type" to define grading categories.
              </div>
            ) : (
              assessmentTypes.map((at) => (
                <div key={at.id} className="card-meridian p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-base">{at.name}</h3>
                    <div className="text-xs text-muted-foreground font-mono mt-1">
                      Default Suggestion: <span className="font-bold text-primary">{at.default_max_mark} marks</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => {
                    store.assessmentTypes = store.assessmentTypes.filter(a => a.id !== at.id);
                    setAssessmentTypes([...store.assessmentTypes]);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Add College */}
      {showCollegeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">{editingCollegeId ? 'Edit Partner College' : 'Add Partner College'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">College Short Code (e.g. MIM)</label>
                <Input value={collegeForm.code} onChange={(e) => setCollegeForm({ ...collegeForm, code: e.target.value })} placeholder="MIM" className="mt-1 font-mono uppercase" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Full College Name</label>
                <Input value={collegeForm.name} onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })} placeholder="Marian College" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Location / Campus</label>
                <Input value={collegeForm.location} onChange={(e) => setCollegeForm({ ...collegeForm, location: e.target.value })} placeholder="Kuttikkanam" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">College Logo URL</label>
                <Input value={collegeForm.logo_url} onChange={(e) => setCollegeForm({ ...collegeForm, logo_url: e.target.value })} placeholder="https://example.com/logo.png" className="mt-1 font-mono" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">College Campus Image URL</label>
                <Input value={collegeForm.image_url} onChange={(e) => setCollegeForm({ ...collegeForm, image_url: e.target.value })} placeholder="https://example.com/campus.jpg" className="mt-1 font-mono" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => { setShowCollegeModal(false); setEditingCollegeId(null); }}>Cancel</Button>
              <Button onClick={handleSaveCollege} className="bg-primary text-primary-foreground">
                {editingCollegeId ? 'Save Changes' : 'Add College'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Course */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">Add Tool Course</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Course Code (e.g. XL, PBI, R)</label>
                <Input value={courseForm.code} onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })} placeholder="PBI" className="mt-1 font-mono uppercase" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Course Name</label>
                <Input value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} placeholder="Power BI" className="mt-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCourseModal(false)}>Cancel</Button>
              <Button onClick={handleSaveCourse} className="bg-primary text-primary-foreground">Save Course</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Program */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">Add Academic Program</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Program Code (e.g. BBA)</label>
                <Input value={programForm.code} onChange={(e) => setProgramForm({ ...programForm, code: e.target.value })} placeholder="BBA" className="mt-1 font-mono uppercase" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Program Name</label>
                <Input value={programForm.name} onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })} placeholder="Bachelor of Business Administration" className="mt-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowProgramModal(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram} className="bg-primary text-primary-foreground">Save Program</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Assessment Type */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">Add Assessment Type</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Assessment Type Name</label>
                <Input value={assessmentForm.name} onChange={(e) => setAssessmentForm({ ...assessmentForm, name: e.target.value })} placeholder="Assignment / Exam / Quiz" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Default Max Mark (Suggestion)</label>
                <Input type="number" value={assessmentForm.default_max_mark} onChange={(e) => setAssessmentForm({ ...assessmentForm, default_max_mark: Number(e.target.value) })} placeholder="100" className="mt-1 font-mono" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAssessmentModal(false)}>Cancel</Button>
              <Button onClick={handleSaveAssessment} className="bg-primary text-primary-foreground">Save Type</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Add Default Syllabus Topic */}
      {showSyllabusTopicModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading">Add Topic to {selectedCourse?.name} Default Syllabus</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Topic Number</label>
                <Input type="number" value={topicForm.topic_no} onChange={(e) => setTopicForm({ ...topicForm, topic_no: Number(e.target.value) })} className="mt-1 font-mono" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Topic Name / Title</label>
                <Input value={topicForm.topic_name} onChange={(e) => setTopicForm({ ...topicForm, topic_name: e.target.value })} placeholder="Data Modeling & DAX" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Planned Duration (Hours)</label>
                <Input type="number" step="0.5" value={topicForm.planned_hours} onChange={(e) => setTopicForm({ ...topicForm, planned_hours: Number(e.target.value) })} className="mt-1 font-mono" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowSyllabusTopicModal(false)}>Cancel</Button>
              <Button onClick={handleSaveTopic} className="bg-primary text-primary-foreground">Save Topic</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
