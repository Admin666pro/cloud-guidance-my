/* ============================================
   Product Nav — Main Application
   Apple Design Language + Background Management
   ============================================ */

// --- 版本信息（每次功能更新后需同步更新） ---
const APP_VERSION = '1.1.0';
const APP_UPDATED = '2026-09-05';

// 更新日志：最新版本在最前，新增条目时同步维护
const APP_CHANGELOG = [
  {
    version: '1.1.0',
    date: '2026-09-05',
    title: '暗色模式 · 产品置顶 · 访问统计',
    items: [
      '新增暗色模式：支持跟随系统、右上角手动切换，后台可设置站点默认主题',
      '新增产品置顶功能：后台一键置顶，首页优先展示并显示置顶角标',
      '新增产品访问统计：详情页自动计数，首页/详情页/后台三处展示访问量',
      '后台新增统计概览看板：产品总数 / 总访问量 / Preheat 点击 / 热门产品 TOP5',
      '设置页新增数据管理：导出备份、导入恢复、重置本地数据',
      '修复本地开发时 /api/auth 404 导致登录无法降级的问题',
      '修复 Preheat 徽标样式失效问题',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-08-27',
    title: '产品详情页与后台自定义功能',
    items: [
      '产品详情页：支持图片画廊、详细介绍、访问入口，管理员可在后台编辑',
      'iOS 26 水晶玻璃质感全面改版（环境光、磨砂、渐变水晶描边、高光）',
      '后台自定义：站点信息、主题定制、分类管理、数据备份与恢复',
      'Preheat 标签点击计数（跳转 GitHub 求 Star）',
      '登录安全：SHA-256 密码哈希 + HMAC JWT 认证 + 失败限流',
    ],
  },
];

// --- SVG Icons (inline) ---
const ICONS = {
  search: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  arrowUpRight: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>`,
  lock: `<svg class="icon-svg" viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  edit: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  trash: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  plus: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  globe: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  code: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`,
  settings: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  logout: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  home: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  box: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  tag: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z"/><path d="M7 7h.01"/></svg>`,
  image: `<svg class="icon-svg" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
  pin: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="m14 4 6 6-2.5 2.5L15 10l-5 5 1.5 2.5L9 20l-5-5 2.5-2.5L9 14l5-5-2.5-2.5z"/></svg>`,
  sun: `<svg class="icon-svg icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  moon: `<svg class="icon-svg icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
};

// --- State ---
let products = [];
let customCSS = '';
let customJS = '';
let customHTML = '';
let bgImageUrl = '';
let glassEnabled = true;
let siteConfig = null;
let categories = [];
let preheatClicks = 0;

// --- Default Site Config ---
const DEFAULT_SITE_CONFIG = {
  site_name: 'Product Nav',
  logo_text: 'Product Nav',
  logo_emoji: '◆',
  hero_badge: '精选产品导航',
  hero_title: '发现优秀的产品',
  hero_subtitle: '精心收录各类优质产品与工具，帮你快速找到所需',
  footer_text: 'Product Nav. All rights reserved.',
  analytics: '',
  accent_color: '#0071e3',
  grid_columns: 4,
  default_theme: 'system',
  show_description: true,
  animations_enabled: true,
};

// --- API Config ---
const API_BASE = '/api';

// --- Background Management ---
function getBgSettings() {
  try {
    bgImageUrl = localStorage.getItem('bg_image_url') || '';
    glassEnabled = localStorage.getItem('bg_glass_enabled') !== 'false'; // default true
  } catch {
    bgImageUrl = '';
    glassEnabled = true;
  }
}

function saveBgSettings(url, glass) {
  bgImageUrl = url;
  glassEnabled = glass;
  try {
    localStorage.setItem('bg_image_url', url || '');
    localStorage.setItem('bg_glass_enabled', glass ? 'true' : 'false');
  } catch (e) {
    console.warn('Failed to save bg settings:', e);
  }
}

function applyBgSettings() {
  getBgSettings();

  // Apply background image
  if (bgImageUrl) {
    document.body.style.setProperty('--bg-image', `url(${bgImageUrl})`);
    document.body.classList.add('has-bg-image');
  } else {
    document.body.style.removeProperty('--bg-image');
    document.body.classList.remove('has-bg-image');
  }

  // Apply glass toggle
  if (!glassEnabled) {
    document.body.classList.add('no-glass');
  } else {
    document.body.classList.remove('no-glass');
  }
}

// --- Toast ---
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- Modal ---
function openModal(html) {
  let overlay = document.querySelector('.modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal">${html}</div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  } else {
    overlay.querySelector('.modal').innerHTML = html;
  }
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });
}

function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// --- API Calls ---
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    const err = new Error(body.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// --- Auth ---
function getToken() {
  return localStorage.getItem('admin_token');
}

function setToken(token) {
  localStorage.setItem('admin_token', token);
}

function clearToken() {
  localStorage.removeItem('admin_token');
}

function isLoggedIn() {
  return !!getToken();
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/admin/login.html';
  }
}

// --- Products CRUD (Public) ---
async function fetchProducts() {
  try {
    const data = await apiRequest('/products');
    products = data.products || [];
  } catch {
    try {
      products = JSON.parse(localStorage.getItem('products') || '[]');
    } catch {
      products = [];
    }
  }
  return products;
}

async function saveProducts(updatedProducts) {
  products = updatedProducts;
  localStorage.setItem('products', JSON.stringify(products));
}

// --- Admin Products CRUD ---
async function adminFetchProducts() {
  try {
    const data = await apiRequest('/products');
    products = data.products || [];
  } catch {
    products = JSON.parse(localStorage.getItem('products') || '[]');
  }
  localStorage.setItem('products', JSON.stringify(products));
  return products;
}

async function adminAddProduct(product) {
  const newProduct = {
    ...product,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
  };

  try {
    await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify({ product: newProduct }),
    });
  } catch {
    const existing = JSON.parse(localStorage.getItem('products') || '[]');
    existing.push(newProduct);
    localStorage.setItem('products', JSON.stringify(existing));
  }
  return newProduct;
}

