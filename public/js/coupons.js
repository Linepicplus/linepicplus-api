/**
 * Coupons Page Script
 */

checkAuth();
renderSidebar('coupons');
loadCoupons();

async function loadCoupons() {
  try {
    const res = await fetch('/admin/api/coupons');
    const coupons = await res.json();
    
        const tbody = document.getElementById('coupons-table');
        tbody.innerHTML = coupons.map(coupon => `
          <tr>
            <td><strong>${coupon.code}</strong></td>
            <td>${getTypeLabel(coupon.type)}</td>
            <td>${coupon.amount}${coupon.type === 'percent' ? '%' : '€'}</td>
            <td>${coupon.usage_count}</td>
            <td>${coupon.usage_limit || '∞'}</td>
            <td><span class="badge ${coupon.active ? 'badge-processing' : 'badge-cancelled'}">${coupon.active ? 'Actif' : 'Inactif'}</span></td>
            <td>
              <button class="btn btn-danger btn-sm" data-delete-coupon="${coupon.id}">Supprimer</button>
            </td>
          </tr>
        `).join('');
        
        // Add event listeners to delete buttons
        document.querySelectorAll('[data-delete-coupon]').forEach(btn => {
          btn.addEventListener('click', function() {
            deleteCoupon(this.getAttribute('data-delete-coupon'));
          });
        });
  } catch (error) {
    console.error('Error loading coupons:', error);
  }
}

async function deleteCoupon(id) {
  if (!confirm('Supprimer ce code promo ?')) return;
  
  try {
    await fetch(`/admin/api/coupons/${id}`, { method: 'DELETE' });
    loadCoupons();
  } catch (error) {
    alert('Erreur lors de la suppression');
  }
}

function getTypeLabel(type) {
  const labels = {
    'percent': 'Pourcentage',
    'fixed_cart': 'Montant fixe',
    'fixed_product': 'Produit fixe',
    'percent_product': 'Produit %'
  };
  return labels[type] || type;
}

