"use strict";

var Discord = require("discord.io");
var request = require("request");
var logger = require("winston");

var conf = require("./conf.json");
var db = require("./db.js");
var lutris = require("./lutris.js");

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

bot.on("message", function (user, userID, channelID, message, evt) {
	var msg = { "user": user, "userID": userID, "channelID": channelID, "message": message, "evt": evt };
	if(conf["log"]["messages"])
		db.logMessage(msg);

	if (message.substring(0, 1) == "!") {
		var args = message.substring(1).split(" ");
		var cmd = args[0];

		args = args.splice(1);

		switch(cmd) {
			// !ping
			case "strider":
				var victim = conf["victim"];
				var msg = makeInsult(victim);
				bot.sendMessage({ to: channelID, message: msg });
			break;
			case "mfoxdogg":
				bot.sendMessage({ to: channelID, message: "M :fox: :dog:" });
			break;
			case "lutris":
				if(args.length > 0)
					lutris.search(bot, msg, args);
				else
					bot.sendMessage({ to: channelID, message: "wat" });
			break;
			case "suggest":
				var title = args.join(" ");
				postSuggestion(channelID, user, title);
				return;
			break;
// 			default:
// 				bot.sendMessage({ to: channelID, message: "Unknown command." });
		}
	}

	function postSuggestion(channelID, user, title) {
		request.post({
			url: conf["suggest"]["url"],
			formData: { title: title, user: user, api_key: conf["suggest"]["api_key"] },
			json: true
		}, function() {
			setTimeout(function() {
				var msg = "\"" + title + "\" suggested...";
				bot.sendMessage({ to: channelID, message: msg });
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
