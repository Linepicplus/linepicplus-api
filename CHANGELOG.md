# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2024-11-20

### ✨ Ajouté

#### Infrastructure
- Architecture Node.js/TypeScript complète avec Express
- Configuration TypeScript strict mode
- Configuration ESLint pour le code quality
- Configuration Nodemon pour le développement
- Support Docker avec Dockerfile et docker-compose
- Scripts npm pour dev, build, start, seed, lint, test

#### Base de données
- Interface générique `IDatabase` pour abstraction DB
- Implémentation File Storage (JSON) pour développement
- Préparation MongoDB avec interfaces vides
- Service DatabaseService avec factory pattern
- Support des opérations CRUD complètes
- Support pagination et filtres

#### Modèles
- `Product` - Produits avec images, catégories, prix
- `Order` - Commandes avec billing, shipping, line_items
- `Coupon` - Codes promo avec validation
- `Upload` - Métadonnées des fichiers uploadés
- `Payment` - Payment Intents Stripe

#### Services
- `ProductService` - Gestion des produits
- `OrderService` - Gestion des commandes
- `CouponService` - Gestion et validation des coupons
- `UploadService` - Gestion des uploads de fichiers
- `PaymentService` - Intégration Stripe

#### Routes API
- `GET /wp-json/linepicplus/v1/products` - Liste des produits avec pagination
- `GET /wp-json/linepicplus/v1/product` - Détails d'un produit
- `POST /wp-json/linepicplus/v1/orders` - Création de commande
- `POST /wp-json/linepicplus/v1/order-billing-shipping` - Mise à jour adresses
- `POST /wp-json/linepicplus/v1/order-coupon` - Application de coupon
- `GET /wp-json/linepicplus/v1/track-orders` - Suivi de commandes
- `POST /wp-json/linepicplus/v1/upload` - Upload de fichiers
- `POST /wp-json/linepicplus-payments/v1/create-intent` - Créer Payment Intent
- `POST /wp-json/linepicplus-payments/v1/confirm-intent` - Confirmer paiement
- `GET /wp-json/linepicplus/v1/health` - Health check

#### Middlewares
- CORS configuré pour cross-origin
- Helmet pour la sécurité (headers)
- Compression pour optimisation
- Logger personnalisé pour les requêtes
- Error handler global
- 404 handler

#### Documentation
- Swagger/OpenAPI 3.0 avec interface UI
- README.md complet avec exemples
- QUICKSTART.md pour démarrage rapide
- MIGRATION.md pour migration WordPress
- CHECKLIST.md pour validation
- CHANGELOG.md pour suivi des versions
- Documentation inline avec JSDoc

#### Scripts & Outils
- Script de seed pour données de test
- Fichiers env.example et .env.development
- Configuration Docker complète
- .gitignore et .dockerignore

#### Sécurité
- CORS configurable
- Helmet pour headers sécurisés
- Validation des uploads (type, taille)
- Variables d'environnement pour secrets
- Paiements sécurisés via Stripe

#### Compatibilité
- Compatible structure WooCommerce
- Mêmes endpoints que plugins WordPress
- Migration transparente possible
- Backward compatibility préservée

### 🔧 Modifié

Rien (version initiale)

### 🗑️ Supprimé

Rien (version initiale)

### 🐛 Corrigé

Rien (version initiale)

### 🔒 Sécurité

Rien (version initiale)

---

## [Unreleased]

### À venir

#### Fonctionnalités prévues
- [ ] Implémentation MongoDB complète
- [ ] Authentification JWT
- [ ] Rate limiting
- [ ] Cache Redis
- [ ] Websockets pour notifications temps réel
- [ ] Envoi d'emails (confirmation, tracking)
- [ ] Génération de factures PDF
- [ ] Analytics et statistiques
- [ ] Admin dashboard
- [ ] Multi-langue i18n
- [ ] Tests unitaires et d'intégration
- [ ] CI/CD pipeline
- [ ] Monitoring et alertes
- [ ] Backup automatique
- [ ] Migration automatique depuis WordPress
- [ ] Support S3/Cloudinary pour uploads
- [ ] GraphQL API (optionnel)

#### Améliorations techniques
- [ ] Optimisation des performances
- [ ] Mise en cache intelligente
- [ ] Compression d'images automatique
- [ ] Pagination cursor-based
- [ ] Recherche full-text avancée
- [ ] Logging structuré (Winston/Pino)
- [ ] Health checks avancés
- [ ] Métriques Prometheus
- [ ] Documentation OpenAPI complète

---

## Guide de versioning

### Version format: MAJOR.MINOR.PATCH

- **MAJOR** : Changements incompatibles de l'API
- **MINOR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs compatibles

### Types de changements

- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements de fonctionnalités existantes
- **Déprécié** : Fonctionnalités qui seront supprimées
- **Supprimé** : Fonctionnalités supprimées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Corrections de vulnérabilités

---

**Maintenu par** : Jeremy Guyet  
**Licence** : MIT

