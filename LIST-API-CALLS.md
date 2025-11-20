# Liste complète des appels API - Linepicplus

## Base URLs

- **linepicplusRestApiEndpoint**: `/wp-json/linepicplus/v1`
- **linepicplusPaymentRestApiEndpoint**: `/wp-json/linepicplus-payments/v1`

---

## 📥 Routes GET

### 1. `/products`

**Endpoint**: `GET /products?page={page}&per_page={perPage}`  
**Fichier**: `linepicplus-rest-api.service.ts:53`  
**Description**: Récupération de la liste des produits avec pagination

**Query Parameters**:

| Paramètre | Type | Exemple | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Numéro de page |
| `per_page` | number | `10` | Nombre d'éléments par page |

**Response Headers**:

- `x-wp-total`: Total d'éléments
- `x-wp-totalpages`: Total de pages

**Response Body** (200 OK):

```typescript
{
  total: number,           // Total d'éléments (depuis header x-wp-total)
  totalpages: number,      // Total de pages (depuis header x-wp-totalpages)
  body: Array<{
    id: number,
    name: string,
    slug: string,
    price: string,
    regular_price: string,
    sale_price: string,
    description: string,
    short_description: string,
    images: Array<{
      id: number,
      src: string,
      name: string,
      alt: string
    }>,
    categories: Array<{
      id: number,
      name: string,
      slug: string
    }>,
    // ... autres propriétés WooCommerce
  }>
}
```

---

### 2. `/products` (recherche)

**Endpoint**: `GET /products?search={search}&page={page}&per_page={perPage}`  
**Fichier**: `linepicplus-rest-api.service.ts:63`  
**Description**: Recherche de produits

**Query Parameters**:

| Paramètre | Type | Exemple | Description |
|-----------|------|---------|-------------|
| `search` | string | `"cadre"` | Terme de recherche |
| `page` | number | `1` | Numéro de page |
| `per_page` | number | `10` | Nombre d'éléments par page |

**Response Body** (200 OK):

```typescript
{
  total: number,           // Total de résultats trouvés
  totalpages: number,      // Total de pages
  body: Array<Product>     // Même structure que GET /products
}
```

---

### 3. `/product`

**Endpoint**: `GET /product?{params}`  
**Fichier**: `linepicplus-rest-api.service.ts:74`  
**Description**: Récupération d'un produit spécifique

**Query Parameters**:

| Paramètre | Type | Exemple | Description |
|-----------|------|---------|-------------|
| `params` | any | `{ id: 123 }` | Paramètres de requête (flexible) |

**Response Body** (200 OK):

```typescript
{
  id: number,
  name: string,
  slug: string,
  price: string,
  regular_price: string,
  sale_price: string,
  description: string,
  short_description: string,
  images: Array<Object>,
  categories: Array<Object>,
  meta_data: Array<Object>,
  // ... propriétés complètes du produit WooCommerce
}
```

---

### 4. `/track-orders`

**Endpoint**: `GET /track-orders?order-id={orderIds}`  
**Fichier**: `linepicplus-rest-api.service.ts:78`  
**Description**: Suivi des commandes (peut accepter plusieurs IDs séparés par des virgules)

**Query Parameters**:

| Paramètre | Type | Exemple | Description |
|-----------|------|---------|-------------|
| `order-id` | string | `"123,456,789"` | Liste d'IDs de commandes séparés par des virgules |

**Response Body** (200 OK):

```typescript
Array<{
  id: number,              // ID de la commande
  status: string,          // Ex: "pending", "processing", "completed", "cancelled"
  tracking?: string        // Numéro de suivi (optionnel)
}>
```

**Exemple de réponse**:

```json
[
  {
    "id": 123,
    "status": "processing",
    "tracking": "LX123456789FR"
  },
  {
    "id": 456,
    "status": "completed",
    "tracking": "LX987654321FR"
  },
  {
    "id": 789,
    "status": "pending"
  }
]
```

**Statuts de commande possibles**:

- `pending` - En attente de paiement
- `processing` - En cours de traitement
- `on-hold` - En attente
- `completed` - Terminée
- `cancelled` - Annulée
- `refunded` - Remboursée
- `failed` - Échouée

