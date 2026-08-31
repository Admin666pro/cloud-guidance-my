/* ============================================
   Product Nav — Main Application
   Apple Design Language + Background Management
   ============================================ */

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
};

// --- State ---
let products = [];
let customCSS = '';
let customJS = '';
let customHTML = '';
let bgImageUrl = '';
let glassEnabled = true;

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
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
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

async function adminLogin(password) {
  const data = await apiRequest('/auth', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  return data;
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

  grid.innerHTML = productsToRender.map((product, idx) => `
    <div class="product-card" style="animation-delay: ${idx * 0.03}s">
      <div class="product-card-inner" onclick="window.open('${product.url || '#'}', '_blank')">
        <div class="product-icon">${product.icon || '📦'}</div>
        <h3 class="product-title">${escapeHtml(product.name)}</h3>
        <p class="product-desc">${escapeHtml(product.description || '')}</p>
        <div class="product-meta">
          ${product.category ? `<span class="product-tag">${escapeHtml(product.category)}</span>` : ''}
          <span>${product.url ? new URL(product.url).hostname : ''}</span>
        </div>
        ${product.url ? `
          <span class="product-link">
            访问官网 ${ICONS.arrowUpRight}
          </span>
        ` : ''}
      </div>
    </div>
  `).join('');
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
  return filtered;
}

// --- Escape HTML ---
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Init Main Page ---
async function initMainPage() {
  try {
    await fetchProducts();
    await fetchCustomCode();
  } catch (e) {
    console.warn('Init error:', e);
  }

  // Apply background settings
  applyBgSettings();

  // Apply custom code
  applyCustomCode();

  // Render products
  renderProducts(products);

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const activeTab = document.querySelector('.category-tab.active');
      const category = activeTab ? activeTab.dataset.category : 'all';
      renderProducts(filterProducts(searchInput.value, category));
    });
  }

  // Category tabs
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const query = searchInput ? searchInput.value : '';
      renderProducts(filterProducts(query, tab.dataset.category));
    });
  });

  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
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
  renderAdminProducts();

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

  // Init code editor
  initCodeEditor();

  // Init background settings
  initBgSettings();
}

// --- Render Admin Products ---
function renderAdminProducts() {
  const tbody = document.getElementById('admin-products-body');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:3rem;color:var(--text-tertiary)">
          暂无产品，点击上方"添加产品"按钮开始
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.icon || '📦'}</td>
      <td><strong style="color:var(--text-primary)">${escapeHtml(p.name)}</strong></td>
      <td>${escapeHtml(p.category || '-')}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(p.description || '')}</td>
      <td>
        <div class="actions">
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
        <label>分类</label>
        <input class="glass-input" id="product-category" placeholder="如：AI工具、设计资源、开发工具" />
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
        <label>分类</label>
        <input class="glass-input" id="edit-product-category" value="${escapeHtml(product.category || '')}" />
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

// --- Auto Init ---
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('products-grid')) {
    initMainPage();
  }
  if (document.getElementById('login-form')) {
    initAdminLogin();
  }
  if (document.getElementById('admin-products-body')) {
    initAdminDashboard();
  }
});