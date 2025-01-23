const showInfo = require('../utils/logs/showInfo');
const showError = require('../utils/logs/showError');
const nconf = require('nconf');
const config = nconf.file({ file: 'config.json' });

const handleBattlepassCommand = async (message, botClient) => {
    const usedClient = botClient.user.self.displayName;
    
    const commandMatch = message.content.match(/^bot@(\w+)\s+(\w+)\s+(\w+)/);
    if (commandMatch) {
        const command = commandMatch[1];
        const purchased = commandMatch[2];
        const level = commandMatch[3];
        
        if (command === 'battlepass') {
            let access = 'commands:' + command;
            const admins = nconf.get('client:command_admin:admins') || ['oumar_boss'];
            if (nconf.get(access) === 'admin_only') {
                if (!admins.includes(message.author.id) || !admins.includes(message.author.displayName)) {
                    showError(`${usedClient} : You don't have permission to use this command.`);
                    return;
                }
                if (!purchased || !level) {
                    showError(`${usedClient} : No battlepass info supplied for "bot@battlepass".`);
                    return;
                }
                try {
                    await botClient.party.me.setBattlepass(purchased, level, undefined, undefined);
                    showInfo(`${usedClient} : Set the battlepass info to: \nIs Purchased: ${purchased}\nBP Level: ${level}`, 'commandInfo');
                } catch (error) {
                    showError('Error setting battlepass:', error);
                }
            } else {
                if (!purchased || !level) {
                    showError(`${usedClient} : No battlepass info supplied for "bot@battlepass".`);
                    return;
                }
                try {
                    await botClient.party.me.setBattlepass(purchased, level, undefined, undefined);
                    showInfo(`${usedClient} : Set the battlepass info to: \nIs Purchased: ${purchased}\nBP Level: ${level}`, 'commandInfo');
                } catch (error) {
                    showError('Error setting battlepass:', error);
                }
            }
        }
    }
};

module.exports = handleBattlepassCommand;