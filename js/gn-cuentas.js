/* EXPERIMENTAL 3.0 — acceso opcional. No modifica funciones originales. */
(function () {
  'use strict';
  const PROJECT_URL = 'https://zyk cprxibdniyymrvxyw.supabase.co'.replace(' ', '');
  const PUBLISHABLE_KEY = 'sb_publishable_yYqoOmHS1tgiM-XyIuHlbw_OE3GLG1y';
  const el = id => document.getElementById(id);
  const access = el('gnBotonAcceso'), identity = el('gnDocenteIdentidad');
  const modal = el('gnModalCuenta'), library = el('gnPantallaBiblioteca');
  const status = el('gnEstadoCuenta'), form = el('gnFormularioCuenta');
  let signup = false, busy = false, client = null;
  const teacherMenu = el('gnMenuDocente'), teacherButton = el('gnDocenteNombre');
  function closeTeacherMenu() { teacherMenu.hidden = true; teacherButton.setAttribute('aria-expanded', 'false'); }
  function message(t, error) { status.textContent = t; status.style.color = error ? '#b52234' : '#35653b'; }
  function openModal() { modal.hidden = false; message('', false); el('gnEmail').focus(); }
  function closeModal() { modal.hidden = true; el('gnPassword').value = ''; }
  function mode(create) {
    signup = create;
    el('gnTituloCuenta').textContent = create ? 'CREAR CUENTA' : 'INICIAR SESIÓN';
    el('gnCampoNombre').hidden = !create;
    el('gnNombreRegistro').required = create;
    el('gnPassword').autocomplete = create ? 'new-password' : 'current-password';
    el('gnEnviarCuenta').textContent = create ? 'CREAR CUENTA' : 'INGRESAR';
    el('gnAlternarRegistro').textContent = create ? '¿Ya tenés cuenta? INICIAR SESIÓN' : '¿No tenés cuenta? CREAR CUENTA';
    message('', false);
  }
  function render(user) {
    access.hidden = !!user;
    identity.hidden = !user;
    closeTeacherMenu();
    window.gnUsuarioActual = user || null;
    if (user) {
      const name = (user.user_metadata && user.user_metadata.nombre) || user.email || 'Docente';
      el('gnDocenteNombre').textContent = name;
    } else { library.hidden = true; }
    window.dispatchEvent(new CustomEvent('gn-auth-cambio', {detail: {user: user || null}}));
  }
  access.addEventListener('click', () => { mode(false); openModal(); });
  teacherButton.addEventListener('click', () => { const opening = teacherMenu.hidden; teacherMenu.hidden = !opening; teacherButton.setAttribute('aria-expanded', String(opening)); });
  document.addEventListener('click', e => { if (!el('gnCuentaZona').contains(e.target)) closeTeacherMenu(); });
  el('gnCerrarCuenta').addEventListener('click', closeModal);
  el('gnAlternarRegistro').addEventListener('click', () => mode(!signup));
  el('gnBotonBiblioteca').addEventListener('click', () => { closeTeacherMenu(); library.hidden = false; window.dispatchEvent(new Event('gn-biblioteca-abrir')); });
  el('gnCerrarBiblioteca').addEventListener('click', () => { library.hidden = true; });
  modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); library.hidden = true; closeTeacherMenu(); } });
  if (!window.supabase || !window.supabase.createClient) {
    access.addEventListener('click', () => message('No se pudo cargar la conexión. Comprobá tu internet y recargá la página.', true));
    return;
  }
  try { client = window.supabase.createClient(PROJECT_URL, PUBLISHABLE_KEY, {auth: {persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}}); window.gnSupabase = client; }
  catch (e) { access.addEventListener('click', () => message('Error al conectar con Supabase.', true)); return; }
  client.auth.getUser().then(({data}) => render(data && data.user)).catch(() => render(null));
  client.auth.onAuthStateChange((_event, session) => { render(session && session.user); if (session && session.user) closeModal(); });
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (busy) return; busy = true;
    el('gnEnviarCuenta').disabled = true;
    message('Conectando...', false);
    const email = el('gnEmail').value.trim(), password = el('gnPassword').value;
    try {
      if (signup) {
        const nombre = el('gnNombreRegistro').value.trim();
        if (!nombre) { message('Ingresá tu nombre.', true); return; }
        const {data, error} = await client.auth.signUp({email, password, options: {data: {nombre}, emailRedirectTo: location.origin + location.pathname}});
        if (error) throw error;
        if (data.session) { render(data.user); closeModal(); }
        else message('¡Cuenta solicitada! Revisá tu correo para confirmar el registro. Después iniciá sesión.', false);
      } else {
        const {error} = await client.auth.signInWithPassword({email, password});
        if (error) throw error;
      }
    } catch (err) { message(err.message || 'No se pudo completar la operación.', true); }
    finally { busy = false; el('gnEnviarCuenta').disabled = false; }
  });
  el('gnBotonSalir').addEventListener('click', async () => {
    closeTeacherMenu();
    const {error} = await client.auth.signOut();
    if (error) { mode(false); openModal(); message(error.message, true); }
    else render(null);
  });
  el('gnRecuperar').addEventListener('click', async () => {
    const email = el('gnEmail').value.trim();
    if (!email) { message('Escribí tu correo electrónico para recuperar la contraseña.', true); return; }
    const {error} = await client.auth.resetPasswordForEmail(email, {redirectTo:location.origin + location.pathname});
    message(error ? error.message : 'Revisá tu correo: enviamos un enlace de recuperación.', !!error);
  });
})();
