/**
 * Order Detail Page Script
 */

checkAuth();
renderSidebar('orders');

const orderId = window.location.pathname.split('/').pop();
loadOrder();

async function loadOrder() {
  try {
    const res = await fetch(`/admin/api/orders/${orderId}`);
    const order = await res.json();
    
    document.getElementById('order-id').textContent = `#${order.id.substr(0, 8)}`;
    
    const html = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card">
          <h3 style="margin-bottom: 1rem;">📋 Informations</h3>
          <p><strong>Statut:</strong> <span class="badge badge-${order.status}">${getStatusLabel(order.status)}</span></p>
          <p><strong>Total:</strong> ${order.total} €</p>
          <p><strong>Paiement:</strong> ${order.payment_method_title}</p>
          <p><strong>Date:</strong> ${new Date(order.date_created).toLocaleString('fr-FR')}</p>
        </div>
        
        <div class="card">
          <h3 style="margin-bottom: 1rem;">📧 Facturation</h3>
          <p><strong>${order.billing.first_name} ${order.billing.last_name}</strong></p>
          <p>${order.billing.email}</p>
          <p>${order.billing.phone}</p>
          <p>${order.billing.address_1}</p>
          <p>${order.billing.city}, ${order.billing.postcode}</p>
        </div>
        
        <div class="card">
          <h3 style="margin-bottom: 1rem;">📦 Livraison</h3>
          <p><strong>${order.shipping.first_name} ${order.shipping.last_name}</strong></p>
          <p>${order.shipping.address_1}</p>
          <p>${order.shipping.city}, ${order.shipping.postcode}</p>
        </div>
      </div>
      
      <div class="card">
        <h3 style="margin-bottom: 1rem;">🛍️ Produits</h3>
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.line_items.map(item => `
              <tr>
                <td>${item.name || 'Produit #' + item.product_id}</td>
                <td>${item.quantity}</td>
                <td>${(parseFloat(item.total) / item.quantity).toFixed(2)} €</td>
                <td>${item.total} €</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="card">
        <h3 style="margin-bottom: 1rem;">⚙️ Changer le statut</h3>
        <select id="status-select" class="form-input" style="max-width: 300px;">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>En attente</option>
          <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>En cours</option>
          <option value="on-hold" ${order.status === 'on-hold' ? 'selected' : ''}>En attente</option>
          <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Terminée</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Annulée</option>
        </select>
        <button onclick="updateStatus()" class="btn btn-primary" style="margin-left: 1rem;">Mettre à jour</button>
      </div>
    `;
    
    document.getElementById('order-content').innerHTML = html;
  } catch (error) {
    console.error('Error loading order:', error);
  }
}

async function updateStatus() {
  const status = document.getElementById('status-select').value;
  try {
    await fetch(`/admin/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    alert('Statut mis à jour!');
    loadOrder();
  } catch (error) {
    alert('Erreur lors de la mise à jour');
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

