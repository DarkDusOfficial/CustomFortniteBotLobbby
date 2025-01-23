const {
  discord_status_type, discord_status, run_discord_client
} = require('../structs/config');

const fs = require('fs');
const path = require('path');
const { Client: Dclient, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const showInfo = require('../utils/logs/showInfo');
const showError = require('../utils/logs/showError');

async function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

function initializeDiscordBot() {
  if (!process.env.DISCORD_TOKEN) {
    showError("[DISCORD] DISCORD_TOKEN is not defined in environment variables.", 'sysError');
    return;
  }

  const dclient = new Dclient({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
  });

  dclient.commands = new Map();

  dclient.once('ready', () => {
    showInfo(`[DISCORD] Bot online as ${dclient.user.tag}!`, 'green');
    dclient.user.setActivity(discord_status, { type: discord_status_type });

    const commands = [];
    const commandsPath = path.join(__dirname, './commands');

    fs.readdirSync(commandsPath).forEach(file => {
      try {
        const command = require(path.join(commandsPath, file));
        if (command.data && command.execute) {
          dclient.commands.set(command.data.name, command);
          commands.push(command.data.toJSON());
        } else {
          showError(`[DISCORD] Invalid command file skipped: ${file}`);
        }
      } catch (error) {
        showError(`[DISCORD] Error loading command file: ${file}`);
        console.error(error);
      }
    });

    dclient.application.commands.set(commands)
      .then(() => {
        showInfo(`[DISCORD] ${commands.length} commands successfully registered!`, 'green');
      })
      .catch((error) => {
        showError("[DISCORD] Error refreshing commands:");
        console.error(error);
      });
  });

  dclient.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = dclient.commands.get(interaction.commandName);

    if (!command) {
      const embed = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Unknown command.');
      return interaction.reply({ embeds: [embed] });
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      showError(`[DISCORD] Error executing command: ${interaction.commandName}`);
      console.error(error);
      const embed = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('There was an error executing the command.');
      return interaction.reply({ embeds: [embed] });
    }
  });

  if (run_discord_client) {
    dclient.login(process.env.DISCORD_TOKEN)
      .then(() => showInfo("[DISCORD] Client successfully logged in!", 'green'))
      .catch((error) => {
        showError("[DISCORD] Error logging in:", 'sysError');
        console.error(error);
      });
  } else {
    showInfo("[DISCORD] Client disabled.", 'green');
  }
}

module.exports = initializeDiscordBot;