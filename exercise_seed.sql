-- ACL Recovery Companion — Exercise Library Seed Data
-- Source: Ashford & St Peter's NHS Foundation Trust, Wibbi Physio Portal
-- Client ID: 07321541
-- Phases: Phase 1 (30 Mar 2026), Phase 1.5 (29 Apr 2026), Phase 2 (21 May 2026)
--
-- days[] = day-of-week schedule: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
-- 'Daily'         → {0,1,2,3,4,5,6}
-- 'Every other day' → {1,3,5}  (Mon/Wed/Fri — adjust to match your actual routine)
-- image_url: upload images to Supabase Storage bucket 'exercise-images' then update these

-- ============================================================
-- PHASE 1  (started ~30 March 2026)
-- ============================================================

INSERT INTO exercise_library (id, name, category, phase, sets, reps, hold_secs, frequency, days, description, image_url, active, sort_order) VALUES

(1,
 'Passive knee extension',
 'Physio', 'Phase 1',
 3, NULL, '15-20 min',
 'Daily', '{0,1,2,3,4,5,6}',
 'Sit on a chair with your affected knee resting on another chair or stool at about hip height. Relax your leg completely and let the knee straighten under its own weight. Hold for 15–20 minutes.',
 'exercise-images/01_passive_knee_extension.jpg',
 true, 10),

(2,
 'Assisted knee flexion',
 'Physio', 'Phase 1',
 3, NULL, '20-30 sec',
 'Daily', '{0,1,2,3,4,5,6}',
 'Lying in bed, place a towel around the ball of your foot and hold it firmly with both hands. Bend your knee as far as you can, then pull on the towel to increase the bend. Hold 20–30 seconds. You can use your hands instead of a towel if you prefer.',
 'exercise-images/02_assisted_knee_flexion.jpg',
 true, 20),

(3,
 'Lateral weight shift',
 'Physio', 'Phase 1',
 3, 10, NULL,
 'Daily', '{0,1,2,3,4,5,6}',
 'Stand facing a countertop or stable surface for support. Shift your weight onto one leg and slightly lift the opposite leg out to the side. Return to centre with both feet on the floor. Shift to the other side and repeat. Alternate sides.',
 'exercise-images/03_lateral_weight_shift.jpg',
 true, 30),

(4,
 'Knee inner range quads',
 'Physio', 'Phase 1',
 3, 10, '5-10 sec',
 'Every other day', '{1,3,5}',
 'Lie on your back with a rolled towel or pillow under your knee. Push your knee down into the towel and lift your heel as high as you can without lifting the knee off the towel. Hold 5–10 seconds, then slowly lower. Repeat.',
 'exercise-images/04_knee_inner_range_quads.jpg',
 true, 40),

(5,
 'Knee extension (seated)',
 'Physio', 'Phase 1',
 3, 10, '5-10 sec',
 'Every other day', '{1,3,5}',
 'Sit on a chair with your back straight. Straighten your affected leg out in front of you and pull toes towards you. Hold 5–10 seconds. Slowly lower your leg back to the starting position.',
 'exercise-images/05_knee_extension.jpg',
 true, 50),

(6,
 'Straight leg raise',
 'Physio', 'Phase 1',
 3, 10, '2-3 sec',
 'Every other day', '{1,3,5}',
 'Lie on your back with one knee bent and your affected leg completely straight. Press your knee into the bed to activate the thigh muscles. Lift your straight leg about one foot off the surface. Hold 2–3 seconds, then lower slowly. Repeat.',
 'exercise-images/06_straight_leg_raise.jpg',
 true, 60),

(7,
 'Heel raises (seated)',
 'Physio', 'Phase 1',
 3, 10, NULL,
 'Every other day', '{1,3,5}',
 'Sit straight on a chair with feet flat on the floor. Push up onto your toes, lifting heels from the floor. Hold briefly, then lower back to the starting position. Repeat.',
 'exercise-images/07_heel_raises_seated.jpg',
 true, 70),

-- ============================================================
-- PHASE 1.5  (started ~29 April 2026)
-- ============================================================