async function adminUpdateProduct(id, updates) {
  try {
    await apiRequest(`/products?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ product: updates }),
    });
  } catch {
    const existing = JSON.parse(localStorage.getItem('products') || '[]');
    const idx = existing.findIndex(p => p.id === id);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...updates };
      localStorage.setItem('products', JSON.stringify(existing));
    }
  }
}

async function adminDeleteProduct(id) {
  try {
    await apiRequest(`/products?id=${id}`, { method: 'DELETE' });
  } catch {
    const existing = JSON.parse(localStorage.getItem('products') || '[]');
    const filtered = existing.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(filtered));
  }
}

// --- SHA-256 helpers (Web Crypto with pure-JS fallback) ---
function rotr32(n, b) { return (n >>> b) | (n << (32 - b)); }

function sha256Fallback(str) {
  // Pure JS SHA-256 (FIPS 180-4), used when crypto.subtle is unavailable.
  const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

  const utf8 = unescape(encodeURIComponent(str));
  const msg = [];
  for (let i = 0; i < utf8.length; i++) msg.push(utf8.charCodeAt(i));

  const bitLenHi = Math.floor((utf8.length * 8) / 0x100000000);
  const bitLenLo = (utf8.length * 8) >>> 0;

  msg.push(0x80);
  while (msg.length % 64 !== 56) msg.push(0);
  for (let i = 3; i >= 0; i--) msg.push((bitLenHi >>> (i * 8)) & 0xff);
  for (let i = 7; i >= 4; i--) msg.push((bitLenLo >>> ((i - 4) * 8)) & 0xff);

  const W = new Array(64);
  for (let i = 0; i < msg.length; i += 64) {
    for (let t = 0; t < 16; t++) {
      W[t] = ((msg[i + t * 4] & 0xff) << 24) | ((msg[i + t * 4 + 1] & 0xff) << 16)
        | ((msg[i + t * 4 + 2] & 0xff) << 8) | (msg[i + t * 4 + 3] & 0xff);
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rotr32(W[t - 15], 7) ^ rotr32(W[t - 15], 18) ^ (W[t - 15] >>> 3);
      const s1 = rotr32(W[t - 2], 17) ^ rotr32(W[t - 2], 19) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
    }
    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (let t = 0; t < 64; t++) {
      const S1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
      const S0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + temp1) | 0;
      d = c; c = b; b = a; a = (temp1 + temp2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }
  return H.map(n => (n >>> 0).toString(16).padStart(8, '0')).join('');
}

async function sha256(str) {
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return sha256Fallback(str);
}

async function adminLogin(password) {
  // Hash the password first before sending
  const passwordHash = await sha256(password);

  // Try Cloudflare API first
  try {
    const data = await apiRequest('/auth', {
      method: 'POST',
      body: JSON.stringify({ password: passwordHash }),
    });
    return data;
  } catch (err) {
    // 仅在后端不可达（网络错误或无此端点 404）时启用本地降级；
    // 服务器明确拒绝（401/429 等）时不降级，避免绕过服务端的校验与限流
    if (!err.status || err.status === 404) {
      const localPassword = localStorage.getItem('admin_password') || 'admin123';
      const localPasswordHash = await sha256(localPassword);
      if (passwordHash === localPasswordHash) {
        const now = Math.floor(Date.now() / 1000);
        const token = btoa(JSON.stringify({ sub: 'admin', ts: now, exp: now + 86400 }));
        return { token, success: true };
      }
    }
    throw err;
  }
}

// --- Custom Code API ---
async function fetchCustomCode() {
  try {
    const data = await apiRequest('/custom');
    if (data.css) customCSS = data.css;
    if (data.js) customJS = data.js;
    if (data.html) customHTML = data.html;
  } catch {
    customCSS = localStorage.getItem('custom_css') || '';
    customJS = localStorage.getItem('custom_js') || '';
    customHTML = localStorage.getItem('custom_html') || '';
  }
}

async function saveCustomCode(type, code) {
  try {
    await apiRequest('/custom', {
      method: 'POST',
      body: JSON.stringify({ type, code }),
    });
  } catch {
    const key = `custom_${type}`;
    localStorage.setItem(key, code);
  }
}

// --- Apply Custom Code ---
function applyCustomCode() {
  // Custom CSS
  if (customCSS) {
    let styleEl = document.getElementById('custom-css');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-css';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = customCSS;
  }

  // Custom JS
  if (customJS) {
    try {
      new Function(customJS)();
    } catch (e) {
      console.warn('Custom JS error:', e);
    }
  }

  // Custom HTML (append to body)
  if (customHTML) {
    const container = document.getElementById('custom-html-container');
    if (!container) {
      const div = document.createElement('div');
      div.id = 'custom-html-container';
      document.body.appendChild(div);
      div.innerHTML = customHTML;
    }
  }
}

// --- Site Config API ---
async function fetchConfig() {
  try {
    const data = await apiRequest('/config');
    siteConfig = { ...DEFAULT_SITE_CONFIG, ...(data.config || {}) };
    categories = Array.isArray(data.categories) ? data.categories : [];
  } catch {
    try {
      const saved = JSON.parse(localStorage.getItem('site_config') || '{}');
      siteConfig = { ...DEFAULT_SITE_CONFIG, ...saved };
    } catch {
      siteConfig = { ...DEFAULT_SITE_CONFIG };
    }
    try {
      categories = JSON.parse(localStorage.getItem('categories') || '[]');
    } catch {
      categories = [];
    }
  }
  return siteConfig;
}

async function saveConfig() {
  try {
    await apiRequest('/config', {
      method: 'POST',
      body: JSON.stringify({ config: siteConfig, categories }),
    });
  } catch {
    localStorage.setItem('site_config', JSON.stringify(siteConfig));
    localStorage.setItem('categories', JSON.stringify(categories));
  }
}

// --- Apply Site Config (brand + theme) ---
function applySiteConfig() {
  if (!siteConfig) siteConfig = { ...DEFAULT_SITE_CONFIG };

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  };

  // 站点信息
  setText('logo-icon', siteConfig.logo_emoji);
  setText('logo-text', siteConfig.logo_text || siteConfig.site_name);
  setText('hero-badge-text', siteConfig.hero_badge);
  setText('hero-title', siteConfig.hero_title);
  setText('hero-subtitle', siteConfig.hero_subtitle);
  setText('footer-text', siteConfig.footer_text);

  // 页面标题
  if (!document.getElementById('product-detail')) {
    document.title = `${siteConfig.site_name || 'Product Nav'} — 产品导航`;
  }

  // 主题：强调色
  if (siteConfig.accent_color) {
    const root = document.documentElement;
    root.style.setProperty('--accent', siteConfig.accent_color);
    root.style.setProperty('--accent-hover', siteConfig.accent_color);
    root.style.setProperty('--accent-active', siteConfig.accent_color);
    root.style.setProperty('--accent-text', siteConfig.accent_color);
  }

  // 主题：网格列数（保持移动端响应式）
  const grid = document.getElementById('products-grid');
  if (grid && siteConfig.grid_columns) {
    grid.dataset.cols = String(siteConfig.grid_columns);
  }

  // 主题：描述显示 / 动画
  document.body.classList.toggle('hide-product-desc', siteConfig.show_description === false);
  document.body.classList.toggle('no-animations', siteConfig.animations_enabled === false);

  // 统计代码
  applyAnalytics();
}

function applyAnalytics() {
  if (!siteConfig || !siteConfig.analytics) return;
  if (document.getElementById('site-analytics')) return;
  const div = document.createElement('div');
  div.id = 'site-analytics';
  div.innerHTML = siteConfig.analytics;
  document.body.appendChild(div);
}

// --- 主题（暗色模式） ---
function getThemePreference() {
  try {
    return localStorage.getItem('theme_pref') || '';
  } catch {
    return '';
  }
}

function resolveTheme() {
  const pref = getThemePreference();
  if (pref === 'light' || pref === 'dark') return pref;
  const defaultTheme = (siteConfig && siteConfig.default_theme) || 'system';
  if (defaultTheme === 'light' || defaultTheme === 'dark') return defaultTheme;
  // 跟随系统
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyTheme() {
  const theme = resolveTheme();
  document.body.classList.toggle('dark-mode', theme === 'dark');
  updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
  const dark = document.body.classList.contains('dark-mode');
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.classList.toggle('is-dark', dark);
    btn.setAttribute('aria-label', dark ? '切换到亮色模式' : '切换到暗色模式');
    btn.setAttribute('title', dark ? '切换到亮色模式' : '切换到暗色模式');
  });
}

function initThemeToggle() {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
      try {
        localStorage.setItem('theme_pref', next);
      } catch (e) { /* ignore */ }
      applyTheme();
    });
  });
}

// --- 产品访问统计 ---
let productStats = {};

async function fetchProductStats() {
  try {
    const data = await apiRequest('/stats');
    productStats = data.productClicks || {};
  } catch {
    try {
      productStats = JSON.parse(localStorage.getItem('product_clicks') || '{}');
    } catch {
      productStats = {};
    }
  }
  return productStats;
}

async function incrementProductView(productId) {
  if (!productId) return;
  // 乐观更新，即时反馈
  productStats[productId] = (productStats[productId] || 0) + 1;
  updateProductViewCount(productId);
  try {
    localStorage.setItem('product_clicks', JSON.stringify(productStats));
  } catch (e) { /* ignore */ }
  try {
    await apiRequest('/stats', { method: 'POST', body: JSON.stringify({ productId }) });
  } catch (e) { /* ignore */ }
}

function updateProductViewCount(productId) {
  const count = productStats[productId] || 0;
  document.querySelectorAll(`[data-view-for="${productId}"]`).forEach(el => {
    el.textContent = `${count} 次访问`;
  });
}

// --- Preheat 标签点击计数 ---
function updatePreheatCount() {
  const el = document.getElementById('preheat-count');
  if (el) el.textContent = `★ ${preheatClicks}`;
}

async function fetchPreheatStats() {
  try {
    const data = await apiRequest('/stats');
    preheatClicks = data.preheatClicks || 0;
  } catch {
    try {
      preheatClicks = parseInt(localStorage.getItem('preheat_clicks') || '0', 10) || 0;
    } catch {
      preheatClicks = 0;
    }
  }
  updatePreheatCount();
}

async function incrementPreheat() {
  // 乐观更新，即时反馈
  preheatClicks += 1;
  updatePreheatCount();
  try {
    localStorage.setItem('preheat_clicks', String(preheatClicks));
  } catch (e) { /* ignore */ }

  try {
    const data = await apiRequest('/stats', { method: 'POST' });
    preheatClicks = data.preheatClicks || preheatClicks;
    updatePreheatCount();
  } catch {
    // 后端不可用时保留本地计数
  }
}

// --- Render Category Tabs (from config) ---
function renderCategoryTabs() {
  const container = document.getElementById('category-tabs');
  if (!container) return;

  const tabs = [{ name: '全部', key: 'all' }];
  (categories || []).forEach(c => {
    if (c && !tabs.some(t => t.key === c)) tabs.push({ name: c, key: c });
  });

  container.innerHTML = `
    <div class="container" style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;padding:0 1.5rem">
      ${tabs.map((t, i) => `
        <button class="category-tab${i === 0 ? ' active' : ''}" data-category="${escapeHtml(t.key)}">${escapeHtml(t.name)}</button>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const searchInput = document.getElementById('search-input');
      const query = searchInput ? searchInput.value : '';
      renderProducts(filterProducts(query, tab.dataset.category));
    });
  });
}

// --- Render Products ---
function renderProducts(productsToRender, containerId = 'products-grid') {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  if (!productsToRender || productsToRender.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>暂无产品</h3>
        <p>管理员请登录后台添加产品</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = productsToRender.map((product, idx) => {
    const cover = Array.isArray(product.images) && product.images[0] ? product.images[0] : '';
    const views = productStats[product.id] || 0;
    return `
    <div class="product-card" style="animation-delay: ${idx * 0.03}s">
      <div class="product-card-inner" onclick="window.location.href='/product.html?id=${encodeURIComponent(product.id)}'">
        ${product.pinned ? `<span class="pin-badge card-pin">${ICONS.pin} 置顶</span>` : ''}
        ${cover
          ? `<div class="product-cover"><img src="${escapeHtml(cover)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.style.display='none'" /></div>`
          : `<div class="product-icon">${product.icon || '📦'}</div>`}
        <h3 class="product-title">${escapeHtml(product.name)}</h3>
        <p class="product-desc">${escapeHtml(product.description || '')}</p>
        <div class="product-meta">
          ${product.category ? `<span class="product-tag">${escapeHtml(product.category)}</span>` : ''}
          ${product.url ? `<span>${getDomain(product.url)}</span>` : ''}
          <span class="product-views" data-view-for="${escapeHtml(product.id)}">${views} 次访问</span>
        </div>
        ${product.url ? `
          <a class="product-link" href="${escapeHtml(product.url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
            访问官网 ${ICONS.arrowUpRight}
          </a>
        ` : `
          <span class="product-link">查看详情 ${ICONS.arrowUpRight}</span>
        `}
      </div>
    </div>
  `;
  }).join('');
}

// --- Filter Products ---
function filterProducts(query, category = 'all') {
  let filtered = products;
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }
  // 置顶产品优先展示，其余保持原顺序
  filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  return filtered;
}

// --- Escape HTML ---
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Get domain safely ---
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

// --- Init Main Page ---
async function initMainPage() {
  try {
    await fetchProducts();
    await fetchCustomCode();
    await fetchConfig();
    await fetchProductStats();
  } catch (e) {
    console.warn('Init error:', e);
  }

  // Apply background settings
  applyBgSettings();

  // Apply site config (brand + theme)
  applySiteConfig();

  // 应用主题（暗色模式）并初始化切换按钮
  applyTheme();
  initThemeToggle();

  // Apply custom code
  applyCustomCode();

  // Render category tabs
  renderCategoryTabs();

  // Render products
  renderProducts(products);

  // Preheat 标签：加载计数 + 点击 +1
  fetchPreheatStats();
  const preheatBadge = document.getElementById('preheat-badge');
  if (preheatBadge) {
    preheatBadge.addEventListener('click', () => incrementPreheat());
  }

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const activeTab = document.querySelector('#category-tabs .category-tab.active');
      const category = activeTab ? activeTab.dataset.category : 'all';
      renderProducts(filterProducts(searchInput.value, category));
    });
  }

  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  renderFooterVersion();
}

// --- Render Product Detail ---
function renderProductDetail(container, product) {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const detail = product.detail || '';
  const domain = product.url ? getDomain(product.url) : '';

  const gallery = images.length > 0 ? `
    <div class="detail-section">
      <h2>图片预览</h2>
      <div class="detail-thumbs">
        ${images.map((img, i) => `
          <img src="${escapeHtml(img)}" alt="${escapeHtml(product.name)} 图 ${i + 1}"
            class="${i === 0 ? 'active' : ''}"
            onclick="setDetailImage(${i})"
            onerror="this.style.display='none'" />
        `).join('')}
      </div>
    </div>
  ` : '';

  container.innerHTML = `
    <div class="detail-card glass">
      <div class="detail-hero">
        ${images.length
          ? `<img class="detail-cover" id="detail-cover" src="${escapeHtml(images[0])}" alt="${escapeHtml(product.name)}" onerror="this.parentElement.classList.add('placeholder')" />`
          : `<div class="detail-cover detail-cover-placeholder">${product.icon || '📦'}</div>`}
      </div>
      <div class="detail-body">
        <div class="detail-title-row">
          <div class="detail-icon">${product.icon || '📦'}</div>
          <div>
            <h1>${escapeHtml(product.name)}</h1>
            <div class="detail-meta">
              ${product.category ? `<span class="product-tag">${escapeHtml(product.category)}</span>` : ''}
              ${domain ? `<span class="detail-domain">${escapeHtml(domain)}</span>` : ''}
              ${product.pinned ? `<span class="pin-badge">${ICONS.pin} 置顶</span>` : ''}
              <span class="detail-views" data-view-for="${escapeHtml(product.id)}">${productStats[product.id] || 0} 次访问</span>
            </div>
          </div>
        </div>

        ${product.description ? `<p class="detail-desc">${escapeHtml(product.description)}</p>` : ''}

        ${detail ? `
          <div class="detail-section">
            <h2>详细介绍</h2>
            <div class="detail-text">${escapeHtml(detail)}</div>
          </div>
        ` : ''}

        ${gallery}

        <div class="detail-actions">
          ${product.url ? `
            <a class="glass-btn glass-btn-primary" href="${escapeHtml(product.url)}" target="_blank" rel="noopener">
              访问官网 ${ICONS.arrowUpRight}
            </a>
          ` : ''}
          <a class="glass-btn" href="/">返回首页</a>
        </div>
      </div>
    </div>
  `;
}

// --- Switch Detail Gallery Image ---
function setDetailImage(idx) {
  const main = document.getElementById('detail-cover');
  const imgs = document.querySelectorAll('.detail-thumbs img');
  if (!imgs[idx]) return;
  imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
  if (main) {
    main.src = imgs[idx].src;
    const hero = document.querySelector('.detail-hero');
    if (hero) hero.classList.remove('placeholder');
  }
}

// --- Init Product Detail Page ---
async function initProductPage() {
  const container = document.getElementById('product-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  try {
    await fetchProducts();
    await fetchCustomCode();
    await fetchConfig();
    await fetchProductStats();
  } catch (e) {
    console.warn('Init error:', e);
  }

  applyBgSettings();
  applySiteConfig();
  applyTheme();
  initThemeToggle();
  applyCustomCode();

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  renderFooterVersion();

  if (!id) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>未找到产品</h3>
        <p>缺少产品 ID 参数</p>
      </div>
    `;
    return;
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>产品不存在或已删除</h3>
        <p><a href="/" style="color:var(--accent-text);text-decoration:none">返回首页</a></p>
      </div>
    `;
    return;
  }

  const siteName = siteConfig && siteConfig.site_name ? siteConfig.site_name : 'Product Nav';
  document.title = `${product.name} — ${siteName}`;
  renderProductDetail(container, product);

  // 访问 +1（本次浏览）
  incrementProductView(product.id);
}

// --- Init Admin Login ---
async function initAdminLogin() {
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = form.querySelector('[name="password"]').value;
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = '验证中...';

    try {
      const data = await adminLogin(password);
      if (data.token) {
        setToken(data.token);
        showToast('登录成功');
        setTimeout(() => {
          window.location.href = '/admin/';
        }, 500);
      }
    } catch (err) {
      if (errorEl) errorEl.textContent = err.message || '密码错误，请重试';
      btn.disabled = false;
      btn.textContent = '登录';
    }
  });
}

// --- Init Admin Dashboard ---
async function initAdminDashboard() {
  requireAuth();
  await adminFetchProducts();
  await fetchProductStats();
  await fetchPreheatStats();
  renderAdminProducts();
  renderAdminStats();

  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const page = item.dataset.page;
      document.querySelectorAll('.admin-page').forEach(p => p.style.display = 'none');
      const target = document.getElementById(`page-${page}`);
      if (target) target.style.display = 'block';
    });
  });

  // Logout
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearToken();
      window.location.href = '/admin/login.html';
    });
  }

  // Add product button
  const addBtn = document.getElementById('btn-add-product');
  if (addBtn) {
    addBtn.addEventListener('click', showAddProductModal);
  }

  // 主题（后台跟随站点默认主题）
  applyTheme();

  // Init code editor
  initCodeEditor();

  // Init background settings
  initBgSettings();

  // Init site config page
  initConfigPage();

  // Init settings page（版本信息 + 更新日志 + 数据管理）
  initSettingsPage();
}

// --- Render Admin Products ---
function renderAdminProducts() {
  const tbody = document.getElementById('admin-products-body');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:3rem;color:var(--text-tertiary)">
          暂无产品，点击上方"添加产品"按钮开始
        </td>
      </tr>
    `;
    renderAdminStats();
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.icon || '📦'}</td>
      <td>
        ${p.pinned ? '<span class="pin-badge">置顶</span> ' : ''}
        <strong style="color:var(--text-primary)">${escapeHtml(p.name)}</strong>
      </td>
      <td>${escapeHtml(p.category || '-')}</td>
      <td><span class="stat-views">${productStats[p.id] || 0}</span></td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(p.description || '')}</td>
      <td>
        <div class="actions">
          <button class="glass-btn glass-btn-sm" onclick="pinProduct('${p.id}')" title="${p.pinned ? '取消置顶' : '置顶'}">
            ${ICONS.pin} ${p.pinned ? '取消置顶' : '置顶'}
          </button>
          <button class="glass-btn glass-btn-sm" onclick="showEditProductModal('${p.id}')" title="编辑">
            ${ICONS.edit} 编辑
          </button>
          <button class="glass-btn glass-btn-sm glass-btn-danger" onclick="deleteProduct('${p.id}')" title="删除">
            ${ICONS.trash} 删除
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  renderAdminStats();
}

// --- 置顶 / 取消置顶 ---
async function pinProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  try {
    await adminUpdateProduct(id, { pinned: !p.pinned });
    showToast(p.pinned ? '已取消置顶' : '已置顶，首页将优先展示');
    await adminFetchProducts();
    renderAdminProducts();
  } catch (err) {
    showToast('操作失败: ' + err.message, 'error');
  }
}

// --- 后台统计概览 ---
function renderAdminStats() {
  const totalEl = document.getElementById('stat-total-products');
  if (totalEl) totalEl.textContent = products.length;

  const viewsEl = document.getElementById('stat-total-views');
  if (viewsEl) {
    viewsEl.textContent = Object.values(productStats).reduce((a, b) => a + (Number(b) || 0), 0);
  }

  const preheatEl = document.getElementById('stat-preheat');
  if (preheatEl) preheatEl.textContent = preheatClicks;

  const topEl = document.getElementById('stat-top-products');
  if (topEl) {
    const sorted = products
      .map(p => ({ name: p.name, views: productStats[p.id] || 0 }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
    topEl.innerHTML = sorted.length
      ? sorted.map(p => `
        <div class="stat-top-item">
          <span class="stat-top-name">${escapeHtml(p.name)}</span>
          <span class="stat-top-views">${p.views} 次</span>
        </div>
      `).join('')
      : '<div class="stat-top-empty">暂无访问数据，产品被浏览后这里将显示热度排行</div>';
  }
}

// --- 分类下拉候选（用于产品表单） ---
function categoryDatalist() {
  const opts = (categories || []).map(c => `<option value="${escapeHtml(c)}"></option>`).join('');
  return opts ? `<datalist id="category-options">${opts}</datalist>` : '';
}

// --- Show Add Product Modal ---
function showAddProductModal() {
  openModal(`
    <div class="modal-header">
      <h2>添加产品</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>产品名称 *</label>
        <input class="glass-input" id="product-name" placeholder="输入产品名称" />
      </div>
      <div class="form-group">
        <label>产品描述</label>
        <textarea class="glass-input glass-textarea" id="product-desc" placeholder="简短描述产品" rows="2"></textarea>
      </div>
      <div class="form-group">
        <label>详细介绍</label>
        <textarea class="glass-input glass-textarea" id="product-detail" placeholder="产品的详细介绍，支持多行文本" rows="4"></textarea>
      </div>
      <div class="form-group">
        <label>图片 URL（每行一个）</label>
        <textarea class="glass-input glass-textarea" id="product-images" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" rows="3"></textarea>
        <p style="font-size:0.75rem;color:var(--text-tertiary);margin-top:0.25rem">第一张图片将显示在导航卡片和详情页顶部</p>
      </div>
      <div class="form-group">
        <label>分类</label>
        <input class="glass-input" id="product-category" placeholder="选择或输入分类" list="category-options" />
        ${categoryDatalist()}
      </div>
      <div class="form-group">
        <label>网址</label>
        <input class="glass-input" id="product-url" placeholder="https://example.com" />
      </div>
      <div class="form-group">
        <label>图标（Emoji）</label>
        <input class="glass-input" id="product-icon" placeholder="🚀" maxlength="2" style="max-width:100px" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="glass-btn" onclick="closeModal()">取消</button>
      <button class="glass-btn glass-btn-primary" onclick="confirmAddProduct()">${ICONS.plus} 添加</button>
    </div>
  `);
}

// --- Confirm Add Product ---
async function confirmAddProduct() {
  const name = document.getElementById('product-name').value.trim();
  if (!name) {
    showToast('请输入产品名称', 'error');
    return;
  }

  const product = {
    name,
    description: document.getElementById('product-desc').value.trim(),
    detail: document.getElementById('product-detail').value.trim(),
    images: (document.getElementById('product-images').value || '').split('\n').map(s => s.trim()).filter(Boolean),
    category: document.getElementById('product-category').value.trim(),
    url: document.getElementById('product-url').value.trim(),
    icon: document.getElementById('product-icon').value.trim() || '📦',
  };

  try {
    await adminAddProduct(product);
    closeModal();
    showToast('产品添加成功');
    await adminFetchProducts();
    renderAdminProducts();
  } catch (err) {
    showToast('添加失败: ' + err.message, 'error');
  }
}

// --- Show Edit Product Modal ---
function showEditProductModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  openModal(`
    <div class="modal-header">
      <h2>编辑产品</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>产品名称 *</label>
        <input class="glass-input" id="edit-product-name" value="${escapeHtml(product.name)}" />
      </div>
      <div class="form-group">
        <label>产品描述</label>
        <textarea class="glass-input glass-textarea" id="edit-product-desc" rows="2">${escapeHtml(product.description || '')}</textarea>
      </div>
      <div class="form-group">
        <label>详细介绍</label>
        <textarea class="glass-input glass-textarea" id="edit-product-detail" rows="4">${escapeHtml(product.detail || '')}</textarea>
      </div>
      <div class="form-group">
        <label>图片 URL（每行一个）</label>
        <textarea class="glass-input glass-textarea" id="edit-product-images" rows="3">${escapeHtml((product.images || []).join('\n'))}</textarea>
        <p style="font-size:0.75rem;color:var(--text-tertiary);margin-top:0.25rem">第一张图片将显示在导航卡片和详情页顶部</p>
      </div>
      <div class="form-group">
        <label>分类</label>
        <input class="glass-input" id="edit-product-category" value="${escapeHtml(product.category || '')}" list="category-options" />
        ${categoryDatalist()}
      </div>
      <div class="form-group">
        <label>网址</label>
        <input class="glass-input" id="edit-product-url" value="${escapeHtml(product.url || '')}" />
      </div>
      <div class="form-group">
        <label>图标（Emoji）</label>
        <input class="glass-input" id="edit-product-icon" value="${escapeHtml(product.icon || '📦')}" maxlength="2" style="max-width:100px" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="glass-btn" onclick="closeModal()">取消</button>
      <button class="glass-btn glass-btn-primary" onclick="confirmEditProduct('${id}')">保存修改</button>
    </div>
  `);
}

// --- Confirm Edit Product ---
async function confirmEditProduct(id) {
  const name = document.getElementById('edit-product-name').value.trim();
  if (!name) {
    showToast('请输入产品名称', 'error');
    return;
  }

  const updates = {
    name,
    description: document.getElementById('edit-product-desc').value.trim(),
    detail: document.getElementById('edit-product-detail').value.trim(),
    images: (document.getElementById('edit-product-images').value || '').split('\n').map(s => s.trim()).filter(Boolean),
    category: document.getElementById('edit-product-category').value.trim(),
    url: document.getElementById('edit-product-url').value.trim(),
    icon: document.getElementById('edit-product-icon').value.trim() || '📦',
  };

  try {
    await adminUpdateProduct(id, updates);
    closeModal();
    showToast('产品更新成功');
    await adminFetchProducts();
    renderAdminProducts();
  } catch (err) {
    showToast('更新失败: ' + err.message, 'error');
  }
}

// --- Delete Product ---
async function deleteProduct(id) {
  if (!confirm('确定要删除这个产品吗？')) return;

  try {
    await adminDeleteProduct(id);
    showToast('产品已删除');
    await adminFetchProducts();
    renderAdminProducts();
  } catch (err) {
    showToast('删除失败: ' + err.message, 'error');
  }
}

// --- Code Editor ---
function initCodeEditor() {
  const codeAreas = {
    css: document.getElementById('code-css'),
    js: document.getElementById('code-js'),
    html: document.getElementById('code-html'),
  };

  // Load saved code
  if (codeAreas.css) codeAreas.css.value = localStorage.getItem('custom_css') || '';
  if (codeAreas.js) codeAreas.js.value = localStorage.getItem('custom_js') || '';
  if (codeAreas.html) codeAreas.html.value = localStorage.getItem('custom_html') || '';

  // Tab switching
  document.querySelectorAll('.code-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.code-editor-panel').forEach(p => p.style.display = 'none');
      const target = document.getElementById(`editor-${tab.dataset.lang}`);
      if (target) target.style.display = 'block';
    });
  });

  // Save button
  const saveBtn = document.getElementById('btn-save-code');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const types = ['css', 'js', 'html'];
      for (const type of types) {
        const el = document.getElementById(`code-${type}`);
        if (el) {
          localStorage.setItem(`custom_${type}`, el.value);
          try {
            await saveCustomCode(type, el.value);
          } catch (e) {
            console.warn('Save custom code failed:', e);
          }
        }
      }
      showToast('自定义代码已保存');
    });
  }
}

