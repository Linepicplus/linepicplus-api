/**
 * Orders List Page Script
 */

checkAuth();
renderSidebar('orders');
loadOrders();

async function loadOrders() {
  try {
    const res = await fetch('/admin/api/orders');
    const data = await res.json();
    
    const tbody = document.getElementById('orders-table');
    tbody.innerHTML = data.orders.map(order => `
      <tr>
        <td><a href="/admin/orders/${order.id}">${order.id.substr(0, 8)}...</a></td>
        <td>${order.billing.first_name} ${order.billing.last_name}</td>
        <td>${order.billing.email}</td>
        <td>${order.total} €</td>
        <td><span class="badge badge-${order.status}">${getStatusLabel(order.status)}</span></td>
        <td>${new Date(order.date_created).toLocaleDateString('fr-FR')}</td>
        <td>
          <a href="/admin/orders/${order.id}" class="btn btn-secondary btn-sm">Voir</a>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading orders:', error);
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