(8,
 'Seated hamstrings stretch',
 'Physio', 'Phase 1.5',
 3, NULL, '20-30 sec',
 'Daily', '{0,1,2,3,4,5,6}',
 'Sit on a chair and extend your affected leg out straight in front of you, heel on the floor. Sit tall and gently lean forward from the hips until you feel a stretch in the back of your thigh. Hold 20–30 seconds.',
 'exercise-images/08_seated_hamstrings_stretch.jpg',
 true, 80),

(9,
 'Calf stretch',
 'Physio', 'Phase 1.5',
 3, NULL, '20-30 sec',
 'Daily', '{0,1,2,3,4,5,6}',
 'Stand facing a wall with hands on the wall for support. Step your affected leg back with heel flat on the floor. Keep your back knee straight and gently lean into the wall until you feel a stretch in the calf. Hold 20–30 seconds.',
 'exercise-images/09_calf_stretch.jpg',
 true, 90),

(10,
 'Knee bends',
 'Physio', 'Phase 1.5',
 3, 10, '2-3 sec',
 'Daily', '{0,1,2,3,4,5,6}',
 'Sit on the floor or a mat with legs straight. Slowly bend your affected knee, sliding your heel towards you as far as comfortable. Hold 2–3 seconds at the end of range. Slowly slide back to straight. Repeat.',
 'exercise-images/10_knee_bends.jpg',
 true, 100),

(11,
 'Seated knee extension with band',
 'Physio', 'Phase 1.5',
 3, 10, '3-5 sec',
 'Every other day', '{1,3,5}',
 'Sit on a chair with a resistance band looped around your ankle and anchored behind you. Straighten your affected leg against the band resistance. Hold 3–5 seconds at full extension. Slowly lower back to start.',
 'exercise-images/11_seated_knee_ext_band.jpg',
 true, 110),

(12,
 'Free squat',
 'Physio', 'Phase 1.5',
 3, 10, NULL,
 'Every other day', '{1,3,5}',
 'Stand with feet shoulder-width apart, toes slightly turned out. Lower yourself into a squat position, keeping your knees in line with your toes. Go as deep as comfortable. Rise back up slowly. Use a surface nearby for balance if needed.',
 'exercise-images/12_free_squat.jpg',
 true, 120),

(13,
 'Step up and down',
 'Physio', 'Phase 1.5',
 3, 10, NULL,
 'Every other day', '{1,3,5}',
 'Stand in front of a low step or stair. Step up with your affected leg first, then bring the other foot up. Step down with the unaffected leg first. Focus on control — do not let the knee drop inward. Use a wall for balance.',
 'exercise-images/13_step_up_down.jpg',
 true, 130),

(14,
 'Heel raise (standing)',
 'Physio', 'Phase 1.5',
 3, 10, NULL,
 'Every other day', '{1,3,5}',
 'Stand near a wall or countertop for balance. Rise slowly onto both toes. Hold briefly at the top. Lower your heels back to the floor with control. Repeat.',
 'exercise-images/14_heel_raise_standing.jpg',
 true, 140),

-- ============================================================
-- PHASE 2  (started ~21 May 2026) — CURRENT PROGRAMME
-- ============================================================

(15,
 'Seated hamstrings stretch',
 'Physio', 'Phase 2',
 3, NULL, '20-30 sec',
 'Daily', '{0,1,2,3,4,5,6}',
 'Sit on a chair and extend your affected leg out straight in front of you, heel on the floor. Sit tall and gently lean forward from the hips until you feel a stretch behind your thigh. Hold 20–30 seconds. Repeat 3 times.',
 'exercise-images/15_seated_hamstrings_stretch_p2.jpg',
 true, 150),

(16,
 'Calf stretch',
 'Physio', 'Phase 2',
 3, NULL, '20-30 sec',
 'Daily', '{0,1,2,3,4,5,6}',
 'Stand facing a wall. Step your affected leg back, heel flat. Keep the back knee straight and lean gently into the wall until you feel the calf stretch. Hold 20–30 seconds. Repeat 3 times.',
 'exercise-images/16_calf_stretch_p2.jpg',
 true, 160),

