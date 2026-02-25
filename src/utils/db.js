// src/utils/db.js
// Simple JSON database via lowdb v1 (CommonJS)
// Data is stored in db.json at the project root.

const low   = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path  = require('path');

const adapter = new FileSync(path.join(__dirname, '../../db.json'));
const db = low(adapter);

// Default schema
db.defaults({
  users: [],   // { discordId, robloxId, robloxName, xp, level }
}).write();

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Get a user record, creating it if it doesn't exist.
 */
function getUser(discordId) {
  let user = db.get('users').find({ discordId }).value();
  if (!user) {
    user = { discordId, robloxId: null, robloxName: null, xp: 0, level: 1 };
    db.get('users').push(user).write();
  }
  return user;
}

/**
 * Update fields on a user record.
 */
function updateUser(discordId, fields) {
  // Ensure the record exists first
  getUser(discordId);
  db.get('users').find({ discordId }).assign(fields).write();
  return db.get('users').find({ discordId }).value();
}

/**
 * Return top N users sorted by XP descending.
 */
function getLeaderboard(limit = 10) {
  return db.get('users')
    .filter(u => u.robloxName !== null)
    .orderBy(['xp'], ['desc'])
    .take(limit)
    .value();
}

/**
 * Add XP to a user and return the updated record.
 */
function addXp(discordId, amount) {
  const user = getUser(discordId);
  const newXp = (user.xp || 0) + amount;
  return updateUser(discordId, { xp: newXp });
}

module.exports = { getUser, updateUser, getLeaderboard, addXp };
