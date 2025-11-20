# 🚀 Démarrage Rapide - Linepicplus API

Guide pour démarrer en 5 minutes !

## 📦 Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier .env
cp env.example .env

# 3. Éditer le fichier .env (optionnel pour commencer)
nano .env
```

## 🎯 Configuration minimale

Pour démarrer rapidement en développement, seul `.env` est nécessaire :

```env
# Copier ces lignes dans votre .env
NODE_ENV=development
PORT=3000
HOST=localhost
DB_TYPE=filedb
FILE_DB_PATH=./data
UPLOAD_PATH=./uploads
CORS_ORIGIN=*

# Stripe (optionnel au début)
# STRIPE_SECRET_KEY=sk_test_your_key
```

## ▶️ Lancer le serveur

```bash
npm run dev
```

Vous devriez voir :

```
✨ Linepicplus API is running!
🌍 Server:        http://localhost:3000
📚 API Docs:      http://localhost:3000/api-docs
```

## 🌱 Ajouter des données de test

```bash
npm run seed
```

Cela crée :
- 3 produits exemple
- 2 codes promo exemple

## ✅ Tester l'API

### Via le navigateur

Ouvrez http://localhost:3000/api-docs pour voir la documentation Swagger interactive.

### Via curl

```bash
# Health check
curl http://localhost:3000/wp-json/linepicplus/v1/health

# Liste des produits
curl http://localhost:3000/wp-json/linepicplus/v1/products

# Détails d'un produit
curl "http://localhost:3000/wp-json/linepicplus/v1/product?id=<ID_DU_PRODUIT>"
```

### Via Postman

Importez la collection depuis : http://localhost:3000/api-docs.json

## 🎨 Frontend

Pour connecter votre application frontend :

```typescript
// Configuration
const API_BASE_URL = 'http://localhost:3000';
const LINEPICPLUS_API = `${API_BASE_URL}/wp-json/linepicplus/v1`;
const PAYMENTS_API = `${API_BASE_URL}/wp-json/linepicplus-payments/v1`;

// Exemple : Récupérer les produits
const response = await fetch(`${LINEPICPLUS_API}/products?page=1&per_page=10`);
const data = await response.json();
console.log(data.body); // Array de produits
```

## 🔧 Activer Stripe

1. Créez un compte sur [stripe.com](https://stripe.com)
2. Récupérez votre clé de test
3. Ajoutez-la dans `.env` :

```env
STRIPE_SECRET_KEY=sk_test_51...
```

4. Redémarrez le serveur

Vous pouvez maintenant créer des Payment Intents :

```bash
curl -X POST "http://localhost:3000/wp-json/linepicplus-payments/v1/create-intent?amount=29.99&description=Test"
```

## 📱 Tester une commande complète

### 1. Créer une commande

```bash
curl -X POST http://localhost:3000/wp-json/linepicplus/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "billing": {
      "first_name": "Test",
      "last_name": "User",
      "email": "test@example.com",
      "phone": "0612345678",
      "address_1": "123 Rue Test",
      "city": "Paris",
      "postcode": "75001",
      "country": "FRANCE",
      "state": ""
    },
    "shipping": {
      "first_name": "Test",
      "last_name": "User",
      "address_1": "123 Rue Test",
      "city": "Paris",
      "postcode": "75001",
      "country": "FRANCE",
      "state": ""
    },
    "line_items": [
      {
        "product_id": 1,
        "quantity": 1
      }
    ]
  }'
```

Notez l'`id` de la commande retournée.

### 2. Appliquer un code promo (optionnel)

```bash
curl -X POST "http://localhost:3000/wp-json/linepicplus/v1/order-coupon?order-id=<ORDER_ID>" \
  -H "Content-Type: application/json" \
  -d '{
    "coupon_lines": [
      {
        "code": "WELCOME10"
      }
    ]
  }'
```

### 3. Créer un Payment Intent

```bash
curl -X POST "http://localhost:3000/wp-json/linepicplus-payments/v1/create-intent?amount=29.99&description=Order%20<ORDER_ID>"
```

### 4. Suivre la commande

```bash
curl "http://localhost:3000/wp-json/linepicplus/v1/track-orders?order-id=<ORDER_ID>"
```

## 📸 Tester l'upload d'image

```bash
curl -X POST "http://localhost:3000/wp-json/linepicplus/v1/upload?time=1700000000&fileid=0" \
  -F "file=@/path/to/your/image.jpg"
```

## 🐳 Avec Docker

```bash
# Build
npm run docker:build

# Run
npm run docker:run

# Stop
npm run docker:stop
```

## 🔍 Voir les données

Les données sont stockées dans le dossier `./data/` :

```bash
# Produits
cat data/products.json

# Commandes
cat data/orders.json

# Coupons
cat data/coupons.json
```

## 📚 Documentation complète

- [README.md](./README.md) - Documentation complète
- [MIGRATION.md](./MIGRATION.md) - Guide de migration depuis WordPress
- [LIST-API-CALLS.md](./LIST-API-CALLS.md) - Liste détaillée des appels API

## ❓ Problèmes courants

### Port déjà utilisé

```bash
# Changer le port dans .env
PORT=3001
```

### Permission denied sur uploads/

```bash
chmod -R 755 uploads/
```

### Erreur "Database not initialized"

Vérifiez que le dossier `data/` existe et est accessible :

```bash
mkdir -p data
chmod 755 data
```

## 🎉 C'est tout !

Vous êtes prêt à développer avec l'API Linepicplus ! 

Pour aller plus loin, consultez :
- La documentation Swagger : http://localhost:3000/api-docs
- Le README complet : [README.md](./README.md)

Bon développement ! 🚀

