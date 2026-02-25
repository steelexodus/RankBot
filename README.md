# 🤖 Discord × Roblox Bot

A feature-rich Discord bot that bridges your Discord server with your Roblox group — supporting slash commands, prefix (`!`) commands, rank management, gamepass-based ranking, and XP progression.

---

## ✨ Features

| Feature | Slash | Prefix |
|---|---|---|
| Link Roblox account | `/verify` | `!verify` |
| View / set group rank | `/rank` | `!rank` |
| View / add XP | `/xp` | `!xp` |
| Gamepass auto-rank | `/gamepassrank` | `!gamepassrank` |
| XP leaderboard | `/leaderboard` | `!leaderboard` / `!lb` |
| Full profile | `/profile` | `!profile` / `!p` |
| Help | `/help` | `!help` / `!h` |
| Passive XP on chat | ✅ automatic | ✅ automatic |
| XP → auto-rank | ✅ configurable | ✅ configurable |

---

## 🚀 Setup

### 1. Create a Discord Application

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **New Application** → name it
3. Go to **Bot** → click **Add Bot** → copy the **token** (this is `DISCORD_TOKEN`)
4. On the same page, copy the **Application ID** (this is `CLIENT_ID`)
5. Under **Bot → Privileged Gateway Intents**, enable:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
6. Go to **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot permissions: `Send Messages`, `Read Messages/View Channels`, `Embed Links`, `Mention Everyone` (or just `Administrator` for testing)
   - Copy the URL and invite the bot to your server

### 2. Get Your Roblox Cookie

> ⚠️ Use a **dedicated alt account** — not your personal account.
> The cookie grants full account access.

1. Log into the alt on [roblox.com](https://roblox.com) in Chrome/Firefox
2. Open DevTools (`F12`) → **Application** (Chrome) or **Storage** (Firefox) → **Cookies** → `https://www.roblox.com`
3. Find `.ROBLOSECURITY` and copy its value

### 3. Configure the Bot

1. Copy `.env.example` → `.env`
2. Fill in `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID` (optional), and `ROBLOX_COOKIE`
3. Open `src/config.js` and set:
   - `GROUP_ID` — your Roblox group ID (number in the group URL)
   - `ADMIN_ROLE_IDS` — Discord role IDs that can run admin commands
   - `XP_RANK_THRESHOLDS` — XP amounts and matching group rank IDs
   - `GAMEPASS_RANKS` — gamepass IDs and matching group rank IDs

### 4. Install & Run Locally

```bash
npm install
node deploy-commands.js   # register slash commands once
node index.js             # start the bot
```

---

## ☁️ Deploy to Render (Free, 24/7 via UptimeRobot)

Render's free tier spins down after **15 minutes** of no HTTP traffic.
The built-in keep-alive server + UptimeRobot pinging every 10 minutes defeats this completely — for free.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

> Make sure `.env` and `db.json` are in `.gitignore` (they are by default).

### Step 2 — Deploy on Render

1. Go to [render.com](https://render.com) → **New +** → **Web Service**
2. Connect your GitHub repo
3. Render auto-detects `render.yaml` — click **Apply**
4. Go to **Environment** and add your secrets:
   | Key | Value |
   |---|---|
   | `DISCORD_TOKEN` | Your bot token |
   | `CLIENT_ID` | Your Discord app ID |
   | `GUILD_ID` | Your server ID *(optional)* |
   | `ROBLOX_COOKIE` | Your `.ROBLOSECURITY` cookie |
5. Click **Deploy** — your bot URL will be something like `https://discord-roblox-bot.onrender.com`

### Step 3 — Register Slash Commands

In Render → your service → **Settings** → **Start Command**, temporarily set it to:
```
node deploy-commands.js
```
Redeploy, wait for it to finish, then set it back to `node index.js` and redeploy again.

### Step 4 — Set Up UptimeRobot (keeps bot alive 24/7)

1. Go to [uptimerobot.com](https://uptimerobot.com) → **Add New Monitor**
2. Settings:
   - **Monitor Type:** `HTTP(s)`
   - **Friendly Name:** `Discord Roblox Bot`
   - **URL:** `https://your-service-name.onrender.com` *(your Render URL)*
   - **Monitoring Interval:** `5 minutes` *(free plan supports this)*
3. Click **Create Monitor**

UptimeRobot will now ping your bot every 5 minutes → Render never idles → bot stays online 24/7. ✅

---

## 📁 Project Structure

```
discord-roblox-bot/
├── index.js                  # Bot entry point
├── deploy-commands.js        # One-time slash command registration
├── render.yaml               # Render deploy config
├── package.json
├── .env.example
├── .gitignore
└── src/
    ├── config.js             # ← Edit this for your group settings
    ├── commands/
    │   ├── verify.js
    │   ├── rank.js
    │   ├── xp.js
    │   ├── gamepassrank.js
    │   ├── leaderboard.js
    │   ├── profile.js
    │   └── help.js
    ├── handlers/
    │   ├── slashHandler.js   # Slash command router
    │   └── prefixHandler.js  # Prefix command router + passive XP
    └── utils/
        ├── db.js             # JSON database (lowdb)
        ├── roblox.js         # noblox.js helpers
        ├── xpSystem.js       # XP + auto-rank logic
        └── permissions.js    # Admin role checks
```

---

## 🔧 Adding New Commands

1. Create `src/commands/mycommand.js` — export `{ data, execute }`
2. That's it — commands are auto-loaded on startup

---

## ❓ FAQ

**Q: The Roblox cookie keeps expiring.**
A: Roblox cookies expire when you log into the account from a new location. Avoid logging in to the alt after setup.

**Q: Slash commands aren't showing up.**
A: Run `node deploy-commands.js`. Global commands take up to 1 hour. Set `GUILD_ID` for instant testing.

**Q: How do I find rank IDs for my group?**
A: Go to your group page → Manage → Roles. The rank ID (1–255) is listed next to each role.

**Q: How do I find a gamepass ID?**
A: Go to the game page → Store → click the gamepass → the ID is in the URL: `roblox.com/game-pass/**123456789**/...`
