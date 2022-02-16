"use strict";

const { Client, MessageEmbed } = require('discord.js');
const cheerio = require("cheerio");
const request = require("request");
const logger = require("winston");

const conf = require("./conf.json");
const db = require("./db.js");
const lutris = require("./lutris.js");
const youtube = require("./youtube.js");
const giphy = require("./giphy.js");
const meme = require("./meme.js");
const aussie = require("./aussie.js");

db.connect();
db.updateSchema();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true,
});
logger.level = "debug";

const tickleMeFrojoe = function(msg, args) {
	var nums = args[0].split("d");
	if (nums.length == 2 && nums[0].length < 3 && nums[1].length < 5) {
		var totalroll = 0;
		var num = parseInt(nums[0]);
		var die = parseInt(nums[1]);
		if (num > 0 && die > 0 && num == nums[0] && die == nums[1]) {
			var rolls = [];
			var c = 0;
			for (var i = 0; i < num; i++) {
				c = Math.floor(Math.random() * die) + 1;
				totalroll += c;
				rolls.push(c);
			}
			return "<@" +
				msg.author.id +
				"> rolled a " +
				totalroll +
				" (" +
				rolls.join(" + ") +
				")";
		}
	}
	return "Usage: !frojoe XdY\nWhere: X and Y are members of ℕ*, X < 100, and Y < 10000";
}

const linuxgnuruGoingToBed = function () {
	const goingToBedQuotes = [
		"anywho; i'm going to bed; maybe i can get 2 hours of sleep",
		"ffs\ni'm going to bed.",
		"TIL\nalso i'm going to bed now as it's 2 minutes until midnight",
		"i think it's time i went to bed ...",
		"woah\nok, i'm not going to bed anytime soon",
		"right; well i haven't gone to bed yet and it's now 5:25am so laters",
		"Ok... 30 min of RotTR then to bed. Honestly",
		"And now I haz to go to bed because 1)I'm old and 2) I have to get up at 4:00am",
		"so; back to finishing watching LGC LDW\nand then bed",
		"damn it; and here i was hoping to go to bed early",
		"anyway; off to bed so i can sleep and maybe make it in 7 hours for LGC",
		"aww damn it; it's past my bed time now :frowning:",
		"i have been awake for 27 hours time to go to bed",
	];
	var quoteIndex = Math.floor(Math.random() * goingToBedQuotes.length);
	return goingToBedQuotes[quoteIndex];
}

// Initialize Discord Bot
var bot = new Client()
bot.login(conf["discord"]["auth_token"])

bot.on("ready", () => {
	//this.setPresence({ game: { name: "with itself" } });
	logger.info("Connected");
	logger.info("Logged in as: ");
	logger.info(bot.user.id + " - (" + bot.user.username + ")");
});

bot.on("any", event => {
	if (event.op == 0) return;
	// console.log(Date() + " - event: " + JSON.stringify(event));
});