// --- Background Settings (Admin) ---
function initBgSettings() {
  const urlInput = document.getElementById('bg-image-url');
  const toggleGlass = document.getElementById('toggle-glass');
  const saveBtn = document.getElementById('btn-save-bg');
  const preview = document.getElementById('bg-preview');

  if (!urlInput) return;

  // Load current settings
  getBgSettings();
  urlInput.value = bgImageUrl;
  if (toggleGlass) toggleGlass.checked = glassEnabled;
  updateBgPreview(urlInput.value);

  // Live preview on URL change
  urlInput.addEventListener('input', () => {
    updateBgPreview(urlInput.value);
  });

  // Save button
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const url = urlInput.value.trim();
      const glass = toggleGlass ? toggleGlass.checked : true;
      saveBgSettings(url, glass);
      showToast('背景设置已保存');
    });
  }
}

function updateBgPreview(url) {
  const preview = document.getElementById('bg-preview');
  if (!preview) return;

  if (url.trim()) {
    preview.style.setProperty('--bg-image-preview', `url(${url.trim()})`);
    preview.classList.add('has-image');
  } else {
    preview.style.removeProperty('--bg-image-preview');
    preview.classList.remove('has-image');
  }
}

// --- Site Config Page (Admin) ---
async function initConfigPage() {
  await fetchConfig();
  fillConfigForm();
  renderCategoryList();
  applyTheme();

  // 强调色实时预览
  const colorInput = document.getElementById('cfg-accent-color');
  const colorText = document.getElementById('cfg-accent-text');
  if (colorInput && colorText) {
    colorInput.addEventListener('input', () => {
      colorText.textContent = colorInput.value;
    });
  }

  // 保存全部设置
  const saveBtn = document.getElementById('btn-save-config');
  if (saveBtn) saveBtn.addEventListener('click', saveConfigFromForm);

  // 分类管理
  const addCatBtn = document.getElementById('btn-add-category');
  if (addCatBtn) addCatBtn.addEventListener('click', addCategory);
  const newCatInput = document.getElementById('new-category-name');
  if (newCatInput) {
    newCatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addCategory();
      }
    });
  }

  // 数据备份
  const exportBtn = document.getElementById('btn-export');
  if (exportBtn) exportBtn.addEventListener('click', exportData);
  const importBtn = document.getElementById('btn-import');
  const importFile = document.getElementById('import-file');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        await importData(file);
        e.target.value = '';
      }
    });
  }
}

