const showInfo = require('../utils/logs/showInfo');
const showError = require('../utils/logs/showError');
const nconf = require('nconf');
const config = nconf.file({ file: 'config.json' });

const handleLogoutCommand = async (message, botClient) => {
    const usedClient = botClient.user.self.displayName;
    
    const commandMatch = message.content.match(/^bot@(\w+)/);
    if (commandMatch) {
        const command = commandMatch[1];
        if (command === 'logout') {
            let access = 'commands:' + command;
            const admins = nconf.get('client:command_admin:admins') || ['oumar_boss'];
            if (nconf.get(access) === 'admin_only') {
                if (!admins.includes(message.author.id) || !admins.includes(message.author.displayName)) {
                    showError(`${usedClient} : You don't have permission to use this command.`);
                    return;
                }
                try { 
                    await botClient.party.me.clearEmote()
                    await botClient.leaveParty(false)
                    await botClient.logout(); 
                    showInfo(`${usedClient} : The bot is logged out`, 'commandInfo'); 
                } catch (error) { 
                    showError('Error logging out:', error);
                }
            } else {
                try { 
                    await botClient.party.me.clearEmote()
                    await botClient.leaveParty(false)
                    await botClient.logout(); 
                    showInfo(`${usedClient} : The bot is logged out`, 'commandInfo'); 
                } catch (error) { 
                    showError('Error logging out:', error);
                } 
            }
        };
    }
  };
  
  module.exports = handleLogoutCommand;