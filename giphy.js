(function() {
	const got = require('got')
	const { MessageEmbed } = require('discord.js');
	var conf = require("./conf.json");

	async function getRandomGif(tag) {
		const apiKey = conf["giphy"]["api_key"];
		const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${tag}`;
		response = await got(url).json()
		const imageUrl = response.data.images.original.url
		if (!imageUrl) {
			console.error("Failed to get image")
			console.log(response.data)
			return
		}
		return new MessageEmbed().setImage(imageUrl)
	}

	module.exports.getRandomGif = getRandomGif
})();
