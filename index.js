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
        if(newState.channel && newState.channel.id === spawnerId) {
            // Get user obj
            let user = newState.member;
            let spawnedChannelGuild;
            
            // Check if there is any object in array
            spawnedCahnnels.forEach((item) => {
                if(typeof item !== undefined) {
                    if(item.guildId === newState.guild.id) {
                        spawnedChannelGuild = item;
                        return;
                    }
                }
            })

            // Create guild object if nothing found
            if(!spawnedChannelGuild) {
                spawnedChannelGuild = {
                    guildId: newState.guild.id,
                    channels: []
                }
                
                spawnedCahnnels.push(spawnedChannelGuild);
            }
            
            channelSuffix = spawnedCahnnels.findIndex(x => x === undefined) !== -1 ? spawnedCahnnels.findIndex(x => x === undefined)+1 : spawnedCahnnels.length;

            // Create new channel
            newState.guild.channels.create('Spilgruppe ' + channelSuffix, {type: 'voice'})
            .then(newChannel => {
                // Add new channel to guild object
                spawnedChannelGuild.channels.push(newChannel.id);

                user.voice.setChannel(newChannel); // Move user to new channel
            })
            .catch(console.error);
        }
    } catch (error) {
        console.log(error);
    }

    // Delete empty spawned channels
    try {
        let spawnedCahnnelObject;
        spawnedCahnnels.forEach((item) => {
            if(typeof item !== undefined) {
                if(item.guildId === oldState.guild.id) {
                    spawnedCahnnelObject = item;
                    return;
                }
            }
        })

        if(spawnedCahnnelObject) {
            let channelIndex = spawnedCahnnelObject.channels.indexOf(oldState.channelID); // Channel index in guild object
            
            // If channel exist and is empty, delete it
            if((channelIndex !== -1) && ( oldState.channel.members.size === 0)) {
                oldState.channel.delete()
                .then(() => {
                    delete spawnedCahnnels[channelIndex];
                })
                .catch(console.error)
            }
        }
    } catch (error) {
        console.log(error)
    }
});



client.login('NzI1NzE0ODgzMjk0OTIwNzQ1.XvS-Zg.SFdgHQxGKtXOQS8L2eW8newPjJ8');