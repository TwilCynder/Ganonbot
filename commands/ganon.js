const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('ganon')
        .setDescription('Qui suis-je ?'),
    async execute(interaction) {
        await interaction.reply('Bonsoir ! Je suis Ganonbot ! Haha !\n\nComme vous devez vous en douter, je suis encore en développement. Mais mon heure ne saurait tarder ! **Mouahahaha !**');
    },
};