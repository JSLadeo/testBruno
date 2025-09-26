/**
 * Utilitaires avancés avec librairies externes
 */

// Simuler lodash pour les fonctions utiles
const _ = {
  get: (obj, path, defaultValue) => {
    const keys = path.split(".");
    let result = obj;
    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }
    return result === undefined ? defaultValue : result;
  },

  set: (obj, path, value) => {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    return obj;
  },

  pick: (obj, ...keys) => {
    const result = {};
    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  omit: (obj, ...keys) => {
    const result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  },

  isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),

  cloneDeep: (obj) => JSON.parse(JSON.stringify(obj)),
};

// Fonctions de traitement de données avancées
function processApiResponse(response, schema) {
  const processed = {
    timestamp: new Date().toISOString(),
    originalData: _.cloneDeep(response),
    extractedData: {},
    validationResults: {},
  };

  // Extraire les données selon le schéma
  Object.keys(schema).forEach((key) => {
    const path = schema[key];
    processed.extractedData[key] = _.get(response, path);
  });

  return processed;
}

// Comparateur de réponses
function compareResponses(response1, response2, fieldsToCompare = []) {
  const comparison = {
    identical: _.isEqual(response1, response2),
    differences: [],
    summary: {},
  };

  if (fieldsToCompare.length > 0) {
    fieldsToCompare.forEach((field) => {
      const val1 = _.get(response1, field);
      const val2 = _.get(response2, field);

      if (!_.isEqual(val1, val2)) {
        comparison.differences.push({
          field: field,
          value1: val1,
          value2: val2,
        });
      }
    });
  }

  comparison.summary = {
    totalDifferences: comparison.differences.length,
    identical: comparison.differences.length === 0,
  };

  return comparison;
}

// Générateur de données de test complexes
function generateTestDataSet(type, count = 5) {
  const generators = {
    users: () => ({
      id: Math.floor(Math.random() * 10000),
      name: `User ${Math.random().toString(36).substring(7)}`,
      email: `user${Math.random().toString(36).substring(7)}@test.com`,
      age: Math.floor(Math.random() * 50) + 18,
      active: Math.random() > 0.5,
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }),

    products: () => ({
      id: Math.floor(Math.random() * 10000),
      name: `Product ${Math.random().toString(36).substring(7)}`,
      price: parseFloat((Math.random() * 1000).toFixed(2)),
      category: ["Electronics", "Clothing", "Books", "Home"][
        Math.floor(Math.random() * 4)
      ],
      inStock: Math.random() > 0.3,
      rating: parseFloat((Math.random() * 5).toFixed(1)),
    }),

    orders: () => ({
      id: Math.floor(Math.random() * 10000),
      userId: Math.floor(Math.random() * 1000),
      total: parseFloat((Math.random() * 500).toFixed(2)),
      status: ["pending", "confirmed", "shipped", "delivered"][
        Math.floor(Math.random() * 4)
      ],
      items: Math.floor(Math.random() * 5) + 1,
      orderDate: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }),
  };

  const generator = generators[type];
  if (!generator) {
    throw new Error(`Unknown data type: ${type}`);
  }

  return Array.from({ length: count }, generator);
}

// Analyseur de performance
function analyzePerformance(responses) {
  const times = responses.map((r) => r.responseTime).filter((t) => t);

  if (times.length === 0) return null;

  const sorted = [...times].sort((a, b) => a - b);

  return {
    min: Math.min(...times),
    max: Math.max(...times),
    average: times.reduce((a, b) => a + b, 0) / times.length,
    median:
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    totalRequests: times.length,
  };
}

module.exports = {
  _,
  processApiResponse,
  compareResponses,
  generateTestDataSet,
  analyzePerformance,
};
