/*
	GANONBOT
	Créé par Der Siebte Schatten & TwilCynder
	Développé par l'équipe de la chatbox PdZ pour le chatbox PdZ
	
	Tous droits réservés, 2017-2022
*/

// Ne pas toucher à ces constantes !!!
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const { token, clientID } = require('./config.json');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const XMLHttpRequest = require('xhr2');
const plotly = require("plotly")("TwilCynder","NmoOQ41YACKfPAFBZz8F")
const dataUriToBuffer = require('data-uri-to-buffer')
const countPath = './count_raw.txt';
const statsPath = './count_stats.txt';

// Récupération des commandes
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


// Ne pas toucher ! Tâches à l'arrêt du processus !
async function onExit(exitType) {
	if (exitType === 'SIGINT') {
		console.log('Arrêt demandé par l\'utilisateur');
		//await canaldev.send('Arrêt volontaire du bot pour maintenance');
		//await shitpost.send(textes.messages.exit);
	}
	if (exitType === 'uncaughtException') {
		console.log('Arrêt du bot sur erreur !');
		await canaldev.send('Arrêt du bot sur erreur !');
		await shitpost.send(textes.erreurs.exit);
	}
	if (exitType === 'SIGUSR') {
		console.log('Arrêt sur kill');
		await canaldev.send('Arrêt du bot ordonné par le serveur ! Retour prévue à l\'issue des opérations de maintenance automatisées...');
		await shitpost.send(textes.messages.autoexit);
	}
	console.log('Déconnexion en cours...');
	await client.destroy();
	console.log('Déconnexion réussie !');
	if (exitType !== 'uncaughtException') {
		process.exit();
	}
}

// Tâches après connexion du bot
client.once(Events.ClientReady, c => {
	const canaldev = client.channels.cache.get('362199904799686658');
	const chatbox = client.channels.cache.get('162153388782387201');
	const countchannel = client.channels.cache.get('446787210423959553');
	const shitpost = client.channels.cache.get('273377033843638273');
	
	canaldev.send("Ganon v0.0.0.0.0.1 booted");
	console.log('Okay ! Je suis prêt !');
});
// Connexion
client.login(token);

// Réaction aux évènements
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: textes.erreurs.exit, ephemeral: true });
	}
});

// Tableaux des messages et d'autres données
const textes = {
	messages: {
		avatar: "tu veux ton avatar ? Tu le veux ? Eh bien le voilà ! ",
		doublon: 'Trop tard ! Tu t\'es fait devancer ! Ha ha ha !',
		login: "Je suis de retour... pour vous jouer un mauvais tour...",
		autoexit: 'Je dois me retirer, le grand maître a besoin de repos...',
		exit: 'Je reviendrai...',
		count: 'Du travail ? Encore du travail ?'
	},

	erreurs: {
		roll: ':anger: Gros nul de la syntaxe ! La syntaxe correcte est `!roll [x]dy`, avec x (> 0, optionnel) le nombre de dés et y (> 0) le nombre de faces !',
		replique: ':anger: Cette réplique n\'existe pas...',
		exit: 'Enfer et damnation ! Une puissance obscure vient de me mettre à mal ! Informez-en de suite les développeurs !',
		media: ':anger: Ce média n\'existe pas...',
		infini: ':anger: Alors on essaie de me faire encore du mal, hein ? À me jeter dans les abysses de la boucle infinie ? Espèce de bachi-bouzouk !'
	},

	repliques: {
		vent: "Le vent... souffle...",
		feu: "Noooonnnn, pas dans le cratère ! Ça brûle !",
		cauchemar: "À l’heure du plus sombre cauchemar, lorsque ni soleil ni lune ne sont à l’horizon, je prends Zelda en mon pouvoir et la garderai en ma prison !",
		alliance: "Joins-toi à moi, Link, et sur Koridai, je ferai de toi le plus grand ! Tu vas mourir autrement !",
		ganon: "~Les lave-linges durent plus longtemps avec Ganon !~",
		sarcasme: "La pluie de tes sarcasmes glisse sur ma toile cirée d'indifférence"
	},
};

