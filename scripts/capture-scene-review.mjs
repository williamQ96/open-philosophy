// Capture one default-state canvas per scene for side-by-side visual review.
// Run against the local Vite server; screenshots are evidence, not L2 approval.
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {concepts} from '../src/concepts.js';

const root=process.cwd(),base=process.env.REVIEW_BASE_URL||'http://127.0.0.1:4174/open-philosophy/',chrome=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const output=path.join(root,'review','scene-comparison-current'),profile=fs.mkdtempSync(path.join(os.tmpdir(),'open-philosophy-review-')),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const alternatives={
 'language-wall':{action:'build',count:1,label:'接收者建造后'},pigeon:{action:'step',count:3,label:'计时投食后'},induction:{action:'day',count:1,label:'推进一天后'},schedules:{action:'mode',count:1,label:'可变比率'},stimulation:{action:'condition',count:1,label:'切换竞争条件'},twins:{action:'environment',count:1,label:'不同家庭环境'},'argument-frames':{action:'frame',count:1,label:'共同绘图框架'},'time-frames':{action:'frame',count:1,label:'花园框架'},'emotion-orientation':{action:'frame',count:1,label:'另一方向框架'}
};
fs.mkdirSync(output,{recursive:true});
let browser,ws;
try{
 const probe=await fetch(base);if(!probe.ok)throw Error(`Preview unavailable: ${probe.status}`);
 browser=spawn(chrome,['--headless=new','--no-first-run','--disable-gpu','--enable-unsafe-swiftshader','--remote-debugging-port=0',`--user-data-dir=${profile}`,base],{windowsHide:true,stdio:'ignore'});
 let port;for(let i=0;i<100;i++){if(browser.exitCode!==null)throw Error('Chrome exited during startup');try{port=Number(fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0]);if(port)break}catch{}await sleep(100)}if(!port)throw Error('Chrome debugging port unavailable');
 let target;for(let i=0;i<50;i++){try{target=(await(await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t=>t.type==='page'&&t.url.startsWith(base));if(target)break}catch{}await sleep(100)}if(!target)throw Error('Review page unavailable');
 ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});let seq=0;const pending=new Map();ws.onmessage=event=>{const data=JSON.parse(event.data),entry=pending.get(data.id);if(entry){pending.delete(data.id);data.error?entry.reject(Error(JSON.stringify(data.error))):entry.resolve(data.result)}};
 const command=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
 const evaluate=async expression=>{const result=await command('Runtime.evaluate',{expression,returnByValue:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value};
 await command('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});await sleep(1500);
 const cards=[];
 for(const concept of concepts){
  await evaluate(`location.hash=${JSON.stringify(concept.id)}`);await sleep(500);
  const title=await evaluate(`document.querySelector('#title')?.textContent`);if(!title)throw Error(`Scene title missing: ${concept.id}`);
  // Freeze the same animation instant across the default and endpoint shots.
  await evaluate(`(()=>{const button=document.querySelector('#play');if(button.getAttribute('aria-pressed')==='true')button.click()})()`);await sleep(80);
  await evaluate(`document.querySelector('#canvas').scrollIntoView({block:'center'})`);await sleep(150);
  const rect=await evaluate(`(()=>{const r=document.querySelector('#canvas').getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()`);
  if(rect.width<100||rect.height<100)throw Error(`Canvas missing: ${concept.id}`);
  const shot=await command('Page.captureScreenshot',{format:'png',clip:rect}),filename=`${concept.number}-${concept.id}.png`,bytes=Buffer.from(shot.data,'base64');if(bytes.length<5000)throw Error(`Suspiciously small screenshot: ${filename}`);fs.writeFileSync(path.join(output,filename),bytes);
  const folder=Number(concept.number)<=14?'concept-renders-2026-11-16':'new-studies-concept-renders-2026-11-16';
  const card={number:concept.number,id:concept.id,title:concept.zh?.title||title,actual:filename,concept:`../${folder}/${filename}`};
  if(Number(concept.number)<=14){
   card.endpoints=[];
   for(const value of [0,1]){const actual=await evaluate(`(()=>{const range=document.querySelector('#amount');range.value=${value};range.dispatchEvent(new Event('input',{bubbles:true}));return Number(range.value)})()`);if(actual!==value)throw Error(`Slider did not accept ${value}: ${concept.id}`);await sleep(180);const endpoint=await command('Page.captureScreenshot',{format:'png',clip:rect}),name=`${concept.number}-${concept.id}-slider-${value}.png`;fs.writeFileSync(path.join(output,name),Buffer.from(endpoint.data,'base64'));card.endpoints.push({value,file:name})}
  }
  const alternative=alternatives[concept.id];
  if(alternative){
   const before=await evaluate(`document.querySelector('#canvas').dataset.studyState`);
   const changed=await evaluate(`(()=>{const button=document.querySelector('[data-action=${JSON.stringify(alternative.action)}]');if(!button)return false;for(let i=0;i<${alternative.count};i++)button.click();return true})()`);if(!changed)throw Error(`Control missing: ${concept.id}`);await sleep(350);
   const after=await evaluate(`document.querySelector('#canvas').dataset.studyState`);if(!before||before===after)throw Error(`State did not change: ${concept.id}`);
   const alternate=await command('Page.captureScreenshot',{format:'png',clip:rect});if(alternate.data===shot.data)throw Error(`Screenshot did not change: ${concept.id}`);card.alternate=`${concept.number}-${concept.id}-alternate.png`;card.alternateLabel=alternative.label;fs.writeFileSync(path.join(output,card.alternate),Buffer.from(alternate.data,'base64'));
   if(concept.id==='schedules'){
    const stepped=await evaluate(`(()=>{const button=document.querySelector('[data-action="response"]');if(!button)return false;for(let i=0;i<5;i++)button.click();return true})()`);if(!stepped)throw Error('Schedule response control missing');await sleep(350);
    const progressState=await evaluate(`document.querySelector('#canvas').dataset.studyState`);if(progressState===after)throw Error('Schedule progress state did not change');const progress=await command('Page.captureScreenshot',{format:'png',clip:rect});if(progress.data===alternate.data)throw Error('Schedule progress screenshot did not change');card.progress=`${concept.number}-${concept.id}-progress.png`;fs.writeFileSync(path.join(output,card.progress),Buffer.from(progress.data,'base64'));
   }
  }
  cards.push(card);await evaluate(`(()=>{const button=document.querySelector('#play');if(button.getAttribute('aria-pressed')==='false')button.click()})()`);console.log(`${concept.number} ${concept.id}: ${bytes.length} bytes`);
 }
 const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>场景概念图与当前模型对照</title><style>body{font:16px/1.5 system-ui,sans-serif;color:#263b34;background:#f1efe7;max-width:1500px;margin:auto;padding:2rem}h1,h2{font-weight:600}article{background:#fff;padding:1rem;margin:1.5rem 0;border-radius:.5rem}.pair{display:grid;grid-template-columns:1fr 1fr;gap:1rem}figure{margin:0}img{display:block;width:100%;height:auto}figcaption{padding:.3rem 0}@media(max-width:700px){.pair{grid-template-columns:1fr}}</style><h1>场景概念图与当前模型对照</h1><p>采集时间：${escape(new Date().toISOString())}。每组包括概念提案和当前默认状态；前 14 个场景另有滑块两端截图，新增互动场景另有标明操作的状态。各场景在同一暂停时刻采样；速度等时间相关控制需要动态检查，其他交互状态和视角也需另行检查。这些截图不表示已达到 L2 或获得验收。</p>${cards.map(c=>`<article id="${escape(c.id)}"><h2>${escape(c.number)} · ${escape(c.title)}</h2><div class="pair"><figure><img loading="lazy" src="${escape(c.concept)}" alt="${escape(c.title)}概念图"><figcaption>概念图</figcaption></figure><figure><img loading="lazy" src="${escape(c.actual)}" alt="${escape(c.title)}当前模型"><figcaption>当前模型 · 默认状态</figcaption></figure>${c.alternate?`<figure><img loading="lazy" src="${escape(c.alternate)}" alt="${escape(c.title)}${escape(c.alternateLabel)}"><figcaption>当前模型 · ${escape(c.alternateLabel)}</figcaption></figure>`:''}${c.progress?`<figure><img loading="lazy" src="${escape(c.progress)}" alt="${escape(c.title)}五次响应"><figcaption>当前模型 · 可变比率下五次响应</figcaption></figure>`:""}${(c.endpoints||[]).map(e=>`<figure><img loading="lazy" src="${escape(e.file)}" alt="${escape(c.title)}滑块${e.value}"><figcaption>当前模型 · 滑块 ${e.value}</figcaption></figure>`).join("")}</div></article>`).join('')}</html>`;
 fs.writeFileSync(path.join(output,'index.html'),html);fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify({capturedAt:new Date().toISOString(),base,cards},null,2));console.log(`Wrote ${cards.length} comparisons to ${output}`);
}finally{ws?.close();browser?.kill();await sleep(300);try{fs.rmSync(profile,{recursive:true,force:true})}catch{}}
