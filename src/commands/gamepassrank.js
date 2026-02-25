// src/commands/gamepassrank.js
// Check if the calling user (or a target) owns any configured gamepasses
// and promote them to the highest matching rank.
//
// Usage:  /gamepassrank [@user]  |  !gamepassrank [@user]

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ownsGamepass, setRank, getRank }     = require('../utils/roblox');
const { getUser }                             = require('../utils/db');
const { isAdmin }                             = require('../utils/permissions');
const { GAMEPASS_RANKS, EMBED_COLOR }         = require('../config');

const data = new SlashCommandBuilder()
  .setName('gamepassrank')
  .setDescription('Check gamepasses and auto-rank the user')
  .addUserOption(o =>
    o.setName('user')
     .setDescription('Target user (admin only — defaults to yourself)')
     .setRequired(false));

async function execute(interaction_or_message, args = []) {
  const isSlash = interaction_or_message.isChatInputCommand?.();
  const member  = isSlash ? interaction_or_message.member : interaction_or_message.member;

  let targetMember, targetId;

  if (isSlash) {
    const opt    = interaction_or_message.options.getMember('user');
    targetMember = opt && isAdmin(member) ? opt : member;
    targetId     = targetMember.user.id;
  } else {
    const mention = interaction_or_message.mentions.members?.first();
    if (mention && !isAdmin(member)) {
      const msg = '🚫 Only admins can check gamepass ranks for other users.';
      return interaction_or_message.reply(msg);
    }
    targetMember = (mention && isAdmin(member)) ? mention : member;
    targetId     = targetMember.user.id;
  }

  if (isSlash) await interaction_or_message.deferReply();

  if (GAMEPASS_RANKS.length === 0) {
    const msg = '⚠️ No gamepass ranks are configured. Edit `src/config.js` → `GAMEPASS_RANKS`.';
    return isSlash
      ? interaction_or_message.editReply(msg)
      : interaction_or_message.reply(msg);
  }

  const dbUser = getUser(targetId);
  if (!dbUser.robloxId) {
    const msg = `❌ ${targetMember.user.tag} hasn't verified yet. Run \`/verify\` or \`!verify <username>\` first.`;
    return isSlash
      ? interaction_or_message.editReply(msg)
      : interaction_or_message.reply(msg);
  }

  // Check each configured gamepass
  const results = [];
  for (const gp of GAMEPASS_RANKS) {
    const owns = await ownsGamepass(dbUser.robloxId, gp.gamepassId);
    results.push({ ...gp, owns });
  }

  const owned = results.filter(r => r.owns);

  if (owned.length === 0) {
    const embed = new EmbedBuilder()
      .setColor(0xff6b6b)
      .setTitle('🎮 Gamepass Check')
      .setDescription(`**${targetMember.user.tag}** doesn't own any qualifying gamepasses.`)
      .addFields(results.map(r => ({
        name: r.label,
        value: r.owns ? '✅ Owned' : '❌ Not owned',
        inline: true,
      })));
    return isSlash
      ? interaction_or_message.editReply({ embeds: [embed] })
      : interaction_or_message.reply({ embeds: [embed] });
  }

  // Promote to the highest rank the user qualifies for
  const best = owned.reduce((a, b) => (b.rankId > a.rankId ? b : a));
  let promoted = false;

  try {
    const current = await getRank(dbUser.robloxId);
    if (!current || current.rankId < best.rankId) {
      await setRank(dbUser.robloxId, best.rankId);
      promoted = true;
    }
  } catch (e) {
    console.error('gamepassrank setRank error:', e.message);
  }

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('🎮 Gamepass Rank Check')
    .addFields(
      { name: 'User',           value: `<@${targetId}>`,                        inline: true },
      { name: 'Roblox',         value: dbUser.robloxName,                        inline: true },
      { name: '\u200b',         value: '\u200b',                                 inline: true },
      ...results.map(r => ({ name: r.label, value: r.owns ? '✅' : '❌', inline: true })),
      { name: 'Best Qualifying Rank', value: `${best.label} (ID: ${best.rankId})`, inline: false },
      { name: 'Promoted',       value: promoted ? '✅ Yes' : 'Already at this rank or higher', inline: false },
    );

  return isSlash
    ? interaction_or_message.editReply({ embeds: [embed] })
    : interaction_or_message.reply({ embeds: [embed] });
}

module.exports = { data, execute };
