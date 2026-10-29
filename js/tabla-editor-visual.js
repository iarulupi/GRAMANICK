(function(){
const source=document.getElementById('texto'),editor=document.getElementById('gnEditorVisual');if(!source||!editor)return;
let active=false,lastCell=null,serial=0,updating=false;
const MARK=/^\[\[TABLA:([\w-]+):(\d+):(\d+)\]\]$/;
function cellAtSelection(){const s=getSelection(),n=s&&s.anchorNode;return (n?.nodeType===1?n:n?.parentElement)?.closest?.('td')||null}
function table(rows=2,cols=2,id='t'+Date.now()+'_'+(++serial)){
 const t=document.createElement('table');t.dataset.id=id;t.className='gn-edit-table';
 for(let r=0;r<rows;r++){const tr=t.insertRow();for(let c=0;c<cols;c++){const td=tr.insertCell();td.contentEditable='true';}}return t;
}
function controls(t){
 const bar=document.createElement('div');bar.className='gn-table-controls';bar.contentEditable='false';
 const close=document.createElement('button');close.type='button';close.className='gn-table-delete';close.textContent='×';close.title='Eliminar tabla';close.setAttribute('aria-label','Eliminar tabla');
 close.addEventListener('mousedown',e=>e.preventDefault());close.addEventListener('click',()=>{if(t.textContent.trim()&&!confirm('¿Eliminar la tabla y todo su contenido?'))return;t.remove();bar.remove();lastCell=null;sync()});
 const side=document.createElement('div');side.className='gn-table-side';
 const bottom=document.createElement('div');bottom.className='gn-table-bottom';
 function btn(label,title,fn,parent){const b=document.createElement('button');b.type='button';b.textContent=label;b.title=title;b.setAttribute('aria-label',title);b.addEventListener('mousedown',e=>e.preventDefault());b.addEventListener('click',()=>{fn();sync()});parent.append(b)}
 btn('+','Agregar fila',()=>{const r=t.insertRow();for(let c=0;c<t.rows[0].cells.length;c++)r.insertCell().contentEditable='true'},bottom);
 btn('−','Quitar última fila',()=>{if(t.rows.length<=1)return;const r=t.rows[t.rows.length-1];if(r.textContent.trim()&&!confirm('¿Eliminar la última fila y su contenido?'))return;t.deleteRow(-1)},bottom);
 btn('+','Agregar columna',()=>{if(t.rows[0].cells.length>=8)return alert('Máximo 8 columnas');[...t.rows].forEach(r=>r.insertCell().contentEditable='true')},side);
 btn('−','Quitar última columna',()=>{if(t.rows[0].cells.length<=1)return;if([...t.rows].some(r=>r.lastElementChild.textContent.trim())&&!confirm('¿Eliminar la última columna y su contenido?'))return;[...t.rows].forEach(r=>r.deleteCell(-1))},side);
 bar.append(close,side,bottom);return bar;
}
function cleanupControls(){for(const bar of editor.querySelectorAll('.gn-table-controls')){if(!bar.previousElementSibling?.matches('table.gn-edit-table'))bar.remove()}}
function linesFromEditor(){const lines=[];for(const n of editor.childNodes){if(n.nodeType===3){lines.push(n.textContent);continue}if(n.nodeType!==1)continue;
 if(n.matches('table.gn-edit-table')){const id=n.dataset.id,rs=n.rows.length,cs=n.rows[0].cells.length;lines.push(`[[TABLA:${id}:${rs}:${cs}]]`);for(let r=0;r<rs;r++)for(let c=0;c<cs;c++)lines.push(`[[CELDA:${id}:${r}:${c}]] ${n.rows[r].cells[c].innerText.replace(/\n/g,' ').trim()}`);lines.push(`[[FIN_TABLA:${id}]]`)}
 else if(!n.classList.contains('gn-table-controls'))lines.push(n.innerText||n.textContent||'');}return lines.join('\n')}
function positionDeleteButtons(){
 for(const bar of editor.querySelectorAll('.gn-table-controls')){
  const t=bar.previousElementSibling;
  const close=bar.querySelector('.gn-table-delete');
  if(!t?.matches('table.gn-edit-table')||!close)continue;
  // Reservar una franja SUPERIOR para X y una franja DERECHA para +/-.
  // Posicionar con medidas reales, no con coordenadas relativas a la barra inferior.
  const tableRect=t.getBoundingClientRect();
  const barRect=bar.getBoundingClientRect();
  close.style.top=`${tableRect.top-barRect.top-close.offsetHeight-8}px`;
  close.style.left=`${tableRect.right-barRect.left-close.offsetWidth}px`;
  close.style.right='auto';
 }
}
function sync(){if(!active||updating)return;updating=true;cleanupControls();source.value=linesFromEditor();source.dispatchEvent(new Event('input',{bubbles:true}));updating=false;positionDeleteButtons()}
function rebuild(){updating=true;editor.replaceChildren();const lines=source.value.split('\n');for(let i=0;i<lines.length;i++){const m=lines[i].match(MARK);if(m){const [_,id,rs,cs]=m,t=table(+rs,+cs,id);for(let r=0;r<+rs;r++)for(let c=0;c<+cs;c++){const line=lines[++i]||'';t.rows[r].cells[c].textContent=line.replace(/^\[\[CELDA:[^\]]+\]\]\s?/, '')}i++;editor.append(t,controls(t));}else{const d=document.createElement('div');if(lines[i])d.textContent=lines[i];else d.append(document.createElement('br'));editor.append(d)}}updating=false;requestAnimationFrame(positionDeleteButtons)}
function enable(){if(active)return;active=true;const st=getComputedStyle(source);['minHeight','maxHeight','padding','border','borderRadius','boxShadow','background','color','fontFamily','fontSize','lineHeight','letterSpacing','textAlign'].forEach(k=>editor.style[k]=st[k]);source.hidden=true;source.style.display='none';editor.hidden=false;editor.style.height=source.offsetHeight+'px';rebuild()}
function insertNode(node){editor.focus();const sel=getSelection();const range=sel.rangeCount?sel.getRangeAt(0):null;if(!range||!editor.contains(range.commonAncestorContainer)){editor.append(node);return}let n=range.startContainer;n=n.nodeType===1?n:n.parentElement;let block=n.closest('div,table');if(block&&block.parentElement===editor)block.after(node);else editor.append(node)}
window.insertarTablaGN=function(){enable();const t=table();insertNode(t);t.after(controls(t));sync();t.rows[0].cells[0].focus()};
editor.addEventListener('click',e=>{lastCell=e.target.closest('td')});editor.addEventListener('keyup',()=>{lastCell=cellAtSelection()||lastCell});editor.addEventListener('input',sync);new MutationObserver(()=>{if(active&&!updating){cleanupControls();requestAnimationFrame(positionDeleteButtons)}}).observe(editor,{childList:true,subtree:false});
window.addEventListener('resize',()=>{if(active)positionDeleteButtons()});
function putText(txt){if(!active)return false;editor.focus();let td=cellAtSelection()||lastCell;if(td&&!editor.contains(td))td=null;const sel=getSelection();if(td){if(!sel.rangeCount||!td.contains(sel.anchorNode)){const r=document.createRange();r.selectNodeContents(td);r.collapse(false);sel.removeAllRanges();sel.addRange(r)}document.execCommand('insertText',false,txt);sync();return true}document.execCommand('insertText',false,txt);sync();return true}
const row=window.insertarRenglonEnTexto;window.insertarRenglonEnTexto=function(){if(!active)return row?.();putText(' [[RENGLON]] ')};
const box=window.insertarCuadroImagen;window.insertarCuadroImagen=function(){if(!active)return box?.();const size=prompt('Tamaño del cuadro de imagen (3, 5 o 7 cm):','5');if(size===null)return;if(!['3','5','7'].includes(size.trim()))return alert('Elegí 3, 5 o 7 cm.');putText(' [[IMAGEN_'+size.trim()+']] ')};
let pendingPhotoCell=null;
window.gnInsertPhotoInCell=function(marker){if(!active||!pendingPhotoCell||!editor.contains(pendingPhotoCell))return false;const td=pendingPhotoCell;pendingPhotoCell=null;td.focus();const sel=getSelection(),r=document.createRange();r.selectNodeContents(td);r.collapse(false);sel.removeAllRanges();sel.addRange(r);document.execCommand('insertText',false,' '+marker+' ');sync();return true};
const photo=window.abrirSelectorFoto;window.abrirSelectorFoto=function(){if(!active)return photo?.();pendingPhotoCell=cellAtSelection()||lastCell;if(!pendingPhotoCell||!editor.contains(pendingPhotoCell)){alert('Primero tocá la celda donde querés agregar la foto.');return}const input=document.getElementById('inputFotoActividad');if(input){input.value='';input.click()}};
// Al crear, procesamos cada celda como texto normal de GramaNick y después
// reagrupamos las líneas ya procesadas en una tabla real dentro del resultado.
// La fuente con marcadores permanece intacta para seguir editando.
function renderTables(original, normalized){
 const result=document.getElementById('resultado');if(!result)return;
 const originalLines=original.split('\n');
 const children=[...result.children];
 let offset=0;
 for(let i=0;i<originalLines.length;i++){
  const m=originalLines[i].match(MARK);
  if(!m)continue;
  const rs=Number(m[2]),cs=Number(m[3]);
  const count=rs*cs;
  const tableNode=document.createElement('table');
  tableNode.className='gn-result-table';
  tableNode.setAttribute('aria-label','Tabla de actividad');
  for(let r=0;r<rs;r++){
   const tr=tableNode.insertRow();
   for(let c=0;c<cs;c++){
    const td=tr.insertCell();
    const lineIndex=i+1+r*cs+c;
    const rendered=children[lineIndex];
    if(rendered){
     rendered.classList.add('gn-table-cell-content');
     td.appendChild(rendered);
    }
   }
  }
  const first=children[i];
  if(first?.parentNode)first.replaceWith(tableNode);
  // Los nodos de contenido ya se movieron a sus celdas.
  const end=children[i+count+1];
  if(end?.parentNode)end.remove();
  i+=count+1;
 }
}
const show=window.mostrarPictos;
if(typeof show==='function')window.mostrarPictos=function(...args){
 sync();
 const original=source.value;
 const lines=original.split('\n');
 // Las marcas de estructura se sustituyen por líneas vacías; las celdas
 // se convierten en líneas normales para que actúe el motor de pictogramas.
 const normalized=lines.map(line=>{
  if(MARK.test(line)||/^\[\[FIN_TABLA:[^\]]+\]\]$/.test(line))return '';
  return line.replace(/^\[\[CELDA:[^\]]+\]\]\s?/, '');
 }).join('\n');
 source.value=normalized;
 let ret;
 try{ret=show.apply(this,args)}finally{source.value=original}
 // Se agrupan los nodos inmediatamente: los pictogramas que cargan
 // asincrónicamente conservan sus propios elementos dentro de cada celda.
 renderTables(original,normalized);
 return ret;
};
})();
