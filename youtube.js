(function() {

	var request = require("request");
	var conf = require("./conf.json");

	module.exports.postRandomYoutubeVideo = (bot, channelID) => {
		postRandomYoutubeVideo(bot, channelID);
	}

	function postRandomYoutubeVideo(bot, channelID) {
		var apiToken = conf["randomyoutube"]["api_token"];
		var url = `https://randomyoutube.net/api/getvid?api_token=${apiToken}`;
		request.get({
			url: url,
			json: true,
		}, function (error, response, body) {
			if (body) {
				var url = `https://www.youtube.com/watch?v=${body.vid}`
				bot.sendMessage({ to: channelID, message: url });
			} 
		})
	}
})();
