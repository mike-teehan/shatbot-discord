(function() {

	var request = require("request");
	var conf = require("./conf.json");

	module.exports.postRandomGif = (bot, channelID, tag) => {
		postRandomGif(bot, channelID, tag);
	}

	function postRandomGif(bot, channelID, tag) {
		var apiKey = conf["giphy"]["api_key"];
		var url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${tag}`;
		request.get({
			url: url,
			json: true,
		}, function (error, response, body) {
			if (body) {
				const embed = {
					"title": "",
					"url": "http://memegenerator.net",
					"image": { "url": body.data.image_url }
				};

				bot.sendMessage({ to: channelID, embed: embed });
			}
		})
	}
})();
