const { MessageEmbed } = require('discord.js');

module.exports = async function(client){
    const embed = new MessageEmbed()
        .setDescription("Welcome to the Seeker Community!\n\nMake sure you check-out the Rules to know what is and isn't permitted in this server and to get your member role! ❤")
        .setColor(0xFF0000)
        .setImage('attachment://welcome.png')

    let channel = await client.channels.cache.get("1000783736050286723")
    await channel.send({ embeds: [embed],files:['./images/welcome.png']})
}

