// deploy-commands.js
// Run once to register slash commands: node deploy-commands.js

const { REST, Routes } = require('discord.js');
const fs   = require('fs');
const path = require('path');
const config = require('./src/config');

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const cmd = require(path.join(commandsPath, file));
  if (cmd?.data) commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Registering ${commands.length} slash command(s)...`);
    let data;
    if (config.GUILD_ID) {
      data = await rest.put(
        Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
        { body: commands }
      );
      console.log(`✅ Registered ${data.length} guild command(s)`);
    } else {
      data = await rest.put(
        Routes.applicationCommands(config.CLIENT_ID),
        { body: commands }
      );
      console.log(`✅ Registered ${data.length} global command(s)`);
    }
  } catch (err) {
    console.error(err);
  }
})();
