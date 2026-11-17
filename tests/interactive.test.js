import {test} from 'node:test';import assert from 'node:assert/strict';import {createModel,act,interactiveConcepts} from '../src/interactive.js';
test('fixed time food is independent of behavior',()=>{let a=createModel('pigeon'),b=createModel('pigeon');for(let i=0;i<6;i++){a=act(a,'step');b=act(b,'behavior');b=act(b,'step')}assert.equal(a.rewards,2);assert.equal(b.rewards,2)});
test('induction scenario permits counterexample',()=>{let s=createModel('induction');for(let i=0;i<6;i++)s=act(s,'step');assert.equal(s.food,5);assert.equal(s.failed,true)});
test('FR10 and injected VR10 sequence have equal response totals',()=>{const seq=[4/19,14/19,7/19,11/19];let i=0;let s=createModel('schedules',()=>seq[(i++)%4]);for(let j=0;j<40;j++)s=act(s,'response');assert.equal(s.rewards,4);s=act(s,'mode');for(let j=0;j<40;j++)s=act(s,'response');assert.equal(s.rewards,4)});
test('choice, twin and reset state',()=>{let s=act(createModel('stimulation'),'food');assert.equal(s.food,1);assert.equal(act(s,'reset').food,0);assert.equal(act(createModel('twins'),'compare').similarity,1);assert.equal(interactiveConcepts.length,6)});

test('wall description can be revised and rebuilt',()=>{let s=createModel('language-wall');s=act(s,'build');assert.equal(s.build,'partial');s=act(s,'describe');s=act(s,'build');assert.equal(s.build,'matched')});
