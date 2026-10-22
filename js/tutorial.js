/* GramaNick: guía visual opcional. No invoca acciones del editor. */
(function(){
'use strict';
const pasos=[
 {"titulo": "¡Bienvenida a GramaNick!", "texto": "Esta es una herramienta para planificar, armar actividades o crear material con apoyos visuales.", "selector": ".encabezado-gramanick"},
 {"titulo": "Escribí tu texto", "texto": "Acá podes escribir una oración o crear tu propio texto. Si, igual que lo harias en un word.", "selector": "#texto"},
 {"titulo": "Agregar renglón", "texto": "Tocando este botón podés agregar un renglón, que luego se visualizará como tal. Dentro del cuadro de texto vas a ver algo como \"[[RENGLON]]\". Después de tocar CREAR sucede la magia. \n¿Para que sirve? \nEjemplo de renglón: ____________________________________________", "selector": ".btn-insertar-renglon"},
 {"titulo": "Agregar imagen", "texto": "Con este botón podés agregar una imagen propia a tu producción. Dentro del cuadro de texto vas a ver algo como \"[[FOTO_NUMERO]]\" y abajo del cuadro de texto vas a poder ver y eliminar la foto. Después de tocar el botón CREAR sucede la magia.", "selector": ".btn-agregar-foto"},
 {"titulo": "Creá tu material", "texto": "tocá \"CREAR\" cuando hayas terminado tu producción.", "selector": ".btn-crear-principal"},
 {"titulo": "Seleccioná palabras", "texto": "Activá SELECCIÓN para elegir una o varias palabras. Este botón sirve con otros botones como: agregar pictogramas, agregar o quitar simbolos y negrita.", "selector": "#btnSeleccionMultiple", "editor": true},
 {"titulo": "Personalizá tu material", "texto": "Seleccionando una o mas palabras podrás elegir si queres subrayar, utilizar negritas o cambiar la ubicacion del texto.", "selector": ".acciones-formato", "editor": true},
 {"titulo": "Pictogramas", "texto": "Tocando este botón podes agregar un pictograma o subir una imagen propia que se cargará en formato pictograma.", "selector": "#btnAgregarPicto", "editor": true},
 {"titulo": "Símbolos y colores", "texto": "Para utilizar estos botones debes haber seleccionado una o más palabras antes. Con estos botones podras cambiar el color, agregar, cambiar o borrar los simbolos sobre las palabras.", "selector": [".selector-color-texto", ".selector-simbolo-manual"], "editor": true},
 {"titulo": "Copiá o descargá", "texto": "Cuando termines de editar el material podes copiarlo y pegarlo en otra plataforma (word,docs, canva) o descargarlo directamente como imagen.", "selector": [".acciones-exportar button:nth-child(1)", ".acciones-exportar button:nth-child(2)"], "editor": true}
,{"titulo":"GENERAR ACTIVIDAD INTERACTIVA","texto":"Este botón sirve para generar una actividad interactiva para que quienes trabajan con computadora puedan resolverla digitalmente.","selector":".ge-launch","demo":"intro"}
,{"titulo":"SELECCIONAR RENGLONES","texto":"Marcá los renglones que quieras seleccionar para generar las respuestas correctas de las actividades presentadas.","selector":".ge-teacher-line label","demo":"panel"}
,{"titulo":"ESCRIBIR LA ORACIÓN CORRECTA","texto":"Escribí la respuesta esperada para la pregunta o actividad propuesta.","selector":".ge-answer","demo":"panel"}
,{"titulo":"AGREGAR APOYOS VISUALES","texto":"Podés editar palabra por palabra la respuesta que van a poder armar tus estudiantes. Elegí color, pictograma y símbolo. También podés quitarlos.","selector":[".ge-picto-add",".ge-token-tools select"],"demo":"panel"}
,{"titulo":"GENERAR EL ENLACE","texto":"Cuando termines de armar la actividad, tocá GENERAR ENLACE DE LA ACTIVIDAD INTERACTIVA. Este botón generará un enlace que podrás guardar hasta el momento en que necesites utilizarlo.","selector":".ge-generate","demo":"panel"}
,{"titulo":"COPIAR Y PROBAR","texto":"Tocá COPIAR ENLACE para compartir o guardar la actividad. También podés usar PROBAR COMO ESTUDIANTE para ver la actividad que harán tus estudiantes.","selector":[".ge-copy",".ge-view"],"demo":"links"}

];
let indice=0, estado=null, objetivos=[], raf=0, demo=null;
const $=s=>document.querySelector(s);
function limpiar(){ objetivos.forEach(el=>el.classList.remove('tutorial-destacado')); objetivos=[]; cancelAnimationFrame(raf); }
function cerrar(){if(!estado)return; limpiar(); restaurarDemo(); $('#tutorialCapa').hidden=true; const espacio=$('#espacioTrabajo'), panel=$('#panelEdicion'), dist=$('#distribucionTrabajo'), btn=$('#btnPanelEdicion'); if(estado.espacioOculto)espacio.hidden=true; panel.hidden=estado.panelOculto;dist.classList.toggle('panel-cerrado',estado.panelCerrado);btn.setAttribute('aria-expanded',estado.expandido);btn.textContent=estado.textoBoton;estado=null;$('#btnTutorial').focus();}
function prepararDemo(){
 if(demo)return;
 const resultado=$('#resultado'), panelDemo=$('.ge-teacher-panel');
 if(!resultado||!panelDemo)return;
 demo={resultado,original:[...resultado.childNodes],panelDemo,panelChildren:[...panelDemo.childNodes],panelHidden:panelDemo.hidden};
 resultado.replaceChildren();
 const pregunta=document.createElement('div');pregunta.textContent='¿QUÉ HIZO EL NENE?';
 const renglonContenedor=document.createElement('div');renglonContenedor.className='fila-renglon';
 const renglon=document.createElement('span');renglon.className='renglon-escritura';renglon.textContent='________________________________';
 renglonContenedor.append(renglon);resultado.append(pregunta,renglonContenedor);
 const launch=$('.ge-launch');if(launch)launch.click();
 const input=$('.ge-teacher-panel .ge-answer');if(input){input.value='EL NENE LAVÓ LOS PLATOS';input.dispatchEvent(new Event('input',{bubbles:true}));}
}
function restaurarDemo(){
 if(!demo)return;
 demo.resultado.replaceChildren(...demo.original);
 demo.panelDemo.replaceChildren(...demo.panelChildren);
 demo.panelDemo.hidden=demo.panelHidden;
 demo=null;
}
async function prepararEnlace(){
 const btn=$('.ge-teacher-panel .ge-generate');if(!btn)return;
 btn.click();
 for(let n=0;n<15;n++){await new Promise(r=>setTimeout(r,80));if($('#ge-link')?.value)break;}
}
async function abrirVistaAlumno(){
 await prepararEnlace();const url=$('#ge-link')?.value;
 if(!url){alert('No se pudo preparar la actividad de ejemplo.');return;}
 const parsed=new URL(url);parsed.searchParams.set('tutorial','1');
 const ventana=window.open(parsed.href,'_blank');
 if(!ventana){alert('Permití las ventanas emergentes para continuar la demostración.');return;}
 cerrar();
}
function ubicar(){
 if(!estado||!objetivos.length)return;
 const rects=objetivos.map(el=>el.getBoundingClientRect());
 const left=Math.min(...rects.map(r=>r.left)),right=Math.max(...rects.map(r=>r.right));
 const top=Math.min(...rects.map(r=>r.top)),bottom=Math.max(...rects.map(r=>r.bottom));
 const tarjeta=$('#tutorialTarjeta'),w=tarjeta.offsetWidth,h=tarjeta.offsetHeight,p=12;
 let x=Math.max(p,Math.min(innerWidth-w-p,(left+right)/2-w/2));
 let y=bottom+14;if(y+h>innerHeight-p)y=top-h-14;
 if(y<p)y=Math.max(p,innerHeight-h-p);
 tarjeta.style.left=x+'px';tarjeta.style.top=y+'px';
}
function mostrar(n){limpiar();indice=Math.max(0,Math.min(pasos.length-1,n));const paso=pasos[indice],espacio=$('#espacioTrabajo'),panel=$('#panelEdicion'),dist=$('#distribucionTrabajo'),btn=$('#btnPanelEdicion');if(paso.demo==='panel'||paso.demo==='links'){prepararDemo();}
 if(paso.editor){espacio.hidden=false;panel.hidden=false;dist.classList.remove('panel-cerrado');btn.setAttribute('aria-expanded','true');btn.textContent='Ocultar herramientas de edición ▲';}
 else if(estado.espacioOculto && !paso.demo){espacio.hidden=true;}
 if(paso.demo==='links'&&!$('#ge-links:not([hidden])')){prepararEnlace().then(()=>{if(estado&&indice===pasos.length-1)mostrar(indice);});}
 if(paso.demo==='panel'&&!$('.ge-teacher-line label')){const launch=$('.ge-launch');if(launch&&demo)launch.click();}
 objetivos=(Array.isArray(paso.selector)?paso.selector:[paso.selector]).map(sel=>$(sel)).filter(Boolean);$('#tutorialContador').textContent='PASO '+(indice+1)+' DE '+pasos.length;$('#tutorialTitulo').textContent=paso.titulo;$('#tutorialTexto').textContent=paso.texto;$('#tutorialAnterior').disabled=indice===0;$('#tutorialSiguiente').textContent=indice===pasos.length-1?'Ir a la vista del estudiante →':'Siguiente →';if(!objetivos.length){const tarjeta=$('#tutorialTarjeta');tarjeta.style.left='max(12px, calc(50% - 210px))';tarjeta.style.top='80px';return;}
 objetivos.forEach(el=>el.classList.add('tutorial-destacado'));objetivos[0].scrollIntoView({behavior:'instant',block:'center',inline:'nearest'});requestAnimationFrame(ubicar);
}
function abrir(){if(estado)return;const espacio=$('#espacioTrabajo'),panel=$('#panelEdicion'),dist=$('#distribucionTrabajo'),btn=$('#btnPanelEdicion');estado={espacioOculto:espacio.hidden,panelOculto:panel.hidden,panelCerrado:dist.classList.contains('panel-cerrado'),expandido:btn.getAttribute('aria-expanded'),textoBoton:btn.textContent};$('#tutorialCapa').hidden=false;mostrar(0);}
function iniciar(){const boton=$('#btnTutorial');if(!boton)return;boton.addEventListener('click',abrir);$('#tutorialCerrar').addEventListener('click',cerrar);$('#tutorialSalir').addEventListener('click',cerrar);$('#tutorialAnterior').addEventListener('click',()=>mostrar(indice-1));$('#tutorialSiguiente').addEventListener('click',()=>indice===pasos.length-1?abrirVistaAlumno():mostrar(indice+1));window.addEventListener('keydown',e=>{if(e.key==='Escape'&&estado)cerrar();});window.addEventListener('resize',()=>{if(estado)ubicar()});window.addEventListener('scroll',()=>{if(estado)ubicar()},true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
