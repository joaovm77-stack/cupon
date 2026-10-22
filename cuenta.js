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
  let accessToken = null;

  function setSession(email, token) {
    accessToken = token;
    accountEmail.textContent = email || 'Correo no disponible';
    accountStatus.textContent = token ? 'Sesión iniciada' : 'No has iniciado sesión.';
    logoutButton.disabled = !token;
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
        if (!session.access_token) throw new Error('No se recibió una sesión válida.');
        setSession(session.user?.email || email, session.access_token);
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
    if (accessToken) {
      try {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: 'POST',
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` }
        });
      } catch (_) { /* Clear local session even if the network is unavailable. */ }
    }
    setSession('', null);
    window.location.hash = '#login';
  });

  const screens = ['login', 'registro', 'recuperar', 'restablecer', 'cuenta'];
  function showScreen(focusHeading) {
    const requested = window.location.hash.slice(1);
    const active = screens.includes(requested) ? requested : 'login';
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
  showScreen(false);
})();
