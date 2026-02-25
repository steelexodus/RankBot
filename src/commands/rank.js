// src/commands/rank.js
// View or set a user's Roblox group rank.
//
// Usage (view):   /rank [@user]          |  !rank [@user]
// Usage (set):    /rank [@user] [rankId] |  !rank @user <rankId>  (admin only)

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRank, setRank, getGroupRoles }   = require('../utils/roblox');
const { getUser }                            = require('../utils/db');
const { isAdmin }                            = require('../utils/permissions');
const { EMBED_COLOR }                        = require('../config');

const data = new SlashCommandBuilder()
  .setName('rank')
  .setDescription('View or set a member\'s Roblox group rank')
  .addUserOption(o =>
    o.setName('user')
     .setDescription('Discord user (defaults to yourself)')
     .setRequired(false))
  .addIntegerOption(o =>
    o.setName('rankid')
     .setDescription('Rank ID to set (admin only)')
     .setRequired(false));

async function execute(interaction_or_message, args = []) {
  const isSlash   = interaction_or_message.isChatInputCommand?.();
  const invoker   = isSlash ? interaction_or_message.user : interaction_or_message.author;
  const member    = isSlash ? interaction_or_message.member : interaction_or_message.member;

  // Resolve target user
  let targetMember, targetId, newRankId;

  if (isSlash) {
    targetMember = interaction_or_message.options.getMember('user') || member;
    targetId     = targetMember.user.id;
    newRankId    = interaction_or_message.options.getInteger('rankid') ?? null;
  } else {
    const mention = interaction_or_message.mentions.members?.first();
    targetMember  = mention || member;
    targetId      = targetMember.user.id;
    // !rank @user 10  →  args[1] is rankId
    newRankId = args[1] ? parseInt(args[1]) : null;
  }

  if (isSlash) await interaction_or_message.deferReply();

  const dbUser = getUser(targetId);
  if (!dbUser.robloxId) {
    const msg = `❌ ${targetMember.user.tag} hasn't verified yet. Use \`/verify\` or \`!verify <username>\`.`;
    return isSlash
      ? interaction_or_message.editReply(msg)
      : interaction_or_message.reply(msg);
  }

  // SETTING a rank (admin only)
  if (newRankId !== null) {
    if (!isAdmin(member)) {
      const msg = '🚫 You need an admin role to set ranks.';
      return isSlash
        ? interaction_or_message.editReply(msg)
        : interaction_or_message.reply(msg);
    }
    try {
      await setRank(dbUser.robloxId, newRankId);
    } catch (e) {
      const msg = `❌ Failed to set rank: ${e.message}`;
      return isSlash
        ? interaction_or_message.editReply(msg)
        : interaction_or_message.reply(msg);
    }
  }

  // Fetch current rank (after potential update)
  const rankInfo = await getRank(dbUser.robloxId);
  if (!rankInfo) {
    const msg = '❌ Could not fetch rank — is this user in the group?';
    return isSlash
      ? interaction_or_message.editReply(msg)
      : interaction_or_message.reply(msg);
  }

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle(newRankId ? '✅ Rank Updated' : '🏅 Group Rank')
    .setThumbnail(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${dbUser.robloxId}&size=150x150&format=Png`)
    .addFields(
      { name: 'Discord',       value: `<@${targetId}>`,    inline: true },
      { name: 'Roblox User',   value: dbUser.robloxName,    inline: true },
      { name: '\u200b',        value: '\u200b',             inline: true },
      { name: 'Rank Name',     value: rankInfo.rankName,    inline: true },
      { name: 'Rank ID',       value: String(rankInfo.rankId), inline: true },
    );

  return isSlash
    ? interaction_or_message.editReply({ embeds: [embed] })
    : interaction_or_message.reply({ embeds: [embed] });
}

module.exports = { data, execute };
