# Methodology log

## 2026-11-07 — Developer-only model maturity

- Supersedes the earlier maturity classification: Sisyphus and Panopticon are level 1; the other twelve models are level 0 whitebox geometry. Maturity is model refinement, not the presence of a slider.
- Removed development badges from the visitor catalog and concept heading, and development-status prefixes from public reflections. Moved the bilingual inventory and definitions into the footer's closed Developer → Model maturity secondary menu.
- Preserved authored scenes, existing Cave/Ship/Veil interactions, routing, and English-default/Chinese-option behavior. Added independent interaction metadata so reclassification does not disable controls.
- Added a community asset candidate register with per-asset source/license evidence and explicit non-import status. Innerscene and Poly Haven file downloads were blocked by this environment's network policy; no remote asset was loaded, no new dependency was installed, and no substituted asset is claimed.
- Verification: all 7 Node tests passed, including bilingual visitor/developer separation, exact 2/12 maturity counts, scene lifecycle and preserved controls. Production Vite build passed (existing large-bundle advisory remains). Browser visual/interaction checks could not run: the local preview process did not remain reachable, and Chrome reported connection refused/timed out. No screenshot, narrow-layout, keyboard or real-device pass is claimed. This change is local only; no commit, push or deployment was performed.


## Catalog and level 1 expansion — local, unpublished

- Scope: world philosophy across traditions and eras, with related mathematical thought experiments explicitly distinguished.
- Divide work into catalog/whitebox and level 1. Whiteboxes use schematic geometry and are clearly labeled; level 1 requires a recognizable scene, concept-specific control, bilingual question and context, and a reading reference. Neither stage settles contested interpretation.
- Added bilingual catalog for 14 concepts; Cave, Ship and Veil join Sisyphus and Panopticon at level 1. Language preference persists locally, with English as the default.
- Verification: local unit and lifecycle tests, build and browser checks; remote CI and deployment remain pending until publication is authorized.

### Compact interaction layout

- At phone widths, move the existing labeled concept slider below the canvas inside the scene panel, reserving its own space rather than covering the model. On wider screens it returns to the article; the same control and current value are retained across resizing.
- Local checks: desktop and 390×844 / 320×700 browser viewports; cave, ship and veil controls and English/Chinese labels. Browser input was checked through accessible controls; physical touch hardware remains unverified. No deployment.

## 0.1.0 — Initial prototype

- Motivation: explore philosophical ideas through interactive spatial metaphors.
- Method: separate concept metadata from scene builders and a shared renderer; release scene resources on switching. Geometry is original and schematic; interpretations are explicitly attributed.
- Lineage: adapts OpenCampus's early playable, project-content/shared-runtime separation and verification principles. No geographic claims or campus assets are imported.
- Verification: see task handoff for actual checks; do not infer deployment or browser coverage from this document.
- Publication: local prototype; no public site.

## 2026-11-16 - Scene resource ownership refinement

- Preserved the existing maturity classification and interactive behavior. Shared scene geometries and materials are now disposed once per resource, rather than once per mesh. The Ship's individual plank materials retain their identity while their colors change, so either slider extreme remains attached and can be released on scene switch.
- Added a lifecycle regression test for every concept that tracks each initially attached geometry and material through slider updates and checks exactly one disposal event. This is an ownership test, not a GPU memory benchmark.
- Verification: 8 Node tests and the production build passed. Chrome local preview rendered the Ship at the default desktop viewport and 390 x 844; the plank slider changed the visible colors at its maximum and remained positioned below the canvas at narrow width. Physical touch, all other concepts in the browser, and long-running GPU memory profiling were not tested. The existing build-size warning remains. At that checkpoint, no community assets had been imported, and no deployment, push or commit was performed.


## 2026-11-16 - Keyboard and responsive accessibility

- Kept catalog links in place when changing concepts so the activated link retains focus. Added focusable, visibly outlined scene controls: arrow keys orbit, plus/minus zoom, with camera bounds matching the existing controls. Ctrl, Meta and Alt combinations remain available to the browser; Tab is not intercepted. English and Chinese instructions include a narrow-screen cue to scroll outside the touch-rotation area.
- Corrected the bilingual Sisyphus question to describe endless restarting rather than asserting the summit is never reached. Camus describes the stone falling after reaching the top: https://pages.nyu.edu/keefer/hell/camus.html. This preserves the question rather than asserting a philosophical answer.
- A read-only Astra review identified both focus loss and pointer-only orbit, then caught the modifier-shortcut regression in the first fix; a final follow-up found no further blocker. Added tests for focus-preserving catalog updates, bounded keyboard movement and modifier shortcuts.
- Verification: 11 Node tests and production build passed. In Chrome, all 14 scenes were visually inspected at desktop size; the Ship slider and scene-switching were checked, and arrow-key orbit visibly changed the Infinite Monkey scene while focus remained on the scene. Activated catalog links retained focus. At 320 x 700 Chinese and 760 x 844 English, Sisyphus rendered with the control beneath the canvas; its slider was set to maximum, and the responsive hint was visible. The prior 390 x 844 Ship check also passed. No screen reader, physical touch device, sustained GPU memory test, or complete cross-browser pass was performed. Canvas touch scrolling remains unavailable; the mobile cue directs page scrolling outside the scene.
- Publisher pages reconfirmed Boulder 01 and Quaternius Universal Base Characters as CC0. The Boulder page listed 124K triangles, so neither suitability nor the contents of an actual downloaded LOD is assumed. At that checkpoint no asset had been downloaded or imported; this was not a maturity upgrade. No new dependency, commit, push or deployment. The existing bundle-size advisory remains.


## 2026-11-16 - Sisyphus boulder asset

- Integrated a locally bundled untextured derivative of Poly Haven Moon Rock 02, credited to Greg Zaal and Rico Cilliers (photography) and Jenelle van Heerden (processing), under CC0. The [asset register](public/ASSET_SOURCES.md) records the source, license, transformation, measured size and hash. The procedural stone remains the fallback; a model import does not alter maturity.
- Per-scene delivery and resource guards ignore duplicate roots and avoid releasing already handled shared geometry or materials; adoption avoids disposing a geometry already attached to the target. Tests cover duplicate delivery before and after scene disposal. See the final handoff for completed validation and its limits.
- Verification: 15 Node tests and production build passed; Vite still reports a main chunk over 500 kB. Astra's read-only review confirmed the duplicate-root fix and exposed shared-resource deliveries; the resource-level fix was reviewed again with no current-path blocker. Tests cover duplicate roots, shared resources, multi-mesh rejection and late callbacks.
- Production preview under `/open-philosophy/` was checked in headless Chrome with software rendering at 1280 x 800, 390 x 844 and 320 x 700. The bundled GLB returned 200, Chinese selection and repeated scene switching worked, and no page errors were observed. An intercepted GLB 404 left the procedural fallback visibly rendered. The two narrow screenshots showed the scene and slider together without page-wide horizontal overflow. This is not physical touch, screen-reader, cross-browser, long-running GPU memory, or mobile GPU performance testing. No commit, push or deployment.


## 2026-11-16 - First refined models for all concepts

- At the user's new request, replaced nine static whiteboxes with concept-specific interpretive dioramas and sliders, and added spatial details to Cave, Ship and Veil. All fourteen are now classified as level 1 in the developer menu; these are initial stylized models rather than historical reconstructions or definitive philosophical answers. No new community asset was imported.
- Added bilingual control labels. The trolley and Newcomb controls represent schematic alternatives; the slider does not resolve either dilemma. Scene resources continue to be disposed on route changes.
- Validation: all 15 Node tests and production build passed; tests cover all builders, changes at slider extremes and resource disposal. Chrome production preview was visually checked for Trolley on desktop, Butterfly Dream on desktop and 390 x 844 Chinese, and Eternal Recurrence on desktop and 390 x 844 Chinese. The recurrence ring was raised after an initial visual check revealed it below the stage. Other new scenes have not yet received individual visual review. Physical touch, screen reader, cross-browser, mobile GPU and sustained-memory checks remain outstanding. Vite continues to warn that the main chunk exceeds 500 kB. No commit, push or deployment.


## 2026-11-16 - L2 reference and trolley study

- The upstream maturity reference at https://github.com/williamQ96/open-geospatial-to-3d-reconstruction-pipeline/commit/3f33f757dd4eae251cf4bdbda78edc2deade721f designates Knight Library's exterior as an L2 example, explicitly does not define a general L2 rubric, and calls for scope, evidence, uncertainty and human review. A philosophical thought experiment is not a survey of that building. No scene has been promoted to L2 on the basis of this comparison.
- Reworked the Trolley diorama to show a common approach splitting into two branches, with selected-branch color feedback and the trolley moving toward the chosen route. This is an illustrative diagram, not a claim about a real railway. Desktop Chrome production preview checked the two slider endpoints and branch highlighting. Node tests (15) and production build passed; Vite retains its >500 kB warning. Other concepts were not reviewed or refined in this pass.
- `src/scene-details.js` is an unintegrated exploratory draft from the interrupted earlier pass; it has not been visually or philosophically reviewed and does not affect the running application.


## 2026-11-16 - L2 candidates for user review

- Following the user's choice to use Knight's completion as a comparison and review each scene, integrated the previously unconnected scene-specific detail pass across all fourteen concepts. Replaced the Ship's rectangular hull with a curved hull and made its details follow the hull; revised the Butterfly silhouette and reduced clutter around Sisyphus. These remain stylized interpretations and their L1 metadata is unchanged pending individual user review. [Review scope and caveats](MODEL_REVIEW.md).
- All 15 Node tests and production build passed; the main chunk still exceeds 500 kB. Chrome desktop visual checks covered most changed concepts; Chinese 390 x 844 Veil and slider were checked. This is not full browser, touch, screen reader, GPU or sustained-memory validation. The prior note that scene-details.js was unintegrated describes its earlier state. No new third-party assets, commit, push or deployment.


## 2026-11-16 - Reference-inspired modeling in progress

- Began refining all fourteen scenes against the generated concept renders under `review/concept-renders-2026-11-16/`. Added scene-specific original low-poly architectural and landscape elements, refined reusable figures, a winding Sisyphus path, Ship rigging and hull bands, and curved Vat wiring. The generated images are aspirational illustrations; the current real-time models remain materially simpler and have not been approved as L2. Existing L1 labels are retained.
- Validation so far: 15 Node tests and production build passed, including scene lifecycle and slider state changes; `git diff --check` passed. Checked desktop Sisyphus, Panopticon, Ship and Vat during iteration, and the Trolley slider in Chinese 390 x 844. Not a full final visual pass of every scene, physical touch, screen reader, cross-browser, mobile GPU or sustained-memory validation. Vite's >500 kB warning remains. Additional modeling and per-scene review remain necessary. No commit, push or deployment.

## Interactive studies, 2026-11-16
Five illustrative event-driven studies add separate native-button controls while preserving the existing update(time, value)/dispose scene contract. The controls use local state only and are torn down on route changes; they are demonstrations rather than experimental replications. Fixed-interval feeding is response-independent; the induction example distinguishes Russell's chicken from exhibit analogies; FR10 and the finite VR10 example share the same mean requirement; brain stimulation is neither selective dopamine stimulation nor a direct measure of pleasure; twin heritability is population- and context-specific. Existing scene maturity assignments are unchanged. New geometric studies are level 0.

A sixth study models the user's wall-and-blueprint analogy with a describer, builder, possible mismatch and revision. Reddy's 1979 toolmakers paradigm is a closely related source, not proof of the origin of the user's wording and not a universal theory of language.

## Conceptual metaphor studies
Three Level 0 event-driven studies compare argument frames, time frames, and emotion orientation. They distinguish Lakoff and Johnson's examples from the exhibition's original comparisons; contrast highlights with what may be hidden; and do not claim universal psychological effects or linguistic determinism. The hypothetical argument-as-dance culture is not presented as ethnography. The common Level 0 3D geometry is illustrative, not an evidence visualization.

## Reviewer revisions
Added state-linked, accessible schematic diagrams to all nine Level 0 interactive studies. Refined the language receiver's varying background and non-guaranteed reconstruction; added explicitly synthetic competition conditions and multiple illustrative twin/environment pairs; replaced the finite repeating VR sequence with independent random 1–19 thresholds of expected 10 and injectable test randomness. Breakpoint and language remounts restore the focused action. These are schematic UI illustrations, not high-fidelity 3D models, experimental outcomes, or predictions.

The orientational study compares complementary up/down directions, not rival frames or an intervention on mood; its Chinese examples are translations of English illustrations, not cross-cultural evidence. The time-as-money discussion is situated in contemporary English and modern Western industrial societies.

Santos and Routtenberg (1972), as reported in the publisher's indexed abstract, compared restricted feeding and a modified separate-session training condition; the latter did not meet the study's self-starvation criteria. Full text was not accessed. The exhibit's budget choices remain a synthetic illustration, not a reconstruction of those data.

## Level 0 scene and accessibility revision
All nine new studies now have distinct schematic Three.js objects driven by the same state as their DOM controls. Scene objects remain Level 0 and are not replicas. A synthetic twin comparison switches identical/fraternal groups, home environments and three invented populations; those counts are not data and cannot apportion an individual. Responsive re-rendering preserves focus on source links as well as buttons.


## 2026-11-16 - Interactive study modeling in progress

- Started reference-inspired geometry for the nine newer interactive studies: scene-specific furniture, enclosures, vegetation and architectural details, plus stylized people and bird details. Added a narrow pass-through slot in the language wall; the wall continues to separate the two participants. Existing state-driven controls and `setInteraction`/`update`/`dispose` contracts remain in place. Illustrations are not historical reconstructions or evidence of experimental outcomes.
- This is a partial refinement, not an L2 completion claim: the nine studies remain level 0 and all 23 scenes require further modeling and individual visual review against their concept images. No grades were changed. Existing fourteen-scene work from the previous entry remains unfinished.
- Verification: 31 Node tests, production build and `git diff --check` passed. Desktop Chrome checked the language-wall and pigeon scenes; language-wall build action and Chinese 390 x 844 layout were checked. This does not verify every scene visually, screen-reader or physical-touch behavior, cross-browser behavior, mobile GPU performance or long-duration memory. The Vite >500 kB warning remains. No commit, push or deployment.


## 2026-11-16 - Study model and state continuity

- Refined the pigeon and chicken as articulated visual groups so the pigeon's action moves its head, wings and body together; added a back wall and feeder to the illustrative pigeon setting. Unified study bases with the circular scene style. Replaced the time-as-money disc with an hourglass and expanded its desk/garden details; those details now follow the selected frame. Replaced abstract argument/emotion markers with figures.
- Fixed the language-wall receiver model so the roof follows the house across backgrounds and remains seated when the roof changes shape. Twin-type visual differences now change clothing instead of skin color. These are schematic illustrations and remain unapproved for L2; all 23 still need individual review and further work.
- Verification: 33 Node tests and the production build passed, including added checks for time-frame detail visibility/disposal and roof/house continuity. Chrome checked desktop time-frame switching and pigeon action/timing plus a 390 x 844 Chinese pigeon layout. The later adjustment flattening the pigeon clock was covered by tests/build but not rechecked visually. The >500 kB Vite warning remains; no full 23-scene browser, physical touch, screen-reader, cross-browser, mobile GPU or long-running memory validation. No commit, push or deployment.

## 2026-11-16 - Sisyphus terrain and contact refinement

- Added reusable rocky terrain with a conservative clearance corridor around the motion path, corrected the path surface winding, and aligned the rotating boulder to a local slope tangent using the active mesh's vertices. Both hands now follow vertices on the current boulder geometry, including after the optional asset loads. This is a visual approximation, not a physics simulation; the mountain, path and figure remain simplified and are not approved as L2.
- Verification: 35 Node tests and the production build passed. New tests check the sampled route clearance, upward-facing path normals, shared-geometry disposal, slope-tangent support and hand-to-mesh contact. Desktop Chrome showed the hands contacting the visible boulder; the boulder's grounding remains visually approximate. This was not a complete mobile, cross-browser, physical-touch, accessibility, GPU-performance or long-duration validation. Vite's chunk-size warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Ship model refinement in progress

- Reworked the Ship of Theseus with three visible courses of curved side boards, a gently curved cloth sail with colored borders, and a repositioned yard and rigging. The slider now changes side-board groups as well as deck boards; color represents replacement, not an animation of individual boards being removed or a complete inventory of ship material. The model remains an imagined, simplified vessel, not a historically verified reconstruction or an approved L2 model.
- Verification: 36 Node tests and the production build passed. A new test covers side-board colors at zero, half, full and reversed settings and confirms the sail has curvature; the existing lifecycle test covers resource disposal. Desktop Chrome confirmed the new sail and visible side courses; the final change distributing replacement colors was tested but not visually rechecked. No complete per-scene, mobile, cross-browser or device performance review has been performed; the Vite >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Cave model refinement in progress

- Replaced rectangular shadow markers with three deliberately schematic silhouettes, shaped the wall's upper edge and added a faceted rock overhang, layered flame colors, a smaller daylight marker and exit steps. The moving figure still turns and moves toward the right as the slider changes; shadows no longer shrink with that figure because they represent objects, not the prisoner. The silhouettes are drawn on the wall, not physically projected by a modeled fire. The scene remains a stylized cutaway and is not an approved L2 model.
- Verification: 37 Node tests and production build passed. A new test checks the moving figure and spatial separation of steps and flame bounds; shared resource disposal remains covered by the scene lifecycle test. Desktop Chrome confirmed the silhouettes and the corrected fire/step separation at the default slider value. Full interaction and visual checks at all angles and on mobile are outstanding. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Panopticon model refinement in progress

- Corrected the rotation of the twenty radial cells so their barred fronts face the central tower; the previous rotations caused intersecting-looking partitions. Built exterior window openings, interior beds and barred doors, and a framed observation room on a stone base. Removed redundant perimeter decorations that no longer matched the rebuilt layout. The rotating translucent beam remains a schematic visualization of observation, not a claim that the historical design used a searchlight or that an observer is present. This single-storey cutaway is not an approved L2 model or a reconstruction of a particular building.
- Verification: 38 Node tests and production build passed. A new test checks that all cell fronts point toward the tower and that beam settings change opacity and rotation; scene lifecycle tests cover resource disposal. Desktop Chrome showed the corrected layout and exterior windows at the default setting. Mobile, physical touch, screen-reader, cross-browser and sustained GPU/memory validation remain outstanding. The Vite >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Veil model refinement in progress

- Rebuilt the six podiums and attached each person at the top of its own cap, correcting figures previously intersecting the taller platforms. Replaced the translating translucent cylinder with a pleated curtain that gathers toward the fixed tops of its posts; added concentric floor inlays and removed overlapping supplemental podium pieces. Corrected the English description from lowering to lifting the veil. Platform height is a schematic visual metaphor, not a ranking of people or an exhaustive account of Rawls's argument. The scene remains simplified and is not an approved L2 model.
- Verification: 39 Node tests and production build passed. A new test checks podium alignment and that the curtain gathers while its top remains fixed; lifecycle coverage checks disposal. Desktop Chrome showed the corrected figures and gathered curtain at the default slider setting. Mobile, all viewing angles, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. The Vite >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Trolley model refinement in progress

- Replaced the angular track sections with smooth illustrative branch curves and made the tram's center and orientation follow the same curve. Added a roof, windows, headlight and undercarriage, a ground surface, and a pivoting switch lever. Removed unrelated decorative posts. The tram animation ends before reaching the figures and resets; it is not a physical railway or outcome simulation. Moved the lever after a sampled overlap check revealed a collision with the tram. The scene is still stylized and not an approved L2 model.
- Verification: 40 Node tests and production build passed. New tests check selected-branch colors, path position and tangent, and sampled tram/lever bounding-box clearance for both choices; lifecycle tests cover disposal. Desktop Chrome showed the curved tracks and tram before the final lever repositioning; that repositioning was tested but not visually rechecked. Mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Brain in a vat refinement in progress

- Replaced the ring of spheres with two stylized lobes and raised surface folds, rebuilt the open-sided translucent vessel, lid, supports, cable connectors and console, and added a bookshelf. Signal markers now travel on the same illustrative curves as the external cables; a console trace responds to the signal slider. These are visual metaphors, not anatomical, neurological or experimental claims. This model remains simplified and is not an approved L2 model.
- Verification: 41 Node tests and production build passed. A new test covers hidden/visible signals, signal movement and waveform response; lifecycle tests cover resource disposal. Desktop Chrome showed the updated vessel, brain, cables, shelf and waveform at the default slider value. All angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Free will scene refinement in progress

- Rebuilt the fork as two curved paved routes with edging, a shared approach, a planted ground surface and stone arches. The figure uses the same curve as the visible branch and rotates with its direction; corrected a shadow artifact on the paving after desktop review. The two paths are an exploration metaphor and do not label free will and determinism as exhaustive opposing theories. The scene remains stylized and is not an approved L2 model.
- Verification: 42 Node tests and production build passed. A new test checks the figure against sampled centerlines across both branches; lifecycle tests cover disposal. Desktop Chrome showed the revised layout and corrected paving at the default slider value. All angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Chinese room refinement in progress

- Rebuilt the side walls with real card apertures and trays, replaced decorative blocks with a desk, open rulebook and bookshelf, and staged the input and output card movement in sequence. Cards use simple geometric marks as symbolic placeholders, not Chinese text or an implementation of language understanding. The tray length was adjusted to support cards throughout their travel. The room remains a simplified interpretation and is not an approved L2 model.
- Verification: 43 Node tests and production build passed. New sampled checks cover card clearance through the openings, tray support and the output sequence; lifecycle tests cover disposal. Desktop Chrome showed the openings and rulebook before the final tray extension; that extension was tested but not visually rechecked. Full slider interaction, all angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Socratic dialogue refinement in progress

- Rebuilt the dialogue around two stylized seated participants, chairs and a round table with an open book and cups. Added an arch and bookcase, removed unrelated scattered props, and linked changing speech emphasis to small arm gestures. The figures and marks are invented visual aids, not portraits or actual quoted dialogue; the scene remains simplified and is not an approved L2 model.
- Verification: 44 Node tests and production build passed. A new test checks both ends and reversal of dialogue emphasis and gestures; lifecycle tests cover disposal. Desktop Chrome showed the revised arrangement at the default slider setting. All angles, full interactive browser checks, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Newcomb scene refinement in progress

- Rebuilt the opaque closed box, framed transparent box and visible coins, with separate illuminated selection outlines. The opaque box is always selected; the second outline appears for the two-box option. The closed box remains static and its contents are not modeled or revealed. Added a simple architectural backdrop. The selection is illustrative and does not simulate the predictor, payoff or endorse a decision theory; the scene remains simplified and is not an approved L2 model.
- Verification: 45 Node tests and production build passed. A new test checks one/two-box selection, reversal and stationary opaque box parts; lifecycle tests cover disposal. Desktop Chrome showed the revised boxes and two highlighted outlines at the default slider value. Full slider browser interaction, all angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Eternal recurrence scene refinement in progress

- Replaced the vertical ring and airborne figure with a ground-level circular paved walk, a central tree, low curb, rocks and an arch. The traveler follows the walk while remaining upright and facing the tangent; the slider endpoints return to the same position and direction. The loop is an interpretive visual metaphor and does not assert a particular cosmological interpretation. The model remains stylized and is not an approved L2 model.
- Verification: 46 Node tests and production build passed. A new test samples the full loop and checks path radius, orientation and endpoint continuity; lifecycle tests cover disposal. Desktop Chrome showed the revised scene at the default slider value. Full slider browser interaction, all angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Butterfly dream refinement in progress

- Replaced the rotated standing figure with a stylized reclining arrangement on a mat, and added a framed garden, tree, pond, rocks and flowers. Rebuilt the butterfly with symmetric wings that rotate around the body; the slider changes wing opening and flight height. This is an imagined setting, not a historical depiction or a claim about the story's sole interpretation. The model remains simplified and is not an approved L2 model.
- Verification: 47 Node tests and production build passed. A new test checks wing symmetry, slider response and approximate figure-to-mat contact; lifecycle tests cover disposal. Desktop Chrome showed the revised scene at the default slider value before a small final adjustment to the reclining figure, which was tested but not visually rechecked. Full slider browser interaction, all angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Infinite monkey scene refinement in progress

- Rebuilt the seated monkey with limbs and tail, a multi-row typewriter, roller and paper, plus a desk and simple setting. A hand follows each highlighted key and the slider changes the length of schematic marks on the page. The repeating key animation is deterministic and does not simulate independent random typing or establish a finite-time result. The model remains simplified and is not an approved L2 model.
- During desktop review the canvas initially rendered empty. A possible negative initial animation timestamp could produce a negative key index; the index is now normalized and the scene subsequently rendered in Chrome. Verification: 48 Node tests and production build passed, including a negative-time check, hand/key alignment and sequence-mark response; lifecycle tests cover disposal. Desktop Chrome showed the revised scene at the default slider value. Full slider browser interaction, all angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Language across a wall refinement in progress

- Added an example house on the describer's side, door and window details on both example and reconstructed houses, raised display pads, and a description card whose added roof mark appears for the specific description. Moved the example model toward the front edge of its side after the wall obscured it in the default view. The reconstructed house and roof still follow the existing build and background state; the example is a schematic illustration, not a replication of Reddy's paradigm or a claim that specificity guarantees understanding. This study remains Level 0 and is not an approved L2 model.
- Verification: 49 Node tests and production build passed. Added coverage checks example-house visibility, description-card detail and matched build color; existing checks cover background/roof alignment and scene lifecycle. Desktop Chrome showed the example house in the revised default view; the newly added details were not exhaustively checked through every UI state. Mobile, all angles, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Superstitious pigeon refinement in progress

- Added enclosure flooring and framing, wing and foot details, a feeder chute and a correctly centered clock hand. Removed static food from the tray: up to six illustrative pellets now appear according to the delivery count, while a separate action rotates the bird. The model retains response-independent timed deliveries; the pellet cap is purely a visual limit. This is an illustration, not a reconstruction of Skinner's apparatus, and remains Level 0 rather than an approved L2 model.
- Verification: 50 Node tests and production build passed. A new test checks the empty initial tray, clock pivot, behavior independence and first timed delivery; lifecycle tests cover disposal. Desktop Chrome showed the enclosure and empty tray; after the screenshot, one remaining top bar was removed to reduce clock obstruction and the build passed, but that final decorative change was not visually rechecked. Full action-state browser checks, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Chicken and induction refinement in progress

- Added a small coop and ground surface, changed six generic blocks into individual day records, and tied the first five food markers to the feeding count. The bowl is empty initially and at the sixth-day counterexample; the final day record changes color separately. Revised the marker silhouette after desktop review to avoid an unintended funerary appearance. This is a non-graphic illustrative sequence, not a historical reconstruction or an actual prediction; it remains Level 0 rather than an approved L2 model.
- Verification: 51 Node tests and production build passed. A new test checks all six day states, food visibility, the counterexample and reset; lifecycle tests cover disposal. Desktop Chrome showed the revised day cards at the initial state. Full action-state browser checks, mobile, all angles, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Fixed and variable ratios refinement in progress

- Replaced the decorative stations with two framed schedule panels, one active-mode lamp, a shared response button, 19 progress markers and an initially empty reward tray. Progress reflects the current response count rather than a displayed future threshold; up to six earned rewards are shown and the text retains the exact total. Switching modes resets the trial, as before. This is a schematic interactive illustration rather than a reconstruction; it remains Level 0 and is not an approved L2 model.
- Verification: 52 Node tests and production build passed. A new test covers FR10, switching modes, a VR draw requiring 19 responses, progress above ten, reward and reset; lifecycle tests cover disposal. Desktop Chrome showed the initial scene and confirmed the UI response count after one click. Full action-state visual checks, mobile, all angles, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Self-stimulation and choice refinement in progress

- Rebuilt the enclosure with a stylized rat, feeder, lever, choice indicators and a twelve-token budget. The cost lamps change with the selected synthetic condition, the food and stimulation indicators reflect visitor choices, and the food tray starts empty. The rat is static: this does not present the visitor's inputs as observed animal behavior or reconstruct the historical apparatus. The visual remains simplified and Level 0, not an approved L2 model.
- Verification: 53 Node tests and production build passed. A new test checks condition costs, choice counts, budget consumption, exhaustion and reset on changing condition; lifecycle tests cover disposal. Desktop Chrome showed the revised scene and the UI count and budget after one food choice. Other visual interaction states, mobile, all angles, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Twins and heritability refinement in progress

- Replaced scaling figures and ground as implicit statistical indicators with two stylized homes and people, an environment-dependent alternative facade, and eight paired markers representing the synthetic comparison group. The visual marker count and UI now use the same invented count function for every group, environment and zygosity. Symbolic individual and type indicators change without implying that physical appearance measures genetic contribution. The home imagery is a limited metaphor for family environment, not a reconstruction or an estimate of heritability. This remains Level 0 and is not an approved L2 model.
- Verification: 54 Node tests and production build passed. A new test checks the markers and text across all 12 synthetic conditions, environment model visibility and example selection; lifecycle tests cover disposal. Desktop Chrome showed the initial scene and the environment control updated the UI; foreground trees were subsequently moved to reduce obstruction and were not visually rechecked. Complete interaction-state visual checks, mobile, all angles, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Argument frames refinement in progress

- Replaced the generic panel with a shared table, seated stylized participants and an arched setting. The war frame shows opposing game pieces; the shared-drawing frame shows overlapping lines. Example changes move one piece or add a mark, respectively. These are interpretive illustrations: the shared-drawing frame is an exhibit invention, not a claim from Lakoff and Johnson, and the two frames can each obscure relevant aspects. This remains Level 0 and is not an approved L2 model.
- Verification: 55 Node tests and production build passed. A new test covers both frame groups, example changes and reset; lifecycle tests cover disposal. Desktop Chrome showed the war-frame scene and the UI updated to shared drawing on switching. The shared-drawing canvas after the click was not independently captured as a complete image; all angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Time frames refinement in progress

