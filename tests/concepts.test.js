import {test} from 'node:test';
import assert from 'node:assert/strict';
import {concepts,getConcept} from '../src/concepts.js';
test('concepts have unique routes and interpretive context',()=>{assert.equal(new Set(concepts.map(c=>c.id)).size,concepts.length);for(const c of concepts)for(const key of ['title','question','description','reflection','source'])assert.ok(c[key],`${c.id}: ${key}`)});
test('unknown route falls back safely',()=>{assert.equal(getConcept('missing').id,'sisyphus')});
