require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const rankRoles = [
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Immortal',
    'Radiant'
];

var creatorId = process.env.CREATOR_ID;
var creatorName = process.env.CREATOR_NAME;
var reactRankId = process.env.REACTION_ID;
var channels = [];

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    // Create channel
    try {
        if(newState.channel && newState.channel.id === creatorId) {
            // Get user obj
            let user = newState.member;
            let channelSuffix = (channels.findIndex(x => x === undefined) !== -1 ?channels.findIndex(x => x === undefined) : channels.length) + 1; // Look for empty slots as suffix, to avoid suffix id duplicate
            let channelName = creatorName + ' ' + channelSuffix;

            // Create new channel
            newState.guild.channels.create(channelName, {type: 'voice', parent: process.env.CREATOR_CATEGORY_ID})
            .then(newChannel => {
                channels.push(newChannel.id); // Add new channel to guild object
                user.voice.setChannel(newChannel); // Move user to new channel
            })
            .catch(console.error);
        }
    } catch (error) {
        console.log(error);
    }

    // Delete empty spawned channels
    try {
        let channelIndex = channels.indexOf(oldState.channelID);

        // If channel exist and is empty, delete it
        if((channelIndex !== -1) && (oldState.channel.members.size === 0)) {
            oldState.channel.delete()
            .then(() => {
                delete channels[channelIndex];
            })
            .catch(console.error)
        }
    } catch (error) {
        console.log(error)
    }
});

client.on('messageReactionAdd', async  (reaction, user) => {
    // If reaction is partial, try to fetch it (used for old messages)
    if(reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.log(error);
            return;
        }
    }

    // Check if reacted to the correct message
    if(reaction.message.id === reactRankId) {
        // Find  the react role in the guild
        let guildRole = reaction.message.guild.roles.cache.find(role => role.name === reaction.emoji.name)
        let roleManager = reaction.message.member.roles;
    
        if(guildRole) {
            // Clear old rank roles
            roleManager.cache.forEach(role => {
                if(rankRoles.indexOf(role.name) !== -1) {
                    roleManager.remove(role);
                }
            });
        
            // Add new role
            roleManager.add(guildRole)
            .catch(console.error);
        }
    }
});

client.login(process.env.BOT_TOKEN);