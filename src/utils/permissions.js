// src/utils/permissions.js

const { ADMIN_ROLE_IDS } = require('../config');

/**
 * Returns true if the GuildMember has any of the configured admin roles,
 * or if they have the Administrator Discord permission.
 */
function isAdmin(member) {
  if (!member) return false;
  if (member.permissions.has('Administrator')) return true;
  return member.roles.cache.some(r => ADMIN_ROLE_IDS.includes(r.id));
}

module.exports = { isAdmin };
