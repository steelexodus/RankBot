// ============================================================
//  config.js — Paste ALL your credentials and settings here
// ============================================================

module.exports = {
  // --- Discord Bot Token (Bot page → Token) ---
  DISCORD_TOKEN: 'PASTE_YOUR_DISCORD_TOKEN_HERE',

  // --- Discord Application ID (General Information → Application ID) ---
  CLIENT_ID: 'PASTE_YOUR_CLIENT_ID_HERE',

  // --- Guild ID (right-click your server icon → Copy Server ID) ---
  // Set to null to register slash commands globally instead
  GUILD_ID: 'PASTE_YOUR_GUILD_ID_HERE',

  // --- Roblox .ROBLOSECURITY cookie ---
  // DevTools → Application → Cookies → roblox.com → .ROBLOSECURITY
  ROBLOX_COOKIE: 'PASTE_YOUR_ROBLOX_COOKIE_HERE',

  // --- Prefix for legacy ! commands ---
  PREFIX: '!',

  // --- Your Roblox Group ID (the number in your group URL) ---
  GROUP_ID: 12345678,

  // --- Discord Role IDs that can run admin commands ---
  ADMIN_ROLE_IDS: ['111111111111111111', '222222222222222222'],

  // --- XP → Auto-Rank thresholds ---
  XP_RANK_THRESHOLDS: [
    { xp: 0,    rankId: 1,  label: 'Rookie'   },
    { xp: 100,  rankId: 5,  label: 'Member'   },
    { xp: 500,  rankId: 10, label: 'Senior'   },
    { xp: 1000, rankId: 15, label: 'Veteran'  },
    { xp: 2500, rankId: 20, label: 'Elite'    },
  ],

  XP_PER_MESSAGE: 2,
  XP_COOLDOWN_MS: 60_000,

  // --- Gamepass → Auto-Rank rules ---
  GAMEPASS_RANKS: [
    { gamepassId: 987654321, rankId: 50, label: 'VIP'       },
    { gamepassId: 111222333, rankId: 60, label: 'Supporter' },
  ],

  EMBED_COLOR: 0x5865F2,
};
