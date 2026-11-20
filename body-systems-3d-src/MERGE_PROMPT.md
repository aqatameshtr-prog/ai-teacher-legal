# Prompt: merge the 3D textbook pages into the AI Teacher app

Paste everything below the line into a coding agent that has access to the app repository.

---

You are integrating an existing, finished 3D textbook viewer into the AI Teacher app. Do not rewrite the viewer from scratch; port and wire it in, keeping its behaviour.

## What already exists

- `body-systems-3d.html` (Unit 3, Fen Bilimleri 7, "Vücudumuzdaki Sistemler") and `fen7-unit1-3d.html` / `fen7-unit2-3d.html` in the `ai-teacher-legal` repo. Each is a single self-contained file: three.js, the scene code, the page engine and the unit text are inlined.
- The source, build script and data pipeline are in `body-systems-3d-src/` (`src/`, `tools/`, `build.py`, `README.md`). Read `body-systems-3d-src/README.md` first.
- The viewer's content (lessons, sections, vocabulary, exercises) was copied from the app's Supabase database, project `ai-teacher`, tables `subjects`, `units`, `lessons`, `exercises`, `question_sets`. Unit ids: `fen7-unite1`, `fen7-unite2`, `fen7-unite3`.
- Organ models for Unit 3 come from BodyParts3D (CC BY-SA 2.1 Japan). Keep the attribution in the UI and in `NOTICE-BodyParts3D.md`.

## Goal

1. Add a "3D book" screen to the app, reachable per unit (Unit 1, 2, 3 of Fen 7 at least). It must use the same lesson structure as the rest of the app.
2. Load unit content from the database at runtime (not from the embedded data) where the app already loads lessons. Keep the embedded build as an offline fallback only if the app already supports offline data.
3. Connect progress: stars, explored organs and answered questions should be saved to the existing progress storage (`progress`, `activity_log`) for the signed-in student, and respect the existing parent/student roles (`profiles.role` = `parent` | `student`, `parent_id`).
4. Keep the app's existing languages: Turkish, Arabic (right-to-left) and English. The viewer already has all three.
5. Do not break existing screens, routes, tests or the Supabase schema. Any schema change must be a reviewed migration.

## Constraints

- Do not commit secrets. The app's publishable key must come from configuration, never from source you invent.
- Do not invent medical or curriculum facts. The text comes from the database; if something is missing, leave it and report it.
- The viewer is heavy (about 3.5 MB for Unit 3 with models). Lazy-load it; do not add it to the main bundle.
- Keep the phone layout working (the viewer collapses its side card to a bottom sheet under 820 px).
- Test with a headless browser: each page of each unit, all three languages, the quiz and ordering exercises award stars, Arabic layout is right-to-left, no console errors.

## Known limitations you must report, not hide

- Open-ended questions are not auto-graded. Answers are stored locally on the device by the viewer; decide with the team whether they go to the database.
- Units 4 and 5 of Fen 7 are not in the database, so there is no content for them yet.
- Unit 1 and 2 scenes are illustrative drawings, not scientific models.
- Sounds are synthesised in the browser and need a user gesture before they play.

## Deliverables

- A branch with the merge, separate commits for: viewer port, data loading, progress, tests.
- A short report: what was merged, what was tested and how, what was not tested (real GPU, real devices), and every limitation above.
- Do not open a pull request unless the user asks for one.

## Stop rule

If the working context you have left drops to about 10% of its budget, stop, commit what works, and write the report of what is done and what remains.