function fillConfigForm() {
  const setVal = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value == null ? '' : value;
  };
  setVal('cfg-site-name', siteConfig.site_name);
  setVal('cfg-logo-text', siteConfig.logo_text);
  setVal('cfg-logo-emoji', siteConfig.logo_emoji);
  setVal('cfg-hero-badge', siteConfig.hero_badge);
  setVal('cfg-hero-title', siteConfig.hero_title);
  setVal('cfg-hero-subtitle', siteConfig.hero_subtitle);
  setVal('cfg-footer-text', siteConfig.footer_text);
  setVal('cfg-analytics', siteConfig.analytics);

  const colorInput = document.getElementById('cfg-accent-color');
  if (colorInput) colorInput.value = siteConfig.accent_color || '#0071e3';
  const colorText = document.getElementById('cfg-accent-text');
  if (colorText) colorText.textContent = colorInput ? colorInput.value : siteConfig.accent_color || '#0071e3';

  const cols = document.getElementById('cfg-grid-columns');
  if (cols) cols.value = String(siteConfig.grid_columns || 4);

  const theme = document.getElementById('cfg-default-theme');
  if (theme) theme.value = siteConfig.default_theme || 'system';

  const showDesc = document.getElementById('cfg-show-desc');
  if (showDesc) showDesc.checked = siteConfig.show_description !== false;

  const anims = document.getElementById('cfg-animations');
  if (anims) anims.checked = siteConfig.animations_enabled !== false;
}