- Rebuilt both frames at the center of a shared paved stage: a tabletop hourglass and coin stacks for budgeting, and a raised bed, seedlings, watering can and trellis for the garden. The alternate garden example now removes seedlings to suggest fallow soil rather than enlarging the plant. The garden metaphor is the exhibit's invention, not an attribution to the book. This remains simplified Level 0 and is not an approved L2 model.
- Verification: 56 Node tests and production build passed. Tests cover frame visibility and resource disposal, the money example and planted/fallow states. Desktop Chrome showed the money frame, planted garden and fallow garden after interaction; a segmented trellis beam was then made continuous and that final decorative adjustment was not visually rechecked. Other angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Emotion orientation refinement in progress

- Replaced the scaled figure and isolated arrow with a stable observer at a junction, two opposite stair routes, a raised pavilion, a low pool and a highlighted position marker. Direction and example controls move the marker and change the corresponding sign, while the observer stays unchanged. Up and down are complementary illustrations of orientational expressions, not measurements of emotion or competing theories. This remains simplified Level 0 and is not an approved L2 model.
- Verification: 57 Node tests and production build passed. A new test covers both routes, both examples, marker-to-step placement, stable traveler proportions and reset; lifecycle tests cover disposal. Desktop Chrome showed both direction states and updated text. Other example states in the browser, all angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Sisyphus second visual and contact pass

- Replaced boulder support against a local tangent plane with support computed from each rotated vertex against the analytic curved ground; the tangent approximation could leave visible clearance on a curved slope. Added subtle rock-color variation without changing the underlying slope and added small sandals to the figure. The path surface is separately raised, so this check is not a full contact simulation against every rendered triangle. The image still falls visibly short of the concept render in terrain, anatomy and materials and remains unapproved for L2.
- Verification: 57 Node tests and production build passed. The updated test samples ten ascending positions using the fallback geometry, checks each hand against actual boulder vertices and checks ground contact against the curved analytic surface. Existing asset lifecycle tests cover loading and disposal, but loaded-asset contact and every animation position were not separately proven. Desktop Chrome showed the updated default view; all angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Sisyphus raised-path contact

- Added a spatial index over the actual raised path triangles and use its interpolated surface height together with the analytic hill to support the rotating boulder. This corrects the previous support calculation, which ignored the visibly higher path. The method checks vertices rather than full mesh-to-mesh collision, so it is still an approximation.
- Verification: 58 Node tests and production build passed. A test loads the actual shipped GLB and independently raycasts the path beneath every asset vertex at six sampled ascent positions, checking the smallest surface clearance; the fallback is also checked at ten positions. A local Node run measured 300 loaded-asset scene updates in approximately 56 ms, excluding browser rendering; this is not a device frame-rate benchmark. Desktop Chrome showed the initial view. Full-cycle visual contact, every mesh triangle, mobile and sustained device performance remain unchecked. The scene still falls short of the concept render and is not approved L2. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Panopticon multilevel cutaway pass

- Added two rear tiers of inward-facing cells, balcony slabs and handrails, keeping the front low to expose the interior. Raised the observation tower to suit the additional floors and added stone courses and roof ribs. The cutaway and light beam are illustrative design choices, not a reconstruction of a particular prison. Geometry remains simplified compared with the concept image and is not approved L2.
- Verification: 59 Node tests and production build passed. A new test checks the number, rear placement, inward orientation and gallery elevations of the upper cells; existing tests cover the beam and scene resource disposal. Desktop Chrome showed the revised default view. Other viewing angles, complete slider interaction, mobile, physical touch, screen-reader, cross-browser and sustained performance with the added geometry remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Cave prisoner and departure pass

- Replaced standing prisoners with seated figures facing the shadow wall, added anchor blocks and schematic chains, and made the third figure switch from seated to standing as the slider advances. The abandoned chain stays by its anchor; the departure trajectory shifts toward the exit and away from the fire. Added a shallow irregular rock overhang. Shadows remain graphic shapes, not a physically simulated projection. The scene is still stylized and falls short of the concept image; it is not an approved L2 model.
- Verification: 60 Node tests and production build passed. Tests check seated/standing states, fixed prisoners and chains, silhouette preservation and sampled bounding-box clearance between the departing figure and fire. Desktop Chrome showed both slider endpoints; all intermediate states, other angles, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Ship fittings and water pass

- Added curved end timbers, sail seams following the existing curved cloth surface, rope coils and barrel hoops as children of the rocking hull. Added fixed illustrative ripples to the surrounding water. Existing slider-driven plank colors remain the visual replacement cue; the design is not a historical ship reconstruction and remains below the concept image's detail level rather than an approved L2 model.
- Verification: 61 Node tests and production build passed. Tests check reversible plank color progression, sail curvature, attachment of the new pieces to the moving hull and a fixed water ripple; lifecycle tests cover disposal. Desktop Chrome showed the revised default view and the fully replaced slider state. Other angles, all intermediate slider states, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Veil of ignorance platform pass

- Widened the six podiums, added inward-facing stairs and masonry seams, varied clothing and skin tones, and added a radial central mosaic. Increased folds and a small scallop in the curtain without moving its top attachment. Different platform heights are an abstract illustration of differing circumstances, not a complete representation of Rawls's argument or an assessment of people's worth. The model remains stylized and below the concept image's detail level; it is not approved L2.
- Verification: 62 Node tests and production build passed. Tests check that people remain on their caps, stairs rise to the platform and clear the center, and the curtain gathers with its top fixed. Desktop Chrome showed both slider endpoints. Other viewing angles, intermediate slider states, mobile, physical touch, screen-reader, cross-browser and sustained performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Trolley vehicle and trackbed pass

- Added shaped trackbeds beneath the existing curved rails, a curved tram roof, window frames and a collector attached to the moving cart. Varied the figures' clothing and skin tones while retaining five people on one branch and one on the other. The cart stops short of the people and does not depict a collision or decide the ethical question. The visual remains stylized and below the concept image's detail level, not approved L2.
- Verification: 63 Node tests and production build passed. Tests check both branch curves and highlights, lever clearance, the figure positions, the new roof's cart attachment and lifecycle disposal. Desktop Chrome showed the default view and the opposite branch selected. Other angles, all slider positions, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Vat loading fix and detail pass

- Desktop preview initially showed a blank canvas. A negative initial animation timestamp was reproduced causing a curve lookup exception; signal phase is now normalized before sampling, and the scene subsequently rendered. Added illustrative crosswise brain folds, electrode contacts, rim rivets, control knobs and animated bubbles. The brain and equipment are schematic, not anatomical or experimental reconstructions. The visual remains below the concept image's level and is not approved L2.
- Verification: 64 Node tests and production build passed. Tests cover negative timestamps, signal visibility and waveform response, bubble bounds and signal-independent motion, and resource disposal. Desktop Chrome showed the scene and both signal slider endpoints. Other viewing angles, all intermediate states, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Free will path and landscape pass

- Added colored architectural trim to both arches, softened path joints, added a cloak to the traveler and placed rocks and sparse vegetation outside the paths. Moved the maximum travel position back toward the junction after the right arch obscured the person in the default view. The two routes remain an interpretive choice metaphor, not an exhaustive map of theories of freedom and determinism. The scene remains stylized and below the concept image's detail level, not approved L2.
- Verification: 65 Node tests and production build passed. Tests sample the traveler's position on both path centerlines, check the new rocks against both routes and cover resource disposal. Desktop Chrome showed both slider endpoints after the visibility adjustment. Other viewpoints, intermediate slider positions, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Chinese room operator and rulebook pass

- Replaced the standing, outward-facing figure with a seated operator facing the desk. Added abstract ring-to-triangle examples on the rulebook, a stack of books, a framed bookcase and trim around both card openings. The shapes are illustrative symbols rather than Chinese text or a simulation that establishes understanding. The scene remains stylized and below the concept image's detail level, not approved L2.
- Verification: 66 Node tests and production build passed. Tests sample card motion through both wall openings and the new trim, tray support, operator orientation and resource disposal. Desktop Chrome showed the revised default view and the output card at the end of the slider. Other angles, complete visual slider motion, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Socratic dialogue setting pass

- Added a patterned rug border, scroll and plant on the table, simple facial cues, foliage around the arch, a planter and an abstract bust on the bookcase. Replaced ellipses in the dialogue cues with question marks while retaining the slider's changing emphasis and gestures. The people and bust are fictional schematic figures, not historical portraits, and the marks do not present a real dialogue. The scene remains below the concept image's detail level and is not approved L2.
- Verification: 67 Node tests and production build passed. Tests check reversible dialogue emphasis and gestures, background planter clearance from the participants and scene disposal. Desktop Chrome showed the default scene and one slider endpoint. Other angles, the opposite endpoint after this pass, intermediate positions, mobile, physical touch, screen-reader, cross-browser and sustained device performance remain unchecked. Vite's >500 kB warning remains. No maturity grades, commits, pushes or deployments were made.

## 2026-11-16 - Newcomb presentation and choice pass

- Added static trim and rivets to the opaque box, background cloth and foliage, books and an urn, and two choice-diagram plaques tied to the existing one-box/two-box control. The closed box remains opaque and stationary; this does not simulate prediction or reveal its contents. The scene remains stylized and below the concept image's detail and has not been approved as L2.
- Verification: all 68 Node tests and the production build passed. The tests cover selection highlight changes in both directions, separation of the plaques from the boxes, and the opaque box's static, nontransparent parts. A desktop Chrome preview was visually inspected at the initial selection; the accessibility control accepted a changed value, but the visual state change was not confirmed in that browser interaction. The existing Vite large-chunk warning remains.

## 2026-11-16 - Eternal recurrence garden pass

- Added a second paving joint, exposed roots and a fuller crown to the central tree, separated stone seats around its base, masonry joints on the arch, and a cairn and grasses around the garden border. The traveler still moves along the circular route and returns to the same position and heading. The scene remains a simplified interpretation, considerably below the concept image's detail, and is not approved as L2.
- Verification: all 69 Node tests and the production build passed. The new test samples 72 positions to check the traveler's bounding box against the seats, border plants and cairn; existing tests cover the loop and disposal. Desktop Chrome showed the new garden in its default view. Other viewpoints and browser interaction states remain to be reviewed. Vite's large-chunk warning remains.

## 2026-11-16 - Butterfly dream setting pass

- Added a layered mountain and cloud silhouette inside the circular frame, wing veins that move with the butterfly, small pond blossoms, tree blossoms, and a low tea table with a cup and pot. The sleeper and butterfly remain separate, and the original wing and height interaction is retained. The figure, vegetation and landscape remain very schematic compared with the concept image; this is not an L2 approval.
- Verification: all 70 Node tests and the production build passed. Tests sample butterfly motion at several control values and times, check bounding-box clearance from the sleeper and tea table, and cover symmetry and disposal. Desktop Chrome showed the new details in the default view. Other viewpoints, continuous motion, mobile and other browsers remain to be reviewed. Vite's large-chunk warning remains.

## 2026-11-16 - Infinite monkey study pass

- Added a framed hourglass, infinity motif, loose illustrated pages, arch foliage, facial cues and typewriter roller knobs and trim. The paper marks remain schematic and do not claim a finite run has produced any particular text. The scene remains substantially simpler than the concept image and is not approved L2.
- Verification: all 71 Node tests and the production build passed. Tests cover key and hand alignment, negative initial timestamps, ornament clearance and disposal. Desktop Chrome showed the default composition; other viewpoints and continuous visual motion remain unchecked. Vite's large-chunk warning remains.

## 2026-11-16 - Language across a wall workshop pass

- Added wall masonry joints around the opening, a sender-side sketch, loose receiver-side building pieces, shelves, and house door and side-window details. House details are attached to their respective models and follow visibility and movement; the props are illustrative and do not represent transmitted instructions. The scene remains substantially simpler than its concept image and is not approved L2.
- Verification: all 72 Node tests and the production build passed. Tests check description/build behavior and that the receiver house's attached detail follows a background shift. Desktop Chrome showed the initial state and the blue-roof reconstruction after changing the description and building. Other views and combinations remain to be checked. Vite's large-chunk warning remains.

## 2026-11-16 - Pigeon apparatus pass

- Added neck, eye and layered feather details to the rotating pigeon, roof and side bars, feeder framing, a small mechanism and tray rim. Reduced roof-bar shadows after a desktop preview showed that they obscured the scene. Pellets remain controlled solely by elapsed steps; this is a schematic illustration rather than a historical reconstruction and is not approved L2.
- Verification: all 72 Node tests and the production build passed. Existing tests cover independence of behavior from the clock and food. In desktop Chrome, the revised default view was inspected, a behavior left food at zero, and three five-second steps changed the food count to one. Other viewpoints and visual confirmation of the pellet itself remain unchecked. Vite's large-chunk warning remains.

## 2026-11-16 - Chicken and induction courtyard pass

- Added layered hen feathers, comb, wattle and feet, five bowls aligned with the state-controlled food markers, roof detail, stepping stones, hay, a tree and flowers. The sixth marker remains a counterexample without a sixth food bowl. The scene remains a schematic interpretation well below the concept image's detail and is not approved L2.
- Verification: all 72 Node tests and the production build passed. The induction test checks all six states, food visibility, marker color, reset and alignment of the five bowls with the food. Desktop Chrome showed both the initial courtyard and the sixth-day counterexample. Other views and intermediate states remain to be reviewed. Vite's large-chunk warning remains.

## 2026-11-16 - Ratio schedule cabinet pass

- Added arched cabinet crowns, fasteners, reward-tray edging and a small paved and planted setting. The two cabinets still represent selectable modes of one response stream, sharing a single progress and reward display. The scene remains substantially simpler than the concept image and is not approved L2.
- Verification: all 72 Node tests and the production build passed. Existing tests check FR and VR progress, reward and mode state with deterministic draws. Desktop Chrome showed FR reward after ten responses, and the VR indicator after switching modes. Other viewpoints and browser VR reward sequences remain to be checked. Vite's large-chunk warning remains.

## 2026-11-16 - Self-stimulation and choice apparatus pass

- Added frame fittings, rat whiskers, a lamp and a blank recorder prop. The recorder contains no simulated animal trace, and the existing indicators remain tied to the visitor's choices and synthetic budget. The scene is an illustration, substantially simpler than the concept image, and is not approved L2.
- Verification: all 72 Node tests and the production build passed. Existing tests check costs, choice counters, budget, reset and insufficient-budget behavior. Desktop Chrome showed the default composition and one food plus one stimulation selection, with budget changing from 12 to 8. Other viewpoints and condition transitions in the browser remain to be checked. Vite's large-chunk warning remains.

## 2026-11-16 - Twins environment pass

- Added porches, chimneys and planters to garden homes, and balcony rails, masonry accents and an awning to the alternate urban home. These details are children of the appropriate home and switch with its visibility. The paired markers remain explicitly synthetic and do not estimate an individual's genetic share. The scene remains substantially simpler than the concept image and is not approved L2.
- Verification: all 72 Node tests and the production build passed. The population test covers all group, environment and zygosity combinations and checks that new home details belong to the correct groups. Desktop Chrome showed both similar and different home settings and their corresponding synthetic counts. Other perspectives and combinations remain to be reviewed. Vite's large-chunk warning remains.

## 2026-11-16 - Argument frames setting pass

- Added foliage, a bordered floor covering, participant hands and shoes, cups, and a distinct hanging banner for each frame. The banners and their supports switch with the chessboard or shared drawing, using the same two participants. A preview exposed floating banners, so suspension cords were added before the final check. The scene remains substantially simpler than the concept image and is not approved L2.
- Verification: all 72 Node tests and the production build passed. Existing tests cover both frame groups, example changes and reset. Desktop Chrome showed the initial war composition before the cord adjustment and the shared-drawing composition with suspended banner after it. The adjusted war banner and other angles remain to be visually reviewed. Vite's large-chunk warning remains.

## 2026-11-16 - Time frames setting pass

- Added translucent hourglass shells, a pencil pot and stool to the money frame, and trellis crossbars, vine foliage, hanging blossoms and a watering-can handle to the garden frame. Frame-specific objects remain grouped and the fallow example hides the soil sprouts while retaining the separate trellis vines. The scene remains substantially simpler than the concept image and is not approved L2.
- Verification: all 72 Node tests and the production build passed. Existing tests cover frame visibility, both garden examples and resource disposal. Desktop Chrome showed the money frame and both planted and fallow garden states. Other viewpoints and the second money example remain to be reviewed. Vite's large-chunk warning remains.

## 2026-11-16 - Emotion orientation landscape pass

- Added a pavilion roof rim, an arched lower opening, a schematic waterfall, poolside stones and sparse vegetation. The two routes and their marker continue to represent spatial metaphors, not a measurement of mood. The scene remains substantially simpler than the concept image and is not approved L2.
- Verification: all 72 Node tests and the production build passed. Existing tests cover both directions and example positions without changing the traveler. Desktop Chrome showed the initial upward marker and the second downward example, including the new lower destination. Other viewpoints and remaining example combinations need review. Vite's large-chunk warning remains.

## 2026-11-16 - Sisyphus footing pass

- Adjusted each foot and leg to the sampled height of the raised path or analytic hill during the ascent, and added a belt and shoulder forms. The boulder support and hand-to-surface calculations are retained. This is a simple planted pose rather than a walking cycle; the figure and terrain remain far below the concept image's detail and are not approved L2.
- Verification: all 73 Node tests and the production build passed. A new test checks both foot-center sole heights at 100 ascent samples; existing tests check hand contact and boulder clearance, including the loaded GLB. Desktop Chrome showed one animated ascent pose. The full foot mesh, complete visual motion, other angles and device performance remain to be checked. Vite's large-chunk warning remains.

## 2026-11-16 - Panopticon masonry pass

- Added arched inner cell entrances, intermediate gate bars, bed legs, exterior wall joints, radial courtyard joints and small lower tower windows. The observation tower remains opaque and its beam behavior is unchanged. The cutaway is an interpretive model and remains below the concept image's architectural detail; it is not approved L2.
- Verification: all 73 Node tests and the production build passed. Existing tests cover the orientation of all cells, upper gallery support, beam response and disposal. Desktop Chrome showed the default cutaway and added details; close views, other angles and browser beam endpoints remain to be checked. Vite's large-chunk warning remains.

## 2026-11-16 - Cave brazier and props pass

- Added a supporting brazier and rim below the flames, plus a small stand with a vase and disk to suggest objects related to the wall silhouettes. The silhouettes remain illustrative shapes rather than physically simulated shadows. The wall, figures and cave environment remain substantially simpler than the concept image and are not approved L2.
- Verification: all 73 Node tests and the production build passed. The cave test checks the brazier's height against the fire and samples departure clearance from the fire, brazier and prop stand. Desktop Chrome showed the default view and the new objects. Other views, full visual movement and complete geometric clearance remain to be checked. Vite's large-chunk warning remains.

## 2026-11-16 - Ship construction pass

- Added a continuous curved gunwale, fasteners attached to each replacement-panel group, mast rope wraps and a small amphora. These objects move with the hull; the ten panel groups retain their existing reversible color-based replacement illustration. The vessel and water remain considerably simpler than the concept image and are not approved L2.
- Verification: all 73 Node tests and the production build passed. The ship test checks ten replacement states and reversibility, 90 fasteners parented to panels, and gunwale ownership; existing coverage checks hull motion and fixed water. Desktop Chrome showed the mid-replacement view. Other viewpoints and browser slider extremes remain to be checked. Vite's large-chunk warning remains.

## 2026-11-16 - Veil mosaic and hem pass

- Added alternating radial mosaic tiles, horizontal masonry courses on taller podiums, and a pleated lower hem attached to the moving curtain. The hem rises and fades with the curtain while the figures remain on their podiums. The figures, architecture and fabric remain much simpler than the concept image and are not approved L2.
- Verification: all 73 Node tests and the production build passed. The veil tests check the hem's parent, ascent and opacity, platform support, stair orientation and disposal. Desktop Chrome showed the middle and raised curtain states. The lowered endpoint, other angles and continuous motion need further visual review. Vite's large-chunk warning remains.

## 2026-11-16 - Trolley running gear and ballast pass

- Added wheel hubs, buffers and body trim to the moving tram, plus small shared-geometry gravel pieces along the track beds. The branch selection, five-versus-one arrangement and non-collision stopping point remain unchanged. The environment and figures remain substantially simpler than the concept image and are not approved L2.
- Verification: all 73 Node tests and the production build passed. Tests check both selected routes, lever clearance, the five and one positions, cart-owned hubs and gravel below wheel-bottom height. Desktop Chrome showed the default and opposite selected branches. Other angles and visual movement through a full cycle remain to be checked. Vite's large-chunk warning remains.

## 2026-11-16 - Vat apparatus framing pass

- Added base clamps, control-panel framing and fasteners, an arch behind the bookcase and a stack of books. The decorative frame does not change the existing signal, waveform or independent bubble behavior. The scene remains substantially simpler than the concept image and is not approved L2.
- Verification: all 73 Node tests and the production build passed. Existing tests cover the signal and waveform controls, negative timestamps, bubble bounds and independence, and disposal. Desktop Chrome showed the default view and the zero-signal state with a flat waveform. Other viewpoints and the high-signal endpoint remain to be visually checked. Vite's large-chunk warning remains.

## 2026-11-16 - Free will approach and landscape pass

- Added paving joints and borders along the approach, foliage at the outside of both arches, and a tree behind the junction. Adjusted the leaves toward the pillars after an initial preview showed a small gap. The traveler still follows either curve and stops before the arch. The scene remains substantially simpler than the concept image and is not approved L2.
- Verification: all 73 Node tests and the production build passed. Existing tests sample figure placement along both paths and rock clearance; the extended test checks the new tree against both path centerlines. Desktop Chrome showed the default view before the foliage correction and the right path endpoint afterward. The left endpoint after this correction, other angles and full foliage clearance remain to be checked. Vite's large-chunk warning remains.

## 2026-11-16 - Chinese room floor and books

- Added floorboard seams, a bordered mat and book spine bands. The scene remains much simpler than the concept art and is not approved L2.
- Verification: all 73 Node tests and the production build passed. Desktop Chrome after a reload showed the new details in the default view. Slider endpoints and other views were not visually rechecked in this pass. Vite's large-chunk warning remains.

## 2026-11-16 - Socratic participants and setting pass

- Added chair cushions and arms, layered garments, clasps, hair locks, sandal straps and resting arms to both participants. Added carpet weave and masonry joints to the arch. The animated arm and question-bubble emphasis are retained. An initial desktop view showed arch joints projecting; the joints were shortened and a second view showed them within the arch profile.
- Verification: all 73 Node tests and the production build passed after the correction. Desktop Chrome showed the middle dialogue state after reload. The two slider extremes and other viewing angles were not visually checked in this pass. The figures, expressions and setting remain much simpler than the concept and are not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Newcomb stonework and box detail

- Added jointed radial paving and dais edging, inset lid and front trim on the closed box, engraved coin rims, amphora handles and a small neutral bust. The bust was moved after the initial desktop view showed it mostly hidden behind the box. The opaque box stays closed and the two-box selection retains the existing control logic.
- Verification: all 74 Node tests and the production build passed. The added test checks bust clearance from the boxes and choice plaques, and checks that the coin rims are inside the glass frame. Desktop Chrome showed the relocated bust and default two-box view. The slider accepted the one-box endpoint, but the immediate screenshot did not establish that the visual highlight had repainted, so the endpoint requires a further visual check; automated tests cover the selection state. Vite's large-chunk warning remains. This schematic scene is not yet approved L2.

## 2026-11-16 - Recurrence foliage and path clearance

- Added shared-geometry leaf clusters to the central canopy, flowers and grasses around the inner verge, and a cape and pack to the moving traveler. After an initial desktop view showed some leaves floating above the canopy, lowered the clusters and rechecked the default view. The canopy and traveler remain schematic relative to the concept image and are not approved L2.
- Verification: all 74 Node tests and the production build passed. The clearance test now samples the traveler's bounding box against the new inner plants at 72 positions. Desktop Chrome showed the updated middle state; other camera angles and all leaf attachments still need inspection. Vite's large-chunk warning remains.
- Follow-up on the preceding Newcomb pass: desktop Chrome at slider value zero showed the opaque-box highlight retained, the transparent-box highlight removed, and the single-box plaque highlighted.

## 2026-11-16 - Butterfly dream sleeper and setting pass

- Added woven mat lines, a shaped draped cover, a hair knot and closed eyes to the sleeper; added branches to the grove, paired markings on both sides of the butterfly wings, and water ripples. Wing markings are parented to their animated wings. The setting and figure remain substantially simpler than the concept and are not approved L2.
- Verification: all 74 Node tests and the production build passed. Existing tests sample wing movement, butterfly clearance from the sleeper and table, and mat contact. Desktop Chrome showed the middle state after reload; the cover's contact at every viewpoint and both slider endpoints still require visual review. Vite's large-chunk warning remains.

## 2026-11-16 - Infinite monkey study pass

- Added a vest and facial patches, chair-back spindles, rug edging, circular rimmed typewriter keys and spools, an armillary sculpture and a crumpled page. Loose-page markings now share the page rotation. The character and furnishings remain simplified compared with the concept image and are not approved L2.
- Verification: all 74 Node tests and production build passed. The key-contact test now compares the actual world-space key and hand bounds at sampled times; the ornament test checks the armillary and crumpled page clear the monkey and typewriter. Desktop Chrome showed the default and rotated front views at the middle setting. Other animation phases and camera angles still require visual review. Vite's large-chunk warning remains.

## 2026-11-16 - Language wall roof and workspace pass

- Replaced both pyramidal roofs with gabled roofs and modeled tile rows, added participant faces and orientation, and laid stone slabs under the workspaces. Tiles share their roof material and transform so the receiver's alternative builds and background shift remain consistent. The room, people and furnishings are still substantially simpler than the concept and are not approved L2.
- Verification: all 75 Node tests and production build passed. A new test covers roof-tile attachment, visibility and shared material through receiver build states. Desktop Chrome showed the initial and specific-description/matched-build states with both tiled roofs. Other build and background states were checked by tests but not visually reviewed in this pass. Vite's large-chunk warning remains.

## 2026-11-16 - Pigeon enclosure and feeder pass

- Connected the roof bars to a new front beam, added frame caps and timer mechanism, replaced the ambiguous gold block in the empty tray with a distinct feeder chute, and added wing coverts and a cere to the pigeon. Food remains controlled by elapsed intervals rather than the bird's action.
- Verification: all 76 Node tests and production build passed. The new test checks that coverts follow the bird's rotation and that the chute does not intersect the state-controlled pellets. Desktop Chrome showed the empty initial tray and, after three time steps, one pellet; the control readout also showed one feeding with zero behaviors. Other viewing angles remain unchecked, and the model is still schematic compared with the concept, not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Chicken and induction detail pass

- Added feather layers and tail to the hen, tree branches and leaves, a closed scenery gate, coop trim, and sun rays that appear only on completed feeding markers. The sixth counterexample marker has no feeding rays. The farm and animal remain schematic compared with the concept and are not approved L2.
- Verification: all 76 Node tests and production build passed. The induction state test now checks feeding rays over days zero through six and reset. Desktop Chrome showed the initial state, five feedings, and the sixth-day counterexample with a red marker and five past feeding bowls. Other viewing angles remain unchecked. Vite's large-chunk warning remains.

## 2026-11-16 - Ratio apparatus framing pass

- Added cabinet columns and cornices, bezels around existing mode and progress indicators, a response-button surround, paving and plants. The model retains one shared response stream and does not add decorative counters that could be mistaken for data. It remains substantially simpler than the concept and is not approved L2.
- Verification: all 77 Node tests and production build passed. A new test checks that all 19 bezels align with the existing progress markers and that the response surround aligns with the button. Existing tests cover FR10 and deterministic VR states. Desktop Chrome showed FR10's tenth response and first reward, then the switch to VR10 with the other mode lamp lit and counters reset. Other views and stochastic VR sequences were not visually reviewed. Vite's large-chunk warning remains.

## 2026-11-16 - Self-stimulation enclosure pass

- Added a cross-grid roof, light transparent side panes, inner ears, eye glints and toes to the rat, and a blank recorder roll with end hubs. The recorder remains a prop without an invented animal trace; the visitor choices and budget remain the existing synthetic model. The illustration is still simpler than the concept and is not approved L2.
- Verification: all 78 Node tests and production build passed. A new test checks the two panes and blank roll clear the rat. Existing state tests check both choices, costs and budget. Desktop Chrome showed the initial state and one food plus one stimulation choice with budget eight. Other angles and condition changes were not visually rechecked in this pass. Vite's large-chunk warning remains.

## 2026-11-16 - Twin homes and figure contact pass

- Replaced the garden houses' oversized pyramidal roofs with gabled tiled roofs, added door hardware, and refined both figures with hands, collars and shoes. Raised the figures so their shoes meet the platforms. Roof tiles remain children of their corresponding home and disappear when the comparison switches to the urban home. The figures and environments remain simpler than the concept and are not approved L2.
- Verification: all 79 Node tests and production build passed. A new test checks roof tile ownership and visibility plus figure bounding-box contact with the platform; existing tests cover all synthetic population counts. Desktop Chrome showed both similar and different home settings, including the changed 6/8 and 5/8 illustrative counts. Other angles and individual/zygosity states remain visually unchecked in this pass. Vite's large-chunk warning remains.

## 2026-11-16 - Argument figures and arcade pass

- Rebuilt each participant's arms as connected upper-arm and forearm segments, added face and collar details, rounded the board pieces, and extended the arcade foliage and column joints. The same participants remain present when the tabletop switches between the two frames. The scene remains simpler than the concept and is not approved L2.
- Verification: all 80 Node tests and production build passed. The new test checks hand/forearm bounding-box contact for both figures; existing tests cover tabletop and example visibility. Desktop Chrome showed the chessboard and shared-drawing states after reload. Other angles and exact surface contacts remain visually unchecked. Vite's large-chunk warning remains.

## 2026-11-16 - Time frames garden and hourglass pass

- Added the pergola's front supports, a stone bed edge and a kneeling gardener. Corrected changing hourglass sand to stay anchored and within the glass cone, and changed the alternate coin stacks by removing their top coins instead of suspending them. The models remain simpler than the concept and are not approved L2.
- Verification: all 81 Node tests and production build passed. A new test checks four pergola posts, sand anchors and upper cone clearance, and coin visibility in both money examples. Desktop Chrome showed the planted garden and alternate money example before the final upper-sand width correction; that last correction was verified geometrically and by build but not visually rechecked. Other angles and the fallow garden still need review. Vite's large-chunk warning remains.

