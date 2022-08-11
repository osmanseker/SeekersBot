require("dotenv").config();
const { Client, Intents } = require("discord.js");
const fs = require('fs');

var serverID = "992065837202686033";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] , partials: ["MESSAGE", "CHANNEL", "REACTION"]});

//function to post embeds
var f = {}
const functionsFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionsFiles) {
    const func = require(`./functions/${file}`)

    f[file.replace('.js','')] = func
}

client.on("ready", () => {
    console.log("Ready")
    f.rules(client);
    f.welcome(client);
})

//test message to see if bot is live/reacts
client.on("messageCreate", msg => {
    if (msg.content.toLowerCase() === "hello") {
        msg.reply("hi")
    }

})


client.login(process.env.BOT_TOKEN)