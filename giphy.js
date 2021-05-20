(function() {
	const got = require('got')
	const { MessageEmbed } = require('discord.js');
	var conf = require("./conf.json");

	async function getRandomGif(tag) {
		const apiKey = conf["giphy"]["api_key"];
		const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${tag}`;
		response = await got(url).json()
		return new MessageEmbed().setImage(response.data.image_url)
	}

	module.exports.getRandomGif = getRandomGif
})();
