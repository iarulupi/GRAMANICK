// GramaNick: escritura libre en Estudiantes, sin fichas ni recuadros.
// Comparte interpretación, estilos, pictogramas y símbolos con el editor original.
(function(){'use strict';
// Cambios visuales persistentes por área, sin alterar el texto ni la clasificación.
const memorias=new WeakMap();
function palabrasDe(texto){return (String(texto||'').match(/\S+/g)||[]);}
function sincronizar(memoria,anteriores,actuales){
 const prev=memoria.words||[];if(prev.join('\u0000')===actuales.join('\u0000'))return memoria.choices||{};
 const old=memoria.choices||{}, next={};
 // Alineación de palabras por subsecuencia común: inserciones no desplazan elecciones.
 const n=prev.length,m=actuales.length, dp=Array.from({length:n+1},()=>new Uint16Array(m+1));
 if(n*m<=90000){for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=prev[i]===actuales[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
 let i=0,j=0;while(i<n&&j<m){if(prev[i]===actuales[j]){if(old[i])next[j]=old[i];i++;j++;}else if(dp[i+1][j]>=dp[i][j+1])i++;else j++;}}
 else for(let i=0;i<Math.min(n,m);i++)if(prev[i]===actuales[i]&&old[i])next[i]=old[i];
 memoria.words=actuales;memoria.choices=next;return next;
}
function capturar(contenedor,memoria){
 contenedor.querySelectorAll('.gn-free-word[data-gn-word-index]').forEach(w=>{
 const idx=+w.dataset.gnWordIndex, box=w.querySelector('.gn-free-picto');if(!box)return;
 const old=memoria.choices[idx]||{};if(old.deleted)return;
 const img=box.querySelector('.picto-seleccionable > img');
 if(img&&img.getAttribute('src')&&img.complete){const url=img.src;
 if(old.url || (box.dataset.gnInitialUrl && url!==box.dataset.gnInitialUrl))memoria.choices[idx]={url};}
 });
}
function instalarInteraccion(wrap,picto,idx,memoria){
 const actualizar=()=>{
  const choice=memoria.choices[idx];if(!choice)return;
  if(choice.deleted){picto.style.display='none';wrap.classList.add('gn-free-without-picto');return;}
  const img=picto.querySelector('.picto-seleccionable > img');if(img&&choice.url&&img.src!==choice.url)img.src=choice.url;
 };
 const observar=new MutationObserver(()=>{observar.disconnect();actualizar();observar.observe(picto,{childList:true,subtree:true});});
 observar.observe(picto,{childList:true,subtree:true});
 picto.addEventListener('click',e=>{
  const target=e.target;
  if(target.closest('.gn-free-remove-picto'))return;
  if(target.closest('.opcion-picto')){const url=target.closest('img')?.src;if(url)memoria.choices[idx]={url};return;}
  if(target.closest('.menu-pictos'))return;
  const arrow=picto.querySelector('.flecha-picto');
  if(arrow&&!target.closest('.flecha-picto')){e.preventDefault();e.stopPropagation();arrow.click();}
 });
 const quitar=document.createElement('button');quitar.type='button';quitar.className='gn-free-remove-picto no-descargar';quitar.textContent='×';quitar.title='Quitar pictograma';quitar.setAttribute('aria-label','Quitar pictograma');quitar.contentEditable='false';
 quitar.addEventListener('mousedown',e=>e.preventDefault());
 quitar.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();memoria.choices[idx]={deleted:true};picto.style.display='none';wrap.classList.add('gn-free-without-picto');});
 picto.append(quitar);
 const recuperar=document.createElement('button');recuperar.type='button';recuperar.className='gn-free-restore-picto no-descargar';recuperar.textContent='+';recuperar.title='Recuperar pictograma';recuperar.setAttribute('aria-label','Recuperar pictograma');recuperar.contentEditable='false';
 recuperar.addEventListener('mousedown',e=>e.preventDefault());
 recuperar.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();delete memoria.choices[idx];wrap.classList.remove('gn-free-without-picto');picto.style.display='';});
 wrap.append(recuperar);actualizar();
}

function render(texto,contenedor,config){
 if(!contenedor)return;
 const options={pictograma:true,color:true,simbolos:true,...(config||{})};
 const memoria=memorias.get(contenedor)||{words:[],choices:{}};
 memorias.set(contenedor,memoria);
 capturar(contenedor,memoria);
 sincronizar(memoria,memoria.words,palabrasDe(texto));
 contenedor.replaceChildren();
 let indiceGlobal=0;
 const lines=String(texto||'').split(/\r?\n/);
 lines.forEach((line,lineIndex)=>{
  const row=document.createElement('div');row.className='gn-free-text-line';
  const tokens=line.match(/\s+|\S+/g)||[];
  const words=tokens.filter(token=>!/^\s+$/.test(token));
  let wordIndex=0;
  tokens.forEach(token=>{
   if(/^\s+$/.test(token)){row.append(document.createTextNode(token));return;}
   const word=token;
   const index=wordIndex++;
   const globalIndex=indiceGlobal++;
   const clean=word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu,'');
   const wrap=document.createElement('span');wrap.className='gn-free-word';wrap.dataset.gnWordIndex=String(globalIndex);
   const label=document.createElement('span');label.className='gn-free-label';label.textContent=word;
   if(clean){
    const prev=words[index-1]||'',next=words[index+1]||'';
    const info=typeof interpretarGramaticaCompartida==='function'?interpretarGramaticaCompartida(clean,prev,next):{tipo:'sustantivo'};
    if(options.color&&typeof obtenerEstiloPalabraCompuesta==='function'){
      const style=obtenerEstiloPalabraCompuesta(clean,prev,next);
      if(style){label.style.color=style.color||'';label.style.fontWeight=style.negrita?'700':'400';}
    }
    if(options.pictograma){
      const picto=document.createElement('span');picto.className='gn-free-picto';picto.contentEditable='false';
      const alias=typeof aplicarAlias==='function'?aplicarAlias(clean):null;
      const concepto=alias||clean;
      const local=typeof obtenerPictos==='function'?obtenerPictos(concepto):[];
      const buscar=info.tipo==='verbo'?(info.base||concepto):concepto;
      if(local.length&&typeof crearPictoLocalConArasaac==='function')picto.append(crearPictoLocalConArasaac(local,concepto));
      else if(typeof crearPictoArasaacExperimental==='function')picto.append(crearPictoArasaacExperimental(buscar));
      wrap.append(picto);
      instalarInteraccion(wrap,picto,globalIndex,memoria);
    }
    if(options.simbolos){
      const fila=document.createElement('span');fila.className='fila-simbolo gn-free-symbol';fila.contentEditable='false';wrap.append(fila);
      const exact=typeof normalizarTextoExacto==='function'?normalizarTextoExacto(clean):clean.toLowerCase();
      const infinitivo=info.tipo==='verbo'&&!info.ambiguas&&(
       (typeof verbosBaseExactos!=='undefined'&&verbosBaseExactos.includes(exact))||
       (typeof esInfinitivoRegularNoCargado==='function'&&esInfinitivoRegularNoCargado(exact)));
      const type=infinitivo?'infinitivo':info.tipo;
      if(['verbo','infinitivo','adjetivo','pronombre','reflexivo','relacionante'].includes(type)&&typeof agregarSimboloAPalabra==='function')agregarSimboloAPalabra(wrap,type);
    }
   }
   wrap.append(label);row.append(wrap);
  });
  contenedor.append(row);
 });
}
window.gnRenderEscrituraLibre=render;
})();