## 2026-11-16 - Emotion orientation path pass

- Added a stone entry arch, hand/foot and bag details on the traveler, step nosings, a domed pavilion, and a stream with pool ripples. The directions remain complementary metaphors, with the same traveler and existing state marker.
- Verification: all 82 Node tests and production build passed. A new test checks that the traveler's bounding box meets the approach platform, the entry arch clears the traveler, and the step trim does not intersect the marker or halo in all four frame/example combinations. Desktop Chrome showed the initial up and switched down views. Other angles and full geometry contacts remain to be visually checked; the scene is still simpler than the concept and not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Sisyphus rendered-ground contact and terrain pass

- Named the rendered terrain meshes and checked contact against them instead of relying only on the analytic height function. The new check initially found a 0.0805-unit boulder gap near the summit: the fallback ground was offset above the actual cone. Aligned the fallback with the cone and base, and computed foot support from all foot vertices rather than just the foot center. Added a draped skirt, facial/sandal details and larger crags that retain a conservative exclusion corridor around the route.
- Verification: all 83 Node tests and production build passed before the last test-only extension; the targeted Sisyphus suite then passed with the actual GLB boulder and both feet checked against rendered hill, path and base meshes at six ascent points (tolerance 0.015). The 100-point foot test checks all foot vertices against the indexed surface, and the crag test checks route clearance. Desktop Chrome showed the revised terrain during ascent, but visual contact across all viewpoints and the descent remains unreviewed. The mountain and figure remain substantially simpler than the concept and are not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Panopticon cell floors and gallery structure

- Added floors to all ground and upper cells so beds are supported beyond the narrow balcony, added outer coping, and gave the two gallery slabs physical thickness. Raised ground-floor furniture to meet the courtyard surface; upper floor tops sit slightly above the gallery. The cutaway and rotating observation beam remain.
- Verification: all 84 Node tests and the production build passed. A new test checks all 40 cell floors and 160 bed legs, ground-floor alignment to the courtyard, upper-floor elevation and gallery thickness. Desktop Chrome showed the default and an oblique view of the initial structural pass, and the default view after the final height correction; individual furniture contacts and other angles still require visual inspection. The model is substantially simpler than the concept and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Cave exit structure

- Replaced the five floating, separated exit treads with solid risers that meet the floor and each other, and added irregular stones to suggest the outer jamb and lintel of the cave opening.
- Verification: all 85 Node tests and the production build passed. A geometry test checks the risers' floor contact, adjacency and consistent rise. In the in-app browser's default view, the cave renders but the exit is mostly obscured by the wall; the new structural details still need visual inspection from other angles. The scene remains much simpler than the concept render and is not approved L2. The Vite large-chunk warning remains.

## 2026-11-16 - Cave preview correction and exit support

- Correction to the previous entry: the in-app browser had the earlier build loaded, so its observation did not establish visibility of the new exit. After reloading the current build, the stairs and opening are visible in the default view; the exit remains small on the narrow viewport.
- Added a continuous extruded stone core beneath the exit jamb's separate facing rocks, connecting its base to the overhead wall. The model remains schematic compared with the concept render and needs additional visual refinement and angle checks before L2 review.
- Verification: 85 Node tests and the production build pass; the build still reports the large-chunk warning. Reloaded the in-app preview after the build.

## 2026-11-16 - Cave figure contact and departure

- Raised the seated and standing figures so their lowest mesh points meet the cave floor instead of sinking into it. Extended the freed figure's path to approach the first stair while avoiding the stair geometry; the figure does not climb the steps.
- Verification: 86 Node tests and the production build pass. Geometry checks sample the standing figure across the departure, check floor contact and stair clearance, and check the end position. The existing test checks fire and brazier clearance at ten settings. This pass has not yet been visually checked, and the scene remains schematic and not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Ship plank joints

- Added staggered butt joints to the three hull courses. The joints are attached to the corresponding replacement panels, so they follow the rocking ship while the slider changes the board colors.
- Verification: 87 Node tests and the production build pass; a test checks joint ownership, motion and replacement state. Reloaded the latest build and viewed the ship at the default narrow viewport: the boat renders, but individual fine joints are too small there to assess reliably. The hull, sea and fittings remain schematic compared with the concept image and are not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Ship hull form and water contact

- Tapered the supporting hull toward its bottom and applied the same taper to the side courses, pegs and staggered joints. Lowered the entire ship so the hull's lowest point meets the still water at rest.
- Verification: 89 Node tests and production build pass; checks cover course taper, rest-height contact, replacement state and rocking ownership. The tapered form was viewed in the in-app browser before the final water-height correction; the final height and moving waterline still require visual inspection. This remains a schematic ship and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Independent replacement boards

- Split the three tapered hull courses into 60 separately colored boards, staggering the middle course joints. The slider now distributes replacement across individual boards rather than changing three courses together in vertical strips; pegs and joints remain attached to their boards.
- Verification: 89 Node tests and the production build pass. Tests exercise all 61 side-board replacement counts, reversal, joint ownership, taper and rest-height water contact. The latest build renders at the default narrow in-app viewport, where individual boards remain difficult to inspect; visual review at a larger viewport and moving waterline checks remain. The model is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Veil figures and station objects

- Grounded each figure on its podium cap using the actual rotated mesh bounds. Added six distinct small station objects: a book, vessel, grain, hammer, scroll and balance, while keeping the existing curtain interaction and central mosaic.
- Verification: all 89 Node tests and the production build pass. The updated contact test measures each rotated figure's lowest mesh point against its cap. The new station objects and their appearance behind the curtain have not yet been visually reviewed; this scene remains schematic compared with the concept and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Veil curtain review and podium relief

- Inspected the latest scene in the in-app browser at both slider endpoints. The extended curtain softens the front figures; the lifted curtain exposes them. The station objects are too small in that narrow viewport for reliable detail review.
- Added shallow arched masonry reliefs to the four taller podiums, oriented toward their stairways. They are decorative reliefs rather than functional doorways. These additions have not yet been visually checked in the final build.
- Verification: all 89 Node tests and the production build pass. The scene remains substantially simpler than its concept and is not approved L2; Vite's large-chunk warning remains.

## 2026-11-16 - Trolley rail and sleeper contact

- Matched the tram's wheel spacing to the straight track gauge and raised its wheels and hubs so the wheel bottoms meet the rail tops at rest. Positioned the six figures over individual sleepers and raised their feet to sleeper height.
- Verification: all 90 Node tests and the production build pass. Tests check four wheels against the straight-track gauge and height, all six figures' positions and heights, and the existing branch movement and lever clearance checks. Wheel contact on the curved junction and the visual result remain to be inspected; this remains a simplified model and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Trolley curved-track wheel alignment

- Replaced the fixed wheel mounting with two independently oriented axle groups. Each axle now follows the selected branch's centerline and tangent while the body continues to follow the existing path.
- Verification: all 91 Node tests and the production build pass. Tests sample 100 times for each branch and check axle and wheel centers against the analytic track. A separate sampled nearest-curve calculation on one branch reduced the largest checked wheel-center offset from about 0.136 to under 0.004 scene units (sampling resolution affects the latter). The rendered rail mesh and moving appearance still need visual review; this is not an L2 approval. Vite's large-chunk warning remains.

## 2026-11-16 - Vat liquid surface and diffuser

- Added a translucent liquid surface and waterline, a bottom diffuser and a separate animated stream below the brain. Limited the existing peripheral bubbles to stay below the new surface.
- Verification: 92 Node tests and the production build pass. Tests sample the diffuser stream below the brain and check the peripheral bubbles against the waterline. The latest scene was inspected in the narrow in-app viewport; the vessel and apparatus render, but small bubbles and the subtle waterline need a closer visual review. This scene remains simpler than the concept and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Free-will path contact and depth

- Raised both branch surfaces to the same height as the junction so the figure's lowest points meet the path plane, and adjusted paving joints to sit just above it. Added two slender evergreens beyond the fork, clear of both path centerlines.
- Verification: 93 Node tests and the production build pass. Tests sample figure height on both branches, check the actual path vertex heights and tree clearance. The latest scene renders in the narrow in-app viewport, though the individual foot and paving contacts require closer inspection. The scenery remains much simpler than the concept and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Chinese Room seating and window

- Raised the operator and chair to the floor, extended the lower legs and added shoes. Replaced the solid rear wall with four wall sections framing a real opening, and added a double-arched window and sill.
- Verification: 95 Node tests and the production build pass. Tests compare the four chair legs and two shoes against the actual floor top, and verify a clear volume through the new rear-wall opening. The latest in-app preview shows the room and window; furniture and contact details remain small and require closer visual inspection. The model remains simpler than the concept and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Socratic furniture contact

- Raised the two participants and chairs to the carpet surface, adjusted the shoes and straps to connect to the shins, and grouped and raised the table with its contents so the pedestal rests on the carpet.
- Verification: 96 Node tests and the production build pass. A new geometry check compares all eight chair legs, four shoes and the table base with the carpet top. The altered hand-to-table relationships and the result at different dialogue states still need visual inspection; the model is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Newcomb box and coin support

- Lowered both boxes to the stone dais and aligned the transparent box's four coin stacks with its base; coins in each stack now touch one another. The opaque box remains closed and the existing one-box/two-box selection behavior remains unchanged.
- Verification: 97 Node tests and the production build pass. Tests compare each box body or base with the dais, each stack bottom with the transparent base, and adjacent coin heights; existing tests cover closed-box stability and selection states. The changes have not yet been visually reviewed, and this model remains simpler than its concept and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Recurrence path support and entrance

- Raised the ring surface to the traveler's foot height and added inner and outer vertical stone sides down to the garden floor. Extended the ten center seats to the ground, raised the entrance arch to ground level, and added a short paved approach meeting the ring.
- Verification: 98 Node tests and the production build pass. Geometry checks cover both path sides, the approach junction, the seat bottoms and sampled traveler height around the circle. The final scene and entrance junction still need visual review; the model remains substantially simpler than its concept and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Butterfly Dream table and cascade

- Raised the tea table and its contents so all four legs meet the lawn. Added a short stepped water surface between two rocks leading into the pond, drawing on the concept's waterfall without changing the butterfly animation.
- Verification: 99 Node tests and the production build pass. Tests check table-leg ground contact, the cascade endpoint within the pond, and existing butterfly/sleeper/table clearances. The new cascade has not yet been visually inspected and its interaction with the existing pond rocks needs review. The model remains simpler than the concept and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Monkey study seating and arm origin

- Adjusted the desk legs, chair, monkey feet and lower legs to meet the carpet. Raised the animated arm shoulder origins with the seated figure while preserving the existing key targets and pressed-key behavior.
- Verification: 100 Node tests and the production build pass. The contact test checks four desk legs, four chair legs and two feet against the carpet; existing tests check the active hand against the depressed key at several times. The updated seated pose and arm appearance still need visual review, especially at other key positions. The model remains simpler than the concept and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Language Across a Wall message passage

- Extended the message tray through the partition and positioned the description card on it across the opening in both vague and specific states. Raised the opening and adjusted its frame to leave room for the card's visible specific-description icon.
- Verification: 101 Node tests and the production build pass. A geometry test checks both description states, tray support and clearance from all four main wall sections; existing tests cover reconstruction and roof state. The card and frame have not yet been visually reviewed together, and the card is a static representation rather than a passing animation. The scene remains schematic and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Pigeon feeder storage and contact

- Set the pigeon's toes on the enclosure floor and arranged the six delivered pellets separately on the tray. Added fixed stored grain behind a translucent hopper window; those grains are independent of the timed delivery display.
- Verification: 102 Node tests and the production build pass. Tests check toe and pellet support, pellet spacing, chute clearance and that a behavior action does not show delivered pellets; existing tests cover timing-dependent delivery. The hopper and tray distinction still needs visual inspection, and this schematic model is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Induction markers and feeding contact

- Grounded the six day platforms and hen's toes, seated the marker plaques and five bowls on their platforms, and repositioned the grain on the bowls without overlapping adjacent grains. The existing sequence still shows five feedings followed by the sixth-day counterexample.
- Verification: 103 Node tests and the production build pass. Geometry checks compare marker, bowl, grain and toe heights with their supports; the existing state test covers the full six-day sequence and reset. The final arrangement has not yet been visually inspected and remains schematic rather than approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Ratio schedule apparatus contact

- Grounded the shared progress display, response-button base and reward tray base. Set the released button on its base while retaining its depressed state, and set the earned-reward markers on the tray surface.
- Verification: 104 Node tests and the production build pass. Tests check support geometry and button displacement; existing tests exercise FR10, an injected VR10 sequence, mode changes and earned-reward display. This pass has not yet been visually reviewed, and the model remains schematic rather than approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Choice apparatus support

- Grounded the illustrated animal's feet and toes, extended the food bowl and budget base to the floor, and aligned the food and budget markers with their supports. The markers remain tied to visitor actions and the synthetic budget, not animal behavior.
- Verification: 105 Node tests and the production build pass. Tests compare actual bounds for the animal, bowl, base and markers, and existing tests cover both choice conditions and budget reset. The final pose and food display still need visual review; this scene remains schematic and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Twin homes and population markers

- Added grounded foundation slabs to both garden homes and the alternate urban home. Grounded the population display and separated each pair of markers while keeping the same eight-pair synthetic count and environment switching.
- Verification: 106 Node tests and the production build pass. Tests cover foundation heights, marker support and spacing, alternate-home visibility and existing synthetic-count conditions. The final models and foundation transitions still need visual review; this scene remains schematic and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Argument frames furniture and tabletop

- Grounded the shared stools, shoes and table legs on the stage floor. Aligned both interchangeable board surfaces and the cups with the same tabletop, adjusting the chess squares, pieces and drawing rings to follow their surfaces.
- Verification: 107 Node tests and the production build pass. Geometry checks compare the furniture and tabletop components to their supports; existing tests exercise frame switching, example changes and hand/forearm connection. The final tabletop and hand relationships have not yet been visually reviewed; the scene remains schematic and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Time frames surface contact

- Aligned the hourglass base, coin stacks and pencil pot with the money-frame desk. Extended the garden bed to the ground, aligned sprouts with the soil and added grounded feet to the kneeling gardener.
- Verification: 108 Node tests and the production build pass. New checks cover the desk and garden supports in both frames; existing tests cover frame visibility, sand levels, coin changes and planted/fallow state. The final gardener pose and transitions need visual inspection; this model remains schematic and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Emotion orientation destinations

- Extended the lower pool to the ground and aligned the waterfall, channel and ripples with its surface. Named the pavilion base to check the upper route's last step and landing relationship.
- Verification: 109 Node tests and the production build pass. Geometry checks cover water contact and horizontal channel continuity, plus the final upper step's overlap and height relative to the pavilion base. Existing tests cover direction and example selection. The complete visual transitions and landing still need review; this scene remains schematic and is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Sisyphus larger rock masses

- Added 17 larger faceted rock masses embedded in the hill, with conservative horizontal clearance from the moving figure and boulder. They share one geometry and use the scene's existing resource disposal.
- Verification: 110 Node tests and the production build pass. A test samples the entire path against each rock mass; existing tests cover the actual boulder and feet against the underlying rendered terrain. The latest in-app preview shows the new masses, which still read as separate low-poly forms and fall well short of the concept's continuous rocky mountain and detailed figure. The model is not approved L2. Vite's large-chunk warning remains.
- The Quaternius Universal Base Characters publisher page was rechecked and lists CC0 glTF models, but the free download routes through itch.io; no character asset was downloaded, rigged or integrated in this pass.

## 2026-11-16 - Sisyphus connected rock strata

- Added a connected faceted strata mesh outside a conservative corridor around the climb, blending it below the original hill near the corridor. This supplies broader rock faces between the previously separate masses while retaining the existing moving-surface calculation.
- Verification: 111 Node tests and the production build pass. A raycast test samples around the route and checks that the new mesh does not rise above the original ground inside the sampled corridor; the existing rolling and foot-contact tests also pass. The latest narrow in-app preview shows a broader rocky area on the left slope, but the mountain remains visibly schematic and further views and detailed modeling are needed. It is not approved L2. Vite's large-chunk warning remains.

## 2026-11-16 - Sisyphus character asset evaluation

- Downloaded the free Quaternius Universal Base Characters Standard ZIP through its official itch.io flow; its included license identifies CC0 1.0. Extracted only the male glTF and binary into an untextured, embedded-buffer evaluation derivative under `review/sisyphus-character-evaluation/`, with source hashes and measurements in its README.
- Three.js GLTFLoader successfully parsed the derivative: the body has 7,281 vertices and 12,566 triangles, plus eye and eyebrow meshes; it has a humanoid skin and no animation clips. The source rests in a spread-arm pose and some normal-map URI names do not match the packaged filenames verbatim. Clothing, a pushing pose, dynamic hand/foot contact and performance remain unverified, so no application model was replaced and L2 remains unproven.
- This pass changed evaluation artifacts only; the prior 111-test/build result is not a new validation of the candidate in the application.

## 2026-11-16 - Sisyphus rig pose prototype

- Added an isolated Vite preview and a reusable cyclic-coordinate-descent pose experiment for the untextured CC0 character. The candidate is not connected to the main scene; a temporary rigid wrap and faceted test rock make the silhouette inspectable.
- Verification: 112 Node tests pass, including a new candidate test for finite joint positions and bounded static target errors. Measured hand-bone error is below .001, foot-bone errors are about .017 and .044, and the lowest deformed mesh vertex is about .016 below the flat reference floor. The preview was viewed in the in-app browser and the console reported no errors. It remains too upright, lacks proper cloth/hair and does not establish palm contact or dynamic slope support. No L2 approval is claimed.

## 2026-11-16 - Candidate lean and finger targets

- Increased torso lean in the isolated Sisyphus prototype, changed the static arm solver to target selected vertices on its faceted preview rock using the middle-finger bones, and attached a CC0 hairstyle to the head and the temporary wrap to the pelvis. The hair source and derivative hash are documented in the evaluation README.
- Verification: 112 Node tests pass, including the updated static fingertip-bone target check. The in-app preview rendered the hairstyle and more forward posture without console errors. Finger bones meeting rock vertices do not demonstrate nonpenetrating hand surfaces; foot contact, clothing deformation and dynamic slope/rolling-rock behavior remain unverified. The prototype is not integrated and no L2 completion is claimed.

## 2026-11-16 - Candidate deformed foot contact

- Reoriented the candidate's foot bones toward their rest-world orientation after leg solving and shortened the staggered stance so the ankle targets remain reachable. Added a deformed-vertex inspection rather than relying solely on bone positions.
- Verification: 112 Node tests pass. The new check selects 400 vertices per foot with over 0.5 combined foot/ball bone influence; the lowest measured vertices are about +.0003 and +.0032 above the flat reference floor. The browser preview rendered without console errors. This is not full sole contact, dynamic hill support or a hand-surface collision test; the candidate remains an isolated, unapproved prototype.

## 2026-11-16 - Candidate hand mesh clearance

- Measured the static candidate's deformed hand vertices against the convex preview rock. The original finger-bone target placed 601 selected vertices per hand inside, with maximum plane depth about .077 units. Offset the finger targets outward and retained a close approach.
- Verification: 112 Node tests pass. The updated test classifies 1,071 vertices per hand with more than .5 hand/finger influence against all preview-rock triangle planes: none are inside and minimum maximum-plane separation is approximately .00085 per side. This does not prove whole-triangle clearance, cover lower-weight vertices, or apply to the rolling irregular boulder and slope. The candidate remains separate from the main scene and is not approved L2.

## 2026-11-16 - Candidate triangle check and rotated-rock preview

- Added convex clipping for 3,388 deformed triangles with at least one hand-dominant vertex; no interior intersections were found at the static zero-angle preview pose. Made the candidate solver reset its original bone rotations before each solve and added a rock-rotation slider to the isolated preview.
- Verification: 113 Node tests pass. Sampled rotation angles reach the selected offset finger targets and a zero-angle return reproduces the original arm orientation. The in-app preview at the slider end rendered without console errors, but the arms look crowded; triangle clearance was not verified at nonzero angles, target continuity and the actual rolling boulder remain unresolved. The candidate is not integrated and not approved L2.

## 2026-11-16 - Candidate contact continuity audit

- Sampled the current nearest-vertex target across the rotation slider at .01-radian increments: the largest observed left-target jump was approximately .283 scene units. Tested replacing it with the closest point on a triangle, but the hand mesh entered the rock even after increasing the target offset; reverted that experiment to preserve the previously checked zero-angle pose.
- Verification: all 113 Node tests pass after the revert. This evidence rules out treating the current target selection as a production-quality continuous animation. Contact orientation and hand clearance must be solved together before integration; the model remains unapproved L2.

## 2026-11-16 - Candidate contact target smoothing

- Replaced hard nearest-vertex switching in the isolated prototype with a weighted blend of nearby rotating-rock vertices and adjusted the outward offset. This reduces sampled target jumps but does not solve full moving contact.
- Verification: 114 Node tests pass, including the zero-angle hand triangle check and a 201-sample target-continuity check. Maximum observed left-target displacement per .01 radian was about .011 versus .283 previously. A separate nine-angle audit found selected hand vertices inside the preview rock at ±.25 and ±.75 radians, with maximum convex-plane depth around .016; other angles and whole triangles remain unverified. The candidate remains isolated and is not approved L2.

## 2026-11-16 - Candidate angle-dependent contact audit

- Added a smooth angle-dependent target offset to the isolated pose experiment and a reproducible 41-angle deformed-hand vertex audit. Evaluated several offset amplitudes rather than optimizing only for the zero-angle pose.
- Verification: 114 Node tests pass. At the retained setting, two of 41 sampled angles contain selected hand vertices within the convex preview rock, worst plane depth approximately .0056; the largest sampled nearest-plane gap is approximately .053. A larger offset removed sampled penetration but increased that gap to approximately .157, so it was not retained. This is a partial improvement, not proven continuous mesh contact; real boulder geometry, full triangles and slope motion remain unverified. The model is not integrated or approved L2.

## 2026-11-16 - Candidate per-hand contact calibration

- Corrected the rotation audit to evaluate each hand separately; the previous combined nearest statistic could conceal a far hand. Added a reproducible offset grid search and separate interpolated offsets for each hand in the isolated preview.
- Verification: 114 Node tests pass, including zero-angle triangle/vertex checks and target continuity. A 201-angle vertex audit found eight samples with selected vertices inside, worst convex-plane depth about .0031, and a maximum per-hand nearest-plane separation of about .0235. A larger safety bump removed sampled penetration but failed the pre-existing target-continuity threshold, so it was not retained. This is not a complete mesh or continuous-time guarantee and is specific to the preview rock; the candidate is not integrated or approved L2.

## 2026-11-16 - Candidate dense per-hand calibration

- Extended the reproducible per-hand offset search to 101 nonnegative angles. Built mirrored, conservatively smoothed lookup arrays from the search results and retained a small interpolation safety bump for the isolated convex-rock preview.
- Verification: 115 Node tests pass, including a 41-angle vertex audit, the zero-angle selected-triangle test and target continuity. An additional 1,001-angle audit found no selected hand-dominant vertices inside beyond .00001 tolerance; its largest per-hand nearest-plane statistic was approximately .0131. This is not a continuous-time or whole-mesh proof, and does not cover nonzero-angle triangles, real boulder geometry, realistic hand orientation or moving ground. The model remains an unintegrated candidate, not approved L2.

## 2026-11-16 - Candidate rotating hand triangle audit

- Extended the reproducible contact audit with optional convex clipping of selected deformed hand triangles at each sampled angle. The initial 201-angle audit found four angles with triangle intersections despite no selected vertices inside; increased both hand offsets by .003 at the two corresponding calibration indices.
- Verification: 115 Node tests pass, now including triangle clipping at 41 angles. A separate 401-angle audit checked 3,388 selected triangles at each angle and found no interior intersections beyond .00001 tolerance; the largest per-hand nearest-plane statistic was about .0134. This is sampled and excludes other body triangles, unsampled motion, the irregular production rock and moving ground. The candidate remains isolated and is not approved L2.

### 2026-11-16 — Sisyphus candidate garment

In the isolated character evaluation, replaced the temporary cylindrical garment with a procedurally shaped pleated skirt, belt, knot and tie. Corrected the knot and tie material and visually checked the preview. The garment follows the pelvis rigidly; deformation and intersections are unverified. The character and test rock are not integrated into the application, and this is not an L2 acceptance. `npm test`: 115 passed, 0 failed; the suite does not assess the garment.

### 2026-11-16 — Sisyphus production figure torso

Replaced the original cloth-colored cylindrical torso in the application scene with a forward-leaning skin-colored torso and a separate cloth sash, inspired by the concept image. Visually inspected the live development scene. The figure, hands, legs and drape remain simplified; the isolated rig candidate is not integrated, and this change does not establish L2. `npm test`: 115 passed; `npm run build`: passed with the existing chunk-size warning.

### 2026-11-16 — Sisyphus path edging

Replaced the widely spaced elevated blocks with shared-geometry stones sampled along the outer path curve and embedded close to the analytic slope. The front section reads as a continuous low edging in the development preview; portions remain hidden by terrain, and it is not the tall retaining wall shown in the concept. A focused test checks the block vertices remain within 0.031 units above the analytic ground, not full moving-object collision or visual coverage. `npm test`: 116 passed; `npm run build`: passed with the existing chunk-size warning. The scene remains below L2.

### 2026-11-16 — Sisyphus path surface

Widened the path from 0.86 to 1.8 units, subdivided its contact mesh across the width, added restrained earth color variation, and moved the low stone edging to the new outer edge. The development preview shows the broader path but also a conspicuous abrupt boundary with the conical hill; it is not yet a natural cut road or the concept-image retaining wall. Existing sampled tests for boulder and foot contact pass, but do not cover every animation instant or collisions with all scenery. `npm test`: 116 passed; `npm run build`: passed with the existing bundle-size warning. Scene remains below L2.

### 2026-11-16 — Sisyphus olive tree

Replaced the three-lobed generic tree in the production scene with a forked trunk, eleven small branches and instanced leaf sprays, positioned at the outer edge where it is visible from the default view. A focused test checks the root elevation, sampled distance from the tree center to the route, and leaf geometry disposal; it does not establish full canopy collision clearance. The tree remains stylized and partially occluded by nearby rocks. `npm test`: 117 passed; `npm run build`: passed with the existing chunk-size warning. This is incremental scene work, not L2 acceptance.

### 2026-11-16 — Sisyphus retaining wall and shoulder

Added a two-course stone wall outside a sampled exclusion corridor and extended the actual path contact mesh into a sloped shoulder to meet it. The former low edging was removed because it would sit in the widened roadway. The outer shoulder narrows near the base edge. Visual inspection shows a more connected wall, but its end sections and the large, smooth road/hill junction remain unfinished compared with the concept; some scenery overlaps have not been assessed. A test checks wall vertices against 121 route samples, not complete animated mesh collision. Existing sampled loaded-boulder and foot surface tests pass. `npm test`: 117 passed; `npm run build`: passed with the existing bundle-size warning. Not an L2 acceptance.

### 2026-11-16 — Sisyphus hill ridges

Subdivided the hill mesh and raised procedural ridges outside the motion corridor while preserving the analytic ground close to the route. The default-view inspection shows a subtle change; the mountain still reads as a cone and remains far from the reference. A raycast sample observed a ridge approximately 0.56 units above the analytic hill and no positive intrusion at the tested points 1.5 units from the route; this is not a continuous or full-mesh collision proof. The denser hill increases the cost of the raycast-heavy contact test. `npm test`: 118 passed; `npm run build`: passed with the existing bundle-size warning. This is not L2 acceptance.

### 2026-11-16 — Sisyphus segmented limbs

Replaced straight single-cylinder arms and legs in the application scene with upper/lower segments and elbow/knee joints. Each follows the existing hand target or grounded foot endpoint; the joint bend is a procedural approximation, not a skinned anatomical rig. A new test verifies the segment endpoints remain connected at 20 sampled ascent positions, and existing sampled hand/foot contact checks still pass. The default view was inspected; the pose and figure remain visibly stylized and substantially below the reference. `npm test`: 119 passed; `npm run build`: passed with the existing chunk-size warning. No L2 acceptance claimed.

### 2026-11-16 — Panopticon observation tower

Added window mullions and sills, cornice brackets, a roof finial and a warm tiled-roof color to the production observation tower. The window faces remain opaque to retain the scene's uncertainty about observation. Inspected the default browser view; cell architecture, materials and reference-level detail remain unfinished. Existing interaction and geometry tests passed as part of `npm test` (119 passed); `npm run build` passed with the existing chunk-size warning. No L2 acceptance claimed.

### 2026-11-16 — Panopticon entrance

Converted one front bay into an arched entrance with two open barred gate leaves and a threshold aligned with the courtyard, leaving 19 ground-level cells and 20 upper cutaway cells. The default browser view was inspected. A focused test checks the threshold height and a single central ray through the open gates; it is not a full accessibility or collision assessment. Cell fronts, rear galleries and beam interaction pass existing tests. `npm test`: 120 passed; `npm run build`: passed with the existing chunk-size warning. The building remains a stylized in-progress interpretation, not approved L2.

### 2026-11-16 — Panopticon exterior arches

Replaced the rectangular outer window heads with shared extruded masonry spandrels, arched trim and appropriately shortened side bars. This modifies the opening geometry rather than only drawing an arch over a rectangle. Three local ray samples check masonry and opening positions, and the default view was visually inspected. The scene still lacks reference-level architectural and material detail. `npm test`: 121 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Panopticon cell interiors

Added warm-colored interior side linings and a separate blanket to each cell, with shared geometry across cloned tiers. Shifted the bed slightly so it clears the lining. Tests check blanket-to-mattress contact and the bed's lateral clearance in each cell; a default and zoomed browser view were inspected, where the bars and tower still obscure much of the interior. Lighting and architectural fidelity remain below the concept. `npm test`: 122 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Cave props and silhouettes

Reworked the cave's second and third wall silhouettes into a horse and a round object, and added a horse-shaped extruded prop with its own supported pedestal. The horse prop shares its outline with the drawn wall silhouette, but the silhouettes remain fixed illustrative geometry, not physically projected shadows. A focused test checks prop support and departure-route clearance at sampled positions; the browser view was inspected. `npm test`: 123 passed; `npm run build`: passed with the existing chunk-size warning. Cave architecture, figures, lighting and material fidelity remain well below the reference; this is not L2 acceptance.

