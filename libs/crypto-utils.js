/**
 * Utilitaires cryptographiques partagés
 */

// Générer un hash MD5
function generateMD5(data) {
  const crypto = require("crypto");
  return crypto.createHash("md5").update(data).digest("hex");
}

// Générer un UUID v4
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Encoder en Base64
function encodeBase64(data) {
  return Buffer.from(data).toString("base64");
}

// Décoder depuis Base64
function decodeBase64(data) {
  return Buffer.from(data, "base64").toString("utf8");
}

// Générer un token JWT simple (pour les tests)
function generateSimpleJWT(payload, secret) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = encodeBase64(JSON.stringify(header));
  const encodedPayload = encodeBase64(JSON.stringify(payload));

  const signature = generateMD5(`${encodedHeader}.${encodedPayload}.${secret}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

module.exports = {
  generateMD5,
  generateUUID,
  encodeBase64,
  decodeBase64,
  generateSimpleJWT,
};
