// ==================== NORMALIZACIÓN ====================

function quitarTildes(texto) {
    return (texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function limpiarBordes(texto) {
    return (texto || "")
        .replace(/^[¿¡!?.;,:"()']+|[¿¡!?.;,:"()']+$/g, "")
        .trim();
}

// Exacto: conserva tildes
function normalizarTextoExacto(texto) {
    return limpiarBordes((texto || "").toLowerCase())
        .replace(/\s+/g, " ");
}

// Solo para buscar claves del aliasNormalizacion
function normalizarTextoAlias(texto) {
    return quitarTildes(
        limpiarBordes((texto || "").toLowerCase())
    ).replace(/\s+/g, " ");
}

function aplicarAlias(texto) {
    const t = normalizarTextoAlias(texto);
    return aliasNormalizacion[t] || null;
}

function normalizarDiccionarioExacto(diccionario) {
    const salida = {};

    for (const clave in diccionario) {
        salida[normalizarTextoExacto(clave)] = diccionario[clave];
    }

    return salida;
}

function normalizarListaExacta(lista) {
    return lista.map(item => normalizarTextoExacto(item));
}


// ==================== ÍNDICES EXACTOS ====================

const pictogramasExactos =
    normalizarDiccionarioExacto(pictogramas);

// EXPERIMENTAL AUTO-VERBOS:
// Unificamos las formas generadas automaticamente con el indice verbal
// que ya consulta todo GramaNick. Las entradas manuales quedan al final
// y por lo tanto tienen prioridad para irregulares y excepciones.
const verbosConjugadosExactos = (() => {
    const automaticos =
        (typeof verbosConjugadosAutomaticos !== "undefined")
            ? normalizarDiccionarioExacto(verbosConjugadosAutomaticos)
            : {};

    const manuales =
        normalizarDiccionarioExacto(verbosConjugados);

    return { ...automaticos, ...manuales };
})();

const verbosBaseExactos =
    normalizarListaExacta(verbosBase);

const pronombresExactos =
    normalizarListaExacta(pronombres);

const relacionantesExactos =
    normalizarListaExacta(relacionantes);

const preposicionesExactas =
    normalizarListaExacta(preposiciones);

const adjetivosExactos =
    normalizarListaExacta(adjetivos);

const reflexivosExactos =
    normalizarListaExacta(pronombresReflexivosCuasiReflejos);


// ==================== PALABRAS AMBIGUAS ====================

const palabrasAmbiguas = {

    "corto": [
        {
            tipo: "verbo",
            etiqueta: "VERBO",
            base: "cortar",
            picto: "cortar"
        },
        {
            tipo: "adjetivo",
            etiqueta: "ADJETIVO",
            base: "corto",
            picto: "corto"
        }
    ],

    "chico": [
        {
            tipo: "sustantivo",
            etiqueta: "SUSTANTIVO",
            base: "chico",
            picto: "chico sustantivo"
        },
        {
            tipo: "adjetivo",
            etiqueta: "ADJETIVO",
            base: "chico",
            picto: "chico adjetivo"
        }
    ],

    "chica": [
        {
            tipo: "sustantivo",
            etiqueta: "SUSTANTIVO",
            base: "chica",
            picto: "chica sustantivo"
        },
        {
            tipo: "adjetivo",
            etiqueta: "ADJETIVO",
            base: "chica",
            picto: "chica adjetivo"
        }
    ],

    "leo": [
        {
            tipo: "verbo",
            etiqueta: "VERBO",
            base: "leer",
            picto: "leer"
        },
        {
            tipo: "sustantivo",
            etiqueta: "SUSTANTIVO",
            base: "leo",
            picto: "leo"
        }
    ],

    "cocina": [
        {
            tipo: "verbo",
            etiqueta: "VERBO",
            base: "cocinar",
            picto: "cocinar"
        },
        {
            tipo: "sustantivo",
            etiqueta: "SUSTANTIVO",
            base: "cocina",
            picto: "cocina"
        }
    ],

    "planta": [
        {
            tipo: "sustantivo",
            etiqueta: "SUSTANTIVO",
            base: "planta",
            picto: "planta"
        },
        {
            tipo: "verbo",
            etiqueta: "VERBO",
            base: "plantar",
            picto: "plantar"
        }
    ],

    "sobre": [
        {
            tipo: "preposicion",
            etiqueta: "PREPOSICIÓN"
        },
        {
            tipo: "sustantivo",
            etiqueta: "SUSTANTIVO",
            base: "sobre",
            picto: "sobre"
        }
    ],

    "camino": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "camino", picto: "camino" },
        { tipo: "verbo", etiqueta: "VERBO — CAMINAR", base: "caminar", picto: "caminar" }
    ],

    "bajo": [
        { tipo: "adjetivo", etiqueta: "ADJETIVO", base: "bajo", picto: "bajo" },
        { tipo: "preposicion", etiqueta: "PREPOSICIÓN" },
        { tipo: "verbo", etiqueta: "VERBO — BAJAR", base: "bajar", picto: "bajar" }
    ],

    "cuenta": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "cuenta", picto: "cuenta" },
        { tipo: "verbo", etiqueta: "VERBO — CONTAR", base: "contar", picto: "contar" }
    ],

    "vino": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "vino", picto: "vino" },
        { tipo: "verbo", etiqueta: "VERBO — VENIR", base: "venir", picto: "venir" }
    ],

    "prueba": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "prueba", picto: "prueba" },
        { tipo: "verbo", etiqueta: "VERBO — PROBAR", base: "probar", picto: "probar" }
    ],

    "encuentro": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "encuentro", picto: "encuentro" },
        { tipo: "verbo", etiqueta: "VERBO — ENCONTRAR", base: "encontrar", picto: "encontrar" }
    ],

    "recuerdo": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "recuerdo", picto: "recuerdo" },
        { tipo: "verbo", etiqueta: "VERBO — RECORDAR", base: "recordar", picto: "recordar" }
    ],

    "trabajo": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "trabajo", picto: "trabajo" },
        { tipo: "verbo", etiqueta: "VERBO — TRABAJAR", base: "trabajar", picto: "trabajar" }
    ],

    "paso": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "paso", picto: "paso" },
        { tipo: "verbo", etiqueta: "VERBO — PASAR", base: "pasar", picto: "pasar" }
    ],

    "canto": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "canto", picto: "canto" },
        { tipo: "verbo", etiqueta: "VERBO — CANTAR", base: "cantar", picto: "cantar" }
    ],

    "corte": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "corte", picto: "corte" },
        { tipo: "verbo", etiqueta: "VERBO — CORTAR", base: "cortar", picto: "cortar" }
    ],

    "vale": [
        { tipo: "sustantivo", etiqueta: "SUSTANTIVO", base: "vale", picto: "vale" },
        { tipo: "verbo", etiqueta: "VERBO — VALER", base: "valer", picto: "valer" }
    ],

    "seco": [
        { tipo: "adjetivo", etiqueta: "ADJETIVO", base: "seco", picto: "seco" },
        { tipo: "verbo", etiqueta: "VERBO — SECAR", base: "secar", picto: "secar" }
    ],

    "pasado": [
        { tipo: "adjetivo", etiqueta: "ADJETIVO", base: "pasado", picto: "pasado" },
        { tipo: "verbo", etiqueta: "VERBO — PASAR", base: "pasar", picto: "pasar" }
    ],

    "fui": [
        { tipo: "verbo", etiqueta: "VERBO — SER", base: "ser", picto: "ser" },
        { tipo: "verbo", etiqueta: "VERBO — IR", base: "ir", picto: "ir" }
    ],
    "fue": [
        { tipo: "verbo", etiqueta: "VERBO — SER", base: "ser", picto: "ser" },
        { tipo: "verbo", etiqueta: "VERBO — IR", base: "ir", picto: "ir" }
    ],
    "fuimos": [
        { tipo: "verbo", etiqueta: "VERBO — SER", base: "ser", picto: "ser" },
        { tipo: "verbo", etiqueta: "VERBO — IR", base: "ir", picto: "ir" }
    ],
    "fueron": [
        { tipo: "verbo", etiqueta: "VERBO — SER", base: "ser", picto: "ser" },
        { tipo: "verbo", etiqueta: "VERBO — IR", base: "ir", picto: "ir" }
    ],

    "viste": [
        { tipo: "verbo", etiqueta: "VERBO — VER", base: "ver", picto: "ver" },
        { tipo: "verbo", etiqueta: "VERBO — VESTIR", base: "vestir", picto: "vestir" }
    ],

    "me": [
        {
            tipo: "reflexivo",
            etiqueta: "REFLEXIVO"
        },
        {
            tipo: "pronombre",
            etiqueta: "PRONOMBRE"
        }
    ],

    "te": [
        {
            tipo: "reflexivo",
            etiqueta: "REFLEXIVO"
        },
        {
            tipo: "pronombre",
            etiqueta: "PRONOMBRE"
        }
    ],

    "se": [
        {
            tipo: "reflexivo",
            etiqueta: "REFLEXIVO"
        },
        {
            tipo: "pronombre",
            etiqueta: "PRONOMBRE"
        }
    ],

    "nos": [
        {
            tipo: "reflexivo",
            etiqueta: "REFLEXIVO"
        },
        {
            tipo: "pronombre",
            etiqueta: "PRONOMBRE"
        }
    ]
};


