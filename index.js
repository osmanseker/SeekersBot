require("dotenv").config();
const { Client, Intents } = require("discord.js");
const fs = require('fs');

var serverID = "992065837202686033";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

var f = {}
const functionsFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionsFiles) {
    const func = require(`./functions/${file}`)
    console.log(func)
    f[file.replace('.js','')] = func
}
console.log(f);
client.on("ready", () => {
    console.log("Ready")
    f.rules(client);
})

client.on("messageCreate", msg => {
    if (msg.content.toLowerCase() === "ping") {
        msg.reply("Night")
    }

    if (msg.content.toLowerCase() === "hello") {
        msg.reply("whatup")
    }
})















client.login(process.env.BOT_TOKEN)