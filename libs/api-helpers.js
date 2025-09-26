/**
 * Helpers pour les appels API
 */

// Construire une URL complète
function buildURL(baseUrl, endpoint, params = {}) {
  let url = `${baseUrl}/${endpoint}`.replace(/\/+/g, "/").replace(":/", "://");

  const queryParams = new URLSearchParams(params);
  const queryString = queryParams.toString();

  return queryString ? `${url}?${queryString}` : url;
}

// Générer des headers d'authentification
function createAuthHeaders(token, type = "Bearer") {
  return {
    Authorization: `${type} ${token}`,
    "Content-Type": "application/json",
  };
}

// Gérer les erreurs de réponse
function handleApiError(response, responseBody) {
  const error = {
    status: response.status,
    statusText: response.statusText,
    body: responseBody,
  };

  if (response.status >= 400) {
    console.error("API Error:", error);
    return error;
  }

  return null;
}

// Retry mechanism
async function retryRequest(requestFn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await requestFn();
      return result;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

// Mesurer le temps de réponse
function measureResponseTime(startTime) {
  return Date.now() - startTime;
}

// Valider le status code
function validateStatus(actualStatus, expectedStatuses = [200]) {
  const expected = Array.isArray(expectedStatuses)
    ? expectedStatuses
    : [expectedStatuses];
  return expected.includes(actualStatus);
}

module.exports = {
  buildURL,
  createAuthHeaders,
  handleApiError,
  retryRequest,
  measureResponseTime,
  validateStatus,
};
