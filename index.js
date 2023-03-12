//requirements
require("dotenv").config();
const { Client, Intents, MessageEmbed, User, channel } = require("discord.js");
const fs = require('fs');
const ticketCommand = require('./moderation/ticket.js');
const TwitchAPI = require('node-twitch').default

const twitch = new TwitchAPI({
    client_id: "tzbf5p2e9hv3u0ndnbk464avt0paak",
    client_secret: "4alslgy5eli6xvhwhuj2td7n67z0l2"
})

var serverID = "992065837202686033";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ["MESSAGE", "CHANNEL", "REACTION"] });

//function to post embeds from functions folder
var functionsdir = {}
const functionsFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionsFiles) {
    const func = require(`./functions/${file}`)

    functionsdir[file.replace('.js', '')] = func
}

//Wordle message
let isSentWordle = false
//Livestream notification
let isLiveMemory = false

client.on("ready", () => {
    console.log("SeekerBot is ready")
    functionsdir.rules(client);

    setInterval(() => {
        const hours = new Date().getHours()
        if (hours == 0 && !isSentWordle) {
            sendWordle();
            isSentWordle = true
        }
        if (hours == 23) {
            isSentWordle = false
        }

        livestream();

        //set interval here, now its every 5 seconds
    }, 5000);

})


//function to welcome new members with message
const ruleschannelid = '1000765418291609641'
client.on('guildMemberAdd', member => {
    const embed = new MessageEmbed()
        .setDescription(`Welcome to the Seeker Community <@${member.id}>!\n\nMake sure you check-out the <#${ruleschannelid}> to know what is and isn't permitted in this server and to get your member role! ❤`)
        .setColor(0xFF0000)
        .setImage('attachment://welcome.png')

    let channel = client.channels.cache.get("1000783736050286723")
    channel.send({ embeds: [embed], files: ['./images/welcome.png'] })
})

//kick a member after 3 strikes when a link besides youtube or twitch is detected
const kickers = new Map();
client.on("messageCreate", async (message, member) => {
    if (message.author.bot) return; // Ignore messages from bots
    const isOwner = message.guild.ownerId === message.author.id;
    const kickCount = kickers.get(message.author.id) || 0;
    // Check if the message contains a link
    const messageContent = message.content.toLowerCase();
    if (messageContent.includes('http://') || messageContent.includes('https://')) {

        // Check if the link is not a YouTube or Twitch link
        if (!messageContent.includes('youtube.com') && !messageContent.includes('twitch.tv')) {
            // Kick the user from the server
            if (!isOwner){
                message.delete();
            if ((kickCount < 5)) {
                kickers.set(message.author.id, kickCount + 1);
                message.channel.send(`${message.author} You are now on strike ${kickCount + 1} for sending a link that is not allowed. Please reread the <#${ruleschannelid}> again.`);
                console.log(kickCount);
                console.log(kickers);
            }
            if (kickCount >= 5) {
                message.member.kick();
                message.channel.send(`${message.author} has been kicked because of sending unauthorized links 5 times!`);
                kickers.delete(message.author.id);
            }
            }
        }
    }
});


//timeout a member when using blacklist words, after 3 timeouts its a kick
// map to keep track of timeouts for each member
const timeouts = new Map();
const blacklist = ["shit"];
const maxTimeouts = 3; // maximum number of timeouts before kick
client.on("messageCreate", async (message, member) => {
    if (message.author.bot) return;
    
    const timeoutCount = timeouts.get(message.author.id) || 0;
    const content = message.content.toLowerCase();
    
    if (blacklist.some(word => content.includes(word))) {
        message.delete();
        //message.reply(`currently you are on ${timeoutCount + 1} timeouts`);

        if ((timeoutCount < maxTimeouts)) {
            timeouts.set(message.author.id, timeoutCount + 1);
            console.log(timeoutCount);
            console.log(timeouts);
        }
        if (timeoutCount >= maxTimeouts) {
            message.member.kick();
            message.channel.send(`${message.author} has been kicked because of 3 timeout strikes! Please do not use any profanity words`);
            timeouts.delete(message.author.id);
        }
        else {
            timeouts.set(message.author.id, timeoutCount + 1);
            const member = message.member;
            if (member) {
                try {
                    await member.roles.add("1081363922986221648"); //ID of  timeout role
                    message.channel.send(`${member} has been timed out for profanity and now has ${timeoutCount + 1}  timeout(s). After the 3rd timeout you will be kicked!`);
                    setTimeout(async () => {
                        await member.roles.remove("1081363922986221648");
                    }, 300000); // remove the timeout role after 5 minutes
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
})



//start a poll
client.on('messageCreate', message => {
    if (message.content.startsWith('!poll')) {
        const question = message.content.slice(5);
        const embed = new MessageEmbed()
            .setTitle('Poll')
            .setDescription(question)
            .setColor('#FF0000')
            .setFooter({ text: 'React to vote' });

        message.channel.send({ embeds: [embed] }).then(embedMessage => {
            embedMessage.react('👍');
            embedMessage.react('👎');
        });
    }
});


client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.emoji.name === '👍') {
    } else if (reaction.emoji.name === '👎') {
    }
});


//function for the daily wordle messages in embed
function sendWordle() {
    const embed = new MessageEmbed()
        .setTitle("It's Wordle Time!\n ")
        .setDescription("https://www.nytimes.com/games/wordle/index.html \n\nDon't forget to share your results! \n\nWill you be the today's Wordle Wrecker?")
        .setColor(0xFF0000)
        .setImage('attachment://wordle.png')

    let channel = client.channels.cache.get("1007343624675143800")
    channel.send({ embeds: [embed], files: ['./images/wordle.png'] })
}



//function to post livestream message in embed
const livestream = async () => {
    const twitchUsername = "seekergamingg"
    let profileImage = ""
    twitch.getUsers(twitchUsername).then(async data => {
        profileImage = data.data[0].profile_image_url
    })
    await twitch.getStreams({ channel: twitchUsername }).then(async data => {
        const r = data.data[0]
        let liveChannel = client.channels.cache.get("1008385845595738153")
        if (r != undefined) {
            const embed = new MessageEmbed()
                .setTitle(`${r.user_name} is live!`)
                .setDescription(`[${r.title}](https://www.twitch.tv/${twitchUsername})`)
                .addField(`Viewers`, `${r.viewer_count}`)
                .addField(`Playing`, `${r.game_name}`)
                .setAuthor({ name: `${r.user_name}`, iconURL: profileImage, url: `https://www.twitch.tv/${twitchUsername}` })
                .setColor(0xFF0000)
                .setImage(`${r.getThumbnailUrl({ width: 1920, height: 1080 })}`)

            if (!isLiveMemory) {

                liveChannel.send({ embeds: [embed], content: "@everyone" })
                isLiveMemory = true
            }

        } else {
            isLiveMemory = false
        }

    })
}


client.login(process.env.BOT_TOKEN)