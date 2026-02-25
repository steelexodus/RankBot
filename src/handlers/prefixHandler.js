// src/handlers/prefixHandler.js
// Handles !commands and passive XP-on-message.

const { PREFIX, XP_PER_MESSAGE, XP_COOLDOWN_MS } = require('../config');
const { awardXp }   = require('../utils/xpSystem');
const { getUser }   = require('../utils/db');

// Track last-XP-gain time per user to enforce cooldown
const xpCooldowns = new Map();

// Aliases: map extra command names → canonical command name
const ALIASES = {
  'lb': 'leaderboard',
  'p':  'profile',
  'h':  'help',
};

async function handlePrefix(client, message) {
  if (message.author.bot) return;

  // ── Passive XP ────────────────────────────────────────────────────────────
  if (XP_PER_MESSAGE > 0) {
    const lastGain = xpCooldowns.get(message.author.id) ?? 0;
    if (Date.now() - lastGain > XP_COOLDOWN_MS) {
      xpCooldowns.set(message.author.id, Date.now());
      const dbUser = getUser(message.author.id);
      if (dbUser.robloxId) {
        const { promoted, newThreshold } = await awardXp(
          message.author.id, XP_PER_MESSAGE, dbUser.robloxId
        );
        if (promoted) {
          message.channel.send(
            `🎉 <@${message.author.id}> levelled up to **${newThreshold.label}** in the Roblox group!`
          ).catch(() => {});
        }
      }
    }
  }

  // ── Command parsing ────────────────────────────────────────────────────────
  if (!message.content.startsWith(PREFIX)) return;

  const [rawCmd, ...args] = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const cmdName = ALIASES[rawCmd.toLowerCase()] ?? rawCmd.toLowerCase();

  const command = client.commands.get(cmdName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(`Prefix command error [${cmdName}]:`, err);
    message.reply('❌ An error occurred while running that command.').catch(() => {});
  }
}

module.exports = { handlePrefix };
