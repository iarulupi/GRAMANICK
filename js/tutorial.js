/* GramaNick: guía visual opcional. No invoca acciones del editor. */
(function(){
'use strict';
const pasos=
[
 {
  "titulo": "¡BIENVENIDA A GRAMANICK!",
  "texto": "Esta es una herramienta para planificar, armar actividades o crear material con apoyos visuales.",
  "selector": ".encabezado-gramanick"
 },
 {
  "titulo": "ESCRIBÍ TU TEXTO",
  "texto": "Acá podes escribir una oración o crear tu propio texto. Si, igual que lo harias en un word.",
  "selector": "#texto"
 },
 {
  "titulo": "AGREGAR RENGLÓN",
  "texto": "Tocando este botón podés agregar un renglón, que luego se visualizará como tal. Dentro del cuadro de texto vas a ver algo como \"[[RENGLON]]\". Después de tocar CREAR sucede la magia. \n¿Para que sirve? \nEjemplo de renglón: ____________________________________________",
  "selector": ".btn-insertar-renglon"
 },
 {
  "titulo": "CREAR MINI RENGLONES",
  "texto": "los \"_\" también funcionan como renglones, si escribis algo como: ayer yo comí _________ gramanick lo tomará como un renglón y podras usarlo para las actividades interactivas.",
  "selector": "#texto"
 },
 {
  "titulo": "AGREGAR IMAGEN",
  "texto": "Con este botón podés agregar una imagen propia a tu producción. Dentro del cuadro de texto vas a ver algo como \"[[FOTO_NUMERO]]\" y abajo del cuadro de texto vas a poder ver y eliminar la foto. Después de tocar el botón CREAR sucede la magia.",
  "selector": ".btn-agregar-foto"
 },
 {
  "titulo": "INSERTAR CUADRO DE IMAGEN",
  "texto": "Dentro del cuadro de texto, tocá INSERTAR CUADRO DE IMAGEN.\n\nElegí el tamaño que necesites: 3 × 3, 5 × 5 o 7 × 7 cm.\n\nEl cuadro aparecerá en tu material y podrás utilizarlo para crear actividades en las que el estudiante tenga que completar con fotografías. (Esto sirve para actividades impresas o interactivas)",
  "selector": "#btnInsertarCuadroImagen"
 },
 {
  "titulo": "CREÁ TU MATERIAL",
  "texto": "tocá \"CREAR\" cuando hayas terminado tu producción.",
  "selector": ".btn-crear-principal"
 },
 {
  "titulo": "SELECCIONÁ PALABRAS",
  "texto": "Activá SELECCIÓN para elegir una o varias palabras. Este botón sirve con otros botones como: agregar pictogramas, agregar o quitar simbolos y negrita.",
  "selector": "#btnSeleccionMultiple",
  "editor": true
 },
 {
  "titulo": "PERSONALIZÁ TU MATERIAL",
  "texto": "Seleccionando una o mas palabras podrás elegir si queres subrayar, utilizar negritas o cambiar la ubicacion del texto.",
  "selector": ".acciones-formato",
  "editor": true
 },
 {
  "titulo": "MODIFICAR EL INTERLETRADO",
  "texto": "Con esta herramienta podés aumentar o disminuir la separación entre las letras de las palabras.\n\nSeleccioná el texto que quieras modificar y ajustá el interletrado según las necesidades de tu material.",
  "selector": "#btnInterletrado",
  "editor": true
 },
 {
  "titulo": "PICTOGRAMAS",
  "texto": "Tocando este botón podes agregar un pictograma o subir una imagen propia que se cargará en formato pictograma.",
  "selector": "#btnAgregarPicto",
  "editor": true
 },
 {
  "titulo": "VER MÁS PICTOGRAMAS",
  "texto": "Cuando buscás un pictograma, GramaNick te muestra distintas opciones.\n\nSi querés explorar más resultados, tocá el botón +. Cada vez que lo hagas, aparecerán más pictogramas disponibles.",
  "selector": "#btnAgregarPicto",
  "editor": true
 },
 {
  "titulo": "SÍMBOLOS",
  "texto": "Para utilizar este boton debes haber seleccionado una o más palabras antes. Con estos botones podras agregar, cambiar o borrar los simbolos sobre las palabras.",
  "selector": ".acciones-seleccion > details.selector-simbolo-manual > summary",
  "editor": true
 },
 {
  "titulo": "INSERTAR SOBRE RENGLÓN VERDE",
  "texto": "Esta herramienta permite agregar una línea verde por encima del renglón negro.\n\nPodés activarla o desactivarla para cada renglón, según cómo quieras presentar la actividad.\n\nSi el \"sobre renglón verde\" te parece muy chico, podes seleccionar un reglon y cambiar color → verde",
  "selector": "#btnSobreRenglonVerde",
  "editor": true
 },
 {
  "titulo": "ELEGIR LA CATEGORÍA GRAMATICAL",
  "texto": "GramaNick reconoce automáticamente las categorías gramaticales de las palabras.\n\nSin embargo, algunas palabras pueden tener más de una categoría. En esos casos, aparece un selector en la parte superior izquierda de la palabra.\n\nTocá el selector para elegir la categoría que corresponda según la oración (VERBO-ADJETIVO-SUSTANTIVO-PREPOSICIÓN).\n\nEsta herramienta también funciona al preparar las RESPUESTAS CORRECTAS de una actividad interactiva.",
  "selector": ".selector-simbolo-manual",
  "editor": true,
  "ejemploCocina": true
 },
 {
  "titulo": "COPIÁ O DESCARGÁ",
  "texto": "Cuando termines de editar el material podes copiarlo y pegarlo en otra plataforma (word,docs, canva) o descargarlo directamente como imagen.",
  "selector": [
   ".acciones-exportar button:nth-child(1)",
   ".acciones-exportar button:nth-child(2)"
  ],
  "editor": true
 },
 {
  "titulo": "GENERAR ACTIVIDAD INTERACTIVA",
  "texto": "Este botón sirve para generar una actividad interactiva para que quienes trabajan con computadora puedan resolverla digitalmente.",
  "selector": ".ge-launch",
  "demo": "intro"
 },
 {
  "titulo": "SELECCIONAR RENGLONES",
  "texto": "Marcá los renglones que quieras seleccionar para generar las respuestas correctas de las actividades presentadas.",
  "selector": ".ge-teacher-line label",
  "demo": "panel"
 },
 {
  "titulo": "ESCRIBIR LA ORACIÓN CORRECTA",
  "texto": "Escribí la respuesta esperada para la pregunta o actividad propuesta.",
  "selector": ".ge-answer",
  "demo": "panel"
 },
 {
  "titulo": "AGREGAR APOYOS VISUALES",
  "texto": "Podés editar palabra por palabra la respuesta que van a poder armar tus estudiantes. Elegí color, pictograma y símbolo. También podés quitarlos.",
  "selector": [
   ".ge-picto-add",
   ".ge-token-tools select"
  ],
  "demo": "panel"
 },
 {
  "titulo": "COMPLETAR MINI RENGLONES CON FICHAS",
  "texto": "Los mini renglones pueden completarse utilizando fichas de un banco común (o escribiendo libre tocando el boton ON/OFF de la derecha.)\n\nEl estudiante selecciona el espacio que quiere completar y después elige una ficha del banco.\n\nLa ficha se coloca en el mini renglón seleccionado, conservando su formato, pictograma y símbolo gramatical.\n\nCada mini renglón tiene su propio ON/OFF: ON usa fichas y corrección automática; OFF permite escritura libre y corrección manual.",
  "selector": ".ge-mini-slot",
  "demo": "panel"
 },
 {
  "titulo": "PREPARAR RESPUESTAS CON FOTOGRAFÍAS",
  "texto": "En RESPUESTAS CORRECTAS, si previamente cargaste un cuadro de imagen, podras cargar las fotografías que utilizará el estudiante.  Asigná cada fotografía al cuadro correspondiente. También podés incorporar imágenes distractoras para que tenga que elegir entre distintas opciones.  Cada fotografía se puede utilizar una sola vez. Si el estudiante la quita de un cuadro, vuelve a estar disponible para colocarla nuevamente.",
  "selector": ".ge-image-assignments",
  "demo": "panel"
 },
 {
  "titulo": "RESPUESTA CORRECTA ON/OFF",
  "texto": "Cada espacio de respuesta tiene un botón ON/OFF.\n\nON: es la opción predeterminada. El estudiante completa la respuesta utilizando fichas que prepara la docente y GramaNick realiza la corrección automática.\n\nOFF: el estudiante puede escribir libremente su respuesta y la docente realiza la corrección manual.\n\nPodés combinar ambas modalidades en una misma actividad.",
  "selector": ".ge-mode-label",
  "demo": "panel"
 },
 {
  "titulo": "ESCRITURA LIBRE",
  "texto": "Cuando desactivás RESPUESTA CORRECTA, el estudiante puede escribir su propia respuesta en el espacio que dice ESCRIBÍ ACÁ.\n\nNo necesita elegir fichas ni reproducir una oración previamente establecida.\n\nComo no existe una respuesta única, GramaNick deja la corrección a cargo de la docente.",
  "selector": ".ge-mode-label",
  "demo": "panel"
 },
 {
  "titulo": "GENERAR EL ENLACE Y PROBAR COMO ESTUDIANTE",
  "texto": "La docente puede generar un enlace para compartir la actividad con sus estudiantes. También puede copiarlo o seleccionar PROBAR COMO ESTUDIANTE para comprobar cómo se verá y funcionará la actividad antes de compartirla.",
  "selector": [
   ".ge-generate",
   ".ge-copy",
   ".ge-view"
  ],
  "demo": "links"
 }
];;
let indice=0, estado=null, objetivos=[], raf=0, demo=null;
const $=s=>document.querySelector(s);
function limpiar(){ objetivos.forEach(el=>el.classList.remove('tutorial-destacado')); objetivos=[]; cancelAnimationFrame(raf); }
function cerrar(){if(!estado)return; limpiar();quitarCocina(); restaurarDemo(); $('#tutorialCapa').hidden=true; const espacio=$('#espacioTrabajo'), panel=$('#panelEdicion'), dist=$('#distribucionTrabajo'), btn=$('#btnPanelEdicion'); if(estado.espacioOculto)espacio.hidden=true; panel.hidden=estado.panelOculto;dist.classList.toggle('panel-cerrado',estado.panelCerrado);btn.setAttribute('aria-expanded',estado.expandido);btn.textContent=estado.textoBoton;estado=null;$('#btnTutorial').focus();}
function prepararDemo(){
 if(demo)return;
 const resultado=$('#resultado'), panelDemo=$('.ge-teacher-panel');
 if(!resultado||!panelDemo)return;
 const textoEditor=$('#texto');
 demo={resultado,original:[...resultado.childNodes],panelDemo,panelChildren:[...panelDemo.childNodes],panelHidden:panelDemo.hidden,textoEditor,textoOriginal:textoEditor?.value};
 // La pregunta se construye con el MOTOR REAL de GramaNick (pictos, símbolos y colores).
 // La marca de renglón es la misma que usa el editor, no un subrayado artificial.
 if(textoEditor&&typeof mostrarPictos==='function'){
  textoEditor.value='¿QUÉ HIZO EL NENE?\n[[RENGLON]]';
  mostrarPictos();
 }else{
  resultado.replaceChildren();
  const pregunta=document.createElement('div');pregunta.textContent='¿QUÉ HIZO EL NENE?';
  const renglon=document.createElement('div');renglon.className='renglon-escritura';
  resultado.append(pregunta,renglon);
 }
 const launch=$('.ge-launch');if(launch)launch.click();
 const input=$('.ge-teacher-panel .ge-answer');if(input){input.value='EL NENE LAVÓ LOS PLATOS';input.dispatchEvent(new Event('input',{bubbles:true}));}
}
function restaurarDemo(){
 if(!demo)return;
 demo.resultado.replaceChildren(...demo.original);
 demo.panelDemo.replaceChildren(...demo.panelChildren);
 demo.panelDemo.hidden=demo.panelHidden;
 if(demo.textoEditor)demo.textoEditor.value=demo.textoOriginal;
 demo=null;
}
async function prepararEnlace(){
 const btn=$('.ge-teacher-panel .ge-generate');if(!btn)return;
 btn.click();
 for(let n=0;n<15;n++){await new Promise(r=>setTimeout(r,80));if($('#ge-link')?.value)break;}
}
async function abrirVistaAlumno(){
 prepararDemo();
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
 if(y<bottom&&y+h>top&&x<right&&x+w>left){const alt=right+16;if(alt+w<innerWidth-p)x=alt;else if(left-w-16>p)x=left-w-16;}
 if(indice===24){
  // Evitar que el ejemplo de RESPUESTA CORRECTA tape el paso 26.
  const panelRespuesta=$('.ge-teacher-panel');
  if(panelRespuesta){
   const r=panelRespuesta.getBoundingClientRect();
   const candidatos=[{x:12,y:12},{x:innerWidth-w-12,y:12},{x:12,y:innerHeight-h-12},{x:innerWidth-w-12,y:innerHeight-h-12}];
   const areaSolape=c=>Math.max(0,Math.min(c.x+w,r.right)-Math.max(c.x,r.left))*Math.max(0,Math.min(c.y+h,r.bottom)-Math.max(c.y,r.top));
   candidatos.sort((a,b)=>areaSolape(a)-areaSolape(b));
   x=Math.max(12,candidatos[0].x);y=Math.max(12,candidatos[0].y);
  }
 }
 if(indice===24){x=Math.max(12,(innerWidth-w)/2);y=Math.max(12,Math.min(innerHeight-h-12,y));}
 tarjeta.style.left=x+'px';tarjeta.style.top=y+'px';
}
let cocinaDemo=null;
function quitarCocina(){
 if(!cocinaDemo)return;
 const {resultado,original,texto,valor}=cocinaDemo;
 resultado.replaceChildren(...original);
 texto.value=valor;
 cocinaDemo=null;
}
function ponerCocinaReal(){
 const resultado=$('#resultado'),texto=$('#texto');
 if(!resultado||!texto||typeof mostrarPictos!=='function')return null;
 const original=[...resultado.childNodes],valor=texto.value;
 cocinaDemo={resultado,original,texto,valor};
 try{
  texto.value='COCINA';
  mostrarPictos(); // Motor real de GramaNick: palabra, símbolo y selector auténticos.
  return resultado.querySelector('.palabra .selector-ambiguedad .boton-ambiguedad');
 }catch(error){console.error('Tutorial: no se pudo mostrar COCINA real',error);quitarCocina();return null;}
}
function mostrar(n){limpiar();quitarCocina();indice=Math.max(0,Math.min(pasos.length-1,n));const paso=pasos[indice],espacio=$('#espacioTrabajo'),panel=$('#panelEdicion'),dist=$('#distribucionTrabajo'),btn=$('#btnPanelEdicion');if(paso.demo==='panel'||paso.demo==='links'){prepararDemo();}
 if(paso.editor){espacio.hidden=false;panel.hidden=false;dist.classList.remove('panel-cerrado');btn.setAttribute('aria-expanded','true');btn.textContent='Ocultar herramientas de edición ▲';}
 else if(estado.espacioOculto && !paso.demo){espacio.hidden=true;}
 if(paso.demo==='links'&&$('#ge-links')?.hidden){prepararEnlace().then(()=>{if(estado&&indice===pasos.length-1){limpiar();objetivos=(Array.isArray(paso.selector)?paso.selector:[paso.selector]).map(sel=>$(sel)).filter(Boolean);objetivos.forEach(el=>el.classList.add('tutorial-destacado'));requestAnimationFrame(ubicar);}});}
 if(paso.demo==='panel'&&!$('.ge-teacher-line label')){const launch=$('.ge-launch');if(launch&&demo)launch.click();}
 const selectorCocina=paso.ejemploCocina?ponerCocinaReal():null;
 objetivos=(paso.ejemploCocina?[selectorCocina].filter(Boolean):(Array.isArray(paso.selector)?paso.selector:[paso.selector]).map(sel=>$(sel)).filter(Boolean));$('#tutorialContador').textContent='PASO '+(indice+1)+' DE 31';$('#tutorialTitulo').textContent=paso.titulo;$('#tutorialTexto').textContent=paso.texto;$('#tutorialAnterior').disabled=indice===0;$('#tutorialSiguiente').textContent=indice===pasos.length-1?'Continuar en ESTUDIANTES →':'Siguiente →';if(!objetivos.length){const tarjeta=$('#tutorialTarjeta');tarjeta.style.left='max(12px, calc(50% - 210px))';tarjeta.style.top='80px';return;}
 objetivos.forEach(el=>el.classList.add('tutorial-destacado'));objetivos[0].scrollIntoView({behavior:'instant',block:'center',inline:'nearest'});requestAnimationFrame(ubicar);
}
function abrir(){if(estado)return;const espacio=$('#espacioTrabajo'),panel=$('#panelEdicion'),dist=$('#distribucionTrabajo'),btn=$('#btnPanelEdicion');estado={espacioOculto:espacio.hidden,panelOculto:panel.hidden,panelCerrado:dist.classList.contains('panel-cerrado'),expandido:btn.getAttribute('aria-expanded'),textoBoton:btn.textContent};$('#tutorialCapa').hidden=false;mostrar(0);}

const titulosAlumno=['ESCRIBIR EL NOMBRE','ACTIVAR O DESACTIVAR DESLIZAR','REALIZAR LA ACTIVIDAD','TERMINAR ACTIVIDAD Y REVISAR','CORRECCIÓN DE RESPUESTAS','VOLVER A REVISAR'];
let menuTutorial=null;
function cerrarMenu(){if(menuTutorial){menuTutorial.remove();menuTutorial=null;}}
async function abrirIndiceAlumno(numero){
 // Abrir ventana en el gesto del usuario para evitar bloqueo de pop-ups.
 const ventana=window.open('about:blank','_blank');
 if(!ventana){alert('Permití las ventanas emergentes para abrir el paso seleccionado.');return;}
 cerrarMenu();
 try{
  prepararDemo();await prepararEnlace();const url=$('#ge-link')?.value;
  if(!url)throw Error('No se pudo generar el enlace de la actividad de ejemplo.');
  const parsed=new URL(url);parsed.searchParams.set('tutorial','1');parsed.searchParams.set('tutorialStep',String(numero));
  ventana.location.replace(parsed.href);
  if(estado)cerrar();
 }catch(error){ventana.close();alert(error.message||'No se pudo abrir el paso.');}
}
function abrirMenuTutorial(){
 if(menuTutorial)return;
 const fondo=document.createElement('div');fondo.className='gn-indice-fondo';
 const panel=document.createElement('section');panel.className='gn-indice-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Opciones del tutorial');
 const titulo=document.createElement('h2');titulo.textContent='TUTORIAL DE GRAMANICK';
 const opciones=document.createElement('div');opciones.className='gn-indice-opciones';
 const comenzar=document.createElement('button');comenzar.type='button';comenzar.textContent='COMENZAR TUTORIAL';
 const indice=document.createElement('button');indice.type='button';indice.textContent='VER ÍNDICE';
 const cerrarBtn=document.createElement('button');cerrarBtn.type='button';cerrarBtn.className='gn-indice-cerrar';cerrarBtn.textContent='CERRAR';
 const lista=document.createElement('div');lista.className='gn-indice-lista';lista.hidden=true;
 [...pasos.map(p=>p.titulo),...titulosAlumno].forEach((nombre,i)=>{
  const item=document.createElement('button');item.type='button';item.className='gn-indice-item';item.textContent=(i+1)+'. '+nombre;
  item.addEventListener('click',()=>{if(i<pasos.length){cerrarMenu();abrir();mostrar(i);}else{abrirIndiceAlumno(i+1);}});lista.append(item);
 });
 comenzar.onclick=()=>{cerrarMenu();abrir();};
 indice.onclick=()=>{lista.hidden=false;opciones.hidden=true;lista.scrollTop=0;};
 cerrarBtn.onclick=cerrarMenu;
 fondo.addEventListener('click',e=>{if(e.target===fondo)cerrarMenu();});
 opciones.append(comenzar,indice);panel.append(titulo,opciones,lista,cerrarBtn);fondo.append(panel);document.body.append(fondo);menuTutorial=fondo;
}
function iniciar(){const boton=$('#btnTutorial');if(!boton)return;boton.addEventListener('click',abrirMenuTutorial);$('#tutorialCerrar').addEventListener('click',cerrar);$('#tutorialSalir').addEventListener('click',cerrar);$('#tutorialAnterior').addEventListener('click',()=>mostrar(indice-1));$('#tutorialSiguiente').addEventListener('click',()=>indice===pasos.length-1?abrirVistaAlumno():mostrar(indice+1));window.addEventListener('keydown',e=>{if(e.key==='Escape'&&estado)cerrar();});window.addEventListener('resize',()=>{if(estado)ubicar()});window.addEventListener('scroll',()=>{if(estado)ubicar()},true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
