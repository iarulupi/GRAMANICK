// ============================================================
// GRAMANICK + ARASAAC — PUENTE EXPERIMENTAL V5
// Etapa 1: solo completa pictogramas faltantes.
// Los pictogramas locales de GramaNick SIEMPRE tienen prioridad.
// ============================================================

const GRAMANICK_ARASAAC_API = "https://api.arasaac.org/v1/pictograms/es/search/";
const GRAMANICK_ARASAAC_STATIC = "https://static.arasaac.org/pictograms";
const cacheArasaac = new Map();
const GRAMANICK_ARASAAC_FAVORITOS_KEY = "gramanick_arasaac_favoritos_v1";

function leerFavoritosArasaac() {
    try { return JSON.parse(localStorage.getItem(GRAMANICK_ARASAAC_FAVORITOS_KEY) || "{}"); }
    catch (_) { return {}; }
}

function favoritoArasaac(concepto) {
    return leerFavoritosArasaac()[normalizarBusquedaArasaac(concepto)] || null;
}

function guardarFavoritoArasaac(concepto, url) {
    const clave = normalizarBusquedaArasaac(concepto);
    if (!clave) return;
    const favoritos = leerFavoritosArasaac();
    if (url) favoritos[clave] = url;
    else delete favoritos[clave];
    localStorage.setItem(GRAMANICK_ARASAAC_FAVORITOS_KEY, JSON.stringify(favoritos));
}


function normalizarBusquedaArasaac(texto) {
    return String(texto || "")
        .trim()
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function urlPictoArasaac(id) {
    return `${GRAMANICK_ARASAAC_STATIC}/${id}/${id}_500.png`;
}

async function buscarPictogramasArasaac(concepto, limite = 1) {
    const termino = normalizarBusquedaArasaac(concepto);
    if (!termino) return [];

    const clave = `${termino}|${limite}`;
    if (cacheArasaac.has(clave)) return cacheArasaac.get(clave);

    try {
        const respuesta = await fetch(
            GRAMANICK_ARASAAC_API + encodeURIComponent(termino),
            { headers: { "Accept": "application/json" } }
        );

        if (!respuesta.ok) throw new Error(`ARASAAC HTTP ${respuesta.status}`);

        const datos = await respuesta.json();
        const resultados = Array.isArray(datos) ? datos : [];

        const urls = resultados
            .map(item => item && item._id)
            .filter(Boolean)
            .slice(0, limite)
            .map(urlPictoArasaac);

        cacheArasaac.set(clave, urls);
        return urls;
    } catch (error) {
        console.warn("GramaNick: no se pudo consultar ARASAAC para", termino, error);
        cacheArasaac.set(clave, []);
        return [];
    }
}

async function buscarPrimerPictoArasaacEntre(conceptos, limite = 12) {
    const lista = Array.isArray(conceptos) ? conceptos : [conceptos];
    for (const concepto of lista) {
        // V5.5: conservamos el orden de ARASAAC. El primer resultado sigue
        // apareciendo automáticamente, pero traemos alternativas para que
        // el usuario pueda elegir otra solo en esta aparición.
        const opciones = await buscarPictogramasArasaac(concepto, limite);
        if (opciones.length) return opciones;
    }
    return [];
}

function crearPictoArasaacExperimental(concepto) {
    const hueco = document.createElement("div");
    hueco.className = "picto-arasaac-experimental";
    const conceptos = Array.isArray(concepto) ? concepto : [concepto];
    hueco.dataset.conceptoArasaac = conceptos.join("|");

    buscarPrimerPictoArasaacEntre(conceptos, 12).then(opciones => {
        // El usuario pudo volver a renderizar mientras llegaba la respuesta.
        if (!hueco.isConnected || !opciones.length) return;

        // V5.6: un favorito es solo una preferencia. Si sigue estando entre
        // los resultados de ARASAAC, se muestra primero sin ocultar los demás.
        const conceptoResuelto = conceptos.find(c => opciones.length) || conceptos[0];
        const fav = favoritoArasaac(conceptoResuelto);
        if (fav && opciones.includes(fav)) {
            opciones = [fav, ...opciones.filter(url => url !== fav)];
        }

        hueco.replaceWith(crearPictoSeleccionable(opciones, conceptoResuelto));
    });

    return hueco;
}
