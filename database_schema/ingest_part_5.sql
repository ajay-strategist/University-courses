INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('ba7d9ba3-41c2-514c-98bf-3ff03c03c778', '1f92c98a-aa28-59f6-a946-dc40be193c0a', 'be5ab52d-59fb-5532-97a2-2a563c687a38', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('70c5b670-539a-54e4-bb24-239f30d84234', '1f92c98a-aa28-59f6-a946-dc40be193c0a', '825f3153-b9ac-5b9a-bb10-0cac4b9af9ba', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('85a7e551-de93-5295-830f-3b821cb7799f', '1f92c98a-aa28-59f6-a946-dc40be193c0a', '9fe4cac7-4610-59ea-8a8e-addd43029267', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('05f25ce1-a57f-5b9c-a53c-7debd4bafbd5', '1f92c98a-aa28-59f6-a946-dc40be193c0a', 'de59512a-dc59-5dd9-9ac3-ad5fffaad0b8', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('555ca348-59a2-5c3d-8324-74e4fcc9be7f', '1f92c98a-aa28-59f6-a946-dc40be193c0a', 'c229408c-9473-53a5-b671-af86be027fd0', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('f1afbeb4-1f05-55b0-8cc7-174844421886', '1f92c98a-aa28-59f6-a946-dc40be193c0a', 'ece8757c-b4b2-57b1-8214-d9beba003fb6', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('72013cb7-53ae-5896-8e67-d70be97ebdd2', '1f92c98a-aa28-59f6-a946-dc40be193c0a', '3932318a-ef2d-5d80-967d-4fe380537ecf', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('94e6d335-df89-5470-9faf-7441239b370d', '1f92c98a-aa28-59f6-a946-dc40be193c0a', '2dac025d-fa65-5cd3-9ad2-eb2ef7e92b66', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('6ed9d1ad-3f11-5614-bf25-c6ce284d62dc', '1f92c98a-aa28-59f6-a946-dc40be193c0a', '7536a037-73f5-58c6-a28c-f73b589f758e', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('108f5836-097a-5325-bfbd-6b152517ad04', '1f92c98a-aa28-59f6-a946-dc40be193c0a', '3936e855-47c8-5b31-8a1e-d73815caa812', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('5cf53b3e-21f8-5735-bf10-e4ebfcfb8084', '1f92c98a-aa28-59f6-a946-dc40be193c0a', '4adc5ed6-9a11-5f2c-9204-52e5d3241349', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_sessions (id, batch_course_id, session_date, hour_no) VALUES ('532dd8ac-d17a-5b8a-baf7-137731afe405', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', '2026-08-14', 2) ON CONFLICT (batch_course_id, session_date, hour_no) DO NOTHING;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('863ba070-42da-51a4-a8e4-ec08248e38a4', '532dd8ac-d17a-5b8a-baf7-137731afe405', '9fcf6c02-62a2-5a35-9d21-f8ef3ab1b756', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('92f33ac7-890f-5056-a74e-c4eb494832f2', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'be87c13d-81ed-5987-876e-e962139c3796', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('cdbb4ea4-0d21-52c4-9337-c96794ddde7d', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'b3e3c006-d00e-5a08-87b4-ac3f2a765b54', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('a092d691-5960-57cb-b7bb-03996fc13cd3', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'a0b286a4-7d2b-5305-b85d-6b000d66da67', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('7622838d-9318-5ff6-8f2b-d624d5fb4f80', '532dd8ac-d17a-5b8a-baf7-137731afe405', '60e21686-0af0-57af-a4db-abdc4aaaa403', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('62b0b23c-e793-5307-a077-b628b719946d', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'd3f610fc-b72f-5f80-8030-ba6a6fc6f364', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('dcaf124f-066b-553c-b8a6-44974725bb9f', '532dd8ac-d17a-5b8a-baf7-137731afe405', '97a3ceac-5f08-539b-83bb-2d477b6bcc39', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('4c06ed8c-5cd9-5e1f-9a06-45b47f7fe9bc', '532dd8ac-d17a-5b8a-baf7-137731afe405', '870076c9-ba6d-5cbf-a1c8-f3f518774a95', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('daf53541-8473-5dad-8be1-74e596e049f9', '532dd8ac-d17a-5b8a-baf7-137731afe405', '51b16ce0-f2d8-5dae-8cac-576008d28ea9', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('a27b3671-a66a-51de-94eb-3fc3160cffbf', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'c9df319b-6a09-5553-b05d-7f7af7a0163d', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('8ea1cfab-1e37-544e-9226-028944f53ac1', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'd584da96-44b0-5ca5-bad3-735fd79ac139', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('a8406b67-c1d7-5c8b-92e2-648e987e8a06', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'afc72ebf-9477-50fe-9a36-10190ae3c837', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('8e619b1a-7eec-5796-a6af-a1f0faed49c1', '532dd8ac-d17a-5b8a-baf7-137731afe405', '219a401d-b746-5a10-9c37-b84d54a8162d', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('4636b1af-8a6c-5b9e-946c-d9a6fd34716c', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'eab3057e-8817-562b-aa4d-135120edf8a1', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('5c1c81ce-659f-5240-ad15-b517c2cfea6d', '532dd8ac-d17a-5b8a-baf7-137731afe405', '65eae68e-b622-59e0-97f8-ae7a5cef2b00', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('c8a26999-2bd8-50d2-99a7-865dc2095184', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'f8030b0c-271f-52e9-b865-37c3cf4245df', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('16a5d5f0-e789-5559-b318-4313375d6d51', '532dd8ac-d17a-5b8a-baf7-137731afe405', '09fb4d93-d013-5f91-879c-599400962cbb', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('cd765522-33b3-5839-9932-33554b6e9d5e', '532dd8ac-d17a-5b8a-baf7-137731afe405', '438431fe-6131-5345-871b-e992457cdae9', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('5345406b-83c7-55b5-b12f-752fbc0d29a2', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'f3f4dc30-ea50-5df5-838b-371903d80182', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('dd590f9d-0868-58f7-8a0b-5fe7eb6b7d02', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'f7805548-5e94-5968-95f6-eadab260cc24', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('4567371f-a065-535b-a229-7f353000614f', '532dd8ac-d17a-5b8a-baf7-137731afe405', '0c192fae-5043-5422-833a-fb3e74dd9826', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('88d05cff-7c53-5b07-ad44-b51b0c99230f', '532dd8ac-d17a-5b8a-baf7-137731afe405', '857acbe5-daca-5a2c-9958-525ca0a09d30', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('1555aae4-53af-59ca-b4b7-eb35b35ddb3a', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'a11f05f7-153a-5cb1-b210-2cfb6b0411d6', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('a27294a9-9787-563c-9192-28fc9bd9540f', '532dd8ac-d17a-5b8a-baf7-137731afe405', '1cc042ad-f66a-5b6e-a6d1-8f9b7210c445', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('79ddc660-a62d-5ed7-b66e-9c7fa513ae8b', '532dd8ac-d17a-5b8a-baf7-137731afe405', '51c2e598-fe7e-57bf-b364-82e4e79c7275', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('bb8c66bd-5abd-527b-afb1-c2a0df87b0b8', '532dd8ac-d17a-5b8a-baf7-137731afe405', '8c603c6b-686e-5f3f-8571-d32616ce94cd', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('55984f7c-c638-5045-86b9-6c207e41c48b', '532dd8ac-d17a-5b8a-baf7-137731afe405', '5fd2a0f3-22ff-55b2-8f95-2af464f290f5', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('161f3f4a-0dd5-5081-b1e7-07582bf9944d', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'a19de4fa-538f-5a3d-a8a6-8936f55bb16b', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('f2dfbc42-4d8c-5e1d-9c30-ceddb3a0f873', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'b5349ed4-2c20-59f7-b3f3-8d0356b3ba9d', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('7364ed7c-e354-5ea3-ae51-9302ca49404e', '532dd8ac-d17a-5b8a-baf7-137731afe405', '8cb0acb9-9db3-552e-bdf4-4c3582e51603', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('055d523b-8757-542e-8bc6-6e9eaadb6daa', '532dd8ac-d17a-5b8a-baf7-137731afe405', '64c68a90-e521-5b98-bca1-323fdf67be52', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('14672b97-99ae-500b-ba6f-53cc3863ef58', '532dd8ac-d17a-5b8a-baf7-137731afe405', '9773e005-4c39-52a5-833c-c74504422c0b', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('6f9217ac-264f-5eef-a11c-72facd406050', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'dfe09b65-330b-53ac-8dc3-c4cb9a89fc13', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('794b652f-886c-5d22-b28a-f40fed1018e1', '532dd8ac-d17a-5b8a-baf7-137731afe405', '14a0e5f7-a95d-5212-84be-1225bd2cfa89', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('922c59ec-d0e4-536d-bab1-3eeecfa9a4b0', '532dd8ac-d17a-5b8a-baf7-137731afe405', '1af296c2-5d23-5fd6-a84a-158affc72f21', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('532478bf-8c8d-5151-83a9-e32438ce27d7', '532dd8ac-d17a-5b8a-baf7-137731afe405', '9311d9ed-97b9-5f57-a43c-a912a4e91469', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('23e471c4-bec9-5117-b159-dee41c54a7d1', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'c94ed674-56ff-5ef3-8b50-f03658868142', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('78665e98-8262-56b0-92fa-c86e2d2c7e55', '532dd8ac-d17a-5b8a-baf7-137731afe405', '1c4663fe-4591-5edb-b69a-f18e431ce538', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('62c2c368-1b16-5673-bb16-803a868b583c', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'be5ab52d-59fb-5532-97a2-2a563c687a38', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('07c200d8-144b-54eb-99d9-17cdbf70b257', '532dd8ac-d17a-5b8a-baf7-137731afe405', '825f3153-b9ac-5b9a-bb10-0cac4b9af9ba', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('c3d1feb0-d00f-524a-8c88-c82eb3708ff0', '532dd8ac-d17a-5b8a-baf7-137731afe405', '9fe4cac7-4610-59ea-8a8e-addd43029267', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('09c4cd10-f39e-51b9-87f8-2835112b77f3', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'de59512a-dc59-5dd9-9ac3-ad5fffaad0b8', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('2ea3eca9-94b8-527f-a9e1-409f78657289', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'c229408c-9473-53a5-b671-af86be027fd0', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('fcf95972-0b9f-56c6-88f9-b51f80abfc3e', '532dd8ac-d17a-5b8a-baf7-137731afe405', 'ece8757c-b4b2-57b1-8214-d9beba003fb6', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('0f6782fd-f3c5-5aaa-8fa9-39068dcbeff1', '532dd8ac-d17a-5b8a-baf7-137731afe405', '3932318a-ef2d-5d80-967d-4fe380537ecf', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('84e2e939-0e0e-5e11-b418-6e2929037ebb', '532dd8ac-d17a-5b8a-baf7-137731afe405', '2dac025d-fa65-5cd3-9ad2-eb2ef7e92b66', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('87221c11-9150-5aa8-ac6d-bef42ac41dea', '532dd8ac-d17a-5b8a-baf7-137731afe405', '7536a037-73f5-58c6-a28c-f73b589f758e', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('9a3166a4-5c88-5ca6-8cdf-18a942b290af', '532dd8ac-d17a-5b8a-baf7-137731afe405', '3936e855-47c8-5b31-8a1e-d73815caa812', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('550a0532-456c-54b7-858b-8e09770b876f', '532dd8ac-d17a-5b8a-baf7-137731afe405', '4adc5ed6-9a11-5f2c-9204-52e5d3241349', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_sessions (id, batch_course_id, session_date, hour_no) VALUES ('27b7fc58-3692-55a3-bd90-8f753bd107fa', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', '2026-08-14', 3) ON CONFLICT (batch_course_id, session_date, hour_no) DO NOTHING;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('36e6c7b9-c7c4-5831-ac1d-27528890ac75', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '9fcf6c02-62a2-5a35-9d21-f8ef3ab1b756', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('c915df34-90fd-597e-8ce2-1226c46ccb3a', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'be87c13d-81ed-5987-876e-e962139c3796', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('95eccb43-9188-52be-ba7d-ee7920353dff', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'b3e3c006-d00e-5a08-87b4-ac3f2a765b54', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('0119e95e-c015-5f20-8d77-b6effabdbf15', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'a0b286a4-7d2b-5305-b85d-6b000d66da67', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('7594a2ce-2d0d-58d3-a3f8-b45263b0c4a9', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '60e21686-0af0-57af-a4db-abdc4aaaa403', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('854b3697-4d62-5f48-a3dc-7ab4084873b2', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'd3f610fc-b72f-5f80-8030-ba6a6fc6f364', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('68942543-45c5-5fe2-ad8d-d827f1f83d82', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '97a3ceac-5f08-539b-83bb-2d477b6bcc39', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('b4818bcc-2587-5f50-b21b-c5fc8ea8cab1', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '870076c9-ba6d-5cbf-a1c8-f3f518774a95', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('10d57d81-d21d-5e5e-b727-82410da2e5b5', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '51b16ce0-f2d8-5dae-8cac-576008d28ea9', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('9ee1f073-a89f-5f24-b7c6-b8a574e51ea9', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'c9df319b-6a09-5553-b05d-7f7af7a0163d', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('c0a6653a-c928-5501-afbc-a0dbd24073b0', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'd584da96-44b0-5ca5-bad3-735fd79ac139', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('717cc624-2de3-5b1d-a49d-1465678f3331', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'afc72ebf-9477-50fe-9a36-10190ae3c837', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('75e2887e-95b7-5735-bf60-49c891b1a6cb', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '219a401d-b746-5a10-9c37-b84d54a8162d', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('eea7040b-3cfa-510e-ab65-f150c70a1bc4', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'eab3057e-8817-562b-aa4d-135120edf8a1', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('815da93b-4216-5eef-a664-dcb8e9e3b168', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '65eae68e-b622-59e0-97f8-ae7a5cef2b00', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('e5ba7bd1-6a74-5afd-b689-3ed7d866daf3', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'f8030b0c-271f-52e9-b865-37c3cf4245df', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('bd6ce55b-b857-5663-af99-12cceac829a6', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '09fb4d93-d013-5f91-879c-599400962cbb', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('d9f90a3b-6099-512b-88be-e37979959652', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '438431fe-6131-5345-871b-e992457cdae9', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('1e12f425-a7a6-51a3-8c32-2d9fb17ec90e', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'f3f4dc30-ea50-5df5-838b-371903d80182', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('dd5baa52-6495-5ce4-be10-59d30f934d53', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'f7805548-5e94-5968-95f6-eadab260cc24', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('6d6a818a-973b-5bee-b2bb-6bb1c791b081', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '0c192fae-5043-5422-833a-fb3e74dd9826', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('23f98924-18f8-5f3a-a2d0-33c563512358', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '857acbe5-daca-5a2c-9958-525ca0a09d30', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('f46dbdff-f7f3-511b-8649-e93ded692045', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'a11f05f7-153a-5cb1-b210-2cfb6b0411d6', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('210b00d5-38b5-5b02-ae1d-4a1b84707112', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '1cc042ad-f66a-5b6e-a6d1-8f9b7210c445', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('0f269521-8762-51d4-a018-83f4dcd9f9a1', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '51c2e598-fe7e-57bf-b364-82e4e79c7275', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('ded6ae27-0ead-5b7d-a875-927efb0ffa66', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '8c603c6b-686e-5f3f-8571-d32616ce94cd', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('f6c77f74-dbf4-5ec6-9916-87637d8b5e55', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '5fd2a0f3-22ff-55b2-8f95-2af464f290f5', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('634d8708-906f-5e24-a49e-1b93b94287b0', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'a19de4fa-538f-5a3d-a8a6-8936f55bb16b', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('304c76bc-4489-589c-9b82-7679dff005c0', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'b5349ed4-2c20-59f7-b3f3-8d0356b3ba9d', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('60c4c0d5-1822-5a2a-adb8-342b587e7da3', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '8cb0acb9-9db3-552e-bdf4-4c3582e51603', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('bb65f07e-c089-5cf2-b9c2-3dfd6ca2af1b', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '64c68a90-e521-5b98-bca1-323fdf67be52', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('2546c688-7ecc-5295-9479-6d839c04c756', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '9773e005-4c39-52a5-833c-c74504422c0b', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('48e800ac-0476-5fd7-93bf-2b2863baafb4', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'dfe09b65-330b-53ac-8dc3-c4cb9a89fc13', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('9fe7eef8-e6ac-5fa0-9987-9efafa2cffa6', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '14a0e5f7-a95d-5212-84be-1225bd2cfa89', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('1458a1e9-be5a-5fae-9130-8ca7e04514a0', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '1af296c2-5d23-5fd6-a84a-158affc72f21', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('b0dd490d-6a1d-53e6-ac34-cdc7d2e82e2b', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '9311d9ed-97b9-5f57-a43c-a912a4e91469', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('f545b643-9038-58f8-83f6-1c704f1497d7', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'c94ed674-56ff-5ef3-8b50-f03658868142', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('8f2a412a-9241-5ec9-8607-a2d3e583e54f', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '1c4663fe-4591-5edb-b69a-f18e431ce538', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('8abd58d0-afa2-53d1-9f5f-c1cf1d8356c3', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'be5ab52d-59fb-5532-97a2-2a563c687a38', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('7625bf17-2b72-56b6-918f-ef9182a7be2c', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '825f3153-b9ac-5b9a-bb10-0cac4b9af9ba', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('86a96f8a-550d-5d5b-b8a6-b37093c5c3d0', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '9fe4cac7-4610-59ea-8a8e-addd43029267', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('76722349-7ed5-5c6b-a3e7-2c99f1943a06', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'de59512a-dc59-5dd9-9ac3-ad5fffaad0b8', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('af34cef0-63e6-59ac-8c83-3785eeb3f480', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'c229408c-9473-53a5-b671-af86be027fd0', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('97d45004-e32a-5f6e-8e5f-a24546cdc1a1', '27b7fc58-3692-55a3-bd90-8f753bd107fa', 'ece8757c-b4b2-57b1-8214-d9beba003fb6', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('91a44078-2870-5187-8ded-333aebf3b912', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '3932318a-ef2d-5d80-967d-4fe380537ecf', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('1e8cf73f-dd61-582a-9c8e-3b864735c1f5', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '2dac025d-fa65-5cd3-9ad2-eb2ef7e92b66', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('aaa555f0-f441-5398-822e-cbdf7da39d2f', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '7536a037-73f5-58c6-a28c-f73b589f758e', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('80f14e41-1bac-58d3-b601-bd440865e8aa', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '3936e855-47c8-5b31-8a1e-d73815caa812', 'absent') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;
INSERT INTO public.uct_attendance (id, session_id, student_id, status) VALUES ('8cde0aeb-9183-55f3-bb6a-82754c607e26', '27b7fc58-3692-55a3-bd90-8f753bd107fa', '4adc5ed6-9a11-5f2c-9204-52e5d3241349', 'present') ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status;

-- 6. INSERT SYLLABUS TOPICS & TRAINER LOGS
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('db483c88-add2-5ab8-844a-0735e5168344', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 1, 'Introduction to python,installation of anaconda,python interface,connecting file ,import library,python programming basics,understanding database,', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('181cf83d-5c66-51a7-aed9-90df0a312307', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 2, 'univariable analysis', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('b86eebe9-4231-53a9-953a-f831dbca46d5', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 3, 'Inter quartile range,Basic Data Visualization -histogram, boxplot', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('e976850d-20cc-5f1c-9337-f0aa354eedff', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 4, 'Valuecount and Visualization,Formating of visualization,Groupby', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('c959fa76-34c9-51d8-bfe3-7be1b460ffd8', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 5, 'Advanced Visualization', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('e0036887-1b62-58b5-9998-68a6ef95c206', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 6, 'Data Cleaning - removing rows, columns, droping null values,replace the mean', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('f13dce8a-0be0-58c1-8e64-e42b23e87196', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 7, 'Data Cleaning 2- removing duplicates ,converting data type and analyze the data', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('a173b3b8-3c20-53a2-8c24-1b0a24600e7c', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 8, 'Add Columns and doing calculations', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('96f80742-2d92-530f-a65d-49c99a0942c4', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 9, 'Data Consolidation and formatting (Table Formatting)', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('f49d315d-0432-5289-b038-864e060da7c9', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 10, 'Risk Analysis(Stock Market)', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('2a07e00b-5899-5635-8447-12ab4a746a20', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 11, 'Hypothesis Test -parametric Test-t-test,f-test,z-test', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('9490b17c-ee48-5e72-bbb9-d102ee206eb2', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 12, 'Non parametric Test- Chi-square,MannnWhinsey U-test', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('7838da36-bed2-568b-aa13-0502e5116cf2', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 13, 'DataType and Applications', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('14102f14-5180-5bc1-a30e-5184e4bb2ecd', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 14, 'Python Operators', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('3464b546-f04d-50ae-bf76-5a3af77f90e8', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 15, 'if,While,for ,iterators ,inhertiance,lamada', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('727ead0e-a633-579f-9a6a-5ab41d3ed8e4', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 16, 'Scatter Plot,Violin plot, kdeplot', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('39f6d4f9-3562-584a-9011-8c49728ec8f9', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 17, 'Correlation Matrix(heatplot),cross tabulation matrix,Quality Control Charts', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('0a5e2aa4-c8c5-524d-bbf0-cda181442c54', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 18, 'Introduction to Machine Learning,Simple Linear Regression', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('48bb3b62-d903-52bb-b53a-99884dd6b68a', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 19, 'MultiLinear Regression', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('cf713e13-0331-5e37-9952-ad4932a595f9', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 20, 'Logistic Regression', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('840129c7-a161-522e-ac68-e6f10f174b97', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 21, 'Time Series Analysis', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('4e29d53a-e46c-5e13-aaea-8b612d91dc33', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 22, 'ABC Analysis', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('d2a8a6c8-6754-5b93-9141-cd57153658c3', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 23, 'RFM Analysis', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('9c8fda7a-0e8b-56a6-97f9-782d919dabe4', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 24, 'Market Basket Analysis', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('b16a36b2-b2d1-5dc6-894b-b5edf5d73fa2', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 25, 'HR Analytics', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('1e029a56-dcb8-5a6c-9c3f-54be3915e173', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 26, 'Employee Attrittion Prediction', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('a572af53-66cd-5d6b-8c28-3f036bb5adff', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 27, 'Recruitment Analysis', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('7f8c382b-48ed-5c43-bc05-09d6e7214bb1', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 28, 'Fraud Detection', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('ceaf4265-6d06-58ea-bf87-1dd6ff3fa170', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 29, 'Financial Analysis', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('0d97d765-0a5a-5666-82ce-e331c4e5ce65', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 30, 'Financial Broadcasting', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('26b802cf-5df6-56b9-9b54-be7ea2da8976', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 1, '* Installation
 * Import Data from Excel
 * Basic Visualisation
 * Implicit Measures
 * Basic Formatting
 * Dashboard Creation', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('70e32ba7-2c24-5af9-9bf5-40eec765e426', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 2, '* Import Data from CSV
 * Basic Visualisation
 * Implicit Measures
 * Explain Complete Formattings', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('5dabd52b-5101-55c1-8c9b-8f9393b4ed8d', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 3, '* Import Data from CSV
 * Drill Down Hierarchy
 * Forecasting
 * Create Mobile View
 * Insert Shapes', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('1675586a-4798-5039-9a7b-52b60fd7b1ea', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 4, '* Import Data from Excel
 * Introduction to Power Query
 * Column Profiling
 * Column Distribution
 * Remove Rows
 * Remove Columns
 * Remove Empty Rows - Filtering
 * Fix Headers
 * Change Data types
 * Dashboard', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('a5a9ca55-9a56-5cec-8b10-014e403f3086', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 5, '* Date Transformation (Day, Month, Year)
 * Calculated Column - Basic (Addition, Subtraction, Division, Multiplication)', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('f1c6b02f-13d9-520d-b12d-d6cdee75d962', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 6, '* Introduction to Measure (Advantages)
 * Explicit Measures
 * Basic Modelling (Auto Detecting, Connecting Tables)
 * Navigators
 * Creating Buttons', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('053332d0-20e7-5436-b341-bc1bff7b44a4', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 7, '* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO)', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('a7433db3-524e-5d78-9d19-3e1a9df8cad2', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 8, '* Calculated Column (IF, Nested IF, SWITCH, AND, OR)
 * Remaining Visuals (Scatter Plot, Decomposition Tree, Smar Narrative, Ribbon Chart, Waterfall)', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('79be8320-0670-5350-9caf-b50e3c4807f1', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 9, '* SUMX
 * Themes (Customizing, Adding, Saving, Uploading)
 * Sync Slicers
 * Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('f3ed172e-bfa1-5110-b94a-08b61bcb9913', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 10, '* Append
 * Append 2 Table
 * Append 3 Table
 * Merge (Left Outer, Right Outer, Inner)', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('f13d1eff-f856-5ab3-95ae-9ea23ab50cc6', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 11, '* Prepare from Previous Topics (Model Resizing, Modelling, Data Cleaning)
 * Custom Tooltip
 * Drill Through
 * Edit Interaction (Highlight, Filter)
 * Sorting in Visual', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('da0cadf6-bff6-55cd-9829-7f791299737f', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 12, '* Transpose
 * Fill
 * Pivot column
 * Unpivot column
 * Remove Errors
 * Replace Errors', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('153583c4-64a1-5eeb-8170-ba092c6204b0', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 13, '* Group By
 * Text Formatting (Upper Case, Lower Case, Trim, Clean, Prefix, Suffix)
 * Split Column, Column from Examples', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('f11827d7-b937-5425-9f0f-b39ae0c9b15e', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 14, '* Custom Column
 * Conditional Column
 * Merge Column', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('6eb9fcb8-d628-5182-9f3b-3de9d0a31982', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 15, '* Creating Hierarchy (Eg: Country, State, District)
 * Conditional Formatting (Color Scale, Databars, Icons)
 * Conditional Formatting using Measures', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('6b86e271-314e-5b9e-813d-cb62554b1488', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 16, '* CALCULATE
 * SAMEPERIODLASTYEAR
 * PARALLELPERIOD
 * DATESBETWEEN
 * TOTALYTD
 * DATESYTD', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('09845b56-0c19-51d1-9cb7-491c792f77b2', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 17, '* PREVIOUSMONTH
 * ALL
 * TOPN
 * RANKX
 * Variable Declaration in Measure', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('6706579b-5830-5145-b15f-cd9355a60b47', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 18, '* Row Level Security (Dynamic)
 * Introduction to Power BI Workspace
 * Creating Workspace
 * Workspace Roles (Admin, Member… etc)
 * Publishing Report to Workspace
 * Sharing Reports in Service', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('5341aaea-3442-5174-b04b-5ec89640fd8d', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 19, '* Scheduled Refresh
 * Create Dashboard in Power BI Service
 * Connect to Shared Dataset
 * Dataset Permissions', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('19def302-ec27-550c-bebd-302689622cbe', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 20, '* Alerts & Subscriptions
 * Creating Apps in Power BI Service
 * Explain Direct Query v/s Import Mode', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('29ec8c66-c4eb-568d-b6c7-bff2bd0994b4', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 21, '* Installation of Tableau
 * Basic Visualisation
 * Dashboard', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('4a394057-88c3-5b45-b62d-d50f76c40c9d', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 22, '* Calculation in columns
 * Formattings
 * Dashboard', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('28a616bf-e9ac-5e14-aec8-abceb5216975', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 23, '* Basic Measures
 * Modelling
 * Dashboard', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('5eceef5c-1326-59dd-a1d6-477aa630c57e', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 24, '* Basic Cleaning
 * Modelling
 * Dashboard', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('49e56a63-f3b4-5915-94ce-2844d270f051', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 25, '* Project - Tableau', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('552b04e4-f1db-5fb8-8312-96b3d0ef7626', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 26, '* Project - Tableau', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('1e8affa2-5f51-5355-8ec7-dc61d8c75e25', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 27, '* Revision - Power BI', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('4f83d515-151e-56d3-adff-d6e6ff9403d0', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 28, '* Revision - Power BI', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('1a4fcf7a-9127-5011-80a7-89a2fd2ee8d8', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 1, 'Introduction to R and R studio, Overview of the R programming language, Systematically explore data in R', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('af53c0ee-1c33-517d-846d-e3bf8880827d', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 2, 'Basic data cleaning: adding a new variable, removing columns and rows. Package tidyr: removing null values', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('57001bd4-904f-575d-88a5-e6f81cd7de06', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 3, 'Change column values, remove duplicates, export cleaned data, basic data analysis on cleaned business data', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('03577bc5-b15c-5f0b-aee7-f418703f5b23', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 4, 'Basic visualization and interpretation: bar chart and histogram, advanced data visualization using ggplot, plotly and treemap', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('b42a7258-44b9-59d2-aad0-ccf189a32ac3', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 5, 'Bar, histogram, line (with and without filter), area chart, pie chart', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('0837b3ca-aad3-50ff-a212-6ae89c51fed2', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 6, 'Donut chart, bubble chart, boxplot and scatter plot. Decision and analysis from visuals', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('d39c9c95-d7c5-5e22-8e73-146a98a3120a', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 7, 'Univariable analysis', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('f3a522f2-1534-51aa-a600-4f25a1b164ae', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 8, 'Bivariable analysis', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('45d160c0-ab9c-5fe5-9265-71d5934c2fe5', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 9, 'Multivariable Analysis', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('4b5d0091-b273-51be-b696-7d1af3a325f5', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 10, 'Hypothesis testing', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('47f87c1e-e060-5171-848e-c607021e8102', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 11, 'Forecasting using regression', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('2470b675-3621-5ceb-b3b7-f2ebbf5e4676', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 12, 'Economy Analysis using r', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('940329ee-bbe7-5d38-9f44-d79be4436320', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 13, 'Companay Analaysis using r', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('7503c5f1-cf9b-53ca-8f30-b9e598f85f8a', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 14, 'Risk return analysis of stocks', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('827f161a-53bf-5d70-b6f9-c14ae1447083', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 15, 'Moving average for decision making', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('50ffd0a4-1cd2-5b5e-9643-829f545e70a1', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 16, 'Performance analysis of stock', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('52e053c3-1ed2-5e2e-b2a1-e5dc81514a7a', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 17, 'Comparitive analysis of stocks for investment decision making', nan, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('fece611b-92ab-5c59-bc1b-8d3b80eff4e0', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 1, 'Basic Formulas(SUM, IF, SWITCH, SUMIF,AVERAGEIF,COUNT,COUNTIF,COUNTBLANK), Table Formatting', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('ac4b8ee2-7f8c-56f0-bac6-cb3b82bbbcd0', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 2, 'Referencing, Absolute and Relative Referencing, Paste as Values), AVERAGEIFS,SUMIFS,COUNTIFS', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('1f81b9f4-8208-5e99-9752-f36e33a04f0f', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 3, 'Time Value of Money 1 (PV, FV, PMT, RATE, YEAR)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('d4131c04-423f-5033-baa3-aedc90b34d01', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 4, 'Time Value of Money 2 (XIRR, IRR, NPV)', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('2d6fc449-726c-5146-9983-db983d995a38', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 5, 'Data Validation, Goal Seek, Data Table, Scenario Manager', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('c101276e-0c53-552c-a241-1f828f51f149', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 6, 'Import data from multiple data sources like Text, CSV, PDF, Table, Website, Folder, Basic Cleaning using Power Query', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('831f3b97-302f-5ba7-9ddd-322f9065ecd0', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 7, 'Forecasting Tool (Financial Data (Yahoo Finance))', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('79e757a5-5529-5171-bef5-26437de7106a', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 8, 'Data Analysis Tool Pack (Descriptive Statistics, Histogram, Correlation, Covariance (Decision Making in Finance))', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('42d607e4-009f-536c-ae21-de9f54a8cf80', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 9, 'Solver', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('c51496cf-2b70-574f-9283-7eb1457fbb16', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 10, 'Data Consolidation, Grouping, Subtotal, Conditional Formatting', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('a7af04fd-3c0e-58de-8a5a-708d9abc9c84', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 11, 'Create a Project (VLOOKUP,HLOOKUP,INDEX,MATCH,FILTER,XLOOKUP)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('fd16ba98-b972-5c4d-88ef-d20c0abaf2e0', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 12, 'Time Intelligence', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('c98e9001-d995-5f9e-890f-232e11d5e120', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 13, 'Data Visualisation (All Charts)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('e78c288b-2cce-5156-b864-2cc4e6966531', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 14, 'Pivot Table', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('b9813010-099c-5887-8610-0288f633d730', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 15, 'Dashboard', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('cdb98e5f-a176-509a-8816-f67664278687', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 16, 'Macro Recording & Writing', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('0baab09e-b289-53d4-914f-abae5e4b5c26', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 17, 'Business Model', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('70e61dfb-ea5e-5355-98b4-0e79132fec34', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 18, 'Excel Tools for Investment Decision and stock Market Analysis.', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('89ed7a29-cc25-5405-bfb0-34040245b5d0', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 19, 'Module 2', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('632d2226-654a-51af-a3ba-64c51acebeb3', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 20, 'Power Pivot', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('71009b75-bf1e-52b6-9094-27ccf3c53dac', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 21, 'nan', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('983ef1db-ecf0-5b1e-9f49-a5de3d097791', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 22, 'nan', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('4fee7238-8757-5b7f-a58d-bfeca4256d15', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 23, 'nan', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('81db88f4-3bda-55df-bc5e-518cb7176f00', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 24, 'nan', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('2ca91310-e4e4-51a5-be12-7078bf6c2e4c', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 25, 'nan', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('e9d742d2-4a5e-567e-a45e-90c92b7de42a', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 26, 'nan', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('d4956c20-5eb2-5616-83b8-2de072eb6c0f', 'ce45e116-1ed9-56aa-97e5-3ebbadd37473', 27, 'nan', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('8dd82fa3-92e6-5d26-af1d-5e3727a152ca', '34c63423-ac65-5b21-995d-e1d359f10ef6', 1, '* Installation
 * Import Data from Excel
 * Basic Visualisation
 * Implicit Measures
 * Basic Formatting
 * Dashboard Creation', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('566536e7-a8ef-5f3f-9d02-32499be8a08a', '34c63423-ac65-5b21-995d-e1d359f10ef6', 2, '* Import Data from CSV
 * Basic Visualisation
 * Implicit Measures
 * Explain Complete Formattings', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('40d9dc43-43ae-5b45-821e-4bf0d922c503', '34c63423-ac65-5b21-995d-e1d359f10ef6', 3, '* Import Data from CSV
 * Drill Down Hierarchy
 * Forecasting
 * Create Mobile View
 * Insert Shapes', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('bf6f0e92-4734-5638-b1a8-705a05025491', '34c63423-ac65-5b21-995d-e1d359f10ef6', 4, '* Import Data from Excel
 * Introduction to Power Query
 * Column Profiling
 * Column Distribution
 * Remove Rows
 * Remove Columns
 * Remove Empty Rows - Filtering
 * Fix Headers
 * Change Data types
 * Dashboard', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('c682f4bc-e609-547d-b0ae-e098204cad9d', '34c63423-ac65-5b21-995d-e1d359f10ef6', 5, '* Date Transformation (Day, Month, Year)
 * Calculated Column - Basic (Addition, Subtraction, Division, Multiplication)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('6a87489b-8059-57a5-ba6e-bd1fd44ea88a', '34c63423-ac65-5b21-995d-e1d359f10ef6', 6, '* Introduction to Measure (Advantages)
 * Explicit Measures
 * Basic Modelling (Auto Detecting, Connecting Tables)
 * Navigators
 * Creating Buttons', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('54c260aa-d7e8-5320-a6a1-c98d596a17b2', '34c63423-ac65-5b21-995d-e1d359f10ef6', 7, '* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('a06a054e-5a42-565b-8020-f887f7691a1f', '34c63423-ac65-5b21-995d-e1d359f10ef6', 8, '* Calculated Column (IF, Nested IF, SWITCH, AND, OR)
 * Remaining Visuals (Scatter Plot, Decomposition Tree, Smar Narrative, Ribbon Chart, Waterfall)', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('6095a04b-8ea5-55b9-ae70-f444f5fa0fd7', '34c63423-ac65-5b21-995d-e1d359f10ef6', 9, '* SUMX
 * Themes (Customizing, Adding, Saving, Uploading)
 * Sync Slicers
 * Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('93ca03ba-3f7e-5d43-b004-ebb4fe9a2eb6', '34c63423-ac65-5b21-995d-e1d359f10ef6', 10, '* Append
 * Append 2 Table
 * Append 3 Table
 * Merge (Left Outer, Right Outer, Inner)', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('0afc4669-f803-55a4-9c1e-5280c861f3b8', '34c63423-ac65-5b21-995d-e1d359f10ef6', 11, '* Prepare from Previous Topics (Model Resizing, Modelling, Data Cleaning)
 * Custom Tooltip
 * Drill Through
 * Edit Interaction (Highlight, Filter)
 * Sorting in Visual', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('edc0fe5e-7f7a-5305-a2c3-d0cab2db1ce8', '34c63423-ac65-5b21-995d-e1d359f10ef6', 12, '* Transpose
 * Fill
 * Pivot column
 * Unpivot column
 * Remove Errors
 * Replace Errors', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('9327a8b6-ae71-5acd-9c26-1e33a2909167', '34c63423-ac65-5b21-995d-e1d359f10ef6', 13, '* Group By
 * Text Formatting (Upper Case, Lower Case, Trim, Clean, Prefix, Suffix)
 * Split Column, Column from Examples', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('a14997c9-2635-549a-921c-9837164356f0', '34c63423-ac65-5b21-995d-e1d359f10ef6', 14, '* Custom Column
 * Conditional Column
 * Merge Column', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('af25746f-3741-5473-9120-7dbd6fe86142', '34c63423-ac65-5b21-995d-e1d359f10ef6', 15, '* Creating Hierarchy (Eg: Country, State, District)
 * Conditional Formatting (Color Scale, Databars, Icons)
 * Conditional Formatting using Measures', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('dee22e73-b6b2-5811-8013-fb272717918b', '34c63423-ac65-5b21-995d-e1d359f10ef6', 16, '* CALCULATE
 * SAMEPERIODLASTYEAR
 * PARALLELPERIOD
 * DATESBETWEEN
 * TOTALYTD
 * DATESYTD', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('01904edf-4230-5ddc-a189-b36966649bb3', '34c63423-ac65-5b21-995d-e1d359f10ef6', 17, '* PREVIOUSMONTH
 * ALL
 * TOPN
 * RANKX
 * Variable Declaration in Measure', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('e514649f-cdc9-5fe0-91c5-1317642bc74d', '34c63423-ac65-5b21-995d-e1d359f10ef6', 18, '* Row Level Security (Dynamic)
 * Introduction to Power BI Workspace
 * Creating Workspace
 * Workspace Roles (Admin, Member… etc)
 * Publishing Report to Workspace
 * Sharing Reports in Service', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('89910ccb-bd3d-5cd7-9470-0affd918476e', '34c63423-ac65-5b21-995d-e1d359f10ef6', 19, '* Scheduled Refresh
 * Create Dashboard in Power BI Service
 * Connect to Shared Dataset
 * Dataset Permissions', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('750cbfde-f65b-5ae4-a5af-cc510074555f', '34c63423-ac65-5b21-995d-e1d359f10ef6', 20, '* Alerts & Subscriptions
 * Creating Apps in Power BI Service
 * Explain Direct Query v/s Import Mode', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('ca405c69-48d9-5a95-852c-ffd3e1bd8d64', '34c63423-ac65-5b21-995d-e1d359f10ef6', 21, '* Installation of Tableau
 * Basic Visualisation
 * Dashboard', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('a9f2159d-f2ef-5635-bbd5-b4e45a255c97', '34c63423-ac65-5b21-995d-e1d359f10ef6', 22, '* Calculation in columns
 * Formattings
 * Dashboard', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('4ecf2329-43ea-59a6-ba48-9484eaf40634', '34c63423-ac65-5b21-995d-e1d359f10ef6', 23, '* Basic Measures
 * Modelling
 * Dashboard', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('7dd18d47-bc2d-53a2-8a17-9098e20bbcb6', '34c63423-ac65-5b21-995d-e1d359f10ef6', 24, '* Basic Cleaning
 * Modelling
 * Dashboard', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('ef604f23-fdc8-5185-a1fb-a1b527f53942', '34c63423-ac65-5b21-995d-e1d359f10ef6', 25, '* Project - Tableau', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('1cb265d6-5d5a-5a4e-ab80-e4c324079c3c', '34c63423-ac65-5b21-995d-e1d359f10ef6', 26, '* Project - Tableau', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('95b76a5c-6ebd-5dcd-9a2f-41eb6942d79d', '34c63423-ac65-5b21-995d-e1d359f10ef6', 27, '* Revision - Power BI', 3.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('ec621271-418c-5d34-a7c6-268694c835e8', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 99, 'Given Power BI work', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-06-05' WHERE id = 'ec621271-418c-5d34-a7c6-268694c835e8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('24c12cc0-5add-5faf-9653-1761890c0c52', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Ajay Thomas', '2024-06-05', '08:30:00', '11:30:00', 180, ARRAY['ec621271-418c-5d34-a7c6-268694c835e8']::UUID[], 'Given Power BI work | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-06-06' WHERE id = 'ec621271-418c-5d34-a7c6-268694c835e8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('145bd48a-c22b-5349-bca9-255843166a3d', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Ajay Thomas', '2024-06-06', '11:30:00', '13:30:00', 120, ARRAY['ec621271-418c-5d34-a7c6-268694c835e8']::UUID[], 'Given Power BI work | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-06-13' WHERE id = 'db483c88-add2-5ab8-844a-0735e5168344';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('92fca38e-da26-56c6-9415-b109bce59a0c', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Jomon Joseph', '2024-06-13', '08:30:00', '08:45:00', 15, ARRAY['db483c88-add2-5ab8-844a-0735e5168344']::UUID[], 'Introduction | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-06-13' WHERE id = 'db483c88-add2-5ab8-844a-0735e5168344';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('56efa43f-6d96-56e0-8a54-e80a4751a786', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-06-13', '08:45:00', '11:30:00', 165, ARRAY['db483c88-add2-5ab8-844a-0735e5168344']::UUID[], 'Introduction to python and interface | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-06-14' WHERE id = 'db483c88-add2-5ab8-844a-0735e5168344';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('f1f26ee1-2952-56f0-951f-167609b80a31', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-06-14', '11:35:00', '13:45:00', 130, ARRAY['db483c88-add2-5ab8-844a-0735e5168344']::UUID[], 'import library,python programming basics,understanding database | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-06-20' WHERE id = '181cf83d-5c66-51a7-aed9-90df0a312307';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('6f5a767d-4acb-529d-89dc-31dd0df25337', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-06-20', '08:30:00', '11:30:00', 180, ARRAY['181cf83d-5c66-51a7-aed9-90df0a312307']::UUID[], 'Univariable Analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-06-21' WHERE id = 'b86eebe9-4231-53a9-953a-f831dbca46d5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('99ea590e-628b-5f00-b9db-722b8157648a', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-06-21', '11:35:00', '14:00:00', 145, ARRAY['b86eebe9-4231-53a9-953a-f831dbca46d5']::UUID[], 'Interquatile Range and Visualization | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-06-28' WHERE id = '3464b546-f04d-50ae-bf76-5a3af77f90e8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('0d86f78e-5134-56e7-aa64-8b5287e61b61', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-06-28', '11:35:00', '13:45:00', 130, ARRAY['3464b546-f04d-50ae-bf76-5a3af77f90e8']::UUID[], 'For loop and If Condition | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-07-04' WHERE id = 'e976850d-20cc-5f1c-9337-f0aa354eedff';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('08608c7e-d8d3-5fdf-a764-acd4cf38e508', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-07-04', '08:30:00', '11:30:00', 180, ARRAY['e976850d-20cc-5f1c-9337-f0aa354eedff']::UUID[], 'Valuecount ,Visualization and For loop and If Condition Test | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('6b924323-5e0d-5c14-b881-b24af20d2334', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 4, '* Valuecount and Visualization,Formating of visualization,Groupby and 
 * Advance Visualizations', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-07-05' WHERE id = '6b924323-5e0d-5c14-b881-b24af20d2334';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('5835d2ef-ac59-50a0-b863-710a91c53d98', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-07-05', '11:35:00', '13:45:00', 130, ARRAY['6b924323-5e0d-5c14-b881-b24af20d2334']::UUID[], '* Valuecount and Visualization,Formating of visualization,Groupby and 
 * Advance Visualizations | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-07-25' WHERE id = 'e0036887-1b62-58b5-9998-68a6ef95c206';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('14dc662a-9f3f-56d1-9335-fe1db9a84868', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-07-25', '10:30:00', '13:30:00', 180, ARRAY['e0036887-1b62-58b5-9998-68a6ef95c206']::UUID[], 'Data Cleaning 1 | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-07-26' WHERE id = 'f13dce8a-0be0-58c1-8e64-e42b23e87196';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('19cf5f58-89bc-568c-902d-60c69cc92b9f', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-07-26', '08:30:00', '10:30:00', 120, ARRAY['f13dce8a-0be0-58c1-8e64-e42b23e87196']::UUID[], 'Data Cleaning 2 | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-08-08' WHERE id = 'f49d315d-0432-5289-b038-864e060da7c9';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('69a85913-8146-5092-810a-7b25dc03447d', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-08-08', '10:30:00', '12:30:00', 120, ARRAY['f49d315d-0432-5289-b038-864e060da7c9']::UUID[], 'Risk Analysis(Stock Market) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-08-08' WHERE id = 'f49d315d-0432-5289-b038-864e060da7c9';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('05a3ec9a-d365-51bc-a9a6-2b7db627a6f9', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-08-08', '14:30:00', '16:30:00', 120, ARRAY['f49d315d-0432-5289-b038-864e060da7c9']::UUID[], 'Risk Analysis(Stock Market) | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('ecd7fbbf-3943-55f6-b807-0392734788b8', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 13, '* DataType and Applications
 *Python Operators
 *if,While,for ,iterators ,inhertiance,lamada', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-08-09' WHERE id = 'ecd7fbbf-3943-55f6-b807-0392734788b8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('8a6ea5a3-ef7b-551e-954a-b919bdb5a33f', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-08-09', '10:00:00', '13:30:00', 210, ARRAY['ecd7fbbf-3943-55f6-b807-0392734788b8']::UUID[], '* DataType and Applications
 *Python Operators
 *if,While,for ,iterators ,inhertiance,lamada | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-08-09' WHERE id = '2a07e00b-5899-5635-8447-12ab4a746a20';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('bd7c9892-9a81-5ef0-bbb2-29cd10cd4cf0', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-08-09', '14:30:00', '16:30:00', 120, ARRAY['2a07e00b-5899-5635-8447-12ab4a746a20']::UUID[], 'Hypothesis Test -parametric Test-t-test,f-test | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('e99e34b7-95da-5309-b56c-d1948410555c', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 11, '*Hypothesis Test -parametric Test-ztest
 *Non parametric Test- Chi-square,MannnWhinsey U-test', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-08-10' WHERE id = 'e99e34b7-95da-5309-b56c-d1948410555c';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b8dcc325-83e2-52b9-a865-731f15351977', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-08-10', '08:30:00', '12:30:00', 240, ARRAY['e99e34b7-95da-5309-b56c-d1948410555c']::UUID[], '*Hypothesis Test -parametric Test-ztest
 *Non parametric Test- Chi-square,MannnWhinsey U-test | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('02aa4c2f-6540-54df-b93f-fea7955bba68', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 18, '*Sample Paper 
 *Introduction to Machine Learning', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-08-16' WHERE id = '02aa4c2f-6540-54df-b93f-fea7955bba68';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('acaf3974-0bb5-5059-a6af-cae49dd24f54', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-08-16', '08:30:00', '10:30:00', 120, ARRAY['02aa4c2f-6540-54df-b93f-fea7955bba68']::UUID[], '*Sample Paper 
 *Introduction to Machine Learning | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('f17970f3-2834-5b78-aeae-acb9db5d1944', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 16, '*Scatter Plot,Violin plot, kdeplot
 *Correlation Matrix(heatplot),cross tabulation matrix,Quality Control Charts
 *Introduction to Machine Learning,Simple Linear Regression', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-08-16' WHERE id = 'f17970f3-2834-5b78-aeae-acb9db5d1944';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('ba7430fa-d4db-5e20-ab83-2b9435c6c013', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-08-16', '14:15:00', '16:30:00', 135, ARRAY['f17970f3-2834-5b78-aeae-acb9db5d1944']::UUID[], '*Scatter Plot,Violin plot, kdeplot
 *Correlation Matrix(heatplot),cross tabulation matrix,Quality Control Charts
 *Introduction to Machine Learning,Simple Linear Regression | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-08-22' WHERE id = '48bb3b62-d903-52bb-b53a-99884dd6b68a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('0ffab61e-3bc8-5c0a-b388-6531d9b6507c', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-08-22', '11:30:00', '13:30:00', 120, ARRAY['48bb3b62-d903-52bb-b53a-99884dd6b68a']::UUID[], 'MultiLinear Regression | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-08-23' WHERE id = 'cf713e13-0331-5e37-9952-ad4932a595f9';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b87713be-996d-53b7-81b8-69aecb1339d2', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-08-23', '08:30:00', '10:30:00', 120, ARRAY['cf713e13-0331-5e37-9952-ad4932a595f9']::UUID[], 'Logistic Regression | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-08-24' WHERE id = 'cf713e13-0331-5e37-9952-ad4932a595f9';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('78e91ce5-fd97-5a02-a711-cd99b8982e82', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-08-24', '08:30:00', '11:30:00', 180, ARRAY['cf713e13-0331-5e37-9952-ad4932a595f9']::UUID[], 'Logistic Regression | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-09-05' WHERE id = '4e29d53a-e46c-5e13-aaea-8b612d91dc33';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('9b5134ce-5684-5e8b-8ad6-9117eff60667', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-09-05', '10:30:00', '11:30:00', 60, ARRAY['4e29d53a-e46c-5e13-aaea-8b612d91dc33']::UUID[], 'Revison
 *ABC Analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-09-06' WHERE id = '4e29d53a-e46c-5e13-aaea-8b612d91dc33';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('8683d0ef-80da-53e9-b96d-d62088001342', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-09-06', '08:30:00', '10:30:00', 120, ARRAY['4e29d53a-e46c-5e13-aaea-8b612d91dc33']::UUID[], 'ABC Analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-10-04' WHERE id = 'ec621271-418c-5d34-a7c6-268694c835e8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('8ed93657-7bc6-5ff4-b4b1-67ca0731cb08', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-10-04', '08:30:00', '13:30:00', 300, ARRAY['ec621271-418c-5d34-a7c6-268694c835e8']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('1bfdaf97-68e9-522e-9553-f460e54f0f3c', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 99, 'nan', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-10-30' WHERE id = '1bfdaf97-68e9-522e-9553-f460e54f0f3c';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b0e81e5a-8b4a-5c43-a7eb-c47e7d77ed9c', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-10-30', '09:15:00', '14:30:00', 315, ARRAY['1bfdaf97-68e9-522e-9553-f460e54f0f3c']::UUID[], 'nan | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('cfb5c608-4802-5556-8426-6e26b41eab39', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 99, 'nan', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-10-31' WHERE id = 'cfb5c608-4802-5556-8426-6e26b41eab39';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('6fc3d0ee-0307-522d-95ef-e5f337314333', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2024-10-31', '09:30:00', '17:30:00', 480, ARRAY['cfb5c608-4802-5556-8426-6e26b41eab39']::UUID[], 'nan | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('5eb4ff33-b12f-5f90-a83c-cdf5b3997f52', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 1, '* Installation
 Import Data from Excel
 Basic Visualisation
 Implicit Measures
 Basic Formatting
 Dashboard Creation
 *Import Data from CSV
 Basic Visualisation
 Implicit Measures
 Explain Complete Formattings', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-07' WHERE id = '5eb4ff33-b12f-5f90-a83c-cdf5b3997f52';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1a5bfa3a-8568-529d-9a5f-b0cbd6e07c89', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-11-07', '08:30:00', '13:30:00', 300, ARRAY['5eb4ff33-b12f-5f90-a83c-cdf5b3997f52']::UUID[], '* Installation
 Import Data from Excel
 Basic Visualisation
 Implicit Measures
 Basic Formatting
 Dashboard Creation
 *Import Data from CSV
 Basic Visualisation
 Implicit Measures
 Explain Complete Formattings | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('19eb0b66-0850-5101-95e6-57d5971da155', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 1, '*Introduction to R and R studio, Overview of the R programming language, Systematically explore data in R
 *Basic data cleaning: adding a new variable, removing columns and rows. Package tidyr: removing null values', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-08' WHERE id = '19eb0b66-0850-5101-95e6-57d5971da155';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('2b800ad9-310d-5bfc-aeca-467e1729674e', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-11-08', '08:30:00', '13:10:00', 280, ARRAY['19eb0b66-0850-5101-95e6-57d5971da155']::UUID[], '*Introduction to R and R studio, Overview of the R programming language, Systematically explore data in R
 *Basic data cleaning: adding a new variable, removing columns and rows. Package tidyr: removing null values | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-14' WHERE id = '5dabd52b-5101-55c1-8c9b-8f9393b4ed8d';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e0bfcf4b-51a0-53dd-8d4d-f902518e50d0', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-11-14', '08:30:00', '11:30:00', 180, ARRAY['5dabd52b-5101-55c1-8c9b-8f9393b4ed8d']::UUID[], '"* Import Data from CSV
 * Drill Down Hierarchy
 * Forecasting
 * Create Mobile View
 * Insert Shapes" | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-14' WHERE id = '57001bd4-904f-575d-88a5-e6f81cd7de06';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('61d5e84d-1577-5461-9d5c-bb888f059e47', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-11-14', '11:30:00', '13:30:00', 120, ARRAY['57001bd4-904f-575d-88a5-e6f81cd7de06']::UUID[], 'Change column values, remove duplicates, export cleaned data, basic data analysis on cleaned business data | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-15' WHERE id = '1675586a-4798-5039-9a7b-52b60fd7b1ea';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('079ee2bc-b24d-582e-bacd-2ce9622d9ebe', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-11-15', '08:30:00', '10:30:00', 120, ARRAY['1675586a-4798-5039-9a7b-52b60fd7b1ea']::UUID[], '* Import Data from Excel
 * Introduction to Power Query
 * Column Profiling
 * Column Distribution
 * Remove Rows
 * Remove Columns
 * Remove Empty Rows - Filtering
 * Fix Headers
 * Change Data types
 * Dashboard | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-15' WHERE id = '57001bd4-904f-575d-88a5-e6f81cd7de06';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('07700f73-fb2f-52e6-b45e-24c3cceb50e3', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-11-15', '10:30:00', '13:30:00', 180, ARRAY['57001bd4-904f-575d-88a5-e6f81cd7de06']::UUID[], 'Change column values, remove duplicates, export cleaned data, basic data analysis on cleaned business data | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-15' WHERE id = 'a5a9ca55-9a56-5cec-8b10-014e403f3086';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('9814bfce-aeaf-5e01-b549-fba8e0f7d8e8', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-11-15', '14:30:00', '16:30:00', 120, ARRAY['a5a9ca55-9a56-5cec-8b10-014e403f3086']::UUID[], '* Date Transformation (Day, Month, Year)
 * Calculated Column - Basic (Addition, Subtraction, Division, Multiplication) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-16' WHERE id = 'f1c6b02f-13d9-520d-b12d-d6cdee75d962';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1e7dcccd-06d7-59c9-88d5-e7f205e7047c', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-11-16', '09:00:00', '14:00:00', 300, ARRAY['f1c6b02f-13d9-520d-b12d-d6cdee75d962']::UUID[], '* Introduction to Measure (Advantages)
 * Explicit Measures
 * Basic Modelling (Auto Detecting, Connecting Tables)
 * Navigators
 * Creating Buttons | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-22' WHERE id = '053332d0-20e7-5436-b341-bc1bff7b44a4';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('109a40b6-b1b7-56ee-b33f-00f4f841e0e4', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-11-22', '08:30:00', '10:30:00', 120, ARRAY['053332d0-20e7-5436-b341-bc1bff7b44a4']::UUID[], '* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-22' WHERE id = '57001bd4-904f-575d-88a5-e6f81cd7de06';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('a9772b48-4362-52ac-b151-302bd4cdc34e', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-11-22', '10:30:00', '13:30:00', 180, ARRAY['57001bd4-904f-575d-88a5-e6f81cd7de06']::UUID[], 'Change column values, remove duplicates, export cleaned data, basic data analysis on cleaned business data | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-22' WHERE id = '03577bc5-b15c-5f0b-aee7-f418703f5b23';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('951e06b9-787f-533c-be67-737cb27cd509', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-11-22', '14:15:00', '16:30:00', 135, ARRAY['03577bc5-b15c-5f0b-aee7-f418703f5b23']::UUID[], 'Basic visualization and interpretation: bar chart and histogram, advanced data visualization using ggplot, plotly and treemap | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-11-23' WHERE id = 'a7433db3-524e-5d78-9d19-3e1a9df8cad2';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('de609019-4e30-55c4-970e-ed412cd8f9d4', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-11-23', '08:30:00', '14:00:00', 330, ARRAY['a7433db3-524e-5d78-9d19-3e1a9df8cad2']::UUID[], '* Calculated Column (IF, Nested IF, SWITCH, AND, OR)
 * Remaining Visuals (Scatter Plot, Decomposition Tree, Smar Narrative, Ribbon Chart, Waterfall) | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('42b6b262-f455-569f-9901-e9e109847893', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 10, '*Append
 Append 2 Table
 Append 3 Table
  Merge (Left Outer, Right Outer, Inner)
 *Group By
 Merge Column', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-05' WHERE id = '42b6b262-f455-569f-9901-e9e109847893';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('89f859ad-83c2-5431-8fb5-f3f77ac64a50', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-12-05', '08:30:00', '11:30:00', 180, ARRAY['42b6b262-f455-569f-9901-e9e109847893']::UUID[], '*Append
 Append 2 Table
 Append 3 Table
  Merge (Left Outer, Right Outer, Inner)
 *Group By
 Merge Column | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-05' WHERE id = 'b42a7258-44b9-59d2-aad0-ccf189a32ac3';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('6cd9413f-9e8d-57f6-af93-6d3c0bbe5081', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-12-05', '11:30:00', '13:30:00', 120, ARRAY['b42a7258-44b9-59d2-aad0-ccf189a32ac3']::UUID[], 'Bar, histogram, line (with and without filter), area chart, pie chart | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-05' WHERE id = '0837b3ca-aad3-50ff-a212-6ae89c51fed2';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('8fada054-30cd-502a-bd47-404547476a7d', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-12-05', '14:30:00', '16:30:00', 120, ARRAY['0837b3ca-aad3-50ff-a212-6ae89c51fed2']::UUID[], 'boxplot and scatter plot. Decision and analysis from visuals | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-06' WHERE id = '42b6b262-f455-569f-9901-e9e109847893';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('802339ec-ea20-5460-810e-1ed8bb6344e0', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-12-06', '08:30:00', '10:30:00', 120, ARRAY['42b6b262-f455-569f-9901-e9e109847893']::UUID[], '*Append
 Append 2 Table
 Append 3 Table
  Merge (Left Outer, Right Outer, Inner)
 *Group By
 Custom Column
 Merge Column | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('16937171-5b97-5c58-abe9-c31080c2d498', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 7, '*Univariable analysis
 *Bivariable analysis', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-06' WHERE id = '16937171-5b97-5c58-abe9-c31080c2d498';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('7c2b55b8-e4d4-5106-984f-9df146baa574', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-12-06', '10:30:00', '13:30:00', 180, ARRAY['16937171-5b97-5c58-abe9-c31080c2d498']::UUID[], '*Univariable analysis
 *Bivariable analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-06' WHERE id = '16937171-5b97-5c58-abe9-c31080c2d498';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('819de0d8-564e-5068-b991-cc9e113b698a', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-12-06', '14:30:00', '16:30:00', 120, ARRAY['16937171-5b97-5c58-abe9-c31080c2d498']::UUID[], '*Univariable analysis
 *Bivariable analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-07' WHERE id = '16937171-5b97-5c58-abe9-c31080c2d498';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('4d624438-499e-5164-8bcb-0b784f3bf2f7', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-12-07', '09:00:00', '13:30:00', 270, ARRAY['16937171-5b97-5c58-abe9-c31080c2d498']::UUID[], '*Univariable analysis
 *Bivariable analysis | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('3cb3a239-4e22-53c1-9875-477228ffd84b', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 99, 'CA1 Portions Revision', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-12' WHERE id = '3cb3a239-4e22-53c1-9875-477228ffd84b';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('6d32652c-10de-5f35-aaf9-a04b74ac4d79', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-12-12', '08:30:00', '11:30:00', 180, ARRAY['3cb3a239-4e22-53c1-9875-477228ffd84b']::UUID[], 'CA1 Portions Revision | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-12' WHERE id = '4b5d0091-b273-51be-b696-7d1af3a325f5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('dd23df5e-b31e-55b0-ae67-3c992be26c5f', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-12-12', '11:30:00', '13:30:00', 120, ARRAY['4b5d0091-b273-51be-b696-7d1af3a325f5']::UUID[], 'Hypothesis Testing(T-test)One Sample | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-12' WHERE id = '4b5d0091-b273-51be-b696-7d1af3a325f5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('3fc885e6-97b2-55ce-96dc-d9383889279f', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-12-12', '14:30:00', '16:30:00', 120, ARRAY['4b5d0091-b273-51be-b696-7d1af3a325f5']::UUID[], 'Hypothesis Testing(T-test)Two Sample | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('a1527047-c408-5a6a-8807-213b1f64f414', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 99, 'Revision and modelling of manufacturing unit', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-13' WHERE id = 'a1527047-c408-5a6a-8807-213b1f64f414';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('9ca31405-04c9-517c-a292-afd210947a21', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2024-12-13', '08:30:00', '10:30:00', 120, ARRAY['a1527047-c408-5a6a-8807-213b1f64f414']::UUID[], 'Revision and modelling of manufacturing unit | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-13' WHERE id = '45d160c0-ab9c-5fe5-9265-71d5934c2fe5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('ed2ce506-623a-5a2c-b87b-68895fbcc4b3', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-12-13', '10:30:00', '13:30:00', 180, ARRAY['45d160c0-ab9c-5fe5-9265-71d5934c2fe5']::UUID[], 'Multivariable analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-13' WHERE id = '45d160c0-ab9c-5fe5-9265-71d5934c2fe5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('a087d91a-3a7f-5df3-baee-6981e2bbfed1', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-12-13', '14:30:00', '16:30:00', 120, ARRAY['45d160c0-ab9c-5fe5-9265-71d5934c2fe5']::UUID[], 'Multivariable analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2024-12-14' WHERE id = '45d160c0-ab9c-5fe5-9265-71d5934c2fe5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b0a01213-7b33-532d-a678-652792b655fb', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2024-12-14', '09:00:00', '13:30:00', 270, ARRAY['45d160c0-ab9c-5fe5-9265-71d5934c2fe5']::UUID[], 'Multivariable analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-03' WHERE id = 'a1527047-c408-5a6a-8807-213b1f64f414';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('2ebfdd9e-a04a-5af9-816c-f9fa26ca2aa1', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-01-03', '08:30:00', '10:30:00', 120, ARRAY['a1527047-c408-5a6a-8807-213b1f64f414']::UUID[], 'CA 1 Exam Paper Explanation | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-03' WHERE id = '4b5d0091-b273-51be-b696-7d1af3a325f5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('23962f82-52ca-54ac-a143-366740d3deb2', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-03', '10:30:00', '12:30:00', 120, ARRAY['4b5d0091-b273-51be-b696-7d1af3a325f5']::UUID[], 'Hypothesis Testing (Ftest),Hypothesis Testing(Ztest) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-03' WHERE id = '4b5d0091-b273-51be-b696-7d1af3a325f5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('135d7f33-49f8-535d-9711-e0dde93c20ad', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-03', '14:30:00', '16:30:00', 120, ARRAY['4b5d0091-b273-51be-b696-7d1af3a325f5']::UUID[], 'Hypothesis Testing(Utest) | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('96174718-9152-5244-b5ad-916eb0265e57', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 12, '*Economy Analysis using r 
 *Hypothesis Testing(chi-square)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-04' WHERE id = '96174718-9152-5244-b5ad-916eb0265e57';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('cf3e7348-589d-5a6c-85ad-2a944010c319', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-04', '09:00:00', '13:30:00', 270, ARRAY['96174718-9152-5244-b5ad-916eb0265e57']::UUID[], '*Economy Analysis using r 
 *Hypothesis Testing(chi-square) | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('082966de-870f-5307-99f6-dc08dfde3ed2', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 11, '*Forecasting using regression
 *Economy Analysis using r', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-09' WHERE id = '082966de-870f-5307-99f6-dc08dfde3ed2';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('c3723398-514e-5cae-a6c3-6028d8f5f5d6', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-09', '08:30:00', '10:30:00', 120, ARRAY['082966de-870f-5307-99f6-dc08dfde3ed2']::UUID[], '*Forecasting using regression
 *Economy Analysis using r | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('6072d15d-d1ee-537a-91f2-f114551fbd6a', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 15, '* Creating Hierarchy (Eg: Country, State, District)
 * Conditional Formatting (Color Scale, Databars, Icons)
 * SUMX', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-09' WHERE id = '6072d15d-d1ee-537a-91f2-f114551fbd6a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('c5e9b33f-1f52-5bac-a1c7-f78bb9d8166e', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-01-09', '10:30:00', '13:30:00', 180, ARRAY['6072d15d-d1ee-537a-91f2-f114551fbd6a']::UUID[], '* Creating Hierarchy (Eg: Country, State, District)
 * Conditional Formatting (Color Scale, Databars, Icons)
 * SUMX | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-09' WHERE id = '082966de-870f-5307-99f6-dc08dfde3ed2';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('7ee48f28-72f7-5ea8-9258-46f4917953fb', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-09', '14:30:00', '16:30:00', 120, ARRAY['082966de-870f-5307-99f6-dc08dfde3ed2']::UUID[], '*Forecasting using regression
 *Economy Analysis using r | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('22bee84d-52ee-55ae-a0fa-3a391121ae66', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 9, '* Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)
 * Creating Hierarchy (Eg: Country, State, District)
 * Conditional Formatting (Color Scale, Databars, Icons)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-10' WHERE id = '22bee84d-52ee-55ae-a0fa-3a391121ae66';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('231b242f-0b21-54d1-868e-570c79ae20a8', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-01-10', '08:30:00', '10:30:00', 120, ARRAY['22bee84d-52ee-55ae-a0fa-3a391121ae66']::UUID[], '* Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)
 * Creating Hierarchy (Eg: Country, State, District)
 * Conditional Formatting (Color Scale, Databars, Icons) | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('8e62f236-dc00-5278-99d3-d1b289763c1e', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 13, '* Companay Analaysis using r
 * Risk return analysis of stocks
 * Moving average for decision making', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-10' WHERE id = '8e62f236-dc00-5278-99d3-d1b289763c1e';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('0645c180-83ef-5acd-82a3-40a6f7c0df5b', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-10', '10:30:00', '13:30:00', 180, ARRAY['8e62f236-dc00-5278-99d3-d1b289763c1e']::UUID[], '* Companay Analaysis using r
 * Risk return analysis of stocks
 * Moving average for decision making | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-10' WHERE id = '8e62f236-dc00-5278-99d3-d1b289763c1e';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('9230f462-a620-5c82-a477-92c36e52d52a', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-10', '14:30:00', '16:30:00', 120, ARRAY['8e62f236-dc00-5278-99d3-d1b289763c1e']::UUID[], '* Companay Analaysis using r
 * Risk return analysis of stocks
 * Moving average for decision making | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-11' WHERE id = '50ffd0a4-1cd2-5b5e-9643-829f545e70a1';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e8ed0218-d4fc-5cd1-8e42-801cbf5cf1e3', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-11', '09:00:00', '13:30:00', 270, ARRAY['50ffd0a4-1cd2-5b5e-9643-829f545e70a1']::UUID[], 'Performance analysis of stock | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-16' WHERE id = '52e053c3-1ed2-5e2e-b2a1-e5dc81514a7a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('801d18a9-b651-5ba1-8b45-d96c677984e5', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-16', '08:30:00', '10:30:00', 120, ARRAY['52e053c3-1ed2-5e2e-b2a1-e5dc81514a7a']::UUID[], 'Comparitive analysis of stocks for investment decision making | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-16' WHERE id = '6b86e271-314e-5b9e-813d-cb62554b1488';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1b07fcd1-5c5a-58d3-981e-94610a3ed409', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-01-16', '10:30:00', '13:30:00', 180, ARRAY['6b86e271-314e-5b9e-813d-cb62554b1488']::UUID[], '* CALCULATE
 * SAMEPERIODLASTYEAR
 * PARALLELPERIOD
 * DATESBETWEEN
 * TOTALYTD
 * DATESYTD | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-16' WHERE id = '52e053c3-1ed2-5e2e-b2a1-e5dc81514a7a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('5dee0f64-31b0-5a8f-8f20-82d975d50f11', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-16', '14:30:00', '16:30:00', 120, ARRAY['52e053c3-1ed2-5e2e-b2a1-e5dc81514a7a']::UUID[], 'Comparitive analysis of stocks for investment decision making | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-17' WHERE id = '6b86e271-314e-5b9e-813d-cb62554b1488';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('8b08f28d-c00e-55d9-b311-f2bf0fc3feaf', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-01-17', '08:30:00', '09:30:00', 60, ARRAY['6b86e271-314e-5b9e-813d-cb62554b1488']::UUID[], '* CALCULATE
 * SAMEPERIODLASTYEAR
 * PARALLELPERIOD
 * DATESBETWEEN
 * TOTALYTD
 * DATESYTD | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-17' WHERE id = '52e053c3-1ed2-5e2e-b2a1-e5dc81514a7a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('d655ae44-2ed0-597a-9b96-f251ccede891', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-17', '09:30:00', '13:30:00', 240, ARRAY['52e053c3-1ed2-5e2e-b2a1-e5dc81514a7a']::UUID[], 'Comparitive analysis of stocks for investment decision making | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('5b473f77-79f9-5a56-899d-91bf79887f25', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 99, 'Revision', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-23' WHERE id = '5b473f77-79f9-5a56-899d-91bf79887f25';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('fe12944f-b3bb-5487-aedc-652e3550e907', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-23', '08:30:00', '10:30:00', 120, ARRAY['5b473f77-79f9-5a56-899d-91bf79887f25']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('84b712d8-dc3f-542b-9e6b-f3a62cab2e4b', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 12, '*Unpivot
 *TOPN,Column with Example,RANKX', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-23' WHERE id = '84b712d8-dc3f-542b-9e6b-f3a62cab2e4b';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('6883607d-2f3c-5fba-93d0-71eaf8f681f2', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-01-23', '10:30:00', '13:30:00', 180, ARRAY['84b712d8-dc3f-542b-9e6b-f3a62cab2e4b']::UUID[], '*Unpivot
 *TOPN,Column with Example,RANKX | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-23' WHERE id = '84b712d8-dc3f-542b-9e6b-f3a62cab2e4b';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('87ac6747-32fa-5621-ac27-c1d59ba69501', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-01-23', '14:30:00', '16:30:00', 120, ARRAY['84b712d8-dc3f-542b-9e6b-f3a62cab2e4b']::UUID[], '*Unpivot
 *TOPN,Column with Example,RANKX | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('fdb0003e-5281-5c16-b34e-b2ad58972690', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 17, '* ALL
 TOPN
  RANKX
  Variable Declaration in Measure
 *Conditional Formatting using Measures', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-24' WHERE id = 'fdb0003e-5281-5c16-b34e-b2ad58972690';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('5d509612-92ce-5a24-aa39-1ac0b4527b6e', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-01-24', '08:30:00', '10:30:00', 120, ARRAY['fdb0003e-5281-5c16-b34e-b2ad58972690']::UUID[], '* ALL
 TOPN
  RANKX
  Variable Declaration in Measure
 *Conditional Formatting using Measures | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-24' WHERE id = '5b473f77-79f9-5a56-899d-91bf79887f25';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('c46675d7-9254-592b-8e35-1590e5053206', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-24', '10:30:00', '13:30:00', 180, ARRAY['5b473f77-79f9-5a56-899d-91bf79887f25']::UUID[], 'nan | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('dde20ba5-dfb0-5615-a923-cbcebb455df1', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 18, '* Row Level Security (Dynamic)
 * Introduction to Power BI Workspace
 * Creating Workspace
 * Workspace Roles (Admin, Member… etc)
 * Publishing Report to Workspace
 * Sharing Reports in Service
 * Scheduled Refresh
 * Create Dashboard in Power BI Service
 * Connect to Shared Dataset
 * Dataset Permissions
 * Alerts & Subscriptions
 * Creating Apps in Power BI Service
 * Explain Direct Query v/s Import Mode
 * Installation of Tableau
 * Basic Visualisation
 * Dashboard', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-30' WHERE id = 'dde20ba5-dfb0-5615-a923-cbcebb455df1';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('62f65533-59c9-58c4-aabe-ec5a3334b198', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-01-30', '10:30:00', '13:30:00', 180, ARRAY['dde20ba5-dfb0-5615-a923-cbcebb455df1']::UUID[], '* Row Level Security (Dynamic)
 * Introduction to Power BI Workspace
 * Creating Workspace
 * Workspace Roles (Admin, Member… etc)
 * Publishing Report to Workspace
 * Sharing Reports in Service
 * Scheduled Refresh
 * Create Dashboard in Power BI Service
 * Connect to Shared Dataset
 * Dataset Permissions
 * Alerts & Subscriptions
 * Creating Apps in Power BI Service
 * Explain Direct Query v/s Import Mode
 * Installation of Tableau
 * Basic Visualisation
 * Dashboard | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-31' WHERE id = 'a1527047-c408-5a6a-8807-213b1f64f414';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('a267fb09-b4cc-5857-86cf-cac3ab2df162', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-01-31', '08:30:00', '10:30:00', 120, ARRAY['a1527047-c408-5a6a-8807-213b1f64f414']::UUID[], 'Exam Supervision | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-01-31' WHERE id = '5b473f77-79f9-5a56-899d-91bf79887f25';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('0737e2b8-18db-57d0-b2f4-2ff531e0cc95', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-01-31', '10:30:00', '13:30:00', 180, ARRAY['5b473f77-79f9-5a56-899d-91bf79887f25']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-02-06' WHERE id = '5b473f77-79f9-5a56-899d-91bf79887f25';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('2488daa0-c4dc-5183-b7d8-e8b7dd7acaad', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-02-06', '08:30:00', '10:30:00', 120, ARRAY['5b473f77-79f9-5a56-899d-91bf79887f25']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('0bef5415-b2da-5306-9c6f-61469b265e08', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 22, '* Calculation in columns
 * Formattings
 * Dashboard
 * Basic Measures
 * Modelling
 * Dashboard', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-02-06' WHERE id = '0bef5415-b2da-5306-9c6f-61469b265e08';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('c9200e8e-52e3-5aa5-a9ea-84c8e880977b', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-02-06', '10:30:00', '13:30:00', 180, ARRAY['0bef5415-b2da-5306-9c6f-61469b265e08']::UUID[], '* Calculation in columns
 * Formattings
 * Dashboard
 * Basic Measures
 * Modelling
 * Dashboard | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-02-06' WHERE id = 'a1527047-c408-5a6a-8807-213b1f64f414';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('84e3833d-a10c-5a2d-b0cb-1f19606c47ad', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-02-06', '14:30:00', '17:00:00', 150, ARRAY['a1527047-c408-5a6a-8807-213b1f64f414']::UUID[], 'Practise CA 2 Paper | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('63f3f603-e30b-5bf3-9e12-998ec67b901a', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 23, '* Basic Measures
 * Modelling
 * Dashboard
 * Basic Cleaning
 * Modelling
 * Dashboard', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-02-07' WHERE id = '63f3f603-e30b-5bf3-9e12-998ec67b901a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('890ad3cb-7035-546d-a75a-1d154e84669c', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-02-07', '08:30:00', '10:30:00', 120, ARRAY['63f3f603-e30b-5bf3-9e12-998ec67b901a']::UUID[], '* Basic Measures
 * Modelling
 * Dashboard
 * Basic Cleaning
 * Modelling
 * Dashboard | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-02-07' WHERE id = '5b473f77-79f9-5a56-899d-91bf79887f25';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('4e3af203-ae8f-5ea7-8557-5e92b677d59b', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-02-07', '10:30:00', '12:30:00', 120, ARRAY['5b473f77-79f9-5a56-899d-91bf79887f25']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-02-07' WHERE id = 'f13d1eff-f856-5ab3-95ae-9ea23ab50cc6';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('107a07cb-97bf-59d2-b48c-d6219f5283cd', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-02-07', '12:30:00', '13:30:00', 60, ARRAY['f13d1eff-f856-5ab3-95ae-9ea23ab50cc6']::UUID[], '* Prepare from Previous Topics (Model Resizing, Modelling, Data Cleaning)
 * Custom Tooltip
 * Drill Through
 * Edit Interaction (Highlight, Filter)
 * Sorting in Visual | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('4ad73d30-0028-541f-ad79-12a87d9ed8f0', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 99, 'Final Sem Exam', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-03-26' WHERE id = '4ad73d30-0028-541f-ad79-12a87d9ed8f0';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('2866bf89-c826-56ef-941d-77a40dd05033', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-03-26', '10:00:00', '13:00:00', 180, ARRAY['4ad73d30-0028-541f-ad79-12a87d9ed8f0']::UUID[], 'Final Sem Exam | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('b519b7fb-7507-588a-a454-92851eb85fd9', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 99, 'Evaluation', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-03-26' WHERE id = 'b519b7fb-7507-588a-a454-92851eb85fd9';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('cee402f0-bd07-5814-90fb-71db0de65921', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-03-26', '13:00:00', '20:00:00', 420, ARRAY['b519b7fb-7507-588a-a454-92851eb85fd9']::UUID[], 'Evaluation | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-03-26' WHERE id = 'b519b7fb-7507-588a-a454-92851eb85fd9';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('4678b347-4798-5229-a725-c26ef22d4c70', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-03-26', '09:30:00', '13:00:00', 210, ARRAY['b519b7fb-7507-588a-a454-92851eb85fd9']::UUID[], 'Evaluation | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-03-27' WHERE id = '3cb3a239-4e22-53c1-9875-477228ffd84b';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('024f11b7-ba24-5e35-8555-31746060ec09', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-03-27', '13:30:00', '17:30:00', 240, ARRAY['3cb3a239-4e22-53c1-9875-477228ffd84b']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('e6e51f39-64f9-53da-8085-a432100904bb', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 99, 'Final Sem Exam', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-03-28' WHERE id = 'e6e51f39-64f9-53da-8085-a432100904bb';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('087ad341-6e9b-5066-871f-dbca6caf320e', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-03-28', '10:00:00', '13:00:00', 180, ARRAY['e6e51f39-64f9-53da-8085-a432100904bb']::UUID[], 'Final Sem Exam | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('3005e570-f5e7-5deb-aae4-ea3256f8380d', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 99, 'Evaluation', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-03-28' WHERE id = '3005e570-f5e7-5deb-aae4-ea3256f8380d';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('3ce8f143-300d-5ec5-acc1-9c0ee2f24170', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-03-28', '14:00:00', '19:15:00', 315, ARRAY['3005e570-f5e7-5deb-aae4-ea3256f8380d']::UUID[], 'Evaluation | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('8357c23b-f981-5749-a90c-9f16d14c5002', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 99, 'Indroducation', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-06-12' WHERE id = '8357c23b-f981-5749-a90c-9f16d14c5002';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e79fbefb-9987-545a-8acd-0791abc1ec81', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-06-12', '08:30:00', '10:30:00', 120, ARRAY['8357c23b-f981-5749-a90c-9f16d14c5002']::UUID[], 'Indroducation | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-06-12' WHERE id = 'db483c88-add2-5ab8-844a-0735e5168344';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('af4a4cbf-0a2b-5a3b-8ff5-a9202e30c041', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-06-12', '10:30:00', '13:30:00', 180, ARRAY['db483c88-add2-5ab8-844a-0735e5168344']::UUID[], 'Introduction to python,installation of anaconda,python interface,connecting file | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-06-13' WHERE id = 'db483c88-add2-5ab8-844a-0735e5168344';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('39441008-71f2-53d0-9647-f6f0ed479b1f', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-06-13', '08:30:00', '10:30:00', 120, ARRAY['db483c88-add2-5ab8-844a-0735e5168344']::UUID[], 'Introduction to python,installation of anaconda,python interface,connecting file | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-06-19' WHERE id = '26b802cf-5df6-56b9-9b54-be7ea2da8976';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1d1cdbc4-e3af-54a5-9122-f854bb84930d', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-06-19', '08:30:00', '10:20:00', 109, ARRAY['26b802cf-5df6-56b9-9b54-be7ea2da8976']::UUID[], '* Installation
 * Import Data from Excel
 * Basic Visualisation
 * Implicit Measures
 * Basic Formatting
 * Dashboard Creation | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-06-20' WHERE id = '70e32ba7-2c24-5af9-9bf5-40eec765e426';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('0a1bd23e-e27f-56de-87d9-0cc0f653d6a4', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-06-20', '08:30:00', '10:30:00', 120, ARRAY['70e32ba7-2c24-5af9-9bf5-40eec765e426']::UUID[], '* Import Data from CSV
 * Basic Visualisation
 * Implicit Measures
 * Explain Complete Formattings | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-04' WHERE id = '181cf83d-5c66-51a7-aed9-90df0a312307';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('075e526f-93e7-5b03-8031-8bd135438568', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-07-04', '08:30:00', '10:30:00', 120, ARRAY['181cf83d-5c66-51a7-aed9-90df0a312307']::UUID[], 'univariable analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-04' WHERE id = '5dabd52b-5101-55c1-8c9b-8f9393b4ed8d';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('eb9b20ea-74b9-5510-a2c2-d6fb0bf183f5', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-07-04', '14:30:00', '16:30:00', 120, ARRAY['5dabd52b-5101-55c1-8c9b-8f9393b4ed8d']::UUID[], '* Import Data from CSV
 * Drill Down Hierarchy
 * Forecasting
 * Create Mobile View
 * Insert Shapes | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-05' WHERE id = '1675586a-4798-5039-9a7b-52b60fd7b1ea';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1b34ed1e-b984-5251-833d-5f54fd741126', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-07-05', '08:30:00', '10:00:00', 90, ARRAY['1675586a-4798-5039-9a7b-52b60fd7b1ea']::UUID[], '* Import Data from Excel
 * Introduction to Power Query
 * Column Profiling
 * Column Distribution
 * Remove Rows
 * Remove Columns
 * Remove Empty Rows - Filtering
 * Fix Headers
 * Change Data types
 * Dashboard | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-05' WHERE id = '181cf83d-5c66-51a7-aed9-90df0a312307';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e3ad8d16-46ff-5efe-ae8d-4995ddebc106', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-07-05', '10:30:00', '13:00:00', 150, ARRAY['181cf83d-5c66-51a7-aed9-90df0a312307']::UUID[], 'univariable analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-10' WHERE id = 'b86eebe9-4231-53a9-953a-f831dbca46d5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('d7c7c2b8-b393-5447-b850-94cc6effffe7', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-07-10', '11:45:00', '13:30:00', 105, ARRAY['b86eebe9-4231-53a9-953a-f831dbca46d5']::UUID[], 'Data Visualization(Boxplot,Heatmap,Area Plot,Violin Plot,BubblePlot | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-10' WHERE id = '3cb3a239-4e22-53c1-9875-477228ffd84b';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b38020ea-715c-56b8-b16a-0fd95c60aee3', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-07-10', '14:30:00', '16:30:00', 120, ARRAY['3cb3a239-4e22-53c1-9875-477228ffd84b']::UUID[], 'Revision and Exam | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-11' WHERE id = 'b86eebe9-4231-53a9-953a-f831dbca46d5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b8543426-994e-5c87-9d23-3c7aacd4f81a', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-07-11', '08:30:00', '10:30:00', 120, ARRAY['b86eebe9-4231-53a9-953a-f831dbca46d5']::UUID[], 'Data Visualization(Boxplot,Heatmap,Area Plot,Violin Plot,BubblePlot | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-11' WHERE id = 'a5a9ca55-9a56-5cec-8b10-014e403f3086';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('d9cfcf1a-be8f-5eb1-8fa4-0154ec94c226', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-07-11', '11:30:00', '14:30:00', 180, ARRAY['a5a9ca55-9a56-5cec-8b10-014e403f3086']::UUID[], '* Date Transformation (Day, Month, Year)
 * Calculated Column - Basic (Addition, Subtraction, Division, Multiplication) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-17' WHERE id = 'a5a9ca55-9a56-5cec-8b10-014e403f3086';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('dbdc857c-f1ae-57df-a30c-8586856f3e37', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-07-17', '08:30:00', '10:05:00', 94, ARRAY['a5a9ca55-9a56-5cec-8b10-014e403f3086']::UUID[], '* Date Transformation (Day, Month, Year)
 * Calculated Column - Basic (Addition, Subtraction, Division, Multiplication) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-18' WHERE id = 'f1c6b02f-13d9-520d-b12d-d6cdee75d962';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('fcc954a6-fe5b-5e77-865f-5cd9d9e3f2d9', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-07-18', '08:30:00', '10:30:00', 120, ARRAY['f1c6b02f-13d9-520d-b12d-d6cdee75d962']::UUID[], '* Introduction to Measure (Advantages)
 * Explicit Measures
 * Basic Modelling (Auto Detecting, Connecting Tables)
 * Navigators
 * Creating Buttons | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-31' WHERE id = '053332d0-20e7-5436-b341-bc1bff7b44a4';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('56885b75-9e4a-5fbe-ad7d-0f950c475acb', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-07-31', '08:30:00', '10:30:00', 120, ARRAY['053332d0-20e7-5436-b341-bc1bff7b44a4']::UUID[], '* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO) | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('14f6a469-6536-5e51-b0cb-cae8cea74853', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 6, '*Data Cleaning( Handling Missing Data,Handling Duplicates)
 *Valuecount and Visualization,Formating of visualization,Groupby', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-31' WHERE id = '14f6a469-6536-5e51-b0cb-cae8cea74853';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('5a06ff5a-f16f-5a81-8bb8-8930e1be3dcd', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-07-31', '10:30:00', '13:30:00', 180, ARRAY['14f6a469-6536-5e51-b0cb-cae8cea74853']::UUID[], '*Data Cleaning( Handling Missing Data,Handling Duplicates)
 *Valuecount and Visualization,Formating of visualization,Groupby | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-31' WHERE id = '053332d0-20e7-5436-b341-bc1bff7b44a4';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1c6388b7-613a-5584-a695-606f4b48d23a', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-07-31', '14:30:00', '16:30:00', 120, ARRAY['053332d0-20e7-5436-b341-bc1bff7b44a4']::UUID[], '* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-07-31' WHERE id = '14f6a469-6536-5e51-b0cb-cae8cea74853';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('9508525b-bb55-59d0-b120-7563dc745019', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-07-31', '17:30:00', '20:00:00', 150, ARRAY['14f6a469-6536-5e51-b0cb-cae8cea74853']::UUID[], '*Data Cleaning( Handling Missing Data,Handling Duplicates)
 *Valuecount and Visualization,Formating of visualization,Groupby | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('cfdbdc29-2543-513b-9b72-3dbc6d8bd5ab', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 99, 'Revision of LD', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-07' WHERE id = 'cfdbdc29-2543-513b-9b72-3dbc6d8bd5ab';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('500c584d-bb9f-5753-9a13-44d90a6806df', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-08-07', '08:30:00', '10:30:00', 120, ARRAY['cfdbdc29-2543-513b-9b72-3dbc6d8bd5ab']::UUID[], 'Revision of LD | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('a9612ef2-7ad2-56d9-9dbc-006aa82dbc2d', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 7, '*Data Cleaning 2- removing duplicates ,converting data type and analyze the data
*Add Columns and doing calculations
*Data Consolidation and formatting (Table Formatting)
*Risk Analysis(Stock Market)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-07' WHERE id = 'a9612ef2-7ad2-56d9-9dbc-006aa82dbc2d';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('d7fdbb77-f2f9-5382-be56-5a7fa40be751', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-08-07', '10:30:00', '13:30:00', 180, ARRAY['a9612ef2-7ad2-56d9-9dbc-006aa82dbc2d']::UUID[], '*Data Cleaning 2- removing duplicates ,converting data type and analyze the data
*Add Columns and doing calculations
*Data Consolidation and formatting (Table Formatting)
*Risk Analysis(Stock Market) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-07' WHERE id = 'a9612ef2-7ad2-56d9-9dbc-006aa82dbc2d';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('5397b5f5-dc2e-503a-85ca-ccf6f973921e', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-08-07', '14:30:00', '16:30:00', 120, ARRAY['a9612ef2-7ad2-56d9-9dbc-006aa82dbc2d']::UUID[], '*Data Cleaning 2- removing duplicates ,converting data type and analyze the data
*Add Columns and doing calculations
*Data Consolidation and formatting (Table Formatting)
*Risk Analysis(Stock Market) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-08' WHERE id = 'a7433db3-524e-5d78-9d19-3e1a9df8cad2';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('77097e2b-2674-558d-9fd7-06bacfb146b5', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-08-08', '08:30:00', '10:30:00', 120, ARRAY['a7433db3-524e-5d78-9d19-3e1a9df8cad2']::UUID[], '* Calculated Column (IF, Nested IF, SWITCH, AND, OR)
 * Remaining Visuals (Scatter Plot, Decomposition Tree, Smar Narrative, Ribbon Chart, Waterfall) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-08' WHERE id = 'a9612ef2-7ad2-56d9-9dbc-006aa82dbc2d';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('29a103d5-b2bf-5686-9323-c48b0d047dab', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-08-08', '11:30:00', '13:30:00', 120, ARRAY['a9612ef2-7ad2-56d9-9dbc-006aa82dbc2d']::UUID[], '*Data Cleaning 2- removing duplicates ,converting data type and analyze the data
*Add Columns and doing calculations
*Data Consolidation and formatting (Table Formatting)
*Risk Analysis(Stock Market) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-20' WHERE id = '3464b546-f04d-50ae-bf76-5a3af77f90e8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e4f55398-7575-51bb-8d9e-8f26e9bce735', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-08-20', '10:30:00', '13:30:00', 180, ARRAY['3464b546-f04d-50ae-bf76-5a3af77f90e8']::UUID[], 'if,While,for ,iterators ,inhertiance,lamada | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-21' WHERE id = 'a7433db3-524e-5d78-9d19-3e1a9df8cad2';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('f3ed1991-7e8d-524d-95c7-c1ed76fc95c1', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-08-21', '08:30:00', '10:30:00', 120, ARRAY['a7433db3-524e-5d78-9d19-3e1a9df8cad2']::UUID[], '* Calculated Column (IF, Nested IF, SWITCH, AND, OR)
 * Remaining Visuals (Scatter Plot, Decomposition Tree, Smar Narrative, Ribbon Chart, Waterfall) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-21' WHERE id = '727ead0e-a633-579f-9a6a-5ab41d3ed8e4';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1f78fa86-6de4-56e8-86c7-da897a8a9d17', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-08-21', '10:30:00', '13:30:00', 180, ARRAY['727ead0e-a633-579f-9a6a-5ab41d3ed8e4']::UUID[], 'Scatter Plot,Violin plot, kdeplot | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-22' WHERE id = '29ec8c66-c4eb-568d-b6c7-bff2bd0994b4';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('0bdf53eb-5585-53f0-9f20-327bbc27b162', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-08-22', '08:30:00', '10:30:00', 120, ARRAY['29ec8c66-c4eb-568d-b6c7-bff2bd0994b4']::UUID[], '* Installation of Tableau
 * Basic Visualisation
 * Dashboard | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-22' WHERE id = '39f6d4f9-3562-584a-9011-8c49728ec8f9';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('88165e7f-ea0e-5117-890b-ab277a7ae541', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-08-22', '10:30:00', '13:30:00', 180, ARRAY['39f6d4f9-3562-584a-9011-8c49728ec8f9']::UUID[], 'Correlation Matrix(heatplot),cross tabulation matrix,Quality Control Charts | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-22' WHERE id = '29ec8c66-c4eb-568d-b6c7-bff2bd0994b4';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('5c424fba-82ae-5816-975a-b365104ab2ce', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-08-22', '14:30:00', '16:30:00', 120, ARRAY['29ec8c66-c4eb-568d-b6c7-bff2bd0994b4']::UUID[], '* Installation of Tableau
 * Basic Visualisation
 * Dashboard | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('f9a835ee-0eb1-5aed-8196-ad37003d1849', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 22, '* Calculation in columns
 * Formattings
 * Dashboard
 * Basic Measures
 * Modelling
 * Dashboard
 * Basic Cleaning
 * Modelling
 * Dashboard', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-23' WHERE id = 'f9a835ee-0eb1-5aed-8196-ad37003d1849';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1a680d68-2fb8-5a17-8fb3-9a0a522d1e39', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-08-23', '08:30:00', '10:30:00', 120, ARRAY['f9a835ee-0eb1-5aed-8196-ad37003d1849']::UUID[], '* Calculation in columns
 * Formattings
 * Dashboard
 * Basic Measures
 * Modelling
 * Dashboard
 * Basic Cleaning
 * Modelling
 * Dashboard | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('1184607b-9da9-59b1-9af8-7b497a532bda', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 13, '*DataType and Applications
 *Python Operators', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-08-23' WHERE id = '1184607b-9da9-59b1-9af8-7b497a532bda';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('dae4e9f3-02cc-5962-adfc-f3322f85ced9', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-08-23', '10:30:00', '13:30:00', 180, ARRAY['1184607b-9da9-59b1-9af8-7b497a532bda']::UUID[], '*DataType and Applications
 *Python Operators | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-09-11' WHERE id = 'da0cadf6-bff6-55cd-9829-7f791299737f';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('2cb0e5f0-19be-5cd6-bd26-1c8e7a1fdd57', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-09-11', '08:30:00', '10:30:00', 120, ARRAY['da0cadf6-bff6-55cd-9829-7f791299737f']::UUID[], '* Transpose
 * Fill
 * Pivot column
 * Unpivot column
 * Remove Errors
 * Replace Errors | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('2d79e3f2-ed5f-58ef-b9bf-14563b13cdb3', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 8, 'Hypothesis Testing(Parametric Testing)-T Test,Ftest
Hypothesis Testing(Non-Parametric Testing)-Utest,Chisquare Test', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-09-11' WHERE id = '2d79e3f2-ed5f-58ef-b9bf-14563b13cdb3';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('49334548-06aa-52a4-911c-8c6d42666baa', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-09-11', '10:30:00', '13:30:00', 180, ARRAY['2d79e3f2-ed5f-58ef-b9bf-14563b13cdb3']::UUID[], 'Hypothesis Testing(Parametric Testing)-T Test,Ftest
Hypothesis Testing(Non-Parametric Testing)-Utest,Chisquare Test | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-09-12' WHERE id = '153583c4-64a1-5eeb-8170-ba092c6204b0';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('9f0eb327-7652-59d9-afc8-c25dd6008a20', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-09-12', '08:30:00', '10:30:00', 120, ARRAY['153583c4-64a1-5eeb-8170-ba092c6204b0']::UUID[], '* Group By
 * Text Formatting (Upper Case, Lower Case, Trim, Clean, Prefix, Suffix)
 * Split Column, Column from Examples | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-09-12' WHERE id = '2a07e00b-5899-5635-8447-12ab4a746a20';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('aec27069-55df-537b-8ef7-63faa36e1fed', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-09-12', '11:30:00', '13:30:00', 120, ARRAY['2a07e00b-5899-5635-8447-12ab4a746a20']::UUID[], 'Introduction to Machine Learning,Simple Linear Regression | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-09-12' WHERE id = 'f11827d7-b937-5425-9f0f-b39ae0c9b15e';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1862d628-8b45-528a-beac-57e76ce63355', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-09-12', '14:30:00', '16:30:00', 120, ARRAY['f11827d7-b937-5425-9f0f-b39ae0c9b15e']::UUID[], '* Custom Column
 * Conditional Column
 * Merge Column | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-09-13' WHERE id = '6b86e271-314e-5b9e-813d-cb62554b1488';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('a5309b5f-4476-5e20-bd0a-7b3e2555495e', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-09-13', '09:30:00', '13:30:00', 240, ARRAY['6b86e271-314e-5b9e-813d-cb62554b1488']::UUID[], '* CALCULATE
 * SAMEPERIODLASTYEAR
 * PARALLELPERIOD
 * DATESBETWEEN
 * TOTALYTD
 * DATESYTD | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('9bfcd916-161b-55d2-bf39-82fddc04ebcc', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 17, '* PREVIOUSMONTH
* SUMX', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-09-18' WHERE id = '9bfcd916-161b-55d2-bf39-82fddc04ebcc';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('d832769c-9603-5547-90c5-c7447be7a830', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-09-18', '08:30:00', '10:30:00', 120, ARRAY['9bfcd916-161b-55d2-bf39-82fddc04ebcc']::UUID[], '* PREVIOUSMONTH
* SUMX | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-09-18' WHERE id = '9490b17c-ee48-5e72-bbb9-d102ee206eb2';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1bfec6f0-e490-533f-97d8-89a909c0d450', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-09-18', '10:30:00', '13:30:00', 180, ARRAY['9490b17c-ee48-5e72-bbb9-d102ee206eb2']::UUID[], 'ABC Analysis | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('0e739102-9807-5b00-9124-d00979059ff6', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 11, '* Custom Tooltip
* CALCULATE
 * SAMEPERIODLASTYEAR
 * PARALLELPERIOD
 * DATESBETWEEN
 * TOTALYTD
 * DATESYTD"', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-09-19' WHERE id = '0e739102-9807-5b00-9124-d00979059ff6';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('6a0a28d1-42c1-5750-87b2-a7468dde217b', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-09-19', '08:30:00', '10:30:00', 120, ARRAY['0e739102-9807-5b00-9124-d00979059ff6']::UUID[], '* Custom Tooltip
* CALCULATE
 * SAMEPERIODLASTYEAR
 * PARALLELPERIOD
 * DATESBETWEEN
 * TOTALYTD
 * DATESYTD" | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-09-19' WHERE id = '3464b546-f04d-50ae-bf76-5a3af77f90e8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('39e7dc7a-6e33-546f-b711-35b8aaa33d66', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-09-19', '10:30:00', '13:30:00', 180, ARRAY['3464b546-f04d-50ae-bf76-5a3af77f90e8']::UUID[], 'Random Forests(Risk Management) | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('4d7e0ee5-2823-5b13-9842-30ecf5fb748e', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 99, 'Exam Supervision', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-10-17' WHERE id = '4d7e0ee5-2823-5b13-9842-30ecf5fb748e';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e9297d90-d10f-5990-babd-006e25443e7c', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'Anoop Baiju', '2025-10-17', '10:00:00', '12:00:00', 120, ARRAY['4d7e0ee5-2823-5b13-9842-30ecf5fb748e']::UUID[], 'Exam Supervision | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('0f9cf6ef-e091-5405-bec4-e7ff11fa9142', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 99, 'Exam Supervision', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-10-23' WHERE id = '0f9cf6ef-e091-5405-bec4-e7ff11fa9142';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e9e4f8f9-34d3-5716-b896-0ae370dcba5a', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2025-10-23', '10:00:00', '13:00:00', 180, ARRAY['0f9cf6ef-e091-5405-bec4-e7ff11fa9142']::UUID[], 'Exam Supervision | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-06' WHERE id = '1a4fcf7a-9127-5011-80a7-89a2fd2ee8d8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('4632fa25-aac8-531c-bde4-350024f52afa', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-06', '08:35:00', '11:05:00', 150, ARRAY['1a4fcf7a-9127-5011-80a7-89a2fd2ee8d8']::UUID[], 'Introduction to R and RStudio Interface | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-06' WHERE id = '1a4fcf7a-9127-5011-80a7-89a2fd2ee8d8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b183e474-4700-5813-9b95-01bcdb2829d8', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-06', '11:10:00', '13:00:00', 109, ARRAY['1a4fcf7a-9127-5011-80a7-89a2fd2ee8d8']::UUID[], 'Introduction to R and RStudio Interface | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('70363940-85cc-51c4-b625-16107234f970', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 99, 'LinedIn Post', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-07' WHERE id = '70363940-85cc-51c4-b625-16107234f970';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('9ce175f6-9fa4-5581-9175-00ed5b7f3dae', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-07', '08:35:00', '10:20:00', 105, ARRAY['70363940-85cc-51c4-b625-16107234f970']::UUID[], 'LinedIn Post | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-13' WHERE id = 'af53c0ee-1c33-517d-846d-e3bf8880827d';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('2f617602-4d93-5b6d-a28c-6bab80852d33', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-13', '08:35:00', '10:20:00', 105, ARRAY['af53c0ee-1c33-517d-846d-e3bf8880827d']::UUID[], 'Advanced Data Cleaning | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-13' WHERE id = 'af53c0ee-1c33-517d-846d-e3bf8880827d';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('056ec5fd-25b6-567f-aa35-d3f63acfc912', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-13', '10:40:00', '14:45:00', 244, ARRAY['af53c0ee-1c33-517d-846d-e3bf8880827d']::UUID[], 'Understanding R Syntax, Variables, and Data Types | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('80f2aed6-73be-5fe9-9bc7-7d293e7e53df', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 3, 'Data Manipulation using dplyr and Combining and Reshaping Datasets', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-20' WHERE id = '80f2aed6-73be-5fe9-9bc7-7d293e7e53df';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e99a0f42-9db4-5250-b9a3-583ccbb20093', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-20', '08:35:00', '11:35:00', 180, ARRAY['80f2aed6-73be-5fe9-9bc7-7d293e7e53df']::UUID[], 'Data Manipulation using dplyr and Combining and Reshaping Datasets | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-20' WHERE id = 'af53c0ee-1c33-517d-846d-e3bf8880827d';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('864d8cd8-11fb-5d8b-b0f9-3854f92b27c9', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-20', '11:40:00', '13:30:00', 109, ARRAY['af53c0ee-1c33-517d-846d-e3bf8880827d']::UUID[], 'Understanding R Syntax, Variables, and Data Types | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-20' WHERE id = '57001bd4-904f-575d-88a5-e6f81cd7de06';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('db5fd907-c167-5fd4-9b38-68f745cc6a04', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-20', '14:30:00', '16:30:00', 120, ARRAY['57001bd4-904f-575d-88a5-e6f81cd7de06']::UUID[], 'Importing Data from CSV/Excel | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-21' WHERE id = '03577bc5-b15c-5f0b-aee7-f418703f5b23';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('33e1675c-2d31-5ca2-b7de-283b36013324', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-21', '08:35:00', '10:20:00', 105, ARRAY['03577bc5-b15c-5f0b-aee7-f418703f5b23']::UUID[], 'Basic Data Cleaning | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-21' WHERE id = '80f2aed6-73be-5fe9-9bc7-7d293e7e53df';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('df9d6363-4524-5df0-995e-eea4266217d3', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-21', '11:40:00', '13:35:00', 115, ARRAY['80f2aed6-73be-5fe9-9bc7-7d293e7e53df']::UUID[], 'Data Manipulation using dplyr and Combining and Reshaping Datasets | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('02d258a5-9d8e-5752-8afe-937d20619433', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 6, 'Summary Statistics and Correlation & Advanced Charts', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-27' WHERE id = '02d258a5-9d8e-5752-8afe-937d20619433';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e9fd7888-b5c3-5c68-9c12-711aee70ee67', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-27', '08:35:00', '11:10:00', 154, ARRAY['02d258a5-9d8e-5752-8afe-937d20619433']::UUID[], 'Summary Statistics and Correlation & Advanced Charts | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-27' WHERE id = '02d258a5-9d8e-5752-8afe-937d20619433';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('109a1ea2-591c-5aeb-a008-c40df25e4a4e', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-27', '11:15:00', '12:45:00', 90, ARRAY['02d258a5-9d8e-5752-8afe-937d20619433']::UUID[], 'Filtering and Subsetting Data & Basic Descriptive Statistics | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('34eb569a-4160-5791-ac71-58ddc86686e5', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 8, 'Creating Basic Charts and Using Functions in Data Frames', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-27' WHERE id = '34eb569a-4160-5791-ac71-58ddc86686e5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('07b86e60-ba62-545d-a847-48be52e5eb9c', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-27', '14:30:00', '16:30:00', 120, ARRAY['34eb569a-4160-5791-ac71-58ddc86686e5']::UUID[], 'Creating Basic Charts and Using Functions in Data Frames | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-28' WHERE id = '34eb569a-4160-5791-ac71-58ddc86686e5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('3b996a8d-bc1b-57ae-9263-362d447077ac', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-28', '08:35:00', '10:20:00', 105, ARRAY['34eb569a-4160-5791-ac71-58ddc86686e5']::UUID[], 'Creating Basic Charts and Using Functions in Data Frames | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-11-28' WHERE id = '34eb569a-4160-5791-ac71-58ddc86686e5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('0be0cba6-8f2d-5b57-b5a4-10af4dce81c4', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-11-28', '11:35:00', '13:35:00', 120, ARRAY['34eb569a-4160-5791-ac71-58ddc86686e5']::UUID[], 'Data Visualization using ggplot2 and Customizing ggplot2 Charts | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-12-11' WHERE id = '47f87c1e-e060-5171-848e-c607021e8102';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('83b01ff9-5f1e-5105-9293-71a0a5603238', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-12-11', '08:35:00', '11:05:00', 150, ARRAY['47f87c1e-e060-5171-848e-c607021e8102']::UUID[], 'Hypothesis Testing(Parametric Testing)-T Test,Ftest | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-12-11' WHERE id = '47f87c1e-e060-5171-848e-c607021e8102';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('30f96f1f-4b79-534f-bd52-f8b0b8fdc168', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-12-11', '11:10:00', '12:45:00', 94, ARRAY['47f87c1e-e060-5171-848e-c607021e8102']::UUID[], 'Hypothesis Testing(Parametric Testing)-T Test,Ftest
Hypothesis Testing(Non-Parametric Testing)-Utest,Chisquare Test - Introduction | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('535f3482-ee2c-5e49-92a3-4a9ee74e55f5', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 11, 'Hypothesis Testing(Parametric Testing)-T Test,Ftest', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-12-12' WHERE id = '535f3482-ee2c-5e49-92a3-4a9ee74e55f5';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('a7f048b1-f289-5f50-8887-60ef309c9683', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-12-12', '08:35:00', '10:20:00', 105, ARRAY['535f3482-ee2c-5e49-92a3-4a9ee74e55f5']::UUID[], 'Hypothesis Testing(Parametric Testing)-T Test,Ftest | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-12-12' WHERE id = '47f87c1e-e060-5171-848e-c607021e8102';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('20d48e47-2ec2-5773-9783-3250089aa24c', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-12-12', '11:35:00', '13:35:00', 120, ARRAY['47f87c1e-e060-5171-848e-c607021e8102']::UUID[], 'Hypothesis Testing(Non-Parametric Testing)-Chisquare Test | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('f6ffa02a-14c0-5187-9520-13d1b598a63c', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 11, 'Hypothesis Testing(Non-Parametric Testing)-Utest and Introduction Linear Regression', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-12-18' WHERE id = 'f6ffa02a-14c0-5187-9520-13d1b598a63c';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('47daa872-6553-52cc-88ba-7fec787276c3', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-12-18', '08:35:00', '11:05:00', 150, ARRAY['f6ffa02a-14c0-5187-9520-13d1b598a63c']::UUID[], 'Hypothesis Testing(Non-Parametric Testing)-Utest and Introduction Linear Regression | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-12-18' WHERE id = '47f87c1e-e060-5171-848e-c607021e8102';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('73732974-6075-51d8-8390-ad9afa51c3b5', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-12-18', '11:10:00', '12:45:00', 94, ARRAY['47f87c1e-e060-5171-848e-c607021e8102']::UUID[], 'Hypothesis Testing(Non-Parametric Testing)-Chisquare and Utest | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-12-19' WHERE id = '2470b675-3621-5ceb-b3b7-f2ebbf5e4676';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('2b72e7c4-f229-5daf-9354-89433ded8e21', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-12-19', '08:35:00', '10:20:00', 105, ARRAY['2470b675-3621-5ceb-b3b7-f2ebbf5e4676']::UUID[], 'Correlation and Covariance | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2025-12-19' WHERE id = '2470b675-3621-5ceb-b3b7-f2ebbf5e4676';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b12ee08f-e4e6-50b3-b29b-d7ea52288c23', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2025-12-19', '11:35:00', '13:30:00', 115, ARRAY['2470b675-3621-5ceb-b3b7-f2ebbf5e4676']::UUID[], 'Simple Linear Regression | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-01-16' WHERE id = '2470b675-3621-5ceb-b3b7-f2ebbf5e4676';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('c675ee13-37f3-5082-a178-aa5fa5e83634', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-01-16', '08:35:00', '10:20:00', 105, ARRAY['2470b675-3621-5ceb-b3b7-f2ebbf5e4676']::UUID[], 'Correlation and Covariance | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-01-16' WHERE id = '940329ee-bbe7-5d38-9f44-d79be4436320';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('7f1858a1-c55c-5983-b1e8-d590412b9b4f', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-01-16', '11:35:00', '13:30:00', 115, ARRAY['940329ee-bbe7-5d38-9f44-d79be4436320']::UUID[], 'Multiple Linear Regression | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-01-22' WHERE id = '7503c5f1-cf9b-53ca-8f30-b9e598f85f8a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('c95b9e22-1acd-5887-9c00-6f90dd9d9a80', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-01-22', '08:35:00', '11:05:00', 150, ARRAY['7503c5f1-cf9b-53ca-8f30-b9e598f85f8a']::UUID[], 'Time Series Analysis and Forecasting | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-01-22' WHERE id = '7503c5f1-cf9b-53ca-8f30-b9e598f85f8a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b3c7b4e7-e83d-5739-9083-c2bb22b0e9b5', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-01-22', '11:10:00', '12:45:00', 94, ARRAY['7503c5f1-cf9b-53ca-8f30-b9e598f85f8a']::UUID[], 'Time Series Analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-01-23' WHERE id = '7503c5f1-cf9b-53ca-8f30-b9e598f85f8a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1f60376f-c3d2-5cae-83d2-6a5683e00ec1', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-01-23', '08:35:00', '10:20:00', 105, ARRAY['7503c5f1-cf9b-53ca-8f30-b9e598f85f8a']::UUID[], 'Time Series Analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-01-23' WHERE id = '7503c5f1-cf9b-53ca-8f30-b9e598f85f8a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('050705c0-cd6d-5747-915f-95c6b4e31fd4', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-01-23', '11:35:00', '13:30:00', 115, ARRAY['7503c5f1-cf9b-53ca-8f30-b9e598f85f8a']::UUID[], 'Time Series Analysis and Forecasting | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-01-29' WHERE id = '827f161a-53bf-5d70-b6f9-c14ae1447083';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('2e385a3d-52f5-5163-a623-79a96005fb9e', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-01-29', '08:35:00', '11:05:00', 150, ARRAY['827f161a-53bf-5d70-b6f9-c14ae1447083']::UUID[], 'Machine Learning Analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-01-29' WHERE id = '827f161a-53bf-5d70-b6f9-c14ae1447083';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('81d9b634-91a1-58f8-84e8-0570f3a575f6', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-01-29', '11:10:00', '12:45:00', 94, ARRAY['827f161a-53bf-5d70-b6f9-c14ae1447083']::UUID[], 'Mini Project 3 – Final Data Analysis Report | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-01-30' WHERE id = '827f161a-53bf-5d70-b6f9-c14ae1447083';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e6971a43-118e-5d77-a738-6bac521afdd4', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-01-30', '08:35:00', '10:20:00', 105, ARRAY['827f161a-53bf-5d70-b6f9-c14ae1447083']::UUID[], 'Mini Project 3 – Final Data Analysis Report | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-01-30' WHERE id = '827f161a-53bf-5d70-b6f9-c14ae1447083';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('6cc6bd83-7956-58df-b937-fe68a0f07cdf', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-01-30', '11:35:00', '13:30:00', 115, ARRAY['827f161a-53bf-5d70-b6f9-c14ae1447083']::UUID[], 'Machine Learning Analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-02-12' WHERE id = '5b473f77-79f9-5a56-899d-91bf79887f25';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b0002a50-c11c-55ce-a13b-dca5f42d6063', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-02-12', '08:35:00', '11:05:00', 150, ARRAY['5b473f77-79f9-5a56-899d-91bf79887f25']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-02-12' WHERE id = '5b473f77-79f9-5a56-899d-91bf79887f25';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('d1b22d07-b1bc-5b10-afbb-e21acb520a71', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-02-12', '11:10:00', '12:45:00', 94, ARRAY['5b473f77-79f9-5a56-899d-91bf79887f25']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('51901a19-a497-53e1-8750-df487e00d2ed', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 99, 'Exam Supervision', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-03-11' WHERE id = '51901a19-a497-53e1-8750-df487e00d2ed';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('345ddceb-a44b-5dc1-8fa7-6663d499ec13', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-03-11', '09:30:00', '13:00:00', 210, ARRAY['51901a19-a497-53e1-8750-df487e00d2ed']::UUID[], 'Exam Supervision | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-03-11' WHERE id = 'b519b7fb-7507-588a-a454-92851eb85fd9';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('8bf9817d-459e-59bc-8c19-1557332b3945', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-03-11', '14:30:00', '19:30:00', 300, ARRAY['b519b7fb-7507-588a-a454-92851eb85fd9']::UUID[], 'Evaluation | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-03-12' WHERE id = 'b519b7fb-7507-588a-a454-92851eb85fd9';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('cbd2aaa2-41cf-57f8-aa81-65e6e512385c', '8a54d49d-839d-5fa2-b577-78056eb6ba84', 'Anoop Baiju', '2026-03-12', '06:30:00', '10:00:00', 210, ARRAY['b519b7fb-7507-588a-a454-92851eb85fd9']::UUID[], 'Evaluation | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('5be6bcf1-a299-58ac-a8a1-7d930877a446', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 99, 'Business Model', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-10' WHERE id = '5be6bcf1-a299-58ac-a8a1-7d930877a446';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('0c591393-4bee-568b-b055-fbee830ab026', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Anoop Baiju', '2026-06-10', '08:35:00', '13:35:00', 300, ARRAY['5be6bcf1-a299-58ac-a8a1-7d930877a446']::UUID[], 'Business Model | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-11' WHERE id = '8dd82fa3-92e6-5d26-af1d-5e3727a152ca';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('cad34007-a698-5286-879c-e11785fc642c', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-06-11', '08:35:00', '10:20:00', 105, ARRAY['8dd82fa3-92e6-5d26-af1d-5e3727a152ca']::UUID[], '* Installation
 * Import Data from Excel
 * Basic Visualisation
 * Implicit Measures
 * Basic Formatting
 * Dashboard Creation | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-11' WHERE id = 'db483c88-add2-5ab8-844a-0735e5168344';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('e1946317-1fd0-55ea-bfba-942f6fe1d369', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-06-11', '11:35:00', '13:35:00', 120, ARRAY['db483c88-add2-5ab8-844a-0735e5168344']::UUID[], 'Introduction to python,installation of anaconda,python interface,connecting file ,import library,python programming basics,understanding database, | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('2057c64b-e060-51cf-9407-4164cd98c590', '34c63423-ac65-5b21-995d-e1d359f10ef6', 1, '* Installation
 * Import Data from Excel
 * Basic Visualisation
 * Implicit Measures
 * Basic Formatting
 * Dashboard Creation
* Drill Down Hierarchy', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-12' WHERE id = '2057c64b-e060-51cf-9407-4164cd98c590';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('70bf7022-6519-5ef2-aa85-d31724ae8a9e', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-06-12', '08:35:00', '10:20:00', 105, ARRAY['2057c64b-e060-51cf-9407-4164cd98c590']::UUID[], '* Installation
 * Import Data from Excel
 * Basic Visualisation
 * Implicit Measures
 * Basic Formatting
 * Dashboard Creation
* Drill Down Hierarchy | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-12' WHERE id = '181cf83d-5c66-51a7-aed9-90df0a312307';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('c15e7270-7c2c-574d-a98f-9e9a2d0b59b4', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-06-12', '10:40:00', '13:35:00', 175, ARRAY['181cf83d-5c66-51a7-aed9-90df0a312307']::UUID[], 'univariable analysis | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-16' WHERE id = '5be6bcf1-a299-58ac-a8a1-7d930877a446';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('a84415c2-f7be-5273-9839-d685690f3908', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Anoop Baiju', '2026-06-16', '08:35:00', '10:20:00', 105, ARRAY['5be6bcf1-a299-58ac-a8a1-7d930877a446']::UUID[], 'Business Model,Conditional Formatting,Data Validations,Button,Goal Seek | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('282a0647-92c9-5fea-a27f-2f4a4029f0d7', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 99, 'Introduction Power BI,Basic Dashboard,Fomratting Background,Data Label,Title', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-16' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('53ded0ad-ccd0-533b-a69e-092d80dea240', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-06-16', '14:30:00', '16:30:00', 120, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Introduction Power BI,Basic Dashboard,Fomratting Background,Data Label,Title | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-17' WHERE id = '5be6bcf1-a299-58ac-a8a1-7d930877a446';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('7999e393-614d-5d89-b7ad-2bf6146c4836', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Anoop Baiju', '2026-06-17', '08:35:00', '12:15:00', 220, ARRAY['5be6bcf1-a299-58ac-a8a1-7d930877a446']::UUID[], 'Scenario Manger,Charts,Name Manager,If,Nested if | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-17' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1b165e0a-45fb-58d8-8bcf-d730338669e8', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-06-17', '12:15:00', '13:35:00', 79, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Remove Blank Columns,Blank rows,Use first rows as header,Modelling | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('e6ff0f48-6a7c-5db7-a99b-5c7e21596bc6', '34c63423-ac65-5b21-995d-e1d359f10ef6', 4, '* Import Data from Excel
 * Introduction to Power Query
 * Column Profiling
 * Column Distribution
 * Remove Rows
 * Remove Columns
 * Remove Empty Rows - Filtering
 * Fix Headers
 * Change Data types
 * Dashboard
 * Basic Modelling (Auto Detecting, Connecting Tables)
 * Calculated Column - Basic (Addition, Subtraction, Division, Multiplication)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-18' WHERE id = 'e6ff0f48-6a7c-5db7-a99b-5c7e21596bc6';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('451b85ba-0b9c-5bbe-8dba-2b6f07e936b2', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-06-18', '08:35:00', '10:20:00', 105, ARRAY['e6ff0f48-6a7c-5db7-a99b-5c7e21596bc6']::UUID[], '* Import Data from Excel
 * Introduction to Power Query
 * Column Profiling
 * Column Distribution
 * Remove Rows
 * Remove Columns
 * Remove Empty Rows - Filtering
 * Fix Headers
 * Change Data types
 * Dashboard
 * Basic Modelling (Auto Detecting, Connecting Tables)
 * Calculated Column - Basic (Addition, Subtraction, Division, Multiplication) | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('32191fb1-1a70-5fc8-9247-18e3855d1095', '34c63423-ac65-5b21-995d-e1d359f10ef6', 5, '* Basic Modelling (Auto Detecting, Connecting Tables)
* Calculated Column - Basic (Addition, Subtraction, Division, Multiplication)
*  Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
* Calculated Column (IF, Nested IF, SWITCH, AND, OR)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-18' WHERE id = '32191fb1-1a70-5fc8-9247-18e3855d1095';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('45aa6674-f16c-5d94-871d-bd0a18e13be1', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-06-18', '14:00:00', '16:00:00', 120, ARRAY['32191fb1-1a70-5fc8-9247-18e3855d1095']::UUID[], '* Basic Modelling (Auto Detecting, Connecting Tables)
* Calculated Column - Basic (Addition, Subtraction, Division, Multiplication)
*  Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
* Calculated Column (IF, Nested IF, SWITCH, AND, OR) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-23' WHERE id = '5be6bcf1-a299-58ac-a8a1-7d930877a446';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('8e2b88ba-6437-5584-935b-e3c9f9a8c918', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Anoop Baiju', '2026-06-23', '08:35:00', '10:20:00', 105, ARRAY['5be6bcf1-a299-58ac-a8a1-7d930877a446']::UUID[], 'If,IFs,OR,AND,Conditional Formatting | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-23' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1030206b-fa34-564a-a8a0-8e807252519d', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-06-23', '14:30:00', '16:30:00', 120, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Modelling,Remove Rows,Columns,Use first row as header | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-24' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('f308cadb-9b82-53f8-b9cf-d747339c0f68', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-06-24', '08:35:00', '11:00:00', 145, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'One to Many ,Many to one | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-24' WHERE id = '5be6bcf1-a299-58ac-a8a1-7d930877a446';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('2da34d8b-e57e-513f-b633-110e210e68b5', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Anoop Baiju', '2026-06-24', '11:00:00', '13:30:00', 150, ARRAY['5be6bcf1-a299-58ac-a8a1-7d930877a446']::UUID[], 'Sumif,Sum,Average,max,min,Count,Counta,averageif,sumifs | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-25' WHERE id = '6a87489b-8059-57a5-ba6e-bd1fd44ea88a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1c7a3c3d-1f7e-5ffa-8a1e-2d883a6ed541', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-06-25', '08:35:00', '10:20:00', 105, ARRAY['6a87489b-8059-57a5-ba6e-bd1fd44ea88a']::UUID[], '* Introduction to Measure (Advantages)
 * Explicit Measures
 * Basic Modelling (Auto Detecting, Connecting Tables)
 * Navigators
 * Creating Buttons | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('c609dddd-e55e-59fa-aa58-c27e09b1b5ea', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 6, '* Data Cleaning - removing rows, columns, droping null values,replace the mean
* Data Cleaning 2- removing duplicates ,converting data type and analyze the data
* Add Columns and doing calculations', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-25' WHERE id = 'c609dddd-e55e-59fa-aa58-c27e09b1b5ea';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('7f54fecc-9729-5f29-b306-9fd2cfae9132', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-06-25', '11:35:00', '13:35:00', 120, ARRAY['c609dddd-e55e-59fa-aa58-c27e09b1b5ea']::UUID[], '* Data Cleaning - removing rows, columns, droping null values,replace the mean
* Data Cleaning 2- removing duplicates ,converting data type and analyze the data
* Add Columns and doing calculations | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-30' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('d5a96e8d-b04a-5bff-a256-509a7f4e6c25', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-06-30', '08:35:00', '10:20:00', 105, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Modelling,Remove Rows,Columns,Use first row as header | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-06-30' WHERE id = '5be6bcf1-a299-58ac-a8a1-7d930877a446';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b8ace156-c391-5064-9fc6-e75c0817f2fd', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Anoop Baiju', '2026-06-30', '14:30:00', '16:30:00', 120, ARRAY['5be6bcf1-a299-58ac-a8a1-7d930877a446']::UUID[], 'Sumifs,sumif,avergeif,avergeifs,maxifs,minifs | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-01' WHERE id = '5be6bcf1-a299-58ac-a8a1-7d930877a446';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('4bde231e-42ea-57c1-abbc-153c6db4d4e2', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Anoop Baiju', '2026-07-01', '08:35:00', '10:20:00', 105, ARRAY['5be6bcf1-a299-58ac-a8a1-7d930877a446']::UUID[], 'Table design,Formula | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-01' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('6f162c43-104b-5812-8781-57eba52bf6bc', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-01', '10:40:00', '13:35:00', 175, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Modelling,Remove Rows,Columns,Use first row as header | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('59177f35-9149-5621-a954-160a5fe2874a', '34c63423-ac65-5b21-995d-e1d359f10ef6', 6, '* Calculated Column (IF, Nested IF, SWITCH, AND, OR)
* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-02' WHERE id = '59177f35-9149-5621-a954-160a5fe2874a';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('f4a6f7b2-4073-5d6f-8292-4391fbfa0fb5', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-07-02', '08:35:00', '10:20:00', 105, ARRAY['59177f35-9149-5621-a954-160a5fe2874a']::UUID[], '* Calculated Column (IF, Nested IF, SWITCH, AND, OR)
* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-02' WHERE id = 'e976850d-20cc-5f1c-9337-f0aa354eedff';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('c1eb79b5-9e8f-5498-9559-1cabbb108cfd', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-07-02', '11:35:00', '13:35:00', 120, ARRAY['e976850d-20cc-5f1c-9337-f0aa354eedff']::UUID[], 'Valuecount and Visualization,Formating of visualization,Groupby, | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('03879442-242e-583a-b33e-40ec17592769', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 99, 'Revision', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-07' WHERE id = '03879442-242e-583a-b33e-40ec17592769';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('32d2bc3c-09e2-5d04-95f6-2d3147572bc1', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Anoop Baiju', '2026-07-07', '08:35:00', '10:20:00', 105, ARRAY['03879442-242e-583a-b33e-40ec17592769']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('21e7c4ee-1b9d-5ca0-953d-8052aca81bdb', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 99, 'Revision and ISA Exam', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-07' WHERE id = '21e7c4ee-1b9d-5ca0-953d-8052aca81bdb';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1ccc214a-d76d-5ddc-9572-da246054bec1', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Anoop Baiju', '2026-07-07', '14:30:00', '16:30:00', 120, ARRAY['21e7c4ee-1b9d-5ca0-953d-8052aca81bdb']::UUID[], 'Revision and ISA Exam | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('1c1f781a-2cb6-5fcb-b31a-bebc91595235', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 99, 'Revision', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-08' WHERE id = '1c1f781a-2cb6-5fcb-b31a-bebc91595235';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('3c66eb37-76b2-59ae-9100-8c382f531113', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-08', '08:35:00', '12:30:00', 235, ARRAY['1c1f781a-2cb6-5fcb-b31a-bebc91595235']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('de4c20c0-af30-582e-94e1-0c66da399cee', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 99, 'ISA Exam', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-08' WHERE id = 'de4c20c0-af30-582e-94e1-0c66da399cee';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('92e3fa57-d377-582e-aa75-ecbb64ebcafc', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-08', '12:30:00', '13:30:00', 60, ARRAY['de4c20c0-af30-582e-94e1-0c66da399cee']::UUID[], 'ISA Exam | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('71eb693c-31a2-5140-9761-0cb957c0d9ea', '34c63423-ac65-5b21-995d-e1d359f10ef6', 99, 'Revision', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-09' WHERE id = '71eb693c-31a2-5140-9761-0cb957c0d9ea';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('5013eb8d-bf15-57c8-9551-34701d9b12c9', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-07-09', '08:35:00', '10:20:00', 105, ARRAY['71eb693c-31a2-5140-9761-0cb957c0d9ea']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('5f1fe862-bf9a-5397-9076-f7224d593d1e', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 99, 'Revision', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-09' WHERE id = '5f1fe862-bf9a-5397-9076-f7224d593d1e';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('6b212643-1832-5553-9bf7-f02c549ae98c', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-07-09', '11:35:00', '13:35:00', 120, ARRAY['5f1fe862-bf9a-5397-9076-f7224d593d1e']::UUID[], 'Revision | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('87aad8ec-503f-56f0-8a8c-2772f5982403', '34c63423-ac65-5b21-995d-e1d359f10ef6', 99, 'Revision and ISA Exam', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-10' WHERE id = '87aad8ec-503f-56f0-8a8c-2772f5982403';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('cc514ab5-0e2d-52c7-9ea9-ea436ea4c244', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-07-10', '08:35:00', '10:20:00', 105, ARRAY['87aad8ec-503f-56f0-8a8c-2772f5982403']::UUID[], 'Revision and ISA Exam | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('55ae5253-b040-52e1-9511-b464b4aa2718', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 99, 'Revision and ISA Exam', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-10' WHERE id = '55ae5253-b040-52e1-9511-b464b4aa2718';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('378ba0b7-7fa4-5a1c-8a1a-1e3d77f68962', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-07-10', '10:40:00', '13:35:00', 175, ARRAY['55ae5253-b040-52e1-9511-b464b4aa2718']::UUID[], 'Revision and ISA Exam | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-14' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('46d0e9e9-1343-5e43-a5d2-ae1ae7c9f36a', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-14', '08:35:00', '10:20:00', 105, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Modelling,Remove Rows,Columns,Use first row as header | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-14' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b4cb3293-7661-5869-a9a4-d64ffd751537', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-14', '14:30:00', '16:30:00', 120, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Star Schema Modelling,Remove Rows,Columns,Use first row as header,create columns,if,if and,if or | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-15' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('b35db785-e01a-515a-81a8-756759824231', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-15', '08:35:00', '10:20:00', 105, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Merge columns,split columns | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-15' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('bd4e4df8-8000-53a8-ad3f-7532daf9b053', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-15', '10:40:00', '13:35:00', 175, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Conditional formatting,Filter Topn and basic filtering,calender,create table,slicer | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('e2b6996c-88ab-5f22-940c-795cc4e0bb19', '34c63423-ac65-5b21-995d-e1d359f10ef6', 7, '* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO)
 * Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)
 * Merge Column
 * Split Column', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-16' WHERE id = 'e2b6996c-88ab-5f22-940c-795cc4e0bb19';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('ccd440d6-b918-5e9b-8017-b6625395e3fb', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-07-16', '08:35:00', '10:20:00', 105, ARRAY['e2b6996c-88ab-5f22-940c-795cc4e0bb19']::UUID[], '* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO)
 * Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)
 * Merge Column
 * Split Column | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('c4fa5760-2ec2-5ae1-ab36-023ce33e2ab0', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 4, '*Valuecount and Visualization,Formating of visualization,Groupby
*Advanced Visualization
*Data Cleaning - removing rows, columns, droping null values,replace the mean
*Data Cleaning 2- removing duplicates ,converting data type and analyze the data
*Add Columns and doing calculations
*Data Consolidation and formatting (Table Formatting)', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-16' WHERE id = 'c4fa5760-2ec2-5ae1-ab36-023ce33e2ab0';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('ee5aba46-a593-5f6d-bb5d-d194773764d9', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-07-16', '11:35:00', '13:35:00', 120, ARRAY['c4fa5760-2ec2-5ae1-ab36-023ce33e2ab0']::UUID[], '*Valuecount and Visualization,Formating of visualization,Groupby
*Advanced Visualization
*Data Cleaning - removing rows, columns, droping null values,replace the mean
*Data Cleaning 2- removing duplicates ,converting data type and analyze the data
*Add Columns and doing calculations
*Data Consolidation and formatting (Table Formatting) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-22' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('c91a4136-e9c6-5fba-8aad-e1aa03d02241', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-22', '11:35:00', '13:35:00', 120, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'XLookup,VLookup | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-22' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('4ad4bb56-0efe-54a5-8925-acca43c85d0b', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-22', '14:30:00', '16:30:00', 120, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'XLookup,VLookup | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-23' WHERE id = 'e2b6996c-88ab-5f22-940c-795cc4e0bb19';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('609699a9-1381-58fa-a77b-c849f4a804b4', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-07-23', '08:35:00', '10:20:00', 105, ARRAY['e2b6996c-88ab-5f22-940c-795cc4e0bb19']::UUID[], '* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO)
 * Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)
 * Merge Column
 * Split Column | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-23' WHERE id = 'ec621271-418c-5d34-a7c6-268694c835e8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('6bbebe21-b45b-5d6b-9d2c-1ec1904c21b1', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-07-23', '11:35:00', '13:35:00', 120, ARRAY['ec621271-418c-5d34-a7c6-268694c835e8']::UUID[], 'Module 1 and Module 2 Assessment | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-24' WHERE id = 'e2b6996c-88ab-5f22-940c-795cc4e0bb19';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('8c082635-1784-5414-8fe6-a8195a5c8061', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-07-24', '08:35:00', '10:20:00', 105, ARRAY['e2b6996c-88ab-5f22-940c-795cc4e0bb19']::UUID[], '* Model Resizing or Table Resizing
 * Remove Duplicates
 * Advanced Modelling (1 to 1, 1 to Many, Many to Many, Relationship Cardinality, Star Schema, Snow Flake(Explain Snowflake))
 * Connecting Different Tables
 * Calendar Table (CALENDARAUTO)
 * Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)
 * Merge Column
 * Split Column | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-24' WHERE id = 'c4fa5760-2ec2-5ae1-ab36-023ce33e2ab0';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('4b71ee7b-22cf-5a86-9b90-7052e45191dd', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-07-24', '10:40:00', '13:35:00', 175, ARRAY['c4fa5760-2ec2-5ae1-ab36-023ce33e2ab0']::UUID[], '*Valuecount and Visualization,Formating of visualization,Groupby
*Advanced Visualization
*Data Cleaning - removing rows, columns, droping null values,replace the mean
*Data Cleaning 2- removing duplicates ,converting data type and analyze the data
*Add Columns and doing calculations
*Data Consolidation and formatting (Table Formatting) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-28' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('1949ac8a-45ab-5225-a6fd-a3ea0eb51cc3', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-28', '08:35:00', '10:20:00', 105, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Trim,Captilze each word,merge columns,merge queries,column from examples,custom column,filter columns,remove duplicates,replace | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-29' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('9716b0a0-3030-59e2-82bc-7934c4afae24', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-07-29', '08:35:00', '13:35:00', 300, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Trim,Captilze each word,merge columns,merge queries,column from examples,custom column,filter columns,remove duplicates,replace,duplicated sheet,enable edit | ') ON CONFLICT DO NOTHING;
INSERT INTO public.uct_batch_course_syllabus (id, batch_course_id, topic_no, topic_name, planned_hours, is_completed) VALUES ('3c53bf8f-d6be-57bd-b8f3-bc3ebb396219', '34c63423-ac65-5b21-995d-e1d359f10ef6', 9, '* SUMX
 * Themes (Customizing, Adding, Saving, Uploading)
 * Sync Slicers
 * Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)
* Custom Tooltip
* Introduction to Measure (Advantages)
 * Explicit Measures', 2.0, false) ON CONFLICT (batch_course_id, topic_no) DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-30' WHERE id = '3c53bf8f-d6be-57bd-b8f3-bc3ebb396219';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('7fdcfb93-595d-5c15-a264-2c61ac3d3efc', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-07-30', '08:35:00', '10:20:00', 105, ARRAY['3c53bf8f-d6be-57bd-b8f3-bc3ebb396219']::UUID[], '* SUMX
 * Themes (Customizing, Adding, Saving, Uploading)
 * Sync Slicers
 * Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)
* Custom Tooltip
* Introduction to Measure (Advantages)
 * Explicit Measures | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-30' WHERE id = 'c4fa5760-2ec2-5ae1-ab36-023ce33e2ab0';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('3d9a842d-9bc8-5f88-a3f9-118e2e6158c3', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-07-30', '11:35:00', '13:35:00', 120, ARRAY['c4fa5760-2ec2-5ae1-ab36-023ce33e2ab0']::UUID[], '*Valuecount and Visualization,Formating of visualization,Groupby
*Advanced Visualization
*Data Cleaning - removing rows, columns, droping null values,replace the mean
*Data Cleaning 2- removing duplicates ,converting data type and analyze the data
*Add Columns and doing calculations
*Data Consolidation and formatting (Table Formatting) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-31' WHERE id = '3c53bf8f-d6be-57bd-b8f3-bc3ebb396219';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('8b2f5a9c-06a9-56c9-a743-899db1923828', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-07-31', '08:35:00', '10:20:00', 105, ARRAY['3c53bf8f-d6be-57bd-b8f3-bc3ebb396219']::UUID[], '* SUMX
 * Themes (Customizing, Adding, Saving, Uploading)
 * Sync Slicers
 * Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)
* Custom Tooltip
* Introduction to Measure (Advantages)
 * Explicit Measures | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-07-31' WHERE id = 'c4fa5760-2ec2-5ae1-ab36-023ce33e2ab0';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('f9b9606b-024e-53f0-acd8-e1094759d31b', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-07-31', '10:40:00', '13:35:00', 175, ARRAY['c4fa5760-2ec2-5ae1-ab36-023ce33e2ab0']::UUID[], '*Valuecount and Visualization,Formating of visualization,Groupby
*Advanced Visualization
*Data Cleaning - removing rows, columns, droping null values,replace the mean
*Data Cleaning 2- removing duplicates ,converting data type and analyze the data
*Add Columns and doing calculations
*Data Consolidation and formatting (Table Formatting) | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-08-07' WHERE id = '3c53bf8f-d6be-57bd-b8f3-bc3ebb396219';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('0e924f50-363e-5e9e-8557-dae6e31311e1', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Anoop Baiju', '2026-08-07', '08:35:00', '10:20:00', 105, ARRAY['3c53bf8f-d6be-57bd-b8f3-bc3ebb396219']::UUID[], '* SUMX
 * Themes (Customizing, Adding, Saving, Uploading)
 * Sync Slicers
 * Filter Pane (Filter on this visual, Filter on this Page, Filter on all Pages)
* Custom Tooltip
* Introduction to Measure (Advantages)
 * Explicit Measures | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-08-07' WHERE id = 'ec621271-418c-5d34-a7c6-268694c835e8';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('15a736d9-78e6-5d2c-b4a9-05e7c88c617a', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Anoop Baiju', '2026-08-07', '10:40:00', '12:35:00', 115, ARRAY['ec621271-418c-5d34-a7c6-268694c835e8']::UUID[], 'Assessment 2 | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-08-11' WHERE id = '282a0647-92c9-5fea-a27f-2f4a4029f0d7';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('aa476fc2-74c7-5b78-94ca-43d8cfdbc23d', '1e95cf66-16af-42b9-bd97-b7d81a67993c', 'Anoop Baiju', '2026-08-11', '08:35:00', '10:20:00', 105, ARRAY['282a0647-92c9-5fea-a27f-2f4a4029f0d7']::UUID[], 'Measure,sumx,tooltip,condition formatting | ') ON CONFLICT DO NOTHING;
UPDATE public.uct_batch_course_syllabus SET is_completed = true, completed_date = '2026-08-11' WHERE id = '5be6bcf1-a299-58ac-a8a1-7d930877a446';
INSERT INTO public.uct_trainer_logs (id, batch_course_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes) VALUES ('bc3310c1-7594-5e42-9362-1c7eaebc1301', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Anoop Baiju', '2026-08-11', '14:30:00', '16:30:00', 120, ARRAY['5be6bcf1-a299-58ac-a8a1-7d930877a446']::UUID[], 'Index and Match | ') ON CONFLICT DO NOTHING;

-- 7. INSERT ASSESSMENT GRADES
INSERT INTO public.uct_assessments (id, batch_course_id, name, type_id, max_mark) VALUES ('3e7646db-86de-5433-b68c-c4e6703995a3', 'b0b29a94-574e-54ed-9c52-c7008fe9ef1b', 'Assignment3', 'a0000000-0000-0000-0000-000000000001', 10.0) ON CONFLICT DO NOTHING;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ef6f561f-1c30-55d9-bbe9-30bd8fd68747', '3e7646db-86de-5433-b68c-c4e6703995a3', '9fcf6c02-62a2-5a35-9d21-f8ef3ab1b756', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('99a47e97-dd73-5632-a7b9-dd2ab806e9da', '3e7646db-86de-5433-b68c-c4e6703995a3', 'be87c13d-81ed-5987-876e-e962139c3796', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('1b7313a2-9046-53df-84d2-ddc1bac0858b', '3e7646db-86de-5433-b68c-c4e6703995a3', 'b3e3c006-d00e-5a08-87b4-ac3f2a765b54', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('d135fb43-b79f-5086-832b-01d693ffd44c', '3e7646db-86de-5433-b68c-c4e6703995a3', 'a0b286a4-7d2b-5305-b85d-6b000d66da67', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('86cd9213-daf1-5643-b591-98d66c4beca7', '3e7646db-86de-5433-b68c-c4e6703995a3', '8c603c6b-686e-5f3f-8571-d32616ce94cd', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('0d7ad059-7d29-51ca-b629-b4b608839f9d', '3e7646db-86de-5433-b68c-c4e6703995a3', '60e21686-0af0-57af-a4db-abdc4aaaa403', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('c9d31cb0-38cb-5f5f-8531-e621ed7f61f4', '3e7646db-86de-5433-b68c-c4e6703995a3', 'd3f610fc-b72f-5f80-8030-ba6a6fc6f364', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('aa25669f-f432-54b9-8653-23c54b4dee0e', '3e7646db-86de-5433-b68c-c4e6703995a3', '97a3ceac-5f08-539b-83bb-2d477b6bcc39', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ac2ccab8-8cce-564b-afb8-0f8a12687f55', '3e7646db-86de-5433-b68c-c4e6703995a3', '870076c9-ba6d-5cbf-a1c8-f3f518774a95', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('3edd6bfd-7216-5e13-9103-75cf7039d4a7', '3e7646db-86de-5433-b68c-c4e6703995a3', '51b16ce0-f2d8-5dae-8cac-576008d28ea9', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ccfce03d-c844-5d39-a098-2e10c927cca7', '3e7646db-86de-5433-b68c-c4e6703995a3', 'c9df319b-6a09-5553-b05d-7f7af7a0163d', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ab27c83b-049b-54aa-a4a8-802c8e94f70d', '3e7646db-86de-5433-b68c-c4e6703995a3', 'd584da96-44b0-5ca5-bad3-735fd79ac139', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('71ba460d-b696-5bec-8f92-05aca44664f2', '3e7646db-86de-5433-b68c-c4e6703995a3', 'afc72ebf-9477-50fe-9a36-10190ae3c837', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('62e9118d-5941-5007-a14f-10250430ed36', '3e7646db-86de-5433-b68c-c4e6703995a3', '219a401d-b746-5a10-9c37-b84d54a8162d', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('76123dfb-0ad7-505f-a2c2-16074c812b77', '3e7646db-86de-5433-b68c-c4e6703995a3', 'eab3057e-8817-562b-aa4d-135120edf8a1', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('e7b7381d-3ac9-52ef-9c6f-56119cd6f270', '3e7646db-86de-5433-b68c-c4e6703995a3', '65eae68e-b622-59e0-97f8-ae7a5cef2b00', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('02def644-96f8-5e5f-9d39-4ca1ff65b434', '3e7646db-86de-5433-b68c-c4e6703995a3', 'f8030b0c-271f-52e9-b865-37c3cf4245df', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('972657b1-acc0-56b4-a840-2c3be06ae431', '3e7646db-86de-5433-b68c-c4e6703995a3', '09fb4d93-d013-5f91-879c-599400962cbb', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('5436ebe8-0018-529e-8d8a-11095df3c459', '3e7646db-86de-5433-b68c-c4e6703995a3', '438431fe-6131-5345-871b-e992457cdae9', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('afc4d9a9-6159-56f7-8893-7a1262d7f7a5', '3e7646db-86de-5433-b68c-c4e6703995a3', 'f3f4dc30-ea50-5df5-838b-371903d80182', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('3e4c2bcb-0c59-5444-8afe-11301c1ce99b', '3e7646db-86de-5433-b68c-c4e6703995a3', 'f7805548-5e94-5968-95f6-eadab260cc24', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('7e06c008-175c-5501-96c9-015ac26a1be1', '3e7646db-86de-5433-b68c-c4e6703995a3', '857acbe5-daca-5a2c-9958-525ca0a09d30', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('164f7334-bba8-56d5-aa87-607ebb51f48d', '3e7646db-86de-5433-b68c-c4e6703995a3', 'a11f05f7-153a-5cb1-b210-2cfb6b0411d6', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('d61358c3-8140-5fdd-8a2a-6665499fb9a6', '3e7646db-86de-5433-b68c-c4e6703995a3', '1cc042ad-f66a-5b6e-a6d1-8f9b7210c445', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('e7084692-cc5b-555d-bb92-f8bbaa94d8c7', '3e7646db-86de-5433-b68c-c4e6703995a3', '51c2e598-fe7e-57bf-b364-82e4e79c7275', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('e279a5e2-50e8-5f85-b515-0b4081b82f7d', '3e7646db-86de-5433-b68c-c4e6703995a3', '5fd2a0f3-22ff-55b2-8f95-2af464f290f5', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('bdee3c69-fdce-5b97-b3fa-a47a83072019', '3e7646db-86de-5433-b68c-c4e6703995a3', 'b5349ed4-2c20-59f7-b3f3-8d0356b3ba9d', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('d135ba76-2daf-59dd-bc66-e56692ee7f0f', '3e7646db-86de-5433-b68c-c4e6703995a3', '64c68a90-e521-5b98-bca1-323fdf67be52', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('fa5871b7-8ff9-555d-869c-fc7c77debfc9', '3e7646db-86de-5433-b68c-c4e6703995a3', '9773e005-4c39-52a5-833c-c74504422c0b', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('e8bc2e19-37a5-5793-8b5c-591133f7a596', '3e7646db-86de-5433-b68c-c4e6703995a3', 'dfe09b65-330b-53ac-8dc3-c4cb9a89fc13', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('e0647fe0-63ac-59ad-b248-446b84433882', '3e7646db-86de-5433-b68c-c4e6703995a3', '14a0e5f7-a95d-5212-84be-1225bd2cfa89', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('cd602af6-4801-5126-9bdb-947532847934', '3e7646db-86de-5433-b68c-c4e6703995a3', '9311d9ed-97b9-5f57-a43c-a912a4e91469', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('f571973c-7ded-5d6a-8fc2-a22ec4ed2ff1', '3e7646db-86de-5433-b68c-c4e6703995a3', 'c94ed674-56ff-5ef3-8b50-f03658868142', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('277b8f74-4293-5bb4-8191-539e12b2ccba', '3e7646db-86de-5433-b68c-c4e6703995a3', '1c4663fe-4591-5edb-b69a-f18e431ce538', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('0cc9237d-7c42-5bc4-993c-1699750024c0', '3e7646db-86de-5433-b68c-c4e6703995a3', 'be5ab52d-59fb-5532-97a2-2a563c687a38', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('01f81bca-28d4-5d95-a175-7044703201a3', '3e7646db-86de-5433-b68c-c4e6703995a3', '825f3153-b9ac-5b9a-bb10-0cac4b9af9ba', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('1c5bf863-65ad-5597-9127-b93741992984', '3e7646db-86de-5433-b68c-c4e6703995a3', '9fe4cac7-4610-59ea-8a8e-addd43029267', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('91b8e102-83ac-54f7-ae72-d484040ad420', '3e7646db-86de-5433-b68c-c4e6703995a3', 'de59512a-dc59-5dd9-9ac3-ad5fffaad0b8', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('890def17-09e9-5c62-9b47-5145d685837a', '3e7646db-86de-5433-b68c-c4e6703995a3', 'c229408c-9473-53a5-b671-af86be027fd0', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('743cb214-433d-5cfb-b31e-6c6a65a6492d', '3e7646db-86de-5433-b68c-c4e6703995a3', 'ece8757c-b4b2-57b1-8214-d9beba003fb6', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('5de18dc8-4d8a-53bb-a338-0377b3d5134e', '3e7646db-86de-5433-b68c-c4e6703995a3', '3932318a-ef2d-5d80-967d-4fe380537ecf', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ff0707ec-ed7c-58f7-8a62-c0af06309624', '3e7646db-86de-5433-b68c-c4e6703995a3', '2dac025d-fa65-5cd3-9ad2-eb2ef7e92b66', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('93d1dd61-9877-502a-ac2f-8bfff6976473', '3e7646db-86de-5433-b68c-c4e6703995a3', '3936e855-47c8-5b31-8a1e-d73815caa812', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('5b7f1483-ebec-5691-a5eb-a58d6da6ece9', '3e7646db-86de-5433-b68c-c4e6703995a3', '4adc5ed6-9a11-5f2c-9204-52e5d3241349', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('87b9c7a7-48c1-5dca-9ff6-7e7697798821', '3e7646db-86de-5433-b68c-c4e6703995a3', '1af296c2-5d23-5fd6-a84a-158affc72f21', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessments (id, batch_course_id, name, type_id, max_mark) VALUES ('5a3bdb67-ebae-54e9-91cb-2513b6cb31e3', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'SAS', 'c0000000-0000-0000-0000-000000000004', 40.0) ON CONFLICT DO NOTHING;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('86630587-288e-507f-b15a-22e8f9484880', '5a3bdb67-ebae-54e9-91cb-2513b6cb31e3', 'f3f4dc30-ea50-5df5-838b-371903d80182', 28) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('56abe958-c19c-5002-ac9f-045852c0a7b5', '5a3bdb67-ebae-54e9-91cb-2513b6cb31e3', '60e21686-0af0-57af-a4db-abdc4aaaa403', 38) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessments (id, batch_course_id, name, type_id, max_mark) VALUES ('ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'ISA', 'i0000000-0000-0000-0000-000000000003', 10.0) ON CONFLICT DO NOTHING;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('81e6f2b7-4f69-5a75-9171-6fc46f5a5ca3', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '47cac0dc-0da2-4db3-a722-1f18a5e6d224', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('056f4d96-e360-5a61-a099-755023c43ff5', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', 'd574ba74-ea48-407c-97ad-f27da000d904', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('e0bdad07-4832-5e50-96d7-0f17bff8ebc7', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', 'ae4a3af9-836c-41c0-a8a3-ab02b6467d5f', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('009d9d02-77e3-5d07-9ed9-bb840799a9ba', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '7623f5ad-dabf-4481-bf6d-83f4982e0c28', 6) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('cf3d9c83-21f2-5615-8246-d5ef2841ff0d', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '165882d6-8257-49fc-8af9-deff2544fd82', 4) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('db01e14e-fc39-5092-b358-c586735076c7', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '29350673-5d12-4fa2-a47f-b2bfaa122af1', 8) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('34b3ec5a-72a3-5af7-8dd1-bab8e69daad9', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '82caaab6-08ad-442d-97c1-a9951678575f', 6) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('0f697ae3-fa11-545e-bb36-be3571471ab9', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', 'd719c622-fb1b-4d3c-98cf-4fde8d3b2b00', 8) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('f6e0ca5e-1ad6-5f1e-bb70-92c3399b0ede', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', 'e158ae8c-0457-4ce8-ad69-b7004f452603', 9) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('5cb462f5-9eeb-5cd9-b7fb-7901bf7db6f1', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '147fc0d9-0388-4f8d-a300-6656b4cb69c7', 4) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('18f6c25d-6dae-53af-bde7-2ae34468f87b', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '717e10ae-db6e-406f-9957-2e445f52a664', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('bfa5c3a7-484a-5599-951a-75aa3a0067ab', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', 'f0dbe6e8-2576-4b03-911c-ef2c0128e2c3', 8) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ab0a6906-8043-5ef8-b8bd-ac6b8cc8d19c', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '24affc65-8db1-40de-bbb2-1f3fe758d3ee', 5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('6cb9ffba-62fd-5e7a-b549-aa2625256ce3', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', 'e2210542-8f8f-4f9c-b8bb-6a11234c92e0', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('4b60000e-c9c7-5c64-ae09-174ed7ee5162', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', 'b09ba824-fc37-45c6-acec-d57906319721', 2) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('7a52b864-7197-5d86-a17c-2d8ef1f7f968', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', 'c35b3b62-2ee0-4bdf-a75b-687223877134', 5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('b2dfff40-8481-5432-80d2-5185be32e2c0', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '87bbd831-53f8-4236-ab44-3a52ef996c90', 4) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('743fea21-0da1-5684-85e0-2ee2527326e8', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', 'a71ab4a4-241f-44a4-93ab-64ea3a8dfb08', 7) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('f100266d-0a97-5a92-a83a-edfd0d12861e', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '9b71a937-326b-4ff5-ad49-1b9b787a26db', 5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('06954081-613f-5bed-b787-c4d90bc51184', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '04eb904c-b692-4675-8b91-e254a48db34f', 6) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('7ba650b4-a8b1-5ba0-bddb-f560504f9f7f', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '034b0778-ef50-4540-8165-5a9be91ae060', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('0d681729-e9c3-5b5f-aba4-e8bf22a1b464', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', 'c7f4cf49-6b2a-42ab-9841-deb4ad3134f6', 7) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('8dfe28e9-3364-5950-ac86-87f58c2c917b', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '39cb2730-1b76-4ea4-a191-b2cd70f3f078', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('5515ece4-7022-5fde-9b6f-fae7f319f697', 'ade72ea9-da33-5fbd-8ba8-833e7ab97be2', '674588ed-1ac6-4cdc-af3d-50838c072572', 9) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessments (id, batch_course_id, name, type_id, max_mark) VALUES ('c09a270c-ae61-5527-b0e2-b27a164f8f7f', '34c63423-ac65-5b21-995d-e1d359f10ef6', 'Assignment3', 'a0000000-0000-0000-0000-000000000001', 10.0) ON CONFLICT DO NOTHING;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('0fc9a873-3718-50a0-b48b-9b133fb72762', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '69ab9a3a-592c-5b4d-a9f9-a28552a465e6', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('d85d8357-2f8c-532f-bf85-3c3b0083aafb', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '188e282a-2420-5cd2-8a2c-e9cd85cd637f', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('53546b61-0f21-533f-aa63-7bd443c08d98', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '300476ec-691f-5465-a78a-ad7e7c76934c', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('5e766914-0f58-5c9c-b532-9429fa0bf8f6', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '98c52f11-38fd-5cdc-93b2-41802258a694', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('b0a1aa7b-ff5b-53cf-a0e3-03207460dcdb', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '7a17a01e-7ee7-590f-b361-eb62c9523155', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('01050be5-68b7-5681-9e22-b1960b8c74d6', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', 'f1b66d29-3ca8-5951-9ca8-53ea552d131f', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('b4f6eb5d-6868-5f7a-9c0e-8053f8b954a1', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '15e31939-7eb6-52d0-a199-da25a99dbd8d', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('a0ef4944-2257-5ceb-a9d6-03944a1691f7', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '904c961b-046b-544b-85e7-76eb0c276fce', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('91957b0d-de03-5ee1-83a1-d292979d2fa2', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '2fe6bc85-c89b-5639-a7c9-7299cf4195bc', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('901f042e-8574-50d0-ad4c-500db044a5df', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', 'f8439884-cc37-5478-adf1-fd33a855cbd3', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('bc38b490-3b95-5716-8905-76428d23a688', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', 'e4016dfc-011b-5e63-a2cc-e6d6a9a1ceb1', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('6820c4ee-4695-53f1-988c-0645e75ab2a6', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', 'c594ef2b-d963-5c19-b0a2-5cfb73856208', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('95f642ea-9c9a-5780-b970-309e7fcfe934', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', 'eae39b0d-4b86-5935-b457-2cf5f600d7f0', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('6fefe6a1-43cb-529e-90e3-3e1dbf52f80d', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '77a747cc-1aa9-528b-a3c7-53212a8e9f1b', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('888bbcc9-4a43-5ca1-a90e-bb04e1a11b81', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '06701bb8-5d9d-544a-a1d3-3ca04341a050', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('12b30bb5-3483-5cb8-b2d5-4449a3e99ede', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '78644f54-e564-52ca-92a0-afa500e16e7b', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('2776d15a-cfb2-5c52-bcb7-fa0340def192', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '0dac3669-4c1d-561e-a941-b598f78be7c6', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('3d7aaf76-d839-5d60-82b7-bf43594e84e1', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', 'b262ea0e-2365-5504-9741-c99b9167db80', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('402850c3-aeca-51e9-b495-93cb54ddc30e', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '9994efe6-7ac5-5ca2-9c97-a1cb71edc504', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('e35d0733-23d7-506c-a39d-8f8e759ca3a6', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '5547f3f7-cb2f-554a-80a7-569ffaf1dbb8', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('6e38bd46-a395-5e16-91f5-62951f5cb5f1', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '87610186-c0a7-5652-981d-ed280f7525b7', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('265b3be5-ffa4-56d4-b4d9-d8fae7da5175', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', 'fcefb839-e590-5794-9a97-ccc7dadaab3e', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('722d9770-90c7-5ac2-8acc-863bbc66c752', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '4f57c447-f8af-5151-9b26-a4e51f889111', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('688985d1-6c2f-5823-ba58-b509e0786c3f', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '7936db53-248e-5c5e-88ae-b82315387ed7', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('0f4af4be-0cd4-5d9d-87b6-d576a10cb0a7', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', 'f3b0607e-95e0-5201-8d1d-ded6b18570ed', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('1363098b-000e-50a2-b977-c59ac707d8dc', 'c09a270c-ae61-5527-b0e2-b27a164f8f7f', '0f593f3d-fa71-52b0-8d50-845b4903b6e3', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessments (id, batch_course_id, name, type_id, max_mark) VALUES ('d563e3c7-c95e-5fa7-b541-1c925a804627', 'ccbc0cf1-86cd-5d4c-bd55-b46acc09f078', 'LD', 'c0000000-0000-0000-0000-000000000004', 10.0) ON CONFLICT DO NOTHING;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('2a77d251-85fe-5f89-95b0-5f227dd85998', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '9fcf6c02-62a2-5a35-9d21-f8ef3ab1b756', 8.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('4fe9e17e-a308-52d4-9a02-2a4c67575c80', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'be87c13d-81ed-5987-876e-e962139c3796', 8.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('d0507e1e-e1b4-56f1-b118-0f712b576858', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'b3e3c006-d00e-5a08-87b4-ac3f2a765b54', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('64f763c3-f8de-5c21-9b44-d07eba47c397', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'a0b286a4-7d2b-5305-b85d-6b000d66da67', 7.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('f2a6fa85-4d88-52ce-8205-cafdb1e7b028', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '60e21686-0af0-57af-a4db-abdc4aaaa403', 6.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('82a73c4e-a743-5b14-ace6-922a1e49fa17', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'd3f610fc-b72f-5f80-8030-ba6a6fc6f364', 8.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('d1cd3616-efae-5fea-93ed-f4522d7e467d', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '97a3ceac-5f08-539b-83bb-2d477b6bcc39', 9.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('21e5c060-2315-5222-9e67-3bf11261ac7c', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '870076c9-ba6d-5cbf-a1c8-f3f518774a95', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('f6f6e0ea-1ed8-5506-9a45-68826317c36c', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '51b16ce0-f2d8-5dae-8cac-576008d28ea9', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('8476b0be-e10a-5471-be7d-bed1cce5368b', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'c9df319b-6a09-5553-b05d-7f7af7a0163d', 8.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('6623cc42-efe9-5588-9d6c-a2c33ff9f948', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'd584da96-44b0-5ca5-bad3-735fd79ac139', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('c6800e6c-402e-5708-b6a2-291d3bea653c', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'afc72ebf-9477-50fe-9a36-10190ae3c837', 8.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('0b6068fa-793c-5223-8187-e7d65511ee8e', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '219a401d-b746-5a10-9c37-b84d54a8162d', 5.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('b597832f-0cd8-5342-bf93-867bf3fc44fc', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'eab3057e-8817-562b-aa4d-135120edf8a1', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('f93b24ef-3db8-5f51-9363-19734d0bc63d', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '65eae68e-b622-59e0-97f8-ae7a5cef2b00', 9.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ff58c764-1d81-5d81-a80e-dca619839121', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'f8030b0c-271f-52e9-b865-37c3cf4245df', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('9b18e8d0-6705-5157-9d31-750744ecaed6', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '09fb4d93-d013-5f91-879c-599400962cbb', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('97ef5e67-73ed-52cc-ad0a-a6106dc8f37f', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '438431fe-6131-5345-871b-e992457cdae9', 4.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('0d1f9c3f-64c0-5d02-9cad-49fdd34cb46a', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'f3f4dc30-ea50-5df5-838b-371903d80182', 6.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('c62b345c-2167-53d0-bac8-69a0a418e654', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'f7805548-5e94-5968-95f6-eadab260cc24', 5.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('46f472a6-32eb-5073-a969-5d3c957f2133', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '0c192fae-5043-5422-833a-fb3e74dd9826', 6.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('a574d075-929c-501f-bdb9-27f6b3951476', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '857acbe5-daca-5a2c-9958-525ca0a09d30', 7.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('569a4e77-41a2-51f4-9130-237c141343ce', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'a11f05f7-153a-5cb1-b210-2cfb6b0411d6', 1.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('02a25e0d-f79c-5707-ae8d-185bbc58d465', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '1cc042ad-f66a-5b6e-a6d1-8f9b7210c445', 7.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('0faa229f-227a-5d2f-8b08-3278fe8b65d6', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '51c2e598-fe7e-57bf-b364-82e4e79c7275', 6.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('3509e4e2-d0c2-57ca-a3e5-ec52b1cce6f3', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '8c603c6b-686e-5f3f-8571-d32616ce94cd', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('a5d4af7f-8e28-5937-9018-0e60679c7e19', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '5fd2a0f3-22ff-55b2-8f95-2af464f290f5', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('adca9506-96d3-5fa0-a2d7-56729792d321', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'a19de4fa-538f-5a3d-a8a6-8936f55bb16b', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('f11304b9-7efd-5d13-9623-2a2ea686fbd8', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'b5349ed4-2c20-59f7-b3f3-8d0356b3ba9d', 3.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ba70d357-1f9e-5faf-8825-cde2b4923b55', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '8cb0acb9-9db3-552e-bdf4-4c3582e51603', 8.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('5dcea260-955d-5fb4-a919-e16863d5c13e', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '64c68a90-e521-5b98-bca1-323fdf67be52', 8.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('2cd96fc6-11f7-5d6a-8680-0f16e2bd98c4', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '9773e005-4c39-52a5-833c-c74504422c0b', 5.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('601c19bc-d517-5985-98a6-eab4d32769dc', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'dfe09b65-330b-53ac-8dc3-c4cb9a89fc13', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('350273e0-0339-5fd0-8657-3c7dcaf3a4d3', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '14a0e5f7-a95d-5212-84be-1225bd2cfa89', 9.25) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('455fae78-0146-5960-9f45-a76efffea6a8', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '1af296c2-5d23-5fd6-a84a-158affc72f21', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('9d1154a7-8d49-5730-8912-36d02de166fd', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '9311d9ed-97b9-5f57-a43c-a912a4e91469', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('35cd16d6-e4de-5f3a-a2b9-2819b62fd28e', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'c94ed674-56ff-5ef3-8b50-f03658868142', 7.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('c4578cd8-b57b-56c9-b6b4-2981019ed4d3', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '1c4663fe-4591-5edb-b69a-f18e431ce538', 9.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('6d09bae6-f489-5330-b000-28d80d482579', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'be5ab52d-59fb-5532-97a2-2a563c687a38', 7.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('c53d0197-8530-5c9b-a62e-88ac21ae8668', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '825f3153-b9ac-5b9a-bb10-0cac4b9af9ba', 9.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('960330f5-99d0-546f-a6f4-a79dd54acf27', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '9fe4cac7-4610-59ea-8a8e-addd43029267', 0.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('8f310914-8e93-5f55-b486-470bebd34209', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'de59512a-dc59-5dd9-9ac3-ad5fffaad0b8', 4.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('da2c1d04-3cbe-5281-803a-89a170c08730', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'c229408c-9473-53a5-b671-af86be027fd0', 8.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('6976af1d-3c0b-5b86-ad00-1980592ca115', 'd563e3c7-c95e-5fa7-b541-1c925a804627', 'ece8757c-b4b2-57b1-8214-d9beba003fb6', 9.0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('dd4cff3b-3da9-5c3a-a3f2-e800d1780570', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '3932318a-ef2d-5d80-967d-4fe380537ecf', 9.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('1224371c-38ef-50de-b01c-04b824897ce3', 'd563e3c7-c95e-5fa7-b541-1c925a804627', '2dac025d-fa65-5cd3-9ad2-eb2ef7e92b66', 7.5) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessments (id, batch_course_id, name, type_id, max_mark) VALUES ('627e6c55-110a-595a-bf83-e23ec40ff481', '076c9335-d5d4-4d89-bb0f-e006c5c29881', 'Assignment7', 'a0000000-0000-0000-0000-000000000001', 10.0) ON CONFLICT DO NOTHING;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('efa80572-df45-5bdf-a613-59dec163d975', '627e6c55-110a-595a-bf83-e23ec40ff481', 'a71ab4a4-241f-44a4-93ab-64ea3a8dfb08', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('6ab28d9f-5b88-563f-a3e8-5a0be3847c4a', '627e6c55-110a-595a-bf83-e23ec40ff481', '87bbd831-53f8-4236-ab44-3a52ef996c90', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ef5fe179-ed9b-598a-b2b5-901566b47d0e', '627e6c55-110a-595a-bf83-e23ec40ff481', '47cac0dc-0da2-4db3-a722-1f18a5e6d224', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('79354cc7-18da-5b0d-a950-25cc80abf41e', '627e6c55-110a-595a-bf83-e23ec40ff481', '39cb2730-1b76-4ea4-a191-b2cd70f3f078', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ff290432-fd67-535d-a3ed-19124f5d2b7d', '627e6c55-110a-595a-bf83-e23ec40ff481', 'd574ba74-ea48-407c-97ad-f27da000d904', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('ae5df601-6f45-5b40-9ff4-53bb15be8a9d', '627e6c55-110a-595a-bf83-e23ec40ff481', 'ae4a3af9-836c-41c0-a8a3-ab02b6467d5f', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('dc60417b-60db-5774-bb37-db5c76ddaf87', '627e6c55-110a-595a-bf83-e23ec40ff481', '7623f5ad-dabf-4481-bf6d-83f4982e0c28', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('dc60417b-60db-5774-bb37-db5c76ddaf87', '627e6c55-110a-595a-bf83-e23ec40ff481', '7623f5ad-dabf-4481-bf6d-83f4982e0c28', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('a6e25f2a-357d-5365-a754-af8f8f2df26a', '627e6c55-110a-595a-bf83-e23ec40ff481', '165882d6-8257-49fc-8af9-deff2544fd82', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('bf78088f-5bad-5081-8116-10de855ea6be', '627e6c55-110a-595a-bf83-e23ec40ff481', '29350673-5d12-4fa2-a47f-b2bfaa122af1', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('8154da72-2836-5e9d-a389-a79d2bf25530', '627e6c55-110a-595a-bf83-e23ec40ff481', '82caaab6-08ad-442d-97c1-a9951678575f', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('0186d59b-02e1-55a2-a301-f4d8835b137c', '627e6c55-110a-595a-bf83-e23ec40ff481', 'd719c622-fb1b-4d3c-98cf-4fde8d3b2b00', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('3b4b7ee8-7927-5873-80eb-e0ae0eb75069', '627e6c55-110a-595a-bf83-e23ec40ff481', '034b0778-ef50-4540-8165-5a9be91ae060', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('fcd0f9bc-0920-556d-8e50-311dd34562b5', '627e6c55-110a-595a-bf83-e23ec40ff481', 'e158ae8c-0457-4ce8-ad69-b7004f452603', 0) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('16267aee-2f83-5641-b824-0b0a68920b31', '627e6c55-110a-595a-bf83-e23ec40ff481', '9b71a937-326b-4ff5-ad49-1b9b787a26db', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('5f62ca32-b512-5e57-a956-be16786a9832', '627e6c55-110a-595a-bf83-e23ec40ff481', '147fc0d9-0388-4f8d-a300-6656b4cb69c7', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
INSERT INTO public.uct_assessment_marks (id, assessment_id, student_id, mark) VALUES ('fd476b18-3c83-5854-8782-d9dc13c5adf4', '627e6c55-110a-595a-bf83-e23ec40ff481', '717e10ae-db6e-406f-9957-2e445f52a664', 10) ON CONFLICT (assessment_id, student_id) DO UPDATE SET mark = EXCLUDED.mark;
