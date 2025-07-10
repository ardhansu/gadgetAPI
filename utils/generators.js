const crypto = require('crypto');

// Array of cool codenames for gadgets
const CODENAME_PREFIXES = [
  'The', 'Project', 'Operation', 'Agent', 'Shadow', 'Phoenix', 'Viper', 'Falcon',
  'Storm', 'Lightning', 'Thunder', 'Phantom', 'Ghost', 'Stealth', 'Crimson', 'Silver'
];

const CODENAME_SUFFIXES = [
  'Nightingale', 'Kraken', 'Scorpion', 'Viper', 'Phoenix', 'Falcon', 'Eagle', 'Hawk',
  'Wolf', 'Tiger', 'Panther', 'Jaguar', 'Cobra', 'Mamba', 'Serpent', 'Dragon',
  'Raven', 'Owl', 'Fox', 'Lynx', 'Leopard', 'Lion', 'Bear', 'Shark',
  'Tornado', 'Hurricane', 'Blizzard', 'Avalanche', 'Earthquake', 'Tsunami',
  'Inferno', 'Glacier', 'Volcano', 'Meteor', 'Comet', 'Nova',
  'Nexus', 'Matrix', 'Cipher', 'Enigma', 'Paradox', 'Quantum',
  'Prism', 'Spectrum', 'Infinity', 'Eternity', 'Destiny', 'Legacy'
];

/**
 * Generate a unique codename for a gadget
 */
function generateCodename() {
  const prefix = CODENAME_PREFIXES[Math.floor(Math.random() * CODENAME_PREFIXES.length)];
  const suffix = CODENAME_SUFFIXES[Math.floor(Math.random() * CODENAME_SUFFIXES.length)];
  
  return `${prefix} ${suffix}`;
}

/**
 * Generate a random mission success probability percentage
 */
function generateSuccessProbability() {
  // Generate a number between 65-99 for realistic success rates
  return Math.floor(Math.random() * 35) + 65;
}

/**
 * Generate a random confirmation code for self-destruct
 */
function generateConfirmationCode() {
  // Generate a 6-digit alphanumeric code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * Generate a random UUID (alternative to crypto.randomUUID for older Node versions)
 */
function generateUUID() {
  return crypto.randomUUID();
}

module.exports = {
  generateCodename,
  generateSuccessProbability,
  generateConfirmationCode,
  generateUUID
};