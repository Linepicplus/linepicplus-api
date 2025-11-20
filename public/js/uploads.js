/**
 * Uploads Page Script
 */

checkAuth();
renderSidebar('uploads');
loadUploads();

async function loadUploads() {
  try {
    const res = await fetch('/admin/api/uploads');
    const uploads = await res.json();
    
    const grid = document.getElementById('uploads-grid');
    grid.innerHTML = uploads.map(upload => `
      <div class="card" style="padding: 1rem;">
        <img src="${upload.url}" alt="${upload.originalName}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 0.5rem;">
        <p style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem;">${upload.originalName}</p>
        <p style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem;">${(upload.size / 1024).toFixed(2)} KB</p>
        <button onclick="deleteUpload('${upload.id}')" class="btn btn-danger btn-sm" style="width: 100%;">Supprimer</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading uploads:', error);
  }
}

async function deleteUpload(id) {
  if (!confirm('Supprimer ce fichier ?')) return;
  
  try {
    await fetch(`/admin/api/uploads/${id}`, { method: 'DELETE' });
    loadUploads();
  } catch (error) {
    alert('Erreur lors de la suppression');
  }
}