bot.on("message", async (msg) => {
	const channelID = msg.channel.id
	const userID = msg

	if (msg.content.substring(0, 1) == "!") {
		var args = msg.content.substring(1).split(" ");
		var cmd = args[0];
		// console.log("cmd: " + cmd);
		args = args.splice(1);

		switch (cmd) {
			case "turbobrad":
			case "strider":
				var victim = conf["victims"][cmd];
				msg.channel.send(makeInsult(victim));
				break;
			case "member":
				msg.channel.send(member());
				break;
			case "wat":
				msg.channel.send(watIs(args));
				break;
			case "mfoxdogg":
				msg.channel.send(foxxxify(args));
				break;
			case "mark":
				msg.channel.send(mark());
				break;
			case "lutris":
				let lutrisText = "wat"
				if (args.length > 0) {
					lurisText = lutris.searchLutris(args);
				}
				msg.channel.send(lutrisText);
				break;
			case "frojoe":
				msg.channel.send(tickleMeFrojoe(msg, args))
				break;
			case "linuxgnuru":
				msg.channel.send(linuxgnuruGoingToBed());
				break;
			case "mir":
				const giph = await giphy.getRandomGif("waifu")
				msg.channel.send(giph);
				break;
			case "mirppc":
				msg.channel.send("MOAR CORES!");
				break;
			case "img":
				const whatIsImg = "IMG was founded in 1960 in Cleveland, Ohio by Mark McCormack, an American lawyer who spotted the potential for athletes to make large incomes from endorsement in the television age; he signed professional golfers Arnold Palmer, Gary Player and Jack Nicklaus as his first clients who collectively are known as The Big Three."
				msg.channel.send(whatIsImg);
				break;
			case "atomicass":
				const _meme = await meme.makeMeme(args)
				if (_meme) {
					msg.channel.send(_meme)
				}
				break;
			case "aussie":
				msg.channel.send(aussie.flipText(args));
				break;
			case "jfss":
				var f = [
					"Spunky",
					"Crispy",
					"Undercooked",
					"Wet Hot American",
					"Moistened",
					"Dirty",
					"Spicy, Spicy",
					"Crunchy",
					"Wildly Overrated",
					"Speedy",
					"S-Club 7-branded",
					"Jazzy",
					"Dilapidated",
					"Jizzy",
					"Prematurely-Birthed",
					"Hairy",
					"Hobgoblin's",
					"Spermy",
					"Stinky",
					"Clean Shaven",
					"Mystic",
					"Rectally-Inserted",
					"Erotically-Awakened",
					"Urine-Flavored",
					"Squeaky",
					"Soggy",
					"Pubic",
					"Big Black",
				];
				var l = [
					"Cumdumpsters",
					"Areolas",
					"Uvulas",
					"Undies",
					"Jizzboys",
					"Rectums",
					"Dildos",
					"Cocklobsters",
					"Milkshakes",
					"Lady-fingers",
					"Hams",
					"Bottoms",
					"Fatties",
					"Wizzards",
					"Armpits",
					"Stink Clouds",
					"Pantaloons",
					"Shitwipes",
					"Clits",
					"Monkeys",
					"U2 Fans",
					"Scabs",
					"Fuckrags",
					"Boys",
					"Scrotums",
					"Parasites",
					"Pancakes",
					"Stinkers",
				];
				var gifurls = [
					"https://media.giphy.com/media/8Zf0nJytPx4kr9t1OD/giphy.gif",
					"https://media.giphy.com/media/93YoxYHMJdej6/giphy.gif",
					"https://media2.giphy.com/media/COakIiWYHRlaU/giphy.gif",
					"https://media3.giphy.com/media/HhaZdWpfmc56o/giphy.gif",
					"https://media3.giphy.com/media/N2wzzZavH7jFK/giphy.gif",
					"https://media2.giphy.com/media/har4vdqu3xfCE/giphy.gif",
					"https://media3.giphy.com/media/lSyv3ESPQvYvC/giphy.gif",
					"https://media2.giphy.com/media/Gt4HdteNFL8wE/giphy.gif",
					"https://media3.giphy.com/media/lSyv3ESPQvYvC/giphy.gif",
					"https://i.imgur.com/CLKeAbg.mp4",
					"https://i.imgur.com/DjkUJsY.gif",
					"https://i.imgur.com/Ry6KPym.gif",
					"https://i.imgur.com/dLm43uc.gif",
				];
				var fn = Math.floor(Math.random() * f.length);
				var ln = Math.floor(Math.random() * l.length);
				var gn = Math.floor(Math.random() * gifurls.length);
				var text = "Hello, you " + f[fn] + " " + l[ln] + "™";
				const embed = new MessageEmbed()
				  .setImage(gifurls[gn])
				  .setDescription(text)
				msg.channel.send(embed);
				break;
			case "barf":
				var gifurls = [
					"https://media1.giphy.com/media/EiCQzmzE5HLaw/giphy.gif",
					"https://media1.giphy.com/media/3o7bugZgrGQEmE4epq/giphy.gif",
					"https://media1.giphy.com/media/zm9Tt8vsAmJmE/giphy.gif",
					"https://media3.giphy.com/media/xZv1drArGozD2/giphy.gif",
					"https://media0.giphy.com/media/iIj0itnYjTbQ4/giphy.gif",
					"https://media2.giphy.com/media/xT8qBbnDnrGWivuBlm/giphy.gif",
					"https://media0.giphy.com/media/3o7abLdw8eeqjX6m4g/giphy.gif",
					"https://media1.giphy.com/media/26FxCxnkrzUy0u2nm/giphy.gif",
					"https://media1.giphy.com/media/3o7aTmiKf3Lpp1ozXW/giphy.gif",
					"https://media3.giphy.com/media/9MmtzCIorgW7S/giphy.gif",
					"https://media1.giphy.com/media/26FxMl51JsgPnEzvy/giphy.gif",
					"https://media0.giphy.com/media/5gArNffWKNbXO/giphy.gif",
					"https://media2.giphy.com/media/e48mcLfU9zgFq/giphy.gif",
					"https://media1.giphy.com/media/xUA7b5sBrDikGvNs1G/giphy.gif",
					"https://media0.giphy.com/media/l44QkEErzRcmPuRlm/giphy.gif",
					"https://media1.giphy.com/media/WbhPKtfXZSM5a/giphy.gif",
					"https://media0.giphy.com/media/4qCEytljLybzq/giphy.gif",
				];
				var gn = Math.floor(Math.random() * gifurls.length);
				const barfEmbed = new MessageEmbed()
					.setImage(gifurls[gn])
					.setTitle("BARF!!!")
				msg.channel.send(barfEmbed);
				break;
			case "cage":
				var gifurls = [
					"https://media1.giphy.com/media/xTiTnC5cMmUx9bfWYU/giphy.gif",
					"https://media2.giphy.com/media/8J5qsXwnIah2M/giphy.gif",
					"https://media0.giphy.com/media/bQ40qrJdEg8Mw/giphy.gif",
					"https://media2.giphy.com/media/10uct1aSFT7QiY/giphy.gif",
					"https://media0.giphy.com/media/CiTLZWskt7Fu/giphy.gif",
				];
				var gn = Math.floor(Math.random() * gifurls.length);
				const cageEmbed = new MessageEmbed()
					.setImage(gifurls[gn])
					.setTitle("#CageForVenn")
				msg.channel.send(cageEmbed);
				break;
			default:
				if (conf["log"]["messages"]) db.logMessage(msg);
				break;
		}
	}

	function makeInsult(name) {
		var insults = require("./insults.json");
		var ins = insults.length;
		logger.info("ins: " + ins);
		var ind = Math.floor(Math.random() * ins);
		logger.info("ind: " + ind);
		var insult = insults[ind];
		var i = insult.replace(/@s/g, name);
		return i;
	}

	function randomChoice(deck) {
		var index = Math.floor(Math.random() * deck.length);
		return deck[index];
	}

	function member() {
		const memberBerries = require("./memberberries.json");
		return "…member " + randomChoice(memberBerries) + "?!!? :-D";
	}

	function watIs(args) {
		const wat = args.join(" ")
		if (!wat) {
			return "Yo, what's up?!";
		}
		const definitions = require("./definitions.json");
		const definition = definitions[wat.trim().toLowerCase()];
		if (definition) {
			return definition;
		} else {
			if (typeof wat === "string") {
				const word = wat;
			} else {
				const word = wat.join(" ");
			}
			return "I have no clue what a " + word + " is.";
		}
	}

	function foxxxify(args) {
		const dogg = args[0]
		if (!dogg) return ":regional_indicator_m: :fox: :dog2: :flag_au:";
		const doggo = dogg.trim().toLowerCase();
		if (doggo === "out")
			return "https://cdn.discordapp.com/attachments/270406768750886912/443264760436490271/fuck-this-shit.png";
		if (doggo === "laterz")
			return "https://cdn.discordapp.com/attachments/270406768750886912/474401118915657746/Screenshot_from_2018-05-06_14-16-03.png";
		return "https://cdn.discordapp.com/attachments/270406768750886912/474401450257154048/Screenshot_from_2018-05-12_13-38-18.png";
	}

	function mark() {
		return "https://media.discordapp.net/attachments/270406768750886912/943523121074429952/Screenshot_from_2022-02-15_14-41-38.png"
	}
});
