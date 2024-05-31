const { Client, Intents } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const token = process.env.DISCORD_TOKEN;

client.on('ready', () => {
  console.log('Discord client is ready!');
});
client.login(token);

module.exports = client;
