import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm';

const config = window.__SUPABASE_CONFIG__ || {};
const authPanel = document.querySelector('#auth-panel');
const protectedContent = document.querySelector('#protected-content');
const sessionBar = document.querySelector('#session-bar');
const sessionLabel = document.querySelector('#session-label');
const authForm = document.querySelector('#auth-form');
const authStatus = document.querySelector('#auth-status');
const signOutButton = document.querySelector('#sign-out');

function setStatus(message, isError = true) {
  authStatus.textContent = message;
  authStatus.style.color = isError ? '#ffb8bc' : '#b8f2cf';
}

function showAuthenticated(user) {
  authPanel.hidden = true;
  protectedContent.hidden = false;
  sessionBar.hidden = false;
  sessionLabel.textContent = `已登入：${user.email || '使用者'}`;
}

function showSignedOut() {
  authPanel.hidden = false;
  protectedContent.hidden = true;
  sessionBar.hidden = true;
}

if (!config.url || config.url.includes('YOUR_PROJECT_REF') || !config.publishableKey || config.publishableKey.includes('YOUR_')) {
  setStatus('請先在 supabase-config.js 填入 Supabase URL 與 publishable key。');
} else {
  const supabase = createClient(config.url, config.publishableKey);

  async function refreshAuthState() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) showSignedOut();
    else showAuthenticated(user);
  }

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;
    setStatus('登入中……', false);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus('登入成功。', false);
    showAuthenticated(data.user);
  });

  signOutButton.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setStatus(error.message);
    else showSignedOut();
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) showAuthenticated(session.user);
    else showSignedOut();
  });

  refreshAuthState();
}
