'use strict';
(() => {
  const SUPABASE_URL = 'https://ukqiobckfsgahozbwldu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WcykbhPLYzsWxIGjwirHWg_LrYNwfhq';

async function supabaseAuth(endpoint, data, method = 'POST') {
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/${endpoint}`,
    {
      method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.msg ||
      result.error_description ||
      result.message ||
      'No fue posible completar la solicitud.'
    );
  }

  return result;
}
  async function registrarUsuario(email, password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new Error('Las contraseñas no coinciden.');
  }

  if (password.length < 12) {
      throw new Error('La contraseña debe tener al menos 12 caracteres.');
     }

  return await supabaseAuth('signup', {
    email: email.trim(),
    password
  });
}
    const registroForm = document.getElementById('registro-form');

if (registroForm) {
  registroForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('registro-email').value;
    const password = document.getElementById('registro-password').value;
    const confirmPassword = document.getElementById('registro-confirm').value;
    const note = document.getElementById('registro-note');
    const button = registroForm.querySelector('button[type="submit"]');

    button.disabled = true;
    note.textContent = 'Creando tu cuenta...';

    try {
      await registrarUsuario(email, password, confirmPassword);
      note.textContent = 'Revisa tu correo electrónico para confirmar tu cuenta.';
      registroForm.reset();
    } catch (error) {
      note.textContent = error.message || 'No fue posible crear tu cuenta.';
       } finally {
      button.disabled = false;
    }
  });
}
  const loginForm = document.getElementById('login-form');
  const accountEmail = document.getElementById('account-email');
  const accountStatus = document.getElementById('account-status');
  const logoutButton = document.getElementById('logout-button');
  const SESSION_KEY = 'cupon-mexico-auth-v1';
  let accessToken = null;
  let refreshToken = null;
  const perfilForm = document.getElementById('perfil-form');
  const perfilNote = document.getElementById('perfil-note');
  function fillProfile(user) {
    const data = user?.user_metadata || {};
    document.getElementById('perfil-nombre').value = typeof data.full_name === 'string' ? data.full_name : '';
    document.getElementById('perfil-telefono').value = typeof data.phone_contact === 'string' ? data.phone_contact : '';
    perfilForm.querySelector('fieldset').disabled = false;
    perfilNote.textContent = 'Puedes actualizar tus datos cuando quieras.';
  }
  async function fetchProfile() {
    if (!accessToken) return;
    const token = accessToken;
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {headers: {apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`}});
    if (!response.ok) throw new Error('No se pudo verificar tu perfil.');
    const user = await response.json();
    if (token === accessToken) fillProfile(user);
  }
  perfilForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!accessToken) { perfilNote.textContent = 'Inicia sesión primero.'; return; }
    const full_name = document.getElementById('perfil-nombre').value.trim();
    const phone_contact = document.getElementById('perfil-telefono').value.trim();
    if (!full_name || full_name.length > 100 || phone_contact.length > 25) { perfilNote.textContent = 'Revisa los datos del perfil.'; return; }
    const button = perfilForm.querySelector('button[type="submit"]');
    button.disabled = true;
    perfilNote.textContent = 'Guardando perfil...';
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {method: 'PUT', headers: {apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'}, body: JSON.stringify({data: {full_name, phone_contact}})});
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg || result.message || 'No se pudo guardar el perfil.');
      fillProfile(result);
      perfilNote.textContent = 'Perfil guardado correctamente.';
    } catch (error) { perfilNote.textContent = error.message || 'No se pudo guardar el perfil.'; }
    finally { button.disabled = false; }
  });

  function storeSession(session) {
    if (!session.access_token || !session.refresh_token) {
      throw new Error('No se recibió una sesión válida.');
    }
    accessToken = session.access_token;
    refreshToken = session.refresh_token;
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken
    }));
    accountEmail.textContent = session.user?.email || 'Correo no disponible';
    accountStatus.textContent = 'Sesión iniciada';
    logoutButton.disabled = false;
    perfilForm.querySelector('fieldset').disabled = true;
    fetchProfile().catch(() => { perfilNote.textContent = 'No se pudo cargar el perfil. Actualiza la página.'; });
  }

  function clearSession() {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem(SESSION_KEY);
    accountEmail.textContent = 'Se mostrará después de iniciar sesión.';
    accountStatus.textContent = 'No has iniciado sesión.';
    logoutButton.disabled = true;
    perfilForm.reset();
    perfilForm.querySelector('fieldset').disabled = true;
    perfilNote.textContent = 'Inicia sesión para editar tu perfil.';
  }

  async function restoreSession() {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return;
    accountStatus.textContent = 'Verificando sesión...';
    try {
      const saved = JSON.parse(stored);
      if (!saved.refresh_token) throw new Error('Sesión inválida.');
      const renewed = await supabaseAuth('token?grant_type=refresh_token', {
        refresh_token: saved.refresh_token
      });
      storeSession(renewed);
    } catch (error) {
      // Keep tokens only if the network is temporarily unavailable.
      if (error instanceof TypeError) {
        accountStatus.textContent = 'No se pudo verificar la sesión. Actualiza la página.';
      } else {
        clearSession();
        if (window.location.hash === '#cuenta') window.location.hash = '#login';
      }
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const note = document.getElementById('login-note');
      const button = loginForm.querySelector('button[type="submit"]');
      button.disabled = true;
      note.textContent = 'Iniciando sesión...';
      try {
        const session = await supabaseAuth('token?grant_type=password', { email, password });
        storeSession(session);
        document.getElementById('login-password').value = '';
        note.textContent = 'Sesión iniciada correctamente.';
        window.location.hash = '#cuenta';
      } catch (error) {
        note.textContent = error.message || 'No fue posible iniciar sesión.';
      } finally {
        button.disabled = false;
      }
    });
  }

  logoutButton.addEventListener('click', async () => {
    const token = accessToken;
    clearSession();
    window.location.hash = '#login';
    if (token) {
      try {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: 'POST',
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` }
        });
      } catch (_) { /* Local session is already cleared. */ }
    }
  });

  const recuperarForm = document.getElementById('recuperar-form');
  const restablecerForm = document.getElementById('restablecer-form');
  let recoveryToken = null;

  recuperarForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const note = document.getElementById('recuperar-note');
    const button = recuperarForm.querySelector('button[type="submit"]');
    const email = document.getElementById('recuperar-email').value.trim();
    button.disabled = true;
    note.textContent = 'Enviando solicitud...';
    try {
      const redirect = window.location.origin + '/cuenta.html';
      await supabaseAuth('recover?redirect_to=' + encodeURIComponent(redirect), { email });
      note.textContent = 'Si existe una cuenta con este correo, recibirás un enlace para cambiar tu contraseña. Revisa también spam.';
      recuperarForm.reset();
    } catch (error) {
      note.textContent = error.message || 'No se pudo solicitar el enlace. Inténtalo más tarde.';
    } finally {
      button.disabled = false;
    }
  });

  function acceptRecoveryLink() {
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (params.get('type') !== 'recovery') return false;
    const token = params.get('access_token');
    const note = document.getElementById('restablecer-note');
    window.history.replaceState(null, '', window.location.pathname + window.location.search + '#restablecer');
    if (!token) {
      note.textContent = 'El enlace de recuperación no es válido. Solicita uno nuevo.';
      return true;
    }
    recoveryToken = token;
    restablecerForm.querySelector('fieldset').disabled = false;
    note.textContent = 'Introduce una nueva contraseña de al menos 12 caracteres.';
    return true;
  }

  restablecerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const note = document.getElementById('restablecer-note');
    if (!recoveryToken) {
      note.textContent = 'Solicita un enlace de recuperación nuevo.';
      return;
    }
    const password = document.getElementById('new-password').value;
    const confirm = document.getElementById('new-confirm').value;
    if (password !== confirm) {
      note.textContent = 'Las contraseñas no coinciden.';
      return;
    }
    if (password.length < 12) {
      note.textContent = 'La contraseña debe tener al menos 12 caracteres.';
      return;
    }
    const button = restablecerForm.querySelector('button[type="submit"]');
    button.disabled = true;
    note.textContent = 'Guardando contraseña...';
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${recoveryToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg || result.error_description || result.message || 'No se pudo actualizar la contraseña.');
      recoveryToken = null;
      restablecerForm.reset();
      restablecerForm.querySelector('fieldset').disabled = true;
      note.textContent = 'Contraseña actualizada. Ya puedes iniciar sesión.';
      clearSession();
    } catch (error) {
      note.textContent = error.message || 'El enlace puede haber caducado. Solicita uno nuevo.';
    } finally {
      button.disabled = false;
    }
  });

  const screens = ['login', 'registro', 'recuperar', 'restablecer', 'cuenta'];
  function showScreen(focusHeading) {
    const requested = window.location.hash.slice(1);
    const active = screens.includes(requested) ? requested : 'login';
    if (active === 'cuenta' && !accessToken) {
      window.location.hash = '#login';
      return;
    }
    for (const id of screens) document.getElementById(id).hidden = id !== active;
    for (const link of document.querySelectorAll('nav a')) {
      if (link.hash === '#' + active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    const heading = document.getElementById(active + '-title');
    document.title = heading.textContent + ' | Cupón+';
    if (focusHeading) heading.focus();
    }
  window.addEventListener('hashchange', () => showScreen(true));
  acceptRecoveryLink();
  showScreen(false);
  if (!recoveryToken) restoreSession();
})();
