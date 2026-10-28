/* Ajuste tipográfico de tablas SOLO en pantalla; impresión conserva los estilos originales. */
(function(){
 'use strict';
 let queued=false;
 const BASE=30, MIN=10;
 function adjust(){
  queued=false;
  if(window.matchMedia('print').matches)return;
  document.querySelectorAll('#resultado table.gn-result-table, .ge-paper table.gn-result-table').forEach(table=>{
   table.querySelectorAll('td').forEach(td=>{
    const content=td.querySelector('.gn-table-cell-content');
    if(!content)return;
    const tokens=[...content.children].filter(el=>el.classList.contains('palabra'));
    const labels=tokens.map(t=>t.querySelector('.fila-texto')).filter(Boolean);
    if(!labels.length)return;
    labels.forEach(label=>{label.style.fontSize=BASE+'px';label.style.whiteSpace='nowrap';label.style.width='max-content';label.style.minWidth='0';label.style.maxWidth='none'});
    const available=Math.max(1,td.clientWidth-20);
    // Se calcula el espacio de TODAS las palabras juntas, no solamente de cada una.
    const natural=labels.reduce((sum,label)=>sum+label.scrollWidth,0);
    const gaps=Math.max(0,tokens.length-1)*4+tokens.length*5;
    const ratio=Math.min(1,(available-gaps)/Math.max(1,natural));
    const px=Math.max(MIN,Math.min(BASE,Math.floor(BASE*ratio)));
    labels.forEach(label=>{label.style.fontSize=px+'px';label.style.maxWidth='none'});
    td.classList.toggle('gn-cell-scroll',natural*px/BASE+gaps>available+2);
   });
  });
 }
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(adjust)}
 document.addEventListener('DOMContentLoaded',()=>{
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  if(window.ResizeObserver)new ResizeObserver(schedule).observe(document.documentElement);
  window.addEventListener('resize',schedule);
  window.addEventListener('beforeprint',()=>document.querySelectorAll('.gn-result-table .fila-texto').forEach(el=>{el.style.fontSize='';el.style.width='';el.style.maxWidth='';el.style.whiteSpace='';}));
  window.addEventListener('afterprint',schedule);
  schedule();
 });
})();
