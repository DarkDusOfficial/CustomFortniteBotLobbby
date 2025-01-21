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
            if (nconf.get(access) === 'admin_only') {
                if (message.author.id !== nconf.get('owner')) {
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