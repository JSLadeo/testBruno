# Configuration CI/CD pour Bruno

Ce document explique la configuration GitHub Actions pour les tests Bruno API.

## 🔧 Problème résolu

**Problème initial** : Le workflow exécutait `npm run test:ci` qui lançait récursivement toute la collection `bruno-collections`, incluant les tests data-driven sans leurs fichiers de données CSV/JSON, causant des erreurs.

**Solution mise en place** : Séparation des tests standards et data-driven avec gestion appropriée des dépendances.

## 📁 Structure du workflow

Le fichier `.github/workflows/brunoApiTest.yml` contient maintenant 2 jobs :

### Job 1: `api-tests` (Tests principaux)

Exécute les tests API standards sans dépendances externes :

- Tests d'authentification (`auth-api`)
- Tests utilisateurs (`users-api`)
- Tests produits (`products-api`)

### Job 2: `data-driven-tests` (Tests optionnels)

Exécute les tests data-driven avec gestion des fichiers manquants :

- Création automatique des fichiers de données si absents
- Tests CSV, JSON et scénarios
- Marqué comme `continue-on-error: true`

## 🎯 Commandes de test disponibles

### Tests CI/CD

```bash
# Test simple pour CI (auth uniquement)
npm run test:ci-only-standard

# Test complet original
npm run test:ci
```

### Tests standards locaux

```bash
# Tests par collection
npm run test:auth
npm run test:users
npm run test:products

# Tous les tests standards
npm run test
```

### Tests data-driven locaux

```bash
npm run test:data-csv      # Nécessite data/users.csv
npm run test:data-json     # Nécessite data/products.json
npm run test:scenarios     # Nécessite data/test-scenarios.json
```

## 🚀 Workflow GitHub Actions

```yaml
name: API Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  api-tests:
    name: Bruno API Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm install

      - name: Install Bruno CLI
        run: npm install -g @usebruno/cli

      - name: Run Auth API Tests
        run: npx @usebruno/cli run bruno-collections/auth-api -r --env Development --reporter-html auth-results.html

      - name: Run Users API Tests
        run: npx @usebruno/cli run bruno-collections/users-api -r --env Development --reporter-html users-results.html

      - name: Run Products API Tests
        run: npx @usebruno/cli run bruno-collections/products-api -r --env Development --reporter-html products-results.html

      - name: Upload Test Results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: api-test-results
          path: |
            *-results.html
```

## 📊 Artefacts générés

Le workflow génère plusieurs rapports HTML :

- `auth-results.html` - Tests d'authentification
- `users-results.html` - Tests utilisateurs
- `products-results.html` - Tests produits

Ces rapports sont uploadés comme artefacts et disponibles dans la section "Actions" de GitHub.

## 🔍 Résolution des problèmes

### Erreur "Cannot find module" pour les fichiers de données

**Cause** : Les tests data-driven sont exécutés sans les fichiers CSV/JSON correspondants.
**Solution** : Le job `data-driven-tests` crée automatiquement des fichiers de données de test si ils sont absents.

### Erreur "Unknown arguments" avec Bruno CLI

**Cause** : Tentative de passer plusieurs dossiers à Bruno CLI en une seule commande.
**Solution** : Exécution séparée de chaque collection de tests.

### Tests qui échouent en CI mais passent en local

**Cause** : Différences d'environnement ou de dépendances.
**Solution** :

- Vérifier que tous les fichiers nécessaires sont committés
- Tester localement avec `npm run test:ci-only-standard`
- Vérifier les logs dans GitHub Actions

## ✅ Validation locale

Avant de committer, testez localement :

```bash
# Test rapide (auth seulement)
npm run test:ci-only-standard

# Test complet local
npm run test

# Tests data-driven individuels
npm run test:data-csv
npm run test:data-json
npm run test:scenarios
```

## 🏆 Bonnes pratiques

1. **Séparation des préoccupations** : Tests standards vs data-driven
2. **Gestion des échecs** : `continue-on-error` pour les tests optionnels
3. **Artefacts** : Sauvegarde des rapports HTML pour debugging
4. **Validation locale** : Tests avant push
5. **Documentation** : Instructions claires pour l'équipe

Cette configuration assure que :

- ✅ Les tests principaux s'exécutent toujours
- ✅ Les tests data-driven ne bloquent pas la CI
- ✅ Les rapports sont disponibles pour debugging
- ✅ La maintenance est simplifiée
