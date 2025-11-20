# Linepicplus API

API REST Node.js/TypeScript pour l'e-commerce de cadres photo personnalisés Linepicplus.

## 🚀 Fonctionnalités

- ✅ Gestion des produits (liste, recherche, filtres)
- ✅ Gestion des commandes (création, mise à jour, suivi)
- ✅ Gestion des codes promo/coupons
- ✅ Upload de fichiers/images
- ✅ Paiements Stripe (Payment Intents)
- ✅ Base de données flexible (File Storage ou MongoDB)
- ✅ Documentation Swagger/OpenAPI
- ✅ Compatible avec la structure WooCommerce
- ✅ CORS configuré pour les applications frontend
- ✅ TypeScript strict mode

## 📋 Prérequis

- Node.js >= 18.x
- npm ou yarn
- Compte Stripe (pour les paiements)

## 🔧 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd linepicplus-api

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp env.example .env

# Configurer les variables d'environnement
nano .env
```

## ⚙️ Configuration

Éditez le fichier `.env` avec vos propres valeurs :

```env
# Server
PORT=3000
HOST=localhost
NODE_ENV=development

# Database
DB_TYPE=filedb
FILE_DB_PATH=./data

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## 🚦 Démarrage

### Développement

```bash
npm run dev
```

### Production

```bash
# Build
npm run build

# Start
npm start
```

## 📚 Documentation API

Une fois le serveur démarré, accédez à la documentation Swagger :

```
http://localhost:3000/api-docs
```

## 🛣️ Routes API

### Base URLs

- **Linepicplus API**: `/wp-json/linepicplus/v1`
- **Payments API**: `/wp-json/linepicplus-payments/v1`

### Endpoints principaux

#### Products

- `GET /wp-json/linepicplus/v1/products` - Liste des produits
- `GET /wp-json/linepicplus/v1/product?id={id}` - Détails d'un produit

#### Orders

- `POST /wp-json/linepicplus/v1/orders` - Créer une commande
- `POST /wp-json/linepicplus/v1/order-billing-shipping?order-id={id}` - Mettre à jour les adresses
- `POST /wp-json/linepicplus/v1/order-coupon?order-id={id}` - Appliquer un code promo
- `GET /wp-json/linepicplus/v1/track-orders?order-id={ids}` - Suivre des commandes

#### Upload

- `POST /wp-json/linepicplus/v1/upload?time={timestamp}&fileid={id}` - Upload de fichier

#### Payments

- `POST /wp-json/linepicplus-payments/v1/create-intent?amount={amount}&description={desc}` - Créer un Payment Intent
- `POST /wp-json/linepicplus-payments/v1/confirm-intent?intent-id={id}` - Confirmer un paiement

#### Health

- `GET /wp-json/linepicplus/v1/health` - Santé de l'API

## 📦 Structure du projet

```
linepicplus-api/
├── src/
│   ├── config/           # Configuration (Swagger, etc.)
│   ├── interfaces/       # Interfaces de base de données
│   │   ├── i-database.ts
│   │   ├── i-filedb.ts
│   │   └── i-mongodb.ts
│   ├── middleware/       # Middlewares Express
│   ├── models/           # Modèles TypeScript
│   │   ├── product.model.ts
│   │   ├── order.model.ts
│   │   ├── coupon.model.ts
│   │   ├── payment.model.ts
│   │   └── upload.model.ts
│   ├── routes/           # Routes API
│   │   ├── products.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── upload.routes.ts
│   │   ├── payments.routes.ts
│   │   └── health.routes.ts
│   ├── services/         # Services (logique métier)
│   │   ├── database.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── coupon.service.ts
│   │   ├── payment.service.ts
│   │   └── upload.service.ts
│   ├── app.ts           # Application Express
│   └── server.ts        # Point d'entrée
├── data/                # Base de données (fichiers JSON)
├── uploads/             # Fichiers uploadés
├── old-plugins/         # Anciens plugins WordPress (référence)
├── package.json
├── tsconfig.json
├── nodemon.json
├── .eslintrc.json
└── README.md
```

## 🗄️ Base de données

### File Storage (par défaut)

Le mode File Storage utilise des fichiers JSON pour stocker les données. Parfait pour le développement et les petits déploiements.

Les données sont stockées dans le dossier `./data/` :
- `products.json`
- `orders.json`
- `coupons.json`
- `uploads.json`
- `payment_intents.json`

### MongoDB (à venir)

Pour utiliser MongoDB, configurez `.env` :

```env
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/linepicplus
```

L'implémentation MongoDB est préparée dans `src/interfaces/i-mongodb.ts` et peut être complétée selon vos besoins.

## 🧪 Tests

```bash
npm test
```

## 🔐 Sécurité

- CORS configuré
- Helmet pour les headers de sécurité
- Validation des uploads (taille, type MIME)
- Paiements sécurisés via Stripe

## 📝 Exemples d'utilisation

### Créer un produit

```bash
curl -X POST http://localhost:3000/wp-json/linepicplus/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cadre 20x30cm",
    "price": "29.99",
    "regular_price": "29.99",
    "description": "Cadre photo 20x30cm en bois",
    "status": "publish"
  }'
```

### Créer une commande

```bash
curl -X POST http://localhost:3000/wp-json/linepicplus/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "billing": {
      "first_name": "Jean",
      "last_name": "Dupont",
      "email": "jean@example.com",
      "phone": "0612345678",
      "address_1": "123 Rue de Paris",
      "city": "Paris",
      "postcode": "75001",
      "country": "FRANCE"
    },
    "shipping": {
      "first_name": "Jean",
      "last_name": "Dupont",
      "address_1": "123 Rue de Paris",
      "city": "Paris",
      "postcode": "75001",
      "country": "FRANCE"
    },
    "line_items": [
      {
        "product_id": 1,
        "quantity": 1
      }
    ]
  }'
```

### Créer un Payment Intent

```bash
curl -X POST "http://localhost:3000/wp-json/linepicplus-payments/v1/create-intent?amount=29.99&description=Order%2012345"
```

## 🛠️ Scripts disponibles

- `npm run dev` - Démarre le serveur en mode développement avec auto-reload
- `npm run build` - Compile TypeScript vers JavaScript
- `npm start` - Démarre le serveur en production
- `npm run lint` - Vérifie le code avec ESLint
- `npm test` - Lance les tests

## 🌐 Déploiement

### Variables d'environnement en production

Assurez-vous de configurer les variables suivantes :

```env
NODE_ENV=production
PORT=3000
DB_TYPE=mongodb
MONGODB_URI=mongodb://your-production-mongodb
STRIPE_SECRET_KEY=sk_live_your_stripe_key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Avec Docker (exemple)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📄 Licence

MIT

## 👤 Auteur

Jeremy Guyet

## 🔗 Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Swagger/OpenAPI](https://swagger.io/)

## 🆘 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.

---

**Note**: Cette API remplace les anciens plugins WordPress présents dans le dossier `old-plugins/`. Les routes et la structure des données sont compatibles pour faciliter la migration.

