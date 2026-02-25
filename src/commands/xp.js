// src/commands/xp.js
// View a user's XP, or add / remove XP (admin only).
//
// Usage:  /xp [@user]                |  !xp [@user]
//         /xp [@user] <amount>       |  !xp @user <amount>   (admin — positive adds, negative removes)

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { awardXp, getRankForXp }             = require('../utils/xpSystem');
const { getUser }                            = require('../utils/db');
const { isAdmin }                            = require('../utils/permissions');
const { XP_RANK_THRESHOLDS, EMBED_COLOR }   = require('../config');

const data = new SlashCommandBuilder()
  .setName('xp')
  .setDescription('View or modify a member\'s XP')
  .addUserOption(o =>
    o.setName('user')
     .setDescription('Discord user (defaults to yourself)')
     .setRequired(false))
  .addIntegerOption(o =>
    o.setName('amount')
     .setDescription('XP to add (or subtract if negative) — admin only')
     .setRequired(false));

async function execute(interaction_or_message, args = []) {
  const isSlash = interaction_or_message.isChatInputCommand?.();
  const member  = isSlash ? interaction_or_message.member : interaction_or_message.member;

  let targetMember, targetId, amount;

  if (isSlash) {
    targetMember = interaction_or_message.options.getMember('user') || member;
    targetId     = targetMember.user.id;
    amount       = interaction_or_message.options.getInteger('amount') ?? null;
  } else {
    const mention = interaction_or_message.mentions.members?.first();
    targetMember  = mention || member;
    targetId      = targetMember.user.id;
    amount        = args[1] ? parseInt(args[1]) : null;
  }

  if (isSlash) await interaction_or_message.deferReply();

  const dbUser = getUser(targetId);

  // Adding/removing XP (admin only)
  if (amount !== null && !isNaN(amount)) {
    if (!isAdmin(member)) {
      const msg = '🚫 You need an admin role to modify XP.';
      return isSlash
        ? interaction_or_message.editReply(msg)
        : interaction_or_message.reply(msg);
    }
    const { user, promoted, newThreshold } = await awardXp(targetId, amount, dbUser.robloxId);
    const verb = amount >= 0 ? `+${amount}` : `${amount}`;
    const promotionNote = promoted
      ? `\n🎉 Auto-promoted to **${newThreshold.label}** (Rank ${newThreshold.rankId})!`
      : '';

    const embed = buildXpEmbed(user, targetMember, `${verb} XP awarded${promotionNote}`);
    return isSlash
      ? interaction_or_message.editReply({ embeds: [embed] })
      : interaction_or_message.reply({ embeds: [embed] });
  }

  // Viewing XP
  const embed = buildXpEmbed(dbUser, targetMember);
  return isSlash
    ? interaction_or_message.editReply({ embeds: [embed] })
    : interaction_or_message.reply({ embeds: [embed] });
}

function buildXpEmbed(user, targetMember, note = '') {
  const currentXp = user.xp || 0;
  const current   = getRankForXp(currentXp);
  const thresholds = XP_RANK_THRESHOLDS;

  // Find next threshold
  const next = thresholds.find(t => t.xp > currentXp);
  const xpBar = buildBar(currentXp, next?.xp ?? currentXp);

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle(`📊 XP — ${targetMember.user.tag}`)
    .addFields(
      { name: 'XP',          value: `${currentXp.toLocaleString()}`,            inline: true },
      { name: 'Tier',        value: current?.label ?? 'Unranked',               inline: true },
      { name: '\u200b',      value: '\u200b',                                   inline: true },
      { name: 'Next Tier',   value: next ? `${next.label} @ ${next.xp.toLocaleString()} XP` : '🏆 Max tier!', inline: true },
      { name: 'Progress',    value: next ? `\`${xpBar}\`` : '🌟 Maxed',       inline: false },
    );

  if (note) embed.setFooter({ text: note });
  return embed;
}

function buildBar(current, max, length = 20) {
  if (max === 0) return '█'.repeat(length);
  const filled = Math.min(Math.round((current / max) * length), length);
  return '█'.repeat(filled) + '░'.repeat(length - filled) + ` ${current}/${max}`;
}

module.exports = { data, execute };
