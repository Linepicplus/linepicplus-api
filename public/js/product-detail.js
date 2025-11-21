/**
 * Product Detail Page Script
 */

checkAuth();
renderSidebar('products');

const productId = window.location.pathname.split('/').pop();
let currentProduct = null;
let isEditMode = false;

loadProduct();

async function loadProduct() {
  try {
    const res = await fetch(`/admin/api/products/${productId}`);
    currentProduct = await res.json();
    
    renderProduct();
  } catch (error) {
    console.error('Error loading product:', error);
  }
}

function renderProduct() {
  if (!currentProduct) return;
  
  document.getElementById('product-name').textContent = currentProduct.name;
  
  if (isEditMode) {
    renderEditForm();
  } else {
    renderViewMode();
  }
}

function renderViewMode() {
  const html = `
    <div style="margin-bottom: 1rem;">
      <button id="edit-btn" class="btn btn-primary">✏️ Modifier le produit</button>
      <button id="delete-btn" class="btn btn-danger" style="margin-left: 0.5rem;">🗑️ Supprimer</button>
    </div>
    
    <div class="card">
      <h3 style="margin-bottom: 1rem;">📝 Informations</h3>
      <p><strong>ID:</strong> ${currentProduct.id}</p>
      <p><strong>Nom:</strong> ${currentProduct.name}</p>
      <p><strong>Prix HT:</strong> ${currentProduct.price} €</p>
      <p><strong>SKU:</strong> ${currentProduct.sku || 'N/A'}</p>
    </div>
    
    <div class="card">
      <h3 style="margin-bottom: 1rem;">📝 Description</h3>
      <div>${currentProduct.description}</div>
    </div>
    
    <div class="card">
      <h3 style="margin-bottom: 1rem;">🎨 Images (${currentProduct.images.length})</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">
        ${currentProduct.images.length > 0 ? currentProduct.images.map(img => `
          <img src="${img.src}" alt="${currentProduct.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
        `).join('') : '<p style="color: #64748b;">Aucune image</p>'}
      </div>
    </div>
    
    ${currentProduct.attributes && currentProduct.attributes.length > 0 ? `
    <div class="card">
      <h3 style="margin-bottom: 1rem;">⚙️ Attributs</h3>
      ${currentProduct.attributes.map(attr => `
        <div style="margin-bottom: 1rem;">
          <strong>${attr.name}:</strong> ${attr.options.join(', ')}
        </div>
      `).join('')}
    </div>
    ` : ''}
  `;
  
  document.getElementById('product-content').innerHTML = html;
  
  // Add event listeners after rendering
  document.getElementById('edit-btn').addEventListener('click', toggleEditMode);
  document.getElementById('delete-btn').addEventListener('click', deleteProduct);
}

