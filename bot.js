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
	var msg = { "user": user, "userID": userID, "channelID": channelID, "message": message, "evt": evt };

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
				postSuggestion(msg, args);
			break;
			case "linuxgnuru":
				youtube.postRandomYoutubeVideo(bot, channelID)
			break;
			case "mir":
				giphy.postRandomGif(bot, channelID, "anime%20girl");
			break;
			case "votes":
				scrapeVotes(msg, args);
			break;
			default:
				if(conf["log"]["messages"])
					db.logMessage(msg);
			break;
		}
	}

	function scrapeVotes(msg, args) {
		var url = conf["suggest"]["url"] + conf["suggest"]["scrape"];
		console.log("url: " + url);
		request(url, (err, resp, html) => {
// 			console.log("html: " + html);
			var titles = [], title = "";
			var $ = cheerio.load(html);
			$('.title').each((i, el) => {
				if(i < 10) {
					title = (i + 1) + " - " + $(el).text();
					console.log("title: " + title);
					titles.push(title);
				}
			});
			if(titles.length == 0)
				titles.push("No suggestions found...");
			setTimeout(function() {
				var txt = '```' + titles.join('\n') + '```';
				bot.sendMessage({ to: msg["channelID"], message: txt });
			}, 0);
		});
	}

	function postSuggestion(msg, args) {
		if(conf["admins"].includes(msg["userID"])) {
			var startwords = [ "start", "begin", "allow", "on", "enable", "active" ];
			var stopwords = [ "stop", "end", "deny", "off", "disable", "inactive" ];
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
});

bot.on("disconnect", function(errmsg, code) {
	logger.info("Disconnected: (" + code + ") " + errmsg);
});
