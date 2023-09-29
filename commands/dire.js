const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('dire')
        .setDescription('Fait dire au bot une phrase')
        .addStringOption(option =>
            option
                .setName('phrase')
                .setDescription('La phrase à faire répéter au bot')
                .setRequired(true)),
    async execute(interaction) {
        const phrase = interaction.options.getString('phrase');
        await interaction.channel.send(phrase);
        await interaction.reply({content: "C'est fait mon seigneur !", ephemeral: true});
    },
};