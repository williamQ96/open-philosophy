# Methodology log

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
