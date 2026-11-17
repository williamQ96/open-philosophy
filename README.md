# Open Philosophy / 开放哲学

An interactive collection of ideas from world philosophy, classical and modern traditions, and related mathematical thought experiments. These are interpretive models, not historical reconstructions or exhaustive accounts. English is the default; the language selector stores a Chinese preference locally.

## Developer model maturity

Model maturity appears only in the footer's **Developer → Model maturity** secondary menu, not in the public collection or concept headings. Both menu levels are collapsed by default.

- **Level 0 — Whitebox:** placeholder geometry awaiting model refinement.
- **Level 1 — Refined model:** a more detailed first model. The original fourteen concepts have an initial refined diorama.

Maturity measures model refinement, not philosophical value, consensus, or available interactions. The original fourteen scenes offer a concept-specific slider; these are interpretive visual metaphors rather than definitive answers. English remains the default, with a persistent Chinese option.

Prefer appropriately licensed community assets before rebuilding common objects. The Sisyphus boulder uses a locally bundled, untextured CC0 Moon Rock 02 derivative, with a procedural fallback if it cannot load. See [asset sources and licenses](public/ASSET_SOURCES.md) for authors, transformation and other candidates. Asset reuse is not a maturity upgrade.

## Run

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
npm test
npm run build
```

Drag to orbit, scroll to zoom, use the slider to change the animation, and pause or reset the view. Scene selection is also available by keyboard.

## Extend

Add bilingual metadata, an explicit interaction capability and a developer maturity level to `src/concepts.js` and, when ready, a builder to `src/scenes.js`. A builder receives the shared Three.js scene and returns `update(time, value)` and `dispose()`. Dispose geometries and materials when switching scenes. Keep concept-specific content separate from shared UI and rendering.

## Lineage

Inspired by the [OpenCampus parent pipeline](https://github.com/williamQ96/open-geospatial-to-3d-reconstruction-pipeline): separation of shared runtime and project content, an early playable prototype, reproducible dependencies, validation, and documented inference. This project has its own scene model; it does not depend on the geographic explorer template or its sync lock. See `METHODOLOGY_LOG.md`.

## Sources

Albert Camus, *The Myth of Sisyphus* (1942); Jeremy Bentham, *Panopticon* letters (1791); Michel Foucault, *Discipline and Punish* (1975). Most geometry is original and intentionally schematic; the Sisyphus boulder includes the CC0 derivative documented in the asset register.

## Event-driven additions
The collection contains the original 14 Level 1 scenes and nine Level 0 event-driven studies: language across a wall, fixed-time pigeon feeding, induction, FR10/VR10, self-stimulation and food competition, twins and heritability, argument frames, time frames, and emotion orientation. Their native buttons work with keyboard input; live status and state-linked schematic diagrams accompany the controls. The nine Level 0 studies have distinct schematic Three.js scenes synchronized with the same interaction state, not detailed reconstructions. Interactions are illustrations, not empirical data or predictions. VR10 draws an independent random response threshold from 1–19 after each reward (expected 10); FR10 requires ten responses. A test can inject a deterministic generator. Controls preserve state and focus when rebuilt at the responsive breakpoint.
