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
  // UI preview only: never submit credentials or create an authenticated state.
  for (const form of document.querySelectorAll('form')) {
    form.addEventListener('submit', event => event.preventDefault());
  }
  window.addEventListener('hashchange', () => showScreen(true));
  showScreen(false);
})();
