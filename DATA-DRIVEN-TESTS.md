# Tests Data-Driven avec Bruno

Cette documentation présente la collection **data-driven-api** qui démontre l'utilisation de fichiers CSV et JSON pour alimenter des tests Bruno.

## 📂 Structure des fichiers

```
testBruno/
├── data/                              # Fichiers de données
│   ├── users.csv                     # Données utilisateurs (CSV)
│   ├── products.json                 # Données produits (JSON)
│   └── test-scenarios.json           # Scénarios de test (JSON)
└── bruno-collections/
    └── data-driven-api/              # Collection de tests data-driven
        ├── CreateUsersFromCSV.bru    # Test CSV - Création utilisateurs
        ├── CreateProductsFromJSON.bru # Test JSON - Création produits
        └── LoginScenariosFromJSON.bru # Test JSON - Scénarios login
```

## 🎯 Tests disponibles

### 1. Test CSV - Création d'utilisateurs

**Fichier** : `CreateUsersFromCSV.bru`  
**Données** : `data/users.csv`  
**Commande** : `npm run test:data-csv`

**Fonctionnalités** :

- ✅ Itération automatique sur chaque ligne du CSV
- ✅ Variables dynamiques : `{{name}}`, `{{email}}`, `{{age}}`, `{{country}}`
- ✅ Génération de timestamps automatiques
- ✅ Logging détaillé de chaque utilisateur créé
- ✅ Tests automatisés sur les réponses

**Données CSV** :

```csv
name,email,age,country
John Doe,john.doe@example.com,30,France
Jane Smith,jane.smith@test.org,25,Canada
Bob Wilson,bob.wilson@demo.net,35,USA
Alice Brown,alice.brown@example.com,28,UK
Charlie Davis,charlie.davis@test.org,32,Germany
```

### 2. Test JSON - Création de produits

**Fichier** : `CreateProductsFromJSON.bru`  
**Données** : `data/products.json`  
**Commande** : `npm run test:data-json`

**Fonctionnalités** :

- ✅ Itération sur chaque objet JSON
- ✅ Variables : `{{name}}`, `{{category}}`, `{{price}}`, `{{sku}}`, `{{stock}}`
- ✅ Génération de descriptions automatiques
- ✅ Tests de validation (prix positif, catégories valides)
- ✅ Sauvegarde des IDs produits créés

**Données JSON** :

```json
[
  {
    "name": "Laptop Pro 15",
    "category": "Electronics",
    "price": 1299.99,
    "sku": "LAP-PRO-15",
    "stock": 25
  },
  {
    "name": "Wireless Mouse",
    "category": "Electronics",
    "price": 29.99,
    "sku": "MOUSE-WL-01",
    "stock": 100
  }
]
```

### 3. Test JSON - Scénarios de login

**Fichier** : `LoginScenariosFromJSON.bru`  
**Données** : `data/test-scenarios.json`  
**Commande** : `npm run test:scenarios`

**Fonctionnalités** :

- ✅ Tests de différents scénarios (succès, échecs)
- ✅ Variables : `{{scenario}}`, `{{email}}`, `{{password}}`, `{{expectedStatus}}`
- ✅ Validation contextuelle des emails selon le scénario
- ✅ Simulation de résultats attendus vs réels
- ✅ Logging détaillé des résultats de chaque scénario

**Scénarios JSON** :

```json
[
  {
    "scenario": "Login Success",
    "email": "admin@example.com",
    "password": "admin123",
    "expectedStatus": 200,
    "description": "Test successful login with valid credentials"
  },
  {
    "scenario": "Login Invalid Email",
    "email": "invalid-email",
    "password": "admin123",
    "expectedStatus": 400,
    "description": "Test login with invalid email format"
  }
]
```

## 🎨 Fonctionnalités Bruno utilisées

### Variables dynamiques

Les colonnes CSV et propriétés JSON deviennent automatiquement des variables Bruno :

```javascript
// CSV: name,email,age -> {{name}}, {{email}}, {{age}}
// JSON: {"name": "...", "price": 123} -> {{name}}, {{price}}
```