// ==================== ELECCIONES AMBIGUAS ====================

const eleccionesAmbiguas = {};

function obtenerOpcionesAmbiguas(palabra) {
    const exacta = normalizarTextoExacto(palabra);
    return palabrasAmbiguas[exacta] || null;
}

function claveAparicionAmbigua(indiceLinea, indicePalabra, palabra) {
    return `${indiceLinea}:${indicePalabra}:${normalizarTextoExacto(palabra)}`;
}


// ==================== SELECTOR DE AMBIGÜEDAD ====================

function crearSelectorAmbiguedad(opciones, seleccionActual, alCambiar) {

    // Si cada alternativa pertenece a una categoría distinta, mostramos
    // solamente la categoría (VERBO, SUSTANTIVO, etc.) para mantener el
    // selector limpio. Si hay dos opciones de la misma categoría, conservamos
    // la etiqueta completa para poder distinguirlas (ej.: SER / IR).
    const cantidadPorTipo = opciones.reduce((acum, opcion) => {
        acum[opcion.tipo] = (acum[opcion.tipo] || 0) + 1;
        return acum;
    }, {});

    const etiquetaVisible = opcion =>
        cantidadPorTipo[opcion.tipo] > 1
            ? opcion.etiqueta
            : ({
                verbo: "VERBO",
                sustantivo: "SUSTANTIVO",
                adjetivo: "ADJETIVO",
                preposicion: "PREPOSICIÓN",
                reflexivo: "REFLEXIVO",
                pronombre: "PRONOMBRE"
            }[opcion.tipo] || opcion.etiqueta);

    const contenedor = document.createElement("div");
    contenedor.className = "selector-ambiguedad no-descargar";

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton-ambiguedad";
    boton.innerText = `${etiquetaVisible(seleccionActual)} ▼`;

    const menu = document.createElement("div");
    menu.className = "menu-ambiguedad";

    opciones.forEach(opcion => {

        const item = document.createElement("button");
        item.type = "button";
        item.className = "opcion-ambiguedad";
        item.innerText = etiquetaVisible(opcion);

        item.addEventListener("click", evento => {
            evento.stopPropagation();

            menu.classList.remove("menu-ambiguedad-abierto");

            alCambiar(opcion);
        });

        menu.appendChild(item);
    });

    boton.addEventListener("click", evento => {
        evento.stopPropagation();

        document
            .querySelectorAll(".menu-ambiguedad-abierto")
            .forEach(otroMenu => {
                if (otroMenu !== menu) {
                    otroMenu.classList.remove("menu-ambiguedad-abierto");
                }
            });

        menu.classList.toggle("menu-ambiguedad-abierto");
    });

    contenedor.appendChild(boton);
    contenedor.appendChild(menu);

    return contenedor;
}


// Cerrar selector gramatical al tocar afuera

document.addEventListener("click", evento => {

    if (!evento.target.closest(".selector-ambiguedad")) {

        document
            .querySelectorAll(".menu-ambiguedad-abierto")
            .forEach(menu => {
                menu.classList.remove("menu-ambiguedad-abierto");
            });

    }
});


// ==================== PICTOGRAMA AMBIGUO ====================

function crearPictoAmbiguoSeleccionable(opciones) {

    const picto = crearPictoSeleccionable(opciones);

    const botonEliminar =
        picto.querySelector(".eliminar-picto");

    if (botonEliminar) {
        botonEliminar.style.right = "auto";
        botonEliminar.style.left = "-8px";
    }

    return picto;
}


// ==================== RENDERIZAR AMBIGÜEDAD ====================

function renderizarInterpretacionAmbigua({
    opcion,
    filaPicto,
    filaSimbolo,
    filaTexto
}) {

    filaPicto.innerHTML = "";
    filaSimbolo.innerHTML = "";

    filaTexto.style.color = "";
    filaTexto.style.fontWeight = "";


    // ==================== VERBO ====================

    if (opcion.tipo === "verbo") {

        if (mostrarColores) {
            filaTexto.style.color = "red";
            filaTexto.style.fontWeight = "bold";
        }

        if (mostrarSimbolos) {
            filaSimbolo.innerText = "=";
            filaSimbolo.style.color = "red";
        }

        if (mostrarImagenes) {

            const opcionesPicto =
                obtenerPictos(opcion.picto);

            if (opcionesPicto.length) {
                filaPicto.appendChild(
                    crearPictoAmbiguoSeleccionable(opcionesPicto)
                );
            }
        }

        return;
    }


    // ==================== REFLEXIVO / CUASI REFLEJO ====================

    if (opcion.tipo === "reflexivo") {

        if (mostrarColores) {
            filaTexto.style.color = "red";
            filaTexto.style.fontWeight = "bold";
        }

        if (mostrarSimbolos) {

            const img = document.createElement("img");

            img.src = simboloReflexivosCuasiReflejos;
            img.style.width = "40px";
            img.style.height = "40px";

            filaSimbolo.appendChild(img);
        }

        return;
    }


    // ==================== PRONOMBRE ====================

    if (opcion.tipo === "pronombre") {

        if (mostrarColores) {
            filaTexto.style.color = "black";
            filaTexto.style.fontWeight = "normal";
        }

        if (mostrarSimbolos) {

            const img = document.createElement("img");

            img.src = simboloPronombre;
            img.style.width = "40px";
            img.style.height = "40px";

            filaSimbolo.appendChild(img);
        }

        return;
    }


    // ==================== ADJETIVO ====================

    if (opcion.tipo === "adjetivo") {

        if (mostrarSimbolos) {

            const imgSimbolo =
                document.createElement("img");

            imgSimbolo.src = simboloAdjetivo;
            imgSimbolo.style.width = "40px";
            imgSimbolo.style.height = "40px";

            filaSimbolo.appendChild(imgSimbolo);
        }

        if (mostrarImagenes) {

            const opcionesPicto =
                obtenerPictos(opcion.picto);

            if (opcionesPicto.length) {
                filaPicto.appendChild(
                    crearPictoAmbiguoSeleccionable(opcionesPicto)
                );
            }
        }

        return;
    }


    // ==================== PREPOSICIÓN ====================

    if (opcion.tipo === "preposicion") {

        if (mostrarColores) {
            filaTexto.style.color = "blue";
            filaTexto.style.fontWeight = "bold";
        }

        // LAS PREPOSICIONES NO LLEVAN PICTOGRAMA

        return;
    }


    // ==================== SUSTANTIVO ====================

    if (opcion.tipo === "sustantivo") {

        if (mostrarColores) {
            filaTexto.style.color = "black";
            filaTexto.style.fontWeight = "normal";
        }

        if (mostrarImagenes) {

            const opcionesPicto =
                obtenerPictos(opcion.picto);

            if (opcionesPicto.length) {
                filaPicto.appendChild(
                    crearPictoAmbiguoSeleccionable(opcionesPicto)
                );
            }
        }

        return;
    }
}


// ==================== FUNCIONES AUX ====================

function resolverPalabraExactaOAlias(palabra) {

    const exacta = normalizarTextoExacto(palabra);

    return {
        exacta,
        alias: aplicarAlias(palabra)
    };
}

function estaEnLista(palabra, listaExacta) {

    const { exacta, alias } =
        resolverPalabraExactaOAlias(palabra);

    if (listaExacta.includes(exacta)) {
        return true;
    }

    if (alias) {
        const aliasExacto = normalizarTextoExacto(alias);
        return listaExacta.includes(aliasExacto);
    }

    return false;
}

function obtenerValorDiccionario(clave, diccionarioExacto) {

    const { exacta, alias } =
        resolverPalabraExactaOAlias(clave);

    if (
        Object.prototype.hasOwnProperty.call(
            diccionarioExacto,
            exacta
        )
    ) {
        return diccionarioExacto[exacta];
    }

    if (alias) {

        const aliasExacto =
            normalizarTextoExacto(alias);

        if (
            Object.prototype.hasOwnProperty.call(
                diccionarioExacto,
                aliasExacto
            )
        ) {
            return diccionarioExacto[aliasExacto];
        }
    }

    return null;
}

function esPronombre(palabra) {
    return estaEnLista(palabra, pronombresExactos);
}

function esRelacionante(palabra) {
    return estaEnLista(palabra, relacionantesExactos);
}

function esPreposicion(palabra) {
    return estaEnLista(palabra, preposicionesExactas);
}

function esAdjetivo(palabra) {
    return estaEnLista(palabra, adjetivosExactos);
}

function esReflexivosCuasiReflejos(palabra) {
    return estaEnLista(palabra, reflexivosExactos);
}