function renderEditForm() {
  const attributesJson = JSON.stringify(currentProduct.attributes || [], null, 2);
  
  const html = `
    <div class="card">
      <h3 style="margin-bottom: 1rem;">✏️ Modifier le produit</h3>
      <form id="edit-form">
        <div style="margin-bottom: 1rem;">
          <label class="form-label">Nom du produit *</label>
          <input type="text" id="name" class="form-input" value="${currentProduct.name}" required>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label class="form-label">Prix HT *</label>
            <input type="text" id="price" class="form-input" value="${currentProduct.price}" required>
          </div>
          <div>
            <label class="form-label">SKU</label>
            <input type="text" id="sku" class="form-input" value="${currentProduct.sku || ''}">
          </div>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label class="form-label">Description</label>
          <textarea id="description" class="form-input" rows="5">${currentProduct.description}</textarea>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label class="form-label">Images</label>
          <div id="images-preview" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
            ${currentProduct.images.map((img, index) => `
              <div style="position: relative;">
                <img src="${img.src}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;">
                <button type="button" class="btn btn-danger btn-sm" data-delete-image="${index}" style="position: absolute; top: 4px; right: 4px; padding: 0.25rem 0.5rem;">✕</button>
              </div>
            `).join('')}
          </div>
          <input type="file" id="image-upload" class="form-input" accept="image/*" multiple style="margin-bottom: 0.5rem;">
          <small style="color: #64748b;">Sélectionnez des images à ajouter (max 10MB par fichier)</small>
          <div id="upload-progress" style="margin-top: 0.5rem; display: none;">
            <div style="background: #e2e8f0; border-radius: 0.25rem; height: 8px; overflow: hidden;">
              <div id="progress-bar" style="background: #3b82f6; height: 100%; width: 0%; transition: width 0.3s;"></div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label class="form-label">Attributs (JSON array)</label>
          <textarea id="attributes" class="form-input" rows="8">${attributesJson}</textarea>
          <small style="color: #64748b;">Format: [{"id": 1, "name": "Size", "options": ["S", "M", "L"], ...}]</small>
        </div>
        
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" id="save-btn" class="btn btn-primary">💾 Enregistrer</button>
          <button type="button" id="cancel-btn" class="btn btn-secondary">❌ Annuler</button>
        </div>
      </form>
    </div>
  `;
  
  document.getElementById('product-content').innerHTML = html;
  
  // Add event listeners after rendering
  document.getElementById('save-btn').addEventListener('click', saveProduct);
  document.getElementById('cancel-btn').addEventListener('click', toggleEditMode);
  
  // Handle image upload
  const imageUpload = document.getElementById('image-upload');
  if (imageUpload) {
    imageUpload.addEventListener('change', handleImageUpload);
  }
  
  // Handle image deletion
  document.querySelectorAll('[data-delete-image]').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-delete-image'));
      deleteImageFromProduct(index);
    });
  });
  
  // Prevent form submission
  const form = document.getElementById('edit-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProduct();
    });
  }
}

async function handleImageUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  const progressDiv = document.getElementById('upload-progress');
  const progressBar = document.getElementById('progress-bar');
  
  progressDiv.style.display = 'block';
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`/admin/api/products/${productId}/upload-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        currentProduct.images.push(data.image);
        
        // Update progress
        const progress = ((i + 1) / files.length) * 100;
        progressBar.style.width = progress + '%';
      } else {
        alert(`❌ Erreur lors de l'upload de ${file.name}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`❌ Erreur lors de l'upload de ${file.name}`);
    }
  }
  
  // Hide progress and refresh form
  setTimeout(() => {
    progressDiv.style.display = 'none';
    progressBar.style.width = '0%';
    event.target.value = ''; // Reset file input
    renderEditForm(); // Re-render to show new images
  }, 500);
}

async function deleteImageFromProduct(index) {
  if (!confirm('⚠️ Supprimer cette image ?')) return;
  
  const image = currentProduct.images[index];
  
  try {
    const response = await fetch(`/admin/api/products/${productId}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: image.src }),
    });
    
    if (response.ok) {
      currentProduct.images.splice(index, 1);
      renderEditForm(); // Re-render to update images
    } else {
      alert('❌ Erreur lors de la suppression de l\'image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    alert('❌ Erreur lors de la suppression de l\'image');
  }
}

function toggleEditMode() {
  isEditMode = !isEditMode;
  renderProduct();
}

async function saveProduct() {
  try {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const sku = document.getElementById('sku').value;
    const description = document.getElementById('description').value;
    
    let attributes = [];
    
    try {
      attributes = JSON.parse(document.getElementById('attributes').value);
    } catch (e) {
      alert('Erreur dans le format JSON des attributs');
      return;
    }
    
    const response = await fetch(`/admin/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        price,
        regular_price: price, // Same as price (HT)
        sku,
        description,
        images: currentProduct.images, // Use images from currentProduct (already uploaded)
        attributes,
      }),
    });
    
    if (response.ok) {
      alert('✅ Produit mis à jour avec succès!');
      await loadProduct();
      isEditMode = false;
      renderProduct();
    } else {
      alert('❌ Erreur lors de la mise à jour du produit');
    }
  } catch (error) {
    console.error('Error saving product:', error);
    alert('❌ Erreur lors de la mise à jour du produit');
  }
}

async function deleteProduct() {
  if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
  
  try {
    const response = await fetch(`/admin/api/products/${productId}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      alert('✅ Produit supprimé avec succès!');
      window.location.href = '/admin/products';
    } else {
      alert('❌ Erreur lors de la suppression du produit');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('❌ Erreur lors de la suppression du produit');
  }
}

