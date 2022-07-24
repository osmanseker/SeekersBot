const { MessageEmbed } = require('discord.js');

module.exports = async function(client){
    const embed = new MessageEmbed()
        .setDescription("Let's get over a short list of rules real quick!\n\n1. Be Respectful (No crusing, sexism, bullying, racism,… If this happens you will get a warning but the second time is a ban!\n\n2. No NSFW content – Other forms of content can be send in the media channel\n\n3. Treat mods and admins with respect\n\n4. Don't share personal information in public chats\n\n5. Talk as much as you want in the “Just Chatting” channel so we can all have a great time together!\n\nPress the thumbs up to get your memeber role ❤")
        .setColor(0xFF0000)
        .setImage('attachment://rules.png')

    let channel = await client.channels.cache.get("1000765418291609641")
    await channel.send({ embeds: [embed],files:['./images/rules.png']})
}