function saveConfigFromForm() {
  const val = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };
  siteConfig.site_name = val('cfg-site-name');
  siteConfig.logo_text = val('cfg-logo-text');
  siteConfig.logo_emoji = val('cfg-logo-emoji');
  siteConfig.hero_badge = val('cfg-hero-badge');
  siteConfig.hero_title = val('cfg-hero-title');
  siteConfig.hero_subtitle = val('cfg-hero-subtitle');
  siteConfig.footer_text = val('cfg-footer-text');
  const analyticsEl = document.getElementById('cfg-analytics');
  if (analyticsEl) siteConfig.analytics = analyticsEl.value.trim();

  const colorInput = document.getElementById('cfg-accent-color');
  if (colorInput && colorInput.value) siteConfig.accent_color = colorInput.value;

  const cols = document.getElementById('cfg-grid-columns');
  if (cols) siteConfig.grid_columns = parseInt(cols.value, 10) || 4;

  const theme = document.getElementById('cfg-default-theme');
  if (theme) siteConfig.default_theme = theme.value || 'system';

  const showDesc = document.getElementById('cfg-show-desc');
  if (showDesc) siteConfig.show_description = showDesc.checked;

  const anims = document.getElementById('cfg-animations');
  if (anims) siteConfig.animations_enabled = anims.checked;

  saveConfig().then(() => {
    showToast('设置已保存');
    applySiteConfig();
    applyTheme();
  }).catch(() => {
    showToast('保存失败', 'error');
  });
}