### 2026-11-16 — Cave local lighting

Added an animated warm point light near the fire and a separate daylight point light that strengthens with the existing control. The sun now owns its material rather than sharing the props' gold material; previously changing its emissive value also affected the props. Inspected default and maximum slider views and verified the light values, material independence and scene cleanup in a focused test. Point lights do not cast dynamic shadows and wall silhouettes remain illustrative; visual fidelity still falls short of the concept. `npm test`: 124 passed; `npm run build`: passed with the existing bundle-size warning. Not L2 acceptance.

### 2026-11-16 — Cave side wall

Added a grounded left return wall connected to the overhang and five faceted rock forms to give the cave cutaway depth. The default browser view keeps the prisoners and silhouettes visible; a bounding-box check confirms the wall and facets do not intersect the two stationary prisoners or silhouettes. This is not a complete occlusion audit from all orbit angles. The cave still lacks the reference's organic full roof, figures and material detail. `npm test`: 125 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Cave restraints

Added seated hands, metal anchor plates and cuffs, and extended each chain to the corresponding seated hand using shared link geometry. The freed person's chain and cuff remain at the original anchor when the figure leaves; this is a fixed illustrative pose, not a simulated falling chain. A focused test checks initial cuff-to-hand positions and neighboring link-center spacing, as well as the fixed loose cuff; it does not prove physical interlocking or collision freedom. Inspected a zoomed browser view. `npm test`: 126 passed; `npm run build`: passed with the existing bundle-size warning. The figures and scene remain below the concept's fidelity and are not L2 accepted.

### 2026-11-16 — Released cave restraint

The freed figure's cuff and chain now interpolate downward as the control passes the release point; the first link stays fixed at the anchor and the cuff ends at the cave floor. This replaces the previous fixed airborne cuff. A 21-value sample checks neighboring link-center distance, floor clearance and the final cuff height; it is an authored animation, not rigid-body chain physics. A zoomed development view was inspected. `npm test`: 126 passed; `npm run build`: passed with the existing chunk-size warning. The scene remains below L2.

### 2026-11-16 — Ship water surface

Replaced the flat water top and circular arcs with a shallow triangulated wave surface and short pale crests; the hull footprint stays level to retain the existing rest contact. During visual inspection, dense stripes remained after lowering the backing cylinder; disabling the water surface's own shadow casting removed the self-shadow artifact while allowing it to receive the ship's shadow. Tests check sampled central level, outer height variation, clearance from the water base, no sea self-shadow and prior hull behavior. The sea is static and still much simpler than the reference. `npm test`: 127 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Ship deck cargo

Rebuilt the barrel as a single ship-attached assembly with fitted hoops and a lid, and added crate braces. Corrected the barrel and crate bottoms and the rope coils to meet the deck, and moved a coil that previously occupied the crate's position. A rest-pose bounding-box check verifies deck contact and pairwise clearance for the barrel, crate and two coils; it does not cover every other fixture or rocking collision. Inspected a zoomed browser view. `npm test`: 128 passed; `npm run build`: passed with the existing bundle-size warning. Ship proportions, materials and sea remain below the concept's fidelity and are not L2 accepted.

### 2026-11-16 — Ship hull depth

Deepened the hull 40% above its fixed waterline, stretched the independent plank skins and their attached fasteners, reshaped the end timbers, and lifted the deck, sail and both supplemental detail groups together. The default browser view shows a fuller hull. Existing tests retain all 60 independent replacement boards, rocking behavior and rest waterline; a new rest-pose check verifies the hull/deck overlap and yard/sail alignment. This is not an all-angle watertightness or motion-intersection audit; sail, wood and sea remain below the concept's fidelity. `npm test`: 129 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Ship sail shape

Reshaped the sail with a curved raised foot and tapered lower corners, increased the resolution of its green border bands, updated seams to follow the new surface and added seven yard lashings. A test checks the foot shape and lashing positions on the yard axis at two rocking positions; visual inspection used a zoomed browser view. The sail remains a static stylized mesh, not simulated cloth, and other scene details remain below the reference. `npm test`: 130 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Veil figures

Added eyes, varied hair colors, belts, robe folds and shoes to the six existing figures, then recalculated each figure's platform contact. A focused test verifies details are present and shoes meet the podium tops; a zoomed development view was inspected. Figures remain low-poly and share a common body and pose, far from the concept's individually modeled people. `npm test`: 131 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Veil figure gestures

Gave the six figures distinct static arm gestures while preserving their inward orientation and existing podium placement. A test verifies six distinct hand-position pairs and that each arm terminates at its hand; the existing platform contact and curtain tests still pass. A zoomed browser view was inspected. These remain simplified single-segment arms and common low-poly bodies, with no detailed anatomy or full collision audit. `npm test`: 132 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Veil fabric seams

Added restrained billowing curvature and twelve translucent seams that follow the curtain and hem as it rises, and disabled the transparent curtain's opaque shadow casting. Browser inspection covered control values 0 and 1. A focused test checks a seam's top and hem alignment at both endpoints and opacity response; it does not prove collision clearance at every control value or orbit angle. The curtain remains a scaled cylindrical mesh rather than the concept's fully draped fabric. `npm test`: 133 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Trolley garden architecture

Added a small stone arch, paving and a bench outside the track area, inspired by the concept image. The default view was inspected; the bench is partly obscured by figures and the landscape remains substantially simpler than the reference. A focused bounding-box test checks the fixtures against the stationary figures and the tram at 50 samples per branch; it does not prove continuous motion clearance or cover all scenery. `npm test`: 134 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Trolley arched windows

Replaced the six rectangular side panes with arched shape geometry, matching wooden arches, jambs and sills. The panes remain opaque stylized surfaces, not an interior cabin. A focused test checks the arch silhouette with two rays and verifies the window assembly travels with the cart; existing rail, lever and figure tests pass. A zoomed browser view was inspected. `npm test`: 135 passed; `npm run build`: passed with the existing bundle-size warning. Vehicle, figures and setting remain below the concept's fidelity; no L2 acceptance claimed.

### 2026-11-16 — Trolley figures

Added eyes, noses, varied hair colors, belts and shoes to the five-person group and single figure. Their positions and five-versus-one grouping are unchanged. A focused test checks shoe bottoms at sleeper height, and existing track and collision checks still pass. Inspected a zoomed browser view; the figures still share simple body and pose geometry and remain below the concept's realism. `npm test`: 136 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Vat brain proportions and electrodes

Enlarged the brain within the tank, replaced the regular cross-grid with rounded irregular fold loops, repositioned four internal electrodes and leads on the upper lobes, shortened the diffuser stream and moved perimeter bubbles outward. A raycast test checks electrode bottoms against lobe surfaces, and an 80-time sample checks perimeter bubbles against inflated approximate lobe volumes; these do not establish anatomical accuracy or exact mesh collision freedom. Browser views were inspected. `npm test`: 137 passed; `npm run build`: passed with the existing bundle-size warning. Brain detail, container, environment and materials remain stylized and below the concept; no L2 acceptance claimed.

### 2026-11-16 — Vat floor and rug

Added a flat semicircular rug with curved trim and radial stone paving joints to the laboratory floor. Raised the console slightly so its legs meet the floor/rug surface. Browser inspection confirms the added floor pattern is visible; a test checks the rug clears the pedestal radius and console legs meet the rug elevation. The pattern is stylized flat geometry, and the material and overall scene remain below reference fidelity. `npm test`: 138 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Vat bookcase and arch

Moved the existing bookcase and background arch to a more visible position beside the tank, aligned the bookcase and its books with their supports, and added a small armillary ornament. The default browser view shows the bookcase clearly; a focused check verifies its floor contact, book support heights and bounding-box clearance from the tank. The ornament and architecture remain stylized, and the arrangement is not a historical reconstruction. `npm test`: 139 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Free-will approach markers

Added three low stone medallions with sun, wave and leaf motifs along the common approach, inspired by the concept image; the icons do not label the two paths or assert a philosophical position. Browser inspection confirmed the markers are visible. A test checks their contact with the approach and bounding-box clearance from the moving figure at 21 control samples, not continuous collision. `npm test`: 140 passed; `npm run build`: passed with the existing bundle-size warning. Figures, path surfaces and landscape remain below reference fidelity; no L2 acceptance claimed.

### 2026-11-16 — Free-will figure

Replaced the conical cloak with a folded, draped mesh; added a sash, belt, brooch, eyes, shoes and a raised-hand gesture. The figure stays on the existing selected path. A focused test checks hand/arm attachment and shoe height at five control values; the browser view was inspected. The body and gesture remain simplified low-poly geometry, and this does not establish anatomical realism or L2 completion. `npm test`: 141 passed; `npm run build`: passed with the existing bundle-size warning.

### 2026-11-16 — Free-will path sides

Added low side faces from the branch path edges to the ground, beginning beyond the shared junction, to give the paths visible thickness. A focused test checks their top and bottom elevations and sampled horizontal clearance from the figure centerline; it is not a complete swept-volume collision test. The default browser view was inspected. `npm test`: 142 passed; `npm run build`: passed with the existing bundle-size warning. The scene remains below reference fidelity and is not L2 accepted.

### 2026-11-16 — Chinese room composition

Turned the room toward the default camera and moved the operator and chair behind the desk, facing the rulebook and open side; added simple facial details. The default browser view shows the desk and both card openings. Passage checks now compare bounds in room-local coordinates so rotating the room does not cause world-axis bounding-box false positives; operator direction and floor contact checks also pass. `npm test`: 142 passed; `npm run build`: passed with the existing bundle-size warning. The room and figure remain stylized and below the concept reference; no L2 acceptance claimed.

### 2026-11-16 — Chinese room work surface

Expanded the desk, grounded its legs, and added a hanging runner, three symbol cards, a stack of blank cards, an inkwell and quill, based on the concept image. Browser inspection shows the work surface and both trays in the default view. A focused test checks support heights and tabletop clearance from the trays; the existing sampled card-passage checks still pass. `npm test`: 143 passed; `npm run build`: passed with the existing bundle-size warning. Geometry and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Chinese room stonework and plant

Added shallow stone arch reliefs and masonry joints to both slot walls, corner piers and a potted plant on the bookcase. Browser inspection shows the plant and wall detailing in the default view. The existing card-passage test now checks bounding-box clearance from the arches at 21 control values; it does not establish continuous collision clearance. `npm test`: 143 passed; `npm run build`: passed with the existing bundle-size warning. The architecture, vegetation and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Chinese room operator gesture

Rebuilt the operator's arms as connected upper arms and forearms, with one hand near the chin and the other holding a symbol card; added a mantle, clasp and side locks. A zoomed browser view shows the pose and card. A focused test checks forearm endpoints meet the hands and that the card reaches the holding hand; existing card-passage checks remain green. `npm test`: 144 passed; `npm run build`: passed with the existing bundle-size warning. The person remains simplified relative to the reference, and no L2 acceptance is claimed.

### 2026-11-16 — Socratic shared question

Added a cloud-shaped shared question above the two seated participants, following the concept image while retaining the existing individually responsive dialogue bubbles and gestures. The default browser view was inspected. A focused bounding-box check verifies separation from both people and their cues at three slider positions; it does not cover all viewpoints or continuous motion. `npm test`: 145 passed; `npm run build`: passed with the existing bundle-size warning. The figures, furnishings, setting and materials remain simplified compared with the reference; no L2 acceptance claimed.

### 2026-11-16 — Socratic composition and furnishings

Rotated the diorama toward the default camera so both interlocutors and background furnishings read more evenly; kept the shared question aligned with that view. Added foliage across the arch and varied book heights with spine bands. Browser inspection covered the default and zoomed views; a focused test checks that all 15 books rest on their shelves, and existing dialogue checks remain green. `npm test`: 146 passed; `npm run build`: passed with the existing bundle-size warning. The model remains visibly simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Socratic dialogue gestures

Rebuilt both participants' arms with connected upper arms, forearms and hands, and gave one participant a hand-to-chin listening pose while preserving the slider-driven gesture. Added simple noses. A zoomed browser view shows the figures and pose; a focused test verifies hand-to-forearm attachment at five slider values. `npm test`: 147 passed; `npm run build`: passed with the existing bundle-size warning. The figures remain stylized and below reference fidelity; no L2 acceptance claimed.

### 2026-11-16 — Newcomb front composition

Rotated the scene toward the default camera to show both boxes and choice plaques together, added a latch to the transparent box, arch foliage and a foreground runner. Browser inspection covered the default view; a focused test checks that the runner rests on the lower floor and clears the dais. Existing tests verify box opacity, selection behavior and coin support. `npm test`: 148 passed; `npm run build`: passed with the existing bundle-size warning. Materials, sculpture and furnishings remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Recurrence traveler

Replaced the traveler's conical cape with a folded mesh and added a satchel strap, clasp, shoes, eyes and side hair. A zoomed browser view was inspected. Existing tests sample the circular trajectory and obstacle clearance, and a new test checks both shoes at path height at 25 positions. The figure still moves as a rigid pose rather than walking, and the scene remains simplified relative to the concept. `npm test`: 149 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Recurrence stride

Added a slider-driven alternating leg stride with a raised swing foot and a planted foot, repeating eight times around the loop. The gait returns to its initial pose at the cycle boundary; it is schematic and does not lock the planted foot in world space. A browser view at an intermediate slider value was inspected. A test samples 129 slider positions for ground height and gait closure; existing sampled obstacle checks still pass. `npm test`: 149 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Butterfly dream composition

Rotated the diorama toward the default camera, added translucent dream trails between the sleeper and the mountain frame, and expanded the blossoms on the grove. The default browser view was inspected. Furnishing and butterfly clearance tests now compare room-local bounding boxes so the scene rotation does not produce false positives; the tests sample animation times and values rather than continuous motion. `npm test`: 149 passed; `npm run build`: passed with the existing bundle-size warning. The sleeper, tree, landscape and dream effect remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Infinite monkey composition

Turned the study to show the monkey's profile and the keyboard, then reoriented and repositioned the arch and infinity sign toward the same default view. Added a typewriter carriage lever. Browser inspection covered the revised composition; a local-coordinate bounding-box test samples lever clearance from the hands, while the existing test checks contact with depressed keys. `npm test`: 150 passed; `npm run build`: passed with the existing bundle-size warning. The figure, machine and setting remain stylized and below the concept reference; no L2 acceptance claimed.

### 2026-11-16 — Language-wall workspaces

Added a pencil cup and pencils to the describer's worktable and a mallet to the receiver's worktable as fixed props. A focused test checks that the props meet their table height and clear the message tray. In the browser, revising the description and building produced the corresponding blue-roof result. `npm test`: 151 passed; `npm run build`: passed with the existing bundle-size warning. People, furnishings and materials remain simplified compared with the concept; no L2 acceptance claimed.

### 2026-11-16 — Pigeon feeder and enclosure

Added a tapered hopper between the fixed storage and outlet, plus translucent side panes on the chamber. A focused geometry test checks the hopper/outlet alignment and their height above the tray. Browser interaction confirmed that one behavior and three five-second intervals yield one delivery; the existing state tests check the timer and reward separately from behavior. `npm test`: 152 passed; `npm run build`: passed with the existing bundle-size warning. The bird, enclosure and apparatus remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Induction day markers

Added rounded stone-framed crowns to all six day markers, following the concept, and synchronized each crown's color with its underlying sign so the final counterexample remains coherent. The initial scene was inspected in the browser; advancing six days showed five feedings and the counterexample. The existing state test now checks the crown colors at every step. `npm test`: 152 passed; `npm run build`: passed with the existing bundle-size warning. The chicken and garden remain simplified compared with the concept; no L2 acceptance claimed.

### 2026-11-16 — Ratio apparatus trim

Added inset arch trim and stone courses to the two mode cabinets and a frame around the shared response display, without adding independent progress indicators. Browser interaction confirmed that ten FR responses yield one reward; existing tests cover mode changes, progress markers and rewards. `npm test`: 152 passed; `npm run build`: passed with the existing bundle-size warning. Apparatus and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Choice study supply shelf

Added a fixed laboratory supply shelf behind the enclosure with books, a flask and a potted plant; these are scenery rather than response data. A focused test checks the shelf stays behind the enclosure and clear of the animal, and that the vessels rest on its top. Browser interaction confirmed one food choice and one stimulation choice leave a budget of eight in the initial condition. `npm test`: 153 passed; `npm run build`: passed with the existing bundle-size warning. The animal, apparatus and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Twin urban environment

Added striped awning fabric and balcony planters to the urban home as children of its switchable model. A focused test checks planter support and that the full home follows the environment toggle; browser interaction confirmed the different-environment state and updated synthetic count. `npm test`: 154 passed; `npm run build`: passed with the existing bundle-size warning. The people and environments remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Argument tabletop details

Added base rings to the opposing game pieces and a pair of pencils to the shared drawing. Each belongs to its corresponding state-controlled group. Browser interaction confirmed switching to the shared-drawing frame; the existing tests verify both groups and example details toggle as intended. `npm test`: 154 passed; `npm run build`: passed with the existing bundle-size warning. The figures and setting remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Time garden border

Added flowering plants outside the cultivated bed as fixed garden-border scenery. A focused test checks their clearance from the bed, their visibility in planted and fallow examples, and their absence in the money frame. Browser interaction confirmed the switch to the garden frame. `npm test`: 155 passed; `npm run build`: passed with the existing bundle-size warning. The gardener, landscaping and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Orientation pavilion

Added column bases, capitals and concentric dome courses to the upper pavilion. A focused bounding-box test verifies the additions clear the route marker in all four frame/example combinations. Browser interaction confirmed the down-direction text; existing tests check the marker follows the selected path. `npm test`: 156 passed; `npm run build`: passed with the existing bundle-size warning. Landscape and architecture remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Sisyphus draped garment

Replaced the cylindrical skirt with a folded, uneven-hem mesh attached to the existing pushing figure. Inspected the default browser view; existing sampled tests for limb joins and boulder/ground contact still pass. The mesh does not establish anatomical realism or full garment collision freedom, and the scene remains below the reference. `npm test`: 156 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Panopticon window and roof courses

Added horizontal crossbars to each cell's outer window and three courses to the central tower roof. Browser inspection covered the default view; a focused test verifies crossbars remain within the openings on all 39 cells and upper tiers, while existing entrance and light controls still pass. `npm test`: 157 passed; `npm run build`: passed with the existing bundle-size warning. The model and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Cave overhead rock facets

Added faceted stones along the existing overhang to give the cave roof additional depth. Browser inspection covered the default view; a focused height check confirms the facets remain above all three wall silhouettes, and existing departure and light tests pass. The facets are decorative geometry rather than a continuous geological surface, and the cave remains simplified compared with the concept. `npm test`: 158 passed; `npm run build`: passed with the existing bundle-size warning. No L2 acceptance claimed.

### 2026-11-16 — Ship cargo fittings

Added handles to the amphora, tapered stave seams to the barrel and front joints to the crate; all are attached to the moving hull or cargo groups. Inspected the default browser view. Existing tests check cargo support and separation, hull rocking and all replacement-board states. `npm test`: 158 passed; `npm run build`: passed with the existing bundle-size warning. The ship and water remain stylized and below the concept reference; no L2 acceptance claimed.

### 2026-11-16 — Veil post bases

Added small gold bases and collars to the twelve curtain support posts. A focused test checks that the bases meet the floor and remain radially outside the podium caps; the browser view at a raised veil and existing curtain/figure checks were inspected. `npm test`: 159 passed; `npm run build`: passed with the existing bundle-size warning. Figures and architectural detail remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Trolley roof and headlight

Added curved seams over the tram roof and a rim around its front lamp, attached to the moving cart. Inspected the default browser view; the existing trolley tests verify both bogies follow the chosen track and now check that the added parts belong to the cart. `npm test`: 159 passed; `npm run build`: passed with the existing bundle-size warning. The tram, figures and landscape remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Vat console cabinet

Added an equipment cabinet with ventilation strips and fasteners beneath the console. Inspected the default browser view; a focused test verifies that the cabinet meets the floor and clears the table legs, while existing signal and waveform tests pass. `npm test`: 160 passed; `npm run build`: passed with the existing bundle-size warning. The laboratory and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Free-will meadow and vines

Added flowering meadow clumps and climbing stems with leaves to both arches, referencing the garden setting. Inspected the default browser view; a focused test checks plant placement against the approach and sampled branch centerlines, and existing figure-path tests pass. `npm test`: 161 passed; `npm run build`: passed with the existing bundle-size warning. The landscape, figure and materials remain simplified compared with the concept; no L2 acceptance claimed.

### 2026-11-16 — Chinese-room interior fittings

Added a geometric wall hanging, desk aprons and feet, and staggered floorboard joints. Inspected the default browser view; the hanging is mostly obscured at that angle. A focused test checks clearance from the moving cards and chair feet, and the existing slot-passage tests pass. `npm test`: 162 passed; `npm run build`: passed with the existing bundle-size warning. The architecture, figure, book and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Socratic figures and dialogue motifs

Added folded lap cloth and upholstered chair backs for both participants; replaced the two identical question marks with scales and a branching tree inspired by the concept. Inspected the default browser view; the motifs are small at that scale. A focused check verifies the cloth hem clears the carpet and shoes, and existing dialogue and arm-attachment checks pass. `npm test`: 163 passed; `npm run build`: passed with the existing bundle-size warning. Figures, architecture and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Newcomb arch construction

Rebuilt the background arch supports as round shafts with grounded bases, capitals and stone courses, and added joints along the arch face; adjusted the existing fabric and leaves to follow its raised curve. Inspected the default browser view. A focused test checks the column bases and box clearance; the existing tests verify the opaque box remains closed and the selection feedback works. `npm test`: 164 passed; `npm run build`: passed with the existing bundle-size warning. The arch, observer, textiles and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Recurrence reading moment

Added a seated reader and open book on the outer verge as a second moment in the cycle, and cleared nearby decorative stones and plants. Inspected the default browser view; the new moment is small at the default scale. A sampled full-cycle test checks the reader clears the walking traveler and rests on the ground; existing gait and path tests pass. `npm test`: 165 passed; `npm run build`: passed with the existing bundle-size warning. The figures and surrounding vignettes remain simplified compared with the concept; no L2 acceptance claimed.

### 2026-11-16 — Butterfly dream sleeper

Replaced the sleeper's rectangular torso and legs with rounded volumes and added edging following the shaped cover. Inspected the default browser view; existing tests check the sleeper's proximity to the mat and sampled separation from the butterfly and tea table. `npm test`: 165 passed; `npm run build`: passed with the existing bundle-size warning. The face, anatomy, fabric and landscape remain substantially simplified compared with the concept; no L2 acceptance claimed.

### 2026-11-16 — Monkey typewriter body and output

Replaced the rectangular typewriter base with a chamfered, beveled shell, and replaced solid page lines with abstract individual marks while preserving the sequence control. Inspected the default browser view, where the page is mostly edge-on; existing tests verify the active hand and key alignment and sequence response. `npm test`: 165 passed; `npm run build`: passed with the existing bundle-size warning. The monkey, mechanism and room remain simplified compared with the concept; no L2 acceptance claimed.

### 2026-11-16 — Language-wall house details

Added chimneys, door surrounds, steps and window sills to both miniature houses. The additions are children of each house so they follow visibility and position changes; a focused test covers the chimney's state behavior. Browser interaction confirmed a reconstructed house appears after building. `npm test`: 166 passed; `npm run build`: passed with the existing bundle-size warning. The people, workspaces and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Pigeon plumage

Added overlapping flight and neck feathers to the bird, attached to its existing behavior-controlled group. Inspected the default browser view; details are small at that scale. A focused test checks the new feathers move with the bird; existing tests check that food delivery depends on elapsed intervals rather than behavior. `npm test`: 167 passed; `npm run build`: passed with the existing bundle-size warning. Bird anatomy, enclosure and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Induction shelter

Replaced the flat-front shelter block with side walls, a recessed back, nesting floor and straw. Inspected the default browser view; the shelter is partly obscured by the chicken at this angle. A ray test confirms the opening is clear to the back wall; existing tests cover the five feedings and subsequent counterexample. `npm test`: 168 passed; `npm run build`: passed with the existing bundle-size warning. The chicken, farm and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Ratio cabinet ledges

Added wooden ledges, plank joints and end caps to both schedule cabinets as fixed structural details. Inspected the default browser view; a focused test checks the ledges meet their bases and clear the shared progress display, and existing tests cover response and reward states. `npm test`: 169 passed; `npm run build`: passed with the existing bundle-size warning. Cabinet mechanisms and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Choice-study recorder housing

Replaced the solid recorder face with a recessed housing around the blank roll. A ray test checks that the roll is visible through the opening and remains unmarked; existing tests continue to verify the visitor-choice counters and budget. Browser inspection showed the recorder at the edge of the scene. `npm test`: 170 passed; `npm run build`: passed with the existing bundle-size warning. The animal, apparatus and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Twin-study urban storey

Raised the urban home's facade and roof and added upper-storey windows, making the different-home condition more legible. Browser interaction confirmed the environment contrast shows the urban model; a focused test checks its upper windows follow that state. `npm test`: 171 passed; `npm run build`: passed with the existing bundle-size warning. The homes, people and landscaping remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Argument participants' drapery

Added folded cloth over each seated participant's knees in the shared scene. Inspected the default browser view; a focused test checks the hems clear the shoes and tabletop in both frames, and existing frame-switch and arm-attachment tests pass. `npm test`: 172 passed; `npm run build`: passed with the existing bundle-size warning. The figures, setting and materials remain simplified compared with the concept; no L2 acceptance claimed.

### 2026-11-16 — Time garden orchard tree

Added a fruit tree outside the cultivation bed, visible in the garden frame for both planted and fallow examples. Browser interaction confirmed the tree appears in the garden; a focused test checks frame visibility and bed clearance. `npm test`: 173 passed; `npm run build`: passed with the existing bundle-size warning. The gardener, landscape and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Orientation pavilion evergreens

Added three slender evergreens behind the pavilion. Inspected the default browser view, where some trees are partly hidden by the pavilion; a focused test checks they meet the ground and clear the route indicator in both directions and examples. `npm test`: 174 passed; `npm run build`: passed with the existing bundle-size warning. Terrain, figure and architectural detail remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Sisyphus shoulder mantle

Added folded cloth connecting the figure's shoulder and waist as part of the moving figure. Inspected the default browser view; existing sampled tests check boulder and foot contact with the rendered terrain and connected limbs. `npm test`: 174 passed; `npm run build`: passed with the existing bundle-size warning. The broad route, mountain shape and figure remain substantially different from the reference; no L2 acceptance claimed.

### 2026-11-16 — Sisyphus road shoulder

Tested a narrower road, but browser inspection showed a gap to the existing retaining wall, so restored the previous width. Blended the road edges toward the surrounding earth color while keeping the contact geometry intact. `npm test`: 174 passed; `npm run build`: passed with the existing bundle-size warning. Matching the reference's narrower winding road requires coordinated redesign of the route, retaining wall and motion corridor; no L2 acceptance claimed.

### 2026-11-16 — Panopticon lower tower windows

Replaced the flat-topped lower tower window cues with arched shapes and added mullions and crossbars. Inspected the default browser view; a focused test checks the eight cues remain below the observation level, and existing beam and cell tests pass. The tower core remains opaque. `npm test`: 175 passed; `npm run build`: passed with the existing bundle-size warning. Interior construction, materials and lighting remain simplified compared with the concept; no L2 acceptance claimed.

### 2026-11-16 — Cave prop wall

Added a grounded masonry platform under the two silhouette props, with a thin support below the horse pedestal and visible joints. Inspected the default browser view; a focused test verifies support and sampled clearance from the departing person, while existing light and restraint tests pass. `npm test`: 176 passed; `npm run build`: passed with the existing bundle-size warning. The cave volume, figures and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Ship sail sheets

Added sheets connecting both lower sail corners to deck cleats. Inspected the default browser view; a focused test checks both endpoints remain attached as the hull rocks, and existing replacement-panel tests pass. `npm test`: 177 passed; `npm run build`: passed with the existing bundle-size warning. Hull form, water and material detail remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Veil figure mantles

Added folded shoulder mantles to the six figures. Inspected the default browser view; a focused test checks the mantles remain over their podiums throughout curtain positions, and existing gesture and curtain tests pass. `npm test`: 178 passed; `npm run build`: passed with the existing bundle-size warning. The figures, architecture and fabric remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Trolley switch housing

Added a grounded base, curved guard and fasteners around the existing moving switch lever. Inspected the default browser view; a focused test samples both branches to check clearance from the tram, while existing track-following tests pass. `npm test`: 179 passed; `npm run build`: passed with the existing bundle-size warning. The tram, figures and landscape remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Vat rear brain form

Added a small folded rear lobe to the brain illustration. Inspected the default browser view, where it is mostly hidden behind the main lobes; a sampled test checks the added form stays inside the vessel and clears the bubbles. Existing electrode, signal and waveform checks pass. `npm test`: 180 passed; `npm run build`: passed with the existing bundle-size warning. The brain, vessel and laboratory remain stylized and below the reference; no L2 acceptance claimed.

### 2026-11-16 — Scene review layout

Constrained the desktop scene panel to the viewport and made it sticky so a long study description no longer stretches the canvas and pushes the model below the first screen. Adjusted the narrow-screen camera framing. Browser checks on the choice-study scene covered desktop first view, scrolling and a choice action, plus a 390×844 mobile view; other scenes and devices were not individually checked. `npm test`: 180 passed; `npm run build`: passed with the existing bundle-size warning. This improves reviewability, not model maturity; no L2 acceptance claimed.

### 2026-11-16 — Free-will rear hill

Added a low, continuous rear hill with embedded stones and excluded existing ground decorations from its footprint. Inspected the default browser view; a focused test checks its edge meets the lawn and samples clearance from the moving figure. `npm test`: 181 passed; `npm run build`: passed with the existing bundle-size warning. The hill and other landscape features remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Chinese-room open rulebook