function obtenerRaizVerbal(palabra) {

    const { exacta, alias } =
        resolverPalabraExactaOAlias(palabra);

    // V5.2: las categorías cerradas conocidas tienen prioridad sobre
    // cualquier inferencia verbal. Evita falsos positivos como EN -> IR
    // producidos por una forma regular generada accidentalmente.
    if (typeof esPreposicion === "function" && esPreposicion(exacta)) {
        return null;
    }

    if (reflexivosExactos.includes(exacta)) {
        return null;
    }

    // V5.8.3: JUGO sin tilde es siempre el sustantivo/bebida.
    // El motor regular de JUGAR generaba artificialmente "jugo" (jug + o),
    // pero la forma verbal correcta es JUEGO y el pretérito es JUGÓ.
    // Conservamos JUGÓ -> JUGAR y evitamos que JUGO entre al motor verbal.
    if (exacta === "jugo") {
        return null;
    }

    // V3: las irregularidades explicitas tienen prioridad sobre las reglas
    // (por ejemplo ES -> SER, evitando la coincidencia regular con IR).
    if (typeof obtenerRaizVerbalIrregular === "function") {
        const raizIrregular = obtenerRaizVerbalIrregular(exacta);
        if (raizIrregular) return raizIrregular;
    }

    // V5.8.2: infinitivos con pronombre reflexivo enclítico.
    // Se reconocen gramaticalmente aunque tengan pictograma propio.
    // Esto evita que VESTIRSE quede fuera solo por existir en el diccionario visual.
    if (typeof esInfinitivoRegularNoCargado === "function" &&
        esInfinitivoRegularNoCargado(exacta) &&
        /(?:ar|er|ir)(?:me|te|se|nos)$/.test(exacta)) {
        return exacta;
    }

    // Luego intentamos resolver por reglas regulares.
    if (typeof obtenerRaizVerbalAutomatica === "function") {
        const raizAutomatica = obtenerRaizVerbalAutomatica(exacta);
        if (raizAutomatica) {
            // Si el infinitivo reflexivo no tiene picto propio (ej. LAVARSE),
            // reutiliza el del verbo base (LAVAR). Si sí tiene uno propio, lo conserva.
            const reflexivoInfinitivo = raizAutomatica.match(/^(.+(?:ar|er|ir))(?:me|te|se|nos)$/);
            if (reflexivoInfinitivo && !existePicto(raizAutomatica)) {
                const baseSinPronombre = reflexivoInfinitivo[1];
                if (verbosBaseExactos.includes(baseSinPronombre) && existePicto(baseSinPronombre)) {
                    return baseSinPronombre;
                }
            }
            return raizAutomatica;
        }
    }

    // V4: reconocimiento gramatical de regulares aunque el infinitivo no
    // esté cargado y aunque no exista pictograma. Evitamos forzar una
    // palabra que ya tiene una entrada visual propia: esos casos deben
    // declararse ambiguos cuando también sean verbales.
    if (typeof inferirInfinitivoRegularNoCargado === "function") {
        const inferida = inferirInfinitivoRegularNoCargado(exacta);
        if (inferida && !existePicto(exacta)) return inferida;
    }

    if (verbosConjugadosExactos[exacta]) {
        return verbosConjugadosExactos[exacta];
    }

    if (verbosBaseExactos.includes(exacta)) {
        return exacta;
    }

    if (alias) {

        const aliasExacto =
            normalizarTextoExacto(alias);

        if (reflexivosExactos.includes(aliasExacto)) {
            return null;
        }

        if (typeof obtenerRaizVerbalIrregular === "function") {
            const raizAliasIrregular = obtenerRaizVerbalIrregular(aliasExacto);
            if (raizAliasIrregular) return raizAliasIrregular;
        }

        if (typeof esInfinitivoRegularNoCargado === "function" &&
            esInfinitivoRegularNoCargado(aliasExacto) &&
            /(?:ar|er|ir)(?:me|te|se|nos)$/.test(aliasExacto)) {
            return aliasExacto;
        }

        if (typeof obtenerRaizVerbalAutomatica === "function") {
            const raizAliasAutomatica = obtenerRaizVerbalAutomatica(aliasExacto);
            if (raizAliasAutomatica) {
                const reflexivoAliasInfinitivo = raizAliasAutomatica.match(/^(.+(?:ar|er|ir))(?:me|te|se|nos)$/);
                if (reflexivoAliasInfinitivo && !existePicto(raizAliasAutomatica)) {
                    const baseSinPronombre = reflexivoAliasInfinitivo[1];
                    if (verbosBaseExactos.includes(baseSinPronombre) && existePicto(baseSinPronombre)) {
                        return baseSinPronombre;
                    }
                }
                return raizAliasAutomatica;
            }
        }

        if (typeof inferirInfinitivoRegularNoCargado === "function") {
            const inferidaAlias = inferirInfinitivoRegularNoCargado(aliasExacto);
            if (inferidaAlias && !existePicto(aliasExacto)) return inferidaAlias;
        }

        if (verbosConjugadosExactos[aliasExacto]) {
            return verbosConjugadosExactos[aliasExacto];
        }

        if (verbosBaseExactos.includes(aliasExacto)) {
            return aliasExacto;
        }
    }

    return null;
}

function existePicto(clave) {
    return obtenerValorDiccionario(
        clave,
        pictogramasExactos
    ) !== null;
}

function obtenerPictos(clave) {

    const valor =
        obtenerValorDiccionario(
            clave,
            pictogramasExactos
        );

    if (!valor) return [];

    if (Array.isArray(valor)) {
        return valor.filter(Boolean);
    }

    return [valor];
}

function obtenerPicto(clave) {

    const opciones = obtenerPictos(clave);

    return opciones.length
        ? opciones[0]
        : "";
}


// ==================== COLOR EN FRASES COMPUESTAS ====================

function obtenerEstiloPalabraCompuesta(
    palabra,
    anterior = "",
    siguiente = ""
) {

    const limpia = limpiarBordes(palabra);
    const exacta = normalizarTextoExacto(limpia);
    const alias = aplicarAlias(limpia);
    const aliasExacto =
        alias ? normalizarTextoExacto(alias) : "";

    const esVerbo = !!obtenerRaizVerbal(limpia);

    if (esVerbo) {
        return {
            color: "red",
            negrita: true
        };
    }

    if (esReflexivosCuasiReflejos(limpia)) {
        return {
            color: "red",
            negrita: true
        };
    }

    if (esPreposicion(limpia)) {

        const esA =
            exacta === "a" ||
            aliasExacto === "a";

        const raizAnterior =
            obtenerRaizVerbal(
                limpiarBordes(anterior)
            );

        const siguienteLimpia =
            limpiarBordes(siguiente);

        const siguienteExacta =
            normalizarTextoExacto(siguienteLimpia);

        const siguienteAlias =
            aplicarAlias(siguienteLimpia);

        const siguienteAliasExacto =
            siguienteAlias
                ? normalizarTextoExacto(siguienteAlias)
                : "";

        const siguienteEsInfinitivo =
            verbosBaseExactos.includes(siguienteExacta) ||
            (typeof esInfinitivoRegularNoCargado === "function" &&
                esInfinitivoRegularNoCargado(siguienteExacta)) ||
            (
                siguienteAliasExacto &&
                (verbosBaseExactos.includes(siguienteAliasExacto) ||
                 (typeof esInfinitivoRegularNoCargado === "function" &&
                    esInfinitivoRegularNoCargado(siguienteAliasExacto)))
            );

        if (
            esA &&
            raizAnterior &&
            siguienteEsInfinitivo
        ) {
            return {
                color: "red",
                negrita: true
            };
        }

        return {
            color: "blue",
            negrita: true
        };
    }

    return {
        color: "black",
        negrita: false
    };
}


// ==================== MENÚS DE PICTOGRAMAS ====================

function cerrarMenusPictos(menuExcepto = null) {

    document
        .querySelectorAll(".menu-pictos-abierto")
        .forEach(menu => {

            if (menu !== menuExcepto) {
                menu.classList.remove(
                    "menu-pictos-abierto"
                );
            }

        });
}

