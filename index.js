const Discord = require('discord.js');
const client = new Discord.Client();

var spawnerId = '725994476279169095';
var spawnedCahnnels = [];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    // Set channelid for spawner e.g. /bean spawnerid 725750483666337922
    let setSpawnerIdRegex = /^\/bean spawnerid [0-9]+/;
    if(setSpawnerIdRegex.test(message)) {
        spawnerId = message.content.match(/[0-9]+/g)[0]
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    // Create channel
    try {
        if(newState.channel.id === spawnerId) {
            // Get user obj
            let user = newState.member;
            
            // Get guild obj from spawnedCahnnels
            let spawnedChannelGuild = spawnedCahnnels.find(x => x.guildId === newState.guild.id);

            // Create guild object if nothing found
            if(spawnedChannelGuild === undefined) {
                spawnedChannelGuild = {
                    guildId: newState.guild.id,
                    channels: []
                }
                
                spawnedCahnnels.push(spawnedChannelGuild);
            }

            // Create new channel
            newState.guild.channels.create('Spil ' + '1', {type: 'voice'})
            .then(newChannel => {
                // Add new channel to guild object
                spawnedChannelGuild.channels.push(newChannel.id);

                user.voice.setChannel(newChannel); // Move user to new channel
            })
            .catch(console.error);
        }
    } catch (error) {

    }

    // Delete empty spawned channels
    try {
        // Find all spawned channels belonging to this guild
        let guildChannels = spawnedCahnnels.find(obj => obj.guildId === oldState.guild.id).channels;

        // If channel exist and is empty, delete it
        if((guildChannels.indexOf(oldState.channelID) !== -1) && (oldState.channel.members.size === 0)) {
            oldState.channel.delete()
            .then(response => {
                // console.log(response);
                // delete from guildChannels array
            })
            .catch(console.error)
        }
    } catch (error) {

    }
});



client.login('NzI1NzE0ODgzMjk0OTIwNzQ1.XvS-Zg.SFdgHQxGKtXOQS8L2eW8newPjJ8');