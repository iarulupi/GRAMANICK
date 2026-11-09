/* Lectura de una actividad publicada mediante su identificador. */
(function(){'use strict';
const URL='https://zykcprxibdniyymrvxyw.supabase.co';
const KEY='sb_publishable_yYqoOmHS1tgiM-XyIuHlbw_OE3GLG1y';
window.gnCargarInteractivaCorta=async function(token){
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token))throw Error('Enlace inválido');
 const client=window.supabase.createClient(URL,KEY);
 const {data,error}=await client.rpc('gn_abrir_interactiva',{p_token:token});
 if(error)throw error;if(!data)throw Error('Enlace no disponible');return data;
};
})();