### Scripts pré/post requête

```javascript
script:pre-request {
  require('./global-utils.js');

  // Accès aux variables de données
  console.log('Processing:', bru.getVar('name'));

  // Génération de données supplémentaires
  bru.setVar('timestamp', new Date().toISOString());
}

script:post-response {
  require('./global-utils.js');

  // Traitement des réponses
  const status = res.getStatus();
  utils.log('Response processed', { status });
}
```

### Tests automatisés

```javascript
tests {
  test('Status should be 200', function() {
    expect(res.getStatus()).to.equal(200);
  });

  test('Data should match input', function() {
    const responseData = res.getBody();
    expect(responseData.json.name).to.equal(bru.getVar('name'));
  });
}
```

## 📊 Résultats des tests

### Test CSV (5 utilisateurs)

```
✅ Iteration 1: John Doe from France - SUCCESS
✅ Iteration 2: Jane Smith from Canada - SUCCESS
✅ Iteration 3: Bob Wilson from USA - SUCCESS
✅ Iteration 4: Alice Brown from UK - SUCCESS
✅ Iteration 5: Charlie Davis from Germany - SUCCESS

Requests: 5 passed, 5 total
Tests: 10 passed, 10 total (2 tests × 5 itérations)
```

### Test JSON Produits (4 produits)

```
✅ Iteration 1: Laptop Pro 15 (Electronics) - SUCCESS
✅ Iteration 2: Wireless Mouse (Electronics) - SUCCESS
✅ Iteration 3: Coffee Mug (Home) - SUCCESS
✅ Iteration 4: Running Shoes (Sports) - SUCCESS

Requests: 4 passed, 4 total
Tests: 16 passed, 16 total (4 tests × 4 itérations)
```

### Test JSON Scénarios (4 scénarios)

```
✅ Iteration 1: Login Success - PASSED
⚠️ Iteration 2: Login Invalid Email - EXPECTED FAILURE
⚠️ Iteration 3: Login Wrong Password - EXPECTED FAILURE
⚠️ Iteration 4: Login Empty Fields - EXPECTED FAILURE

Requests: 4 passed, 4 total
Tests: Mixed (validation des échecs intentionnels)
```

## 🔧 Syntaxe Bruno CLI

```bash
# Syntaxe générale pour données externes
npx @usebruno/cli run <fichier.bru> --env <environment> --csv-file-path <fichier.csv>
npx @usebruno/cli run <fichier.bru> --env <environment> --json-file-path <fichier.json>

# Exemples concrets
npx @usebruno/cli run bruno-collections/data-driven-api/CreateUsersFromCSV.bru --env Development --csv-file-path data/users.csv

npx @usebruno/cli run bruno-collections/data-driven-api/CreateProductsFromJSON.bru --env Development --json-file-path data/products.json
```

## 🎯 Cas d'usage

### Quand utiliser les tests data-driven ?

✅ **Tests de régression** avec de nombreux jeux de données  
✅ **Validation de formulaires** avec différentes combinaisons d'entrées  
✅ **Tests de performance** avec volumes de données variables  
✅ **Tests d'intégration** avec données métier réelles  
✅ **Scénarios de tests** multiples (happy path, edge cases, error cases)

### Avantages

🚀 **Séparation des données et des tests** - Facilite la maintenance  
🚀 **Réutilisabilité** - Même test, différents jeux de données  
🚀 **Collaboration** - Les données peuvent être fournies par les métiers  
🚀 **Évolutivité** - Ajout facile de nouveaux cas de test  
🚀 **Traçabilité** - Logging détaillé de chaque itération

## 🏆 Conclusion

La collection **data-driven-api** démontre les capacités avancées de Bruno pour :

- L'itération automatique sur des fichiers de données externes
- L'utilisation de variables dynamiques
- L'exécution de tests complexes avec validation
- La génération de rapports détaillés

Cette approche est idéale pour les équipes qui veulent séparer la logique de test des données, permettant une meilleure collaboration entre développeurs et équipes métier.
