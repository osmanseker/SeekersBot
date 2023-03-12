const { SlashCommandBuilder } = require ('@discordjs/builders');
const { EmbedBuilder, ActionRowbuilder, ButtonBuildder, ButtonStyle, ChannelType, ButtonInteraction, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Use this command to create a ticket'),
    async execute (interaction, client) {

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({content: "You must be an administrator to create a ticket message"})

        const button = new ActionRowbuilder()
        .addComponents(
            new ButtonBuildder()
            .setCustomId('Button')
            .setEmoji('📩')
            .setLabel('Create Ticket')
            .setStyle(ButtonStyle.Secondary),
        )

            const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle("Tickets & Support")
            .setDescription('Click the button below to talk to mods (create a ticket)')

            await interaction.reply({embeds: [embed], components: [button] });
            
            const collector = await interaction.channel.createMessageComponentCollector();

            collector.on('collect', async i => {
                await i.update({embeds: [embed], components: [button]});

                const channel = await interaction.guild.channels.create({
                    name: `ticket ${i.user.tag}`,
                    type: ChannelType.GuildText,
                    parent: '1082003898484654240'
                });
            })
            
            channel.permissionOverwrite.create(i.user.id, { ViewwChannel: true, SendMessages: true});
            channel.permissionOverwrite.create(channel.guild.roles.everyone, { ViewwChannel: false, SendMessages: false});

            channel.send({ content: `Welcome to your ticket ${i.user}. Once finished, the mod will close this ticket!`});
            i.user.send(`Your ticket within ${i.guild.name} has been created. You can view it in ${channel}.`);
            i.user.send(``).catch(err => {return;})

    }
}