function crearPictoSeleccionable(opciones, conceptoArasaac = null) {

    const contenedor =
        document.createElement("div");

    contenedor.className =
        "picto-seleccionable";

    const img =
        document.createElement("img");

    img.src = opciones[0];

    contenedor.appendChild(img);


    // ==================== BOTÓN ELIMINAR ====================

    const botonEliminar =
        document.createElement("button");

    botonEliminar.type = "button";
    botonEliminar.className =
        "eliminar-picto no-descargar";
    botonEliminar.innerText = "×";

    botonEliminar.addEventListener(
        "click",
        evento => {

            evento.stopPropagation();

            img.style.display = "none";

            const flecha =
                contenedor.querySelector(
                    ".flecha-picto"
                );

            if (flecha) {
                flecha.style.display = "none";
            }

            const menu =
                contenedor.querySelector(
                    ".menu-pictos"
                );

            if (menu) {
                menu.classList.remove(
                    "menu-pictos-abierto"
                );
            }

            botonEliminar.style.display =
                "none";
        }
    );

    contenedor.appendChild(botonEliminar);

    if (opciones.length <= 1) {
        return contenedor;
    }


    // ==================== FLECHA ====================

    const flecha =
        document.createElement("button");

    flecha.type = "button";
    flecha.className =
        "flecha-picto no-descargar";
    flecha.innerText = "▼";

    contenedor.appendChild(flecha);


    // ==================== MENÚ ====================

    const menu =
        document.createElement("div");

    menu.className =
        "menu-pictos no-descargar";

    opciones.forEach(url => {

        const envoltorio = document.createElement("div");
        envoltorio.className = "opcion-picto-con-favorito";

        const opcion = document.createElement("img");
        opcion.src = url;
        opcion.className = "opcion-picto";

        opcion.addEventListener("click", evento => {
            evento.stopPropagation();
            img.src = url;
            menu.classList.remove("menu-pictos-abierto");
        });

        envoltorio.appendChild(opcion);

        // V5.6: favoritos solo para pictogramas provenientes de ARASAAC.
        if (conceptoArasaac && typeof guardarFavoritoArasaac === "function") {
            const estrella = document.createElement("button");
            estrella.type = "button";
            estrella.className = "favorito-picto no-descargar";

            const refrescarEstrellas = () => {
                const actual = typeof favoritoArasaac === "function"
                    ? favoritoArasaac(conceptoArasaac)
                    : null;
                menu.querySelectorAll(".favorito-picto").forEach(b => {
                    b.textContent = b.dataset.url === actual ? "★" : "☆";
                    b.classList.toggle("favorito-picto-activo", b.dataset.url === actual);
                });
            };

            estrella.dataset.url = url;
            estrella.addEventListener("click", evento => {
                evento.stopPropagation();
                const actual = favoritoArasaac(conceptoArasaac);
                guardarFavoritoArasaac(conceptoArasaac, actual === url ? null : url);
                refrescarEstrellas();
            });

            envoltorio.appendChild(estrella);
            requestAnimationFrame(refrescarEstrellas);
        }

        menu.appendChild(envoltorio);
    });

    contenedor.appendChild(menu);

    flecha.addEventListener(
        "click",
        evento => {

            evento.stopPropagation();

            const estabaAbierto =
                menu.classList.contains(
                    "menu-pictos-abierto"
                );

            cerrarMenusPictos(menu);

            if (estabaAbierto) {
                menu.classList.remove(
                    "menu-pictos-abierto"
                );
                return;
            }

            menu.classList.add(
                "menu-pictos-abierto"
            );

            menu.style.left = "50%";
            menu.style.right = "auto";
            menu.style.transform =
                "translateX(-50%)";

            requestAnimationFrame(() => {

                const rect =
                    menu.getBoundingClientRect();

                const margen = 10;

                if (rect.left < margen) {

                    const correccion =
                        margen - rect.left;

                    menu.style.transform =
                        `translateX(calc(-50% + ${correccion}px))`;
                }

                const rectCorregido =
                    menu.getBoundingClientRect();

                if (
                    rectCorregido.right >
                    window.innerWidth - margen
                ) {

                    const correccion =
                        rectCorregido.right -
                        (window.innerWidth - margen);

                    menu.style.transform =
                        `translateX(calc(-50% - ${correccion}px))`;
                }

            });
        }
    );

    return contenedor;
}


// Cerrar selector de pictos al tocar afuera

document.addEventListener(
    "click",
    evento => {

        const hizoClickEnSelector =
            evento.target.closest(
                ".picto-seleccionable"
            );

        if (!hizoClickEnSelector) {
            cerrarMenusPictos();
        }
    }
);


// ==================== ESTADO ====================

let mostrarSimbolos = true;
let mostrarImagenes = true;
let mostrarColores = true;

let tipografiaActual =
    "'Dreaming Outloud Pro', cursive";

let seleccionGuardada = null;

// ==================== V5.7 EXPERIMENTAL — SELECCIÓN MÚLTIPLE ====================
let seleccionMultipleActiva = false;

function palabrasSeleccionadasMultiples() {
    const resultado = document.getElementById("resultado");
    if (!resultado) return [];
    return Array.from(resultado.querySelectorAll(".palabra.seleccion-multiple-activa"));
}

function toggleSeleccionMultiple() {
    seleccionMultipleActiva = !seleccionMultipleActiva;

    const btn = document.getElementById("btnSeleccionMultiple");
    if (btn) {
        btn.innerText = seleccionMultipleActiva
            ? "Selección ON"
            : "Selección OFF";
        btn.classList.toggle("boton-on", seleccionMultipleActiva);
        btn.classList.toggle("boton-off", !seleccionMultipleActiva);
    }

    if (!seleccionMultipleActiva) {
        palabrasSeleccionadasMultiples().forEach(p =>
            p.classList.remove("seleccion-multiple-activa")
        );
    }

    const seleccion = window.getSelection();
    if (seleccion) seleccion.removeAllRanges();
    seleccionGuardada = null;
}

// En modo múltiple, tocar el TEXTO de una palabra la agrega/quita de la selección.
// Fuera de este modo no modifica en absoluto el comportamiento existente.
document.addEventListener("click", evento => {
    if (!seleccionMultipleActiva) return;

    const filaTexto = evento.target.closest && evento.target.closest(".fila-texto");
    if (!filaTexto) return;

    const resultado = document.getElementById("resultado");
    if (!resultado || !resultado.contains(filaTexto)) return;

    const palabra = filaTexto.closest(".palabra");
    if (!palabra) return;

    evento.preventDefault();
    palabra.classList.toggle("seleccion-multiple-activa");

    const seleccion = window.getSelection();
    if (seleccion) seleccion.removeAllRanges();
    seleccionGuardada = null;
});

function aplicarColorAPalabrasMultiples(color) {
    const palabras = palabrasSeleccionadasMultiples();
    if (!seleccionMultipleActiva || !palabras.length) return false;

    palabras.forEach(palabra => {
        const filaTexto = palabra.querySelector(".fila-texto");
        if (!filaTexto) return;
        filaTexto.style.color = color;
        filaTexto.querySelectorAll(".texto-marcado-manual").forEach(marca => {
            marca.style.color = color;
        });
    });
    return true;
}

function agregarSimboloAPalabra(palabra, tipo) {
    const filaSimbolo = palabra && palabra.querySelector(".fila-simbolo");
    if (!filaSimbolo) return;

    if (tipo === "borrar") {
        filaSimbolo.replaceChildren();
        return;
    }

    filaSimbolo.style.position = "relative";

    const simbolo = document.createElement("span");
    simbolo.className = "simbolo-manual";
    simbolo.style.left = "50%";

    if (tipo === "verbo") {
        simbolo.classList.add("simbolo-manual-verbo");
        simbolo.textContent = "=";
    }

    if (tipo === "adjetivo") {
        simbolo.classList.add("simbolo-manual-adjetivo");
        const img = document.createElement("img");
        img.src = simboloAdjetivo;
        img.alt = "Símbolo de adjetivo";
        simbolo.appendChild(img);
    }

    if (tipo === "infinitivo") {
        simbolo.classList.add("simbolo-manual-adjetivo");
        const img = document.createElement("img");
        img.src = simboloVerboInfinitivo;
        img.alt = "Símbolo de verbo infinitivo";
        simbolo.appendChild(img);
    }

    if (tipo === "reflexivo") {
        simbolo.classList.add("simbolo-manual-adjetivo");
        const img = document.createElement("img");
        img.src = simboloReflexivosCuasiReflejos;
        img.alt = "Símbolo de pronombre reflexivo";
        simbolo.appendChild(img);
    }

    if (tipo === "pronombre") {
        simbolo.classList.add("simbolo-manual-adjetivo");
        const img = document.createElement("img");
        img.src = simboloPronombre;
        img.alt = "Símbolo de pronombre";
        simbolo.appendChild(img);
    }

    filaSimbolo.appendChild(simbolo);
}

function aplicarSimboloAPalabrasMultiples(tipo) {
    const palabras = palabrasSeleccionadasMultiples();
    if (!seleccionMultipleActiva || !palabras.length) return false;
    palabras.forEach(palabra => agregarSimboloAPalabra(palabra, tipo));
    return true;
}



// ==================== SUBRAYADO ====================

function obtenerRangoSeleccionResultado() {

    const resultado =
        document.getElementById("resultado");

    const seleccion =
        window.getSelection();

    if (!resultado || !seleccion) return null;
    if (!seleccion.rangeCount) return null;
    if (seleccion.isCollapsed) return null;

    const rango =
        seleccion.getRangeAt(0);

    // La selección tiene que empezar y terminar dentro del resultado.
    if (
        !resultado.contains(rango.startContainer) ||
        !resultado.contains(rango.endContainer)
    ) {
        return null;
    }

    return rango.cloneRange();
}


document.addEventListener(
    "selectionchange",
    () => {

        const rangoActual =
            obtenerRangoSeleccionResultado();

        if (rangoActual) {
            seleccionGuardada = rangoActual;
        }
    }
);


