// index.js — Entry point
const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
} = require('discord.js');
const noblox = require('noblox.js');
const fs     = require('fs');
const path   = require('path');

const config = require('./src/config');
const { handleSlash }  = require('./src/handlers/slashHandler');
const { handlePrefix } = require('./src/handlers/prefixHandler');

// ── Keep-alive HTTP server (stops Render from spinning down) ───────────────
const http = require('http');
const PORT = 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive 🤖');
}).listen(PORT, '0.0.0.0', () => console.log(`🌐 Keep-alive server listening on port ${PORT}`));

// ── Discord client ──────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// ── Load commands ───────────────────────────────────────────────────────────
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'src', 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const cmd = require(path.join(commandsPath, file));
  if (cmd?.data?.name) {
    client.commands.set(cmd.data.name, cmd);
    console.log(`  ✔ Loaded command: ${cmd.data.name}`);
  }
}

// ── Ready ───────────────────────────────────────────────────────────────────
client.once(Events.ClientReady, async () => {
  console.log(`\n🤖 Discord bot ready: ${client.user.tag}`);
  try {
    await noblox.setCookie(config.ROBLOX_COOKIE);
    const me = await noblox.getCurrentUser();
    console.log(`🎮 Roblox authenticated as: ${me.UserName} (ID: ${me.UserID})\n`);
  } catch (e) {
    console.error('❌ Roblox authentication failed:', e.message);
  }
  client.user.setActivity('Roblox Group Manager', { type: 0 });
});

// ── Events ───────────────────────────────────────────────────────────────────
client.on(Events.InteractionCreate, interaction => handleSlash(client, interaction));
client.on(Events.MessageCreate,     message     => handlePrefix(client, message));
client.on('error', err => console.error('Discord client error:', err));
process.on('unhandledRejection', err => console.error('Unhandled rejection:', err));

// ── Login ────────────────────────────────────────────────────────────────────
client.login(config.DISCORD_TOKEN);
