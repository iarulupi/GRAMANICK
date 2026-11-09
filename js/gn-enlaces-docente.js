/* GramaNick 3.0 experimental: enlaces interactivos persistentes. */
(function(){'use strict';
const $=id=>document.getElementById(id);
const db=()=>window.gnSupabase,uid=()=>window.gnUsuarioActual?.id;
const urlFor=token=>new URL('estudiantes.html?i='+encodeURIComponent(token),location.href).href;
window.gnGuardarEnlaceInteractivo=async function(output){
 if(!uid()){alert('Iniciá sesión para guardar el enlace.');return;}
 const payload=window.gnUltimaInteractiva;
 if(!payload){alert('Primero generá la actividad interactiva.');return;}
 const titulo=prompt('Título para MIS ENLACES:');if(titulo===null)return;if(!titulo.trim()){alert('Escribí un título.');return;}
 try{
  const {data,error}=await db().from('actividades_interactivas').insert({docente_id:uid(),titulo:titulo.trim(),contenido:payload,publicada:true}).select('token_enlace').single();
  if(error)throw error;
  output.value=urlFor(data.token_enlace);
  const size=$('ge-link-size');if(size)size.textContent='✓ Enlace corto guardado en MIS ENLACES.';
  alert('¡Enlace corto guardado en MI BIBLIOTECA → MIS ENLACES!');
 }catch(e){alert('No se pudo guardar el enlace: '+e.message+'\nSi contiene fotos muy grandes, puede superar el límite de almacenamiento por solicitud.');}
};
function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;return b;}
window.addEventListener('gn-listar-enlaces',async()=>{
 const list=$('gnBiblioListado'),estado=$('gnBiblioEstado');list.replaceChildren();estado.textContent='Cargando enlaces…';
 const {data,error}=await db().from('actividades_interactivas').select('id,titulo,token_enlace,creada_en').eq('docente_id',uid()).order('creada_en',{ascending:false});
 if(error){estado.textContent='Error: '+error.message;return;}
 estado.textContent=data.length?data.length+' enlace(s) guardado(s)':'Todavía no guardaste enlaces interactivos.';
 for(const a of data){const card=document.createElement('article');card.className='gn-biblio-tarjeta';const h=document.createElement('h3');h.textContent=a.titulo;const actions=document.createElement('div');actions.className='gn-biblio-acciones';const url=urlFor(a.token_enlace);
 actions.append(button('COPIAR ENLACE',async()=>{try{await navigator.clipboard.writeText(url);alert('¡Enlace copiado!');}catch(e){prompt('Copiá este enlace:',url);}}),button('PROBAR COMO ESTUDIANTE',()=>window.open(url,'_blank','noopener')),button('ELIMINAR',async()=>{if(!confirm('¿Eliminar este enlace? Los estudiantes ya no podrán abrirlo.'))return;const {error}=await db().from('actividades_interactivas').delete().eq('id',a.id).eq('docente_id',uid());if(error)alert(error.message);else window.dispatchEvent(new Event('gn-listar-enlaces'));}));card.append(h,actions);list.append(card);}
});
})();