(17,
 'Single leg stand',
 'Physio', 'Phase 2',
 3, NULL, '30-60 sec',
 'Daily', '{0,1,2,3,4,5,6}',
 'Stand near a chair for safety. Lift your unaffected leg off the ground and balance on your affected leg. Hold for 30 seconds building to 1 minute. Keep your knee slightly soft — not locked. Focus on a fixed point to help balance.',
 'exercise-images/17_single_leg_stand.jpg',
 true, 170),

(18,
 'Seated knee extension with red band',
 'Physio', 'Phase 2',
 3, 10, '3-5 sec',
 'Every other day', '{1,3,5}',
 'Sit on a chair with the red resistance band looped around your ankle and anchored behind. Straighten your affected leg against the band. Hold 3–5 seconds at full extension with quad tight. Slowly lower back to start. The red band is heavier than the previous band.',
 'exercise-images/18_seated_knee_ext_red_band.jpg',
 true, 180),

(19,
 'Terminal knee extension with red band',
 'Physio', 'Phase 2',
 3, 10, '3-5 sec',
 'Every other day', '{1,3,5}',
 'Stand with the red band behind your knee, anchored in front of you. Start with knee slightly bent. Straighten the knee fully against the band resistance, squeezing the quad hard. Hold 3–5 seconds. Slowly return to slight bend. Focus on the last 30° of extension.',
 'exercise-images/19_terminal_knee_ext_red_band.jpg',
 true, 190),

(20,
 'Single leg sit to stand',
 'Physio', 'Phase 2',
 3, 10, NULL,
 'Every other day', '{1,3,5}',
 'Sit on a chair of normal height. Cross your unaffected leg slightly behind. Push up to standing using your affected leg only. Control the lowering phase slowly back to sitting. Use your arms on the chair for assistance if needed initially.',
 'exercise-images/20_single_leg_sit_to_stand.jpg',
 true, 200),

(21,
 'Lateral step up',
 'Physio', 'Phase 2',
 3, 10, NULL,
 'Every other day', '{1,3,5}',
 'Stand sideways to a low step. Step up sideways with your affected leg leading. Bring the other foot up. Step back down sideways. Keep your knee tracking over your toes throughout. Use a wall for balance if needed.',
 'exercise-images/21_lateral_step_up.jpg',
 true, 210),

(22,
 'Heel raise (standing)',
 'Physio', 'Phase 2',
 3, 10, NULL,
 'Every other day', '{1,3,5}',
 'Stand near a wall for balance. Rise slowly onto both toes. Pause at the top. Lower heels back to the floor with control. Progress to single-leg when comfortable.',
 'exercise-images/22_heel_raise_standing.jpg',
 true, 220),

(23,
 'Glute bridge with feet offset',
 'Physio', 'Phase 2',
 3, 10, NULL,
 'Every other day', '{1,3,5}',
 'Lie on your back with knees bent and feet flat. Place your affected foot slightly further from your body than the other. Push through both feet to lift your hips off the floor until your body forms a straight line from knees to shoulders. Hold briefly. Lower slowly.',
 'exercise-images/23_glute_bridge_feet_offset.jpg',
 true, 230);

-- ============================================================
-- RECOMMENDED DAILY SCHEDULE (Phase 2 — current)
-- ============================================================
-- EVERY DAY:
--   id 15: Seated hamstrings stretch (3 × 20-30s hold)
--   id 16: Calf stretch (3 × 20-30s hold)
--   id 17: Single leg stand (3 × 30-60s hold)
--
-- EVERY OTHER DAY (Mon / Wed / Fri):
--   id 18: Seated knee ext with red band (3 × 10, hold 3-5s)
--   id 19: Terminal knee ext with red band (3 × 10, hold 3-5s)
--   id 20: Single leg sit to stand (3 × 10)
--   id 21: Lateral step up (3 × 10)
--   id 22: Heel raise standing (3 × 10)
--   id 23: Glute bridge with feet offset (3 × 10)
--
-- PLUS DAILY HABITS (not in exercise table):
--   Cycling: daily, log duration + resistance in daily_habits table
--   Compex AM: lunchtime, Active Stim programme
--   Compex PM: pre-sleep, Recovery programme
-- ============================================================
