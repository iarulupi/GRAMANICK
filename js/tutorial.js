/* GramaNick: guía visual opcional. No invoca acciones del editor. */
(function(){
'use strict';
const pasos=[
 {"titulo": "¡Bienvenida a GramaNick!", "texto": "Esta es una herramienta para planificar, armar actividades o crear material con apoyos visuales.", "selector": ".encabezado-gramanick"},
 {"titulo": "Escribí tu texto", "texto": "Acá podes escribir una oración o crear tu propio texto. Si, igual que lo harias en un word.", "selector": "#texto"},
 {"titulo": "Agregar renglón", "texto": "Tocando este botón podés agregar un renglón, que luego se visualizará como tal. Dentro del cuadro de texto vas a ver algo como \"[[RENGLON]]\". Después de tocar CREAR sucede la magia. \n¿Para que sirve? \n[[RENGLON]] = ____________________________________________", "selector": ".btn-insertar-renglon"},
 {"titulo": "Agregar imagen", "texto": "Con este botón podés agregar una imagen propia a tu producción. Dentro del cuadro de texto vas a ver algo como \"[[FOTO_NUMERO]]\" y abajo del cuadro de texto vas a poder ver y eliminar la foto. Después de tocar el botón CREAR sucede la magia.", "selector": ".btn-agregar-foto"},
 {"titulo": "Creá tu material", "texto": "tocá \"CREAR\" cuando hayas terminado tu producción.", "selector": ".btn-crear-principal"},
 {"titulo": "Seleccioná palabras", "texto": "Activá SELECCIÓN para elegir una o varias palabras. Este botón sirve con otros botones como: agregar pictogramas, agregar o quitar simbolos y negrita.", "selector": "#btnSeleccionMultiple", "editor": true},
 {"titulo": "Personalizá tu material", "texto": "Seleccionando una o mas palabras podrás elegir si queres subrayar, utilizar negritas o cambiar la ubicacion del texto.", "selector": ".acciones-formato", "editor": true},
 {"titulo": "Pictogramas", "texto": "Tocando este botón podes agregar un pictograma o subir una imagen propia que se cargará en formato pictograma.", "selector": "#btnAgregarPicto", "editor": true},
 {"titulo": "Símbolos y colores", "texto": "Para utilizar estos botones debes haber seleccionado una o más palabras antes. Con estos botones podras cambiar el color, agregar, cambiar o borrar los simbolos sobre las palabras.", "selector": ".selector-simbolo-manual", "editor": true},
 {"titulo": "Copiá o descargá", "texto": "Cuando termines de editar el material podes copiarlo y pegarlo en otra plataforma (word,docs, canva) o descargarlo directamente como imagen.", "selector": ".acciones-exportar", "editor": true}
];
let indice=0, estado=null, objetivo=null, raf=0;
const $=s=>document.querySelector(s);
function limpiar(){ if(objetivo) objetivo.classList.remove('tutorial-destacado'); objetivo=null; cancelAnimationFrame(raf); }
function cerrar(){if(!estado)return; limpiar(); $('#tutorialCapa').hidden=true; const espacio=$('#espacioTrabajo'), panel=$('#panelEdicion'), dist=$('#distribucionTrabajo'), btn=$('#btnPanelEdicion'); if(estado.espacioOculto)espacio.hidden=true; panel.hidden=estado.panelOculto;dist.classList.toggle('panel-cerrado',estado.panelCerrado);btn.setAttribute('aria-expanded',estado.expandido);btn.textContent=estado.textoBoton;estado=null;$('#btnTutorial').focus();}
function ubicar(){if(!estado||!objetivo)return; const r=objetivo.getBoundingClientRect(), tarjeta=$('#tutorialTarjeta'), w=tarjeta.offsetWidth,h=tarjeta.offsetHeight,p=12; let x=Math.max(p,Math.min(innerWidth-w-p,r.left+r.width/2-w/2));let y=r.bottom+14;if(y+h>innerHeight-p)y=r.top-h-14;if(y<p)y=Math.max(p,innerHeight-h-p);tarjeta.style.left=x+'px';tarjeta.style.top=y+'px';}
function mostrar(n){limpiar();indice=Math.max(0,Math.min(pasos.length-1,n));const paso=pasos[indice],espacio=$('#espacioTrabajo'),panel=$('#panelEdicion'),dist=$('#distribucionTrabajo'),btn=$('#btnPanelEdicion');if(paso.editor){espacio.hidden=false;panel.hidden=false;dist.classList.remove('panel-cerrado');btn.setAttribute('aria-expanded','true');btn.textContent='Ocultar herramientas de edición ▲';}
 else if(estado.espacioOculto){espacio.hidden=true;}
 objetivo=$(paso.selector);$('#tutorialContador').textContent='PASO '+(indice+1)+' DE '+pasos.length;$('#tutorialTitulo').textContent=paso.titulo;$('#tutorialTexto').textContent=paso.texto;$('#tutorialAnterior').disabled=indice===0;$('#tutorialSiguiente').textContent=indice===pasos.length-1?'Finalizar':'Siguiente →';if(!objetivo)return;
 objetivo.classList.add('tutorial-destacado');objetivo.scrollIntoView({behavior:'instant',block:'center',inline:'nearest'});requestAnimationFrame(ubicar);
}
function abrir(){if(estado)return;const espacio=$('#espacioTrabajo'),panel=$('#panelEdicion'),dist=$('#distribucionTrabajo'),btn=$('#btnPanelEdicion');estado={espacioOculto:espacio.hidden,panelOculto:panel.hidden,panelCerrado:dist.classList.contains('panel-cerrado'),expandido:btn.getAttribute('aria-expanded'),textoBoton:btn.textContent};$('#tutorialCapa').hidden=false;mostrar(0);}
function iniciar(){const boton=$('#btnTutorial');if(!boton)return;boton.addEventListener('click',abrir);$('#tutorialCerrar').addEventListener('click',cerrar);$('#tutorialSalir').addEventListener('click',cerrar);$('#tutorialAnterior').addEventListener('click',()=>mostrar(indice-1));$('#tutorialSiguiente').addEventListener('click',()=>indice===pasos.length-1?cerrar():mostrar(indice+1));window.addEventListener('keydown',e=>{if(e.key==='Escape'&&estado)cerrar();});window.addEventListener('resize',()=>{if(estado)ubicar()});window.addEventListener('scroll',()=>{if(estado)ubicar()},true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