function subrayarSeleccion() {

    const resultado =
        document.getElementById("resultado");

    if (!resultado) return;

    // Cada vez que se toca SUBRAYAR intenta usar primero
    // la selección que existe en ese mismo momento.
    // Si el navegador ya la perdió al tocar el botón,
    // usa la última selección válida guardada.
    const rangoActual =
        obtenerRangoSeleccionResultado();

    const rango =
        rangoActual ||
        (seleccionGuardada && !seleccionGuardada.collapsed
            ? seleccionGuardada.cloneRange()
            : null);

    if (!rango) return;

    const walker =
        document.createTreeWalker(
            resultado,
            NodeFilter.SHOW_TEXT
        );

    const fragmentos = [];

    while (walker.nextNode()) {

        const nodo = walker.currentNode;

        const filaTexto =
            nodo.parentElement &&
            nodo.parentElement.closest(
                ".fila-texto"
            );

        if (!filaTexto) continue;

        if (!rango.intersectsNode(nodo)) {
            continue;
        }

        let inicio = 0;
        let fin = nodo.textContent.length;

        if (nodo === rango.startContainer) {
            inicio = rango.startOffset;
        }

        if (nodo === rango.endContainer) {
            fin = rango.endOffset;
        }

        if (inicio < fin) {
            fragmentos.push({
                nodo,
                inicio,
                fin
            });
        }
    }

    fragmentos
        .reverse()
        .forEach(fragmento => {

            const nodo = fragmento.nodo;
            const inicio = fragmento.inicio;
            const fin = fragmento.fin;

            if (fin < nodo.textContent.length) {
                nodo.splitText(fin);
            }

            let textoSeleccionado = nodo;

            if (inicio > 0) {
                textoSeleccionado =
                    nodo.splitText(inicio);
            }

            // Si el texto ya estaba dentro de un subrayado,
            // no volvemos a envolverlo.
            if (
                textoSeleccionado.parentElement &&
                textoSeleccionado.parentElement.closest(
                    ".subrayado-manual"
                )
            ) {
                return;
            }

            const subrayado =
                document.createElement("span");

            subrayado.className =
                "subrayado-manual";

            textoSeleccionado
                .parentNode
                .insertBefore(
                    subrayado,
                    textoSeleccionado
                );

            subrayado.appendChild(
                textoSeleccionado
            );
        });

    actualizarSubrayadoContinuo();

    const seleccion =
        window.getSelection();

    if (seleccion) {
        seleccion.removeAllRanges();
    }

    // Queda listo para guardar una selección nueva.
    seleccionGuardada = null;
}


// ==================== COLOR MANUAL DE TEXTO ====================

function colorearSeleccion(color) {

    const resultado =
        document.getElementById("resultado");

    if (!resultado) return;

    // En selección múltiple, una sola acción se aplica a todas las palabras marcadas.
    if (aplicarColorAPalabrasMultiples(color)) return;

    const rangoActual =
        obtenerRangoSeleccionResultado();

    const rango =
        rangoActual ||
        (seleccionGuardada && !seleccionGuardada.collapsed
            ? seleccionGuardada.cloneRange()
            : null);

    if (!rango) return;

    const walker =
        document.createTreeWalker(
            resultado,
            NodeFilter.SHOW_TEXT
        );

    const fragmentos = [];

    while (walker.nextNode()) {

        const nodo = walker.currentNode;

        const filaTexto =
            nodo.parentElement &&
            nodo.parentElement.closest(
                ".fila-texto"
            );

        if (!filaTexto) continue;

        if (!rango.intersectsNode(nodo)) {
            continue;
        }

        let inicio = 0;
        let fin = nodo.textContent.length;

        if (nodo === rango.startContainer) {
            inicio = rango.startOffset;
        }

        if (nodo === rango.endContainer) {
            fin = rango.endOffset;
        }

        if (inicio < fin) {
            fragmentos.push({
                nodo,
                inicio,
                fin
            });
        }
    }

    fragmentos
        .reverse()
        .forEach(fragmento => {

            const nodo = fragmento.nodo;
            const inicio = fragmento.inicio;
            const fin = fragmento.fin;

            if (fin < nodo.textContent.length) {
                nodo.splitText(fin);
            }

            let textoSeleccionado = nodo;

            if (inicio > 0) {
                textoSeleccionado =
                    nodo.splitText(inicio);
            }

            const marca =
                document.createElement("span");

            marca.className =
                "texto-marcado-manual";

            marca.style.color = color;

            textoSeleccionado
                .parentNode
                .insertBefore(
                    marca,
                    textoSeleccionado
                );

            marca.appendChild(
                textoSeleccionado
            );
        });

    // Conservamos la selección para poder aplicar otra acción (por ejemplo,
    // color + símbolo) sin tener que volver a marcar la palabra.
}


// ==================== SÍMBOLO MANUAL ====================

function agregarSimboloSeleccion(tipo) {

    const resultado =
        document.getElementById("resultado");

    if (!resultado) return;

    // En selección múltiple, agrega/borra el símbolo en todas las palabras marcadas.
    if (aplicarSimboloAPalabrasMultiples(tipo)) return;

    const rangoActual =
        obtenerRangoSeleccionResultado();

    const rango =
        rangoActual ||
        (seleccionGuardada && !seleccionGuardada.collapsed
            ? seleccionGuardada.cloneRange()
            : null);

    if (!rango) return;

    // Buscamos la palabra/fila a la que pertenece la selección.
    const inicio = rango.startContainer.nodeType === Node.TEXT_NODE
        ? rango.startContainer.parentElement
        : rango.startContainer;

    const fin = rango.endContainer.nodeType === Node.TEXT_NODE
        ? rango.endContainer.parentElement
        : rango.endContainer;

    const palabraInicio = inicio && inicio.closest
        ? inicio.closest(".palabra")
        : null;

    const palabraFin = fin && fin.closest
        ? fin.closest(".palabra")
        : null;

    if (!palabraInicio || !palabraFin) return;

    // Si se seleccionan varias palabras, usamos el centro visual de toda
    // la selección y colocamos el símbolo en la palabra que contiene ese centro.
    const rectRango = rango.getBoundingClientRect();
    if (!rectRango || (!rectRango.width && !rectRango.height)) return;

    const centroX = rectRango.left + (rectRango.width / 2);

    // IMPORTANTE: buscamos la palabra objetivo SOLO dentro de la misma
    // oración/línea donde está la selección. Antes se buscaba por X en todo
    // #resultado y, en la 2.ª/3.ª oración, podía coincidir con una palabra
    // de la primera línea que estuviera en la misma posición horizontal.
    const lineaObjetivo = palabraInicio.closest(".contenedor-linea");

    const palabras = Array.from(
        (lineaObjetivo || resultado).querySelectorAll(".palabra")
    ).filter(palabra => {
        const r = palabra.getBoundingClientRect();
        return centroX >= r.left && centroX <= r.right;
    });

    let palabraObjetivo = palabras[0] || palabraInicio;
    const filaSimbolo = palabraObjetivo.querySelector(".fila-simbolo");
    if (!filaSimbolo) return;

    // BORRAR SÍMBOLO: elimina solamente los símbolos de la palabra elegida.
    // No modifica el texto, el pictograma, el color ni ninguna otra parte.
    if (tipo === "borrar") {
        filaSimbolo.replaceChildren();

        // La selección queda disponible para otra corrección manual.
        return;
    }

    // El símbolo manual se posiciona DENTRO de la misma fila reservada
    // para los símbolos automáticos. Así queda justo arriba de lo marcado
    // y nunca se va hacia la parte superior de la página.
    filaSimbolo.style.position = "relative";

    const rectFilaSimbolo = filaSimbolo.getBoundingClientRect();
    const xLocal = centroX - rectFilaSimbolo.left;

    const simbolo = document.createElement("span");
    simbolo.className = "simbolo-manual";
    simbolo.style.left = xLocal + "px";

    if (tipo === "verbo") {
        simbolo.classList.add("simbolo-manual-verbo");
        simbolo.textContent = "=";
    }

    if (tipo === "adjetivo") {
        simbolo.classList.add("simbolo-manual-adjetivo");

        const img = document.createElement("img");
        img.src = simboloAdjetivo;
        img.alt = "Símbolo de adjetivo";
        simbolo.appendChild(img);
    }

    if (tipo === "infinitivo") {
        simbolo.classList.add("simbolo-manual-adjetivo");

        const img = document.createElement("img");
        img.src = simboloVerboInfinitivo;
        img.alt = "Símbolo de verbo infinitivo";
        simbolo.appendChild(img);
    }

    if (tipo === "reflexivo") {
        simbolo.classList.add("simbolo-manual-adjetivo");

        const img = document.createElement("img");
        img.src = simboloReflexivosCuasiReflejos;
        img.alt = "Símbolo de pronombre reflexivo";
        simbolo.appendChild(img);
    }

    if (tipo === "pronombre") {
        simbolo.classList.add("simbolo-manual-adjetivo");

        const img = document.createElement("img");
        img.src = simboloPronombre;
        img.alt = "Símbolo de pronombre";
        simbolo.appendChild(img);
    }

    filaSimbolo.appendChild(simbolo);

    // La selección queda disponible para otra corrección manual.
}


