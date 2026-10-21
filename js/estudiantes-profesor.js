(function(){
const $=s=>document.querySelector(s);
let panel;
function make(tag,txt,cls){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e;}
async function encodePayload(obj){
 const bytes=new TextEncoder().encode(JSON.stringify(obj));
 if(typeof CompressionStream==='function'){
  try{const stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
   const packed=new Uint8Array(await new Response(stream).arrayBuffer());
   return 'gz.'+btoa(Array.from(packed,c=>String.fromCharCode(c)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }catch(e){console.warn('Compresión no disponible',e)}
 }
 return 'raw.'+utf8b64(JSON.stringify(obj)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function utf8b64(s){return btoa(Array.from(new TextEncoder().encode(s),c=>String.fromCharCode(c)).join(''));}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function cleanClone(el){let clone=el.cloneNode(true);clone.querySelectorAll('.seleccion-multiple-activa,.seleccionada,.seleccionado,.activo,.selected').forEach(n=>n.classList.remove('seleccion-multiple-activa','seleccionada','seleccionado','activo','selected'));clone.querySelectorAll('button, input, select, textarea, .no-descargar, .controles-foto, .control-picto').forEach(n=>n.remove());clone.querySelectorAll('*').forEach(n=>{[...n.attributes].forEach(a=>{if(a.name.startsWith('on')||a.name==='contenteditable')n.removeAttribute(a.name)});});return clone;}
function collect(){const lines=[...$('#resultado').children];return lines.map((el,i)=>({index:i,html:cleanClone(el).outerHTML,isBlank:!!el.querySelector('.renglon-escritura'),miniCount:el.querySelectorAll('.ge-mini-slot').length}));}
function openPanel(){const lines=collect();if(!lines.length){alert('Primero creá una actividad con el botón CREAR.');return;}panel.hidden=false;panel.innerHTML='';panel.append(make('h2','CREAR ACTIVIDAD INTERACTIVA'),make('p','Seleccioná los renglones donde querés que tus estudiantes respondan. Los espacios ___ aceptan una palabra cada uno y comparten un banco común. Escribí la oración correcta en cada uno. Esas palabras se mezclarán para que puedan ordenarlas al realizar la actividad. Podés editar los apoyos visuales de cada ficha antes de generar la actividad.'));
const forms=[];const miniForms=[];lines.filter(l=>l.isBlank).forEach((l,k)=>{const section=make('div',undefined,'ge-teacher-line');const check=document.createElement('input');check.type='checkbox';check.checked=true;const label=make('label',` Renglón ${k+1}`);label.prepend(check);const input=document.createElement('input');input.placeholder='Oración correcta, por ejemplo: EL NENE ESTÁ PINTANDO';input.className='ge-answer';const preview=make('div',undefined,'ge-preview');input.addEventListener('input',()=>{drawTokens(input.value,preview);const box=panel.querySelector('#ge-links');if(box)box.hidden=true;});check.addEventListener('change',()=>{input.disabled=!check.checked;preview.hidden=!check.checked;});section.append(label,input,preview);panel.append(section);forms.push({line:l.index,check,input,preview});});
// Los espacios se configuran por separado; las fichas se reúnen en un banco único.
lines.filter(l=>l.miniCount).forEach(l=>{
 for(let i=0;i<l.miniCount;i++){
  const section=make('div',undefined,'ge-teacher-line');
  const label=make('label',`Completar palabra ${i+1} · Línea ${l.index+1}`);
  const input=document.createElement('input');input.className='ge-answer';input.placeholder='Una sola palabra correcta, por ejemplo: LAVÓ';
  const preview=make('div',undefined,'ge-preview');
  input.addEventListener('input',()=>{drawTokens(input.value.trim().split(/\s+/)[0]||'',preview);const box=panel.querySelector('#ge-links');if(box)box.hidden=true;});
  section.append(label,input,preview);panel.append(section);miniForms.push({line:l.index,slot:i,input,preview});
 }
});
let distractInput=null,distractPreview=null;
if(miniForms.length){
 const section=make('div',undefined,'ge-teacher-line');section.append(make('label','Palabras distractoras (opcionales) · Banco común'));
 distractInput=document.createElement('input');distractInput.className='ge-answer';distractInput.placeholder='Ejemplo: COMIÓ MIRÓ';
 distractPreview=make('div',undefined,'ge-preview');distractInput.addEventListener('input',()=>{drawTokens(distractInput.value,distractPreview);const box=panel.querySelector('#ge-links');if(box)box.hidden=true;});
 section.append(distractInput,distractPreview);panel.append(section);
}
if(!forms.length&&!miniForms.length){panel.append(make('p','No encontré renglones [[RENGLON]] ni espacios ___ en el resultado.'));}
const buttons=make('div',undefined,'ge-teacher-actions');const generate=make('button','✨ Generar enlace de la actividad interactiva ✨');generate.className='ge-generate';generate.onclick=async()=>{const chosen=forms.filter(f=>f.check.checked);if((!chosen.length&&!miniForms.length)||chosen.some(f=>!f.input.value.trim())||miniForms.some(f=>f.input.value.trim().split(/\s+/).length!==1)){alert('Completá cada mini renglón con una sola palabra y las respuestas de los renglones seleccionados.');return;}const answers=chosen.map(f=>({line:f.line,words:[...f.preview.querySelectorAll('.ge-edit-token')].map(e=>({text:e.dataset.word,html:exportTokenFace(e)}))}));const minis=miniForms.map(f=>({line:f.line,slot:f.slot,word:[...f.preview.querySelectorAll('.ge-edit-token')].map(e=>({text:e.dataset.word,html:exportTokenFace(e)}))[0]}));
const distractors=distractPreview?[...distractPreview.querySelectorAll('.ge-edit-token')].map(e=>({text:e.dataset.word,html:exportTokenFace(e)})):[];
const payload={version:1,lines,answers,minis,distractors};const encoded=await encodePayload(payload);const base=new URL('estudiantes.html',location.href).href.split('#')[0];const url=base+'#'+encoded;const output=$('#ge-link');output.value=url;$('#ge-links').hidden=false;$('#ge-link-size').textContent='Tamaño del enlace: '+Math.round(url.length/1024)+' KB. Los enlaces con muchas fotos pueden superar el límite del navegador o de aplicaciones de mensajería.';};const close=make('button','×');close.className='ge-close';close.setAttribute('aria-label','Cerrar actividad interactiva');close.title='Cerrar';close.type='button';close.onclick=()=>panel.hidden=true;buttons.append(generate,close);panel.append(buttons);
const links=make('div',undefined,'ge-links');links.id='ge-links';links.hidden=true;const out=document.createElement('input');out.id='ge-link';out.type='hidden';links.append(out);const size=make('p');size.id='ge-link-size';size.hidden=true;links.append(size);const copy=make('button','COPIAR ENLACE');copy.className='ge-copy';copy.onclick=async()=>{try{await navigator.clipboard.writeText(out.value);copy.textContent='✓ ENLACE COPIADO';setTimeout(()=>copy.textContent='COPIAR ENLACE',2000)}catch(e){const fallback=document.createElement('textarea');fallback.value=out.value;document.body.append(fallback);fallback.select();document.execCommand('copy');fallback.remove();copy.textContent='✓ ENLACE COPIADO';setTimeout(()=>copy.textContent='COPIAR ENLACE',2000)}};const view=make('button','PROBAR COMO ESTUDIANTE');view.className='ge-view';view.onclick=()=>{try{window.open(out.value,'_blank','noopener')}catch(e){alert('No se pudo abrir la pestaña. Copiá el enlace y abrilo manualmente.')}};links.append(copy,view);panel.append(links);links.hidden=true;panel.scrollIntoView({behavior:'smooth',block:'start'});
}
function exportTokenFace(item){
 const face=item.querySelector('.ge-token-face').cloneNode(true);
 face.querySelectorAll('.menu-pictos, .flecha-picto, .eliminar-picto, button').forEach(n=>n.remove());
 face.querySelectorAll('.picto-seleccionable').forEach(n=>{
   const img=n.querySelector('img');if(!img||img.style.display==='none'){n.remove();return;}
   const clean=img.cloneNode(true);n.replaceWith(clean);
 });
 if(face.querySelector('.ge-token-picto')?.style.display==='none')face.querySelector('.ge-token-picto').replaceChildren();
 return face.innerHTML;
}
function drawTokens(value,where){
  // Preservar ediciones de palabras ya existentes al escribir nuevas palabras.
  const old=[...where.querySelectorAll('.ge-edit-token')];
  const words=value.trim().split(/\s+/).filter(Boolean);
  if(words.length===old.length && words.every((w,i)=>old[i].dataset.word===w))return;
  where.replaceChildren();
  words.forEach((word,index)=>{
    const item=make('div',undefined,'ge-edit-token');item.dataset.word=word;
    const face=make('div',undefined,'ge-token-face');
    const picto=make('div',undefined,'ge-token-picto');
    const clean=word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu,'');
    const alias=typeof aplicarAlias==='function'?aplicarAlias(clean):null;
    const concepto=alias||clean; const buscar=typeof obtenerRaizVerbal==='function'?(obtenerRaizVerbal(clean)||concepto):concepto;
    const locales=typeof obtenerPictos==='function'?obtenerPictos(concepto):[];
    if(locales.length && typeof crearPictoLocalConArasaac==='function')picto.append(crearPictoLocalConArasaac(locales,concepto));
    else if(typeof crearPictoArasaacExperimental==='function')picto.append(crearPictoArasaacExperimental(buscar));
    const symbolRow=make('div',undefined,'fila-simbolo ge-symbol-row');
    const text=make('strong',word.toUpperCase(),'ge-token-word');
    if(typeof obtenerEstiloPalabraCompuesta==='function'){
      const style=obtenerEstiloPalabraCompuesta(word,words[index-1]||'',words[index+1]||'');
      if(style){text.style.color=style.color;text.style.fontWeight=style.negrita?'bold':'normal';}
    }
    face.append(picto,symbolRow,text);
    const grammatical=(typeof obtenerRaizVerbal==='function'&&obtenerRaizVerbal(clean))?'verbo':
      (typeof esAdjetivo==='function'&&esAdjetivo(clean))?'adjetivo':
      (typeof esPronombre==='function'&&esPronombre(clean))?'pronombre':
      (typeof esRelacionante==='function'&&esRelacionante(clean))?'relacionante':'';
    if(grammatical==='verbo'||grammatical==='adjetivo'||grammatical==='pronombre'){
      if(typeof agregarSimboloAPalabra==='function'){
        agregarSimboloAPalabra(face,grammatical);
      }
    }
    const tools=make('div',undefined,'ge-token-tools');
    const buscarBtn=make('button','PICTOGRAMA');buscarBtn.className='ge-picto-add';buscarBtn.type='button';buscarBtn.title='Buscar o reemplazar pictograma';
    buscarBtn.onclick=()=>{
      const previous=item.querySelector('.ge-manual-search');if(previous){previous.remove();return;}
      const search=make('div',undefined,'ge-manual-search');
      const query=make('input');query.value=buscar||clean;query.placeholder='Buscar pictograma';
      const run=make('button','BUSCAR');run.type='button';
      const results=make('div',undefined,'ge-manual-results');
      run.onclick=async()=>{
        results.replaceChildren(make('span','Buscando pictogramas…'));
        const term=query.value.trim();if(!term)return;
        const own=typeof obtenerPictos==='function'?obtenerPictos(term):[];
        const remote=typeof buscarPictogramasArasaac==='function'?await buscarPictogramasArasaac(term,Infinity):[];
        const urls=[...new Set([...(Array.isArray(own)?own:[]),...remote])];results.replaceChildren();
        if(!urls.length){results.append(make('span','Sin resultados. Probá otra palabra, por ejemplo LAVAR.'));return;}
        let count=0;const render=()=>{
          urls.slice(count,count+12).forEach(url=>{const choose=make('button');choose.type='button';choose.title='Usar este pictograma';const image=make('img');image.src=url;image.alt=term;choose.append(image);choose.onclick=()=>{const imageContainer=make('div',undefined,'picto-seleccionable');const selected=make('img');selected.src=url;selected.alt=term;imageContainer.append(selected);picto.replaceChildren(imageContainer);picto.style.display='';ensurePictoRemove();search.remove();};results.append(choose)});
          count+=12;more.hidden=count>=urls.length;
        };
        const more=make('button','+');more.type='button';more.className='ge-ver-mas-pictos';more.onclick=()=>{render();results.append(more);results.scrollTop=results.scrollHeight;};render();results.append(more);
      };
      search.append(query,run,results);item.append(search);query.focus();
    };
    // La X aparece solo sobre el pictograma presente, nunca como cuarto control.
    function ensurePictoRemove(){
      picto.querySelectorAll('.ge-remove-picto').forEach(b=>b.remove());
      if(!picto.querySelector('img'))return;
      const remove=make('button','×','ge-remove-picto');remove.type='button';
      remove.title='Quitar pictograma';remove.setAttribute('aria-label','Quitar pictograma');
      remove.onclick=(event)=>{event.preventDefault();event.stopPropagation();picto.replaceChildren();};
      picto.append(remove);
    }
    ensurePictoRemove();
    const color=make('select');color.setAttribute('aria-label','COLOR');color.title='COLOR';[['auto','COLOR'],['#111111','Negro'],['#ed1c24','Rojo'],['#2563eb','Azul']].forEach(([v,t])=>{const o=make('option',t);o.value=v;color.append(o)});
    color.onchange=()=>{const style=typeof obtenerEstiloPalabraCompuesta==='function'?obtenerEstiloPalabraCompuesta(word,words[index-1]||'',words[index+1]||''):null;text.style.color=color.value==='auto'?(style?.color||'black'):color.value};
    const symbol=make('select');symbol.setAttribute('aria-label','SÍMBOLOS');symbol.title='SÍMBOLOS';[['auto','SÍMBOLOS'],['borrar','Sin símbolo'],['verbo','Verbo'],['adjetivo','Adjetivo'],['infinitivo','Infinitivo'],['pronombre','Pronombre'],['reflexivo','Reflexivo']].forEach(([v,t])=>{const o=make('option',t);o.value=v;symbol.append(o)});
    symbol.onchange=()=>{symbolRow.replaceChildren();if(symbol.value==='auto'){if(grammatical&&typeof agregarSimboloAPalabra==='function')agregarSimboloAPalabra(face,grammatical);}else if(typeof agregarSimboloAPalabra==='function')agregarSimboloAPalabra(face,symbol.value);};
    tools.append(buscarBtn,color,symbol);item.append(face,tools);where.append(item);
  });
}
window.addEventListener('DOMContentLoaded',()=>{const actions=$('.acciones-exportar');if(!actions)return;const btn=make('button','✨ GENERAR ACTIVIDAD INTERACTIVA ✨');btn.className='ge-launch';btn.type='button';btn.onclick=openPanel;actions.append(btn);panel=make('section',undefined,'ge-teacher-panel');panel.hidden=true;actions.closest('.zona-resultado').append(panel);});
})();