---

## 📤 Routes POST

### 1. `/orders`

**Endpoint**: `POST /orders`  

**Fichiers**:

- `linepicplus-rest-api.service.ts:34`
- `delivery-address.component.ts:131`

**Description**: Création d'une nouvelle commande

**Body (JSON)**:

```typescript
{
  payment_method: string,           // Valeur par défaut: "stripe"
  payment_method_title: string,     // Valeur par défaut: "Carte de paiement (Stripe)"
  set_paid: boolean,                // Valeur par défaut: false
  billing: {
    first_name: string,             // Ex: "Jean"
    last_name: string,              // Ex: "Dupont"
    address_1: string,              // Ex: "123 Rue de la Paix"
    address_2: string,              // Ex: "Appartement 4B" (optionnel)
    city: string,                   // Ex: "Paris"
    state: string,                  // Valeur par défaut: "" (vide)
    postcode: string,               // Ex: "75001"
    country: string,                // Valeur par défaut: "FRANCE"
    email: string,                  // Ex: "jean.dupont@email.com"
    phone: string                   // Ex: "0612345678"
  },
  shipping: {
    first_name: string,             // Ex: "Jean"
    last_name: string,              // Ex: "Dupont"
    address_1: string,              // Ex: "123 Rue de la Paix"
    address_2: string,              // Ex: "Appartement 4B" (optionnel)
    city: string,                   // Ex: "Paris"
    state: string,                  // Valeur par défaut: "" (vide)
    postcode: string,               // Ex: "75001"
    country: string                 // Valeur par défaut: "FRANCE"
  },
  line_items: Array<{
    product_id: number,             // ID du produit WooCommerce
    quantity: number,               // Ex: 2
    meta_data?: Array<{             // Métadonnées optionnelles
      key: string,                  // Ex: "LINEPICPLUS_CART_KEY"
      value: any                    // Structure flexible
    }>
  }>,
  shipping_lines: Array<{
    method_id: string,              // Valeur par défaut: "lpc_nosign"
    method_title: string,           // Valeur par défaut: "Colissimo sans signature"
    total: string                   // Valeur par défaut: "0"
  }>
}
```

**Exemple complet**:

```json
{
  "payment_method": "stripe",
  "payment_method_title": "Carte de paiement (Stripe)",
  "set_paid": false,
  "billing": {
    "first_name": "Jean",
    "last_name": "Dupont",
    "address_1": "123 Rue de la Paix",
    "address_2": "Appartement 4B",
    "city": "Paris",
    "state": "",
    "postcode": "75001",
    "country": "FRANCE",
    "email": "jean.dupont@email.com",
    "phone": "0612345678"
  },
  "shipping": {
    "first_name": "Jean",
    "last_name": "Dupont",
    "address_1": "123 Rue de la Paix",
    "address_2": "Appartement 4B",
    "city": "Paris",
    "state": "",
    "postcode": "75001",
    "country": "FRANCE"
  },
  "line_items": [
    {
      "product_id": 456,
      "quantity": 1,
      "meta_data": [
        {
          "key": "LINEPICPLUS_CART_KEY",
          "value": [
            {
              "type": null,
              "name": "image",
              "label": "image",
              "value": "{\"simple\":123,\"time\":1700000000,\"fileid\":0}",
              "price": false
            }
          ]
        }
      ]
    }
  ],
  "shipping_lines": [
    {
      "method_id": "lpc_nosign",
      "method_title": "Colissimo sans signature",
      "total": "0"
    }
  ]
}
```

**Response Body** (200 OK):

```typescript
{
  id: number,                    // ID de la commande créée
  order_key: string,             // Clé unique de la commande
  status: string,                // Ex: "pending"
  currency: string,              // Ex: "EUR"
  date_created: string,          // ISO 8601
  date_modified: string,         // ISO 8601
  total: string,                 // Montant total TTC
  total_tax: string,             // Montant de la TVA
  billing: Object,               // Adresse de facturation (même structure qu'en input)
  shipping: Object,              // Adresse de livraison (même structure qu'en input)
  payment_method: string,        // Ex: "stripe"
  payment_method_title: string,  // Ex: "Carte de paiement (Stripe)"
  line_items: Array<{
    id: number,
    name: string,
    product_id: number,
    quantity: number,
    subtotal: string,
    total: string,
    // ... autres propriétés
  }>,
  shipping_lines: Array<Object>,
  // ... autres propriétés WooCommerce
}
```

