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
    password,
    options: {
      emailRedirectTo: window.location.origin + '/cuenta.html'
    }
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
