/**
 * Helpers pour la manipulation de données
 */

// Générer des données de test
const faker = {
  name: () => {
    const names = ["John", "Jane", "Bob", "Alice", "Charlie", "Diana"];
    return names[Math.floor(Math.random() * names.length)];
  },

  email: (name) => {
    const domains = ["example.com", "test.org", "demo.net"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${name.toLowerCase()}@${domain}`;
  },

  phone: () => {
    return `+33${Math.floor(Math.random() * 900000000 + 100000000)}`;
  },

  price: (min = 10, max = 1000) => {
    return (Math.random() * (max - min) + min).toFixed(2);
  },
};

// Valider les formats
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePhone(phone) {
  const regex = /^\+?[\d\s\-\(\)]+$/;
  return regex.test(phone);
}

// Parser les réponses JSON
function parseJSONResponse(responseBody) {
  try {
    return JSON.parse(responseBody);
  } catch (e) {
    return null;
  }
}

// Extraire des valeurs spécifiques
function extractValue(obj, path) {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

// Formater des dates
function formatDate(date, format = "ISO") {
  const d = new Date(date);
  switch (format) {
    case "ISO":
      return d.toISOString();
    case "FR":
      return d.toLocaleDateString("fr-FR");
    case "US":
      return d.toLocaleDateString("en-US");
    default:
      return d.toString();
  }
}

module.exports = {
  faker,
  validateEmail,
  validatePhone,
  parseJSONResponse,
  extractValue,
  formatDate,
};
