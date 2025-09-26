/**
 * Utilitaires globaux simplifiés pour Bruno CLI
 */

// Variables globales partagées
if (!global.sharedVars) {
  global.sharedVars = {
    currentUser: null,
    authToken: null,
    sessionId: null,
    requestCount: 0,
    performanceData: [],
  };
}

// Fonctions utilitaires de base (intégrées pour éviter les problèmes de require)
const utils = {
  // Crypto utilities
  generateUUID: () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  },

  generateMD5: (data) => {
    // Fonction de hash simple pour remplacer MD5 (pour compatibilité Bruno CLI)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  },

  // Data helpers
  faker: {
    name: () => {
      const names = ["John", "Jane", "Bob", "Alice", "Charlie", "Diana"];
      return names[Math.floor(Math.random() * names.length)];
    },

    email: (name) => {
      const domains = ["example.com", "test.org", "demo.net"];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      return `${(name || "user").toLowerCase()}@${domain}`;
    },

    phone: () => {
      return `+33${Math.floor(Math.random() * 900000000 + 100000000)}`;
    },

    price: (min = 10, max = 1000) => {
      return (Math.random() * (max - min) + min).toFixed(2);
    },
  },

  validateEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  validatePhone: (phone) => {
    const regex = /^\+?[\d\s\-\(\)]+$/;
    return regex.test(phone);
  },

  parseJSONResponse: (responseBody) => {
    try {
      return JSON.parse(responseBody);
    } catch (e) {
      return null;
    }
  },

  formatDate: (date, format = "ISO") => {
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
  },

  // API helpers
  buildURL: (baseUrl, endpoint, params = {}) => {
    let url = `${baseUrl}/${endpoint}`
      .replace(/\/+/g, "/")
      .replace(":/", "://");

    const queryParams = new URLSearchParams(params);
    const queryString = queryParams.toString();

    return queryString ? `${url}?${queryString}` : url;
  },

  createAuthHeaders: (token, type = "Bearer") => {
    return {
      Authorization: `${type} ${token}`,
      "Content-Type": "application/json",
    };
  },

  validateStatus: (actualStatus, expectedStatuses = [200]) => {
    const expected = Array.isArray(expectedStatuses)
      ? expectedStatuses
      : [expectedStatuses];
    return expected.includes(actualStatus);
  },

  measureResponseTime: (startTime) => {
    return Date.now() - startTime;
  },

  // Global functions
  incrementRequestCount: () => {
    global.sharedVars.requestCount++;
    return global.sharedVars.requestCount;
  },

  log: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${message}`,
      data ? JSON.stringify(data, null, 2) : ""
    );
  },

  setCurrentUser: (user) => {
    global.sharedVars.currentUser = user;
    utils.log("Current user set", user);
  },

  setAuthToken: (token) => {
    global.sharedVars.authToken = token;
    utils.log("Auth token set", token ? "***" : null);
  },

  getAuthHeaders: () => {
    if (!global.sharedVars.authToken) {
      throw new Error("Auth token not set. Call utils.setAuthToken() first.");
    }
    return utils.createAuthHeaders(global.sharedVars.authToken);
  },
};

// Exposer les utilitaires globalement
global.utils = utils;

// Log initial
utils.log("Global utilities loaded successfully", {
  requestCount: global.sharedVars.requestCount,
});

module.exports = utils;
