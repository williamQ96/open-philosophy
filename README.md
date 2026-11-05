# Open Philosophy / 开放哲学

An interactive collection of ideas from world philosophy, classical and modern traditions, and related mathematical thought experiments. These are interpretive models, not historical reconstructions or exhaustive accounts. English is the default; the language selector stores a Chinese preference locally.

## Maturity

**Level 1** means a recognizable, playable first interpretation with a concept-specific interaction, concise context and a source. It does not imply historical completeness or consensus. Sisyphus, the Panopticon, Plato's Cave, the Ship of Theseus and the Veil of Ignorance are level 1.

**Whitebox** means a navigable catalog entry with a schematic concept-specific geometry, bilingual question, context and source; its distinctive scene and concept-specific interaction remain future work. The remaining nine entries include the Butterfly Dream and the Infinite Monkey Theorem. The latter is a mathematical probability result related to philosophical questions, not itself a philosophical doctrine.

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

Add bilingual metadata and a maturity level to `src/concepts.js` and, when ready, a builder to `src/scenes.js`. A builder receives the shared Three.js scene and returns `update(time, value)` and `dispose()`. Dispose geometries and materials when switching scenes. Keep concept-specific content separate from shared UI and rendering.

## Lineage

Inspired by the [OpenCampus parent pipeline](https://github.com/williamQ96/open-geospatial-to-3d-reconstruction-pipeline): separation of shared runtime and project content, an early playable prototype, reproducible dependencies, validation, and documented inference. This project has its own scene model; it does not depend on the geographic explorer template or its sync lock. See `METHODOLOGY_LOG.md`.

## Sources

Albert Camus, *The Myth of Sisyphus* (1942); Jeremy Bentham, *Panopticon* letters (1791); Michel Foucault, *Discipline and Punish* (1975). Geometry is original and intentionally schematic.
