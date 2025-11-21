/**
 * Products List Page Script
 */

checkAuth();
renderSidebar('products');
loadProducts();

let showCreateForm = false;
let pendingImageFiles = []; // Store image files before product creation

// Wait for DOM to be ready, then add event listeners
setTimeout(() => {
  const createBtn = document.getElementById('create-product-btn');
  if (createBtn) {
    createBtn.addEventListener('click', toggleCreateForm);
  }
  
  const submitBtn = document.getElementById('submit-create-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', createProduct);
  }
  
  const cancelBtn = document.getElementById('cancel-create-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      pendingImageFiles = []; // Clear pending image files
      toggleCreateForm();
    });
  }
  
  // Handle image upload for new product
  const newImageUpload = document.getElementById('new-image-upload');
  if (newImageUpload) {
    newImageUpload.addEventListener('change', handleNewImageUpload);
  }
  
  // Prevent form submission
  const form = document.getElementById('create-product-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      createProduct();
    });
  }
}, 100);

async function handleNewImageUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  const previewDiv = document.getElementById('new-images-preview');
  
  // Store files and show preview
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    pendingImageFiles.push(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgDiv = document.createElement('div');
      imgDiv.style.position = 'relative';
      imgDiv.innerHTML = `
        <img src="${e.target.result}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;">
        <button type="button" class="btn btn-danger btn-sm" data-remove-pending="${pendingImageFiles.length - 1}" style="position: absolute; top: 4px; right: 4px; padding: 0.25rem 0.5rem;">✕</button>
      `;
      previewDiv.appendChild(imgDiv);
      
      // Add event listener for remove button
      imgDiv.querySelector('[data-remove-pending]').addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-remove-pending'));
        pendingImageFiles.splice(index, 1);
        imgDiv.remove();
      });
    };
    reader.readAsDataURL(file);
  }
  
  event.target.value = ''; // Reset file input
}

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

function toggleCreateForm() {
  showCreateForm = !showCreateForm;
  const createFormDiv = document.getElementById('create-form-container');
  
  if (showCreateForm) {
    createFormDiv.style.display = 'block';
    createFormDiv.scrollIntoView({ behavior: 'smooth' });
  } else {
    createFormDiv.style.display = 'none';
  }
}

async function createProduct() {
  try {
    const name = document.getElementById('new-name').value;
    const price = document.getElementById('new-price').value;
    const sku = document.getElementById('new-sku').value;
    const description = document.getElementById('new-description').value;
    
    if (!name || !price) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    let attributes = [];
    
    const attributesText = document.getElementById('new-attributes').value.trim();
    if (attributesText) {
      try {
        attributes = JSON.parse(attributesText);
      } catch (e) {
        alert('❌ Erreur dans le format JSON des attributs');
        return;
      }
    }
    
    // Step 1: Create product without images
    const response = await fetch('/admin/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        price,
        regular_price: price, // Same as price (HT)
        sku,
        description,
        images: [], // Empty for now
        attributes,
      }),
    });
    
    if (!response.ok) {
      alert('❌ Erreur lors de la création du produit');
      return;
    }
    
    const createdProduct = await response.json();
    const productId = createdProduct.id;
    
    // Step 2: Upload images with the real product ID
    if (pendingImageFiles.length > 0) {
      const progressDiv = document.getElementById('new-upload-progress');
      const progressBar = document.getElementById('new-progress-bar');
      progressDiv.style.display = 'block';
      
      const uploadedImages = [];
      
      for (let i = 0; i < pendingImageFiles.length; i++) {
        const file = pendingImageFiles[i];
        const formData = new FormData();
        formData.append('image', file);
        
        try {
          const uploadResponse = await fetch(`/admin/api/products/${productId}/upload-image`, {
            method: 'POST',
            body: formData,
          });
          
          if (uploadResponse.ok) {
            const data = await uploadResponse.json();
            uploadedImages.push(data.image);
            
            // Update progress
            const progress = ((i + 1) / pendingImageFiles.length) * 100;
            progressBar.style.width = progress + '%';
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
      
      // Step 3: Update product with uploaded images
      if (uploadedImages.length > 0) {
        await fetch(`/admin/api/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...createdProduct,
            images: uploadedImages,
          }),
        });
      }
      
      progressDiv.style.display = 'none';
      progressBar.style.width = '0%';
    }
    
    // Success!
    alert('✅ Produit créé avec succès!');
    pendingImageFiles = []; // Clear pending image files
    toggleCreateForm();
    // Reset form
    document.getElementById('create-product-form').reset();
    document.getElementById('new-images-preview').innerHTML = '';
    loadProducts();
  } catch (error) {
    console.error('Error creating product:', error);
    alert('❌ Erreur lors de la création du produit');
  }
}

