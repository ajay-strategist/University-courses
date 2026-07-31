import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    // 1. Initialize user client to verify user identity & role
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized access: Invalid token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Check if the user is an admin
    const { data: profile, error: profErr } = await userClient
      .from("uct_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profErr || !profile || profile.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden: Admin role required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // 2. Initialize admin client with service key for backend operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Parse payload
    const { mode, payload, skip_errored, file_path } = await req.json();

    const summary: any = {
      colleges: { new: 0, updated: 0, errored: 0 },
      programs: { new: 0, updated: 0, errored: 0 },
      courses: { new: 0, updated: 0, errored: 0 },
      course_default_syllabus: { new: 0, updated: 0, errored: 0 },
      users: { new: 0, updated: 0, errored: 0 },
      batches: { new: 0, updated: 0, errored: 0 },
      students: { new: 0, updated: 0, errored: 0 },
      batch_courses: { new: 0, updated: 0, errored: 0 },
      batch_course_syllabus: { new: 0, updated: 0, errored: 0 },
      assessments: { new: 0, updated: 0, errored: 0 },
      assessment_marks: { new: 0, updated: 0, errored: 0 },
      attendance: { new: 0, updated: 0, errored: 0 },
    };

    // Lookup caches
    const collegeCodeToId: Record<string, string> = {};
    const programCodeToId: Record<string, string> = {};
    const courseCodeToId: Record<string, string> = {};
    const userEmailToId: Record<string, string> = {};
    const batchCodeToId: Record<string, string> = {};
    const batchCourseKeyToId: Record<string, string> = {};
    const studentRegToId: Record<string, string> = {};
    const assessmentKeyToId: Record<string, string> = {};

    // Retrieve existing items
    const { data: cols } = await adminClient.from("uct_colleges").select("id, code");
    const { data: progs } = await adminClient.from("uct_programs").select("id, code");
    const { data: crses } = await adminClient.from("uct_courses").select("id, code");
    const { data: profs } = await adminClient.from("uct_profiles").select("id, email");
    const { data: batches } = await adminClient.from("uct_batches").select("id, code");
    
    cols?.forEach(c => collegeCodeToId[c.code.toUpperCase()] = c.id);
    progs?.forEach(p => programCodeToId[p.code.toUpperCase()] = p.id);
    crses?.forEach(c => courseCodeToId[c.code.toUpperCase()] = c.id);
    profs?.forEach(u => userEmailToId[u.email.toLowerCase()] = u.id);
    batches?.forEach(b => batchCodeToId[b.code.toUpperCase()] = b.id);

    // Fetch batch courses
    const { data: bcs } = await adminClient.from("uct_batch_courses").select("id, batch_id, course_id");
    bcs?.forEach(bc => {
      const bCode = batches?.find(x => x.id === bc.batch_id)?.code;
      const cCode = crses?.find(x => x.id === bc.course_id)?.code;
      if (bCode && cCode) {
        batchCourseKeyToId[`${bCode.toUpperCase()}_${cCode.toUpperCase()}`] = bc.id;
      }
    });

    // Fetch students
    const { data: stds } = await adminClient.from("uct_students").select("id, batch_id, register_no");
    stds?.forEach(s => {
      const bCode = batches?.find(x => x.id === s.batch_id)?.code;
      if (bCode) {
        studentRegToId[`${bCode.toUpperCase()}_${s.register_no.toUpperCase()}`] = s.id;
      }
    });

    // Fetch assessments
    const { data: asms } = await adminClient.from("uct_assessments").select("id, batch_course_id, name");
    asms?.forEach(a => {
      assessmentKeyToId[`${a.batch_course_id}_${a.name.toUpperCase()}`] = a.id;
    });

    // Fetch default syllabus topics
    const { data: defaultSyllabus } = await adminClient.from("uct_course_default_syllabus").select("id, course_id, topic_no");
    const { data: batchSyllabus } = await adminClient.from("uct_batch_course_syllabus").select("id, batch_course_id, topic_no");
    const { data: assessmentTypes } = await adminClient.from("uct_assessment_types").select("id, name");
    const { data: sessions } = await adminClient.from("uct_sessions").select("id, batch_course_id, session_date, hour_no");
    const { data: attendance } = await adminClient.from("uct_attendance").select("id, session_id, student_id");
    const { data: assessmentMarks } = await adminClient.from("uct_assessment_marks").select("id, assessment_id, student_id");

    // Upsert helper with error catching
    const runUpsert = async (table: string, item: any, isUpdate: boolean, countsKey: string) => {
      try {
        const { data, error } = await adminClient.from(table).upsert(item).select("id").single();
        if (error) throw error;
        if (isUpdate) summary[countsKey].updated++;
        else summary[countsKey].new++;
        return data.id;
      } catch (e: any) {
        summary[countsKey].errored++;
        if (!skip_errored) throw new Error(`Table ${table} error: ${e.message}`);
        return null;
      }
    };

    // 1. COLLEGES
    if (payload.colleges) {
      for (const row of payload.colleges) {
        const codeUpper = row.code.trim().toUpperCase();
        const existingId = collegeCodeToId[codeUpper];
        const collegeItem = {
          ...(existingId && { id: existingId }),
          code: row.code.trim(),
          name: row.name.trim(),
          location: row.location || "",
          contact_person: row.contact_person || "",
          contact_email: row.contact_email || "",
          contact_phone: row.contact_phone || "",
        };
        const id = await runUpsert("uct_colleges", collegeItem, !!existingId, "colleges");
        if (id) collegeCodeToId[codeUpper] = id;
      }
    }

    // 2. PROGRAMS
    if (payload.programs) {
      for (const row of payload.programs) {
        const codeUpper = row.code.trim().toUpperCase();
        const existingId = programCodeToId[codeUpper];
        const programItem = {
          ...(existingId && { id: existingId }),
          code: row.code.trim(),
          name: row.name.trim(),
        };
        const id = await runUpsert("uct_programs", programItem, !!existingId, "programs");
        if (id) programCodeToId[codeUpper] = id;
      }
    }

    // 3. COURSES
    if (payload.courses) {
      for (const row of payload.courses) {
        const codeUpper = row.code.trim().toUpperCase();
        const existingId = courseCodeToId[codeUpper];
        const courseItem = {
          ...(existingId && { id: existingId }),
          code: row.code.trim(),
          name: row.name.trim(),
        };
        const id = await runUpsert("uct_courses", courseItem, !!existingId, "courses");
        if (id) courseCodeToId[codeUpper] = id;
      }
    }

    // 4. COURSE DEFAULT SYLLABUS
    if (payload.courseDefaultSyllabus) {
      for (const row of payload.courseDefaultSyllabus) {
        try {
          const courseId = courseCodeToId[row.course_code.trim().toUpperCase()];
          if (!courseId) throw new Error(`Course code not found: ${row.course_code}`);
          const topicNo = Number(row.topic_no);
          const existing = defaultSyllabus?.find(s => s.course_id === courseId && s.topic_no === topicNo);
          const item = {
            ...(existing && { id: existing.id }),
            course_id: courseId,
            topic_no: topicNo,
            topic_name: row.topic_name.trim(),
            planned_hours: Number(row.planned_hours) || 2,
          };
          await runUpsert("uct_course_default_syllabus", item, !!existing, "course_default_syllabus");
        } catch (e: any) {
          summary.course_default_syllabus.errored++;
          if (!skip_errored) throw e;
        }
      }
    }

    // 5. USERS
    if (payload.users) {
      for (const row of payload.users) {
        try {
          const emailLower = row.email.trim().toLowerCase();
          let existingId = userEmailToId[emailLower];
          const isUpdate = !!existingId;

          if (!existingId) {
            // Check auth.users by email via admin API
            const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers();
            const existingAuth = usersData?.users?.find(u => u.email?.toLowerCase() === emailLower);
            
            if (existingAuth) {
              existingId = existingAuth.id;
            } else {
              // Create new user in auth
              const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
                email: emailLower,
                password: "password",
                email_confirm: true,
                user_metadata: { full_name: row.full_name.trim() },
              });
              if (createError) throw createError;
              existingId = newUser.user.id;
            }
          }

          const profileItem = {
            id: existingId,
            email: emailLower,
            full_name: row.full_name.trim(),
            phone: row.phone || "",
            role: row.role.trim().toLowerCase(),
            must_change_password: !isUpdate,
          };

          const id = await runUpsert("uct_profiles", profileItem, isUpdate, "users");
          if (id) userEmailToId[emailLower] = id;
        } catch (e: any) {
          summary.users.errored++;
          if (!skip_errored) throw e;
        }
      }
    }

    // 6. BATCHES
    if (payload.batches) {
      for (const row of payload.batches) {
        try {
          const collegeId = collegeCodeToId[row.college_code.trim().toUpperCase()];
          const programId = programCodeToId[row.program_code.trim().toUpperCase()];
          if (!collegeId) throw new Error(`College code not found: ${row.college_code}`);
          if (!programId) throw new Error(`Program code not found: ${row.program_code}`);

          const derivedBatchCode = `${row.college_code.trim().toUpperCase()}-${row.program_code.trim().toUpperCase()}-${row.academic_year.trim()}`;
          const existingId = batchCodeToId[derivedBatchCode];

          const ccEmail = row.college_coordinator_email?.trim().toLowerCase();
          const scEmail = row.student_coordinator_email?.trim().toLowerCase();
          const ccId = ccEmail ? userEmailToId[ccEmail] : null;
          const scId = scEmail ? userEmailToId[scEmail] : null;

          const batchItem = {
            ...(existingId && { id: existingId }),
            code: derivedBatchCode,
            college_id: collegeId,
            program_id: programId,
            academic_year: row.academic_year.trim(),
            current_semester: Number(row.current_semester) || 1,
            college_coordinator_id: ccId,
            student_coordinator_id: scId,
            start_date: row.start_date || null,
            end_date: row.end_date || null,
          };

          const id = await runUpsert("uct_batches", batchItem, !!existingId, "batches");
          if (id) batchCodeToId[derivedBatchCode] = id;
        } catch (e: any) {
          summary.batches.errored++;
          if (!skip_errored) throw e;
        }
      }
    }

    // 7. STUDENTS
    if (payload.students) {
      for (const row of payload.students) {
        try {
          const bCode = row.batch_code.trim().toUpperCase();
          const batchId = batchCodeToId[bCode];
          if (!batchId) throw new Error(`Batch code not found: ${row.batch_code}`);

          const regKey = `${bCode}_${String(row.register_no).trim().toUpperCase()}`;
          const existingId = studentRegToId[regKey];

          const studentItem = {
            ...(existingId && { id: existingId }),
            batch_id: batchId,
            register_no: String(row.register_no).trim(),
            name: row.name.trim(),
            class: row.class || "",
            phone: row.phone || "",
            status: "active",
          };

          const id = await runUpsert("uct_students", studentItem, !!existingId, "students");
          if (id) studentRegToId[regKey] = id;
        } catch (e: any) {
          summary.students.errored++;
          if (!skip_errored) throw e;
        }
      }
    }

    // 8. BATCH COURSES
    if (payload.batchCourses) {
      for (const row of payload.batchCourses) {
        try {
          const bCode = row.batch_code.trim().toUpperCase();
          const cCode = row.course_code.trim().toUpperCase();
          const batchId = batchCodeToId[bCode];
          const courseId = courseCodeToId[cCode];
          if (!batchId) throw new Error(`Batch code not found: ${row.batch_code}`);
          if (!courseId) throw new Error(`Course code not found: ${row.course_code}`);

          const trainerEmail = row.trainer_email?.trim().toLowerCase();
          const trainerId = trainerEmail ? userEmailToId[trainerEmail] : null;

          const key = `${bCode}_${cCode}`;
          const existingId = batchCourseKeyToId[key];

          const bcItem = {
            ...(existingId && { id: existingId }),
            batch_id: batchId,
            course_id: courseId,
            trainer_id: trainerId,
            semester: Number(row.semester) || 1,
            planned_hours: Number(row.planned_hours) || 30,
            start_date: row.start_date || null,
            end_date: row.end_date || null,
            status: "Active",
          };

          const id = await runUpsert("uct_batch_courses", bcItem, !!existingId, "batch_courses");
          if (id) {
            batchCourseKeyToId[key] = id;
            
            // Seed syllabus from Course Default Syllabus if it is a new assignment
            if (!existingId) {
              const { data: defSyls } = await adminClient
                .from("uct_course_default_syllabus")
                .select("*")
                .eq("course_id", courseId);

              if (defSyls && defSyls.length > 0) {
                const batchSyls = defSyls.map(t => ({
                  batch_course_id: id,
                  topic_no: t.topic_no,
                  topic_name: t.topic_name,
                  planned_hours: t.planned_hours,
                  is_completed: false,
                }));
                await adminClient.from("uct_batch_course_syllabus").insert(batchSyls);
              }
            }
          }
        } catch (e: any) {
          summary.batch_courses.errored++;
          if (!skip_errored) throw e;
        }
      }
    }

    // 9. BATCH COURSE SYLLABUS
    if (payload.batchSyllabus) {
      for (const row of payload.batchSyllabus) {
        try {
          const bCode = row.batch_code.trim().toUpperCase();
          const cCode = row.course_code.trim().toUpperCase();
          const batchCourseId = batchCourseKeyToId[`${bCode}_${cCode}`];
          if (!batchCourseId) throw new Error(`Batch course not assigned: ${row.batch_code} - ${row.course_code}`);

          const topicNo = Number(row.topic_no);
          const existing = batchSyllabus?.find(s => s.batch_course_id === batchCourseId && s.topic_no === topicNo);

          const isCompleted = String(row.is_completed).toLowerCase() === "true" || row.is_completed === true || row.is_completed === 1 || row.is_completed === "1";

          const sylItem = {
            ...(existing && { id: existing.id }),
            batch_course_id: batchCourseId,
            topic_no: topicNo,
            topic_name: row.topic_name.trim(),
            planned_hours: Number(row.planned_hours) || 2,
            is_completed: isCompleted,
            completed_date: row.completed_date || null,
          };

          await runUpsert("uct_batch_course_syllabus", sylItem, !!existing, "batch_course_syllabus");
        } catch (e: any) {
          summary.batch_course_syllabus.errored++;
          if (!skip_errored) throw e;
        }
      }
    }

    // 10. ASSESSMENTS
    if (payload.assessments) {
      for (const row of payload.assessments) {
        try {
          const bCode = row.batch_code.trim().toUpperCase();
          const cCode = row.course_code.trim().toUpperCase();
          const batchCourseId = batchCourseKeyToId[`${bCode}_${cCode}`];
          if (!batchCourseId) throw new Error(`Batch course not assigned: ${row.batch_code} - ${row.course_code}`);

          const nameUpper = row.assessment_name.trim().toUpperCase();
          const existingId = assessmentKeyToId[`${batchCourseId}_${nameUpper}`];

          // Resolve assessment type
          const typeName = row.type.trim();
          let typeId = assessmentTypes?.find(t => t.name.toLowerCase() === typeName.toLowerCase())?.id;
          if (!typeId) {
            const { data: newType, error: typeErr } = await adminClient
              .from("uct_assessment_types")
              .insert({ name: typeName, code: typeName.replace(/\s+/g, "-").toLowerCase() })
              .select("id")
              .single();
            if (typeErr) throw typeErr;
            typeId = newType.id;
          }

          const assessmentItem = {
            ...(existingId && { id: existingId }),
            batch_course_id: batchCourseId,
            name: row.assessment_name.trim(),
            type_id: typeId,
            max_mark: Number(row.max_mark) || 100,
            assessment_date: row.assessment_date || null,
          };

          const id = await runUpsert("uct_assessments", assessmentItem, !!existingId, "assessments");
          if (id) assessmentKeyToId[`${batchCourseId}_${nameUpper}`] = id;
        } catch (e: any) {
          summary.assessments.errored++;
          if (!skip_errored) throw e;
        }
      }
    }

    // 11. ASSESSMENT MARKS
    if (payload.assessmentMarks) {
      for (const row of payload.assessmentMarks) {
        try {
          const bCode = row.batch_code.trim().toUpperCase();
          const cCode = row.course_code.trim().toUpperCase();
          const batchCourseId = batchCourseKeyToId[`${bCode}_${cCode}`];
          if (!batchCourseId) throw new Error(`Batch course not assigned: ${row.batch_code} - ${row.course_code}`);

          const assessmentId = assessmentKeyToId[`${batchCourseId}_${row.assessment_name.trim().toUpperCase()}`];
          if (!assessmentId) throw new Error(`Assessment not found: ${row.assessment_name}`);

          const studentId = studentRegToId[`${bCode}_${String(row.register_no).trim().toUpperCase()}`];
          if (!studentId) throw new Error(`Student not found in batch: ${row.register_no}`);

          const existing = assessmentMarks?.find(m => m.assessment_id === assessmentId && m.student_id === studentId);

          const markItem = {
            ...(existing && { id: existing.id }),
            assessment_id: assessmentId,
            student_id: studentId,
            mark: Number(row.mark) || 0,
          };

          await runUpsert("uct_assessment_marks", markItem, !!existing, "assessment_marks");
        } catch (e: any) {
          summary.assessment_marks.errored++;
          if (!skip_errored) throw e;
        }
      }
    }

    // 12. ATTENDANCE
    if (payload.attendance) {
      for (const row of payload.attendance) {
        try {
          const bCode = row.batch_code.trim().toUpperCase();
          const cCode = row.course_code.trim().toUpperCase();
          const batchCourseId = batchCourseKeyToId[`${bCode}_${cCode}`];
          if (!batchCourseId) throw new Error(`Batch course not assigned: ${row.batch_code} - ${row.course_code}`);

          const studentId = studentRegToId[`${bCode}_${String(row.register_no).trim().toUpperCase()}`];
          if (!studentId) throw new Error(`Student not found in batch: ${row.register_no}`);

          const sDate = row.session_date;
          const hourNo = Number(row.hour_no);

          // Get or create session
          let sessId = sessions?.find(s => s.batch_course_id === batchCourseId && s.session_date === sDate && s.hour_no === hourNo)?.id;
          if (!sessId) {
            const { data: newSess, error: sessErr } = await adminClient
              .from("uct_sessions")
              .insert({ batch_course_id: batchCourseId, session_date: sDate, hour_no: hourNo })
              .select("id")
              .single();
            if (sessErr) throw sessErr;
            sessId = newSess.id;
          }

          const existing = attendance?.find(a => a.session_id === sessId && a.student_id === studentId);

          const attStatus = String(row.status).trim().toLowerCase();
          const statusMapped = attStatus === "absent" || attStatus === "a" ? "absent" : (attStatus === "late" || attStatus === "l" ? "late" : "present");

          const attItem = {
            ...(existing && { id: existing.id }),
            session_id: sessId,
            student_id: studentId,
            status: statusMapped,
          };

          await runUpsert("uct_attendance", attItem, !!existing, "attendance");
        } catch (e: any) {
          summary.attendance.errored++;
          if (!skip_errored) throw e;
        }
      }
    }

    // 3. Create Migration Log Row
    const migrationRunRow = {
      uploaded_by: user.id,
      file_path: file_path || "upload.xlsx",
      mode: mode,
      status: "committed",
      summary: summary,
    };
    await adminClient.from("uct_migration_runs").insert(migrationRunRow);

    return new Response(JSON.stringify({ success: true, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
