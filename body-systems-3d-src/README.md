# 3D textbook page for Fen Bilimleri 7 · Unit 3 (source)

`../body-systems-3d.html` is a single self-contained file (open it in a browser, no server needed).
This folder holds what is needed to rebuild or extend it.

## Layout
- `src/` – page code: `shell.html` (markup + CSS), `content.js` (UI strings, organ texts, prediction questions),
  `core.js` (scene, book, pagination, reader, card, navigation), `sound.js` (WebAudio sounds: heartbeat, breathing, digestion, kidneys), `geo.js` (sculpting helpers + model loader),
  `views.js` (the four body systems and their close-ups).
- `tools/` – data pipeline:
  - `pack.py`, `centerline.py`, `anchors.py`, `stlio.py`, `ids.txt` – download the BodyParts3D STL files listed in
    `ids.txt` (from the `BodyParts3D` mirror on GitHub, folder `assets/BodyParts3D_data/stl/`, plus its `FMA.csv`),
    simplify them, compute centre-lines and landmarks and write `data/bp3d_data.js`.
  - `build_u3.py` – turns an export of the unit's lessons and exercises (the `lessons` and `exercises` tables for
    `fen7-unite3`, saved as `lessons_raw.json` and `ex_raw.json`) into `data/unit3_data.js`.
  - `prep_three.py` – creates `vendor/` (three.js 0.149, OrbitControls, RoomEnvironment as plain scripts).
- `build.py` – assembles everything into the final HTML.

## Rebuild
```
pip install numpy trimesh fast-simplification scipy scikit-image
# 1. vendor files:  (in tools/)  npm pack three@0.149.0 && tar xzf three-0.149.0.tgz && python3 prep_three.py
# 2. model data:    download the STLs, then run pack.py (needs cl.json/anchors.json from centerline.py/anchors.py)
# 3. unit text:     python3 build_u3.py   (write the result to data/unit3_data.js)
# 4. page:          python3 build.py ../body-systems-3d.html
```
The scripts were written to run from the folder that holds the downloaded `stl_raw/` files; adjust paths as needed.

## Licences
- 3D organ models: **BodyParts3D**, (c) The Database Center for Life Science, CC BY-SA 2.1 Japan – see
  `../NOTICE-BodyParts3D.md`. The packed model data embedded in the page must stay under the same licence.
- three.js: MIT. The page code and the unit text belong to the project.