Rebuilt the rulebook with a grounded cover, gutter and curved page surfaces, preserving abstract symbols. Inspected the default browser view; the curvature is subtle at that scale. A focused test checks the book is supported and clears both moving cards. `npm test`: 182 passed; `npm run build`: passed with the existing bundle-size warning. The book, figure and room remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Socratic stone backdrop

Added a grounded masonry backdrop between the existing arch and bookcase. Inspected the default browser view; a focused test checks clearance from both participants and their dialogue cues at three control positions. `npm test`: 183 passed; `npm run build`: passed with the existing bundle-size warning. The figures, architecture and materials remain simplified relative to the concept; no L2 acceptance claimed.

### 2026-11-16 — Sisyphus mountain ribs

Reshaped and recolored the mountain surface to give the exposed area longer, broken rock ribs while fading displacement outside the motion corridor. Inspected the default browser view: the mountain remains visibly conical and the broad route does not reproduce the reference's switchbacks. The 11 Sisyphus path, support and clearance tests passed; `npm run build` passed with the existing bundle-size warning. The tests sample motion and do not establish visual L2 quality or full continuous collision clearance. A coordinated route, retaining wall and mountain redesign remains necessary; no L2 acceptance claimed.

### 2026-11-16 — Sisyphus switchback study

Built an isolated, inspectable route and hillside study with three semicircular turns, continuous tangents and block edging. The first curved-strip experiment folded on a tight bend; the retained geometry uses turns of radius .5 and a .31 half-width. Browser inspection shows the intended switchback silhouette, but its shelf-like terrain and edging are only placeholders. A focused test samples climbing and tangent continuity and checks road-triangle winding; it passed. `npm run build` passed with the existing bundle-size warning. The production boulder asset's unrotated bounds are about 1.25 by 1.27 units, wider than the study's .62-unit road, so this study is not connected to the production animation: scale, moving contact, hillside support, edging and scenery must be redesigned together. No scene has been accepted as L2 on this evidence.

### 2026-11-16 — Newcomb arch dressing

Replaced the arch's bead-like foliage with a branching stem and pointed leaves, and rebuilt the cloth as a deeper folded swath with an edged hem. The default browser view keeps both boxes and the selection display visible, although the drape and foliage remain stylized. Six Newcomb selection, grounding and clearance tests passed; `npm run build` passed with the existing bundle-size warning. Other viewpoints and the full visual match have not been reviewed, and this does not establish L2 completion.

### 2026-11-16 — Newcomb observer bust

Added a beard, hair curls, facial volume, a hand-at-chin pose and drapery folds to the stone observer. The default browser view shows the revised silhouette, but fine detail is small at that scale and remains more schematic than the concept. Seven Newcomb tests passed, including a local-coordinate bounds check against the nearby books; `npm run build` passed with the existing bundle-size warning. This check does not assess all views or the quality of the sculpture, and no L2 acceptance is claimed.

### 2026-11-16 — Ship outer waves

Increased the outer water relief and added short foam ribbons while preserving the flat contact region beneath the hull. Inspected the default browser view: the waves are more visible, although the water remains static and simpler than the concept. Eleven ship tests passed, including sampled water-height, foam-footprint and replacement-animation checks; `npm run build` passed with the existing bundle-size warning. The checks do not cover moving water or visual fidelity from all angles; no L2 acceptance is claimed.

### 2026-11-16 — Ship rocky shore

Added six waterline rocks and two small shrubs at the left of the scene, and kept the generated foam away from their centers. Inspected the default browser view; the shoreline reads as a small rock cluster and remains less detailed than the reference. Twelve ship tests passed, including conservative horizontal clearance from the hull footprint, stage bounds and shared-geometry disposal; `npm run build` passed with the existing bundle-size warning. This is not a full animated collision or multi-view visual audit, and no L2 acceptance is claimed.

### 2026-11-16 — Twin home environments

Added planted raised beds to each cottage and paving and a lantern to the alternate urban home. These details are children of their respective homes and follow the existing environment switch. Inspected both states in the browser and verified the control changes the explanatory state. Forty-nine interactive-scene tests passed, including a new figure-clearance and visibility check; `npm run build` passed with the existing bundle-size warning. The people, scenery and architecture remain stylized and do not yet match the concept's detail; no L2 acceptance is claimed.

### 2026-11-16 — Seated twin figures

Replaced the two standing cylindrical figures with seated figures, including bent arms, crossed legs, shoes and clothing. Kept one illustrative pair to match the existing interaction. Inspected the default browser view; the pose is visible but small, and the figures remain stylized. Fifty interactive-scene tests passed, including precise platform grounding and hand-to-forearm connection; `npm run build` passed with the existing bundle-size warning. Other viewpoints and full anatomical quality remain unverified; no L2 acceptance is claimed.

### 2026-11-16 — Induction hen plumage

Replaced the small tail spikes with a layered tail fan and added rows of overlapping wing feathers and eye detail to the hen. Inspected the default browser view and advanced the interaction through five feedings to the sixth-day counterexample. Fifty interactive-scene tests and the production build passed; Vite's existing bundle-size warning remains. The hen is small in the scene and still much simpler than the reference; no L2 acceptance is claimed.

### 2026-11-16 — Induction day landscapes

Added layered hill silhouettes to the five completed feeding markers and tied their visibility to the same food count as the sunrise rays. The sixth counterexample has no landscape. Checked the five-day browser state and the automated sequence through reset and the sixth day; all 50 interactive-scene tests and the production build passed, with the existing bundle-size warning. The details are small at the default view and do not establish L2 fidelity.

### 2026-11-16 — Cave wall facing

Added a shallow irregular, faceted facing to the shadow wall, placed behind the existing silhouettes. Inspected the default view and both slider endpoints: the shadows remain visible and the released figure changes position. Eleven cave tests passed, including a check that the facing is in front of the wall and behind each silhouette; `npm run build` passed with the existing bundle-size warning. The cave remains a schematic cutaway, not a full match to the reference, and no L2 acceptance is claimed.

### 2026-11-16 — Cave opening and outside view

Widened the gap between the shadow wall and the exit jamb and added a layered sky, hills and distant trees behind it. Inspected the default browser view; the landscape is now visible through the opening, though it remains a flat scenic backdrop. Twelve cave tests passed, including sampled clearance from the departing figure and the existing light, silhouette and step checks; `npm run build` passed with the existing bundle-size warning. The opening and full scene remain schematic, and no L2 acceptance is claimed.

### 2026-11-16 — Cave flame shapes

Replaced the three straight cones with five tapered, curved flame tongues while retaining the existing anchored flicker and point light. Inspected the default browser view; the flames remain stylized and small. Twelve cave tests passed, including fire clearance and light-response checks; `npm run build` passed with the existing bundle-size warning. No multi-view visual or full L2 acceptance is claimed.

### 2026-11-16 — Cave seated figures

Added a folded garment surface, lower legs and grounded feet to each seated prisoner without moving the restrained hands. Inspected the browser at the initial slider state. Twelve cave tests passed, including precise ground contact and chain-to-hand checks; `npm run build` passed with the existing bundle-size warning. The figures remain small and schematic compared with the concept, and no L2 acceptance is claimed.

### 2026-11-16 — Cave stone floor

Added irregular polygonal stone slabs nearly flush with the existing floor, replacing an initial overly regular grid after browser inspection. Thirteen cave tests passed, including slab bounds and height, figure grounding and departure clearance; `npm run build` passed with the existing bundle-size warning. The floor is a shallow visual facing rather than displaced terrain, and the scene remains below the concept's visual fidelity; no L2 acceptance is claimed.

### 2026-11-16 — Panopticon exterior piers

Added piers, bases and capitals to the outer bays, including the entry and rear upper tiers. Inspected the default view; the exterior bays now have stronger vertical divisions. Nine Panopticon tests passed, including entry passage, arched window and pier placement checks; `npm run build` passed with the existing bundle-size warning. Interior lighting, materials and overall detail still differ from the reference; no L2 acceptance is claimed.

### 2026-11-16 — Panopticon cell masonry

Added shared, nearly flush masonry joints to both interior side walls of each cell, including the cloned upper tiers. The default browser view was inspected; the details are largely obscured by the railings at that scale. Ten Panopticon tests passed, including wall-coordinate placement, bedding clearance and shared-geometry disposal; `npm run build` passed with the existing bundle-size warning. Interior visibility and fidelity remain below the reference, and no L2 acceptance is claimed.

### 2026-11-16 — Panopticon cell lighting

Added fixed warm fill lights on the rear gallery at three heights, independent of the animated observation beam. The default browser view shows warmer cell interiors, although bars and the central tower still obscure much of the detail. Eleven Panopticon tests passed, including beam-control independence; `npm run build` passed with the existing bundle-size warning. The nine additional unshadowed lights have not been profiled on mobile GPUs, and this does not establish L2 fidelity.

### 2026-11-16 — Chinese Room framing

Reduced the Chinese Room's oversized circular stage and moved its reset camera closer so the room, operator and cards occupy more of the viewport. Inspected desktop at both card endpoints and a 390×844 viewport; the stage and moving cards fit in those views. Nine Chinese Room tests passed, including sampled card bounds on the new stage; `npm run build` passed with the existing bundle-size warning. This improves reviewability rather than modeling maturity; the room and figure remain below the concept and no L2 acceptance is claimed.

### 2026-11-16 — Chinese Room window view

Added a layered sky, hills and small trees behind the open rear window. Inspected the default browser view; the landscape is visible between the arches but remains a flat scenic backdrop. Ten Chinese Room tests passed, including window depth and sampled card clearance; `npm run build` passed with the existing bundle-size warning. The overall room and figure are still less detailed than the concept and no L2 acceptance is claimed.

### 2026-11-16 — Chinese Room operator wrap

Replaced the solid shoulder ellipsoid with an open-front folded wrap and added a bun with curled sections. Inspected the default browser view; the figure remains small, and fine garment details are difficult to judge there. Ten Chinese Room tests passed, including hand-to-card and moving-card clearance checks; `npm run build` passed with the existing bundle-size warning. The figure is still stylized and no L2 acceptance is claimed.

### 2026-11-16 — Chinese Room wall crowns

Added two shallow stone crowns to the rear wall, with side coping and a central keystone. Inspected the default browser view; the upper outline is more architectural but remains simpler than the reference. Eleven Chinese Room tests passed, including window and sampled card clearance; `npm run build` passed with the existing bundle-size warning. No L2 acceptance is claimed.

### 2026-11-16 — Free-will portal alignment

Reshaped both fork curves so their ends enter the arch centers perpendicularly, and turned the arches to face the approach. Inspected the default browser view, where the portals read more clearly. Nine free-will tests passed, including the new endpoint alignment check and sampled figure and landscape clearance; `npm run build` passed with the existing bundle-size warning. The landscape, figure and portals remain stylized relative to the reference; no L2 acceptance is claimed.

### 2026-11-16 — Free-will portal bodies

Added colored side piers and an extruded arch band to each portal, retaining the inner stone frame and open passage. Inspected the default browser view. Ten free-will tests passed, including ray checks through both openings and route alignment; `npm run build` passed with the existing bundle-size warning. The scene remains stylistically simplified relative to the concept; no L2 acceptance is claimed.

### 2026-11-16 — Free-will staggered paving

Replaced full-width branch joints with staggered half-width joints and added a center seam following each curve. Inspected the default browser view. Ten free-will tests passed, covering path alignment, character support and sampled landscape clearance; `npm run build` passed with the existing bundle-size warning. The seams are shallow visual details and the full scene remains below the concept; no L2 acceptance is claimed.

### 2026-11-16 — Butterfly wing silhouette

Reshaped both wings with pointed upper tips and lower tails, and added a dark perimeter and smaller spots to the existing animated wing groups. Inspected the default browser view. Four butterfly tests passed, including mirrored movement and attachment of the new details; `npm run build` passed with the existing bundle-size warning. The insect and dream landscape remain simplified relative to the concept and no L2 acceptance is claimed.

### 2026-11-16 — Butterfly garden planting

Added instanced low rocks and leaves around the garden, plus two flowering plants away from the flight corridor. Adjusted their layout after browser inspection to reduce the initial evenly spaced perimeter. Five butterfly tests passed, including sampled clearances for the mat, table, pond and moving insect; `npm run build` passed with the existing bundle-size warning. The garden remains sparse and stylized compared with the concept; no L2 acceptance is claimed.

### 2026-11-16 — Butterfly flowering tree

Rebuilt the straight trunk as a bent, tapered sequence of branches, connected the blossom positions with smaller twigs and replaced the spherical canopy with instanced leaves. Inspected the default browser view. Five butterfly tests and the production build passed, with the existing bundle-size warning. The tree remains small and simplified relative to the concept; no L2 acceptance is claimed.

### 2026-11-16 — Butterfly reclining figure

Added a round bolster, articulated forearms and hands, and a folded shoulder drape to the reclining figure. Inspected the default browser view; the figure remains small in the overall scene. Six butterfly tests passed, including hand-to-forearm connection, bolster support and furnishing clearance; `npm run build` passed with the existing bundle-size warning. The person remains schematic compared with the concept; no L2 acceptance is claimed.

### 2026-11-16 — Butterfly dream backdrop

Added a circular gradient sky and two curved hill layers behind the existing mountains. Inspected the default browser view. Seven butterfly tests passed, including a check that the new hills stay within the sky; `npm run build` passed with the existing bundle-size warning. The backdrop remains a flat illustration and the scene is simplified relative to the concept; no L2 acceptance is claimed.

### 2026-11-16 — Butterfly bedding

Reshaped the leg covering with a raised knee, curved sides and folds, and made its borders and botanical embroidery follow the surface. Inspected the default browser view, where the reclining figure is still small. Seven butterfly tests and the production build passed; the build retains the existing bundle-size warning. The figure and bedding remain simplified compared with the concept, and this does not establish L2 completion.

### 2026-11-16 — Butterfly resting arrangement scale

Enlarged the figure, bedding and mat as one arrangement around their floor contact, and moved a nearby garden group to preserve clearance. Inspected the default browser view; the sleeper reads more clearly but remains smaller and simpler than in the concept. All 204 tests and the production build passed; the existing bundle-size warning remains. L2 completion is not claimed.

### 2026-11-16 — Monkey typing arms

Replaced each straight typing arm with connected upper and lower segments, added elbows and fingers, and retained the hand's contact with the moving key. Inspected the default browser view. Five monkey tests passed, including sampled joint continuity and key contact; the production build passed with the existing bundle-size warning. The figure is still small and schematic compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Monkey study scale

Enlarged the typing ensemble around the carpet surface to make the monkey and machine more prominent. Browser inspection showed loose papers under the enlarged carpet edge, so those pages were moved clear. Five monkey tests passed, including paper clearance and typing contact; the production build passed with the existing bundle-size warning. The subject and surrounding architecture remain schematic compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Monkey study arch

Replaced the thin arch with a solid curved lintel, column bases and flutes, and added a climbing vine with leaves. Lowered the infinity symbol to leave it visible inside the opening. Inspected the default browser view; five monkey tests and the production build passed, with the existing bundle-size warning. Materials, masonry and vegetation remain simplified compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Language wall sketches

Changed the partition to warm stone and placed a neutral house sketch on each face above the message opening. Inspected the default browser view; the partition still obscures much of the sender from this angle. All 50 interactive-scene tests and the production build passed, with the existing bundle-size warning. The illustration remains simplified compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Language wall default view

Adjusted the default camera to show both sides of the partition and cleared residual orbit damping before resetting the camera. In the browser, checked the initial view, reset after a drag, and a switch to Sisyphus. All 205 tests and the production build passed; the existing bundle-size warning remains. The participants and architecture remain simplified compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Language participants

Added bent sleeves and forearms, hands, shoes, aprons and facial details to both participants. Inspected the default browser view; the people remain small and stylized. All 51 interactive-scene tests passed, including arm connections and shoe support; the production build passed with the existing bundle-size warning. L2 completion is not claimed.

### 2026-11-16 — Pigeon chamber view

Lowered and turned the default viewpoint so the pigeon and feeder are less obscured by the roof, and moved the timer and its ring down to clear the front beam. In the browser, checked the new view and advanced three intervals to confirm one food delivery. All 51 interactive-scene tests and the production build passed, with the existing bundle-size warning. The bird and apparatus remain simplified compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Pigeon scale

Enlarged the bird around its grounded feet and shifted it slightly inward. Inspected the default browser view. All 52 interactive-scene tests passed, including chamber and feeder clearance across the three behavior poses; the production build passed with the existing bundle-size warning. The plumage and chamber materials remain simplified relative to the concept; L2 completion is not claimed.

### 2026-11-16 — Induction tree

Replaced the three spherical tree crowns with a bent trunk, branching structure and instanced foliage. Inspected the default browser view and confirmed the day markers remain visible. All 52 interactive-scene tests and the production build passed, with the existing bundle-size warning. The environment remains more schematic than the concept; L2 completion is not claimed.

### 2026-11-16 — Induction path

Extended the approach to the gate with irregular raised paving and added small grass clusters beside it. Inspected the default browser view; the path and day markers remain visible. All 52 interactive-scene tests and the production build passed, with the existing bundle-size warning. Ground detail is still sparse relative to the concept; L2 completion is not claimed.

### 2026-11-16 — Schedule cabinet fittings

Added fixed metal rails, end brackets and frame grooves to the two cabinets while retaining one shared progress display. Inspected the default browser view. All 52 interactive-scene tests passed, including clearance from the progress base; the production build passed with the existing bundle-size warning. The cabinets remain simpler than the concept; L2 completion is not claimed.

### 2026-11-16 — Choice chamber view

Adjusted the default camera to show the rat, feeder, lever and visitor-choice counters through the open front rather than mainly from above. In the browser, selected each alternative and observed both counters and the remaining budget update. All 52 interactive-scene tests and the production build passed, with the existing bundle-size warning. The scene remains simplified compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Choice-scene rat

Added a shaped dorsal coat following the rat's body and a tapered muzzle. Inspected the default browser view. All 52 interactive-scene tests and the production build passed, with the existing bundle-size warning. The animal remains a simplified illustration rather than the detailed concept; L2 completion is not claimed.

### 2026-11-16 — Twin-scene background trees

Replaced the two spherical background crowns with branching trees and instanced leaves. Inspected the different-environment browser view. All 53 interactive-scene tests passed, including clearance from the seated pair in both environment states; the production build passed with the existing bundle-size warning. The scenery and people remain simplified relative to the concept; L2 completion is not claimed.

### 2026-11-16 — Argument arcade

Replaced the two tubular arches with extruded stone arch bands supported by the existing columns. Inspected the default browser view and switched to the shared-drawing frame. All 53 interactive-scene tests and the production build passed, with the existing bundle-size warning. Masonry, vegetation and people remain simplified compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Time garden pergola

Added a fuller leaf canopy and hanging flower clusters to the garden pergola. Inspected the garden frame in the browser. All 54 interactive-scene tests passed, including visibility across both frames and both garden examples; the production build passed with the existing bundle-size warning. The garden remains simplified relative to the concept; L2 completion is not claimed.

### 2026-11-16 — Orientation entry arch

Replaced the entry's thin arch with an extruded stone crown, radial masonry joints and a climbing vine. Inspected the default browser view. All 54 interactive-scene tests and the production build passed, with the existing bundle-size warning. The two destinations and surrounding terrain remain schematic compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Orientation cave surround

Added faceted rock outcrops around the lower cave opening. Inspected the default browser view. All 55 interactive-scene tests passed, including clearance from the waterfall, stream and path marker in both directions and examples; the production build passed with the existing bundle-size warning. The terrain remains schematic compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Sisyphus ridge relief

Increased the mountain's angular ridge and fracture relief away from the movement corridor. Inspected the default browser view. All 11 Sisyphus path tests passed, including rendered contact of the loaded boulder and feet and sampled corridor clearance; the production build passed with the existing bundle-size warning. The mountain remains visibly conical and the route remains broader than in the concept; L2 completion is not claimed.

### 2026-11-16 — Sisyphus path shoulders

Tested a narrower path, but browser inspection revealed a gap beside the retaining wall. Restored its support width and softened the visual width with darker earth-colored shoulders. Inspected the revised default view. All 11 Sisyphus path tests and the production build passed, with the existing bundle-size warning. The route geometry remains wider than the concept and L2 completion is not claimed.

### 2026-11-16 — Panopticon cutaway masonry

Added shared, staggered masonry joints to the outer sides of the cell walls, including exposed cutaway ends. Inspected the default browser view. All 12 Panopticon tests passed, including shared geometry disposal; the production build passed with the existing bundle-size warning. The scene remains a stylized cutaway and has not received L2 acceptance.

### 2026-11-16 — Cave interior palette

Darkened and warmed the cave rock facing and floor to strengthen the contrast with the fire and daylight opening. Inspected the default browser view, where the silhouettes remain discernible. All 13 cave tests and the production build passed, with the existing bundle-size warning. The shallow cutaway and stylized figures still differ substantially from the concept; L2 completion is not claimed.

### 2026-11-16 — Ship end timbers

Extended both curved end timbers into continuous scrolls attached to the moving hull. Inspected the default browser view. All 12 ship tests and the production build passed, with the existing bundle-size warning. The decorative timbers and surrounding sea remain stylized compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Veil podium caps

Added radial stone joints to the six podium tops. Inspected the default browser view. All seven veil tests passed, including figure support and curtain motion; the production build passed with the existing bundle-size warning. The platforms and figures remain simpler than the concept; L2 completion is not claimed.

### 2026-11-16 — Trolley garden tree

Rebuilt the background tree with a bent trunk, branches and instanced leaves, and grounded its base. Inspected the default browser view. All eight trolley tests passed, including sampled clearance between the tree and the moving tram on both branches; the production build passed with the existing bundle-size warning. The landscape and figures remain simplified compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Vat background arch

Replaced the bookcase's tubular background arch with an extruded stone crown and added a climbing vine. Inspected the default browser view. All eight vat tests and the production build passed, with the existing bundle-size warning. The anatomy and laboratory details remain stylized compared with the concept; L2 completion is not claimed.

### 2026-11-16 — Free-will border trees

Replaced the two spherical border-tree crowns with branching trunks and instanced leaves. Inspected the default browser view. All 11 free-will tests passed, including sampled traveler clearance along both routes; the production build passed with the existing bundle-size warning. The landscape and traveler remain simplified compared with the concept; L2 completion is not claimed.

- 2026-11-16: Chinese Room: added climbing ivy at the rear exterior corners, positioned away from the moving-card openings. The 11 Chinese Room tests and production build pass; the scene remains under visual refinement and is not yet accepted as L2.

- 2026-11-16: Chinese Room: replaced the small freestanding shelf with a full-height library, varied book spines and upper-shelf objects. Checked the default view in the browser; all 11 Chinese Room tests and the production build pass. The scene remains under refinement and is not yet accepted as L2.

- 2026-11-16: Induction: reduced excess plinth, enlarged the hen, opened the foreground fence and set a more frontal default camera so the hen, feeding sequence and path can be read together. Browser check confirmed the first day advances; 60 interactive scene/integration tests and production build pass. Visual L2 acceptance remains outstanding.

- 2026-11-16: Induction: replaced the rectangular ground patch with a circular garden and added an irregular paved forecourt. Rebuilt the foreground bowl with an inner surface and positioned state-controlled grain inside it. Checked both empty and fed browser views; 60 interactive tests and production build pass. L2 visual review remains outstanding.

- 2026-11-16: Induction: added masonry gate piers, replaced the block hay prop with a bound cylindrical bale and straw strands, softened paving contrast and adjusted the default view. Browser checked; 60 interactive tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Emotion orientation: replaced the pavilion's rectangular support with a faceted rock profile and added a rising hillside behind the upper steps. Browser checked both up and down states; 57 interactive/metaphor tests and the production build pass. The landscape remains simplified and L2 visual acceptance is outstanding.

- 2026-11-16: Emotion orientation: refined the traveler with posed arms, folded cloak, bag, strap and hair details. Browser checked default view; added a hand-to-forearm continuity check. All 58 relevant tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Time frames: rebuilt the common background arch as masonry with joints and climbing foliage. Browser checked the money and garden states; 58 interactive/metaphor tests and the production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Time garden: remodeled the gardener's leaning torso, articulated arms and hands above the soil, apron and hair. Added checks for arm continuity and hand placement in both garden examples. Browser checked the garden frame; 59 tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Time frames: replaced the rectangular ground patch with a circular garden, reduced the excess plinth, and added a shared stepping-stone approach and grass. Browser checked both frames; 59 relevant tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Argument frames: added joints to both stone arches and replaced bead-like ornaments with stems and shaped leaves on the columns and crowns. Browser checked the war frame; 59 relevant tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Argument frames: replaced the rectangular outer ground with a circular courtyard, tightened its plinth and added an approach and small planted borders shared by both frames. Browser checked both states; 59 relevant tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Twins: replaced the sixteen population dots with paired human silhouettes while retaining their per-pair color state. Checked the default browser view and environment change; 62 interactive tests and production build pass. Figures represent synthetic examples, not study data. L2 visual acceptance remains outstanding.

- 2026-11-16: Twins: added distinct stone and brick facade courses and window sills/lintels to the environment-dependent homes. Browser checked similar and different environments; 62 interactive tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Twins: replaced the rectangular ground with a circular common landscape, reduced the plinth and added paired approaches and plants around the population display. Browser checked both environment states; 62 interactive tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Ratio schedules: added static recessed niches to both cabinets, tightened the plinth and set a more frontal default view. The shared progress indicator remains the sole response stream. Browser checked FR/VR switching; 62 interactive tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Self-stimulation: added a lightly transparent front enclosure panel and lower rail. Browser checked visibility; expanded the animal-clearance check to include the new pane. All 62 interactive tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Self-stimulation: added an arched feeder surround and hollow bowl; food-choice pellets remain state controlled and sit inside the bowl. Checked food-choice feedback in the browser; 62 interactive tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Pigeon: replaced rounded wing-cover beads with layered, shaped feather surfaces attached to the bird. Browser checked the default view; 62 interactive tests, including movement and chamber clearance, and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Pigeon: added a lightly transparent front panel and lower rail, and reduced excess plinth. Browser checked default view and behavior action; clearance tests cover all bird poses, 62 interactive tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Language Across a Wall: added a shallow stone crown to the partition and adjusted its default camera so the wall face and message passage are visible. Browser checked the unbuilt and built states; 62 interactive tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Infinite Monkey: adjusted the default camera to show the typist and keys, replaced the rectangular carpet with an elliptical bordered rug, and moved loose pages clear of it. Browser checked; all 5 monkey tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Infinite Monkey: replaced the flat sheet with a curved page rising from the platen, aligned the animated sequence marks to its surface and added keyboard edging. Browser checked; all 5 monkey tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Butterfly Dream: grouped and enlarged the flowering tree around its ground anchor to strengthen the background silhouette while keeping the existing reclining scene and butterfly motion. Browser checked; all 7 butterfly tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Butterfly Dream: replaced the circular pond with an irregular gradient water surface and shallow shoreline. Browser checked; a raycast verifies the cascade reaches the new pond, all 7 butterfly tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Eternal Recurrence: added a stone-arched reading alcove and books outside the circular walking route, clearing nearby border props. Browser checked; a full-cycle clearance check and all 6 recurrence tests pass, as does production build. L2 visual acceptance remains outstanding.

- 2026-11-16: Newcomb: changed the one-box and two-box controls into rimmed circular medallions with distinct inset diagrams and preserved the existing selection color behavior. Browser checked single/two selection; all 7 Newcomb tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Socratic Ignorance: reduced the oversized base and adjusted the default camera to give the seated dialogue more visual weight while retaining the arch and bookshelf. Browser checked; all 8 Socratic tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Socratic Ignorance: enlarged the woven rug, extended its stripes and borders, added fringe and a tabletop inlay. Browser checked; all 8 Socratic tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Free Will: added layered leaves to the rear tree canopy, attached to the existing tree beyond both routes. Browser checked; 11 free-will tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Trolley: enlarged the garden tree and added low flower clusters and rocks outside the tracks. Browser checked; all 8 trolley tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Panopticon: added staggered masonry joints following the tapered central tower and avoiding its lower windows. Browser checked; all 12 panopticon tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Cave: added earth beneath the supported floor and low rubble around its outside edge. Browser checked; all 13 cave tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Ship: changed the default camera to show the hull broadside and retain the full plinth. Browser checked the default view and fully replaced plank state; all 12 ship tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Veil: added trailing vines to the outward sides of three taller podiums, away from the stairs. Browser checked the default and raised curtain; all 7 veil tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Brain in a Vat: adjusted the default camera to show the brain and console, and added two front-facing electrode leads and contacts. Browser checked; all 8 vat tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Sisyphus: narrowed the visible earth-colored road band while retaining the existing support geometry. Browser checked; 16 path, switchback-study and boulder tests and production build pass. The scene still differs substantially from the concept's switchback mountain; L2 visual acceptance remains outstanding.

- 2026-11-16: Sisyphus switchback study: increased turn radius to .95 and road width to 1.56, with a .635-radius boulder proxy. The sampled route climbs continuously and the road triangles remain unfolded; focused test and production build pass. Browser inspection shows closely spaced walls, unfinished shelf terrain and edge artifacts. This isolated study is not integrated with production motion, ground support, retaining walls or scenery; L2 remains outstanding.

- 2026-11-16: Sisyphus switchback study now loads and rolls the production boulder, placing it on the analytic study surface. A sampled test checks all 1,847 asset vertices at 39 interior positions against the sampled road centerline; both study tests and production build pass. Browser checked a rolling frame. The sampled footprint is not continuous collision proof, and the study still lacks production figure integration, finished terrain and retaining walls. L2 remains outstanding.

- 2026-11-16: Sisyphus switchback study: added a simple articulated figure whose foot anchors follow earlier points on the route rather than extending the current tangent across turns. Browser checked one animation frame; three study tests and production build pass. This is a stand-in, not the production figure: hand contact, full-body and curb clearance, finished mountain and animation integration remain unverified. L2 remains outstanding.

- 2026-11-16: Sisyphus switchback study: added segmented arms and used the production nearest-vertex hand target for the rolling boulder; the proxy torso follows the trailing route direction. Browser checked straight and bend frames. Fourteen combined existing path and study tests and production build pass; they do not verify the proxy arms, continuous collision clearance, or integration into the production scene. L2 remains outstanding.