function actualizarSubrayadoContinuo() {

    const resultado =
        document.getElementById("resultado");

    if (!resultado) return;

    resultado
        .querySelectorAll(".subrayado-continuo")
        .forEach(linea => linea.remove());

    resultado
        .querySelectorAll(".contenedor-linea")
        .forEach(contenedor => {

            const subrayados = Array.from(
                contenedor.querySelectorAll(
                    ".subrayado-manual"
                )
            );

            if (!subrayados.length) return;

            const rectContenedor =
                contenedor.getBoundingClientRect();

            // Medimos el texto REAL de cada fragmento subrayado.
            // getBoundingClientRect() sobre el span puede quedar corto cuando
            // la palabra desborda el ancho mínimo/máximo de su contenedor.
            // Un Range sobre el contenido incluye hasta la última letra visible.
            const rectsTexto = subrayados
                .map(subrayado => {
                    const rangoTexto = document.createRange();
                    rangoTexto.selectNodeContents(subrayado);
                    const rect = rangoTexto.getBoundingClientRect();
                    rangoTexto.detach?.();
                    return rect;
                })
                .filter(rect => rect.width > 0 || rect.height > 0);

            if (!rectsTexto.length) return;

            const izquierda = Math.min(...rectsTexto.map(rect => rect.left));
            const derecha = Math.max(...rectsTexto.map(rect => rect.right));
            const abajo = Math.max(...rectsTexto.map(rect => rect.bottom));

            // IMPORTANTE: las líneas largas se reducen con transform: scale(...).
            // getBoundingClientRect() devuelve medidas YA escaladas, pero left/width/top
            // se asignan dentro del contenedor y luego el navegador vuelve a escalarlas.
            // Por eso el subrayado quedaba cada vez más corto cuanto más larga era la oración.
            // Convertimos las medidas visuales nuevamente a coordenadas internas del contenedor.
            const escalaX = contenedor.offsetWidth
                ? rectContenedor.width / contenedor.offsetWidth
                : 1;

            const escalaY = contenedor.offsetHeight
                ? rectContenedor.height / contenedor.offsetHeight
                : escalaX;

            const sx = escalaX || 1;
            const sy = escalaY || sx;

            const linea =
                document.createElement("div");

            linea.className =
                "subrayado-continuo";

            linea.style.left =
                `${(izquierda - rectContenedor.left) / sx}px`;

            linea.style.width =
                `${(derecha - izquierda) / sx}px`;

            linea.style.top =
                `${(abajo - rectContenedor.top) / sy + 5}px`;

            contenedor.appendChild(linea);
        });
}

// ==================== FUNCIONES ====================

function extraerPuntuacionFinal(texto) {

    const match =
        (texto || "").match(
            /[.,;:!?]+$/
        );

    return match ? match[0] : "";
}


// ==================== MOSTRAR PICTOS ====================

