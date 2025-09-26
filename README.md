# Bruno API Testing Project

Ce projet démontre l'utilisation complète de **Bruno** avec :

- ✅ **Variables d'environnement** multiples (Development, Staging, Production)
- ✅ **Collections organisées** (auth-api, users-api, products-api)
- ✅ **Fichiers JavaScript partagés** avec fonctions utilitaires
- ✅ **Librairies réutilisables** entre toutes les collections
- ✅ **Fonctions globales** accessibles partout

## 🏗️ Structure du projet

```
testBruno/
├── bruno.json                     # Configuration principale
├── package.json                   # Dépendances et scripts NPM
├── environments/                  # Variables d'environnement
│   ├── Development.bru           # Variables pour le dev (localhost)
│   ├── Staging.bru              # Variables pour staging
│   └── Production.bru           # Variables pour production
├── scripts/
│   └── global-setup.js          # Script global chargé partout
├── libs/                        # Librairies JavaScript partagées
│   ├── crypto-utils.js         # Utilitaires cryptographiques
│   ├── data-helpers.js         # Helpers pour données
│   ├── api-helpers.js          # Helpers pour APIs
│   └── advanced-utils.js       # Utilitaires avancés avec lodash
└── bruno-collections/          # Collections de requêtes
    ├── auth-api/              # Authentification
    │   ├── bruno.json
    │   ├── Login.bru
    │   ├── Register.bru
    │   └── Logout.bru
    ├── users-api/             # Gestion utilisateurs
    │   ├── bruno.json
    │   ├── Get Users.bru
    │   ├── Get User By ID.bru
    │   └── Update User.bru
    └── products-api/          # Gestion produits
        ├── bruno.json
        ├── Create Product.bru
        ├── Search Products.bru
        └── Advanced Analytics.bru
```

## 🌍 Variables d'environnement

### Development

- `api_base_url`: http://localhost:3000
- `timeout`: 5000ms
- `debug_mode`: true

### Staging

- `api_base_url`: https://api-staging.example.com
- `timeout`: 10000ms
- `debug_mode`: false

### Production

- `api_base_url`: https://api.example.com
- `timeout`: 15000ms
- `jwt_secret`: `{{process.env.JWT_SECRET}}`

## 📚 Fonctions partagées disponibles PARTOUT

Grâce au script `global-setup.js`, ces fonctions sont disponibles dans **toutes les collections** :

### 🔐 Crypto utilities

```javascript
utils.generateMD5(data); // Hash MD5
utils.generateUUID(); // UUID v4
utils.encodeBase64(data); // Encoder en Base64
utils.decodeBase64(data); // Décoder Base64
utils.generateSimpleJWT(payload, secret); // JWT simple
```

### 📊 Data helpers

```javascript
utils.faker.name(); // Nom aléatoire
utils.faker.email(name); // Email aléatoire
utils.faker.phone(); // Téléphone aléatoire
utils.faker.price(min, max); // Prix aléatoire
utils.validateEmail(email); // Valider email
utils.validatePhone(phone); // Valider téléphone
utils.formatDate(date, format); // Formater date
```

### 🌐 API helpers

```javascript
utils.buildURL(base, endpoint, params); // Construire URL
utils.createAuthHeaders(token); // Headers d'auth
utils.handleApiError(response); // Gérer erreurs
utils.measureResponseTime(start); // Mesurer temps
utils.validateStatus(status, expected); // Valider status
```

### 🚀 Fonctions globales

```javascript
utils.log(message, data); // Logger avec timestamp
utils.incrementRequestCount(); // Compteur de requêtes
utils.setCurrentUser(user); // Définir utilisateur courant
utils.setAuthToken(token); // Définir token d'auth
utils.getAuthHeaders(); // Récupérer headers d'auth
```

### 🔬 Utilitaires avancés (lodash-like)

```javascript
const advanced = require("../../libs/advanced-utils.js");
advanced._.get(obj, "path.to.value"); // Extraire valeur
advanced._.set(obj, "path", value); // Définir valeur
advanced._.pick(obj, "key1", "key2"); // Sélectionner clés
advanced.generateTestDataSet("users", 5); // Générer données test
advanced.compareResponses(resp1, resp2); // Comparer réponses
advanced.analyzePerformance(responses); // Analyser performances
```

## 🎯 Variables partagées entre collections

```javascript
// Variables globales accessibles partout
global.sharedVars.currentUser; // Utilisateur courant
global.sharedVars.authToken; // Token d'authentification
global.sharedVars.sessionId; // ID de session
global.sharedVars.requestCount; // Compteur de requêtes
global.sharedVars.performanceData; // Données de performance
```

## 🚀 Utilisation

### Installation de Bruno

```bash
npm install -g @usebruno/cli
```

### Lancer les tests par environnement

```bash
# Development (défaut)
npm run test

# Staging
npm run test:staging

# Production
npm run test:prod
```

### Lancer des collections spécifiques

```bash
# Seulement l'authentification
npm run test:auth

# Seulement les utilisateurs
npm run test:users

# Seulement les produits
npm run test:products
```

## 💡 Exemples d'utilisation des fonctions partagées

### Dans n'importe quelle requête :

```javascript
script:pre-request {
  // Charger les utilitaires (disponible dans TOUTES les collections)
  require('../../scripts/global-setup.js');

  // Utiliser les fonctions crypto
  const requestId = utils.generateUUID();
  const requestHash = utils.generateMD5('some-data');

  // Utiliser les helpers de données
  const testEmail = utils.faker.email(utils.faker.name());
  const isValidEmail = utils.validateEmail(testEmail);

  // Utiliser les helpers API
  const authHeaders = utils.getAuthHeaders(); // Si connecté

  // Logger avec timestamp
  utils.log('Request starting', { requestId, testEmail });

  // Incrémenter le compteur global
  const count = utils.incrementRequestCount();
}

script:post-response {
  // Parser et valider la réponse
  const response = utils.parseJSONResponse(bru.getResponseBody());
  const status = bru.getResponseStatus();

  // Valider le status
  if (!utils.validateStatus(status, [200, 201])) {
    throw new Error(`Unexpected status: ${status}`);
  }

  // Logger le résultat
  utils.log('Request completed', { status, hasData: !!response });
}
```

## 🔄 Flux de test typique

1. **Login** → Obtient le token d'auth et le sauvegarde
2. **Get Users** → Utilise the token, sauvegarde le premier utilisateur
3. **Get User By ID** → Utilise l'utilisateur sauvegardé
4. **Create Product** → Génère des données avec les utilitaires
5. **Search Products** → Utilise les fonctions de validation
6. **Advanced Analytics** → Analyse les performances avec lodash

## 🎨 Fonctionnalités démontrées

- ✅ **Variables d'environnement** avec différentes configurations
- ✅ **Collections organisées** par domaine fonctionnel
- ✅ **Scripts pré/post-requête** avec logique métier
- ✅ **Fonctions JavaScript partagées** entre collections
- ✅ **Génération de données de test** dynamiques
- ✅ **Validation avancée** des réponses
- ✅ **Gestion des erreurs** et retry logic
- ✅ **Mesure de performance** et analytics
- ✅ **State management** global entre requêtes
- ✅ **Logging structuré** avec timestamps
- ✅ **Utilitaires cryptographiques** (UUID, MD5, JWT)
- ✅ **Helpers pour manipulation de données** (lodash-like)

Ce projet montre comment Bruno peut être utilisé pour créer des suites de tests API sophistiquées avec du code JavaScript réutilisable et des variables partagées entre environnements et collections ! 🚀