- 2026-11-16: Sisyphus switchback study: replaced isolated rock columns with a connected faceted rear ridge and widened the preview framing. Sampled ridge centerline distance to road centerline is at least 1.886 with .32 ridge half-width; this is not a full collision proof. Browser checked; 3 study tests and production build pass. Ridge remains angular and the lower terrain shows rendering artifacts; production integration and L2 remain outstanding.

- 2026-11-16: Sisyphus switchback study: lowered the plinth below the terrain edge, removing observed ground flicker, and widened the rear ridge into a multi-faceted slope. Browser checked; 3 study tests and production build pass. Ridge remains visually schematic with visible surface artifacts and is not integrated into production; L2 remains outstanding.

- 2026-11-16: Sisyphus switchback study: removed observed ridge self-shadow striping and shared curb coordinates between preview and test. At 39 sampled positions, all boulder vertices clear conservative curb bounds; 3 study tests and production build pass. This vertex/time sampling does not prove continuous mesh collision clearance. Browser checked; mountain refinement, production integration and L2 remain outstanding.

- 2026-11-16: Sisyphus switchback study: replaced the detached rear ridge with continuous terrain displacement, faded outside the sampled route corridor. Browser checked; 3 route tests and production build pass. Tests do not cover the modified terrain mesh or prove full actor clearance; terrain remains schematic, and production integration and L2 remain outstanding.

- 2026-11-16: Sisyphus switchback study: moved the terrain mesh builder into the shared study route module and added rendered-surface raycast checks. The initial check found terrain protruding through the last turn; subdividing the road across its width fixed the sampled failure. Four study tests now pass, including road/terrain sampling and four sampled boulder/surface contacts; production build and browser check pass. This is sampled evidence, not continuous collision proof, and the study is not integrated; L2 remains outstanding.

- 2026-11-16: Sisyphus switchback study: added rendered-road raycasts for trailing foot anchors at 201 sampled positions and a sampled .75-unit shoulder-to-boulder reach limit for the proxy. Five study tests and production build pass. These checks cover anchors and direct reach, not full limb collision, animation appearance or production figure integration; L2 remains outstanding.

- 2026-11-16: Sisyphus switchback study: added embedded faceted outcrops on the far slope and shared the terrain elevation function with placement. A conservative sampled route-distance test passes alongside 5 other study tests; browser and production build checked. Outcrops and terrain remain schematic, clearance is sampled, and the study is not in production; L2 remains outstanding.

- 2026-11-16: Language Across a Wall: reduced both house models to a shared miniature scale, preserved receiver roof attachment across reconstruction states, reduced excess base and adjusted the default camera. Browser checked default and built states; 57 interactive-scene tests and production build pass. Visual L2 acceptance remains outstanding.

- 2026-11-16: Pigeon: enlarged the bird, shifted it inward after the first clearance check failed, and lowered the default camera to keep its head visible below the frame. Browser checked default and behavior action; all 57 interactive-scene tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Chicken and Induction: adjusted the default camera and hen position, keeping the hen clear of the bowl and shelter; added a bounds check for both. Browser checked; 58 interactive-scene tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Fixed and Variable Ratios: adjusted the default camera and added low forecourt flagstones without adding progress indicators. Browser checked FR, switched VR and response feedback; 58 interactive-scene tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Self-stimulation and Choice: enlarged the rat and lowered the default camera; added a sampled tail-to-budget-display clearance check. Browser checked food and stimulation choices; all 59 interactive-scene tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Twins: adjusted the default camera to show both participants and population markers more directly, and enriched the common foreground plants with leaves and flowers. Browser checked similar and different home environments; 59 interactive-scene tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Argument frames: adjusted the default camera and added a tree behind the arch. Browser checked war and shared-drawing states; 59 interactive-scene tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Time frames: adjusted the default camera to improve the gardener view and replaced the orchard's spherical crowns with layered foliage while retaining fruit. Browser checked money and garden frames; 59 interactive-scene tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Emotion orientation: reduced excess base and replaced three spherical border shrubs with layered leaves. Browser checked up and down states; 59 interactive-scene tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Chinese Room: reduced the stage radius and tightened the camera. Updated the stage test to check the actual floor, trays and moving card footprints against the stage radius; all 11 Chinese Room tests and production build pass. Browser checked the default and output state; output remains partly occluded from this view. L2 visual acceptance remains outstanding.

- 2026-11-16: Chinese Room: adjusted the default camera to expose more of both side trays. Browser checked slider endpoints: input and output symbols are now partially visible outside their respective walls, though neither is fully unobstructed. Production build passes; no geometry changed. L2 visual acceptance remains outstanding.

- 2026-11-16: Chinese Room: cut away the upper front of both side walls and shortened their coping and masonry joints to expose the card trays while preserving the passages. Browser checked both slider endpoints; all 11 Chinese Room tests and production build pass. L2 visual acceptance remains outstanding.

- 2026-11-16: Socratic Ignorance: added a small stack of books on the dialogue table. Browser checked; a support and footprint test and all 9 Socratic tests pass, as does the production build. L2 visual acceptance remains outstanding.

- 2026-11-16: Refined Newcomb's ceramic urn with an olive motif and added a hollow bowl, then inspected the scene in the browser. Newcomb's seven tests and the production build passed; visual L2 acceptance remains outstanding.

- 2026-11-16: Improved the isolated Sisyphus switchback study with subtle road color variation and terrain rock/scrub clusters outside the route corridor; inspected the result in the browser. Six switchback tests and the production build passed. The study is not integrated into the production scene; its road edges, mountain and actor still need work and L2 visual acceptance remains outstanding.

- 2026-11-16: Reduced Sisyphus production-road striping by replacing periodic color variation and applying scene-specific shadow normal bias; browser inspection confirmed shadows remain and another scene renders after switching. All 11 Sisyphus path tests and the production build passed. The mountain and route still fall short of the concept render; L2 visual acceptance remains outstanding.

- 2026-11-16: Adjusted the production cave's default camera to show the wall shadows and exit more frontally, and added an olive vine around the outer opening. Inspected slider endpoints in the browser; all 13 cave tests and the production build passed. The scene still needs visual refinement and L2 acceptance.

- 2026-11-16: Raised the Panopticon default view to reveal more of the galleries and courtyard, added lower gallery rails and a courtyard paving ring, and inspected the rotating beam in the browser. All 12 Panopticon tests and the production build passed. Further concept-image refinement and L2 visual acceptance remain outstanding.

- 2026-11-16: Adjusted the Theseus ship's hull proportions to make the vessel and its replacement boards more prominent. Browser inspection covered both slider endpoints; 12 ship tests and the production build passed. The scene still needs further concept-image refinement and L2 visual acceptance.

- 2026-11-16: Increased the sculpted outer waves and foam on the Theseus ship's sea, preserving the flat hull area and closing the raised water perimeter to its base. Browser inspection completed; 13 ship tests including sampled crest contact and perimeter checks, plus the production build, passed. Further visual refinement and L2 acceptance remain outstanding.

- 2026-11-16: Increased the height range of the six Veil podiums and changed their stairways to five smaller rises. Inspected the curtain at both control endpoints in the browser; all seven Veil tests and the production build passed. Character detail and visual L2 acceptance remain outstanding.

- 2026-11-16: Expanded the Trolley garden tree with more branching and denser shared leaf instances; inspected the result in the browser. All eight Trolley tests, including sampled cart and fixture clearance, and the production build passed. Further refinement and visual L2 acceptance remain outstanding.

- 2026-11-16: Added a contemplative observer bust to the Brain in a Vat foreground and inspected it in the browser. Nine vat tests including bust grounding and clearance, and the production build, passed. Further concept-image refinement and L2 visual acceptance remain outstanding.

- 2026-11-16: Changed Free Will's default view to face the fork more evenly and added a ceramic jar beside the warm arch. Inspected both slider endpoints in the browser; all 12 Free Will tests, including sampled jar/traveler clearance, and the production build passed. Further visual refinement and L2 acceptance remain outstanding.

- 2026-11-16: Enlarged the default Chinese Room framing while keeping both traveling-card endpoints visible, and added jointed paving around the room on the plinth. Browser inspection and all 11 Chinese Room tests passed, as did the production build. Further visual refinement and L2 acceptance remain outstanding.

- 2026-11-16: Added a distant garden through the Socratic arch and modestly enlarged the default view. Inspected both dialogue endpoints in the browser; all nine Socratic tests and the production build passed. Further character detail and L2 visual acceptance remain outstanding.

- 2026-11-16: Added an autumn tree outside the Eternal Recurrence ring and adjusted its placement for visibility. Browser inspection, seven recurrence tests including sampled traveler/tree clearance, and the production build passed. Further visual refinement and L2 acceptance remain outstanding.

- 2026-11-16: Enlarged the Butterfly Dream resting arrangement and added blossom clusters to the tree. Inspected the scene in the browser; all seven butterfly tests and the production build passed. Further character and environment refinement and L2 visual acceptance remain outstanding.

- 2026-11-16: Added overlapping scalp locks and brows to the typing monkey; browser inspection guided a flatter hair profile. All five monkey tests and the production build passed. Further character detail and L2 visual acceptance remain outstanding.

- 2026-11-16: Replaced the rectangular Language Across a Wall paving patch with continuous circular stone paving and clipped joints. Browser inspection confirmed the receiver house appears after Build; all 59 interactive-scene tests and the production build passed. Further visual refinement and L2 acceptance remain outstanding.

- 2026-11-16: Raised the Superstitious Pigeon chamber frame, glazing, back wall and roof while keeping the feeder and animal positions unchanged. Browser inspection verified a delivery after three five-second advances without behavior; all 59 interactive-scene tests and the production build passed. Further visual refinement and L2 acceptance remain outstanding.

- 2026-11-16: Added a bound and staved feed barrel beside the induction shelter. Browser inspection and a bounds check found it clear of the hen, bowl and shelter; all 59 interactive-scene tests and the production build passed. Further visual refinement and L2 acceptance remain outstanding.

- 2026-11-16: Modestly enlarged the default Fixed and Variable Ratios view and added non-indicator masonry joints to both cabinet crowns. Browser inspection confirmed switching to VR and one response updated the mode and progress; all 59 interactive-scene tests and the production build passed. Further refinement and L2 acceptance remain outstanding.

- 2026-11-16: Rebuilt the Self-stimulation scene lamp with a curved shade and a more visible position outside the chamber. Browser inspection confirmed the food choice updates the illustrative budget; all 59 interactive-scene tests and the production build passed. Further visual refinement and L2 acceptance remain outstanding.

- 2026-11-16: Refined the twins illustration with cottage shutters, urban pilasters, door panels and thresholds attached to their respective homes. Checked both environment states in the browser; interactive scene tests passed (59/59) and production build passed. L2 visual acceptance remains outstanding.

- 2026-11-16: Refined the two shared argument-frame participants with distinct hairstyles, ears, a beard, mantle and folds. Verified war and shared-drawing states in the browser; interactive scene tests passed (59/59) and the production build passed. Comparison with the concept image still shows substantial character and environment fidelity gaps; L2 visual acceptance remains outstanding.

- 2026-11-16: Refined the time metaphor's money-frame chair and desk joinery and added garden-frame perennial border clusters clear of the path. Browser checked money, planted and fallow states, with final flower positions rechecked. Interactive scene tests passed (59/59); production build passed. Concept-image fidelity and L2 visual acceptance remain outstanding.

- 2026-11-16: Replaced the emotion orientation scene's rectangular ground with a continuous circular courtyard and added a stone approach, foreground groundcover and rocks. Browser checked the up and down frames and the second down example; interactive scene tests passed (59/59), and the production build passed. The steps, terrain, figures and destinations still need further work against the concept image before L2 review.

- 2026-11-16: Added masonry courses to exposed sides of both emotion-orientation stairways and radial joints to the cave arch. Browser checked both directions and visible route markers; interactive scene tests passed (59/59), and the production build passed. The overall concept-image fidelity and L2 review remain outstanding.

- 2026-11-16: Adjusted the isolated Sisyphus switchback study to climb more steeply and use a more continuous rear ridge, then reframed the preview to show the entire model. All six switchback geometry/contact tests passed and production build passed. Browser comparison still shows an over-broad road, simplified mountain and placeholder figure; the study is not integrated into the production scene and is not L2-ready.

- 2026-11-16: Spaced the switchback study's road runs farther apart and narrowed the strip while maintaining sampled boulder and foot clearance. Relocated one outcrop that failed corridor clearance; all six switchback tests then passed. Browser review shows the distinct road bands, but the sharp terrain transition, placeholder figure and overall fidelity still prevent integration or L2 acceptance.

- 2026-11-16: Smoothed the switchback study's rear terrain transition and refined the placeholder figure with bare torso, hair, skirt and sandals while preserving hand targeting. The six switchback geometry/contact tests passed after the terrain change; browser rendering was checked after figure changes. The study remains separate from production and has substantial fidelity gaps before L2 review.

- 2026-11-17: Replaced the switchback preview's summit-to-start jump with a continuous ascent and return along the route; the figure is hidden on the return, matching the existing production convention. Added a cycle continuity/direction test; all seven switchback tests pass. Browser preview runs, though sampled screenshots did not establish the return phase visually. The study remains unintegrated and below L2 fidelity.

- 2026-11-17: Replaced separated curb blocks in the Sisyphus switchback study with a continuous low retaining edge and coping joints. Added a sampled corridor-clearance test; all eight switchback tests passed and browser preview was inspected. This remains a separate study; it still needs full visual and animation verification before production integration and L2 review.

- 2026-11-17: Enlarged and partly embedded three distant outcrops in the isolated switchback study; all eight switchback tests passed after changing their bounds. Browser review still shows blocky, isolated rocks rather than a coherent mountain ridge, so this is an intermediate study and not an L2-ready production replacement.

- 2026-11-17: Added shared facade masonry joints to the production panopticon cells while keeping window openings clear. Browser-checked the facade and observed the beam; all 13 panopticon tests passed, including opening clearance and shared-geometry disposal, and production build passed. Overall L2 visual review remains outstanding.

- 2026-11-17: Refined production cave prisoners with hair and ear details and added sparse edge vegetation outside the departure route. Browser checked both slider endpoints; all 13 cave tests passed and the production build passed. Characters, rock volumes and overall concept fidelity still need L2 visual review.

- 2026-11-17: Refined the production ship's sail with subtle cloth folds and continuous curved head/foot hems. Browser checked both plank-replacement endpoints; all 13 ship tests passed, including rigging attachment, and production build passed. Sail, hull and water still need full comparison against the concept image for L2 review.

- 2026-11-17: Turned the taller veil podiums' arched recesses outward so they no longer face and overlap the stairs. Added a geometry test for outward orientation and stair clearance; all eight veil tests and the production build passed. Browser inspected both veil endpoints and an exterior orbit. Overall L2 visual review remains outstanding.

- 2026-11-17: Corrected both groups in the production trolley scene to face the approaching tram. Added an approach-direction test; all nine trolley tests and the production build passed. Browser checked both switch positions. The scene still needs further model fidelity and full L2 visual review.

- 2026-11-17: Added a short schematic brain stem and wooden console casing to the production vat scene. Browser checked signal-control endpoints; all nine vat tests passed, including brain, diffuser and bubble clearance, and production build passed. Further fidelity work and L2 visual review remain outstanding.

- 2026-11-17: Added hair, ear, collar and sandal details to the free-will traveler, retaining the existing posed hand and path-following movement. Browser checked both slider endpoints; all 12 free-will tests and the production build passed. Character and scene fidelity remain below completed L2 review.

- 2026-11-17: Added surface-level timber joints to the Chinese Room's two card trays. Browser checked input and output endpoints; all 11 Chinese Room tests passed, including card passage clearance, and the production build passed. Overall L2 visual fidelity remains outstanding.

- 2026-11-17: Differentiated the two Socratic participants with curls and beard on one, a bun and hairband on the other, and ear details on both. Browser checked dialogue slider endpoints; all nine Socratic tests and the production build passed. Full model fidelity and L2 visual review remain outstanding.

- 2026-11-17: Added simple stamped details to the four visible top coins in the production Newcomb scene. Browser checked one-box and two-box selection; all seven Newcomb tests passed, including the opaque box remaining closed, and production build passed. Overall L2 visual review remains outstanding.

- 2026-11-17：永恒轮回中央树冠增加分层叶片并改为实例化绘制；浏览器检查默认视角。recurrence 测试 7 项及生产构建通过，构建仍有既有的大包提示。该项为局部细化，整体仍待对照概念图完成 L2 审阅。

- 2026-11-17：西西弗斯折返山路独立原型调整路外地形，增加山脊起伏并保留道路净空；浏览器检查默认视角，原型 8 项测试和生产构建通过。正式场景尚未接入该原型，山体形态、植被、人物与概念图仍有明显差距，不能视为 L2 完成。

- 2026-11-17：折返山路独立原型添加山侧橄榄树；树干距路线中心最近约 1.741，浏览器默认视角检查。尝试尖峰岩层后因造型不自然移除，山体仍需重做。原型 8 项测试与生产构建通过；测试未覆盖新树冠的全部动画遮挡。原型尚未接入正式场景，未达到 L2。

- 2026-11-17：正式无限猴子场景改造桌腿、桌框和桌面纹理，添加墨水瓶与羽毛笔；浏览器检查默认视角及滑块端点，新增测试采样墨水瓶与打字机、双手的空间分离。monkey 测试 6 项及生产构建通过（既有主包体积提示仍在）。整体与概念图仍有差距，未视为 L2 验收完成。

- 2026-11-17：归纳场景的五个日期碗与前景食盆增加共享几何的粮食颗粒，保留逐日显示与第六日反例状态；浏览器检查第 1、5、6 日，interactive-scenes 测试 59 项及生产构建通过。此为局部细化，场景整体仍待对照概念图达到 L2。

- 2026-11-17：归纳庭院扩大树冠、加粗树干，整体调整鸡舍比例并为前场铺石加入轻微变化；默认视角及五日喂食状态可见。interactive-scenes 测试 59 项和生产构建通过，既有大包提示仍在。改动仍属局部细化，场景未完成 L2 验收。

- 2026-11-17：固定/可变比率场景增加有厚度的拱形装置外壳和侧面结构；浏览器检查默认画面、一次响应及模式切换。interactive-scenes 测试 59 项与生产构建通过，已有大包提示不变。整体仍待按概念图细化并审阅，未标记 L2。

- 2026-11-17：自我刺激与选择场景为动物补充四肢和实例化背部毛流，保留示意性选择交互；浏览器检查默认画面及食物、刺激各一次的反馈。interactive-scenes 测试 59 项及生产构建通过，既有大包提示仍在。动物造型及整体与概念图仍有差距，未完成 L2。

- 2026-11-17：统一场景资源释放，场景切换时额外释放 InstancedMesh 实例缓冲区；新增遍历全部场景的资源释放测试，验证各实例、共享几何与材质各释放一次。全部 234 项测试及生产构建通过；浏览器验证永恒轮回与自我刺激场景往返切换。未进行 GPU 内存压力测量；此项不代表任何场景达到 L2。

- 2026-11-17：对西西弗斯折返原型的地表增加岩层颜色变化，浏览器默认视角检查；原型 8 项测试与生产构建通过。视觉变化有限，原型仍是平滑坡面与简化人物，尚未接入正式场景，不能视为 L2。

- 2026-11-17：折返山路独立原型添加膝关节和交替抬脚，修正脚部支撑高度；新增 301 个路径采样点的道路接触检查，原型 9 项测试及生产构建通过。检查默认视角；步态仍是简化动画，未验证连续无滑步，人物和山路尚未接入正式场景。

- 2026-11-17：折返山路原型步态改为沿路径固定支撑脚落点、另一脚平滑摆动；采样检查支撑脚无滑动、步骤连续和循环边界，并检查道路接触。原型 10 项测试及生产构建通过，浏览器检查默认视角；未证明采样间所有状态或关节自然度，仍未接入正式场景。

- 2026-11-17：隔墙交流场景把描述者与接收者的房屋模型抬至独立木制展示台；接收台覆盖两种背景位置。新增模型主体与台面支撑测试；60 项交互场景测试及生产构建通过，浏览器检查未建造、重建和背景变化。整体人物和场景仍需继续细化，未宣称达到 L2。

- 2026-11-17：鸽子实验箱将计时钟及外圈整体上移，改善定时器和供食器的层次；新增三种鸟姿与钟面、料斗的空间分离测试。61 项交互场景测试及生产构建通过；浏览器检查行为一次及三个计时间隔后的供食。场景整体仍未达到 L2。

- 2026-11-17：环形监狱后侧两层走廊减少过密栏杆立柱，保留连续扶手，改善牢房视线；浏览器检查默认视角与光束滑块两端。13 项场景测试及生产构建通过；视觉改善有限，整体仍需继续细化和审阅，未达到 L2。

- 2026-11-17：正式西西弗斯人物增加交替迈步，脚底支撑由现有路径高度计算；采样测试检查至少一脚接地、抬脚高度、肢体连接及实际石块接触。相关 15 项测试及构建通过，浏览器检查默认及滑块两端。该步态支撑脚仍可能滑动；正式山体仍为锥形，折返原型尚未接入，整体未达到 L2。

- 2026-11-17：正式西西弗斯步态按山路弧长固定支撑脚的水平落点，另一脚摆动，仍按路径表面计算脚底高度。新增 500 个上坡采样位置的世界坐标支撑脚滑动检查；12 项路径测试、此前 4 项石块加载测试及生产构建通过。默认视角已检查；采样结果不证明所有角度的姿态自然，山体与人物仍未达到 L2。

- 2026-11-17：柏拉图洞穴放大并调整墙面三组示意剪影，提升与器物的辨识度；13 项洞穴测试及生产构建通过，浏览器检查滑块两端。剪影仍为示意而非实时投影，人物与洞穴整体仍未达到 L2。

- 2026-11-17：柏拉图洞穴顶部将重复排列的岩块替换为连续的分面岩层，补齐前后边缘并检查默认视角；13 项洞穴测试及生产构建通过。洞顶仍偏平直，人物、岩体与概念图有差距，尚未达到 L2。

- 2026-11-17：洞穴连续岩层的上下轮廓调整为中部拱起、两侧下降，前缘岩块随拱形变化；13 项洞穴测试与生产构建通过，浏览器检查默认视角和滑块两端。洞穴仍是简化剖面，人物与岩体尚未达到 L2。

- 2026-11-17：忒修斯之船加高帆面，同步调整桅杆、横桁、绑索和固定索具；13 项船只测试及生产构建通过，浏览器检查木板替换两端。整体与概念图的材质、水面和模型细节仍有差距，未视为 L2 完成。

- 2026-11-17：忒修斯之船水面增加小尺度起伏并提高网格采样，保留船底区域平坦；13 项船只测试和生产构建通过，检查泡沫贴合、水面边缘和船底支撑，浏览器检查默认视角。新增细纹在当前视角下较细微，水面与概念图仍有差距。

- 2026-11-17：加宽并调整忒修斯之船外侧波峰泡沫，按两侧边界裁切以避开船体和岸石；13 项船只测试及生产构建通过，默认视角已检查。水面仍为静态风格化几何，整体未达到 L2。

- 2026-11-17：无知之幕布面中段向外鼓起，保留顶部和底边锚定及升降；新增采样检查帷幕位于平台外、舞台内。9 项场景测试及生产构建通过，浏览器检查两端。帷幕仍是简化模型，整体尚未达到 L2。

### 2026-11-17 — Trolley figure variation
- Added three hand and sleeve poses and color-related diagonal mantles to the six track figures, retaining their track positions and direction toward the tram.
- Verification: `node --test tests/trolley.test.js` (10 passed); `npm run build` passed with the existing bundle-size warning. Browser inspection at both track-selection endpoints showed the figures and highlighted route remain visible.
- This is incremental work: the scene and collection have not yet been accepted as L2 against the concept renders.

### 2026-11-17 — Brain in a Vat cable routing
- Separated the four external cable arcs and connected each to a distinct socket on the console. Signal markers continue to use the same cable curves.
- Verification: `node --test tests/vat.test.js` (10 passed), including endpoint-to-socket contact; `npm run build` passed with the existing bundle-size warning. Browser inspection confirmed four discernible arcs in the default view.
- This is incremental work, not L2 acceptance; the full collection still requires further refinement and review.

### 2026-11-17 — Twin environment arch
- Added a central stone arch connecting the two environment settings, inspired by the concept composition while retaining one illustrative pair and the existing population markers. The arch does not encode a numerical heredity/environment split.
- Verification: `node --test tests/interactive-scenes.test.js` (61 passed); `npm run build` passed with the existing bundle-size warning. Browser inspection covered both similar and different home environments and the type control.
- This is incremental work; the full collection has not yet reached L2 or undergone final visual review.

### 2026-11-17 — Free-will hill trail
- Added a winding trail conforming to the rear hill and moved nearby hill rocks away from its center. It remains background scenery and does not change either choice path.
- Verification: `node --test tests/free-will.test.js` (12 passed); `npm run build` passed with the existing bundle-size warning. Browser inspection checked the centered figure and both slider endpoints. The trail is visible but small in the default view, and the scene still differs substantially from the concept render.
- The collection remains unfinished and is not L2 accepted.

### 2026-11-17 — Sisyphus switchback application candidate
- Extracted the switchback study into a scene-builder candidate with the application's update, asynchronous boulder loading and disposal interfaces. The review prototype and candidate now share the same route implementation. The fallback boulder is sized for the narrower road.
- Added an application-camera candidate preview at `review/sisyphus-switchback/candidate.html`. The production scene remains unchanged: visual inspection showed the hill still reads as a steep slab and the candidate figure is less detailed than the production figure. These must be resolved before integration.
- Verification: `node --test tests/sisyphus-switchback.test.js tests/sisyphus-candidate.test.js` (12 passed), including fallback and delivered-rock support and late asset disposal. `npm run build` passed with the existing bundle-size warning; the candidate is not yet included by the production entry point.
- The full collection remains unfinished and has not been accepted at L2.

### 2026-11-17 — Switchback candidate mountain and figure
- Added asymmetric rocky crests away from the protected switchback corridor, and added a draped garment, facial and hair details, and sandal straps to the candidate figure. Moved the olive tree inward so it reads as rooted in the terrain.
- Adjusted only the isolated candidate preview camera and fog to show the higher silhouette. The production camera and scene are unchanged.
- Verification: `node --test tests/sisyphus-switchback.test.js tests/sisyphus-candidate.test.js` (12 passed); candidate tests passed again after moving the tree; `npm run build` passed with the existing bundle-size warning. Browser inspection showed the new silhouette and tree placement.
- The candidate is still not production-ready: the slope remains slab-like, the road and retaining structure remain too schematic compared with the concept, and candidate character detail needs further evaluation. The full collection remains unfinished.

### 2026-11-17 — Switchback retaining-wall study
- Cut back a limited strip of downhill terrain outside the road, extended the candidate retaining wall to that surface, and added masonry joints on exposed faces. The cut fades toward the plinth edge and is clamped to its top.
- Verification: `node --test tests/sisyphus-switchback.test.js tests/sisyphus-candidate.test.js` (12 passed), including road clearance, boulder and foot support, and exposed-wall depth. Browser inspection showed the exposed wall and checked the plinth transition. `npm run build` passed with the existing bundle warning; it does not include this unconnected candidate.
- The switchback remains a candidate, not the production scene: terrain, road surface and figure still need work against the concept. The full collection remains unfinished.

### 2026-11-17 — Switchback road surface
- Added a deterministic, world-aligned dirt and fine aggregate texture to the candidate road without changing the support mesh. Its texture is explicitly released with the candidate scene.
- Verification: `node --test tests/sisyphus-switchback.test.js tests/sisyphus-candidate.test.js` (12 passed); candidate tests passed again after reducing visible grain contrast. `npm run build` passed with the existing bundle warning, but does not include the unconnected candidate. Browser inspection confirmed the revised surface.
- This does not constitute L2: the candidate remains separate from production and its mountain, road proportions and character still need refinement against the concept.

### 2026-11-17 — Switchback slope vegetation
- Added instanced grass tufts across the candidate's open slopes. Individual blades sample terrain height, and their placement excludes the road corridor, major outcrops and the olive tree.
- Verification: `node --test tests/sisyphus-candidate.test.js tests/sisyphus-switchback.test.js` (13 passed), including sampled vegetation clearance; the candidate tests passed again after refining blade placement. `npm run build` passed with the existing bundle warning, but does not include the unconnected candidate. Browser inspection covered the slope and path.
- The scene remains a candidate and the collection is not L2 complete.

### 2026-11-17 — Switchback pushing pose
- Adjusted the candidate figure to lean forward from the hips, reshaped the torso and limb proportions, and aligned the drape to the new pose. Named limb parts to allow contact checks through the ascent.
- Verification: `node --test tests/sisyphus-candidate.test.js tests/sisyphus-switchback.test.js` (14 passed), including sampled joint connections and limb lengths; `npm run build` passed with the existing bundle warning, but does not include the unconnected candidate. Browser inspection showed the updated pushing pose on the curved road.
- The candidate still needs more model and visual work and has not replaced the production scene; the collection remains unfinished.

### 2026-11-17 — Argument frame standards
- Replaced the single war-frame flag and small divider with two differently colored notched standards and two-part circular emblems; the shared-drawing frame retains its overlapping-ring banner. Flags remain attached to their respective frame groups.
- Verification: `node --test tests/interactive-scenes.test.js` (61 passed); `npm run build` passed with the existing bundle-size warning. Browser inspection checked both frame states and their corresponding tabletop illustrations.
- This is incremental visual work, not L2 acceptance; the collection remains unfinished.

### 2026-11-17 — Ship stern platform
- Added a raised, planked stern platform and low rail to the moving hull, clearing the existing crate and retaining the board replacement interaction.
- Verification: `node --test tests/ship.test.js` (14 passed), including deck contact, cargo clearance and movement with the hull; `npm run build` passed with the existing bundle-size warning. Browser inspection covered both ends of the replacement slider.
- This is one incremental scene improvement, not collection-wide L2 acceptance.