function mostrarPictos() {

    const texto =
        document.getElementById("texto").value || "";

    const resultado =
        document.getElementById("resultado");

    seleccionGuardada = null;

    resultado.innerHTML = "";

    texto
        .split("\n")
        .forEach((linea, indiceLinea) => {

            const contenedorLinea =
                document.createElement("div");

            contenedorLinea.className =
                "contenedor-linea";

            const palabras =
                linea
                    .split(/\s+/)
                    .filter(Boolean);

            for (
                let i = 0;
                i < palabras.length;
                i++
            ) {

                const palabraOriginal =
                    palabras[i];

                const palabraLimpia =
                    limpiarBordes(
                        palabraOriginal
                    );

                const opcionesAmbiguasPalabra =
                    obtenerOpcionesAmbiguas(
                        palabraLimpia
                    );

                const palabraExacta =
                    normalizarTextoExacto(
                        palabraLimpia
                    );

                const palabraAlias =
                    aplicarAlias(
                        palabraLimpia
                    );

                const palabraAnteriorOriginal =
                    palabras[i - 1] || "";

                const palabraSiguienteOriginal =
                    palabras[i + 1] || "";

                const palabraAnteriorLimpia =
                    limpiarBordes(
                        palabraAnteriorOriginal
                    );

                const palabraSiguienteLimpia =
                    limpiarBordes(
                        palabraSiguienteOriginal
                    );

                const palabraAnteriorExacta =
                    normalizarTextoExacto(
                        palabraAnteriorLimpia
                    );

                const palabraSiguienteExacta =
                    normalizarTextoExacto(
                        palabraSiguienteLimpia
                    );

                const palabraAnteriorAlias =
                    aplicarAlias(
                        palabraAnteriorLimpia
                    );

                const palabraSiguienteAlias =
                    aplicarAlias(
                        palabraSiguienteLimpia
                    );

                if (!palabraOriginal) {
                    continue;
                }

                const div =
                    document.createElement("div");

                div.className = "palabra";

                const filaPicto =
                    document.createElement("div");

                filaPicto.className =
                    "fila-picto";

                const filaSimbolo =
                    document.createElement("div");

                filaSimbolo.className =
                    "fila-simbolo";

                const filaTexto =
                    document.createElement("div");

                filaTexto.className =
                    "fila-texto";

                filaTexto.style.fontFamily =
                    tipografiaActual;


                // =========================
                // BUSCAR FRASES DE HASTA 10 PALABRAS
                // =========================

                let fraseEncontrada = null;
                let palabrasConsumidas = 0;

                const maxPalabrasFrase =
                    Math.min(
                        10,
                        palabras.length - i
                    );

                for (
                    let longitud =
                        maxPalabrasFrase;

                    longitud > 0;

                    longitud--
                ) {

                    const grupoOriginal =
                        palabras
                            .slice(
                                i,
                                i + longitud
                            )
                            .join(" ");

                    const grupoLimpio =
                        palabras
                            .slice(
                                i,
                                i + longitud
                            )
                            .map(
                                p =>
                                    limpiarBordes(
                                        p
                                    )
                            )
                            .join(" ");

                    const grupoExacto =
                        normalizarTextoExacto(
                            grupoLimpio
                        );

                    if (
                        Object.prototype
                            .hasOwnProperty
                            .call(
                                pictogramasExactos,
                                grupoExacto
                            )
                    ) {

                        fraseEncontrada = {
                            original:
                                grupoOriginal,

                            limpio:
                                grupoLimpio,

                            normalizado:
                                grupoExacto,

                            imagen:
                                pictogramasExactos[
                                    grupoExacto
                                ]
                        };

                        palabrasConsumidas =
                            longitud;

                        break;
                    }

                    const grupoAlias =
                        aplicarAlias(
                            grupoLimpio
                        );

                    if (grupoAlias) {

                        const grupoAliasExacto =
                            normalizarTextoExacto(
                                grupoAlias
                            );

                        if (
                            Object.prototype
                                .hasOwnProperty
                                .call(
                                    pictogramasExactos,
                                    grupoAliasExacto
                                )
                        ) {

                            fraseEncontrada = {
                                original:
                                    grupoOriginal,

                                limpio:
                                    grupoLimpio,

                                normalizado:
                                    grupoAliasExacto,

                                imagen:
                                    pictogramasExactos[
                                        grupoAliasExacto
                                    ]
                            };

                            palabrasConsumidas =
                                longitud;

                            break;
                        }
                    }
                }

                if (
                    fraseEncontrada &&
                    palabrasConsumidas > 1
                ) {
                    div.classList.add(
                        "frase-compuesta"
                    );
                }


                // =========================
                // AMBIGÜEDAD GRAMATICAL
                // =========================

                const esAmbiguaActiva =
                    !!opcionesAmbiguasPalabra &&
                    (
                        !fraseEncontrada ||
                        palabrasConsumidas === 1
                    );

                if (esAmbiguaActiva) {

                    fraseEncontrada = null;
                    palabrasConsumidas = 0;

                    const claveEleccion =
                        claveAparicionAmbigua(
                            indiceLinea,
                            i,
                            palabraLimpia
                        );

                    let indiceElegido =
                        eleccionesAmbiguas[
                            claveEleccion
                        ];

                    if (
                        typeof indiceElegido !==
                            "number" ||
                        !opcionesAmbiguasPalabra[
                            indiceElegido
                        ]
                    ) {

                        indiceElegido = 0;

                        eleccionesAmbiguas[
                            claveEleccion
                        ] = 0;
                    }

                    const opcionElegida =
                        opcionesAmbiguasPalabra[
                            indiceElegido
                        ];

                    const aplicarOpcion =
                        opcion => {

                            const nuevoIndice =
                                opcionesAmbiguasPalabra
                                    .indexOf(
                                        opcion
                                    );

                            eleccionesAmbiguas[
                                claveEleccion
                            ] = nuevoIndice;

                            renderizarInterpretacionAmbigua({
                                opcion,
                                filaPicto,
                                filaSimbolo,
                                filaTexto
                            });

                            const selectorViejo =
                                div.querySelector(
                                    ".selector-ambiguedad"
                                );

                            if (selectorViejo) {
                                selectorViejo.remove();
                            }

                            const selectorNuevo =
                                crearSelectorAmbiguedad(
                                    opcionesAmbiguasPalabra,
                                    opcion,
                                    aplicarOpcion
                                );

                            div.appendChild(
                                selectorNuevo
                            );
                        };

                    renderizarInterpretacionAmbigua({
                        opcion:
                            opcionElegida,
                        filaPicto,
                        filaSimbolo,
                        filaTexto
                    });

                    const selector =
                        crearSelectorAmbiguedad(
                            opcionesAmbiguasPalabra,
                            opcionElegida,
                            aplicarOpcion
                        );

                    div.appendChild(selector);
                }


                // =========================
                // VERBOS
                // =========================

                const raizVerbal =
                    esAmbiguaActiva
                        ? null
                        : obtenerRaizVerbal(
                            palabraLimpia
                        );

                const esInfinitivo =
                    verbosBaseExactos.includes(
                        palabraExacta
                    ) ||
                    (typeof esInfinitivoRegularNoCargado === "function" &&
                        esInfinitivoRegularNoCargado(palabraExacta)) ||
                    (
                        palabraAlias &&
                        (verbosBaseExactos.includes(
                            normalizarTextoExacto(
                                palabraAlias
                            )
                        ) ||
                        (typeof esInfinitivoRegularNoCargado === "function" &&
                            esInfinitivoRegularNoCargado(palabraAlias)))
                    );

                if (raizVerbal) {

                    if (mostrarColores) {
                        filaTexto.style.color =
                            "red";
                        filaTexto.style.fontWeight =
                            "bold";
                    }

                    if (mostrarSimbolos) {

                        if (esInfinitivo) {

                            const imgSimbolo =
                                document.createElement(
                                    "img"
                                );

                            imgSimbolo.src =
                                simboloVerboInfinitivo;

                            imgSimbolo.style.width =
                                "40px";

                            imgSimbolo.style.height =
                                "40px";

                            filaSimbolo.appendChild(
                                imgSimbolo
                            );

                        } else {

                            filaSimbolo.innerText =
                                "=";

                            filaSimbolo.style.color =
                                "red";
                        }
                    }

                    const opcionesVerbo =
                        obtenerPictos(
                            raizVerbal
                        );

                    if (mostrarImagenes) {

                        if (opcionesVerbo.length) {

                            const picto =
                                crearPictoSeleccionable(
                                    opcionesVerbo
                                );

                            filaPicto.appendChild(
                                picto
                            );

                        } else if (
                            typeof crearPictoArasaacExperimental === "function"
                        ) {
                            // V5 EXPERIMENTAL: si el verbo fue reconocido pero
                            // GramaNick no tiene imagen propia, ARASAAC completa
                            // solamente el pictograma faltante.
                            const conceptosVerboArasaac =
                                (typeof obtenerCandidatosInfinitivoArasaac === "function")
                                    ? obtenerCandidatosInfinitivoArasaac(palabraLimpia, raizVerbal)
                                    : [raizVerbal];

                            filaPicto.appendChild(
                                crearPictoArasaacExperimental(conceptosVerboArasaac)
                            );
                        }
                    }
                }


                // =========================
                // ADJETIVOS
                // =========================

                if (
                    !esAmbiguaActiva &&
                    esAdjetivo(
                        palabraLimpia
                    )
                ) {

                    const imgSimbolo =
                        document.createElement(
                            "img"
                        );

                    imgSimbolo.src =
                        simboloAdjetivo;

                    imgSimbolo.style.width =
                        "40px";

                    imgSimbolo.style.height =
                        "40px";

                    if (mostrarSimbolos) {
                        filaSimbolo.appendChild(
                            imgSimbolo
                        );
                    }
                }


                // =========================
                // PRONOMBRES
                // =========================

                if (
                    !esAmbiguaActiva &&
                    esPronombre(
                        palabraLimpia
                    )
                ) {

                    const img =
                        document.createElement(
                            "img"
                        );

                    img.src =
                        simboloPronombre;

                    img.style.width =
                        "40px";

                    img.style.height =
                        "40px";

                    if (mostrarSimbolos) {
                        filaSimbolo.appendChild(
                            img
                        );
                    }
                }


                // =========================
                // REFLEXIVOS / CUASI REFLEJOS
                // =========================

                if (
                    !esAmbiguaActiva &&
                    esReflexivosCuasiReflejos(
                        palabraLimpia
                    )
                ) {

                    if (mostrarColores) {
                        filaTexto.style.color =
                            "red";
                        filaTexto.style.fontWeight =
                            "bold";
                    }

                    const img =
                        document.createElement(
                            "img"
                        );

                    img.src =
                        simboloReflexivosCuasiReflejos;

                    img.style.width =
                        "40px";

                    img.style.height =
                        "40px";

                    if (mostrarSimbolos) {
                        filaSimbolo.appendChild(
                            img
                        );
                    }
                }


                // =========================
                // RELACIONANTES
                // =========================

                if (
                    !esAmbiguaActiva &&
                    esRelacionante(
                        palabraLimpia
                    )
                ) {

                    const img =
                        document.createElement(
                            "img"
                        );

                    img.src =
                        simboloRelacionante;

                    img.style.width =
                        "40px";

                    img.style.height =
                        "40px";

                    if (mostrarSimbolos) {
                        filaSimbolo.appendChild(
                            img
                        );
                    }
                }


                // =========================
                // PREPOSICIONES
                // =========================

                if (
                    !esAmbiguaActiva &&
                    esPreposicion(
                        palabraLimpia
                    )
                ) {

                    const palabraA =
                        palabraExacta === "a" ||
                        palabraAlias === "a";

                    // En IR + A + INFINITIVO, la A pertenece a la
                    // construccion verbal: debe verse ROJA. No convertimos
                    // globalmente la preposicion A en roja.
                    const raizSiguiente =
                        obtenerRaizVerbal(palabraSiguienteLimpia);

                    const siguienteAliasExacto = palabraSiguienteAlias
                        ? normalizarTextoExacto(palabraSiguienteAlias)
                        : "";

                    const siguienteEsInfinitivo =
                        !!raizSiguiente &&
                        (
                            verbosBaseExactos.includes(palabraSiguienteExacta) ||
                            (typeof esInfinitivoRegularNoCargado === "function" &&
                                esInfinitivoRegularNoCargado(palabraSiguienteExacta)) ||
                            (
                                siguienteAliasExacto &&
                                (verbosBaseExactos.includes(siguienteAliasExacto) ||
                                 (typeof esInfinitivoRegularNoCargado === "function" &&
                                    esInfinitivoRegularNoCargado(siguienteAliasExacto)))
                            )
                        );

                    const raizAnterior =
                        obtenerRaizVerbal(palabraAnteriorLimpia);

                    // La estructura que queremos marcar es especificamente
                    // IR + A + INFINITIVO (VA A LAVAR, VAMOS A COMER...).
                    const anteriorEsIr = raizAnterior === "ir";

                    const esFraseVerbal =
                        palabraA &&
                        siguienteEsInfinitivo &&
                        anteriorEsIr;

                    if (mostrarColores) {

                        if (esFraseVerbal) {

                            filaTexto.style.color =
                                "red";

                            filaTexto.style.fontWeight =
                                "bold";

                        } else {

                            filaTexto.style.color =
                                "blue";

                            filaTexto.style.fontWeight =
                                "bold";
                        }
                    }
                }


                // =========================
                // PICTOGRAMA FRASE / PALABRA
                // =========================

                if (
                    fraseEncontrada &&
                    mostrarImagenes &&
                    !raizVerbal &&
                    !esAmbiguaActiva
                ) {

                    const opcionesFrase =
                        Array.isArray(
                            fraseEncontrada.imagen
                        )
                            ? fraseEncontrada
                                .imagen
                                .filter(Boolean)
                            : fraseEncontrada.imagen
                                ? [
                                    fraseEncontrada
                                        .imagen
                                ]
                                : [];

                    if (
                        opcionesFrase.length
                    ) {

                        const picto =
                            crearPictoSeleccionable(
                                opcionesFrase
                            );

                        filaPicto.appendChild(
                            picto
                        );
                    }

                    i +=
                        palabrasConsumidas - 1;

                } else if (
                    !raizVerbal &&
                    !esAmbiguaActiva
                ) {

                    const opcionesSimple =
                        obtenerPictos(
                            palabraLimpia
                        );

                    if (mostrarImagenes) {

                        if (opcionesSimple.length) {

                            const picto =
                                crearPictoSeleccionable(
                                    opcionesSimple
                                );

                            filaPicto.appendChild(
                                picto
                            );

                        } else if (
                            typeof crearPictoArasaacExperimental === "function"
                        ) {
                            // V5 EXPERIMENTAL: palabra simple sin pictograma
                            // local. Conservamos intactas todas las prioridades
                            // anteriores y consultamos ARASAAC solo al final.
                            const conceptoArasaac =
                                palabraAlias || palabraLimpia;

                            filaPicto.appendChild(
                                crearPictoArasaacExperimental(conceptoArasaac)
                            );
                        }
                    }
                }


                // =========================
                // TEXTO
                // =========================

                if (
                    fraseEncontrada &&
                    !raizVerbal &&
                    palabrasConsumidas > 1
                ) {

                    filaTexto.style.color = "";
                    filaTexto.style.fontWeight = "";

                    const palabrasFrase =
                        palabras.slice(
                            i -
                            (
                                palabrasConsumidas -
                                1
                            ),
                            i + 1
                        );

                    palabrasFrase.forEach(
                        (
                            palabraFrase,
                            indiceFrase
                        ) => {

                            const span =
                                document.createElement(
                                    "span"
                                );

                            const puntuacion =
                                indiceFrase ===
                                palabrasFrase.length - 1
                                    ? extraerPuntuacionFinal(
                                        palabraFrase
                                    )
                                    : "";

                            const sinPuntuacion =
                                palabraFrase.replace(
                                    /[.,;:!?]+$/g,
                                    ""
                                );

                            span.innerText =
                                sinPuntuacion.toUpperCase() +
                                puntuacion;

                            if (mostrarColores) {

                                const anterior =
                                    indiceFrase > 0
                                        ? palabrasFrase[
                                            indiceFrase - 1
                                        ]
                                        : "";

                                const siguiente =
                                    indiceFrase <
                                    palabrasFrase.length - 1
                                        ? palabrasFrase[
                                            indiceFrase + 1
                                        ]
                                        : "";

                                const estilo =
                                    obtenerEstiloPalabraCompuesta(
                                        palabraFrase,
                                        anterior,
                                        siguiente
                                    );

                                span.style.color =
                                    estilo.color;

                                span.style.fontWeight =
                                    estilo.negrita
                                        ? "bold"
                                        : "normal";
                            }

                            filaTexto.appendChild(
                                span
                            );
                        }
                    );

                } else {

                    const textoMostrar =
                        (
                            palabraOriginal ||
                            ""
                        ).toUpperCase();

                    const spanTexto =
                        document.createElement(
                            "span"
                        );

                    spanTexto.innerText =
                        textoMostrar;

                    filaTexto.appendChild(
                        spanTexto
                    );
                }

                div.appendChild(filaPicto);
                div.appendChild(filaSimbolo);
                div.appendChild(filaTexto);

                contenedorLinea.appendChild(
                    div
                );
            }

            resultado.appendChild(
                contenedorLinea
            );
        });


    // =========================
    // AJUSTAR TODAS LAS LÍNEAS
    // =========================

    requestAnimationFrame(() => {

        const lineas =
            resultado.querySelectorAll(
                ".contenedor-linea"
            );

        if (!lineas.length) {
            return;
        }

        const anchoDisponible =
            resultado.clientWidth;

        let escalaGeneral = 1;

        lineas.forEach(linea => {

            linea.style.transform =
                "none";

            linea.style.transformOrigin =
                "left top";

            linea.style.marginBottom =
                "10px";

            const anchoLinea =
                linea.scrollWidth;

            if (
                anchoLinea >
                anchoDisponible
            ) {

                const escalaNecesaria =
                    anchoDisponible /
                    anchoLinea;

                if (
                    escalaNecesaria <
                    escalaGeneral
                ) {
                    escalaGeneral =
                        escalaNecesaria;
                }
            }
        });

        lineas.forEach(linea => {

            linea.style.transform =
                `scale(${escalaGeneral})`;

            linea.style.transformOrigin =
                "left top";

            const altoOriginal =
                linea.offsetHeight;

            const espacioQueSobra =
                altoOriginal *
                (
                    1 -
                    escalaGeneral
                );

            linea.style.marginBottom =
                `${10 - espacioQueSobra}px`;
        });

    });
}


