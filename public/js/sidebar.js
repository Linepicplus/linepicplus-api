/**
 * Sidebar Component
 * Reusable sidebar for admin panel
 */

function renderSidebar(currentPage) {
  const sidebarHTML = `
    <div class="sidebar">
      <div class="sidebar-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <img src="/logo.png" alt="Linepicplus" style="height: 32px; width: auto;">
          <h2 style="margin: 0;">Linepicplus</h2>
        </div>
        <p class="sidebar-subtitle">Admin Panel</p>
      </div>
      
      <nav class="sidebar-nav">
        <a href="/admin" class="${currentPage === 'dashboard' ? 'active' : ''}">
          <span class="icon">📊</span> Dashboard
        </a>
        <a href="/admin/orders" class="${currentPage === 'orders' ? 'active' : ''}">
          <span class="icon">🛒</span> Commandes
        </a>
        <a href="/admin/products" class="${currentPage === 'products' ? 'active' : ''}">
          <span class="icon">👕</span> Produits
        </a>
        <a href="/admin/coupons" class="${currentPage === 'coupons' ? 'active' : ''}">
          <span class="icon">🎟️</span> Codes Promo
        </a>
        <a href="/admin/uploads" class="${currentPage === 'uploads' ? 'active' : ''}">
          <span class="icon">📁</span> Fichiers
        </a>
      </nav>
      
      <div class="sidebar-footer">
        <div id="admin-info"></div>
        <button id="logout-btn" class="btn-logout">
          <span class="icon">🚪</span> Déconnexion
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('sidebar-container').innerHTML = sidebarHTML;
  loadAdminInfo();
  
  // Add event listener for logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

async function loadAdminInfo() {
  try {
    const res = await fetch('/admin/me');
    if (res.ok) {
      const admin = await res.json();
      document.getElementById('admin-info').innerHTML = `
        <div class="admin-profile">
          <div class="admin-avatar">${admin.name.charAt(0).toUpperCase()}</div>
          <div class="admin-details">
            <div class="admin-name">${admin.name}</div>
            <div class="admin-role">${admin.role}</div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading admin info:', error);
  }
}

async function logout() {
  try {
    await fetch('/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

// Check auth on page load
async function checkAuth() {
  try {
    const res = await fetch('/admin/me');
    if (!res.ok) {
      window.location.href = '/admin/login';
    }
  } catch (error) {
    window.location.href = '/admin/login';
  }
}

// Expose functions that are called from other JS files
window.checkAuth = checkAuth;
window.renderSidebar = renderSidebar;

