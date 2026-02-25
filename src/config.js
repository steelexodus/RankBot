// ============================================================
//  config.js — Paste ALL your credentials and settings here
// ============================================================

module.exports = {
  // --- Discord Bot Token (Bot page → Token) ---
  DISCORD_TOKEN: 'MTQ3NTI2MDk4MTcxNzUwNDI2Mw.GAIqS4.SxBGSUylN9rBoKrrEe42odr0yGiSv3FAaMM1R8',

  // --- Discord Application ID (General Information → Application ID) ---
  CLIENT_ID: '1475260981717504263',

  // --- Guild ID (right-click your server icon → Copy Server ID) ---
  // Set to null to register slash commands globally instead
  GUILD_ID: '1438132224439615571',

  // --- Roblox .ROBLOSECURITY cookie ---
  // DevTools → Application → Cookies → roblox.com → .ROBLOSECURITY
  ROBLOX_COOKIE: '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhADIhsKBGR1aWQSEzQyMDkyNzM1MTI4MTc5OTYxOTAoAw.4wwGy8dvFB4ufg8Vp-cChW-c8D6b1--6NVTPTFffqo1BcKHGsrXyKu0oVmBTyyLsbVFRizuKzm5zFGt7PchP_lfhtyhqRVne2f7TowIlPnzlnOXoNFU7fbP12L2-gP9H_i6yDKo9b0Ui2O_eVkBJCYK0nlDoTb_41ufrHUy0d_1_ggncxKcyCaa4th0EZZF7P7bn2VomJiKB0V0_kW-C5C6VCO2OaWMKg6LWeoFOq2cKjYxD_sqE7HwTmX80FQcVtPGRkCEtHKFLgGRCPvjsrhG9Zzl-C9o0dPzheq3PUrMlUmL6E-7t5nne5K8taDrHVMy4fukNdMjmG17bnmqMl3skITNz5yST2v8JoaGH2iav54pExdHbILIsuOGVB0CPqocx2kZOeMlj6-k05qzlQlAn7TfjmJ0xSATqHEyuopG5crTTP76G93sNEwn8gH510H5ZIT7y4cBrtUjda_WwR2qYL-d_2tKic-IBANLVTedm2gtIDH8bogf8czhLzfGhkY7-tQzhld_Uz1yalQznSSDv3LCuZMcqd4AzJ24j3EQmQNFEsi-0yKbwcIUz7B2sgsZQrgCuMgNxwLdgp84cAi5rnGgWy_aUrM6mbZ8U4i9gdphACY4VfiYY1vatd6JEufaUJt9wZoK8YRwj7bwcSCLwLdcc11w84vmxs-Z8kOBMxTgPaQ6wPgRjwNjgOHbUh5LFzUOkTbTKGqZWUuFk92Tj659disVYl6C8P8YLytor8Zc7-K0L9Z-21LdLdoa3WscI2gR2MtjyY_WxAq8G2s2jHJc',

  // --- Prefix for legacy ! commands ---
  PREFIX: '!',

  // --- Your Roblox Group ID (the number in your group URL) ---
  GROUP_ID: 35143702,

  // --- Discord Role IDs that can run admin commands ---
  ADMIN_ROLE_IDS: ['1438132224938737804', '1474727298270756864', '1438132224926158968', '1438132224963907694'],

  // --- XP → Auto-Rank thresholds ---
  XP_RANK_THRESHOLDS: [
    { xp: 0,    rankId: 1,  label: 'Recruit'   },
    { xp: 1,  rankId: 16,  label: 'Private'   },
    { xp: 5,  rankId: 17, label: 'Lance Corporal'   },
    { xp: 15, rankId: 18, label: 'Corporal'  },
    { xp: 30, rankId: 19, label: 'Sergeant'    },
    { xp: 50, rankId: 20, label: 'Staff Sergeant'    },
  ],

  XP_PER_MESSAGE: 0,
  XP_COOLDOWN_MS: 60_000,

  // --- Gamepass → Auto-Rank rules ---
  GAMEPASS_RANKS: [
    { gamepassId: 987654321, rankId: 15, label: 'SKIP BMT'       },
    { gamepassId: 111222333, rankId: 18, label: 'CORPORAL RANK' },
    { gamepassId: 111220333, rankId: 18, label: 'STAFF SERGEANT RANK' },
  ],

  EMBED_COLOR: 0x5865F2,
};