// ==================== BOTONES ====================

function cambiarTipografia() {

    const selector =
        document.getElementById(
            "tipografia"
        );

    tipografiaActual =
        selector.value;

    document.fonts.ready.then(() => {
        mostrarPictos();
    });
}

function toggleSimbolos() {

    mostrarSimbolos =
        !mostrarSimbolos;

    const btn =
        document.getElementById(
            "btnSimbolos"
        );

    btn.innerText =
        mostrarSimbolos
            ? "Símbolos ON"
            : "Símbolos OFF";

    btn.classList.toggle(
        "boton-on",
        mostrarSimbolos
    );

    btn.classList.toggle(
        "boton-off",
        !mostrarSimbolos
    );

    mostrarPictos();
}

function togglePictos() {

    mostrarImagenes =
        !mostrarImagenes;

    const btn =
        document.getElementById(
            "btnPictos"
        );

    btn.innerText =
        mostrarImagenes
            ? "Pictogramas ON"
            : "Pictogramas OFF";

    btn.classList.toggle(
        "boton-on",
        mostrarImagenes
    );

    btn.classList.toggle(
        "boton-off",
        !mostrarImagenes
    );

    mostrarPictos();
}

function toggleColor() {

    mostrarColores =
        !mostrarColores;

    const btn =
        document.getElementById(
            "btnColor"
        );

    btn.innerText =
        mostrarColores
            ? "Color ON"
            : "Color OFF";

    btn.classList.toggle(
        "boton-on",
        mostrarColores
    );

    btn.classList.toggle(
        "boton-off",
        !mostrarColores
    );

    mostrarPictos();
}


// ==================== MARGEN SEGURO PARA EXPORTAR ====================

function prepararResultadoParaExportar(resultado) {

    const original = {
        paddingLeft:
            resultado.style.paddingLeft,

        paddingRight:
            resultado.style.paddingRight
    };

    const base =
        resultado.getBoundingClientRect();

    let minLeft = base.left;
    let maxRight = base.right;

    resultado
        .querySelectorAll("*")
        .forEach(elemento => {

            if (
                elemento.classList &&
                elemento.classList.contains(
                    "no-descargar"
                )
            ) {
                return;
            }

            const r =
                elemento.getBoundingClientRect();

            if (
                r.width <= 0 ||
                r.height <= 0
            ) {
                return;
            }

            minLeft =
                Math.min(
                    minLeft,
                    r.left
                );

            maxRight =
                Math.max(
                    maxRight,
                    r.right
                );
        });

    const seguridad = 12;

    resultado.style.paddingLeft =
        `${
            Math.max(
                0,
                base.left - minLeft
            ) +
            seguridad
        }px`;

    resultado.style.paddingRight =
        `${
            Math.max(
                0,
                maxRight - base.right
            ) +
            seguridad
        }px`;

    return () => {

        resultado.style.paddingLeft =
            original.paddingLeft;

        resultado.style.paddingRight =
            original.paddingRight;
    };
}


// ==================== DESCARGAR IMAGEN ====================

function descargarImagen() {

    const resultado =
        document.getElementById(
            "resultado"
        );

    resultado.classList.add(
        "modo-descarga"
    );

    const restaurarMargenesExportacion =
        prepararResultadoParaExportar(
            resultado
        );

    requestAnimationFrame(() => {

        html2canvas(
            resultado,
            {
                useCORS: true,
                allowTaint: false,
                backgroundColor:
                    "#ffffff",
                scale: 2,

                ignoreElements:
                    elemento => {

                        return (
                            elemento.classList &&
                            elemento.classList.contains(
                                "no-descargar"
                            )
                        );
                    }
            }
        )
        .then(canvas => {

            resultado.classList.remove(
                "modo-descarga"
            );

            restaurarMargenesExportacion();

            const link =
                document.createElement(
                    "a"
                );

            link.download =
                "gramanick.png";

            link.href =
                canvas.toDataURL(
                    "image/png"
                );

            link.click();
        })
        .catch(error => {

            resultado.classList.remove(
                "modo-descarga"
            );

            restaurarMargenesExportacion();

            console.error(error);
        });

    });
}


// ==================== COPIAR IMAGEN ====================

function copiarImagen() {

    const resultado =
        document.getElementById(
            "resultado"
        );

    if (
        !navigator.clipboard ||
        !window.ClipboardItem
    ) {

        alert(
            "Este navegador no permite copiar imágenes directamente. Podés usar Descargar imagen."
        );

        return;
    }

    resultado.classList.add(
        "modo-descarga"
    );

    const restaurarMargenesExportacion =
        prepararResultadoParaExportar(
            resultado
        );

    const blobPromesa =
        new Promise(
            (
                resolve,
                reject
            ) => {

                requestAnimationFrame(() => {

                    html2canvas(
                        resultado,
                        {
                            useCORS: true,
                            allowTaint: false,
                            backgroundColor:
                                "#ffffff",
                            scale: 2,

                            ignoreElements:
                                elemento => {

                                    return (
                                        elemento.classList &&
                                        elemento.classList.contains(
                                            "no-descargar"
                                        )
                                    );
                                }
                        }
                    )
                    .then(canvas => {

                        canvas.toBlob(
                            blob => {

                                if (blob) {
                                    resolve(blob);
                                } else {
                                    reject(
                                        new Error(
                                            "No se pudo generar la imagen."
                                        )
                                    );
                                }

                            },
                            "image/png"
                        );
                    })
                    .catch(reject);

                });
            }
        );

    const item =
        new ClipboardItem({
            "image/png":
                blobPromesa
        });

    navigator.clipboard
        .write([item])

        .then(() => {

            alert(
                "Imagen copiada. Ya podés pegarla donde quieras."
            );
        })

        .catch(error => {

            console.error(error);

            alert(
                "No se pudo copiar la imagen en este navegador. Podés usar Descargar imagen."
            );
        })

        .finally(() => {

            resultado.classList.remove(
                "modo-descarga"
            );

            restaurarMargenesExportacion();
        });
}
