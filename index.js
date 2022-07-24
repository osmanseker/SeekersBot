require("dotenv").config();
const{Client, Intents} = require("discord.js");
const {MessageEmbed} = require('discord.js');

var serverID = "992065837202686033";

const client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]});

client.on("ready",()=>{
    console.log("Ready")
})

client.on("messageCreate",msg =>{
    if(msg.content.toLowerCase()==="ping"){
        msg.reply("Night")
    }
    
    if(msg.content.toLowerCase()==="hello"){
        msg.reply("whatup")
    }
})


const embed = new MessageEmbed()
  .setTitle('Rules')
  .setDescription('These are the rules')

let channel = client.channels.cache.get(1000765418291609641)
channel.send({embeds: [embed]})












client.login(process.env.BOT_TOKEN)