# 🔧 Configuration des Variables d'Environnement

## Fichier `.env`

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Server Configuration
NODE_ENV=development
PORT=3030
HOST=localhost

# API Configuration
# ⚠️ IMPORTANT: Doit correspondre au PORT ci-dessus
API_URL=http://localhost:3030

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Admin Configuration
ADMIN_SESSION_SECRET=change-this-secret-in-production

# Database Configuration
DB_TYPE=filedb
FILE_DB_PATH=./data

# Upload Configuration
UPLOAD_PATH=./uploads
```

## Variables Importantes

### `API_URL`
**Utilisation:** URL de base pour générer les liens d'images et autres ressources.

**Développement:**
```env
API_URL=http://localhost:3030
```

**Production:**
```env
API_URL=https://api.linepicplus.com
```

⚠️ **Important:** Cette valeur doit correspondre à l'URL réelle où votre API est accessible. Elle est utilisée pour :
- Générer les URLs complètes des images de produits
- Générer les URLs des fichiers uploadés
- Construire les liens dans les réponses API

### `PORT`
Port sur lequel le serveur écoute.
```env
PORT=3030
```

⚠️ **Important:** Si vous changez le PORT, pensez à mettre à jour API_URL également !

### `STRIPE_SECRET_KEY`
Clé secrète Stripe pour le traitement des paiements.
```env
STRIPE_SECRET_KEY=sk_test_...
```

## Vérification

Au démarrage du serveur, vous verrez :
```
🔗 API URL:       http://localhost:3030
```

Cette ligne vous confirme quelle URL est utilisée pour générer les liens.

## Exemples d'URLs Générées

Avec `API_URL=http://localhost:3030` :
```
Image produit: http://localhost:3030/uploads/products/123/image.jpg
```

Avec `API_URL=https://api.linepicplus.com` :
```
Image produit: https://api.linepicplus.com/uploads/products/123/image.jpg
```

## Déploiement

Pour la production, assurez-vous de :

1. ✅ Définir `NODE_ENV=production`
2. ✅ Utiliser une vraie clé Stripe (commençant par `sk_live_`)
3. ✅ Définir un `ADMIN_SESSION_SECRET` fort et aléatoire
4. ✅ Configurer `API_URL` avec votre nom de domaine
5. ✅ Configurer `CORS_ORIGIN` avec votre domaine frontend

## Dépannage

### Les images ont la mauvaise URL
→ Vérifiez que `API_URL` dans `.env` correspond au port et domaine de votre serveur

### Les variables ne sont pas chargées
→ Vérifiez que le fichier `.env` est à la racine du projet
→ Redémarrez le serveur après avoir modifié `.env`

### Erreur CORS
→ Configurez `CORS_ORIGIN` avec le domaine de votre frontend

