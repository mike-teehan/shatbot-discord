"use strict";

var Discord = require("discord.io");
var cheerio = require("cheerio");
var request = require("request");
var logger = require("winston");

var conf = require("./conf.json");
var db = require("./db.js");
var lutris = require("./lutris.js");
var youtube = require("./youtube.js");
var giphy = require("./giphy.js");
var meme = require("./meme.js");
var aussie = require("./aussie.js");

db.connect();
db.updateSchema();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});
logger.level = "debug";

// Initialize Discord Bot
var bot = new Discord.Client({
	token: conf["discord"]["auth_token"],
	autorun: true
});

bot.on("ready", function (evt) {
	this.setPresence({ game: { name: "with itself" } });
	logger.info("Connected");
	logger.info("Logged in as: ");
	logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("any", function(event) {
	if(event.op == 0)
		return;
	console.log(Date() + " - event: " + JSON.stringify(event));
});

bot.on("message", function (user, userID, channelID, message, evt) {
	var msg = { "bot": bot, "user": user, "userID": userID, "channelID": channelID, "message": message, "evt": evt };

	if (message.substring(0, 1) == "!") {
		var args = message.substring(1).split(" ");
		var cmd = args[0];
		console.log("cmd: " + cmd);
		args = args.splice(1);

		switch(cmd) {
			// !ping
			case "turbobrad":
			case "strider":
				var victim = conf["victims"][cmd];
				var msg = makeInsult(victim);
				bot.sendMessage({ to: channelID, message: msg });
			break;
			case "member":
				bot.sendMessage({ to: channelID, message: member() });
			break;
			case "wat":
				bot.sendMessage({ to: channelID, message: watIs(args)});
			break;
			case "mfoxdogg":
				bot.sendMessage({ to: channelID, message: ":regional_indicator_m: :fox: :dog2: :flag_au:" });
			break;
			case "lutris":
				if(args.length > 0)
					lutris.search(bot, msg, args);
				else
					bot.sendMessage({ to: channelID, message: "wat" });
			break;
			case "suggest":
				if(args.length > 0)
					postSuggestion(msg, args);
				else {
					let state = (db.getSuggestEnabled(msg)) ? "" : " not";
					state = "Suggestions are" + state + " enabled...";
					bot.sendMessage({ to: channelID, message: state });
				}
			break;
			case "linuxgnuru":
				youtube.postRandomYoutubeVideo(bot, channelID)
			break;
			case "mir":
				giphy.postRandomGif(bot, channelID, "anime%20girl");
			break;
			case "mirppc":
				bot.sendMessage({ to: channelID, message: "MOAR CORES!" });
			break;
			case "img":
				const roastImgUser = "Wait a minute... wait a minute... What "
					+ "did just happen here? Did you just use the !img command? Don't "
					+ "you know that TURBO Brad is a worthless piece of shit? What did "
					+ "you expect by running this !img command, an image? really? are "
					+ "you fucking kidding me? It's common knowledge that the !img command is completely "
					+ "useless, so what's your goal there? Are you so bored out of your mind and desperate "
					+ "for something to do that you would run this, hoping that no one would notice?"
					+ "FFS, get a hold of yourself, keep your shit together, you're losing it. "
					+ "Consider this is a warning, we won't be as tolerant next time."
					+ "\n\nLurve,\nThe Denizens of Shat";
				bot.sendMessage({ to: channelID, message: roastImgUser })
			case "votes":
				scrapeVotes(msg, args);
			break;
			case "atomicass":
				memeAtomicAss(msg, args);
			break;
			case "aussie":
				var resp = aussie.flipText(args);
				bot.sendMessage({ to: channelID, message: resp });
			break;
			default:
				if(conf["log"]["messages"])
					db.logMessage(msg);
			break;
		}
	}

	function memeAtomicAss(msg, args) {
		meme.make(msg, args);
	}

	function scrapeVotes(msg, args) {
		var url = conf["suggest"]["url"] + conf["suggest"]["scrape"];
		console.log("url: " + url);
		request(url, (err, resp, html) => {
// 			console.log("html: " + html);
			var $;
			$ = cheerio.load(html);
			var votes = [], vote = "";
			$('.vote_count').each((i, el) => {
				if(i < 20) {
					vote = $(el).text();
// 					console.log("votes: " + vote);
					votes.push(vote);
				}
			});

			$ = cheerio.load(html);
			var titles = [], title = "";
// 			var $ = cheerio.load(html);
			$('.title').each((i, el) => {
				if(i < 20) {
					title = $(el).text();
// 					console.log("title: " + title);
					titles.push(title);
				}
			});
// 			console.log("titles: " + JSON.stringify(titles));

			if(titles.length == 0)
				titles.push("No suggestions found...");
			else {
				// OH SNAP it's a naive bubblesort
				var found;
				do {
					found = false
					var iteration = 0, cur, next, tmp;
					var search_len = votes.length - iteration - 1;
					for(let i = 0; i < search_len; i++) {
						cur = votes[i];
						next = votes[i + 1];
						if(cur > next) {
							votes[i] = next;
							votes[i + 1] = cur;
							tmp = titles[i];
							titles[i] = titles[i + 1];
							titles[i + 1] = tmp;
							found = true;
						}
					}
					iteration++;
				} while(found);
				votes.reverse();
// 				console.log("titles: " + JSON.stringify(titles));
				titles.reverse();
// 				console.log("titles: " + JSON.stringify(titles));
			}

			var top = (20 > titles.length) ? titles.length : 20;
			var rows = [], row;
			for(let i = 0; i < top; i++) {
				if(votes[i] > 0)
					rows.push(votes[i] + " - " + titles[i]);
			}

			var txt;
			if(rows.length == 0)
				txt = "No suggestions with votes yet...";
			else
				txt = '```' + rows.join('\n') + '```';

			setTimeout(function() {
				bot.sendMessage({ to: msg["channelID"], message: txt });
			}, 0);
		});
	}

	function postSuggestion(msg, args) {
		if(conf["admins"].includes(msg["userID"])) {
			var startwords = [ "1", "start", "begin", "allow", "on", "enable", "active", "true" ];
			var stopwords = [ "0", "stop", "end", "deny", "off", "disable", "inactive", "false" ];
			if(args.length == 1 && startwords.includes(args[0]) && !db.getSuggestEnabled(msg)) {
				db.setSuggestEnabled(msg, true);
				setTimeout(function() {
					var txt = "Now accepting suggestions...";
					bot.sendMessage({ to: msg["channelID"], message: txt });
				}, 0);
				return;
			}
			if(args.length == 1 && stopwords.includes(args[0]) && db.getSuggestEnabled(msg)) {
				db.setSuggestEnabled(msg, false);
				setTimeout(function() {
					var txt = "No longer accepting suggestions...";
					bot.sendMessage({ to: msg["channelID"], message: txt });
				}, 0);
				return;
			}
		}
		var title = args.join(" ");
		if(!db.getSuggestEnabled(msg)) {
			setTimeout(function() {
				var txt = "Suggestions are currently suspended...";
				bot.sendMessage({ to: msg["channelID"], message: txt });
			}, 0);
			return false; // FIXME tell the user
		}

		request.post({
			url: conf["suggest"]["url"] + conf["suggest"]["submit"],
			formData: { title: title, user: msg["user"], api_key: conf["suggest"]["api_key"] },
			json: true
		}, function() {
			setTimeout(function() {
				var txt = "\"" + title + "\" suggested...";
				bot.sendMessage({ to: msg["channelID"], message: txt });
			}, 0);
		});
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

	function watIs(wat) {
		if(!wat) {
			return "Yo, what's up?!";
		}
		const definitions = require("./definitions.json");
		const definition = definitions[wat.trim().toLowerCase()];
		if(definition) {
			return definition;
		} else {
			return "I have no clue what a " + wat + " is.";
		}
	}

});

bot.on("disconnect", function(errmsg, code) {
	logger.info("Disconnected: (" + code + ") " + errmsg);
	setTimeout(() => {
		// return a "failure" exit code so systemd (or whatever) will respawn us
		process.exit(1);
	}, 250);
});