**Codes à gérer**:

| Code | Description | Action |
|------|-------------|--------|
| `200` | Commande créée avec succès | Stocker `result.id` et `result.status`, rediriger vers checkout |
| `400` | Données invalides | Afficher erreur à l'utilisateur |
| `401` | Non autorisé | Vérifier authentification API |
| `500` | Erreur serveur | Réessayer ou afficher message d'erreur |

**Traitement dans le code**:

```typescript
if (result.id && result.status) {
  // Commande créée avec succès
  this.command.order.id = result.id;
  this.command.status = result.status;
  await this.storage.push('commands', this.command);
  this.router.navigate([`/checkout/${result.id}`]);
}
```

---

### 2. `/order-billing-shipping`

**Endpoint**: `POST /order-billing-shipping?order-id={orderId}`  
**Fichier**: `delivery-address.component.ts:170`  
**Description**: Mise à jour des adresses de facturation et livraison d'une commande existante

**Query Parameters**:

| Paramètre | Type | Exemple | Description |
|-----------|------|---------|-------------|
| `order-id` | number | `12345` | ID de la commande à mettre à jour |

**Body (JSON)**:

```typescript
{
  billing: {
    first_name: string,             // Ex: "Jean"
    last_name: string,              // Ex: "Dupont"
    address_1: string,              // Ex: "123 Rue de la Paix"
    address_2: string,              // Ex: "Appartement 4B" (optionnel)
    city: string,                   // Ex: "Paris"
    state: string,                  // Valeur par défaut: "" (vide)
    postcode: string,               // Ex: "75001"
    country: string,                // Valeur par défaut: "FRANCE"
    email: string,                  // Ex: "jean.dupont@email.com"
    phone: string                   // Ex: "0612345678"
  },
  shipping: {
    first_name: string,             // Ex: "Jean"
    last_name: string,              // Ex: "Dupont"
    address_1: string,              // Ex: "123 Rue de la Paix"
    address_2: string,              // Ex: "Appartement 4B" (optionnel)
    city: string,                   // Ex: "Paris"
    state: string,                  // Valeur par défaut: "" (vide)
    postcode: string,               // Ex: "75001"
    country: string                 // Valeur par défaut: "FRANCE"
  }
}
```

**Exemple complet**:

```json
{
  "billing": {
    "first_name": "Jean",
    "last_name": "Dupont",
    "address_1": "456 Avenue des Champs",
    "address_2": "",
    "city": "Lyon",
    "state": "",
    "postcode": "69001",
    "country": "FRANCE",
    "email": "jean.dupont@email.com",
    "phone": "0612345678"
  },
  "shipping": {
    "first_name": "Jean",
    "last_name": "Dupont",
    "address_1": "456 Avenue des Champs",
    "address_2": "",
    "city": "Lyon",
    "state": "",
    "postcode": "69001",
    "country": "FRANCE"
  }
}
```

**Response Body** (200 OK):

```typescript
{
  id: number,                    // ID de la commande mise à jour
  status: string,                // Statut de la commande
  billing: Object,               // Nouvelle adresse de facturation
  shipping: Object,              // Nouvelle adresse de livraison
  // ... autres propriétés de la commande
}
```

**Codes à gérer**:

| Code | Description | Action |
|------|-------------|--------|
| `200` | Mise à jour réussie | Mettre à jour le storage local, rediriger vers checkout |
| `404` | Commande non trouvée | Afficher erreur |
| `400` | Données invalides | Afficher erreur de validation |

**Traitement dans le code**:

```typescript
if (result.id && result.status) {
  // Mise à jour réussie
  this.command.order.id = result.id;
  this.command.status = result.status;
  await this.storage.upsertElementOnArray('commands', this.command, ...);
  this.router.navigate([`/checkout/${result.id}`]);
}
```

