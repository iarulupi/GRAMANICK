(function(){'use strict';const app=document.getElementById('ge-app');let data,student='',checked=false;const state=new Map();let miniState=null;const byId=id=>document.getElementById(id);async function decodePayload(fragment){const [mode,part]=fragment.includes('.')?[fragment.slice(0,fragment.indexOf('.')),fragment.slice(fragment.indexOf('.')+1)]:['old',fragment];const b64=part.replace(/-/g,'+').replace(/_/g,'/');const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));if(mode==='gz'){if(typeof DecompressionStream!=='function')throw Error('Navegador sin soporte de descompresión');const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(new TextDecoder().decode(await new Response(stream).arrayBuffer()));}return JSON.parse(new TextDecoder().decode(bytes));}
function decode(s){const bytes=Uint8Array.from(atob(s),c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}function node(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
async function init(){try{data=await decodePayload(location.hash.slice(1));if(data.version!==1||!Array.isArray(data.lines)||!Array.isArray(data.answers))throw Error('Formato incorrecto');}catch(e){app.replaceChildren(node('div','ge-error','No se pudo abrir la actividad. El enlace puede estar incompleto o ser demasiado largo. Pedile a tu docente que genere otro enlace.'));return;}
if(new URLSearchParams(location.search).has('tutorial'))iniciarTutorialAlumno();
byId('ge-start').addEventListener('click',()=>{const name=byId('ge-name').value.trim();if(!name){alert('Escribí tu nombre para comenzar.');return;}student=name.toUpperCase();start();});byId('ge-name').addEventListener('keydown',e=>{if(e.key==='Enter')byId('ge-start').click()});
}
init();
let guiaAlumno=null;
function iniciarTutorialAlumno(){
 let paso=0;
 const etapas=[
  {titulo:'RESOLVER LA ACTIVIDAD',texto:'Aquí tus estudiantes deberán escribir su nombre y resolver la actividad.',sel:'#ge-name'},
  {titulo:'CORREGIR Y REVISAR',texto:'Cuando tus estudiantes toquen TERMINAR ACTIVIDAD, GramaNick indicará ¡MUY BIEN! o REVISAR. Si hay algo para corregir, podrán tocar VOLVER A REVISAR e intentarlo otra vez. Si aparece ¡MUY BIEN!, podrán descargar la actividad.',sel:'#ge-finish'},
  {titulo:'DESCARGAR LA ACTIVIDAD',texto:'Podés descargar la actividad resuelta en dos formatos diferentes: JPG (imagen) o PDF (archivo).',sel:'#ge-downloads'}
 ];
 const layer=node('div','ge-demo-guide');
 const card=node('div','ge-demo-card');
 const counter=node('small','','');const title=node('h2');const body=node('p');
 const nav=node('div','ge-demo-nav');const exit=node('button','','Salir');const back=node('button','','← Anterior');const next=node('button','','Siguiente →');
 nav.append(exit,back,next);card.append(counter,title,body,nav);layer.append(card);document.body.append(layer);
 const focus=()=>{document.querySelectorAll('.ge-demo-highlight').forEach(e=>e.classList.remove('ge-demo-highlight'));const e=document.querySelector(etapas[paso].sel);if(e){e.classList.add('ge-demo-highlight');e.scrollIntoView({block:'center',behavior:'instant'});}};
 const render=()=>{counter.textContent='PASO '+(17+paso)+' DE 19';title.textContent=etapas[paso].titulo;body.textContent=etapas[paso].texto;back.disabled=paso===0;next.textContent=paso===2?'Finalizar':'Siguiente →';focus();};
 const end=()=>{document.querySelectorAll('.ge-demo-highlight').forEach(e=>e.classList.remove('ge-demo-highlight'));layer.remove();};
 exit.onclick=end;
 back.onclick=()=>{if(paso===2){paso=1;render();}else if(paso===1){paso=0;render();}};
 next.onclick=()=>{
  if(paso===0){if(!byId('ge-name'))return;byId('ge-name').value='DEMOSTRACIÓN';byId('ge-start').click();paso=1;render();}
  else if(paso===1){const s=[...state.values()][0];if(s){s.placed=s.words.map(w=>w.id);s.pool=[];draw([...state.keys()][0]);}byId('ge-finish')?.click();paso=2;render();}
  else end();
 };
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
   const ficha=tile(m.words[id],()=>{m.placed[i]=null;m.active=null;miniDraw()});
   ficha.addEventListener('click',e=>e.stopPropagation());
   ficha.title='Tocá para devolver esta ficha al banco';
   answer.append(ficha);
   el.append(answer);
  }
  el.onclick=()=>{if(m.placed[i]===null)miniChoose(i)};
  el.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target===el&&m.placed[i]===null){e.preventDefault();miniChoose(i)}};
 });
 m.bank.replaceChildren();
 m.words.forEach((w,i)=>{if(!m.placed.includes(i))m.bank.append(tile(w,()=>miniPut(i)))});
}
function start(){app.replaceChildren();const paper=node('article','ge-paper');paper.id='ge-paper';paper.append(node('div','ge-student-name','NOMBRE: '+student));const answers=new Map(data.answers.map(a=>[a.line,a]));
const miniAnswers=Array.isArray(data.minis)?data.minis:[];
const miniByLine=new Map();miniAnswers.forEach(a=>{if(!miniByLine.has(a.line))miniByLine.set(a.line,[]);miniByLine.get(a.line).push(a)});
const miniSpaces=[];
data.lines.forEach(l=>{const line=node('div','ge-line');if(answers.has(l.index)){const a=answers.get(l.index);const ex=node('div','ge-exercise');ex.dataset.index=l.index;ex.append(node('h3','','ORDENÁ LAS PALABRAS'));const placed=node('div','ge-placed');placed.setAttribute('aria-label','Oración construida');const bank=node('div','ge-bank');bank.setAttribute('aria-label','Palabras disponibles');const feedback=node('div','ge-feedback');const words=a.words.map((w,i)=>({...w,id:i}));state.set(l.index,{words,placed:[],pool:shuffle(words.map(w=>w.id)),ex,placedEl:placed,bankEl:bank,feedback});ex.append(placed,bank,feedback);line.append(ex);draw(l.index);}else{const original=document.createElement('div');original.innerHTML=l.html;original.querySelectorAll('button,input,select,textarea,script').forEach(x=>x.remove());line.append(...original.childNodes);
 if(miniByLine.has(l.index)){
  const slots=[...line.querySelectorAll('.ge-mini-slot')];
  miniByLine.get(l.index).forEach(a=>{const el=slots[a.slot];if(el){el.classList.add('ge-mini-interactive');miniSpaces.push({el,word:a.word});}});
 }
}paper.append(line);});app.append(paper);
if(miniSpaces.length){
 const words=[...miniSpaces.map(x=>x.word),...(data.distractors||[])].filter(Boolean).map((w,i)=>({...w,id:i}));
 const bank=node('div','ge-mini-common');bank.append(node('h3','','PALABRAS DISPONIBLES'));
 const bankTiles=node('div','ge-bank');bank.append(bankTiles);paper.append(bank);
 miniState={spaces:miniSpaces.map(x=>x.el),expected:miniSpaces.map(x=>x.word.text),words,placed:miniSpaces.map(()=>null),active:null,bank:bankTiles};
 miniDraw();
}else miniState=null;const actions=node('div','ge-actions');const finish=node('button','','TERMINAR ACTIVIDAD');finish.id='ge-finish';finish.onclick=correct;actions.append(finish);const downloads=node('div');downloads.id='ge-downloads';downloads.hidden=true;const jpg=node('button','','DESCARGAR JPG');jpg.onclick=()=>exportWork('jpg');const pdf=node('button','','DESCARGAR PDF');pdf.onclick=()=>exportWork('pdf');const retry=node('button','ge-secondary','VOLVER A REVISAR');retry.onclick=()=>{checked=false;finish.hidden=false;state.forEach(s=>{s.feedback.textContent='';s.feedback.className='ge-feedback'});const miniFeedback=byId('ge-mini-feedback');if(miniFeedback)miniFeedback.remove();downloads.hidden=true;paper.scrollIntoView({behavior:'smooth'})};downloads.append(jpg,pdf,retry);actions.append(downloads);app.append(actions);}
function tile(word,onClick){const el=node('button','ge-tile');el.type='button';el.setAttribute('aria-label',word.text);el.innerHTML=word.html;el.querySelectorAll('script,button,input,textarea,select').forEach(n=>n.remove());el.querySelectorAll('*').forEach(n=>{[...n.attributes].forEach(a=>{if(a.name.startsWith('on'))n.removeAttribute(a.name)})});el.onclick=onClick;requestAnimationFrame(()=>fitTileWord(el));return el;}
function draw(id){const s=state.get(id);s.placedEl.replaceChildren();s.bankEl.replaceChildren();s.placed.forEach((i,k)=>s.placedEl.append(tile(s.words[i],()=>{s.placed.splice(k,1);s.pool.push(i);invalidate(s);draw(id)})));s.pool.forEach((i,k)=>s.bankEl.append(tile(s.words[i],()=>{s.pool.splice(k,1);s.placed.push(i);invalidate(s);draw(id)})));}
function invalidate(s){if(checked){s.feedback.textContent='MODIFICADO · VOLVÉ A CORREGIR';s.feedback.className='ge-feedback';}}
function correct(){checked=true;let good=0;state.forEach(s=>{const ok=s.placed.length===s.words.length&&s.placed.every((id,index)=>String(s.words[id].text).normalize('NFC').trim()===String(s.words[index].text).normalize('NFC').trim());if(ok)good++;s.feedback.textContent=ok?'✓ ¡MUY BIEN!':'↻ REVISAR';s.feedback.className='ge-feedback '+(ok?'good':'bad');});if(miniState){
 const m=miniState;const ok=m.placed.every((id,i)=>id!==null&&String(m.words[id].text).normalize('NFC').trim()===String(m.expected[i]).normalize('NFC').trim());
 let fb=byId('ge-mini-feedback');if(!fb){fb=node('div','ge-feedback');fb.id='ge-mini-feedback';m.bank.parentElement.append(fb)}
 fb.textContent=ok?'✓ ¡MUY BIEN!':'↻ REVISAR';fb.className='ge-feedback '+(ok?'good':'bad');
}byId('ge-downloads').hidden=false;byId('ge-finish').hidden=true;}
function fitTileWord(tile){if(!tile.isConnected)return;const el=tile.querySelector('.ge-token-word');if(!el)return;let px=23;el.style.fontSize=px+'px';const max=tile.clientWidth-14;while(el.scrollWidth>max&&px>11){px--;el.style.fontSize=px+'px';}}
function fitExportWords(root){root.querySelectorAll('.ge-tile .ge-token-word').forEach(el=>{el.style.whiteSpace='nowrap';el.style.overflowWrap='normal';el.style.wordBreak='normal';let px=23;el.style.fontSize=px+'px';const max=el.closest('.ge-tile').clientWidth-12;while(el.scrollWidth>max&&px>11){px--;el.style.fontSize=px+'px';}})}
async function exportWork(format){const paper=byId('ge-paper');if(!window.html2canvas){alert('No se pudo cargar el generador de imágenes. Conectate a Internet y volvé a intentar.');return;}const clone=paper.cloneNode(true);clone.querySelectorAll('.ge-tile').forEach(tile=>{tile.classList.remove('selected','seleccionada','seleccionado','activo','seleccion-multiple-activa');tile.blur();});clone.classList.add('ge-export');clone.style.cssText='position:fixed;left:-100000px;top:0;width:900px;max-width:none;box-shadow:none;z-index:-1';clone.querySelectorAll('.ge-placed button').forEach(btn=>{btn.disabled=true});document.body.append(clone);try{await document.fonts.ready;fitExportWords(clone);await Promise.all([...clone.querySelectorAll('img')].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;setTimeout(resolve,3000)})));const canvas=await html2canvas(clone,{backgroundColor:'#ffffff',scale:1.6,useCORS:true,logging:false,windowWidth:1000});const name=student.replace(/[^a-z0-9áéíóúñ_-]+/gi,'_');if(format==='jpg'){const a=document.createElement('a');a.href=canvas.toDataURL('image/jpeg',.92);a.download='GramaNick_'+name+'.jpg';a.click();}else{if(!window.jspdf){alert('No se pudo cargar la biblioteca de PDF. Conectate a Internet y volvé a intentar.');return;}const {jsPDF}=window.jspdf;const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});const width=190;const pageHeight=277;const scale=width/canvas.width;const pagePixels=Math.floor(pageHeight/scale);let offset=0;while(offset<canvas.height){if(offset)pdf.addPage();const height=Math.min(pagePixels,canvas.height-offset);const piece=document.createElement('canvas');piece.width=canvas.width;piece.height=height;piece.getContext('2d').drawImage(canvas,0,offset,canvas.width,height,0,0,canvas.width,height);pdf.addImage(piece.toDataURL('image/jpeg',.88),'JPEG',10,10,width,height*scale);offset+=height;}pdf.save('GramaNick_'+name+'.pdf');}}catch(e){console.error(e);alert('No se pudo generar el archivo. Probá con menos fotos o con otra opción de descarga.');}finally{clone.remove();}}
})();
