// src/commands/leaderboard.js
// Show the top 10 XP earners.
//
// Usage:  /leaderboard  |  !leaderboard  |  !lb

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLeaderboard }                     = require('../utils/db');
const { getRankForXp }                       = require('../utils/xpSystem');
const { EMBED_COLOR }                        = require('../config');

const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Show the top 10 XP earners');

const MEDALS = ['🥇', '🥈', '🥉'];

async function execute(interaction_or_message) {
  const isSlash = interaction_or_message.isChatInputCommand?.();
  if (isSlash) await interaction_or_message.deferReply();

  const top = getLeaderboard(10);

  if (top.length === 0) {
    const msg = '📭 No verified users with XP yet.';
    return isSlash
      ? interaction_or_message.editReply(msg)
      : interaction_or_message.reply(msg);
  }

  const lines = top.map((u, i) => {
    const medal = MEDALS[i] ?? `**${i + 1}.**`;
    const tier  = getRankForXp(u.xp)?.label ?? 'Unranked';
    return `${medal} **${u.robloxName}** — ${u.xp.toLocaleString()} XP  *(${tier})*`;
  });

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('🏆 XP Leaderboard')
    .setDescription(lines.join('\n'))
    .setFooter({ text: 'Updated in real-time' })
    .setTimestamp();

  return isSlash
    ? interaction_or_message.editReply({ embeds: [embed] })
    : interaction_or_message.reply({ embeds: [embed] });
}

module.exports = { data, execute };
