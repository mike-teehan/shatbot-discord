(() => {
	const got = require("got");
	const cheerio = require("cheerio");
	const conf = require("./conf.json");
	const { MessageEmbed } = require('discord.js');
	const api_url = "http://api.memegenerator.net"

	async function makeMeme(args) {
		var mconf = conf["memegenerator.net"];
		var text = args.join(" ").split("|");
		// force a single line of text to be on the lower line
		if(text.length == 1) {
			text[1] = text[0];
			text[0] = "";
		}
		var params = {
			"username": mconf["username"],
			"password": mconf["password"],
			"apiKey": mconf["api_key"],
			"generatorID": mconf["generatorID"],
			"imageID": mconf["imageID"],
			"text0": text[0],
			"text1": text[1]
		}
		try {
			let response = await got(api_url + "/Instance_Create", {
				"method": "POST",
				"searchParams": params
			}).json()
			if (!response["success"]) {
				console.log(response)
				return "*barf* :sick:"
			}
			const instanceUrl = response["result"]["instanceUrl"]
			try {
				response = await got(instanceUrl)
			} catch (err) {
				console.log(`Failed to load ${url}: ${err}`);
				return "agruhm, phruhm! :coke:"
			}
			const $ = cheerio.load(response.body);
			const jpgurl = $(".meme-image img").attr('src');
			return new MessageEmbed().setImage(jpgurl)
		} catch (err) {
			console.log(`Failed to load ${url}: ${err}`)
			return "*snort, snort* :coke:"
		}
	}

	module.exports.makeMeme = makeMeme;
})();
