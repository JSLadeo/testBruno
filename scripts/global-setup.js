/**
 * Script global - Chargé automatiquement pour toutes les requêtes
 * Ce script rend disponibles toutes les fonctions utilitaires
 */

// Charger toutes les librairies
const cryptoUtils = require("../libs/crypto-utils.js");
const dataHelpers = require("../libs/data-helpers.js");
const apiHelpers = require("../libs/api-helpers.js");

// Variables globales partagées
global.sharedVars = {
  currentUser: null,
  authToken: null,
  sessionId: null,
  requestCount: 0,
};

// Fonctions globales disponibles dans toutes les collections
global.utils = {
  // Crypto utilities
  ...cryptoUtils,

  // Data helpers
  ...dataHelpers,

  // API helpers
  ...apiHelpers,

  // Fonction pour incrémenter le compteur de requêtes
  incrementRequestCount: () => {
    global.sharedVars.requestCount++;
    return global.sharedVars.requestCount;
  },

  // Fonction pour logger avec timestamp
  log: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, data || "");
  },

  // Fonction pour définir l'utilisateur courant
  setCurrentUser: (user) => {
    global.sharedVars.currentUser = user;
    global.utils.log("Current user set", user);
  },

  // Fonction pour définir le token d'auth
  setAuthToken: (token) => {
    global.sharedVars.authToken = token;
    global.utils.log("Auth token set", token ? "***" : null);
  },

  // Fonction pour récupérer les headers d'auth
  getAuthHeaders: () => {
    if (!global.sharedVars.authToken) {
      throw new Error("Auth token not set. Call utils.setAuthToken() first.");
    }
    return global.utils.createAuthHeaders(global.sharedVars.authToken);
  },
};

// Log initial
global.utils.log("Global setup loaded - All utilities available");

module.exports = global.utils;
