# Community assets and candidates

Moon Rock 02 is bundled for the Sisyphus boulder; other entries below remain candidates. A procedural stone remains as the loading-failure fallback.

Reviewed: 2026-11-07; publisher pages rechecked 2026-11-16. A model download alone does not change a scene's maturity level.

## Moon Rock 02 — bundled derivative
- Authors: Greg Zaal and Rico Cilliers (photography); Jenelle van Heerden (processing), Poly Haven.
- Source: https://polyhaven.com/a/moon_rock_02 ; license: CC0 1.0, https://polyhaven.com/license and https://creativecommons.org/publicdomain/zero/1.0/ . Source retrieved 2026-11-16.
- Used for the Sisyphus boulder. `public/assets/moon_rock_02.glb` is a local untextured derivative: the source LOD0 positions and normals are retained, centered, scaled to bounding-sphere radius 0.83, and exported without UVs or textures. The scene supplies its own material and rolling pivot. `scripts/build-boulder.mjs` documents the transformation and verifies hashes of the original glTF and binary inputs.
- Measured output: 64,992 bytes, 1,847 vertices, 3,304 triangles; SHA-256 `aad06f86178acf21996f57f83c023627d1fc2c59da4a8f0f70ce600c2491d493`. Loading is asynchronous; the procedural boulder remains on failure. Asset reuse does not change model maturity.
- These are file measurements, not a mobile GPU performance certification. Physical touch, screen-reader, cross-browser and mobile GPU performance testing remain outstanding.

## Boulder 01
- Author: Rico Cilliers / Poly Haven.
- Source: https://polyhaven.com/a/boulder_01
- License: CC0 1.0. https://polyhaven.com/license and https://creativecommons.org/publicdomain/zero/1.0/
- Formats: glTF, FBX, Blend, USD; LOD variants are advertised. On 2026-11-16 the asset page displayed 124K triangles for its listed model. A local evaluation download includes glTF, binary and texture files; the downloaded LOD's triangle count and runtime performance have not been independently rechecked in this pass. Choose a measured mobile-appropriate mesh, not merely smaller textures.
- Intended use: Sisyphus's boulder. Preserve the existing rolling pivot and schematic fallback.
- Status: not imported. A prior evaluation reported that its shape was unsuitable for rolling. The local evaluation files remain in the temporary directory; this pass confirmed their presence but did not independently inspect their contents or test performance.

## Universal Base Characters (free Standard pack)
- Author: Quaternius.
- Source: https://quaternius.com/packs/universalbasecharacters.html
- Distribution: https://quaternius.itch.io/universal-base-characters
- License shown by publisher: CC0. Commercial use, modification and redistribution are allowed; attribution is not required.
- Formats: FBX and glTF; rigged characters, approximately 13K triangles. The separate Blend source pack is paid and is not included in this recommendation.
- Intended use: adapt a character's silhouette, scale and pushing pose for Sisyphus. A neutral base model is not a finished Sisyphus performance.
- Status: downloaded for an isolated evaluation; not imported into the application. See `review/sisyphus-character-evaluation/README.md` for the derivative, rig experiments and unresolved contact, clothing and runtime validation.

## Brain (Innerscene)
- Source: https://www.innerscene.com/tools/library/3d-parts/brain-10d8f88f
- License shown on the individual asset page: CC0. Publisher describes it as adapted from MakeHuman/MPFB CC0 content; the exact upstream file has not been independently traced.
- Format: GLB, listed at 4.4 MB.
- Intended use: replace the Brain in a Vat's icosahedron, with a fitted pivot and retained fallback.
- Status: not imported. Download access was unavailable; file contents and performance are unverified.

## Lowpoly Brain (alternative)
- Author: CerFriBar.
- Source: https://blendswap.com/blend/6770
- License on asset page: CC0.
- Format: Blend, listed at 4.72 MB; 384-quad low-poly model and baked texture resources.
- Status: not downloaded or imported. Requires GLB conversion and material validation before use.

## Import checklist
1. Verify the individual file's license and preserve author, source URL, license URL, download date and SHA-256.
2. Inspect actual geometry, materials and all dependent files. Bundle assets locally rather than hotlinking them at runtime.
3. Measure triangle counts, texture memory and transfer size; prepare LODs where appropriate.
4. Test async load failure, rapid scene switching, resource disposal and mobile layout. Retain the original schematic fallback.
5. Record actual modifications and attribution in this file only after integration. Do not infer a higher maturity level merely from asset reuse.