### 2026-11-17 — Chinese Room tray supports
- Added paired wooden braces below each exterior card tray, connecting the projecting trays to the walls while leaving the symbol passage unobstructed.
- Verification: `node --test tests/chinese-room.test.js` (12 passed), including support endpoints and clearance across the slider range; `npm run build` passed with the existing bundle-size warning. Browser inspection checked input and output endpoints.
- This is incremental refinement; all-scene L2 completion remains unverified and unfinished.

### 2026-11-17 — Switchback integrated into Sisyphus
- Switched the production Sisyphus builder to the tested switchback, including its path, supporting wall, terrain, articulated figure, boulder loading and texture disposal. Suppressed cone-specific enrichment for this route. The previous cone builder and its regression tests remain available for comparison.
- Adjusted Sisyphus camera target, distance and fog for the taller terrain; other scenes restore their normal fog and camera. Browser inspection checked the live route, speed control and navigation to the Panopticon. The mountain, road and figure still fall short of the concept render; the developer level remains L1.
- Verification: `npm test` (249 passed); `npm run build` passed with the existing bundle-size warning. The first browser smoke test exposed incorrect screenshot clipping after page scrolling; after correcting screenshot coordinates and bringing the canvas into view, `npm run test:browser` passed its nine interactive routes and responsive focus checks.
- This integration is not L2 acceptance and does not complete the remaining scenes.

### 2026-11-17 — Switchback mountain perimeter
- Tapered the outer terrain toward the plinth outside the protected road corridor, reducing the slab-like side while retaining the route elevation and existing rocky crests.
- Verification: `node --test tests/sisyphus-candidate.test.js tests/sisyphus-switchback.test.js` (15 passed), covering road/terrain clearance and boulder and foot support; `npm run build` passed with the existing bundle-size warning. Browser inspection covered the default view and a rotated view.
- The mountain and figure remain stylized and still require review against the concept; this is not all-scene L2 acceptance.

### 2026-11-17 — Socratic stone arch
- Replaced the tubular arch crown with a thick extruded stone arch and full-width radial joints, preserving the open view of the garden and both dialogue states.
- Verification: `node --test tests/socratic.test.js` (10 passed), including an opening ray check; `npm run build` passed with the existing bundle-size warning. Browser inspection covered both slider endpoints.
- This is incremental refinement; the scene and collection have not yet been accepted as L2.

### 2026-11-17 — Newcomb stone arch
- Rebuilt the background crown as a deep elliptical stone arch with full-width joints, preserving its central opening, drape and the two box-selection states.
- Verification: `node --test tests/newcomb.test.js` (8 passed), including opening and box clearance; `npm run build` passed with the existing bundle-size warning. Browser inspection covered one-box and two-box states.
- This is incremental refinement and not L2 acceptance of the scene or collection.

### 2026-11-17 — Recurrence central tree
- Reshaped the central tree trunk with a flared, irregular base and gentle bend, and added bark grooves while preserving the surrounding seat ring and traveler route.
- Verification: `node --test tests/recurrence.test.js` (8 passed), including ground contact and traveler clearance; `npm run build` passed with the existing bundle-size warning. Browser inspection checked the start and opposite side of the cycle.
- This is incremental visual work; the scene and collection are not yet L2 accepted.

### 2026-11-17 — Butterfly wing color cells
- Added warm upper and lower color cells to both faces of each wing, parented to the animated wing pivots so they follow the flap.
- Verification: `node --test tests/butterfly.test.js` (7 passed), including paired face coverage and wing motion; `npm run build` passed with the existing bundle-size warning. Browser inspection covered both slider endpoints.
- This is incremental refinement; the scene and collection have not yet been accepted as L2.

### 2026-11-17 — Monkey hourglass and books
- Repositioned and grounded the three-book stack, placed the hourglass on it, and moved the assembly into the visible foreground clear of the carpet and typing mechanism.
- Verification: `node --test tests/monkey.test.js` (7 passed), including stack contact and hand clearance throughout typing; `npm run build` passed with the existing bundle-size warning. Browser inspection checked sequence endpoints and the final foreground placement.
- This is incremental refinement; the collection is not yet L2 complete.

- 2026-11-17: Language Across a Wall: added paired wooden frames to both sides of the message opening and continued central masonry joints above and below it. Checked the default browser view; existing interaction-scene tests (61) and production build pass. This is an incremental visual refinement, not L2 acceptance.

- 2026-11-17: Sisyphus production switchback: added irregular embedded rock fins on the outer terrain, excluding the route and tree. Visually checked the result in the browser, corrected face winding, and verified the production fins' vertex clearance from the road. The switchback tests (11) and production build pass. The mountain and figure still need substantial work against the concept; this is not L2 acceptance.

- 2026-11-17: Plato's Cave: gave the three figures distinct muted garments from the concept palette, kept the freed figure's seated and standing colors consistent, and added folded lap fabric to the seated meshes. Browser checked the default view; 13 cave tests and the production build pass. The figures and cave remain schematic and are not approved as L2.

- 2026-11-17: Newcomb: replaced the outer radial strips with three staggered rings of stone paving and added a secondary olive branch behind the arch. Browser checked the resulting composition; all 8 Newcomb tests and production build pass. This is an incremental refinement and does not constitute L2 acceptance.

- 2026-11-17: Veil of Ignorance: added varied hair silhouettes to the six figures and a single staggered stone-paving mesh around the central mosaic. Checked the default browser view; 9 veil tests and the production build pass. Figures remain stylized and L2 acceptance is not claimed.

- 2026-11-17: Fixed and Variable Ratios: added a continuous earth bed and repositioned the forecourt flagstones so they meet it, with a geometry test for support and boundary clearance. Checked the browser composition; 62 interactive-scene tests and production build pass. The scene remains an L2 candidate, not accepted.

- 2026-11-17: Self-stimulation and Choice: moved the supply shelf alongside the enclosure, added closed bottles and reference books, and checked the shelf is outside the enclosure and within the stage. Browser view checked; 62 interactive-scene tests and production build pass. The scene remains schematic and is not accepted as L2.

- 2026-11-17: Plato's Cave: added a shaped mantle, curls, ears and nose to the released standing figure, using the same garment palette as the seated version. Browser checked the default standing state; 13 cave tests and production build pass, including departure-path clearance. The figure is still schematic and has not been accepted as L2.

- 2026-11-17: Created a repeatable local-browser capture script and a 23-scene concept/current comparison page. All 23 screenshot and concept paths exist; first and last screenshots were visually sampled. Images show default state only, with animation captured at one instant; they are evidence for further work, not L2 approval.

- 2026-11-17: Superstitious Pigeon: added a fixed gear-and-drum timer housing and a lower interior wall panel. Browser checked the result; 62 interactive-scene tests and production build pass. Refreshed the 23-scene default-state comparison. The model remains an L2 candidate, not accepted.

- 2026-11-17: Trolley: lengthened the carriage by 30%, widened its axle spacing, and moved the switch and tree to retain clearance. The 10 trolley tests pass, including both branch trajectories, wheel alignment and obstacle clearance; production build and default browser view checked. Refreshed the 23-scene comparison. The scene is not yet accepted as L2.

- 2026-11-17: Ship of Theseus: reduced outer swell and ripple amplitudes so the water no longer dominates the hull. Checked the default view; all 14 ship tests and the production build pass, including water/foam continuity and hull contact. Refreshed the 23-scene comparison. The ship remains unaccepted for L2.

- 2026-11-17: Butterfly Dream: added two translucent tapering dream veils whose endpoints follow the butterfly's height, preserving the existing flight control. Browser checked the default view and refreshed the comparison; 8 butterfly tests and the production build pass. The effect remains subtle and the scene has not been accepted as L2.

- 2026-11-17: Brain in a Vat: added a faint liquid volume and tinted bottom ring, keeping the diffuser clear and the brain visible. Checked the browser view; 11 vat tests and production build pass, including the volume's fit within the tank. Refreshed the 23-scene comparison; L2 has not been accepted.

- 2026-11-17: Sisyphus production cycle: kept the figure visible during the rock's return, using the existing bracing pose while moving backward along the same route. The production test samples visibility and continuity at the summit and cycle restart; 12 switchback tests and production build pass. Browser checked a scene frame, but the return gait remains schematic and needs visual review; this is not L2 acceptance.

- 2026-11-17: Free Will and Determinism: widened and raised the rear hill, placed the tree on the hill surface and preserved its narrow trail. Browser checked; 13 free-will tests and production build pass, including hill contact and path clearance. Refreshed the 23-scene comparison. This is not L2 acceptance.

- 2026-11-17: Twins: added a state-bound urban forecourt with paving joints. The comparison capture now includes the different-home-environments state; inspected that screenshot. All 62 interactive-scene tests and production build pass. The illustrative pair and synthetic counts remain unchanged; L2 is not yet accepted.

- 2026-11-17: Argument frames: adjusted each participant to rest one hand on the shared table and hold the other near the face, retaining connected forearms in both frames. Comparison capture now includes one labeled alternate state for each of the nine newer interactive scenes; all nine state changes and screenshots were checked by the capture script, and the argument alternate was inspected. 62 interactive-scene tests and production build pass; L2 remains unaccepted.

- 2026-11-17: Time frames: added a shallow stone work court under the money-frame desk and chair. Inspected default and garden alternate captures; paving disappears with the money group. 62 interactive-scene tests and production build pass. The environment remains schematic and has not been accepted as L2.

- 2026-11-17: Emotion orientation: adjusted the reset camera to separate the ascending and descending routes at the default view. Inspected both frame captures; the isolated browser integration suite and production build pass. Refreshed comparison screenshots; the scene's geometry remains schematic and not accepted as L2.

- 2026-11-17: Emotion orientation: replaced the lower destination's rectangular waterfall with a flared sheet and fine water streaks, retaining its contact with the pool and clearance from route markers. Browser capture inspected and comparison refreshed; 62 interactive-scene tests and production build pass. Scene remains schematic and unaccepted for L2.

- 2026-11-17: Socratic Ignorance: enlarged both participants and the table by 15%, adjusted their spacing and lifted the dialogue bubbles. Inspected the default view; 10 Socratic tests and production build pass, including furniture support and cue clearance. Refreshed the comparison. Figures remain stylized and L2 is not accepted.

- 2026-11-17: Adjusted the Infinite Monkey default camera to show the monkey's profile, hands and keyboard together; the paper is still seen at an oblique angle. Regenerated 23 scene comparisons and nine alternate states. Browser integration passed and production build succeeded with the existing bundle-size warning. This camera adjustment does not establish L2 acceptance.

- 2026-11-17: Newcomb: moved the folded drape in front of the arch and followed its outer curve; expanded the engraved coin stacks in the transparent box. Visually inspected the default view, passed 8 Newcomb tests after replacing hard-coded stack counts with minimum coverage and retaining clearance/support assertions, and built successfully (existing bundle-size warning). Regenerated 23 comparison captures and nine alternate states. This incremental refinement is not L2 acceptance.

- 2026-11-17: Free Will: added five faceted foreground boulders and six leaf rosettes to strengthen the landscape framing. Inspected the default capture and added moving-traveler clearance coverage; all 14 Free Will tests passed and production build succeeded with the existing bundle-size warning. Regenerated 23 comparison captures and nine alternate states. Overall scene detail remains short of the concept and is not L2 accepted.

- 2026-11-17: Chinese Room: enlarged the seated operator and held card at the default framing, preserving chair and shoe contact with the floor. Visually inspected the default view, passed all 12 Chinese Room tests, and built successfully with the existing bundle-size warning. Regenerated 23 comparison captures and nine alternate states. Character and scene detail remain simplified and are not L2 accepted.

- 2026-11-17: Butterfly Dream: raised, widened and strengthened the translucent dream veils connecting sleeper and butterfly while retaining animation. Visually inspected the default scene; the effect remains subtle. All 8 Butterfly tests passed, production build succeeded with the existing bundle warning, and 23 scene comparisons plus nine alternate states were regenerated. This remains short of L2 acceptance.

- 2026-11-17: Eternal Recurrence: added a kneeling figure reaching toward the cairn as another moment around the cycle. Visually inspected the default scene; the figure is small at that framing. Added full-cycle traveler-clearance and grounding coverage; all 9 recurrence tests passed, production build succeeded with the existing bundle warning, and 23 comparisons plus nine alternate states were regenerated. The model remains short of L2 acceptance.

- 2026-11-17: Twins: enlarged the illustrative seated pair by 25% to improve readability while preserving both home-environment states. Inspected the default view; all 62 interactive-scene tests passed, including support, limb connection and both environment clearance checks. Production build succeeded with the existing bundle warning. Regenerated 23 comparisons plus nine alternate states; full L2 visual fidelity remains unaccepted.

- 2026-11-17: Time frames: added a draped chair textile and page/spine details to the money-frame workspace, scoped to that frame. Inspected the default view; 62 interactive-scene tests passed and production build succeeded with the existing bundle warning. Regenerated 23 comparisons and nine alternate states. Both frames still need substantial visual refinement to approach the concept; L2 is not accepted.

- 2026-11-17: Induction: enlarged the hen from scale 1.2 to 1.4 and shifted it away from the food bowl. Inspected the default view; the first placement failed the existing bowl-clearance check, then the adjusted position passed all 62 interactive-scene tests. Production build succeeded with the existing bundle warning; 23 comparisons and nine alternate states were regenerated. Overall fidelity remains short of L2.

- 2026-11-17: Language Across a Wall: enlarged both participants by 15% and moved the describer forward to reduce occlusion by the source model. Inspected the default view and checked participant bounds against display tables and houses in the initial scene; 62 interactive-scene tests passed and production build succeeded with the existing bundle warning. Regenerated 23 comparisons and nine alternate states. Scene remains below L2 visual fidelity.

- 2026-11-17: Sisyphus: added articulated shoulder volumes and head-attached nose, beard, and brows. All 12 switchback tests passed and production build succeeded with the existing bundle warning; 23 comparisons and nine alternate states were regenerated. The additions are barely visible at default framing; return still depicts the figure bracing the rock while backing down. Full L2 remains unaccepted.

- 2026-11-17: Trolley: added irregular paving around the switch and fasteners on its base. A combined housing-and-paving bounding box initially failed the cart clearance test; paving was separated into individual meshes, and an additional test checked each against the cart across both branch approaches. All 11 trolley tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus nine alternate states were regenerated. Scene remains short of L2 visual fidelity.

- 2026-11-17: Panopticon: increased the observation cone opacity at nonzero settings, preserving the zero-off behavior and independent cell fill lighting. Inspected the running view; architecture can occlude the rotating beam depending on angle. All 13 Panopticon tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus nine alternate states were regenerated. This is not L2 acceptance.

- 2026-11-17: Cave: added two translucent penumbra layers around each symbolic wall silhouette, sharing geometry with the original shapes. The default capture shows a subtle edge rather than physically simulated soft shadows. All 13 Cave tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus nine alternate states were regenerated. The scene remains short of L2 fidelity.

- 2026-11-17: Ship: increased swell amplitude and widened outer foam ribbons, keeping the water level beneath the hull and clearance from shore. Inspected the default capture; the sea remains stylized rather than matching the concept's detailed breaking waves. All 14 ship tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus nine alternate states were regenerated. Full L2 remains unaccepted.

- 2026-11-17: Veil: enlarged each figure 15% with feet reanchored to the podium, and shifted station objects outward to clear their gestures. Added a podium-coordinate bounds test for object/figure separation and cap footprint. All 10 Veil tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus nine alternate states were regenerated. Default capture checked; figures and architectural detail remain simplified relative to the concept, not L2 accepted.

- 2026-11-17: Brain in a Vat: varied the closed surface-fold curves with additional harmonics to reduce their regularity. Inspected the default capture; folds remain stylized and considerably less anatomical than the concept. All 11 Vat tests passed, including electrode and bubble clearance; build succeeded with the existing bundle warning. Regenerated 23 comparisons and nine alternate states; full L2 remains unaccepted.

- 2026-11-17: Socratic: added speech-bubble tails, enlarged the shared question cue by 20%, and disabled self-shadowing on overlapping cloud lobes after visual inspection revealed noise. All 10 Socratic tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus nine alternate states were regenerated. Figure and environment fidelity remain below the concept and are not L2 accepted.

- 2026-11-17: Pigeon: lightened the body and added symmetric rows of wing coverts, disabling their self-shadowing after visual review. Replaced a fixed feather-count assertion with symmetry, minimum detail and attachment checks. The 62 interactive-scene tests passed before the shadow-only change, and the subsequent build succeeded with the existing bundle warning. Regenerated 23 comparisons plus nine alternate states. Plumage remains stylized and full L2 is not accepted.

- 2026-11-17: Schedules: added emissive highlights to the active schedule lamp and completed progress markers, preserving one shared response stream. Extended the state test to verify emissive markers and exactly one active lamp; all 62 interactive-scene tests passed and build succeeded with the existing bundle warning. Updated the review capture to include five responses in variable-ratio mode, inspected the result, and regenerated 23 comparisons plus alternate states. Overall scene remains below L2 fidelity.

- 2026-11-17: Argument frames: moved both drawing pencils between the participants' hands and the shared sheet; they remain scoped to the drawing frame. Added endpoint-to-hand checks; all 63 interactive-scene tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus alternate states were regenerated. Inspected the drawing frame; pencils remain small at the default scale, and scene fidelity remains below L2.

- 2026-11-17: Emotion orientation: replaced rectangular route signs with upward- and downward-angled arrow-shaped signs; the existing state-driven highlight remains. Inspected the default capture, passed all 63 interactive-scene tests, built successfully with the existing bundle warning, and regenerated 23 comparisons plus alternate states. Terrain, figures, and destinations remain simplified relative to the concept; full L2 remains unaccepted.

- 2026-11-17: Infinite Monkey: moved the hourglass and its grounded stack to a clearer location in the default side view. Visually inspected the result; the page remains too oblique to read clearly. All 7 Monkey tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus alternate states were regenerated. Scene fidelity remains below L2.

- 2026-11-17: Stimulation: added a grounded exterior preparation tray with an empty bowl and scoop, kept independent of the response-controlled food. Added a test for chamber clearance, grounding and unchanged prop state after a choice. All 64 interactive-scene tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus alternate states were regenerated. Inspected the default view; the overall apparatus and animal remain simplified relative to the concept and are not L2 accepted.

- 2026-11-17: Emotion orientation: connected both routes to the entry landing and corrected the descending route to start at landing height and descend monotonically, replacing a nearly one-unit jump. Added geometric tests for connector coverage and step heights; all 65 interactive-scene tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus alternate states were regenerated. The downward slope is visually shallow because the current stage floor is fixed; it still differs substantially from the concept and is not L2 accepted.

- 2026-11-17: Emotion orientation: raised the common landing, reanchored the traveler and entrance arch, added four grounded approach steps, and reprofiled both connected routes so the downward branch has a visible .52-unit descent while the upper route meets the pavilion. Added approach continuity checks and updated the traveler support check. All 66 interactive-scene tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus alternate states were regenerated. Visual inspection confirms stronger height contrast; stairs remain blocky and full L2 is not accepted.

- 2026-11-17: Emotion orientation: added staggered tread joints, extended the uphill terrain under the stairs, and added four shrubs grounded to the slope. Added raycast support and route-marker clearance checks; all 67 interactive-scene tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus alternate states were regenerated. Default capture checked; most foliage remains behind the stairs and the scene remains below L2 visual fidelity.

- 2026-11-17: Free Will: added concentric and radial joints to the shared paving junction and enlarged the rear tree 25%, keeping its root on the hill. Added full-path figure clearance and gate/evergreen clearance checks. All 15 Free Will tests passed, build succeeded with the existing bundle warning, and 23 comparisons plus alternate states were regenerated. Default capture inspected; vegetation and figures remain simplified relative to the concept and full L2 is not accepted.

- 2026-11-17: Expanded scene review capture to pause each scene at one instant and record slider 0 and 1 for all 14 original scenes, alongside nine interactive alternate states and the schedule progress example. Verified 14 endpoint pairs exist; 13 have different image hashes and Eternal Recurrence has identical endpoint images, consistent with its closed loop. Hash differences do not prove visual correctness; speed-dependent controls and other views require dynamic review. Updated MODEL_REVIEW.md; this evidence does not establish L2 completion.

