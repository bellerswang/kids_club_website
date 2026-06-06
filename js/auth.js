import { isSupabaseConfigured, supabase } from './supabase-client.js';

const statusBox = document.getElementById('auth-status');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const resetForm = document.getElementById('reset-form');
const googleButton = document.getElementById('google-login');
const tabButtons = document.querySelectorAll('[data-auth-tab]');
const panels = document.querySelectorAll('[data-auth-panel]');

function showStatus(message, type = 'info') {
  statusBox.textContent = message;
  statusBox.className = `auth-status auth-status-${type}`;
  statusBox.hidden = false;
}

function setBusy(form, busy) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = busy;
  button.dataset.originalText ||= button.textContent;
  button.textContent = busy ? '请稍候…' : button.dataset.originalText;
}

function activatePanel(name) {
  tabButtons.forEach((button) => {
    const active = button.dataset.authTab === name;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.authPanel !== name;
  });
  statusBox.hidden = true;
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => activatePanel(button.dataset.authTab));
});

if (!isSupabaseConfigured()) {
  showStatus('Supabase 尚未配置。请先填写 js/supabase-config.js。', 'error');
  document.querySelectorAll('form button, #google-login').forEach((button) => {
    button.disabled = true;
  });
} else {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.replace('dashboard.html');
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!supabase) return;
  setBusy(loginForm, true);

  const formData = new FormData(loginForm);
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email').trim(),
    password: formData.get('password')
  });

  setBusy(loginForm, false);
  if (error) {
    showStatus(error.message, 'error');
    return;
  }
  window.location.replace('dashboard.html');
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!supabase) return;
  const formData = new FormData(registerForm);
  const password = formData.get('password');
  const confirmation = formData.get('password_confirmation');

  if (password !== confirmation) {
    showStatus('两次输入的密码不一致。', 'error');
    return;
  }

  setBusy(registerForm, true);
  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email').trim(),
    password,
    options: {
      data: {
        full_name: formData.get('full_name').trim()
      },
      emailRedirectTo: new URL('dashboard.html', window.location.href).href
    }
  });
  setBusy(registerForm, false);

  if (error) {
    showStatus(error.message, 'error');
    return;
  }

  if (data.session) {
    window.location.replace('dashboard.html');
    return;
  }

  registerForm.reset();
  showStatus('注册成功。请打开邮箱确认账号，然后返回登录。', 'success');
});

resetForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!supabase) return;
  setBusy(resetForm, true);
  const formData = new FormData(resetForm);
  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get('email').trim(),
    { redirectTo: new URL('dashboard.html?mode=recovery', window.location.href).href }
  );
  setBusy(resetForm, false);

  if (error) {
    showStatus(error.message, 'error');
    return;
  }

  resetForm.reset();
  showStatus('密码重置邮件已发送，请检查收件箱。', 'success');
});

googleButton.addEventListener('click', async () => {
  if (!supabase) return;
  googleButton.disabled = true;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: new URL('dashboard.html', window.location.href).href
    }
  });

  if (error) {
    googleButton.disabled = false;
    showStatus(error.message, 'error');
  }
});
