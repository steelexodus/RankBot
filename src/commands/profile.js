// src/commands/profile.js
// Show a full profile: Roblox info, group rank, and XP.
//
// Usage:  /profile [@user]  |  !profile [@user]

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser }                            = require('../utils/db');
const { getRank, getPlayerInfo }             = require('../utils/roblox');
const { getRankForXp }                       = require('../utils/xpSystem');
const { EMBED_COLOR }                        = require('../config');

const data = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('View a member\'s full Roblox + XP profile')
  .addUserOption(o =>
    o.setName('user')
     .setDescription('Discord user (defaults to yourself)')
     .setRequired(false));

async function execute(interaction_or_message, args = []) {
  const isSlash = interaction_or_message.isChatInputCommand?.();
  const member  = isSlash ? interaction_or_message.member : interaction_or_message.member;

  let targetMember, targetId;
  if (isSlash) {
    targetMember = interaction_or_message.options.getMember('user') || member;
    targetId     = targetMember.user.id;
  } else {
    targetMember = interaction_or_message.mentions.members?.first() || member;
    targetId     = targetMember.user.id;
  }

  if (isSlash) await interaction_or_message.deferReply();

  const dbUser = getUser(targetId);
  if (!dbUser.robloxId) {
    const msg = `❌ ${targetMember.user.tag} hasn't verified yet.`;
    return isSlash
      ? interaction_or_message.editReply(msg)
      : interaction_or_message.reply(msg);
  }

  const [rankInfo, playerInfo] = await Promise.all([
    getRank(dbUser.robloxId),
    getPlayerInfo(dbUser.robloxId),
  ]);

  const xp       = dbUser.xp || 0;
  const tier     = getRankForXp(xp);
  const joinDate = playerInfo?.joinDate
    ? new Date(playerInfo.joinDate).toLocaleDateString()
    : 'Unknown';

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle(`👤 ${targetMember.user.tag}`)
    .setThumbnail(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${dbUser.robloxId}&size=150x150&format=Png`)
    .addFields(
      { name: '🎮 Roblox',       value: dbUser.robloxName,                         inline: true },
      { name: '🆔 Roblox ID',    value: String(dbUser.robloxId),                   inline: true },
      { name: '📅 Joined Roblox',value: joinDate,                                  inline: true },
      { name: '🏅 Group Rank',   value: rankInfo ? `${rankInfo.rankName} (${rankInfo.rankId})` : 'Not in group', inline: true },
      { name: '⭐ XP',            value: xp.toLocaleString(),                       inline: true },
      { name: '🔰 XP Tier',      value: tier?.label ?? 'Unranked',                 inline: true },
    )
    .setTimestamp();

  return isSlash
    ? interaction_or_message.editReply({ embeds: [embed] })
    : interaction_or_message.reply({ embeds: [embed] });
}

module.exports = { data, execute };
