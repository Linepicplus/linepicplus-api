/**
 * Products List Page Script
 */

checkAuth();
renderSidebar('products');
loadProducts();

async function loadProducts() {
  try {
    const res = await fetch('/admin/api/products');
    const data = await res.json();
    
    const tbody = document.getElementById('products-table');
    tbody.innerHTML = data.data.map(product => `
      <tr>
        <td><img src="${product.images[0] || ''}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price} €</td>
        <td>
          <a href="/admin/products/${product.id}" class="btn btn-secondary btn-sm">Voir</a>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

