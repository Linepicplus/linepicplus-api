# 📦 Panel d'Administration Linepicplus

Panel d'administration complet pour gérer votre boutique en ligne.

## 🚀 Démarrage

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer un compte administrateur

```bash
npm run create-admin
```

Suivez les instructions à l'écran :
- Nom de l'administrateur
- Email
- Mot de passe
- Rôle (admin ou super_admin)

### 3. Démarrer le serveur

```bash
npm run dev
```

### 4. Accéder au panel admin

Ouvrez votre navigateur sur :
```
http://localhost:3030/admin/login
```

Connectez-vous avec les identifiants créés à l'étape 2.

## 📋 Fonctionnalités

### Dashboard
- **URL**: `/admin`
- Vue d'ensemble des statistiques
- Total des commandes, produits, coupons
- Revenu total
- Répartition des commandes par statut
- Dernières commandes

### Gestion des Commandes
- **URL**: `/admin/orders`
- Liste de toutes les commandes
- Filtrage et recherche
- Voir les détails d'une commande
- Mettre à jour le statut d'une commande

**Détails d'une commande**: `/admin/orders/:id`
- Informations client (facturation, livraison)
- Produits commandés
- Codes promo appliqués
- Historique des statuts
- Modification du statut

### Gestion des Produits
- **URL**: `/admin/products`
- Liste de tous les produits
- Recherche de produits
- Créer un nouveau produit
- Modifier un produit existant
- Supprimer un produit

**Détails d'un produit**: `/admin/products/:id`
- Informations du produit
- Images
- Attributs (tailles, couleurs)
- Prix
- Édition complète

### Gestion des Codes Promo
- **URL**: `/admin/coupons`
- Liste de tous les codes promo
- Créer un nouveau code promo
- Voir l'utilisation des codes
- Supprimer un code promo

**Types de codes promo** :
- `percent` : Pourcentage de réduction
- `fixed_cart` : Montant fixe de réduction

### Gestion des Fichiers
- **URL**: `/admin/uploads`
- Liste de tous les fichiers uploadés
- Voir les images
- Supprimer des fichiers

## 🔐 Authentification

### Login
- **URL**: `/admin/login`
- Connexion par email/mot de passe
- Session de 24 heures

### Logout
- Bouton de déconnexion dans la sidebar
- Supprime la session

### Protection des routes
Toutes les routes `/admin/*` (sauf `/admin/login`) sont protégées et nécessitent une authentification.

## 🎨 Interface

### Sidebar
- Navigation principale
- Icônes pour chaque section
- Profil admin avec avatar
- Bouton de déconnexion

### Design
- Interface moderne et responsive
- Thème clair avec accents bleus
- Cartes et tableaux pour afficher les données
- Badges de statut colorés
- Formulaires intuitifs

### Responsive
- Adapté aux mobiles et tablettes
- Menu latéral qui s'adapte

## 🔧 API Admin

Toutes les routes API admin sont préfixées par `/admin/api` et nécessitent une authentification.

### Statistiques
```bash
GET /admin/api/stats
```

### Commandes
```bash
GET /admin/api/orders
GET /admin/api/orders/:id
PATCH /admin/api/orders/:id/status
```

### Produits
```bash
GET /admin/api/products
GET /admin/api/products/:id
POST /admin/api/products
PUT /admin/api/products/:id
DELETE /admin/api/products/:id
```

### Codes Promo
```bash
GET /admin/api/coupons
POST /admin/api/coupons
DELETE /admin/api/coupons/:id
```

### Fichiers
```bash
GET /admin/api/uploads
DELETE /admin/api/uploads/:id
```

## 🔑 Rôles Admin

### admin
- Accès complet au panel
- Peut gérer les commandes, produits, coupons
- Ne peut pas créer d'autres admins

### super_admin
- Tous les droits de l'admin
- Peut créer d'autres admins
- Accès aux paramètres avancés

## 💡 Conseils

### Sécurité
- Changez le mot de passe régulièrement
- Utilisez un mot de passe fort
- Ne partagez pas vos identifiants
- En production, activez HTTPS

### Performance
- Le panel utilise des requêtes AJAX pour charger les données
- Pagination automatique sur 20 éléments par page
- Les images sont optimisées

### Personnalisation
- Les styles sont dans `/public/css/admin.css`
- Les pages HTML sont dans `/public/html/admin/`
- Le JavaScript de la sidebar est dans `/public/js/sidebar.js`

## 📂 Structure des Fichiers

```
src/
├── models/
│   └── admin.model.ts           # Modèle Admin
├── services/
│   └── admin.service.ts         # Logique admin
├── middleware/
│   └── auth.middleware.ts       # Authentification
└── routes/
    ├── admin-auth.routes.ts     # Routes auth
    └── admin-api.routes.ts      # Routes API admin

public/
├── css/
│   └── admin.css                # Styles du panel
├── js/
│   └── sidebar.js               # Composant sidebar
└── html/
    └── admin/
        ├── login.html           # Page de connexion
        ├── index.html           # Dashboard
        ├── orders.html          # Liste commandes
        ├── order-detail.html    # Détail commande
        ├── products.html        # Liste produits
        ├── product-detail.html  # Détail produit
        ├── coupons.html         # Codes promo
        └── uploads.html         # Fichiers
```

## 🐛 Dépannage

### "Unauthorized" à la connexion
- Vérifiez que l'admin existe dans `data/admins.json`
- Vérifiez l'email et le mot de passe
- Recréez un admin avec `npm run create-admin`

### Cookie-parser non trouvé
```bash
npm install cookie-parser @types/cookie-parser
```

### Erreur "Admin with this email already exists"
- L'email est déjà utilisé
- Utilisez un autre email ou supprimez l'admin existant

### Page blanche au chargement
- Vérifiez la console du navigateur
- Vérifiez que le serveur est démarré
- Vérifiez les chemins des fichiers statiques

## 🎯 Prochaines Étapes

Pour continuer le développement du panel admin :

1. **Ajouter des graphiques** (Chart.js, Recharts)
2. **Système de notifications** (en temps réel)
3. **Export des données** (CSV, PDF)
4. **Gestion multi-admin** (liste, édition, suppression)
5. **Logs d'activité** (historique des actions)
6. **Paramètres de la boutique**
7. **Gestion des catégories**
8. **Système de tags**

## 🆘 Support

Pour toute question ou problème :
- Consultez la documentation de l'API : `/api-docs`
- Vérifiez les logs du serveur
- Ouvrez une issue sur GitHub

---

**Développé avec ❤️ pour Linepicplus**

