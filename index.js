require("dotenv").config();
const { Client, Intents, MessageEmbed } = require("discord.js");
const fs = require('fs');

var serverID = "992065837202686033";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ["MESSAGE", "CHANNEL", "REACTION"] });

//function to post embeds
var f = {}
const functionsFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionsFiles) {
    const func = require(`./functions/${file}`)

    f[file.replace('.js', '')] = func
}

client.on("ready", () => {
    console.log("SeekerBot is ready")
    f.rules(client);
    f.welcome(client);

    //message for wordle
    setInterval(() => {
        const embed = new MessageEmbed()
        .setTitle("It's Wordle Time!\n ")
        .setDescription("https://www.nytimes.com/games/wordle/index.html \n\nDon't forget to share your results! \n\nWill you be the today's Wordle Wrecker?")
        .setColor(0xFF0000)
        .setImage('attachment://wordle.png')

    let channel =  client.channels.cache.get("1007343624675143800")
    channel.send({ embeds: [embed], files:['./images/wordle.png']})

    },10000);

    
})


client.on("messageCreate", msg => {
    if (msg.content.toLowerCase() === "hello") {
        msg.reply("hi")
    }
})


client.login(process.env.BOT_TOKEN)