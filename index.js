//requirements
require("dotenv").config();
const { channel } = require("diagnostics_channel");
const { Client, Intents, MessageEmbed, User } = require("discord.js");
const fs = require('fs');
const TwitchAPI = require('node-twitch').default

const twitch = new TwitchAPI({
    client_id: "tzbf5p2e9hv3u0ndnbk464avt0paak",
    client_secret: "4alslgy5eli6xvhwhuj2td7n67z0l2"
})

var serverID = "992065837202686033";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ["MESSAGE", "CHANNEL", "REACTION"] });

//function to post embeds
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
    functionsdir.welcome(client);

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
    .setDescription(`Welcome to the Seeker Community <@${member.id}>!\n\nMake sure you check-out the ${member.guild.channels.cache.get(ruleschannelid).toString()} to know what is and isn't permitted in this server and to get your member role! ❤`)
    .setColor(0xFF0000)
    .setImage('attachment://welcome.png')

    let channel = client.channels.cache.get("1000783736050286723")
    channel.send({ embeds: [embed],files:['./images/welcome.png']})
})


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
                .setAuthor({name:`${r.user_name}`, iconURL: profileImage, url: `https://www.twitch.tv/${twitchUsername}` })
                .setColor(0xFF0000)
                .setImage(`${r.getThumbnailUrl({width: 1920, height: 1080})}`)
            
            if(!isLiveMemory){

                liveChannel.send({ embeds:[embed], content: "@everyone"})
                isLiveMemory = true
            }
            
        }else{
            isLiveMemory = false
        }

    })
}

client.login(process.env.BOT_TOKEN)