- 2026-11-17: Infinite Monkey: replaced static marks on the three scattered pages with twelve rows of schematic output that appear and disappear with sequence progress, giving a visible cue in the default view where the typewriter page is edge-on. Verified zero, half, full and reverse progress in 8 passing Monkey tests; production build succeeded with the existing bundle warning. Regenerated 23 comparisons and inspected the full-progress capture. The main typewriter page remains oblique and scene fidelity is not L2 accepted.
`n- 2026-11-17: Infinite Monkey: inclined the typewriter sheet backward from its platen, revealing more of its marked surface at the default camera angle. Checked the resulting capture and added tests for platen alignment, slope and mark placement. All 9 Monkey tests passed; production build succeeded with the existing bundle-size warning, and 23 comparisons plus interaction states were regenerated. The sheet remains small in the full-scene view and the overall scene is not L2 accepted.
`n- 2026-11-17: Chinese Room: added timber plank joints and edge molding to the desk and moved the default camera closer for greater readability. Inspected slider endpoints to confirm both card trays and their cards remain visible. All 12 Chinese Room tests passed and the production build succeeded with the existing bundle-size warning; regenerated 23 scene comparisons. The operator, room architecture and furniture remain stylized and full L2 fidelity is not accepted.
`n- 2026-11-17: Twins: added a balance medallion to the central arch and matching curls, eyebrows, nose and mouth to both seated figures, referring to the concept while retaining the single illustrative pair and existing synthetic-population display. Inspected default and alternate-environment captures; all 67 interactive-scene tests passed and production build succeeded with the existing bundle warning. Regenerated 23 comparisons and alternate states. The figures and scenery remain simplified and are not L2 accepted.
`n- 2026-11-17: Trolley: rebuilt the background ruin as a two-bay arcade with a center pier and climbing foliage, and raised the garden tree without expanding its horizontal footprint. An initial wider tree intersected the moving tram bounding box; corrected the scale and verified both branch approaches. Inspected the default capture, passed 12 trolley tests plus the scene-disposal test, built successfully with the existing bundle warning, and regenerated 23 comparisons and interaction states. Overall visual fidelity remains below L2.
`n- 2026-11-17: Ship: replaced the 60 short hull sections with 36 longer staggered boards and moved their end pegs, better matching the concept image. Preserved individually reversible replacement using a permutation coprime to 36; the test checks every board count. Disabled self-shadowing on the thin side skins to reduce artifacts. Inspected default and both slider endpoints, passed 14 ship tests plus scene disposal, built successfully with the existing bundle warning, and regenerated 23 comparisons. Some dark seam artifacts remain and the overall scene is not L2 accepted.
`n- 2026-11-17: Ship: investigated dark diagonal artifacts on replacement planks. A radial ray sample found no hull-core protrusions at sampled panel vertices; hiding the cylindrical joint meshes removed the visible streaks. Replaced those meshes with fine lines following the same tapered board edges and visually checked the full-replacement state. The 14 ship tests and scene-disposal test passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. This fixes the observed seam artifact, not the outstanding L2 fidelity work.
`n- 2026-11-17: Newcomb: added folded corner plates and rivets to the sealed box, and brought the default camera closer. Inspected both slider endpoint captures; the boxes, choice plaques and stage remain visible. All 8 Newcomb tests passed, including preservation of the opaque closed box; production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Fidelity remains below L2 and awaits further work.
`n- 2026-11-17: Butterfly: added translucent irregular dream-cloud contours and floating petal shapes behind the insect, following its changing height. Inspected the default capture; the contours are intentionally subtle and still less substantial than the concept illustration. All 9 Butterfly tests and scene-disposal test passed; production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The scene remains below L2.
`n- 2026-11-17: Pigeon: added fixed muted violet lower-neck plumage and minor clock ticks while preserving the three larger step marks and existing reward logic. Inspected the default capture; the plumage is subtle at full-scene scale. All 67 interactive-scene tests and scene-disposal test passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The bird and chamber remain simplified relative to the concept and are not L2 accepted.
`n- 2026-11-17: Free Will: enlarged the moving traveler by 25 percent to improve its scale relative to the gates, and adjusted its origin to keep the shoes on the path. Inspected default and one slider endpoint, passed all 15 Free Will tests including full-path clearance, and passed scene disposal and production build with the existing bundle warning. Regenerated 23 comparisons and interaction states. The figure and vegetation remain stylized relative to the concept; L2 is not accepted.
`n- 2026-11-17: Cave: varied the size and depth of the twelve overhead rock facets and disabled their individual shadow casting, eliminating a repeated sawtooth pattern across the wall while retaining the main overhang shadow. Inspected the default capture; 13 cave tests and the scene-disposal test passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The cave remains a simplified cutaway and is not L2 accepted.
`n- 2026-11-17: Veil: added a shallow translucent fabric crown joined to the curtain rim; it gathers and fades with the existing control. Inspected both slider endpoints and added a geometry test for rim continuity and gathering. All 11 Veil tests and scene-disposal test passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The fabric remains simpler than the conceptual drape and L2 is not accepted.
`n- 2026-11-17: Time Frames: added low, instanced soil clods to the garden bed, retained in both planted and fallow examples and hidden with the money frame. Added tests for bounds and state visibility; all 68 interactive-scene tests plus scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Inspected the garden frame; the texture is subtle at full-scene scale and overall fidelity remains below L2.
`n- 2026-11-17: Panopticon: added a continuous dark curved coping over the rear upper wall while preserving the open front. Inspected the default image and tested that the coping covers all ten exposed upper-tier bays. Fourteen Panopticon tests and scene disposal passed; production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Overall scene fidelity remains below L2.
`n- 2026-11-17: Recurrence: added a seated resting moment on the outer verge, with a supporting rock and attached limbs, to extend the repeated-life vignettes. Cleared nearby border plants and rocks after detecting an intersection; checked grounding, border clearance and the full moving-traveler cycle. All 10 Recurrence tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Inspected the default view; the additional figure remains stylized and the scene is not L2 accepted.
`n- 2026-11-17: Socratic: added an armillary on a grounded stone pedestal, referring to the concept artwork. Inspected the default capture and tested clearance from both participants, dialogue cues and table across the slider range. All 11 Socratic tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The figures and surroundings remain simplified and are not L2 accepted.
`n- 2026-11-17: Induction: added a fixed lantern at the shelter eave, clear of the hen and independent of the day/outcome state. Inspected the default capture; the lantern remains partly obscured at the normal view. A test checks clearance and appearance through the counterexample; all 69 interactive-scene tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. A proposed gate backdrop was discarded after visual inspection because it looked detached. Scene fidelity remains below L2.
`n- 2026-11-17: Infinite Monkey: added small instanced fur locks attached to all four articulated arm segments. Reduced their size and contrast after the first capture appeared too spiky. Verified they follow the moving arms, inspected the revised default capture, passed all 10 Monkey tests and scene disposal, built successfully with the existing bundle warning, and regenerated 23 comparisons. The character remains simplified and the scene is not L2 accepted.
`n- 2026-11-17: Language Wall: added an unbuilt thought bubble containing a house outline and question cue above the receiver. It disappears after reconstruction and returns on reset, avoiding a premature claim about the result. Inspected the default and built captures, added state/clearance checks, passed 70 interactive-scene tests plus scene disposal, built successfully with the existing bundle warning, and regenerated 23 comparisons. The characters and setting remain simplified; L2 is not accepted.
`n- 2026-11-17: Stimulation: moved the visitor budget display outside the chamber and grounded it on the stage, reducing overlap with the animal and visually separating visitor choices from the illustration. Inspected the default capture; updated support and clearance checks, passed all 70 interactive-scene tests and scene disposal, built successfully with the existing bundle warning, and regenerated 23 comparisons. Animal and apparatus still need fidelity work; L2 is not accepted.
`n- 2026-11-17: Sisyphus: moderately raised the exposed rock fins outside the protected switchback corridor to strengthen the mountain silhouette. Reduced the first proposed heights after they appeared too pointed, then inspected the revised capture. All 12 switchback tests passed, including production fin clearance and figure continuity; several path tests exercise the review-route implementation. Production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The mountain and figure remain simplified relative to the concept; L2 is not accepted.
`n- 2026-11-17: Sisyphus: increased the torso lean while offsetting the head to avoid the loaded boulder, and added an articulated neck between shoulder and head. A new production-asset test samples 81 points over the full cycle, checks head-to-triangle clearance and arm/neck connections, and passes alongside the 12 existing switchback checks and scene disposal. This sampling is not a continuous collision proof; several older route checks still use the review implementation. Inspected the default capture, built successfully with the existing bundle warning, and regenerated 23 comparisons. The figure and landscape remain below L2.
`n- 2026-11-17: Brain in a Vat: disabled dense self-shadowing on the brain folds and added a fixed lid lamp with warm fill, improving specimen visibility through the glass without tying illumination to signal strength. Inspected the default capture and tested lamp position and state independence; all 12 Vat tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Brain anatomy remains stylized and the scene is not L2 accepted.
`n- 2026-11-17: Argument Frames: added grounded low stone walls behind the shared courtyard, visible in both frames and clear of the speakers, table and tree. Inspected the default capture and tested both frame states; all 71 interactive-scene tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The participants and surrounding landscape remain simplified; L2 is not accepted.
`n- 2026-11-17: Emotion Orientation: added flush paving joints and staggered masonry lines to the common raised landing, keeping the existing traveler support and two connected routes. Inspected the default capture and tested alignment and visibility in both frames; all 72 interactive-scene tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The landforms and characters remain simplified; L2 is not accepted.

- 2026-11-17: Reinforcement Schedules: added a fixed background plant between the two apparatus cabinets, referring to the concept while keeping it independent of schedule state. Inspected the default capture and checked grounding, cabinet clearance and both modes; all 73 interactive-scene tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Apparatus and surroundings remain simplified; L2 is not accepted.

- 2026-11-17: Self-stimulation: reshaped the illustrated rat's body into a raised haunch and narrower shoulder, and made the dorsal coat and fur follow the same surface. Disabled fur-instance shadow casting to reduce dense self-shadowing. Inspected the default image; the change is subtle at scene scale. The 73 interactive-scene checks and scene-disposal test passed, the production build succeeded with the existing bundle warning, and 23 comparison captures were regenerated. The animal and apparatus remain simplified and L2 has not been accepted.

- 2026-11-17: Butterfly: extended the blossom tree toward the dream frame with two curved boughs and attached flowering offshoots, better matching the concept's spreading canopy. Inspected the default capture; the flowers remain stylized and the tree partly overlaps the frame by design. All 9 Butterfly tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Tests cover the existing scene and animation, not every viewing angle of the new boughs; overall L2 fidelity remains unaccepted.

- 2026-11-17: Chinese Room: filled the area above the paired window arches with shaped masonry that joins the existing upper wall, leaving the arched apertures open. Inspected the default capture and used ray intersections to check the two openings and wall above them. All 13 Chinese Room tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The room and operator remain simplified relative to the concept; L2 has not been accepted.

- 2026-11-17: Emotion Orientation: extended the ascending terrain into the space between the two routes and added slope-following flowering shrubs. Inspected the default capture and ray-tested shrub support and marker clearance for both frames and examples. All 74 interactive-scene tests and scene disposal passed; production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The slope remains faceted and the scene has not reached L2 fidelity.

- 2026-11-17: Newcomb: replaced the thick coins in each visible stack with twice as many thinner discs and alternating gold tones while preserving stack height, top engraving and support on the box base. Inspected the default capture; the stacks remain stylized at scene scale. All 8 Newcomb tests, including closed opaque box and stack contact, and scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Overall L2 fidelity remains unaccepted.

- 2026-11-17: Free Will: replaced the two stacked-cone evergreens with continuous slender cypress crowns and surface foliage, bringing their silhouette closer to the concept image. Inspected the default capture and ran the full 15 Free Will path, gate and clearance checks plus scene disposal; all passed. Production build succeeded with the existing bundle warning and 23 comparisons were regenerated. The environment and figure remain stylized and L2 is not accepted.

- 2026-11-17: Infinite Monkey: moved the default camera closer while keeping the platform in the desktop review frame, and added a grounded closed volume with separate cover, pages and page-edge lines outside the study ensemble. Inspected the default capture; a closer first camera cropped the platform and was adjusted. Eleven Monkey tests, including volume clearance and typing, plus scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Other aspect ratios and viewpoints remain to be checked; the scene is not L2 accepted.

- 2026-11-17: Ship: brought the default camera closer and added a deterministic woven texture to the existing curved sail, preserving its coloured bands and seams. Enabled mipmaps and linear filtering after the initial capture showed coarse aliasing; inspected the revised default image. All 14 ship tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The sail texture is subtle at full-scene scale; mobile views and overall L2 fidelity remain unverified. A proposed stronger Vat liquid tint was visually rejected and reverted because it obscured the specimen.

- 2026-11-17: Time Frames: added faceted stone borders to the sides of the garden bed and changed its exposed sides to an earthen tone. Inspected the garden alternate capture; the fixed stones remain in both planted and fallow states and disappear with the money frame. All 75 interactive-scene tests and scene disposal passed, including ground contact and watering-can clearance; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. The garden remains stylized and L2 has not been accepted.

- 2026-11-17: Pigeon: removed distracting wall shadows from three retained roof supports, disabled shadows from thin flight-feather meshes, and moved the default camera closer. Inspected the default capture; the timer and food tray remain visible, though the bird remains stylized. All 75 interactive-scene tests and scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Other screen sizes and overall L2 fidelity remain unverified.

- 2026-11-17: Pigeon: replaced protruding dark wing-band ellipsoids with strips following the folded wing surface, and disabled self-shadowing on small neck details. Inspected the default capture; the bars are subtle beneath the overlapping feathers and the bird remains stylized. All 76 interactive-scene tests, including wing-surface placement and behavior states, and scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 is not accepted.

- 2026-11-17: Socratic: brought the default camera closer and replaced one page's placeholder strokes with an intersecting-circle sketch shared by both speakers. Inspected the default capture; the sketch remains small at scene scale. All 12 Socratic tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Other viewports and overall L2 fidelity remain unverified.

- 2026-11-17: Sisyphus: raised three rear terrain peaks and lowered the default camera slightly to give the mountain more vertical presence. Added a production-geometry ray test at 99 route positions and three lateral offsets; it passed along with the existing switchback and scene-disposal checks (15 total). These samples do not prove continuous clearance, and several other route tests still use the review implementation. Inspected the default capture, built successfully with the existing bundle warning and regenerated 23 comparisons. Terrain and figure remain simplified relative to the concept; L2 is not accepted.

- 2026-11-17: Sisyphus: moderately enlarged the figure's torso and head and raised the hip and shoulder for a taller pushing silhouette, retaining the existing foot anchors and target-on-boulder arm rig. The production asset check sampled 81 points over the full cycle using the enlarged head radius and verified head clearance and arm/neck connectivity; this is not continuous collision proof. Fourteen switchback tests plus scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Inspected the default capture; the figure remains small and stylized, so L2 is not accepted.

- 2026-11-17: Sisyphus: changed hand targeting from nearest boulder vertex to nearest point on its triangle surface, avoiding discrete vertex snaps. A planar indexed/non-indexed test checks continuous projection across an edge; production-asset tests sampled both hand contacts at 41 cycle points and head/arm clearance at 81 points. The legacy and switchback test suites plus disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Projection checks 3,304 boulder triangles per hand per update; mobile performance and continuous motion are not established, and L2 remains unaccepted.

- 2026-11-17: Eternal Recurrence: added radial crown joints and attached climbing foliage to the entrance arch. Inspected the default capture and sampled traveler clearance over 81 states. Eleven Recurrence tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The foliage is small at scene scale and L2 remains unaccepted. Separately, 1,000 hand projections against the 3,304-triangle production boulder took approximately 80 ms in a local Node benchmark; this does not measure browser frame time or mobile performance.

- 2026-11-17: Cave: increased the depth of the overhead shelf and extended its triangulated upper strata and front facets to match, giving the cutaway more interior depth. Inspected the default capture and checked roof/cap alignment and figure clearance at sampled slider positions. All 14 Cave tests and scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. The roof remains a simplified cutaway, and full L2 fidelity is not accepted.

- 2026-11-17: Twins: added a shared layered landscape inside the central arch, behind both home alternatives and their comparison indicators. The sky was shaped to the opening after a rectangular first version visibly stopped below the arch. Inspected both environment captures; all 77 interactive-scene tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The backdrop is a stylized planar illustration; overall L2 fidelity remains unaccepted.

- 2026-11-17: Veil: gave the lowest station a timber body, cap and stairs, with parallel joints on the circular cap, adding material variety while retaining the existing station height, object and figure support. Inspected the raised-veil capture. All 11 Veil tests and scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. The architecture and figures remain simplified and L2 is not accepted.

- 2026-11-17: Trolley: added instanced low meadow grasses in open areas outside the sampled track centerlines, switch, tree and garden fixtures. Inspected the default capture; the grass remains stylized at this scale. The new clearance check and 12 existing Trolley tests plus scene disposal passed after correcting a duplicate test import; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. The tram, figures and terrain remain below L2 fidelity.

- 2026-11-17: Reinforcement Schedules: rebuilt the shared background plant as a main stem with lateral branches and shaped leaves, replacing the previous V-shaped chain of overlapping ellipsoids. Inspected the default capture and verified the plant remains clear of the cabinets and independent of the mode. All 77 interactive-scene tests and scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. The plant and apparatus remain simplified; L2 is not accepted.

- 2026-11-17: Language Wall: replaced the regular floor grid with irregular, slightly separated stone slabs clipped to the circular base. The slab surface remains one millimeter above the supporting base and below the original furniture and figure contact height. Inspected the default capture; all 78 interactive-scene tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Characters and furnishings remain simplified; L2 is not accepted.

- 2026-11-17: Induction: rebuilt the round hay roll as a grounded rectangular bale with two bindings and individual surface straw marks, matching the concept's silhouette more closely. Inspected the default capture and verified the bale clears the gate while days advance. All 79 interactive-scene tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. An attempt to raise the shelter and move the hen was reverted after visual overlap and clearance failures. Scene fidelity remains below L2.

- 2026-11-17: Argument Frames: added a bordered woven rug under the shared furniture and changed its muted tone with the selected frame, retaining the same participants and support height. Inspected both frame captures; all 80 interactive-scene tests and scene disposal passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The figures and architecture remain stylized; L2 is not accepted.

- 2026-11-17: Self-stimulation: tapered the animal's head toward the snout while retaining the existing ears, eyes and choice indicators. Inspected the default capture; all 80 interactive-scene and disposal tests passed, the production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. The animal and apparatus remain stylized; L2 is not accepted.

- 2026-11-17: Pigeon: replaced isolated neck-colour dots with a continuous neck mesh and colour transition over the breast. Inspected the default capture; the neck remains stylized and the transition is still abrupt. All 81 interactive-scene and disposal tests passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Full L2 fidelity remains unaccepted.

- 2026-11-17: Butterfly: replaced the two simple garden flowers with branched, layered peony-like blossoms, leaves and buds, scaled to read beside the pond. Inspected the default capture; flowers remain stylized and lack the concept's detailed petal surfaces. Nine Butterfly tests passed after scaling, including sampled flight clearance; scene disposal passed before the scale adjustment. Production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Butterfly: rebuilt the peony petals as thin cupped surfaces after the previous rounded petals appeared bead-like. Inspected desktop and 390-pixel simulated viewport captures; both remain stylized and this is not a physical-device performance check. Nine Butterfly tests and scene disposal passed; production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Overall L2 remains unaccepted.

- 2026-11-17: Argument Frames: rebuilt the shared arch supports with broader, individually jointed stone shafts and capitals, moved their vines forward, and moved the frame indicator in front of the enlarged center shaft after it was obscured. Inspected default and alternate captures before the badge adjustment and the final default capture. Automated checks cover both frame states, support continuity and indicator clearance; all 82 interactive-scene and disposal tests passed. Production build succeeded with the existing bundle warning; 23 comparisons were regenerated. Architecture and figures remain stylized and L2 remains unaccepted.

- 2026-11-17: Chinese Room: added projecting masonry surrounds, solid arched caps and edging around both card passages. Replaced an initially floating arch outline with a connected stone cap after inspecting the capture. Checked default and slider endpoint images; card clearance was sampled at 21 slider values. All 14 Chinese Room tests and scene disposal passed; production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Materials and characters remain stylized; L2 is not accepted.

- 2026-11-17: Time Frames: enlarged the gardener and adjusted the arms so the hands continue to meet the soil in both garden examples. Inspected the alternate-frame capture; the character remains stylized and the planted row partially overlaps the pose from the default camera. All 82 interactive-scene and disposal tests passed; production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Overall L2 remains unaccepted.

- 2026-11-17: Ship: darkened the sea, changed the swell and finer ripples, and narrowed the foam ribbons after the previous capture showed broad pale triangular patches. Inspected the default capture; waves and foam are still stylized and lack the reference's detailed breaking crests. All 14 ship tests and scene disposal passed, including sampled surface and edge contact; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Ship: added a shared procedural wood-grain texture with board-aligned UVs to the independently replaceable hull planks; inspected default and fully replaced captures. Fixed scene disposal to deduplicate and release material textures, including the existing sail map, and removed the now-redundant manual switchback-road texture disposal. Expanded the disposal test to watch textures. Thirty ship, switchback and disposal tests passed; production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. Grain is subtle at the default view and L2 remains unaccepted.

- 2026-11-17: Cave: enlarged the three seated figures and the departure figure by 25%, kept their feet grounded, extended restraint chains to the scaled hands, and moved the departure endpoint slightly after it intersected the first step. Inspected default and seated captures. Fourteen cave tests and scene disposal passed, including sampled departure and chain checks; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Figures remain stylized and small relative to the concept; L2 remains unaccepted.

- 2026-11-17: Free Will: enlarged the paired archways and replaced bead-like vine leaves with thin shaped leaf surfaces. Inspected the default capture; the gates still lack the masonry and foliage detail of the concept. Fifteen Free Will tests and scene disposal passed, including sampled clearance and both path endpoints; production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Panopticon: replaced the opaque upper observation cylinder with a framed, translucent glazed room, floor and ceiling; the room remains empty and the beam remains an illustrative control. Inspected the default capture and added a ray check for the open interior. Fifteen Panopticon tests and scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Interior detail and materials remain simplified; L2 remains unaccepted.

- 2026-11-17: Induction: replaced overlapping rounded wing pieces with feather surfaces that follow the hen's folded wings. Inspected the default capture and added a ray-based check against the underlying wing mesh; all 83 interactive-scene and disposal tests passed. Production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Hen anatomy and feathers remain stylized and below the concept's fidelity; L2 remains unaccepted.

- 2026-11-17: Socratic: enlarged the connected dialogue arrangement, including table, chairs, participants, carpet and question cues, around the floor. Inspected the default capture. Updated the tabletop book check to account for the parent world transform; twelve Socratic tests and scene disposal passed. Production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Figures and furnishings remain stylized and overall L2 is not accepted.

- 2026-11-17: Newcomb: enlarged and slightly repositioned the observer bust while retaining clearance from books, boxes and choice controls. Inspected the default capture; the figure remains stylized. Eight Newcomb tests and scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Corrected the stale Universal Base Characters candidate status in the asset record; the rig remains evaluation-only. L2 remains unaccepted.

- 2026-11-17: Sisyphus: added shallow irregular fissures to the rear ridges and widened selected rock fins outside the road corridor. Inspected the default capture; fissures are subtle and the rocks remain angular. Sixteen switchback and disposal tests passed, including production fin clearance and sampled road/terrain cross sections; several other switchback checks still target the review implementation. Production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Candidate rig contact on the production rock and overall L2 fidelity remain unresolved.

- 2026-11-17: Sisyphus: added a full-cycle test of the loaded production boulder against the rendered production road. It exposed longitudinal overhang at the summit; the cycle now reverses 0.8 route units before the endpoint, retaining continuous motion. At 81 sampled times, every fourth boulder vertex remained within a sampled road corridor and the selected lowest contact point was within 0.045 units above / 0.025 below the rendered road. Inspected an approximate summit-time capture; perspective makes the rock and figure overlap visually and the pose remains simplified. Seventeen switchback and disposal tests passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Correction to the preceding entry: review/sisyphus-switchback/route.js re-exports the production route, so those route-function tests do exercise the shared production implementation, though they do not all exercise the production scene. These samples do not establish continuous collision freedom or L2 acceptance.

- 2026-11-17: Emotion Orientation: recessed the grotto back and added a shallow arched inner shell, moving the waterfall inside and extending the stream to the pool. Inspected the default capture and added a ray check for the recessed back and a watercourse connection check in both frames. All 84 interactive-scene and disposal tests passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. The cavity and water remain simplified and L2 remains unaccepted.

- 2026-11-17: Twins: added a stone-coloured gable face, attic window and timber verge boards to each cottage roof, keeping these details under their own environment group. Inspected the default capture and removed shadow artifacts on the gables. All 84 interactive-scene and disposal tests passed, including environment switching; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Houses and figures remain stylized and L2 remains unaccepted.

- 2026-11-17: Brain in a Vat: replaced the repeated closed cortex loops with varying open meandering ridges across each hemisphere. Inspected the default capture; the form remains schematic and the ridges are still visibly patterned, not anatomical reconstruction. Twelve vat tests and scene disposal passed, including electrode, bubble and signal checks; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Veil: reshaped the curtain lower edge into curves that meet the twelve post bases in the lowered state, while retaining the upward-gathering control. Inspected lowered and default captures and added a check for all post anchors and intervening rises. Twelve Veil tests and scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Fabric and figures remain stylized; L2 remains unaccepted.

- 2026-11-17: Eternal Recurrence: thinned and raised the central canopy base volumes to expose more branches, and added an irregular earth bed with embedded stones inside the seat ring. Inspected the default capture and checked the new ground details remain inside the ring. Twelve Recurrence tests and scene disposal passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. The tree and figures remain stylized and L2 remains unaccepted.

- 2026-11-17: Trolley: changed the windows to translucent glazing and added paired interior benches attached to the moving tram. Inspected the default capture; interior remains small and dark at the default viewpoint. Fourteen Trolley tests and scene disposal passed, including both-branch movement and wheel alignment; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. The tram and figures remain stylized; L2 remains unaccepted.

- 2026-11-17: Stimulation: replaced the hard-edged dorsal coat with a vertex-colour gradient and finer low-relief fur instances. Inspected the default capture: the edge is softer, but the fur remains visibly patterned and the animal remains schematic compared with the concept. All 84 interactive-scene and disposal tests passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Ship: extended the mast above the yard and added masthead lashings and paired stays to the yard ends. Inspected the default capture; the hull and sea remain simplified compared with the concept. Sixteen ship and disposal checks passed, including mast and yard connections under hull motion; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Argument Frames: changed the war illustration to an eight-by-eight board with 32 pieces and distinct pawn and back-rank profiles; the example still advances one pawn. Inspected the default capture: pieces are small at the default viewpoint, and people and environment remain schematic compared with the concept. All 85 interactive-scene and disposal tests passed, including board support and example movement; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Cave: replaced opaque wall silhouettes and hard penumbra layers with three procedural translucent soft-edged masks, preserving the wall's visible facets. Inspected the default capture; projections are illustrative and do not simulate the fire or object positions. Sixteen cave and disposal checks passed, including mask coverage and departure state; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. The cave and figures remain stylized; L2 remains unaccepted.

- 2026-11-17: Pigeon: replaced angular wing coverts with rounded surfaces following the folded wing and reduced their colour contrast after inspecting the first capture. The default view remains schematic and the small feather pattern still appears regular. All 85 interactive-scene and disposal checks passed, including feathers following bird movement; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Chinese Room: added a curved timber crown connecting the library stiles, echoing the arched concept. Inspected the default capture; the crown is visible, while the operator and room remain stylized and differ substantially from the concept. Sixteen Chinese Room and disposal checks passed, including the crown's clearance from traveling cards; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Butterfly Dream: added broken highlights along the existing cascade and foam where it reaches the pond. Inspected the default capture: the waterfall is clearer but remains narrow and schematic; the sleeper and landscape remain substantially simplified. Eleven butterfly and disposal checks passed, including highlight alignment and foam over the pond; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Newcomb: reshaped the drape folds and added a continuous section over the depth of the arch with a short fall behind it. Inspected the default capture; the cloth remains simplified compared with the concept. Ten Newcomb and disposal checks passed, including cloth continuity and clearance from both boxes; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Free Will: broadened and modestly raised the rear hill, keeping the existing trail, rocks and tree on the terrain. Inspected the default capture; the path remains small and partially obscured by the traveler, and the landscape remains simplified. Seventeen Free Will and disposal checks passed, including sampled trail-to-terrain contact and both figure routes; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Infinite Monkey: added a fan of typebars behind the typewriter keys. Inspected the default capture; the new mechanism is largely obscured at this scale and the monkey and furniture remain simplified. Thirteen monkey and disposal checks passed, including sampled clearance from typing hands; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Induction: varied the forecourt stone outlines, orientations and offsets. Inspected the default capture; the pattern remains visibly row-based and the hen and shelter remain simplified relative to the concept. All 85 interactive-scene and disposal checks passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Veil: replaced the six smooth robe bodies with a shared folded surface that flares toward the hem. Inspected the default capture; folds are subtle at this scale and the figures remain schematic compared with the concept. Thirteen Veil and disposal checks passed after correcting a vertex-attribute API error caught on the first run; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Time Frames: replaced paired spherical garden leaves with multiple shaped leaves and varied plant poses. Inspected the garden-frame capture; the plants remain small and regular at the default viewpoint and the overall environment is still schematic compared with the concept. All 85 interactive-scene and disposal checks passed, including planted/fallow switching; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Socratic: replaced the separate spherical lobes of the shared question with a continuous shallow cloud and adjusted its material after the first capture to keep the question legible. Inspected the final default capture; the cloud is flatter while the figures and setting remain schematic compared with the concept. Thirteen Socratic and disposal checks passed, including dialogue gestures and clearance; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Emotion Orientation: added connected rock masses at the sides and top of the recessed cave, linking its surround to the pavilion hill. Inspected the default capture; the rocks remain angular and the larger landscape and traveler are simplified compared with the concept. All 86 interactive-scene and disposal checks passed, including rock clearance from the waterfall, stream and route marker in both frames and examples; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Language Wall: replaced the unbuilt thought's separate spherical lobes with a continuous shallow cloud, leaving the house sketch and question visible. Inspected the default capture; the cloud reads more clearly but the people, house and setting remain schematic compared with the concept. All 86 interactive-scene and disposal checks passed, including unbuilt/build visibility; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Trolley: added an irregular flared trunk and four substantial branches to the garden tree. Inspected the default capture; the tree reads as a forked trunk but its canopy and the figures remain schematic compared with the concept. Fifteen Trolley and disposal checks passed, including clearance from people and sampled tram motion on both routes; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Reinforcement Schedules: added neutral procedural grain to shared stone and wood materials in the cabinet details, without adding indicators. Inspected the default capture; texture is subtle at this scale and the apparatus remains simplified compared with the concept. All 86 interactive-scene and disposal checks passed, including mode/progress state and shared-resource disposal; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Twins: replaced coarse cottage roof tiles with smaller rows of subtly varied slate tiles. Inspected the default capture; roof pattern is visible, while houses and figures remain simplified compared with the concept. Updated the roof check to verify tile positions and environment switching rather than the old material/count assumptions; all 86 interactive-scene and disposal checks passed. Production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Brain in a Vat: increased liquid tint and added two faint curved-glass reflections. Inspected the default capture; the brain remains visible, but the container and specimen remain schematic compared with the concept. Thirteen vat and disposal checks passed, including bubbles, electrode contacts and signal behavior; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Sisyphus: added world-aligned procedural rock grain to the mountain terrain without changing its geometry. Inspected the default capture; grain is subtle at this scale, and the mountain silhouette, wide path and stylized figure remain substantially different from the concept. Seventeen switchback and disposal checks passed, including sampled road/terrain and loaded-boulder contact through a cycle; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Ship: increased the sea swell frequency and added more tapered foam at the corresponding crests while retaining the protected hull footprint. Inspected the default capture; waves are more visible but still regular and simplified compared with the concept. Sixteen ship and disposal checks passed, including foam-to-surface sampling and hull clearance; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Eternal Recurrence: connected outer tree crowns to the main forks and added a sparse lower leaf layer. Inspected the default capture; the trunk remains visible but the canopy still looks layered and schematic. Thirteen Recurrence and disposal checks passed, including the walking cycle and tree clearance; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Panopticon: added constant warm bounce to the cell side linings, independent of observation-beam control. Inspected the default capture; the lighting change is subtle and bars still obscure portions of the interiors. Seventeen Panopticon and disposal checks passed, including fixed lining warmth and beam behavior; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Stimulation: shortened the rat's body slightly, raised its haunch and adjusted the tail start to follow the revised silhouette. Inspected the default capture; the animal remains stylized and the fur is patterned rather than realistic. All 86 interactive-scene and disposal checks passed, including animal support and state markers; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Trolley: extended the six figures' robes toward the feet and added subtle vertical folds, retaining individual mantle colours and gestures. Inspected the default capture; the longer silhouettes are visible but the figures remain stylized compared with the concept. Sixteen Trolley and disposal checks passed, including robe hem clearance, hand positions and route motion; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Ship: increased the hull skin from three to five staggered courses, with 60 individually replaceable boards and adjusted pegs and joints. Inspected the default capture; the finer courses are visible, although hull material and shape remain simplified versus the concept. Updated board-count checks and verified every replacement step; sixteen ship and disposal checks passed, production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Sisyphus: tested narrower road widths with the loaded boulder; half-width .68 failed footprint samples and .70 passed samples but provided little visual difference and less clearance, so restored .72. Added fine erosion marks to the existing road texture, leaving contact geometry unchanged. Inspected the default capture; marks are subtle and the road-to-boulder proportion remains unresolved. Seventeen switchback and disposal checks passed after restoration; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Cave: increased actual depth variation of the triangulated wall facing and moved the backing wall behind it. Inspected the default capture; the rock surface remains angular and the independent shadow masks are not physical projections and may separate at oblique angles. Sixteen cave and disposal checks passed, including facing depth ordering and departure; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Cave: projected the three existing soft masks onto a subdivided mesh sampled from the rock facing instead of using flat planes. Sixteen cave and disposal checks passed, including sampled vertex-to-wall gaps; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. Inspected the default capture; the masks remain illustrative rather than physically cast, and oblique views still require visual review. L2 remains unaccepted.

- 2026-11-17: Cave: visually checked the projected illustrative masks from an oblique angle; no obvious separation was visible from that view. An experimental faceted outer side-wall surface produced regular vertical streaks and was removed after visual inspection. The exposed side wall remains a plain cut surface; the cave and the other scenes still require L2 work and review.

- 2026-11-17: Infinite Monkey: changed the study floor to muted green and the carpet to a warmer red in closer reference to the concept, and added a marked page that bends over the front table edge. Inspected the default capture; the page and stronger colour contrast are visible, while the monkey, furniture and wider setting remain simplified. Fourteen monkey and disposal checks passed, including sampled hand clearance from the page; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Emotion Orientation: added a warm-coloured branching tree beside the lower grotto, informed by the concept illustration. Inspected default and alternate frame captures; the tree is visible and leaves the stream readable, while its leaves and surrounding landscape remain simplified. All 87 interactive-scene and disposal checks passed, including tree clearance from the waterfall, stream and route marker in both frames and examples. Production build succeeded with the existing bundle warning; 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Time Frames: replaced the pergola's ellipsoid leaves with shaped leaves at varied heights and added fuller hanging flower clusters. An initial overly dense canopy was reduced after visual inspection. The final garden-frame capture keeps the beams visible, though foliage distribution is still regular and simpler than the concept. All 87 interactive-scene and disposal checks passed, including frame and seasonal visibility; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Pigeon: replaced block toes with curved, spreading toes, tapered claws and small scale bands attached to the bird. Inspected the default capture; foot detail is small at the normal viewing scale and the bird remains stylized compared with the concept. All 87 interactive-scene and disposal checks passed, including toe-to-floor contact across three behavior orientations; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Panopticon: shifted the courtyard to a warm stone tone and replaced sparse radial seams with concentric courses and staggered joints. Inspected the default capture; the paving is visible but the cell interiors remain partly obscured and the structure remains stylized versus the concept. Seventeen panopticon and disposal checks passed, production build succeeded with the existing bundle warning, and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Twins: added low shared foreground grasses and rocks, then reduced their height and density after the first capture looked too regular. Inspected the final default view and the earlier environment-switch view; the setting still lacks the concept's fuller landscape and detailed people. All 87 interactive-scene and disposal checks passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Stimulation: replaced the rat's visible dotted fur instances with a fine procedural coat texture on the existing body. Inspected the default capture; the dots are gone and texture is subtle at this scale, while anatomy remains stylized relative to the concept. All 87 interactive-scene and disposal checks passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Butterfly: added a feathered translucent dream field attached to the existing moving halo, and raised its opacity after an initial capture. The butterfly remains readable in the inspected default and endpoint views, but the field is still subtle against the background and the dreamscape remains simpler than the concept. Eleven butterfly and disposal checks passed before the opacity-only adjustment; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Brain in a Vat: warmed the cerebral tissue colours and thickened the existing curved cortical ridges. Inspected the default capture; the ridges are fuller but remain a schematic pattern rather than the concept's natural convolutions. Thirteen vat and disposal checks passed, including vessel clearance, upper electrode contact and signal behavior; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Newcomb: broadened olive leaves and added three connected offshoots to the main arch-side branch. Inspected the default capture; the foliage is fuller and boxes remain visible, though the leaves and scene remain stylized compared with the concept. Ten Newcomb and disposal checks passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Veil: added curved balustrades to two stone platforms. An initial clearance check failed; moving the rails outward and shortening their arcs cleared both figures and station objects. Inspected default and raised-curtain captures; the railings are visible, while figures and architecture remain simplified relative to the concept. Fourteen veil and disposal checks passed after adjustment; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Argument Frames: added shared shrubs behind the courtyard wall, with branching stems and leaves visible in both frames. Inspected both frame captures; the tabletop illustrations remain clear, but the people and foliage are still simplified relative to the concept. All 87 interactive-scene and disposal checks passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Free Will: extended the shared approach to the edge of the stage, continued its paving joints and borders, spaced its three markers along the longer path, and extended the planting exclusion. Inspected the default capture; the approach now reaches the rim, but remains straighter and more schematic than the concept's landscape. Seventeen Free Will and disposal checks passed, including marker support, path movement and planting clearance; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Socratic: gave the two dialogue bubbles distinct muted colours and light symbols, closer to the concept's visual contrast. Inspected the default and both endpoint captures; the symbols remain readable as emphasis changes, while the people and setting remain simplified. Thirteen Socratic and disposal checks passed; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Chinese Room: changed the interior floor from dark timber boards to a pale staggered stone paving pattern, keeping its support height unchanged. Inspected the default capture; the floor better matches the concept but people and architecture remain stylized. Sixteen Chinese Room and disposal checks passed, including furniture support and card passage; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Ship: inspected the hull at close range and sampled panel-to-core gaps at 3,600 panel vertices and 600 midpoints; no negative radial gaps were found. Warped the outer sea's wave phase and recalculated foam crest positions to break the parallel pattern. Inspected the default capture; the effect is subtle and the sea remains simpler than the concept. Sixteen ship and disposal checks passed, including water/foam contact and hull clearance; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Reinforcement Schedules: added leaves along the rear plant's branches and stem. Inspected both mode captures; the plant remains separate from the equipment and is still simplified relative to the concept. All 87 interactive-scene and disposal checks passed, including mode independence and cabinet clearance; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Trolley: increased leaf density and varied leaf size and height within the existing tree canopy. Inspected the default capture; the canopy is fuller but still reads as clustered masses rather than the finer foliage in the concept. Sixteen trolley and disposal checks passed, including tram and figure clearance on both branches; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.

- 2026-11-17: Trolley: replaced the rounded canopy instances with pointed, lightly varied leaves and enlarged them after the first capture looked sparse. Inspected the final default view; the canopy has a more leafy edge but remains small and simpler than the concept. Sixteen trolley and disposal checks passed after adjustment, including tram and figure clearance; production build succeeded with the existing bundle warning and 23 comparisons were regenerated. L2 remains unaccepted.
