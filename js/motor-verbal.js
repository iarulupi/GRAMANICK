// ============================================================
// GRAMANICK - MOTOR VERBAL AUTOMATICO (EXPERIMENTAL)
// ============================================================
// Genera formas regulares a partir de verbosBase.
// NO reemplaza el diccionario manual: funciones.js conserva
// verbosConjugados como red de seguridad para irregulares,
// excepciones y formas especiales ya cargadas.

function quitarTildesMotorVerbal(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function normalizarMotorVerbal(texto) {
    return String(texto || "")
        .toLowerCase()
        .trim()
        .replace(/^[¿¡!?,.;:()\[\]{}"'«»]+|[¿¡!?,.;:()\[\]{}"'«»]+$/g, "")
        .replace(/\s+/g, " ");
}

function primeraPersonaPreteritoAR(raiz) {
    if (raiz.endsWith("c")) return raiz.slice(0, -1) + "qué";
    if (raiz.endsWith("g")) return raiz + "ué";
    if (raiz.endsWith("z")) return raiz.slice(0, -1) + "cé";
    return raiz + "é";
}

function agregarFormaVerbalAuto(indice, forma, infinitivo) {
    const clave = normalizarMotorVerbal(forma);
    if (clave && !Object.prototype.hasOwnProperty.call(indice, clave)) {
        indice[clave] = infinitivo;
    }
}

function generarFormasRegularesSimples(infinitivo) {
    const reflexivo = infinitivo.endsWith("se");
    const base = reflexivo ? infinitivo.slice(0, -2) : infinitivo;
    const terminacion = base.slice(-2);

    if (!["ar", "er", "ir"].includes(terminacion)) return [];

    const raiz = base.slice(0, -2);
    const formas = new Set([infinitivo]);

    // Para los reflexivos, la conjugacion simple pertenece al verbo sin "se".
    // Las formas con pronombre se generan aparte y conservan la raiz reflexiva.
    if (!reflexivo) {
        if (terminacion === "ar") {
            [raiz+"o", raiz+"as", raiz+"ás", raiz+"a", raiz+"amos", raiz+"an"].forEach(x=>formas.add(x));
            [primeraPersonaPreteritoAR(raiz), raiz+"aste", raiz+"ó", raiz+"amos", raiz+"aron"].forEach(x=>formas.add(x));
            formas.add(raiz+"ando");
            formas.add(raiz+"ado"); // participio
            [raiz+"aba", raiz+"abas", raiz+"ábamos", raiz+"aban"].forEach(x=>formas.add(x)); // imperfecto
            formas.add(raiz+"á"); // imperativo de vos: cortá, lavá, mirá...
        } else if (terminacion === "er") {
            [raiz+"o", raiz+"es", raiz+"és", raiz+"e", raiz+"emos", raiz+"en"].forEach(x=>formas.add(x));
            [raiz+"í", raiz+"iste", raiz+"ió", raiz+"imos", raiz+"ieron"].forEach(x=>formas.add(x));
            formas.add(raiz+"iendo");
            formas.add(raiz+"ido"); // participio
            [raiz+"ía", raiz+"ías", raiz+"íamos", raiz+"ían"].forEach(x=>formas.add(x)); // imperfecto
            formas.add(raiz+"é"); // imperativo de vos regular: comé
        } else {
            [raiz+"o", raiz+"es", raiz+"ís", raiz+"e", raiz+"imos", raiz+"en"].forEach(x=>formas.add(x));
            [raiz+"í", raiz+"iste", raiz+"ió", raiz+"imos", raiz+"ieron"].forEach(x=>formas.add(x));
            formas.add(raiz+"iendo");
            formas.add(raiz+"ido"); // participio
            [raiz+"ía", raiz+"ías", raiz+"íamos", raiz+"ían"].forEach(x=>formas.add(x)); // imperfecto
            formas.add(raiz+"í"); // imperativo de vos regular: viví
        }
    } else {
        const pronombres = ["me", "te", "se", "nos", "se"];
        let presentes, preteritos;
        if (terminacion === "ar") {
            presentes = [raiz+"o", raiz+"ás", raiz+"a", raiz+"amos", raiz+"an"];
            preteritos = [primeraPersonaPreteritoAR(raiz), raiz+"aste", raiz+"ó", raiz+"amos", raiz+"aron"];
        } else if (terminacion === "er") {
            presentes = [raiz+"o", raiz+"és", raiz+"e", raiz+"emos", raiz+"en"];
            preteritos = [raiz+"í", raiz+"iste", raiz+"ió", raiz+"imos", raiz+"ieron"];
        } else {
            presentes = [raiz+"o", raiz+"ís", raiz+"e", raiz+"imos", raiz+"en"];
            preteritos = [raiz+"í", raiz+"iste", raiz+"ió", raiz+"imos", raiz+"ieron"];
        }
        presentes.forEach((f,i)=>formas.add(pronombres[i]+" "+f));
        preteritos.forEach((f,i)=>formas.add(pronombres[i]+" "+f));
    }

    return [...formas];
}

const verbosConjugadosAutomaticos = (() => {
    const indice = Object.create(null);
    const bases = (typeof verbosBase !== "undefined" && Array.isArray(verbosBase)) ? verbosBase : [];

    bases.forEach(infinitivoOriginal => {
        const infinitivo = normalizarMotorVerbal(infinitivoOriginal);
        if (!infinitivo) return;
        generarFormasRegularesSimples(infinitivo).forEach(forma => {
            agregarFormaVerbalAuto(indice, forma, infinitivo);
        });
    });

    return indice;
})();

function obtenerRaizVerbalAutomatica(palabra) {
    const clave = normalizarMotorVerbal(palabra);
    return verbosConjugadosAutomaticos[clave] || null;
}

// ============================================================
// V4 - RECONOCIMIENTO GRAMATICAL SIN PICTOGRAMA
// ============================================================
// Esta capa NO afirma que una imagen exista. Su único objetivo es permitir
// que una forma verbal regular no cargada igualmente sea reconocida como
// verbo (rojo + símbolo). Las superficies ambiguas se protegen en
// palabrasAmbiguas y las palabras ya conocidas por otra entrada visual no
// se fuerzan automáticamente.

function inferirInfinitivoRegularNoCargado(palabra) {
    const w = normalizarMotorVerbal(palabra);
    if (!w || w.includes(" ")) return null;

    // V5.3: analizador morfológico de formas REGULARES no cargadas.
    // Solo usamos terminaciones suficientemente informativas. Las formas
    // cortas/ambiguas (-o, -a, -e, -as, -es...) NO se fuerzan como verbo:
    // CAMINO, JUEGO, BAJO, etc. siguen dependiendo del diccionario/selector.
    // V5.8 experimental: infinitivos reflexivos/pronominales regulares.
    // DESPERTARSE -> DESPERTAR + SE; VESTIRSE -> VESTIR + SE.
    // Se conserva la palabra completa como infinitivo verbal para que la
    // lógica reflexiva existente siga encargándose del SE.
    if (/^[a-záéíóúüñ]+(?:ar|er|ir)(?:me|te|se|nos)?$/.test(w)) return w;

    const reglasAR = [
        ["aríamos", "ar"], ["aríais", "ar"], ["arían", "ar"], ["arías", "ar"], ["aría", "ar"],
        ["aremos", "ar"], ["aréis", "ar"], ["arán", "ar"], ["arás", "ar"], ["aré", "ar"],
        ["ábamos", "ar"], ["abais", "ar"], ["aban", "ar"], ["abas", "ar"], ["aba", "ar"],
        ["ando", "ar"], ["aron", "ar"], ["asteis", "ar"], ["aste", "ar"],
        ["amos", "ar"]
    ];
    for (const [sufijo, terminacion] of reglasAR) {
        if (w.endsWith(sufijo) && w.length > sufijo.length + 1) {
            return w.slice(0, -sufijo.length) + terminacion;
        }
    }

    // Pretérito 1.ª singular -AR: FOTOCOPIÉ -> FOTOCOPIAR.
    if (/é$/.test(w) && w.length > 3) return w.slice(0, -1) + "ar";
    // Pretérito 3.ª singular -AR. Se conserva como regla fuerte por tilde.
    if (/ó$/.test(w) && w.length > 3) return w.slice(0, -1) + "ar";

    const reglasER = [
        ["eríamos", "er"], ["eríais", "er"], ["erían", "er"], ["erías", "er"], ["ería", "er"],
        ["eremos", "er"], ["eréis", "er"], ["erán", "er"], ["erás", "er"], ["eré", "er"],
        ["emos", "er"]
    ];
    for (const [sufijo, terminacion] of reglasER) {
        if (w.endsWith(sufijo) && w.length > sufijo.length + 1) {
            return w.slice(0, -sufijo.length) + terminacion;
        }
    }

    const reglasIR = [
        ["iríamos", "ir"], ["iríais", "ir"], ["irían", "ir"], ["irías", "ir"], ["iría", "ir"],
        ["iremos", "ir"], ["iréis", "ir"], ["irán", "ir"], ["irás", "ir"], ["iré", "ir"]
    ];
    for (const [sufijo, terminacion] of reglasIR) {
        if (w.endsWith(sufijo) && w.length > sufijo.length + 1) {
            return w.slice(0, -sufijo.length) + terminacion;
        }
    }

    // Formas compartidas por -ER / -IR: sabemos que son verbales, pero la
    // superficie sola no permite elegir el infinitivo. ARASAAC resolverá
    // entre candidatos sin cambiar el análisis gramatical.
    if (/iendo$/.test(w) && w.length > 6) return "__verbo_regular_sin_picto__";
    if (/ieron$/.test(w) && w.length > 6) return "__verbo_regular_sin_picto__";
    if (/isteis$/.test(w) && w.length > 7) return "__verbo_regular_sin_picto__";
    if (/iste$/.test(w) && w.length > 5) return "__verbo_regular_sin_picto__";
    if (/ió$/.test(w) && w.length > 4) return "__verbo_regular_sin_picto__";
    if (/imos$/.test(w) && w.length > 5) return "__verbo_regular_sin_picto__";

    // Imperfecto regular -ER/-IR (misma terminación para ambas conjugaciones).
    if (/(íamos|íais|ían|ías|ía)$/.test(w) && w.length > 5) {
        return "__verbo_regular_sin_picto__";
    }

    // Participio regular. -ADO identifica -AR; -IDO puede ser -ER/-IR.
    if (/ado$/.test(w) && w.length > 4) return w.slice(0, -3) + "ar";
    if (/ido$/.test(w) && w.length > 4) return "__verbo_regular_sin_picto__";

    return null;
}

function esInfinitivoRegularNoCargado(palabra) {
    const w = normalizarMotorVerbal(palabra);
    return /^[a-záéíóúüñ]+(?:ar|er|ir)(?:me|te|se|nos)?$/.test(w);
}


// ============================================================
// V5.1 - CANDIDATOS DE INFINITIVO PARA ARASAAC
// ============================================================
// Algunas terminaciones (-ió, -ieron, -iste, -iendo) permiten afirmar que
// una forma es verbal, pero no siempre permiten decidir entre -ER / -IR (y,
// en -ió, también puede aparecer un regular -AR cuya raíz termina en i).
// Esta función NO cambia el análisis gramatical de V4: solamente ofrece a
// ARASAAC candidatos plausibles hasta que la API encuentre un concepto.
function obtenerCandidatosInfinitivoArasaac(palabra, raizReconocida) {
    const raiz = normalizarMotorVerbal(raizReconocida);

    // V5.8.1 experimental: para buscar pictograma, los infinitivos con
    // pronombre reflexivo enclítico consultan el verbo base en ARASAAC.
    // LAVARME/LAVARTE/LAVARSE/LAVARNOS -> LAVAR; VESTIRSE -> VESTIR.
    // No se extiende a LO/LA/LOS/LAS.
    const quitarPronombreReflexivoInfinitivo = valor => {
        const m = String(valor || "").match(/^(.+(?:ar|er|ir))(?:me|te|se|nos)$/);
        return m ? m[1] : valor;
    };

    if (raiz && raiz !== "__verbo_regular_sin_picto__") {
        return [quitarPronombreReflexivoInfinitivo(raiz)];
    }

    const w = normalizarMotorVerbal(palabra);
    const candidatos = [];
    const agregar = x => {
        if (x && !candidatos.includes(x)) candidatos.push(x);
    };

    // Formas compartidas ER/IR.
    const compartidas = [
        ["ieron", 5], ["isteis", 6], ["iste", 4], ["iendo", 5],
        ["íamos", 5], ["íais", 4], ["ían", 3], ["ías", 3], ["ía", 2],
        ["ido", 3], ["imos", 4]
    ];
    for (const [sufijo, n] of compartidas) {
        if (w.endsWith(sufijo) && w.length > n + 1) {
            const base = w.slice(0, -n);
            agregar(base + "er");
            agregar(base + "ir");
            return candidatos;
        }
    }

    if (/ió$/.test(w) && w.length > 4) {
        // FOTOCOPIÓ -> FOTOCOPIAR; COMIÓ -> COMER; VIVIÓ -> VIVIR.
        agregar(w.slice(0, -1) + "ar");
        const base = w.slice(0, -2);
        agregar(base + "er");
        agregar(base + "ir");
    }

    return candidatos;
}