---

### 3. `/order-coupon`

**Endpoint**: `POST /order-coupon?order-id={orderId}`  
**Fichier**: `linepicplus-rest-api.service.ts:44`  
**Description**: Ajout/validation d'un code promo sur une commande

**Query Parameters**:

| Paramètre | Type | Exemple | Description |
|-----------|------|---------|-------------|
| `order-id` | number | `12345` | ID de la commande |

**Body (JSON)**:

```typescript
{
  coupon_lines: Array<{
    code: string                    // Ex: "PROMO2024"
  }>
}
```

**Exemple complet**:

```json
{
  "coupon_lines": [
    {
      "code": "PROMO2024"
    }
  ]
}
```

**Response Body** (200 OK):

```typescript
{
  id: number,                    // ID de la commande
  coupon_lines: Array<{
    id: number,
    code: string,              // Code promo appliqué
    discount: string,          // Montant de la réduction (ex: "5.00")
    discount_tax: string
  }>,
  discount_total: string,      // Réduction totale appliquée
  total: string,               // Nouveau total après réduction
  // ... autres propriétés de la commande
}
```

**Response Body** (Erreur - Code promo invalide):

```typescript
{
  code: "woocommerce_rest_invalid_coupon",
  message: string,
  data: {
    status: number
  }
}
```

**Codes à gérer**:

| Code | Description | Action |
|------|-------------|--------|
| `200` | Code promo appliqué | Mettre à jour les prix dans l'interface |
| `400` | Code promo invalide | Afficher `couponError = "Le code promo est invalide"` |
| `404` | Code promo inexistant | Afficher message d'erreur |
| `409` | Code promo déjà utilisé | Afficher `couponError = "Vous utilisez deja un code promo"` |

**Traitement dans le code**:

```typescript
this.api.updateCoupon(orderId, { coupon_lines }).subscribe(async (res) => {
  if (res.code == "woocommerce_rest_invalid_coupon") {
    this.couponError = "Le code promo est invalide";
    return;
  }
  
  if (res.id == this.command.order.id && res["coupon_lines"] != undefined) {
    // Code promo appliqué avec succès
    this.command["coupon_lines"] = res["coupon_lines"];
    this.couponDiscount = Number(res["coupon_lines"][0]["discount"]);
    // Recalculer les prix...
  }
});
```

---

### 4. `/upload`

**Endpoint**: `POST /upload?time={timestamp}&fileid={fileId}`  
**Fichier**: `cart.component.ts:123`  
**Description**: Upload d'images pour les produits personnalisés

**Query Parameters**:

| Paramètre | Type | Exemple | Description |
|-----------|------|---------|-------------|
| `time` | string | `"1700000000"` | Timestamp Unix de l'upload |
| `fileid` | number | `0` | ID unique du fichier dans le lot |

**Body (FormData)**:

```typescript
FormData {
  file: Blob                        // Image au format JPEG (base64 converti en Blob)
}
```

**Notes**:

- Content-Type: `multipart/form-data`
- L'image est convertie depuis base64 vers Blob avant l'envoi
- Le format par défaut est `image/jpeg`

**Response Body** (200 OK):

```typescript
{
  success: boolean,
  file_url?: string,           // URL du fichier uploadé (optionnel)
  file_id?: number             // ID du fichier dans WordPress (optionnel)
}
```

**Response Body** (Erreur):

```typescript
{
  error: string,               // Message d'erreur
  message?: string
}
```

**Codes à gérer**:

| Code | Description | Action |
|------|-------------|--------|
| `200` | Upload réussi | Continuer avec la création de commande |
| `400` | Fichier invalide | Afficher erreur, ne pas ajouter le produit |
| `413` | Fichier trop volumineux | Afficher erreur de taille |
| `500` | Erreur serveur | Logger l'erreur, continuer sans l'image |

**Traitement dans le code**:

