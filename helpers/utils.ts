const crypto = require('crypto');

export const generateRandomId = () => {
  return crypto.randomUUID().split('-')[0];
};