const donnees = {
	media: {
		dommage : 'https://www.youtube.com/watch?v=4xDP23DxZ6k',
		moche : 'https://www.youtube.com/watch?v=NOm97OyJV1w',
		ah : 'https://www.tenor.co/EBNw.gif',
		salaud : 'https://youtu.be/qznbecUX3Fc',
		bien : 'https://www.youtube.com/watch?v=IZWz7XuwQqA',
		popopo : 'https://www.youtube.com/watch?v=_dhOa8kPiYs',
		sel : 'https://youtu.be/F_rnK3BaaY0',
		problèmes : 'https://www.youtube.com/watch?v=gNI9a-K1JoU',
		non : 'https://www.youtube.com/watch?v=caXgpo5Ezo4',
		dérape : 'https://cdn.discordapp.com/attachments/162153388782387201/709312493800914974/EVL61tFWAAAm6ti.jpg',
		oof : 'https://youtu.be/7NFwhd0zsHU',
		songnon : 'https://cdn.discordapp.com/attachments/273377033843638273/820699620375789618/20180130_185333.png'
	}
};

// Fonctions utiles
function parametersParse(parameters) {
	// Ignore tous les espaces situés après la commande
	return parameters.replace(/\s+/g, '');
}

function replique(parameters) {
	if (parameters === 'liste') {
		return {liste: true, clefs: Object.keys(textes.repliques)};
	}
	
	if (parameters.startsWith('alliance:')) {
		var str = textes.repliques['alliance'];
		return str.replace("Link", parameters.substring(9))
	}
	if (parameters.startsWith('cauchemar:')) {
		var str = textes.repliques['cauchemar'];
		return str.replace("Zelda", parameters.substring(10))
	}

	if (parameters.length === 0) {
		// Pas de paramètre, renvoi aléatoire
		var rand = Math.floor((Math.random() * Object.keys(textes.repliques).length));
		parameters = Object.keys(textes.repliques)[rand];
		console.log('Réplique aléatoire : ' + parameters);
	}
	
	return textes.repliques[parameters];
}

function media(parameters) {
	if (parameters === 'liste') {
		return {liste: true, clefs: Object.keys(donnees.media)};
	}
	
	return donnees.media[parameters];
}

function count(messages){
	var c = 0;

	for (var i = messages.length - 1; i > 0; i++){
		c = parseInt(messages[i].content)
		if (c != NaN){
			break;
		}

	}
	return c;
}

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
		console.log("Fetching another 100 messages in channel " + channel.name);
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
	
	//console.log("Score de Twil " + twil);
	
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
	var graphOptions = {filename: "countReport", fileopt: "overwrite"};
	plotly.plot(chart, graphOptions, function (err, msg) {
		console.log(msg);
	});
	
	console.log("Generating graph (days)")
	var graphOptions = {filename: "countReportDays", fileopt: "overwrite"};
	plotly.plot(daysChart, graphOptions, function (err, msg) {
		console.log(msg);
	});
	
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