```typescript
const res = await this.client.post(`${environment.linepicplusRestApiEndpoint}/upload`, formData, { params }).toPromise();

if (res.error) {
  console.log("Error when upload photo currentPhoto", this.currentPhoto, product.id);
  console.log("Error: ", res.error);
  // Continuer sans l'image
}

if (!res.error) {
  // Upload réussi, ajouter à line_items avec meta_data
  command.order.line_items.push({
    product_id: product.simple.productId,
    quantity: product.quantity,
    meta_data: [{ /* ... */ }]
  });
}
```

---

### 5. `/create-intent`

**Endpoint**:

`POST /create-intent?amount={amount}&description={description}`  

**Fichiers**:

- `checkout.component.ts:97` (Stripe standard)
- `checkout.component.ts:127` (Apple Pay)

**Description**: Création d'un Payment Intent Stripe

**Query Parameters**:

| Paramètre | Type | Exemple | Description |
|-----------|------|---------|-------------|
| `amount` | string | `"49.99"` | Montant TTC de la commande |
| `description` | string | `"Linepicplus - Command 12345"` | Description du paiement (URL encoded) |

**Body (JSON)**:

```typescript
{}  // Body vide
```

**Exemple d'URL**:

`POST /create-intent?amount=49.99&description=Linepicplus%20-%20Command%2012345`

**Response Body** (200 OK):

```typescript
{
  id: string,                       // Ex: "pi_3AbC123..."
  client_secret: string,            // Ex: "pi_3AbC123..._secret_xyz..."
  amount: number,                   // Montant en centimes (ex: 4999 pour 49.99€)
  currency: string,                 // Ex: "eur"
  status: string,                   // Ex: "requires_payment_method"
  object: "payment_intent"
}
```

**Codes à gérer**:

| Code | Description | Action |
|------|-------------|--------|
| `200` | Intent créé | Utiliser `client_secret` pour Stripe SDK |
| `400` | Paramètres invalides | Vérifier amount et description |
| `401` | Clé Stripe invalide | Vérifier configuration serveur |
| `500` | Erreur Stripe | Afficher message d'erreur, réessayer |

**Traitement dans le code**:

```typescript
const res = await this.http.post(
  `${environment.linepicplusPaymentRestApiEndpoint}/create-intent?amount=${amount}&description=${desc}`, 
  {}
).toPromise();

// Utiliser res.client_secret avec Stripe
await Stripe.createPaymentSheet({
  paymentIntentClientSecret: res.client_secret,
  merchantDisplayName: 'Linepicplus',
});
```

---

### 6. `/confirm-intent`

**Endpoint**:

`POST /confirm-intent?intent-id={intentId}`  

**Fichiers**:

- `checkout.component.ts:105` (Stripe standard)
- `checkout.component.ts:146` (Apple Pay)

**Description**: Confirmation d'un Payment Intent après paiement

**Query Parameters**:

| Paramètre | Type | Exemple | Description |
|-----------|------|---------|-------------|
| `intent-id` | string | `"pi_abc123..."` | ID du Payment Intent à confirmer |

**Body (JSON)**:

```typescript
{}  // Body vide
```

**Exemple d'URL**:

`POST /confirm-intent?intent-id=pi_abc123...`

**Response Body** (200 OK):

```typescript
{
  paymentStatus: string,            // "succeeded", "processing", "requires_payment_method", "canceled", "failed"
  id: string,                       // ID du Payment Intent
  amount: number,                   // Montant en centimes
  currency: string                  // Ex: "eur"
}
```

**Codes à gérer**:

| Code | Description | Action |
|------|-------------|--------|
| `200` avec `paymentStatus: "succeeded"` | Paiement réussi | Mettre à jour commande en "processing", rediriger |
| `200` avec autre status | Paiement non finalisé | Afficher erreur appropriée |
| `400` | Intent ID invalide | Afficher erreur |
| `404` | Intent non trouvé | Afficher erreur |
| `500` | Erreur Stripe | Afficher message d'erreur |

**Traitement dans le code**:

```typescript
const status = await this.http.post(
  `${environment.linepicplusPaymentRestApiEndpoint}/confirm-intent?intent-id=${res.id}`, 
  {}
).toPromise();

if (status.paymentStatus === 'succeeded') {
  // Paiement réussi
  this.command.status = "processing";
  await this.storage.set('commands', this.commands);
  await this.storage.set('command', undefined);
  this.router.navigate(["/order", this.command.order.id], {
    queryParams: { 'just-paid': 'true' }
  });
} else {
  // Paiement échoué
  this.isLoading = false;
  // Afficher message d'erreur
}
```

