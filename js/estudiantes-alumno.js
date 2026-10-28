(function(){'use strict';const app=document.getElementById('ge-app');let data,student='',checked=false;const state=new Map();let miniState=null;let imageState=null;let dragEnabled=false;const freeState=new Map();const freeMiniState=new Map();const byId=id=>document.getElementById(id);async function decodePayload(fragment){const [mode,part]=fragment.includes('.')?[fragment.slice(0,fragment.indexOf('.')),fragment.slice(fragment.indexOf('.')+1)]:['old',fragment];const b64=part.replace(/-/g,'+').replace(/_/g,'/');const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));if(mode==='gz'){if(typeof DecompressionStream!=='function')throw Error('Navegador sin soporte de descompresión');const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(new TextDecoder().decode(await new Response(stream).arrayBuffer()));}return JSON.parse(new TextDecoder().decode(bytes));}
function decode(s){const bytes=Uint8Array.from(atob(s),c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}function node(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
// Mezclar al iniciar, no al redibujar: las fichas conservan su lugar cuando se seleccionan.
// Si hay varias fichas distinguibles, evitar que el banco arranque en el orden original.
function shuffleBank(ids,identity){const original=ids.slice();if(ids.length<2)return ids;shuffle(ids);const distinct=original.some((id,i)=>identity(id)!==identity(original[0]));if(distinct&&ids.every((id,i)=>identity(id)===identity(original[i]))){for(let i=1;i<ids.length;i++){if(identity(ids[i])!==identity(ids[0])){[ids[0],ids[i]]=[ids[i],ids[0]];break;}}}return ids}
async function init(){try{data=await decodePayload(location.hash.slice(1));if(data.version!==1||!Array.isArray(data.lines)||!Array.isArray(data.answers))throw Error('Formato incorrecto');}catch(e){app.replaceChildren(node('div','ge-error','No se pudo abrir la actividad. El enlace puede estar incompleto o ser demasiado largo. Pedile a tu docente que genere otro enlace.'));return;}
if(new URLSearchParams(location.search).has('tutorial'))iniciarTutorialAlumno();
byId('ge-start').addEventListener('click',()=>{const name=byId('ge-name').value.trim();if(!name){alert('Escribí tu nombre para comenzar.');return;}student=name.toUpperCase();start();});byId('ge-name').addEventListener('keydown',e=>{if(e.key==='Enter')byId('ge-start').click()});
}
init();
let guiaAlumno=null;
function iniciarTutorialAlumno(){
 let paso=0;
 const etapas=[
  {titulo:'ESCRIBIR EL NOMBRE',texto:'Antes de comenzar la actividad, el estudiante debe escribir su nombre en el espacio correspondiente y tocar SIGUIENTE para continuar.',sel:'#ge-name'},
  {titulo:'ACTIVAR O DESACTIVAR DESLIZAR',texto:'La opción DESLIZAR permite modificar la manera en que el estudiante utiliza las fichas.\n\nCuando está activada, puede arrastrarlas hasta los espacios correspondientes.\n\nCuando está desactivada, puede utilizar la modalidad de selección.',sel:'#ge-drag-toggle',side:'left'},
  {titulo:'REALIZAR LA ACTIVIDAD',texto:'El estudiante completa los espacios de la actividad con las fichas disponibles o mediante escritura libre, según cómo los haya preparado la docente.',sel:'#ge-paper'},
  {titulo:'TERMINAR ACTIVIDAD Y REVISAR',texto:'Cuando el estudiante termina su trabajo, toca TERMINAR ACTIVIDAD.',sel:'#ge-finish'},
  {titulo:'CORRECCIÓN DE RESPUESTAS',texto:'Si las respuestas son con fichas, GramaNick las corregirá automáticamente. Si las respuestas son libres, la docente podrá corregir manualmente cada una de ellas.',sel:'.ge-feedback.bad'},
  {titulo:'VOLVER A REVISAR',texto:'Una vez corregida la actividad, si alguna o todas las respuestas están mal, el estudiante puede tocar VOLVER A REVISAR. Luego de tocar este botón, puede modificar sus respuestas y volver a tocar TERMINAR ACTIVIDAD para una nueva corrección.',sel:'#ge-downloads .ge-secondary'}
 ];
 const layer=node('div','ge-demo-guide');
 const card=node('div','ge-demo-card');
 const counter=node('small','','');const title=node('h2');const body=node('p');
 const nav=node('div','ge-demo-nav');const exit=node('button','','Salir');const back=node('button','','← Anterior');const next=node('button','','Siguiente →');
 nav.append(exit,back,next);card.append(counter,title,body,nav);layer.append(card);document.body.append(layer);
 const clear=()=>document.querySelectorAll('.ge-demo-highlight').forEach(e=>e.classList.remove('ge-demo-highlight'));
 const focus=()=>{
  clear();const e=document.querySelector(etapas[paso].sel)||document.querySelector('#ge-paper')||document.querySelector('#ge-name');
  if(e){e.classList.add('ge-demo-highlight');e.scrollIntoView({block:'nearest',behavior:'instant'});}
  card.style.left='';card.style.right='16px';card.style.top='16px';
  if(etapas[paso].side==='left'){card.style.left='16px';card.style.right='auto';}
  requestAnimationFrame(()=>{
   if(!e)return;
   const r=e.getBoundingClientRect(),c=card.getBoundingClientRect();
   const overlaps=r.left<c.right&&r.right>c.left&&r.top<c.bottom&&r.bottom>c.top;
   if(overlaps){
    if(r.bottom+12+c.height<innerHeight-8)card.style.top=(r.bottom+12)+'px';
    else if(r.top-c.height-12>8)card.style.top=(r.top-c.height-12)+'px';
    else {card.style.top='12px';card.style.left=etapas[paso].side==='left'?'12px':'auto';card.style.right=etapas[paso].side==='left'?'auto':'12px';}
   }
  });
 };
 const render=()=>{counter.textContent='PASO '+(26+paso)+' DE 31';title.textContent=etapas[paso].titulo;body.textContent=etapas[paso].texto;back.disabled=paso===0;next.textContent=paso===5?'Finalizar':'Siguiente →';focus();};
 const end=()=>{clear();layer.remove();};
 exit.onclick=end;
 back.onclick=()=>{if(paso===1&&byId('ge-name')){paso=0;}else{paso=Math.max(0,paso-1);}render();};
 next.onclick=()=>{
  if(paso===5){end();return;}
  if(paso===0){
   const name=byId('ge-name');if(name){if(!name.value.trim())name.value='DEMOSTRACIÓN';byId('ge-start')?.click();}
  }
  if(paso===3){
   // Demostración auténtica: armar una oración desordenada con fichas reales y corregirla.
   const first=state.values().next().value;
   if(first&&first.words.length>1){
    const words=first.words.map((w,i)=>({id:i,text:String(w.text||'')}));
    const order=words.map(w=>w.id);
    const shuffled=order.slice(1).concat(order[0]);
    first.placed=shuffled;first.pool=[];
    const line=[...state].find(([,v])=>v===first)?.[0];
    if(line!==undefined)draw(line);
   }
   byId('ge-finish')?.click();
  }
  paso++;render();
 };
 const requested=Number(new URLSearchParams(location.search).get('tutorialStep'));
 if(Number.isInteger(requested)&&requested>=26&&requested<=31){
  // Preparar los pasos previos para que el seleccionado tenga su estado real.
  const target=requested-26;
  for(let i=0;i<target;i++)next.onclick();
 }
 render();
}

function miniChoose(id){if(!miniState)return;miniState.active=id;miniDraw();}
function miniPut(id){
 if(!miniState||miniState.active===null)return;
 const m=miniState;
 // Cada ficha es una instancia individual; no puede estar en dos lugares.
 if(m.placed.includes(id))return;
 m.placed[m.active]=id;
 m.active=null; // La siguiente selección siempre la hace el estudiante.
 miniDraw();
}
function miniDraw(){if(!miniState)return;const m=miniState;
 m.spaces.forEach((el,i)=>{
  const id=m.placed[i];
  el.querySelectorAll('.ge-mini-answer').forEach(n=>n.remove());
  el.classList.toggle('ge-mini-active',m.active===i);
  el.classList.toggle('ge-mini-filled',id!==null);
  el.setAttribute('role','button');el.setAttribute('tabindex','0');
  el.setAttribute('aria-label','Completar palabra '+(i+1)+(id===null?'':': '+m.words[id].text));
  if(id!==null){
   const answer=node('span','ge-mini-answer');
   // Usar la misma ficha completa del banco (HTML, pictograma, símbolo y color).
   const ficha=tile(m.words[id],()=>{m.placed[i]=null;m.active=null;miniDraw()});ficha.dataset.dragKind='mini';ficha.dataset.dragId=String(id);ficha.dataset.dragFrom=String(i);
   ficha.addEventListener('click',e=>e.stopPropagation());
   ficha.title='Tocá para devolver esta ficha al banco';
   answer.append(ficha);
   el.append(answer);
  }
  el.onclick=()=>{if(m.placed[i]===null)miniChoose(i)};
  el.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target===el&&m.placed[i]===null){e.preventDefault();miniChoose(i)}};
 });
 m.bank.replaceChildren();
 m.order.forEach(i=>{const w=m.words[i];if(!m.placed.includes(i)){const ficha=tile(w,()=>miniPut(i));ficha.dataset.dragKind='mini';ficha.dataset.dragId=String(i);m.bank.append(ficha)}});
}
function imageDraw(){
 const m=imageState;if(!m)return;
 m.spaces.forEach(({el},i)=>{
  const id=m.placed[i];el.replaceChildren();el.classList.remove('ge-image-good','ge-image-bad');
  el.classList.toggle('ge-image-selected',m.selected===id&&id!==null);
  if(id!==null){const im=m.images.find(x=>x.id===id);if(im){const img=node('img');img.src=im.src;img.alt=im.name||'Fotografía';img.draggable=false;el.append(img);}}
  el.title=id!==null?'Tocá para quitar, o seleccioná otra foto para reemplazar':'Seleccioná una fotografía del banco';if(id!==null){el.dataset.dragKind='image';el.dataset.dragId=String(id);el.dataset.dragFrom=String(i)}else{delete el.dataset.dragKind;delete el.dataset.dragId;delete el.dataset.dragFrom;}
  el.onclick=()=>{
   if(m.selected!==null){const old=m.placed[i];if(old===m.selected){m.selected=null;return imageDraw();}
    m.placed[i]=m.selected;m.selected=null;imageDraw();return;}
   if(m.placed[i]!==null){m.placed[i]=null;imageDraw();}
  };
  el.tabIndex=0;el.setAttribute('role','button');el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}};
 });
 m.banks.forEach(b=>b.replaceChildren());m.order.forEach(id=>{const im=m.images.find(x=>x.id===id);if(!im)return;
  if(m.placed.includes(im.id))return;
  const btn=node('button','ge-image-tile');btn.type='button';btn.dataset.dragKind='image';btn.dataset.dragId=String(im.id);btn.title=im.name||'Fotografía';
  btn.classList.toggle('ge-image-picked',m.selected===im.id);
  const img=node('img');img.src=im.src;img.alt=im.name||'Fotografía';img.draggable=false;btn.append(img);
  btn.onclick=()=>{m.selected=m.selected===im.id?null:im.id;imageDraw()};m.banks.forEach((b,i)=>{const copy=i===0?btn:btn.cloneNode(true);if(i!==0)copy.onclick=btn.onclick;b.append(copy)});
 });
}
function start(){dragEnabled=false;freeState.clear();freeMiniState.clear();state.clear();app.replaceChildren();const paper=node('article','ge-paper');paper.id='ge-paper';const heading=node('div','ge-student-heading');heading.append(node('div','ge-student-name','NOMBRE: '+student));const control=node('label','ge-drag-control');const caption=node('span','','DESLIZAR');const toggle=node('input');toggle.type='checkbox';toggle.id='ge-drag-toggle';toggle.setAttribute('role','switch');toggle.setAttribute('aria-label','Activar o desactivar deslizar fichas');const status=node('span','ge-drag-status','OFF');toggle.addEventListener('change',()=>{dragEnabled=toggle.checked;status.textContent=dragEnabled?'ON':'OFF';paper.classList.toggle('ge-drag-enabled',dragEnabled)});control.append(caption,toggle,status);heading.append(control);paper.append(heading);const answers=new Map(data.answers.map(a=>[a.line,a]));const freeAnswers=new Set((data.freeAnswers||[]).map(a=>a.line));
const miniAnswers=Array.isArray(data.minis)?data.minis:[];const freeMinis=Array.isArray(data.freeMinis)?data.freeMinis:[];
const miniByLine=new Map();miniAnswers.forEach(a=>{if(!miniByLine.has(a.line))miniByLine.set(a.line,[]);miniByLine.get(a.line).push(a)});
const miniSpaces=[];
data.lines.forEach(l=>{const line=node('div','ge-line');if(freeAnswers.has(l.index)){const ex=node('div','ge-exercise ge-free-exercise');ex.dataset.index=l.index;const area=node('textarea','ge-free-input');area.placeholder='ESCRIBÍ ACÁ';area.setAttribute('aria-label','Escribí acá');area.rows=3;const feedback=node('div','ge-feedback');ex.append(area,feedback);line.append(ex);freeState.set(l.index,{area,feedback});}else if(answers.has(l.index)){const a=answers.get(l.index);const ex=node('div','ge-exercise');ex.dataset.index=l.index;ex.append(node('h3','','ORDENÁ LAS PALABRAS'));const placed=node('div','ge-placed');placed.setAttribute('aria-label','Oración construida');const bank=node('div','ge-bank');bank.setAttribute('aria-label','Palabras disponibles');const feedback=node('div','ge-feedback');const words=a.words.map((w,i)=>({...w,id:i}));placed.dataset.dragLine=String(l.index);bank.dataset.dragLine=String(l.index);state.set(l.index,{words,placed:[],pool:shuffleBank(words.map(w=>w.id),id=>words[id].text),ex,placedEl:placed,bankEl:bank,feedback});ex.append(placed,bank,feedback);line.append(ex);draw(l.index);}else{const original=document.createElement('div');original.innerHTML=l.html;original.querySelectorAll('button,input,select,textarea,script').forEach(x=>x.remove());line.append(...original.childNodes);
 if(miniByLine.has(l.index)){
  const slots=[...line.querySelectorAll('.ge-mini-slot')];
  miniByLine.get(l.index).forEach(a=>{const el=slots[a.slot];if(el){el.classList.add('ge-mini-interactive');miniSpaces.push({el,word:a.word});}});
 }
}
 // Los mini renglones libres se escriben sin banco de fichas y sin respuesta predeterminada.
 freeMinis.filter(a=>a.line===l.index).forEach(a=>{
  const slot=line.querySelectorAll('.ge-mini-slot')[a.slot];if(!slot)return;
  slot.classList.add('ge-mini-free-slot');slot.replaceChildren();slot.removeAttribute('role');slot.removeAttribute('tabindex');
  const area=node('input','ge-mini-free-input');area.type='text';area.placeholder='_________';area.setAttribute('aria-label','Tocá los guiones para escribir');
  slot.append(area);const feedback=node('div','ge-feedback ge-mini-free-feedback');slot.append(feedback);
  freeMiniState.set(`${a.line}:${a.slot}`,{area,feedback});
 });
 // Solo cuando una celda contiene exclusivamente mini renglones libres:
 // distribuir sus contenedores de palabra en una fila, no solo los inputs internos.
 line.querySelectorAll('.gn-table-cell-content').forEach(cell=>{
  const children=[...cell.children];
  if(children.length>1 && children.every(el=>el.classList.contains('ge-mini-palabra') && el.querySelector('.ge-mini-free-slot'))){
   cell.classList.add('ge-mini-free-row');
  }
 });
 paper.append(line);});app.append(paper);
const imageAnswers=Array.isArray(data.imageAnswers)?data.imageAnswers:[];
if(imageAnswers.length){
 const spaces=[];
 imageAnswers.forEach(a=>{
  const line=paper.querySelectorAll('.ge-line')[a.line];
  const el=line?.querySelectorAll('.ge-image-slot')[a.slot];
  if(el){el.classList.add('ge-image-interactive');spaces.push({el,expected:a.imageId,free:!!a.free});}
 });
 const bank=node('div','ge-image-common');
 const tiles=node('div','ge-image-bank');bank.append(tiles);
 // El banco se ubica justo después del último cuadro de la secuencia,
 // antes de cualquier texto o actividad posterior.
 const lastImageLine=Math.max(...imageAnswers.map(a=>a.line));
 const anchor=paper.querySelectorAll('.ge-line')[lastImageLine];
 if(anchor)anchor.after(bank);else paper.append(bank);
 imageState={spaces,images:Array.isArray(data.images)?data.images:[],placed:spaces.map(()=>null),selected:null,bank:tiles,banks:[tiles],order:shuffleBank((Array.isArray(data.images)?data.images:[]).map(im=>im.id),id=>{const im=data.images.find(x=>x.id===id);return im?.src||String(id)})};
 imageDraw();
}else imageState=null;
if(miniSpaces.length){
 const words=[...miniSpaces.map(x=>x.word),...(data.distractors||[])].filter(Boolean).map((w,i)=>({...w,id:i}));
 const bank=node('div','ge-mini-common');bank.append(node('h3','','PALABRAS DISPONIBLES'));
 const bankTiles=node('div','ge-bank');bank.append(bankTiles);
 const lastMiniLine=Math.max(...miniAnswers.map(a=>a.line));
 const miniAnchor=paper.querySelectorAll('.ge-line')[lastMiniLine];
 if(miniAnchor)miniAnchor.after(bank);else paper.append(bank);
 miniState={spaces:miniSpaces.map(x=>x.el),expected:miniSpaces.map(x=>x.word.text),words,placed:miniSpaces.map(()=>null),active:null,bank:bankTiles,order:shuffleBank(words.map(w=>w.id),id=>words[id].text)};
 miniDraw();
}else miniState=null;setupPointerDrag(paper);const actions=node('div','ge-actions');const finish=node('button','','TERMINAR ACTIVIDAD');finish.id='ge-finish';finish.onclick=correct;actions.append(finish);const downloads=node('div');downloads.id='ge-downloads';downloads.hidden=true;const jpg=node('button','','DESCARGAR JPG');jpg.onclick=()=>exportWork('jpg');const pdf=node('button','','DESCARGAR PDF');pdf.onclick=()=>exportWork('pdf');const retry=node('button','ge-secondary','VOLVER A REVISAR');retry.onclick=()=>{checked=false;[...freeState.values(),...freeMiniState.values()].forEach(s=>{s.area.readOnly=false;s.feedback.textContent='';s.feedback.className='ge-feedback'});const manual=byId('ge-manual-review');if(manual)manual.remove();document.querySelectorAll('.ge-mini-manual-controls').forEach(el=>el.remove());finish.hidden=false;state.forEach(s=>{s.feedback.textContent='';s.feedback.className='ge-feedback'});if(imageState)imageDraw();const imageFeedback=byId('ge-image-feedback');if(imageFeedback)imageFeedback.remove();const miniFeedback=byId('ge-mini-feedback');if(miniFeedback)miniFeedback.remove();downloads.hidden=true;paper.scrollIntoView({behavior:'smooth'})};downloads.append(jpg,pdf,retry);actions.append(downloads);app.append(actions);}
function tile(word,onClick){const el=node('button','ge-tile');el.type='button';el.setAttribute('aria-label',word.text);el.innerHTML=word.html;el.querySelectorAll('script,button,input,textarea,select').forEach(n=>n.remove());el.querySelectorAll('*').forEach(n=>{[...n.attributes].forEach(a=>{if(a.name.startsWith('on'))n.removeAttribute(a.name)})});el.onclick=onClick;requestAnimationFrame(()=>fitTileWord(el));return el;}
function draw(id){const s=state.get(id);s.placedEl.replaceChildren();s.bankEl.replaceChildren();s.placed.forEach((i,k)=>{const t=tile(s.words[i],()=>{s.placed.splice(k,1);s.pool.push(i);invalidate(s);draw(id)});t.dataset.dragKind='order';t.dataset.dragId=String(i);t.dataset.dragLine=String(id);t.dataset.dragFrom='placed';s.placedEl.append(t)});s.pool.forEach((i,k)=>{const t=tile(s.words[i],()=>{s.pool.splice(k,1);s.placed.push(i);invalidate(s);draw(id)});t.dataset.dragKind='order';t.dataset.dragId=String(i);t.dataset.dragLine=String(id);t.dataset.dragFrom='bank';s.bankEl.append(t)});}
// V1.3: arrastre optativo mediante Pointer Events (mouse, lápiz y táctil).
// No se altera el método de clic; el interruptor empieza apagado en cada actividad.
function setupPointerDrag(paper){
 let drag=null;
 const clear=()=>{if(!drag)return;drag.ghost?.remove();drag.target?.classList.remove('ge-drop-target');drag=null};
 paper.addEventListener('pointerdown',e=>{
  if(!dragEnabled||e.button!==0||drag)return;
  const source=e.target.closest('[data-drag-kind]');if(!source||!paper.contains(source))return;
  drag={source,kind:source.dataset.dragKind,id:source.dataset.dragId,line:source.dataset.dragLine,from:source.dataset.dragFrom,startX:e.clientX,startY:e.clientY,active:false,target:null,pointerId:e.pointerId};try{source.setPointerCapture(e.pointerId)}catch(_){}
 });
 paper.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.pointerId)return;
  const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
  if(!drag.active){if(Math.hypot(dx,dy)<9)return;drag.active=true;drag.ghost=drag.source.cloneNode(true);drag.ghost.classList.add('ge-drag-ghost');drag.ghost.removeAttribute('id');document.body.append(drag.ghost);}
  e.preventDefault();drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';
  const hit=document.elementFromPoint(e.clientX,e.clientY);let target=null;
  if(drag.kind==='image')target=hit?.closest('.ge-image-interactive');
  else if(drag.kind==='mini')target=hit?.closest('.ge-mini-interactive,.ge-mini-common .ge-bank');
  else if(drag.kind==='order')target=hit?.closest('.ge-placed,.ge-exercise .ge-bank');
  if(target&&!paper.contains(target))target=null;
  if(drag.target!==target){drag.target?.classList.remove('ge-drop-target');drag.target=target;target?.classList.add('ge-drop-target')}
 },{passive:false});
 const finish=e=>{
  if(!drag||e.pointerId!==drag.pointerId)return;
  const d=drag;const target=d.target;const active=d.active;clear();if(!active)return;
  // Evitar que el clic sintético posterior al arrastre active una segunda acción.
  const suppress=ev=>{ev.preventDefault();ev.stopImmediatePropagation();document.removeEventListener('click',suppress,true)};
  document.addEventListener('click',suppress,true);setTimeout(()=>document.removeEventListener('click',suppress,true),450);
  if(!target)return;
  if(d.kind==='image'&&imageState){const m=imageState;const index=m.spaces.findIndex(x=>x.el===target);if(index<0)return;const id=m.images.find(x=>String(x.id)===d.id)?.id;if(id===undefined)return;const oldIndex=m.placed.indexOf(id);if(oldIndex>=0&&oldIndex!==index)m.placed[oldIndex]=null;m.placed[index]=id;m.selected=null;imageDraw();}
  else if(d.kind==='mini'&&miniState){const m=miniState;const id=Number(d.id);const index=m.spaces.indexOf(target);if(index>=0){const previous=m.placed.indexOf(id);if(previous>=0&&previous!==index)m.placed[previous]=null;m.placed[index]=id;m.active=null;miniDraw();}else if(target===m.bank&&d.from!==undefined){const from=Number(d.from);if(m.placed[from]===id){m.placed[from]=null;m.active=null;miniDraw();}}}
  else if(d.kind==='order'){const line=Number(d.line);const s=state.get(line);if(!s||target.dataset.dragLine!==String(line))return;const id=Number(d.id);const from=s.placed.includes(id)?s.placed:s.pool;const to=target.classList.contains('ge-placed')?s.placed:s.pool;const old=from.indexOf(id);if(old<0)return;from.splice(old,1);if(to===s.placed){const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest('.ge-tile');let at=hit&&target.contains(hit)?Array.from(target.children).indexOf(hit):-1;if(at<0)at=to.length;else {const rect=hit.getBoundingClientRect();if(e.clientX>rect.left+rect.width/2)at++;}if(from===to&&old<at)at--;to.splice(Math.max(0,Math.min(at,to.length)),0,id);}else to.push(id);invalidate(s);draw(line);}
 };
 paper.addEventListener('pointerup',finish);paper.addEventListener('pointercancel',clear);
 window.addEventListener('blur',clear);
}
function invalidate(s){if(checked){s.feedback.textContent='MODIFICADO · VOLVÉ A CORREGIR';s.feedback.className='ge-feedback';}}
function updateMiniSummary(){const fb=byId('ge-mini-feedback');if(!fb)return;const manual=[...freeMiniState.values()].map(x=>x.manualVerdict);const automatic=miniState?miniState.placed.every((id,i)=>id!==null&&String(miniState.words[id].text).normalize('NFC').trim()===String(miniState.expected[i]).normalize('NFC').trim()):true;if(manual.some(x=>x===null||x===undefined)){fb.textContent='PENDIENTE DE CORRECCIÓN';fb.className='ge-feedback';return;}const ok=automatic&&manual.every(x=>x==='good');fb.textContent=ok?'✓ ¡MUY BIEN!':'↻ REVISAR';fb.className='ge-feedback '+(ok?'good':'bad');}
function correct(){checked=true;freeState.forEach(s=>{s.area.readOnly=true;s.feedback.textContent='';s.feedback.className='ge-feedback';});freeMiniState.forEach(s=>{s.area.readOnly=true;s.feedback.textContent='';s.feedback.className='ge-feedback';});if(freeState.size||freeMiniState.size){let manual=byId('ge-manual-review');if(!manual){manual=node('section','ge-manual-review');manual.id='ge-manual-review';freeState.forEach((s,id)=>{const row=node('div','ge-manual-row');const pending=node('span','ge-manual-pending','PENDIENTE DE CORRECCIÓN');row.append(pending);const good=node('button','ge-manual-good','¡MUY BIEN!');const review=node('button','ge-manual-bad','REVISAR');good.onclick=()=>{s.feedback.textContent='✓ ¡MUY BIEN!';s.feedback.className='ge-feedback good';pending.textContent='¡MUY BIEN!';pending.className='ge-manual-pending good';updateMiniSummary();};review.onclick=()=>{s.feedback.textContent='↻ REVISAR';s.feedback.className='ge-feedback bad';pending.textContent='REVISAR';pending.className='ge-manual-pending bad';updateMiniSummary();};row.append(good,review);manual.append(row)});if(freeState.size)byId('ge-downloads').parentElement.append(manual);}freeMiniState.forEach((s,id)=>{const controls=node('span','ge-mini-manual-controls');const good=node('button','ge-mini-manual-choice good','✓');const bad=node('button','ge-mini-manual-choice bad','✕');const choose=(value)=>{s.manualVerdict=value;good.classList.toggle('chosen',value==='good');bad.classList.toggle('chosen',value==='bad');good.hidden=value==='bad';bad.hidden=value==='good';s.feedback.textContent='';updateMiniSummary()};good.type=bad.type='button';good.title='MUY BIEN';bad.title='REVISAR';good.setAttribute('aria-label','Muy bien');bad.setAttribute('aria-label','Revisar');good.onclick=()=>choose('good');bad.onclick=()=>choose('bad');controls.append(good,bad);s.area.closest('.ge-mini-free-slot').append(controls);s.manualVerdict=null;});}let good=0;state.forEach(s=>{const ok=s.placed.length===s.words.length&&s.placed.every((id,index)=>String(s.words[id].text).normalize('NFC').trim()===String(s.words[index].text).normalize('NFC').trim());if(ok)good++;s.feedback.textContent=ok?'✓ ¡MUY BIEN!':'↻ REVISAR';s.feedback.className='ge-feedback '+(ok?'good':'bad');});if(miniState){
 const m=miniState;const ok=m.placed.every((id,i)=>id!==null&&String(m.words[id].text).normalize('NFC').trim()===String(m.expected[i]).normalize('NFC').trim());
 let fb=byId('ge-mini-feedback');if(!fb){fb=node('div','ge-feedback');fb.id='ge-mini-feedback';m.bank.parentElement.append(fb)}
 fb.textContent=ok?'✓ ¡MUY BIEN!':'↻ REVISAR';fb.className='ge-feedback '+(ok?'good':'bad');
}
if(imageState){const m=imageState;let all=true;let evaluated=0;
 m.spaces.forEach(({el,expected,free},i)=>{if(free){el.classList.remove('ge-image-good','ge-image-bad');return;}evaluated++;const ok=m.placed[i]===expected;el.classList.toggle('ge-image-good',ok);el.classList.toggle('ge-image-bad',!ok);if(!ok)all=false;});
 let fb=byId('ge-image-feedback');if(evaluated){if(!fb){fb=node('div','ge-feedback');fb.id='ge-image-feedback';m.bank.parentElement.append(fb);}fb.textContent=all?'✓ ¡MUY BIEN!':'↻ REVISAR';fb.className='ge-feedback '+(all?'good':'bad');}else if(fb)fb.remove();
}if(freeMiniState.size){let fb=byId('ge-mini-feedback');if(!fb){fb=node('div','ge-feedback');fb.id='ge-mini-feedback';const bank=miniState?.bank?.parentElement;if(bank)bank.append(fb);else byId('ge-downloads').parentElement.append(fb);}updateMiniSummary();}byId('ge-downloads').hidden=false;byId('ge-finish').hidden=true;}
function fitTileWord(tile){if(!tile.isConnected)return;const el=tile.querySelector('.ge-token-word');if(!el)return;let px=23;el.style.fontSize=px+'px';const max=tile.clientWidth-14;while(el.scrollWidth>max&&px>11){px--;el.style.fontSize=px+'px';}}
function fitExportWords(root){root.querySelectorAll('.ge-tile .ge-token-word').forEach(el=>{el.style.whiteSpace='nowrap';el.style.overflowWrap='normal';el.style.wordBreak='normal';let px=23;el.style.fontSize=px+'px';const max=el.closest('.ge-tile').clientWidth-12;while(el.scrollWidth>max&&px>11){px--;el.style.fontSize=px+'px';}})}
async function exportWork(format){
 const paper=byId('ge-paper');
 if(!window.html2canvas){alert('No se pudo cargar el generador de imágenes. Conectate a Internet y volvé a intentar.');return;}
 const clone=paper.cloneNode(true);clone.querySelectorAll('.ge-mini-free-input').forEach((area,i)=>{const original=paper.querySelectorAll('.ge-mini-free-input')[i];const rendered=node('span','ge-mini-free-export-text',original?.value||'');area.replaceWith(rendered);});clone.querySelectorAll('.ge-free-input').forEach((area,i)=>{const original=paper.querySelectorAll('.ge-free-input')[i];const rendered=node('div','ge-free-export-text',original?.value||'');area.replaceWith(rendered);});
 clone.querySelectorAll('.ge-tile').forEach(tile=>{tile.classList.remove('selected','seleccionada','seleccionado','activo','seleccion-multiple-activa');tile.blur();});
 clone.classList.add('ge-export');
 // Captura fuera de pantalla, sin limitar el ancho al viewport ni recortar hijos.
 clone.style.cssText='position:absolute;left:-100000px;top:0;width:900px;min-width:900px;max-width:none;max-height:none;height:auto;overflow:visible;box-shadow:none;z-index:-1';
 clone.querySelectorAll('.ge-placed button').forEach(btn=>{btn.disabled=true});
 document.body.append(clone);
 try{
  await document.fonts.ready;
  fitExportWords(clone);
  await Promise.all([...clone.querySelectorAll('img')].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;setTimeout(resolve,3000)})));
  // El ancho/alto de captura abarcan también los elementos que sobresalen.
  // No alteramos la presentación de Canva Estudiantes.
  const rootRect=clone.getBoundingClientRect();
  let right=Math.max(clone.scrollWidth,clone.offsetWidth),bottom=Math.max(clone.scrollHeight,clone.offsetHeight);
  clone.querySelectorAll('*').forEach(el=>{
   const r=el.getBoundingClientRect();
   if(r.width&&r.height){right=Math.max(right,Math.ceil(r.right-rootRect.left));bottom=Math.max(bottom,Math.ceil(r.bottom-rootRect.top));}
  });
  // Ajustar el borde del papel al contenido completo (no sólo el área de captura).
  // Recalcular tras expandirlo: el cambio de ancho puede afectar el alto de las líneas.
  const width=Math.ceil(right+20);
  clone.style.width=width+'px';
  clone.style.minWidth=width+'px';
  const expandedRect=clone.getBoundingClientRect();
  let expandedBottom=Math.max(clone.scrollHeight,clone.offsetHeight);
  clone.querySelectorAll('*').forEach(el=>{
   const r=el.getBoundingClientRect();
   if(r.width&&r.height)expandedBottom=Math.max(expandedBottom,Math.ceil(r.bottom-expandedRect.top));
  });
  const height=Math.ceil(expandedBottom+20);
  clone.style.minHeight=height+'px';
  const canvas=await html2canvas(clone,{backgroundColor:'#ffffff',scale:1.6,useCORS:true,logging:false,windowWidth:Math.max(1200,width+100),windowHeight:Math.max(900,height+100),width,height,scrollX:0,scrollY:0});
  const name=student.replace(/[^a-z0-9áéíóúñ_-]+/gi,'_');
  if(format==='jpg'){
   const a=document.createElement('a');a.href=canvas.toDataURL('image/jpeg',.92);a.download='GramaNick_'+name+'.jpg';a.click();
  }else{
   if(!window.jspdf){alert('No se pudo cargar la biblioteca de PDF. Conectate a Internet y volvé a intentar.');return;}
   const {jsPDF}=window.jspdf;
   const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
   const pageWidth=190,pageHeight=277,scale=pageWidth/canvas.width;
   const pagePixels=Math.max(1,Math.floor(pageHeight/scale));
   let offset=0;
   while(offset<canvas.height){
    if(offset)pdf.addPage();
    const partHeight=Math.min(pagePixels,canvas.height-offset);
    const piece=document.createElement('canvas');piece.width=canvas.width;piece.height=partHeight;
    piece.getContext('2d').drawImage(canvas,0,offset,canvas.width,partHeight,0,0,canvas.width,partHeight);
    pdf.addImage(piece.toDataURL('image/jpeg',.88),'JPEG',10,10,pageWidth,partHeight*scale);
    offset+=partHeight;
   }
   pdf.save('GramaNick_'+name+'.pdf');
  }
 }catch(e){console.error(e);alert('No se pudo generar el archivo. Probá con menos fotos o con otra opción de descarga.');}
 finally{clone.remove();}
}
})();
