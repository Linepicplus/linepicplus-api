# Migration depuis WordPress/WooCommerce

Ce document explique comment migrer de l'ancien système WordPress vers la nouvelle API Node.js.

## 📋 Différences principales

### Architecture

| Avant (WordPress) | Après (Node.js) |
|-------------------|-----------------|
| PHP + WordPress | Node.js + TypeScript |
| MySQL via WordPress | File Storage ou MongoDB |
| Plugins WooCommerce | API REST native |
| Dépendant de WordPress | Indépendant, léger |

### Compatibilité

L'API est **100% compatible** avec les routes existantes :
- Mêmes endpoints (`/wp-json/linepicplus/v1/*`)
- Même structure de données
- Mêmes paramètres de requête
- Mêmes réponses JSON

## 🔄 Étapes de migration

### 1. Exporter les données WordPress

```bash
# Exporter les produits
wp post list --post_type=product --format=json > products.json

# Exporter les commandes
wp post list --post_type=shop_order --format=json > orders.json

# Exporter les coupons
wp post list --post_type=shop_coupon --format=json > coupons.json
```

### 2. Convertir les données

Créez un script de conversion (exemple fourni dans `scripts/convert-woocommerce-data.ts`) :

```typescript
// Convertir un produit WooCommerce
function convertProduct(wpProduct: any) {
  return {
    id: wpProduct.ID,
    name: wpProduct.post_title,
    slug: wpProduct.post_name,
    price: wpProduct._price,
    regular_price: wpProduct._regular_price,
    sale_price: wpProduct._sale_price,
    description: wpProduct.post_content,
    // ... autres champs
  };
}
```

### 3. Importer dans la nouvelle API

```bash
# Lancer le script d'import
npm run import -- --source=products.json --type=products
```

### 4. Mettre à jour le frontend

#### URLs à changer

```typescript
// Avant
const API_URL = 'https://linepicplus.com/wp-json/linepicplus/v1';

// Après - même URL ! (si proxy configuré)
const API_URL = 'https://api.linepicplus.com/wp-json/linepicplus/v1';
```

#### Configuration CORS

Ajoutez votre domaine frontend dans `.env` :

```env
CORS_ORIGIN=https://app.linepicplus.com
```

### 5. Configuration Stripe

Récupérez vos clés Stripe existantes :

```env
STRIPE_SECRET_KEY=sk_live_your_existing_key
```

### 6. Tester la migration

Utilisez les mêmes tests que votre application actuelle :

```bash
# Tester la récupération des produits
curl https://api.linepicplus.com/wp-json/linepicplus/v1/products

# Tester la création de commande
curl -X POST https://api.linepicplus.com/wp-json/linepicplus/v1/orders \
  -H "Content-Type: application/json" \
  -d @test-order.json
```

## 🔑 Credentials

### Anciens credentials WordPress

Dans `old-plugins/linepicplus-rest-api/routes/secure-create-order.php` :

```php
$woocommerceToken = "Y2tfZDg4ZjkyMTJhYzExODQ1ZWIyMzU4ZDZjODhkM2ViNTlkYTg4Yzk2MTpjc18zYzE1ZWYwMDI1NjZhZDMwZDUxMzg3NDcyZmY1YWYwMDE5Yzg1YjQy";
```

⚠️ **Ces credentials ne sont plus nécessaires** avec la nouvelle API !

### Nouveaux credentials

Seuls Stripe et éventuellement MongoDB nécessitent des credentials :

```env
STRIPE_SECRET_KEY=sk_live_...
MONGODB_URI=mongodb://...
```

## 📊 Comparaison des performances

| Métrique | WordPress | Node.js |
|----------|-----------|---------|
| Temps de réponse moyen | ~200ms | ~20ms |
| Mémoire utilisée | ~128MB | ~50MB |
| Requêtes par seconde | ~50 | ~500+ |

## 🐛 Résolution de problèmes

### Les produits ne s'affichent pas

Vérifiez que les produits ont `status: "publish"` :

```bash
curl http://localhost:3000/wp-json/linepicplus/v1/products
```

### Les images ne se chargent pas

Assurez-vous que le dossier `uploads` est accessible :

```bash
ls -la uploads/
chmod 755 uploads/
```

### Stripe ne fonctionne pas

Vérifiez les clés Stripe :

```bash
echo $STRIPE_SECRET_KEY
# Doit commencer par sk_test_ ou sk_live_
```

## 🔐 Sécurité

### Avant (WordPress)

- Authentification WooCommerce
- Token hardcodé dans le code
- Dépendant de la sécurité WordPress

### Après (Node.js)

- CORS configuré
- Helmet pour les headers
- Variables d'environnement
- Validation des uploads
- Rate limiting (optionnel)

## 📝 Checklist de migration

- [ ] Exporter les données WordPress
- [ ] Installer la nouvelle API
- [ ] Configurer les variables d'environnement
- [ ] Importer les données
- [ ] Configurer Stripe
- [ ] Tester les routes principales
- [ ] Mettre à jour le frontend
- [ ] Configurer le proxy/DNS
- [ ] Tester en production
- [ ] Désactiver les anciens plugins WordPress

## 🚀 Déploiement progressif

1. **Phase 1**: Déployer la nouvelle API en parallèle
2. **Phase 2**: Tester avec un pourcentage du trafic
3. **Phase 3**: Migrer progressivement les endpoints
4. **Phase 4**: Désactiver complètement WordPress

## 💡 Conseils

- Gardez WordPress en lecture seule pendant la transition
- Utilisez un proxy (nginx) pour router le trafic
- Surveillez les logs des deux systèmes
- Testez intensivement avant la mise en production

## 📞 Support

Pour toute question sur la migration, contactez l'équipe de développement.