**Statuts Stripe possibles**:

- `succeeded` - Paiement réussi ✅
- `processing` - En cours de traitement
- `requires_payment_method` - Nécessite une méthode de paiement
- `requires_confirmation` - Nécessite confirmation
- `requires_action` - Nécessite action utilisateur (3D Secure)
- `canceled` - Annulé
- `failed` - Échoué ❌

---

## 📊 Résumé

### Routes par endpoint

**linepicplusRestApiEndpoint** (`/wp-json/linepicplus/v1`):

- 4 routes GET
- 4 routes POST

**linepicplusPaymentRestApiEndpoint** (`/wp-json/linepicplus-payments/v1`):

- 2 routes POST

### Total

- **GET**: 4 routes
- **POST**: 6 routes
- **Total**: 10 routes API

---

## 🔄 Flux typique d'une commande

1. **GET** `/products` - Affichage des produits
2. **POST** `/upload` - Upload des images personnalisées (si applicable)
3. **POST** `/orders` - Création de la commande
4. **POST** `/order-coupon` - Ajout d'un code promo (optionnel)
5. **POST** `/order-billing-shipping` - Mise à jour des adresses (si modification)
6. **POST** `/create-intent` - Création du Payment Intent Stripe
7. **POST** `/confirm-intent` - Confirmation du paiement
8. **GET** `/track-orders` - Suivi de la commande

---

## 📝 Notes techniques

### Authentification

- Les endpoints utilisent l'authentification WooCommerce REST API
- Les credentials sont configurés dans `environment.ts` et `environment.prod.ts`
- Les endpoints de paiement utilisent des clés Stripe côté serveur

### Gestion des erreurs

#### Erreurs communes

| Code HTTP | Signification | Action recommandée |
|-----------|---------------|-------------------|
| `400` | Bad Request - Données invalides | Valider les données côté client, afficher message d'erreur |
| `401` | Unauthorized - Authentification échouée | Vérifier les clés API |
| `403` | Forbidden - Accès refusé | Vérifier les permissions |
| `404` | Not Found - Ressource inexistante | Vérifier l'ID de la ressource |
| `409` | Conflict - Conflit (ex: code promo déjà utilisé) | Afficher message spécifique |
| `413` | Payload Too Large - Fichier trop volumineux | Compresser ou redimensionner l'image |
| `500` | Internal Server Error - Erreur serveur | Logger l'erreur, réessayer, contact support |

#### Erreurs spécifiques

- **Code promo invalide**: `{ code: "woocommerce_rest_invalid_coupon" }`
- **Upload échoué**: `{ error: string }` dans la réponse
- **Paiement échoué**: `paymentStatus !== "succeeded"`

### Formats de données

- **Dates**: ISO 8601 (`new Date().toISOString()`) → `"2024-11-20T10:30:00.000Z"`
- **Prix**: String avec 2 décimales → `"49.99"`
- **Montants Stripe**: Number en centimes → `4999` (pour 49.99€)
- **Téléphone**: String sans format spécifique → `"0612345678"`
- **Code postal**: String de 5 caractères → `"75001"`
- **IDs multiples**: String séparés par virgules → `"123,456,789"`

### Particularités

- Les réponses WooCommerce incluent systématiquement `id` et `status`
- Les images sont converties de base64 vers Blob avant upload
- Les métadonnées des produits utilisent la clé `LINEPICPLUS_CART_KEY`
- Le timestamp Unix est utilisé pour associer les uploads aux commandes
- La livraison par défaut est toujours "Colissimo sans signature" (gratuite)

### Performance et optimisation

- Les appels sont généralement utilisés avec `.pipe(take(1)).toPromise()` pour éviter les fuites mémoire
- Les commandes sont stockées localement via `StorageService` pour éviter les appels API répétés
- Les images sont uploadées séquentiellement (boucle `for await`) avec indicateur de progression
