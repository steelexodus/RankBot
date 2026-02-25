// src/utils/roblox.js
// Centralised noblox.js helpers with consistent error handling.

const noblox = require('noblox.js');
const { GROUP_ID } = require('../config');

/**
 * Resolve a Roblox username → userId (number).
 * Returns null if not found.
 */
async function getUserId(username) {
  try {
    return await noblox.getIdFromUsername(username);
  } catch {
    return null;
  }
}

/**
 * Get the rank name for a user in the configured group.
 */
async function getRank(robloxId) {
  try {
    const rankName = await noblox.getRankNameInGroup(GROUP_ID, robloxId);
    const rankId   = await noblox.getRankInGroup(GROUP_ID, robloxId);
    return { rankName, rankId };
  } catch {
    return null;
  }
}

/**
 * Set a user's rank in the group by rank ID.
 * Throws on failure (caller should catch).
 */
async function setRank(robloxId, rankId) {
  return noblox.setRank(GROUP_ID, robloxId, rankId);
}

/**
 * Check if a Roblox user owns a specific gamepass.
 */
async function ownsGamepass(robloxId, gamepassId) {
  try {
    return await noblox.gameOwnership(robloxId, gamepassId);
  } catch {
    return false;
  }
}

/**
 * Fetch basic Roblox player info.
 */
async function getPlayerInfo(robloxId) {
  try {
    return await noblox.getPlayerInfo(robloxId);
  } catch {
    return null;
  }
}

/**
 * Get all rank definitions for the group.
 */
async function getGroupRoles() {
  try {
    return await noblox.getRoles(GROUP_ID);
  } catch {
    return [];
  }
}

module.exports = { getUserId, getRank, setRank, ownsGamepass, getPlayerInfo, getGroupRoles };
