require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();

var creatorId = '';
var creatorName = '';
var guilds = [];

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);
});

client.on('message', message => {
    // Set creatorid e.g. !creatorid 725750483666337922
    if(/^!creatorid\s[0-9]+/.test(message)) {
        creatorId = message.content.match(/[0-9]+/g)[0] // Match first number
        message.reply('Creator ID set to: ' + creatorId);
    }

    // Set creatorname e.g. !creatorname Spilgruppe
    if(/^!creatorname\s([a-zA-Z ]+)/.test(message)) {
        creatorName = message.content.match(/^!creatorname\s(.*)/)[1]; // Match everything after first space
        message.reply('Creator name set to: "' + creatorName + '"');
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    // Create channel
    try {
        if(newState.channel && newState.channel.id === creatorId) {
            // Get user obj
            let user = newState.member;
            this.guild;
            
            // Check if there is any object in array
            guilds.forEach((guild) => {
                if(typeof guild !== undefined) {
                    if(guild.guildId === newState.guild.id) {
                        this.guild = guild;
                        return;
                    }
                }
            })

            // Create guild object if nothing found
            if(!this.guild) {
                this.guild = {
                    guildId: newState.guild.id,
                    channels: []
                }
                
                guilds.push(this.guild);
            }
            
            channelSuffix = this.guild.channels.findIndex(x => x === undefined) !== -1 ? this.guild.channels.findIndex(x => x === undefined) : this.guild.channels.length;

            // Create new channel
            newState.guild.channels.create(creatorName + ' ' + channelSuffix, {type: 'voice'})
            .then(newChannel => {
                this.guild.channels.push(newChannel.id); // Add new channel to guild object
                
                user.voice.setChannel(newChannel); // Move user to new channel
            })
            .catch(console.error);
        }
    } catch (error) {
        console.log(error);
    }

    // Delete empty spawned channels
    try {
        this.guild;
        guilds.forEach((guild) => {
            if(typeof guild !== undefined) {
                if(guild.guildId === oldState.guild.id) {
                    this.guild = guild;
                    return;
                }
            }
        });

        if(this.guild) {
            // let this.guild = guilds.find(obj => obj.guildId === oldState.guild.id); // Guilds channel object e.g. { guildId: 1, channels: [1, 2] }
            let channelIndex = this.guild.channels.indexOf(oldState.channelID); // Channel index in guild objectspa
            // If channel exist and is empty, delete it
            if((channelIndex !== -1) && ( oldState.channel.members.size === 0)) {
                oldState.channel.delete()
                .then(() => {
                    delete this.guild[channelIndex];
                })
                .catch(console.error)
            }
        }
    } catch (error) {
        console.log(error)
    }
});

client.login(process.env.BOT_TOKEN);