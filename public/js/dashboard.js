/**
 * Dashboard Page Script
 */

checkAuth();
renderSidebar('dashboard');
loadStats();
loadRecentOrders();

async function loadStats() {
  try {
    const res = await fetch('/admin/api/stats');
    const stats = await res.json();
    
    document.getElementById('total-orders').textContent = stats.totalOrders;
    document.getElementById('total-products').textContent = stats.totalProducts;
    document.getElementById('total-coupons').textContent = stats.totalCoupons;
    document.getElementById('total-revenue').textContent = stats.totalRevenue + ' €';
    
    const statusDiv = document.getElementById('orders-by-status');
    statusDiv.innerHTML = Object.entries(stats.ordersByStatus)
      .map(([status, count]) => `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
          <span>${getStatusLabel(status)}</span>
          <strong>${count}</strong>
        </div>
      `).join('');
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadRecentOrders() {
  try {
    const res = await fetch('/admin/api/orders?per_page=5');
    const data = await res.json();
    
    const html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${data.orders.map(order => `
            <tr>
              <td><a href="/admin/orders/${order.id}">${order.id.substr(0, 8)}...</a></td>
              <td>${order.billing.first_name} ${order.billing.last_name}</td>
              <td>${order.total} €</td>
              <td><span class="badge badge-${order.status}">${getStatusLabel(order.status)}</span></td>
              <td>${new Date(order.date_created).toLocaleDateString('fr-FR')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    document.getElementById('recent-orders').innerHTML = html;
  } catch (error) {
    console.error('Error loading recent orders:', error);
  }
}

function getStatusLabel(status) {
  const labels = {
    'pending': 'En attente',
    'processing': 'En cours',
    'completed': 'Terminée',
    'cancelled': 'Annulée',
    'on-hold': 'En attente',
    'refunded': 'Remboursée',
    'failed': 'Échouée'
  };
  return labels[status] || status;
}