function theUltimateReport(messages){

	let users = {}, message, currentDay = {index: ""}, bestDay = {score : 0}, messageText, total = messages.length, chans = {};
	for (var i = messages.length - 1; i > 0; i--){
		message = messages[i]
		messageText = message.content;

		if (!users[message.author]){
			users[message.author] = new countUser(message.author)
		}
		users[message.author].score ++;
		
		if (makeDayIndex(message.createdAt) != currentDay.index) {
			//console.log(message.createdAt);
			currentDay = new day(message.createdAt);
			//console.log(currentDay.day + '/' + currentDay.month + '/' + currentDay.year);
		}
		currentDay.score ++
		if (currentDay.score > bestDay.score) {
			bestDay = currentDay;
		}

		if (!chans[message.channel]){
			chans[message.channel] = new chanStats(message.channel)
		}
		chans[message.channel].score ++
	}
	
	//tri des users dans un array
	let userArray = [], user;
	for (let user in users){
		if (users.hasOwnProperty(user)) {
			userArray.push(users[user]);
		}
	}
		
	userArray.sort(
		(a, b) => {
			
			if (a.score > b.score) return -1
			if (a.score < b.score) return 1
			return 0
		}
	)

	//tri des chans dans un array
	let chanArray = [];
	for (let chan in chans){
		if (chans.hasOwnProperty(chan)){
			chanArray.push(chans[chan]);
		}
	}

	chanArray.sort(
		(a, b) => {
			if (a.score > b.score) return -1
			if (a.score < b.score) return 1
			return 0
		}
	)

	//output
	answer = "STATS DE TOUT LE SERVEUR\n\n"

	answer += "Un total de " + total + " messages ont été envoyés.\n\n"

	answer += "Participations : "
	for (let i = 0; i < userArray.length; i++){
		answer += userArray[i].user.username + " : " + userArray[i].score + " messages (" + 
		((userArray[i].score / total) * 100).toString().substring(0,5) + "%).\n ";
	}

	answer += "\nRépartition des channels : \n"

	for (let i = 0; i < chanArray.length; i++){
		answer += chanArray[i].chan.name + " : " + chanArray[i].score + " messages (" + 
		((chanArray[i].score / total) * 100).toString().substring(0,5) + "%).\n ";
	}

	answer += "\n";
	answer += "Le jour le plus actif fut le " + bestDay.day + "/" + (bestDay.month + 1) + "/" + bestDay.year + " avec " + bestDay.score + " messages. \n"
	answer += currentDay.score + " messages ont été envoyés aujourd'hui. \n"

	return answer
}

function erreur(num1, num2) {
	//console.log('Comparaison entre ' + num1 + ' et ' + num2);
	if (!num1 | !num2) {
		return false;
	}
	if (num1 === num2) {
		return 1;
	}
	if (num1 < num2 | num1 > num2 + 1) {
		return 2;
	}
	return 3;
}

async function doublon(id) {
	let p = countchannel.fetchMessages({limit: 20});
	let messagesArray = [];
	let i, j;
	let a;
	let error;

	p.then (
		(messages)=> {
			messagesArray = messages.array();
		}
	)
	await p;
	
	for (i = 0; i < 20; i++) {
		if (messagesArray[i].id === id) {
			j = i;
			a = parseInt(parametersParse(messagesArray[i].content));
			break;
		}
	}
	for (i = j + 1; i < 20; i++) {
		//console.log('Checking message ' + messagesArray[i].content);
		error = erreur(a, parseInt(parametersParse(messagesArray[i].content)));
		if (error) {
			return error;
		}
	}
	return false;
}

function giveLeRole(memberName){
	let roleID = '509478133380939776'
	let member = getMemberByName(memberName)
	member.addRole(roleID)
}

function getMemberByName(name){
	let members = chatbox.members.array()
	
	for (member of members){
		if (member.user.username == name){
			return member
		}
	}
}

// Réactions aux messages (obsolète)