function renderCategoryList() {
  const list = document.getElementById('category-list');
  if (!list) return;
  if (!categories.length) {
    list.innerHTML = '<div class="category-empty">暂无分类，添加后将在首页显示为筛选按钮</div>';
    return;
  }
  list.innerHTML = categories.map((c, i) => `
    <div class="category-item">
      <span class="category-item-name">${escapeHtml(c)}</span>
      <div class="actions">
        <button class="glass-btn glass-btn-sm" onclick="moveCategory(${i}, -1)" title="上移" ${i === 0 ? 'disabled' : ''}>↑</button>
        <button class="glass-btn glass-btn-sm" onclick="moveCategory(${i}, 1)" title="下移" ${i === categories.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="glass-btn glass-btn-sm glass-btn-danger" onclick="removeCategory(${i})" title="删除">删除</button>
      </div>
    </div>
  `).join('');
}

function addCategory() {
  const input = document.getElementById('new-category-name');
  if (!input) return;
  const name = input.value.trim();
  if (!name) {
    showToast('请输入分类名称', 'error');
    return;
  }
  if (categories.includes(name)) {
    showToast('该分类已存在', 'error');
    return;
  }
  categories.push(name);
  input.value = '';
  renderCategoryList();
  showToast('分类已添加，记得保存设置');
}

