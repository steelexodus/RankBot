// src/handlers/slashHandler.js

async function handleSlash(client, interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Slash command error [${interaction.commandName}]:`, err);
    const msg = '❌ An error occurred while running that command.';
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(msg).catch(() => {});
    } else {
      await interaction.reply({ content: msg, ephemeral: true }).catch(() => {});
    }
  }
}

module.exports = { handleSlash };