client.on('message', async function(message) {
	/*
	// Avatar de l'utilisateur
	if (message.content === '!avatar') {
		message.reply(textes.messages.avatar + message.author.avatarURL);
	}
	
	// Répliques
	if (message.content.startsWith('!réplique')) {
		var parameters = message.content.substring(9)
		
		//La deuxième condition préviens le lancement de la commande par erreur (s'il y a un caractère autre qu'un espace après la commande)
		if (parameters === '' || parameters.startsWith(' ')) {
			parameters = parametersParse(parameters);
			var result = replique(parameters);
			
			if (result === undefined) {
				message.channel.send(textes.erreurs.replique);
			} else if (!result.liste) {				
				message.channel.send('_```fix\n' + result + '\n```_');
			} else {
				var str = "Liste des répliques en mémoire : \n_```css\n"
				for (var i in result.clefs) {
					if (result.clefs[i] === 'alliance' || result.clefs[i] === 'cauchemar') {
						str += result.clefs[i] + ' :nom\n';
					} else {
						str += result.clefs[i] + '\n';
					}
				}
				str += '```_';
				message.channel.send(str);
			}
		}
	}
	
	if (message.content.startsWith('!admins')){
		message.channel.send("Liste des admins : Keyrann Sky'sson")
	}*/

	//Indiquer qui a sorti le nombre en premier dans le décompte et détecter les erreurs
	if (message.channel === countchannel) {
		if (!parseInt(parametersParse(message.content))) {
			return;
		}
		let d = doublon(message.id);
		let result;
		d.then(function(value) {
			result = value;
		});
			
		//await d;
		if (result === 1) {
			console.log('doublon détecté !');
			message.react(message.guild.emojis.get('407181167008415744'));
		}
		if (result === 2) {
			console.log('erreur de compte détecté !');
			message.react(message.guild.emojis.get('365055246537457664'));
		}
	}

	if (message.content === '!countReport'){
		message.channel.send(textes.messages.count);
		let p = fetchMessages(client.channels.get('446787210423959553'));
		p.then( 
			(messages)=> {
				let report  = countReport(messages);
				if (report){
					sendSeparateMessages(message.channel, report);
				}
			}
		)	
		
	}

	// Sortir un média connu
	if (message.content.startsWith('!média')) {
		var parameters = message.content.substring(6)
		
		//La deuxième condition préviens le lancement de la commande par erreur (s'il y a un caractère autre qu'un espace après la commande)
		if (parameters === '' || parameters.startsWith(' ')) {
			parameters = parametersParse(parameters);
			var result = media(parameters);
			
			if (result === undefined) {
				message.channel.send(textes.erreurs.media);
			} else if (!result.liste) {				
				message.channel.send(result);
			} else {
				var str = "Liste des médias en mémoire : \n_```css\n"
				for (var i in result.clefs) {
					str += result.clefs[i] + '\n';
				}
				str += '```_';
				message.channel.send(str);
			}
		}
	}
	
	// Chat aléatoire (via TheCatAPI.com)
	if(message.content === '!chat') {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://thecatapi.com/api/images/get?api_key=MjU5MzAz', true);
		req.send(null);
		req.onreadystatechange = function() {
			if(this.readyState == this.HEADERS_RECEIVED) {
				message.channel.send(req.responseURL);
			}
		}
	}
	/*
	//Mentionne celui qui vient de le mentionner, sauf Colgate	
	if (message.mentions.users.has('361929828708122625') && message.author.id !== '361929828708122625' && !message.content.startsWith("!said")) {
		if (message.author.id === '331014345808936961') {
			message.channel.send('non');
		} else {
			message.channel.send('<@' + message.author.id + '>');
		}
	}
	
	
	//SCHLOURP
	if (message.content === '!schlourp') {
		message.channel.send('https://tenor.com/view/tongue-lick-lickatung-yuck-gross-gif-13598819');
	}
	
	//Test nouveau compte
	if (message.content.startsWith("!test")){
		let p = testfetch();
		await p;
		console.log(p);
	}
	
	if (message.content.startsWith("!judge")){
		var parameters = message.content.substring(6)
		let name = parameters.trim()
		
		if (message.author.id === "163274529286782976") {
			giveLeRole(name)
		} else {
			message.channel.send("T'es qui toi ? (la réponse n'étant pas Twil, ouste)")
		}
			
	}

	if (message.content.startsWith('!pseudo')) {
		if (message.content === '!pseudo') {
			message.guild.me.setNickname(null);
		} else {
				message.guild.me.setNickname(message.content.replace('!pseudo ', ''));
		}
	}

	if (message.content.startsWith("!tur")){
		console.log("Starting the ultimate report")
		let guild = message.channel.guild
		let p = fecthMessagesGuild(guild, ['446787210423959553'] )
		p.then( 
			(messages)=> {
				let report = theUltimateReport(messages);
				if (report){
					sendSeparateMessages(message.channel, report);
				}
			}
		)	
	}*/
});


// Arrivée d'un nouveau venu
client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find('name', 'chatbox');
	// S'il n'y a pas de canal #chatbox sur ce serveur, rend cette commande inactive !
	if (!channel) return;
	channel.send(`Salutations **${member}** et bienvenue dans notre antre. Prépare-toi à découvrir le côté obscur ! **Mouahahaha !**`);
});


//Déconnexion du bot à l'arrêt
process.on('SIGINT', onExit.bind(null, 'SIGINT'));
process.on('uncaughtException', (err) => {
	onExit.bind(null, 'uncaughtException');
});
process.on('SIGUSR', onExit.bind(null, 'SIGUSR'));