function moveCategory(index, dir) {
  const target = index + dir;
  if (target < 0 || target >= categories.length) return;
  const tmp = categories[index];
  categories[index] = categories[target];
  categories[target] = tmp;
  renderCategoryList();
}

function removeCategory(index) {
  if (!confirm('确定删除该分类吗？产品会保留原分类标签。')) return;
  categories.splice(index, 1);
  renderCategoryList();
  showToast('分类已删除，记得保存设置');
}

// --- 数据导出 ---
async function exportData() {
  try {
    await fetchCustomCode();
    getBgSettings();
  } catch (e) { /* ignore */ }
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    config: siteConfig,
    categories,
    products,
    custom: { css: customCSS, js: customJS, html: customHTML },
    bg: { imageUrl: bgImageUrl, glassEnabled: glassEnabled },
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `product-nav-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('数据已导出');
}

// --- 数据导入 ---
async function importData(file) {
  let data;
  try {
    data = JSON.parse(await file.text());
  } catch {
    showToast('文件格式错误', 'error');
    return;
  }
  if (!data || typeof data !== 'object' || !Array.isArray(data.products)) {
    showToast('无效的备份文件', 'error');
    return;
  }

  // 本地恢复
  products = data.products;
  localStorage.setItem('products', JSON.stringify(products));
  if (data.config && typeof data.config === 'object') {
    siteConfig = { ...DEFAULT_SITE_CONFIG, ...data.config };
    localStorage.setItem('site_config', JSON.stringify(siteConfig));
  }
  if (Array.isArray(data.categories)) {
    categories = data.categories;
    localStorage.setItem('categories', JSON.stringify(categories));
  }
  if (data.custom && typeof data.custom === 'object') {
    ['css', 'js', 'html'].forEach(t => {
      if (typeof data.custom[t] === 'string') localStorage.setItem(`custom_${t}`, data.custom[t]);
    });
  }
  if (data.bg && typeof data.bg === 'object') {
    localStorage.setItem('bg_image_url', data.bg.imageUrl || '');
    localStorage.setItem('bg_glass_enabled', data.bg.glassEnabled === false ? 'false' : 'true');
  }

  // 尽力同步后端（后端不可用或未授权时仅保留本地）
  try {
    await apiRequest('/config', { method: 'POST', body: JSON.stringify({ config: siteConfig, categories }) });
  } catch (e) { /* ignore */ }
  for (const t of ['css', 'js', 'html']) {
    try {
      await apiRequest('/custom', { method: 'POST', body: JSON.stringify({ type: t, code: localStorage.getItem(`custom_${t}`) || '' }) });
    } catch (e) { /* ignore */ }
  }
  try {
    await syncProductsToServer(products);
  } catch (e) { /* ignore */ }

  // 刷新界面
  fillConfigForm();
  renderCategoryList();
  renderAdminProducts();
  showToast('数据导入成功');
}

// --- 版本号渲染（首页/详情页 footer） ---
function renderFooterVersion() {
  const el = document.getElementById('footer-version');
  if (el) el.textContent = APP_VERSION;
}

// --- 设置页：版本信息 + 更新日志 + 数据管理 ---
function initSettingsPage() {
  // 关于卡片：版本号与更新时间
  const verEl = document.getElementById('about-version');
  if (verEl) verEl.textContent = APP_VERSION;
  const updatedEl = document.getElementById('about-updated');
  if (updatedEl) updatedEl.textContent = APP_UPDATED;

  // 更新日志
  const listEl = document.getElementById('changelog-list');
  if (listEl) {
    listEl.innerHTML = APP_CHANGELOG.map(entry => `
      <div class="changelog-entry">
        <div class="changelog-head">
          <span class="changelog-version">v${escapeHtml(entry.version)}</span>
          <span class="changelog-date">${escapeHtml(entry.date)}</span>
        </div>
        <div class="changelog-title">${escapeHtml(entry.title)}</div>
        <ul class="changelog-items">
          ${entry.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  // 数据管理：导出 / 导入 / 重置（设置页独立按钮）
  const exportBtn = document.getElementById('btn-settings-export');
  if (exportBtn) exportBtn.addEventListener('click', exportData);
  const importBtn = document.getElementById('btn-settings-import');
  const importFile = document.getElementById('import-file-settings');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        await importData(file);
        e.target.value = '';
      }
    });
  }
  const resetBtn = document.getElementById('btn-settings-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('确定要重置所有本地数据吗？此操作会清空本地存储的产品、设置与自定义代码，且不可恢复。')) return;
      ['products', 'site_config', 'categories', 'custom_css', 'custom_js', 'custom_html',
        'bg_image_url', 'bg_glass_enabled', 'theme_pref', 'product_clicks', 'preheat_clicks'].forEach(k => {
        try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
      });
      showToast('本地数据已重置');
      setTimeout(() => window.location.reload(), 600);
    });
  }
}

// --- 将目标产品列表同步到后端（增/改/删） ---
async function syncProductsToServer(targetProducts) {
  const current = (await apiRequest('/products')).products || [];
  const targetIds = new Set(targetProducts.map(p => p.id));
  for (const p of targetProducts) {
    if (current.some(c => c.id === p.id)) {
      await apiRequest(`/products?id=${p.id}`, { method: 'PUT', body: JSON.stringify({ product: p }) });
    } else {
      await apiRequest('/products', { method: 'POST', body: JSON.stringify({ product: p }) });
    }
  }
  for (const c of current) {
    if (!targetIds.has(c.id)) {
      await apiRequest(`/products?id=${c.id}`, { method: 'DELETE' });
    }
  }
}

// --- Auto Init ---
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('products-grid')) {
    initMainPage();
  }
  if (document.getElementById('product-detail')) {
    initProductPage();
  }
  if (document.getElementById('login-form')) {
    initAdminLogin();
  }
  if (document.getElementById('admin-products-body')) {
    initAdminDashboard();
  }
});