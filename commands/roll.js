const { SlashCommandBuilder } = require('discord.js');

function roll(x, y) {
    console.log('roll avec x = ' + x + ' et y = ' + y);
    // Renvoie une erreur si x ou y ne sont pas des entiers strictement positifs
    if (isNaN(x) || isNaN(y)) {
        return textes.erreurs.roll;
    }
    if (x < 1 || y < 1) {
        return textes.erreurs.roll;
    }
    
    // Pour éviter les erreurs, on limite x et y à 100
    if (x > 100) {
        console.log('x = ' + x + ' est trop grand. Réduction à x = 100');
        x = 100;
    }
    if (y > 100) {
        console.log('y = ' + y + ' est trop grand. Réduction à y = 100');
        y = 100;
    }
    
    // Cas x = 1
    if (x === 1) {
        var result = Math.floor((Math.random() * y) + 1); 
        return ':game_die: le résultat du dé ' + y + ' est : **' + result + '** !';
    }
    
    // Cas x > 1
    // i = 0 traité à part, c'est juste purement par choix esthétique afin de ne pas avoir de , en trop !
    var result = Math.floor((Math.random() * y) + 1);
    var sum = result;
    var reponse = ':game_die: le résultat des dés ' + y + ' sont : **' + result + '**';
    for (i = 1; i < x; i++) {
        result = Math.floor((Math.random() * y) + 1);
        sum += result;
        reponse += ', **' + result + '**';
    }
    reponse += '\n\n Pour un total de **' + sum + '** !';
    return reponse;
};

module.exports = {
	data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rouler x dés à y faces')
        .addIntegerOption(
            option =>
                option
                    .setName('nombre')
                    .setDescription('Le nombre de dés à rouler (1 par défaut)')
                    .setRequired(false))
        .addIntegerOption(
            option =>
                option
                    .setName('faces')
                    .setDescription('Le nombre de faces (100 par défaut)')
                    .setRequired(false)),
    async execute(interaction) {
        const x = interaction.options.getInteger('nombre') ?? 1;
        const y = interaction.options.getInteger('faces') ?? 100;
        await interaction.reply(roll(x,y));
    },
};