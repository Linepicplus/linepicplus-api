# 📦 Gestion des Produits - Admin Panel

Ce document décrit les fonctionnalités de gestion des produits dans le panel d'administration.

## 🌟 Fonctionnalités

### 1. **Liste des Produits** (`/admin/products`)

Page principale affichant tous les produits avec :
- Image miniature
- ID du produit
- Nom
- Prix
- Bouton d'action "Voir"

#### ➕ Créer un nouveau produit

Cliquez sur le bouton **"➕ Nouveau produit"** en haut de la page pour ouvrir le formulaire de création.

**Champs obligatoires :**
- Nom du produit
- Prix (ex: 29.99)
- Prix régulier (ex: 39.99)

**Champs optionnels :**
- SKU (référence produit)
- Description
- Images (format JSON)
- Attributs (format JSON)

**Format des images :**
```json
[
  {
    "src": "https://example.com/image1.jpg",
    "id": 1,
    "name": "Image principale",
    "alt": "Description de l'image"
  }
]
```

**Format des attributs :**
```json
[
  {
    "id": 1,
    "name": "Size",
    "options": ["S", "M", "L", "XL"],
    "position": 0,
    "visible": true,
    "variation": true,
    "is_visible": 1,
    "is_variation": 1,
    "is_taxonomy": 0,
    "value": ""
  },
  {
    "id": 2,
    "name": "Color",
    "options": ["Noir", "Blanc", "Bleu"],
    "position": 1,
    "visible": true,
    "variation": true,
    "is_visible": 1,
    "is_variation": 1,
    "is_taxonomy": 0,
    "value": ""
  }
]
```

### 2. **Détails du Produit** (`/admin/products/:id`)

Page affichant toutes les informations d'un produit :
- Informations générales (ID, nom, prix, SKU)
- Description complète
- Galerie d'images
- Attributs (taille, couleur, etc.)

#### ✏️ Modifier un produit

1. Cliquez sur le bouton **"✏️ Modifier le produit"**
2. Modifiez les champs souhaités
3. Les images et attributs peuvent être édités en JSON
4. Cliquez sur **"💾 Enregistrer"** pour sauvegarder
5. Ou **"❌ Annuler"** pour annuler les modifications

#### 🗑️ Supprimer un produit

1. Cliquez sur le bouton **"🗑️ Supprimer"**
2. Confirmez la suppression
3. Vous serez redirigé vers la liste des produits

## 🔌 API Endpoints

### Créer un produit
```http
POST /admin/api/products
Content-Type: application/json

{
  "name": "T-shirt Premium",
  "price": "29.99",
  "regular_price": "39.99",
  "sku": "TSH-001",
  "description": "Un super t-shirt",
  "images": [...],
  "attributes": [...]
}
```

### Modifier un produit
```http
PUT /admin/api/products/:id
Content-Type: application/json

{
  "name": "T-shirt Premium (Édition 2024)",
  "price": "34.99",
  ...
}
```

### Supprimer un produit
```http
DELETE /admin/api/products/:id
```

### Obtenir un produit
```http
GET /admin/api/products/:id
```

### Lister les produits
```http
GET /admin/api/products?page=1&per_page=20&search=shirt
```

## 🛡️ Sécurité

Toutes les routes d'administration nécessitent une authentification admin via cookie de session.

## 💡 Conseils

1. **Images** : Utilisez des URLs absolues pour les images (ex: hébergées sur un CDN)
2. **Prix** : Format décimal avec point (ex: `29.99` au lieu de `29,99`)
3. **JSON** : Vérifiez que vos JSON sont valides avant de sauvegarder (la validation côté client vous préviendra)
4. **SKU** : Utilisez des références uniques pour faciliter la gestion du stock

## 🚀 Prochaines améliorations possibles

- [ ] Upload d'images directement depuis l'interface
- [ ] Éditeur WYSIWYG pour les descriptions
- [ ] Gestion des catégories
- [ ] Gestion du stock
- [ ] Import/Export CSV
- [ ] Duplication de produits
- [ ] Recherche et filtres avancés

---

**Documentation mise à jour le :** $(date)

