// src/commands/help.js
// Lists all available commands.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PREFIX, EMBED_COLOR }               = require('../config');

const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('List all bot commands');

const COMMANDS = [
  { name: 'verify <username>',         desc: 'Link your Discord to your Roblox account' },
  { name: 'rank [@user] [rankId]',     desc: 'View or set group rank (rankId = admin only)' },
  { name: 'xp [@user] [amount]',       desc: 'View or modify XP (amount = admin only)' },
  { name: 'gamepassrank [@user]',       desc: 'Auto-rank based on gamepass ownership' },
  { name: 'profile [@user]',           desc: 'Full profile: Roblox info, rank, and XP' },
  { name: 'leaderboard',               desc: 'Top 10 XP earners' },
  { name: 'help',                      desc: 'Show this message' },
];

async function execute(interaction_or_message) {
  const isSlash = interaction_or_message.isChatInputCommand?.();

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('📖 Bot Commands')
    .setDescription(`Use \`/<command>\` *or* \`${PREFIX}<command>\``)
    .addFields(COMMANDS.map(c => ({
      name: `\`${c.name}\``,
      value: c.desc,
      inline: false,
    })))
    .setFooter({ text: 'Arguments in [] are optional, <> are required.' });

  return isSlash
    ? interaction_or_message.reply({ embeds: [embed], ephemeral: true })
    : interaction_or_message.reply({ embeds: [embed] });
}

module.exports = { data, execute };
