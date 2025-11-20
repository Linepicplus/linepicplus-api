# ✅ Checklist de Configuration - Linepicplus API

Utilisez cette checklist pour vous assurer que tout est correctement configuré.

## 📦 Installation de base

- [ ] Node.js installé (version >= 18.x)
  ```bash
  node --version
  ```

- [ ] npm ou yarn installé
  ```bash
  npm --version
  ```

- [ ] Dépendances installées
  ```bash
  npm install
  ```

- [ ] Dossiers nécessaires créés
  ```bash
  mkdir -p data uploads tmp
  ```

## ⚙️ Configuration

- [ ] Fichier `.env` créé
  ```bash
  cp env.example .env
  ```

- [ ] Variables d'environnement configurées dans `.env` :
  - [ ] `PORT` défini (ex: 3000)
  - [ ] `HOST` défini (ex: localhost)
  - [ ] `NODE_ENV` défini (development ou production)
  - [ ] `DB_TYPE` défini (filedb ou mongodb)
  - [ ] `FILE_DB_PATH` défini (ex: ./data)
  - [ ] `UPLOAD_PATH` défini (ex: ./uploads)
  - [ ] `CORS_ORIGIN` défini (ex: * pour dev)

- [ ] Stripe configuré (si paiements activés)
  - [ ] `STRIPE_SECRET_KEY` défini
  - [ ] `STRIPE_PUBLISHABLE_KEY` défini
  - [ ] Clés testées sur [Stripe Dashboard](https://dashboard.stripe.com)

- [ ] MongoDB configuré (si DB_TYPE=mongodb)
  - [ ] `MONGODB_URI` défini
  - [ ] Connexion testée
  ```bash
  mongosh <MONGODB_URI>
  ```

## 🏗️ Build & Compilation

- [ ] TypeScript compile sans erreurs
  ```bash
  npm run build
  ```

- [ ] Pas d'erreurs de lint
  ```bash
  npm run lint
  ```

## 🚀 Démarrage

- [ ] Le serveur démarre en mode développement
  ```bash
  npm run dev
  ```

- [ ] Le serveur affiche le message de démarrage
  ```
  ✨ Linepicplus API is running!
  ```

- [ ] Le port est accessible
  ```bash
  curl http://localhost:3000
  ```

## 🧪 Tests de base

- [ ] Health check fonctionne
  ```bash
  curl http://localhost:3000/wp-json/linepicplus/v1/health
  ```
  Doit retourner `{"status":"ok",...}`

- [ ] Documentation Swagger accessible
  ```
  Ouvrir: http://localhost:3000/api-docs
  ```

- [ ] Base de données connectée
  ```
  Vérifier dans les logs: "✅ Database connected"
  ```

## 🌱 Données de test

- [ ] Script de seed exécuté avec succès
  ```bash
  npm run seed
  ```

- [ ] Produits créés
  ```bash
  curl http://localhost:3000/wp-json/linepicplus/v1/products
  ```
  Doit retourner 3 produits

- [ ] Coupons créés
  ```bash
  cat data/coupons.json
  ```
  Doit contenir WELCOME10 et NOEL2024

## 🔌 Tests API

### Products

- [ ] Liste des produits
  ```bash
  curl http://localhost:3000/wp-json/linepicplus/v1/products
  ```

- [ ] Recherche de produits
  ```bash
  curl "http://localhost:3000/wp-json/linepicplus/v1/products?search=cadre"
  ```

- [ ] Filtres fonctionnent (catégorie, prix, featured)
  ```bash
  curl "http://localhost:3000/wp-json/linepicplus/v1/products?featured=1"
  ```

### Orders

- [ ] Création de commande
  ```bash
  curl -X POST http://localhost:3000/wp-json/linepicplus/v1/orders \
    -H "Content-Type: application/json" \
    -d @test-order.json
  ```

- [ ] Mise à jour d'adresse
  ```bash
  curl -X POST "http://localhost:3000/wp-json/linepicplus/v1/order-billing-shipping?order-id=<ID>"
  ```

- [ ] Application de coupon
  ```bash
  curl -X POST "http://localhost:3000/wp-json/linepicplus/v1/order-coupon?order-id=<ID>" \
    -H "Content-Type: application/json" \
    -d '{"coupon_lines":[{"code":"WELCOME10"}]}'
  ```

- [ ] Suivi de commande
  ```bash
  curl "http://localhost:3000/wp-json/linepicplus/v1/track-orders?order-id=<ID>"
  ```

### Upload

- [ ] Upload de fichier
  ```bash
  curl -X POST "http://localhost:3000/wp-json/linepicplus/v1/upload?time=1700000000&fileid=0" \
    -F "file=@test-image.jpg"
  ```

- [ ] Fichier accessible dans ./uploads/
  ```bash
  ls -la uploads/
  ```

### Payments (si Stripe configuré)

- [ ] Création de Payment Intent
  ```bash
  curl -X POST "http://localhost:3000/wp-json/linepicplus-payments/v1/create-intent?amount=29.99&description=Test"
  ```

- [ ] Confirmation de Payment Intent
  ```bash
  curl -X POST "http://localhost:3000/wp-json/linepicplus-payments/v1/confirm-intent?intent-id=<ID>"
  ```

## 🔒 Sécurité

- [ ] CORS configuré correctement
  ```bash
  curl -H "Origin: http://example.com" \
       -H "Access-Control-Request-Method: POST" \
       -X OPTIONS http://localhost:3000/wp-json/linepicplus/v1/products
  ```

- [ ] Headers de sécurité présents (Helmet)
  ```bash
  curl -I http://localhost:3000
  ```
  Doit contenir: X-Content-Type-Options, X-Frame-Options, etc.

- [ ] Limite de taille de fichier fonctionne
  ```bash
  # Essayer d'upload un fichier > MAX_FILE_SIZE
  # Doit retourner 413 Payload Too Large
  ```

- [ ] Validation des types MIME pour uploads
  ```bash
  # Essayer d'upload un fichier non-image
  # Doit être rejeté
  ```

## 📊 Performance

- [ ] Temps de réponse acceptable (< 100ms en local)
  ```bash
  time curl http://localhost:3000/wp-json/linepicplus/v1/products
  ```

- [ ] Pas de fuites mémoire
  ```bash
  # Lancer des requêtes en boucle et surveiller la mémoire
  watch -n 1 'ps aux | grep node'
  ```

- [ ] Compression activée
  ```bash
  curl -H "Accept-Encoding: gzip" -I http://localhost:3000/wp-json/linepicplus/v1/products
  ```
  Doit contenir: Content-Encoding: gzip

## 🐳 Docker (optionnel)

- [ ] Image Docker build correctement
  ```bash
  npm run docker:build
  ```

- [ ] Container démarre
  ```bash
  npm run docker:run
  ```

- [ ] API accessible depuis le container
  ```bash
  curl http://localhost:3000/wp-json/linepicplus/v1/health
  ```

- [ ] Volumes montés correctement
  ```bash
  docker-compose exec api ls -la /app/data
  ```

## 📱 Frontend Integration

- [ ] Frontend peut se connecter à l'API
- [ ] CORS autorise le domaine frontend
- [ ] Toutes les routes attendues fonctionnent
- [ ] Stripe fonctionne depuis le frontend
- [ ] Upload d'images fonctionne depuis le frontend

## 🚢 Production

- [ ] Variables d'environnement production définies
  - [ ] `NODE_ENV=production`
  - [ ] `STRIPE_SECRET_KEY` avec clé live (sk_live_...)
  - [ ] `CORS_ORIGIN` limité aux domaines autorisés
  - [ ] `MONGODB_URI` pointe vers production (si MongoDB)

- [ ] Base de données production configurée
- [ ] SSL/HTTPS configuré (reverse proxy)
- [ ] Logs configurés
- [ ] Monitoring en place
- [ ] Backup automatique configuré

## 📝 Documentation

- [ ] README.md lu et compris
- [ ] QUICKSTART.md suivi
- [ ] MIGRATION.md consulté (si migration depuis WordPress)
- [ ] LIST-API-CALLS.md consulté
- [ ] Swagger documenté et à jour

## ✅ Prêt pour la production !

Si tous les points sont cochés, votre API est prête ! 🎉

## 🆘 En cas de problème

1. Consultez les logs du serveur
2. Vérifiez la documentation : [README.md](./README.md)
3. Relisez le guide de démarrage : [QUICKSTART.md](./QUICKSTART.md)
4. Vérifiez les issues GitHub
5. Contactez le support

---

**Dernière mise à jour** : Novembre 2024

