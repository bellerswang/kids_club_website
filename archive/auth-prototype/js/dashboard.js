import { isSupabaseConfigured, supabase } from './supabase-client.js';

const loading = document.getElementById('dashboard-loading');
const content = document.getElementById('dashboard-content');
const profileForm = document.getElementById('profile-form');
const passwordForm = document.getElementById('password-form');
const adminPanel = document.getElementById('admin-panel');
const userRows = document.getElementById('user-rows');
const statusBox = document.getElementById('dashboard-status');
const logoutButton = document.getElementById('logout-button');

let currentProfile = null;

function showStatus(message, type = 'info') {
  statusBox.textContent = message;
  statusBox.className = `auth-status auth-status-${type}`;
  statusBox.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' }).format(new Date(value)) : '—';
}

async function loadAdminUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,full_name,phone,role,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    showStatus(`无法载入用户列表：${error.message}`, 'error');
    return;
  }

  userRows.replaceChildren(...data.map((profile) => {
    const row = document.createElement('tr');
    const identityCell = document.createElement('td');
    const email = document.createElement('small');
    const phoneCell = document.createElement('td');
    const roleCell = document.createElement('td');
    const dateCell = document.createElement('td');
    const roleSelect = document.createElement('select');

    identityCell.textContent = profile.full_name || '未填写';
    email.textContent = profile.email;
    identityCell.appendChild(email);
    phoneCell.textContent = profile.phone || '—';
    dateCell.textContent = formatDate(profile.created_at);

    roleSelect.className = 'role-select';
    roleSelect.dataset.userId = profile.id;
    roleSelect.disabled = profile.id === currentProfile.id;
    ['parent', 'teacher', 'admin'].forEach((role) => {
      const option = document.createElement('option');
      option.value = role;
      option.textContent = role;
      option.selected = profile.role === role;
      roleSelect.appendChild(option);
    });

    roleCell.appendChild(roleSelect);
    row.append(identityCell, phoneCell, roleCell, dateCell);
    return row;
  }));

  userRows.querySelectorAll('.role-select').forEach((select) => {
    select.addEventListener('change', async () => {
      select.disabled = true;
      const { error } = await supabase.rpc('set_user_role', {
        target_user_id: select.dataset.userId,
        new_role: select.value
      });
      select.disabled = false;

      showStatus(
        error ? `角色更新失败：${error.message}` : '用户角色已更新。',
        error ? 'error' : 'success'
      );
    });
  });
}

async function initializeDashboard() {
  if (!isSupabaseConfigured()) {
    loading.textContent = 'Supabase 尚未配置。请先填写 js/supabase-config.js。';
    return;
  }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    window.location.replace('auth.html');
    return;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id,email,full_name,phone,role,created_at')
    .eq('id', session.user.id)
    .single();

  if (error) {
    loading.textContent = `无法读取用户资料：${error.message}`;
    return;
  }

  currentProfile = profile;
  document.getElementById('profile-email').value = profile.email || session.user.email || '';
  document.getElementById('profile-name').value = profile.full_name || '';
  document.getElementById('profile-phone').value = profile.phone || '';
  document.getElementById('profile-role').textContent = profile.role;
  document.getElementById('welcome-name').textContent = profile.full_name || profile.email;

  loading.hidden = true;
  content.hidden = false;

  if (profile.role === 'admin') {
    adminPanel.hidden = false;
    await loadAdminUsers();
  }
}

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: formData.get('full_name').trim(),
      phone: formData.get('phone').trim() || null
    })
    .eq('id', currentProfile.id);

  showStatus(
    error ? `资料保存失败：${error.message}` : '个人资料已保存。',
    error ? 'error' : 'success'
  );
});

passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(passwordForm);
  const password = formData.get('password');

  if (password !== formData.get('password_confirmation')) {
    showStatus('两次输入的新密码不一致。', 'error');
    return;
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (!error) passwordForm.reset();
  showStatus(
    error ? `密码更新失败：${error.message}` : '密码已更新。',
    error ? 'error' : 'success'
  );
});

logoutButton.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.replace('auth.html');
});

await initializeDashboard();
