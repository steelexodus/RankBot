// src/commands/verify.js
// Link a Discord account to a Roblox username.
// Usage: /verify <username>  |  !verify <username>

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserId, getPlayerInfo } = require('../utils/roblox');
const { updateUser, getUser }      = require('../utils/db');
const { EMBED_COLOR }              = require('../config');

const data = new SlashCommandBuilder()
  .setName('verify')
  .setDescription('Link your Discord account to your Roblox username')
  .addStringOption(o =>
    o.setName('username')
     .setDescription('Your Roblox username')
     .setRequired(true));

async function execute(interaction_or_message, args = []) {
  const isSlash = interaction_or_message.isChatInputCommand?.();
  const discordId = isSlash
    ? interaction_or_message.user.id
    : interaction_or_message.author.id;

  const username = isSlash
    ? interaction_or_message.options.getString('username')
    : args[0];

  if (!username) {
    const msg = '❌ Please provide your Roblox username.  e.g. `!verify YourName`';
    return isSlash
      ? interaction_or_message.reply({ content: msg, ephemeral: true })
      : interaction_or_message.reply(msg);
  }

  if (isSlash) await interaction_or_message.deferReply();

  const robloxId = await getUserId(username);
  if (!robloxId) {
    const msg = `❌ Roblox user **${username}** not found.`;
    return isSlash
      ? interaction_or_message.editReply(msg)
      : interaction_or_message.reply(msg);
  }

  const info = await getPlayerInfo(robloxId);
  updateUser(discordId, { robloxId, robloxName: info?.displayName || username });

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('✅ Account Verified')
    .setThumbnail(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxId}&size=150x150&format=Png`)
    .addFields(
      { name: 'Roblox Username', value: username,               inline: true },
      { name: 'Roblox ID',       value: String(robloxId),        inline: true },
    )
    .setFooter({ text: 'You can now use rank and XP commands.' });

  return isSlash
    ? interaction_or_message.editReply({ embeds: [embed] })
    : interaction_or_message.reply({ embeds: [embed] });
}

module.exports = { data, execute };
