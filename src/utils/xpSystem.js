// src/utils/xpSystem.js
// Handles XP level-ups and auto-rank promotions.

const { XP_RANK_THRESHOLDS } = require('../config');
const { addXp }  = require('./db');
const { setRank, getRank } = require('./roblox');

/**
 * Calculate what rank a user should hold based on their XP.
 * Returns the highest threshold they've passed.
 */
function getRankForXp(xp) {
  let best = null;
  for (const threshold of XP_RANK_THRESHOLDS) {
    if (xp >= threshold.xp) best = threshold;
  }
  return best; // null if below all thresholds
}

/**
 * Award XP to a Discord user and optionally promote them in-group.
 * Returns { user, promoted, newThreshold } where promoted is bool.
 */
async function awardXp(discordId, amount, robloxId = null) {
  const user = addXp(discordId, amount);

  if (!robloxId || XP_RANK_THRESHOLDS.length === 0) {
    return { user, promoted: false, newThreshold: null };
  }

  const target = getRankForXp(user.xp);
  if (!target) return { user, promoted: false, newThreshold: null };

  // Only promote if they aren't already at or above that rank
  const current = await getRank(robloxId);
  if (current && current.rankId < target.rankId) {
    try {
      await setRank(robloxId, target.rankId);
      return { user, promoted: true, newThreshold: target };
    } catch {
      return { user, promoted: false, newThreshold: target };
    }
  }

  return { user, promoted: false, newThreshold: null };
}

module.exports = { awardXp, getRankForXp };
