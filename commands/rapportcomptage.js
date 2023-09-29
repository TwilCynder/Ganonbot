const { SlashCommandBuilder } = require('discord.js');


async function fetchMessages(channel){
	let quit = false, failure = false;
	let res;
	let manager = channel.messages;
	await manager.fetch({limit: 100}).then (
		(messages)=> {
			res = messages
		},
	).catch(
		(error) => {failure = true; console.error(error)}
	);

	if (failure) return false;

	do {
		console.log("Fetching another 100 messages in channel " + channel.name + " ; current count : " + res.size);
		await manager.fetch({limit: 100, before : res.last().id}).then(
			(messages) => {
				res = res.concat(messages);
				if (messages.size < 100) quit = true;
			},
		);
	} while(!quit);
		
	return Array.from(res.values());
}

function countUser(user){
	this.score = 0;
	this.user = user
}

function makeDayIndex(date){
	return "" + date.getFullYear() + date.getMonth() + date.getDay();
}

function day(date){
	this.year = date.getFullYear();
	this.month = date.getMonth();
	this.day = date.getDate();
	this.index = makeDayIndex(date);
	this.score = 0;
}

function day_toString(day){
	return day.day + "/" + day.month + "/" + day.year
}

function loadReport(file) {
}

function saveReport(file) {
}

function countReport(messages) {

    console.log(messages.length);

	//donc ici on analy précisément chaque message et on fournit un rapport d'activité complet
	//reste à décider
	//- où on le poste

	//Pour l'instant, fonctionne dans l'hypothèse où tout s'est bien passé niveau comptage (ex : le dernier nombre n'est pas un "99999999" de Flo)

	//TODO : gestion des erreurs, gestion des bugs de comptage, et puis ajouter des trucs
	
	let days = [];
	
	let users = {}, currentNumber = 0, lastValidNumber = 0, message, currentDay = {index: ""}, bestDay = {score : 0}, messageText, twil = 0;
	for (var i = messages.length - 1; i > 0; i--){
		message = messages[i]
		messageText = message.content;
		if (typeof messageText == "string") messageText = messageText.replace(' ', '')
		currentNumber = parseInt(messageText)
		if (currentNumber) {
			lastValidNumber = currentNumber;
			if (!users[message.author]){
				users[message.author] = new countUser(message.author)
			}
			users[message.author].score ++;
			if (message.author.id === "163274529286782976") {
				twil++;
			}
			
			if (makeDayIndex(message.createdAt) != currentDay.index) {
				//console.log(message.createdAt);
				currentDay = new day(message.createdAt);
				days.push(currentDay)
				//console.log(currentDay.day + '/' + currentDay.month + '/' + currentDay.year);
			}
			currentDay.score ++
			if (currentDay.score > bestDay.score) {
				bestDay = currentDay;
			}
		}
	}
	
	console.log("Score de Twil " + twil);
	
	//tri des users dans un array
	let userArray = [], user;
	for (let user in users){
		if (users.hasOwnProperty(user)) {
			userArray.push(users[user]);
		}
	}
		
	userArray.sort(
		(a, b) => {
			
			/*if (a.user.id === "225279874607087616") return 1
			if (b.user.id === "225279874607087616") return -1*/
			
			if (a.score > b.score) return -1
			if (a.score < b.score) return 1
			return 0
		}
	)
		
	//output
	let answer = "";
	answer += "Nous en sommes actuellement à : " + lastValidNumber + "\n \n";
	answer += "Personnes ayant participé : \n";
	
	for (let i = 0; i < userArray.length; i++){
	answer += i + 1 + " - " + userArray[i].user.username + " : " + userArray[i].score + " numéros (" + ((userArray[i].score / lastValidNumber) * 100).toString().substring(0,5) + " % / " + (userArray[i].score / twil).toString().substring(0,5) + " Twils) \n";
	}
	answer += "\n";
	answer += "Le record de progression en un jour a été atteint le " + bestDay.day + "/" + (bestDay.month + 1) + "/" + bestDay.year + " avec " + bestDay.score + " messages. \n"
	answer += currentDay.score + " messages ont été envoyés aujourd'hui. \n";
	//answer += "``` \n";

	let chart = [{
		x: [],
		y: [],
		type: "bar"
	}];
	
	for (let i = 0; i < userArray.length; i++){
		chart[0].x.push(userArray[i].user.username);
		chart[0].y.push(userArray[i].score);
	}
	
	let daysChart = [{
		x: [],
		y: [],
		type: "scatter"
	}]
	
	for (let i = 0; i < days.length; i++){
		daysChart[0].x.push(day_toString(days[i]));
		daysChart[0].y.push(days[i].score)
	}
	
	console.log("Generating graph (users)")
	/*var graphOptions = {filename: "countReport", fileopt: "overwrite"};
	plotly.plot(chart, graphOptions, function (err, msg) {
		console.log(msg);
	});*/
	
	console.log("Generating graph (days)")
	/*var graphOptions = {filename: "countReportDays", fileopt: "overwrite"};
	plotly.plot(daysChart, graphOptions, function (err, msg) {
		console.log(msg);
	});*/
	
	answer += "Graphe : https://plot.ly/~TwilCynder/2\n"
	answer += "Graphe : https://plot.ly/~TwilCynder/4"
	
	return answer;
}

function chanStats(channel){
	this.chan = channel;
	this.score = 0
}

function sendSeparateMessages(channel, text){
	let msg = ""
	let lines = text.split("\n")
	let total = 0
	let currentLine = "```\n"

	for (let i = 0; i < lines.length; i++){

		if (lines[i].length > 2000) return false;

		total += lines[i].length
		if (total > 1900){
			currentLine += "```"
			channel.send(currentLine)
			currentLine = "```\n"
			total = lines[i].length
		}
		currentLine += lines[i] + "\n"

	}
	channel.send(currentLine + "```")
}

module.exports = {
	data: new SlashCommandBuilder()
        .setName('rapportcompte')
        .setDescription('Refaire le décompte du méga compte de ses morts'),
    async execute(interaction) {
        interaction.reply({content: "Du travail ? Encore du travail ?", ephemeral: false});
        channel = await interaction.guild.channels.fetch('446787210423959553');
        fetchMessages(channel).then(
            (messages)=> {
                let text = countReport(messages);
                sendSeparateMessages(interaction.channel, text);
            }
        );
    },
};