// ============================================================
// MOTOR AUTOMÁTICO DE ADJETIVOS — V5.10 EXPERIMENTAL
// Parte solamente de adjetivos YA cargados en GramaNick.
// Completa género y número sin pisar variantes manuales.
// Ej.: nuevo -> nueva / nuevos / nuevas
//      grande -> grandes
//      feliz -> felices
// ============================================================

(function () {
    if (typeof adjetivos === "undefined" || typeof pictogramas === "undefined") return;

    const originales = Array.from(new Set(adjetivos.map(v => String(v).trim()).filter(Boolean)));
    const conocidas = new Set(originales.map(v => v.toLocaleLowerCase("es")));

    function valorPicto(clave) {
        const k = String(clave || "").toLocaleLowerCase("es");
        for (const nombre of Object.keys(pictogramas)) {
            if (String(nombre).trim().toLocaleLowerCase("es") === k) return pictogramas[nombre];
        }
        return null;
    }

    function agregarVariante(variante, base) {
        const forma = String(variante || "").trim();
        if (!forma) return;
        const normal = forma.toLocaleLowerCase("es");

        if (!conocidas.has(normal)) {
            adjetivos.push(forma);
            conocidas.add(normal);
        }

        // La variante manual siempre gana. Solo heredamos el picto si falta.
        if (valorPicto(forma) == null) {
            const pictoBase = valorPicto(base);
            if (pictoBase != null) pictogramas[forma] = pictoBase;
        }
    }

    for (const baseOriginal of originales) {
        const base = baseOriginal.toLocaleLowerCase("es");

        // nuevo -> nueva, nuevos, nuevas
        if (/^[a-záéíóúüñ]+o$/i.test(base)) {
            const raiz = base.slice(0, -1);
            agregarVariante(raiz + "a", baseOriginal);
            agregarVariante(base + "s", baseOriginal);
            agregarVariante(raiz + "as", baseOriginal);
            continue;
        }

        // grande -> grandes, triste -> tristes
        if (/^[a-záéíóúüñ]+e$/i.test(base)) {
            agregarVariante(base + "s", baseOriginal);
            continue;
        }

        // feliz -> felices
        if (/^[a-záéíóúüñ]+z$/i.test(base)) {
            agregarVariante(base.slice(0, -1) + "ces", baseOriginal);
            continue;
        }

        // azul -> azules, marrón -> marrones, etc.
        if (/^[a-záéíóúüñ]+[bcdfghjklmnñpqrstvwxy]$/i.test(base)) {
            agregarVariante(base + "es", baseOriginal);
        }
    }
})();
