/**
 * Product Detail Page Script
 */

checkAuth();
renderSidebar('products');

const productId = window.location.pathname.split('/').pop();
loadProduct();

async function loadProduct() {
  try {
    const res = await fetch(`/admin/api/products/${productId}`);
    const product = await res.json();
    
    document.getElementById('product-name').textContent = product.name;
    
    const html = `
      <div class="card">
        <h3 style="margin-bottom: 1rem;">📝 Informations</h3>
        <p><strong>ID:</strong> ${product.id}</p>
        <p><strong>Nom:</strong> ${product.name}</p>
        <p><strong>Prix:</strong> ${product.price} €</p>
        <p><strong>Prix régulier:</strong> ${product.regular_price} €</p>
        <p><strong>SKU:</strong> ${product.sku || 'N/A'}</p>
      </div>
      
      <div class="card">
        <h3 style="margin-bottom: 1rem;">📝 Description</h3>
        <div>${product.description}</div>
      </div>
      
      <div class="card">
        <h3 style="margin-bottom: 1rem;">🎨 Images</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">
          ${product.images.map(img => `
            <img src="${img.src}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
          `).join('')}
        </div>
      </div>
      
      ${product.attributes && product.attributes.length > 0 ? `
      <div class="card">
        <h3 style="margin-bottom: 1rem;">⚙️ Attributs</h3>
        ${product.attributes.map(attr => `
          <div style="margin-bottom: 1rem;">
            <strong>${attr.name}:</strong> ${attr.options.join(', ')}
          </div>
        `).join('')}
      </div>
      ` : ''}
    `;
    
    document.getElementById('product-content').innerHTML = html;
  } catch (error) {
    console.error('Error loading product:', error);
  }
}

