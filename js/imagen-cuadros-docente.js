// V1.1 experimental: insertar marcador en el editor, sin alterar V1.
function insertarCuadroImagen(){
 const input=document.getElementById('texto');if(!input)return;
 const size=prompt('Tamaño del cuadro de imagen (3, 5 o 7 cm):','5');
 if(size===null)return;
 if(!['3','5','7'].includes(size.trim())){alert('Elegí 3, 5 o 7 cm.');return;}
 const mark='[[IMAGEN_'+size.trim()+']]';
 const start=input.selectionStart,end=input.selectionEnd;
 const before=input.value.slice(0,start),after=input.value.slice(end);
 const left=before&&!/\s$/.test(before)?' ':'';
 const right=after&&!/^\s/.test(after)?' ':'';
 input.value=before+left+mark+right+after;
 input.focus();input.setSelectionRange(start+left.length+mark.length,start+left.length+mark.length);
 input.dispatchEvent(new Event('input',{bubbles:true}));
}
