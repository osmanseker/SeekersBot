require("dotenv").config();
const{Client, Intents} = require("discord.js");

var serverID = "992065837202686033";

const client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]});


client.on("messageCreate",msg =>{
    if(msg.content.toLowerCase()==="ping"){
        msg.reply("Night")
    }
    
    if(msg.content.toLowerCase()==="hello"){
        msg.reply("whatup")
    }
    client.on("ready",()=>{
        console.log("Ready")
    })
})












client.login(process.env.BOT_TOKEN)