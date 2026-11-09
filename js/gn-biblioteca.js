/* Biblioteca experimental: guardado del texto fuente, no del editor visual completo. */
(function(){'use strict';
const $=id=>document.getElementById(id), db=()=>window.gnSupabase, uid=()=>window.gnUsuarioActual?.id;
let vista=null, editId=null, sub='actividades', abierta=false;
const txt=$('texto'), guardar=$('gnGuardarActividad'), pantalla=$('gnPantallaBiblioteca'), modal=$('gnModalGuardar');
function estado(t){$('gnBiblioEstado').textContent=t;}
function enable(){guardar.hidden=!uid(); if(!uid()){editId=null; pantalla.hidden=true; modal.hidden=true;}}
window.addEventListener('gn-auth-cambio',enable);enable();
guardar.addEventListener('click',()=>{if(!uid())return; if(!txt.value.trim()){alert('Primero escribí la actividad.');return;} $('gnTituloGuardar').textContent=editId?'GUARDAR CAMBIOS':'GUARDAR EN BIBLIOTECA';$('gnTituloActividad').value=$('gnTituloActividad').value||txt.value.trim().slice(0,65);$('gnGuardarEstado').textContent='';modal.hidden=false;});
$('gnCerrarGuardar').onclick=()=>modal.hidden=true;
modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true;});
$('gnFormGuardar').addEventListener('submit',async e=>{e.preventDefault();const title=$('gnTituloActividad').value.trim();if(!title)return;const data={titulo:title,contenido:{tipo:'texto_fuente_v1',texto:txt.value},actualizada_en:new Date().toISOString()};const button=e.target.querySelector('button[type=submit]');button.disabled=true;$('gnGuardarEstado').textContent='Guardando…';try{let res;if(editId){res=await db().from('actividades').update(data).eq('id',editId).eq('docente_id',uid()).select('id').single();}else{res=await db().from('actividades').insert({...data,docente_id:uid(),compartida:false}).select('id').single();}if(res.error)throw res.error;editId=res.data.id;modal.hidden=true;alert('¡Actividad guardada en MI BIBLIOTECA!');}catch(err){$('gnGuardarEstado').textContent='No se pudo guardar: '+err.message;}finally{button.disabled=false;}});
$('gnCerrarBiblioteca').onclick=()=>pantalla.hidden=true;
// Navegación jerárquica: las secciones personales aparecen solo al abrir MI BIBLIOTECA.
function navegar(){
 const personal=abierta&&vista==='mias', general=abierta&&vista==='general';
 $('gnBiblioSubtabs').hidden=!personal;
 $('gnBiblioSubtabs').style.display=personal?'flex':'none';
 $('gnBiblioListado').hidden=!abierta;
 $('gnBiblioListado').style.display=abierta?'grid':'none';
 $('gnBiblioEstado').hidden=!abierta;
 $('gnBiblioEstado').style.display=abierta?'':'none';
 $('gnTabMias').classList.toggle('gn-activa',personal);
 $('gnTabGeneral').classList.toggle('gn-activa',general);
 $('gnTabMias').setAttribute('aria-expanded',String(personal));
 $('gnTabGeneral').setAttribute('aria-expanded',String(general));
 if(abierta)listar();else{$('gnBiblioListado').replaceChildren();estado('');}
}
$('gnTabMias').onclick=()=>{if(vista==='mias'&&abierta){abierta=false;}else{vista='mias';abierta=true;sub='actividades';}navegar();};
$('gnTabGeneral').onclick=()=>{if(vista==='general'&&abierta){abierta=false;}else{vista='general';abierta=true;}navegar();};
window.addEventListener('gn-biblioteca-abrir',()=>{vista=null;abierta=false;sub='actividades';navegar();});
$('gnSubActividades').onclick=()=>{sub='actividades';listar();};
$('gnSubEnlaces').onclick=()=>{sub='enlaces';listar();};
navegar();
function boton(label,action){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=action;return b;}
async function listar(){if(!uid())return;const subtabs=$('gnBiblioSubtabs');subtabs.hidden=!(abierta&&vista==='mias');subtabs.style.display=(abierta&&vista==='mias')?'flex':'none';$('gnSubActividades').classList.toggle('gn-activa',sub==='actividades');$('gnSubEnlaces').classList.toggle('gn-activa',sub==='enlaces');if(vista==='mias'&&sub==='enlaces'){ $('gnTabMias').classList.add('gn-activa');$('gnTabGeneral').classList.remove('gn-activa');window.dispatchEvent(new Event('gn-listar-enlaces'));return;}$('gnTabMias').classList.toggle('gn-activa',vista==='mias');$('gnTabGeneral').classList.toggle('gn-activa',vista==='general');estado('Cargando actividades…');const list=$('gnBiblioListado');list.replaceChildren();let q=db().from('actividades').select('id,docente_id,titulo,contenido,compartida,creada_en').order('creada_en',{ascending:false});q=vista==='mias'?q.eq('docente_id',uid()):q.eq('compartida',true);const {data,error}=await q;if(error){estado('Error al cargar: '+error.message);return;}estado(data.length?`${data.length} actividad(es)`:'Todavía no hay actividades en esta sección.');for(const a of data){const card=document.createElement('article');card.className='gn-biblio-tarjeta';const h=document.createElement('h3');h.textContent=a.titulo;const p=document.createElement('p');p.textContent=a.contenido?.tipo==='texto_fuente_v1'?'Actividad editable: texto fuente':'Formato no compatible con esta prueba';const actions=document.createElement('div');actions.className='gn-biblio-acciones';if(a.contenido?.tipo==='texto_fuente_v1')actions.append(boton('ABRIR EN EDITOR',()=>{if(txt.value.trim()&&!confirm('¿Reemplazar el texto que tenés en el editor?'))return;txt.value=a.contenido.texto||'';editId=a.docente_id===uid()?a.id:null;$('gnTituloActividad').value=a.titulo;pantalla.hidden=true;const crear=document.querySelector('.btn-crear-principal');if(crear)crear.click();}));if(a.docente_id===uid()){actions.append(boton(a.compartida?'QUITAR DE GENERAL':'COMPARTIR EN GENERAL',async()=>{const {error}=await db().from('actividades').update({compartida:!a.compartida}).eq('id',a.id).eq('docente_id',uid());if(error)alert(error.message);else listar();}));actions.append(boton('ELIMINAR',async()=>{if(!confirm('¿Eliminar esta actividad de tu biblioteca?'))return;const {error}=await db().from('actividades').delete().eq('id',a.id).eq('docente_id',uid());if(error)alert(error.message);else{if(editId===a.id)editId=null;listar();}}));}card.append(h,p,actions);list.append(card);}}
})();