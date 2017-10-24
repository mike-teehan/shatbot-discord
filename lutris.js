(function() {

	var request = require("request");
	var _bot = {}, _msg = {};

	module.exports.search = (bot, msg, args) => {
		searchLutris(bot, msg, args);
	}

	function searchLutris(bot, msg, args) {
		_bot = bot;
		_msg = msg;
		var qs, responseHandler;
		if (args[0] == 'random') {
			var query = args[1];
			if (!query) {
				query = '1';
			}
			qs = 'random=' + query
			responseHandler = handleLutrisRandom;
		} else {
			qs = 'search=' + args.join("+");
			responseHandler = handleLutrisSearch;
		}
		request.get({
			url: "https://lutris.net/api/games?" + qs,
			json: true
		}, responseHandler);
	}

	function handleLutrisRandom(e, r, data) {
		var results = data['results'];
		if (!results) {
			return;
		}
		var game = results[0];
		var fields = []
		if (game.year) {
			fields.push({
				name: "Year",
				value: game.year,
				inline: true
			})
		}
		if (game.platforms.length) {
			platforms = []
			for (var i=0; i< game.platforms.length; i++) {
				platforms.push(game.platforms[i].name)
			}
			fields.push({
				name: "Platforms",
				value: platforms.join(','),
				inline: true
			})
		}
		var author;
		if (game.steamid) {
			author = {
				"name": "Available on Steam",
				"url": "http://store.steampowered.com/app/" + game.steamid + "/",
				"icon_url": "https://lutris.net/static/images/icons/steam.png"
			}
		} else {
			author = {};
		}

		var footer;
		footer = {
				text: ""
		}

		setTimeout(function() {
			_bot.sendMessage({
				to: _msg["channelID"],
				message: '',
				url: 'https://lutris.net/games/' + game['slug'],
				embed: {
					color: 0xf89a15,
					title: game['name'],
					thumbnail: {
						url: "https://lutris.net/static/images/logo.png"
					},
					author: author,
					footer: footer,
					fields: fields,
					image: {
						url: 'https://lutris.net' + game['banner_url']
					}
				}
			}, 0);
		});
	}

	function handleLutrisSearch(e, r, data) {
	//		logger.info("search data: " + JSON.stringify(data));
		var results = data["results"];
		var loops = (results.length > 10) ? 10 : results.length;
		var msg = "";
		if(loops == 0)
			msg = "Search returned 0 results";
		else {
			msg = "First " + loops + " on Lutris:\n```"
			for(var i = 0; i < loops; i++) {
				var row = results[i];
				// if(!row)
				//	logger.info("i: " + i + " loops: " + loops);
				//	logger.info("row: " + JSON.stringify(row));
				msg += (i + 1) + " - " + row["name"] + "\n";
			}
			msg += "```";
		}
		setTimeout(function() {
			_bot.sendMessage({ to: _msg["channelID"], message: msg });
		}, 0);
	}

})();
