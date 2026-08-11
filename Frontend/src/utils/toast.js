// Minimal, dependency-free toast used to notify/block on lead-lifecycle violations.
// No provider needed — it appends a self-styled element to <body> and auto-removes.
let containerEl = null;

function getContainer() {
  if (containerEl && document.body.contains(containerEl)) return containerEl;
  containerEl = document.createElement('div');
  containerEl.style.cssText =
    'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
  document.body.appendChild(containerEl);
  return containerEl;
}

export function showToast(message, type = 'info') {
  try {
    const bg = type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#334155';
    const el = document.createElement('div');
    el.textContent = message;
    el.style.cssText =
      `background:${bg};color:#fff;padding:10px 16px;border-radius:8px;font-size:14px;` +
      'font-family:inherit;box-shadow:0 4px 12px rgba(0,0,0,.15);opacity:0;' +
      'transform:translateY(-6px);transition:opacity .2s,transform .2s;max-width:360px;pointer-events:auto;';
    getContainer().appendChild(el);
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-6px)';
      setTimeout(() => el.remove(), 220);
    }, 3200);
  } catch {
    /* no-op: never let a toast break the flow */
  }
}

export default showToast;
