(() => {

	var discord = require("discord.io");
	var request = require("request");
	var cheerio = require("cheerio");

	var conf = require("./conf.json");

	const api_url = "http://version1.api.memegenerator.net"

	module.exports.make = (msg, args) => {
		makeMeme(msg, args);
	}

	function makeMeme(msg, args) {
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
		var url = api_url + "/Instance_Create";
		console.log("url: " + url);
		getInstanceUrl(msg, url, params, 10000, 3);
	}

	function getInstanceUrl(msg, iurl, params, timeout, attempts, attempted_) {
		var attempted = attempted_ || 0;
		request({ "method": "POST", "url": iurl, "qs": params, "timeout": timeout }, (err, resp, data) => {
			if(err) {
				console.log("getInstanceUrl attempt " + (attempted + 1) + " of " + attempts);
				console.log("err: " + err);
				if(attempts > attempted) {
					setTimeout(() => {
						getInstanceUrl(msg, iurl, params, timeout, attempts, attempted + 1);
					}, 1000);
				} else {
					console.log("Failed to load " + iurl + " after " + attempts + " attempts.");
					setTimeout(() => {
						msg["bot"].sendMessage({ to: msg["channelID"], message: "Failed to load image..." });
					}, 0);
				}
			} else {
				var json = JSON.parse(data);
				if(json && json["success"]) {
					var iurl = json["result"]["instanceUrl"];
					console.log("iurl: " + iurl);
					getJPEGUrl(msg, iurl, 10000, 3);
				} else {
					console.log("query failed!!");
					console.log("output: " + json);
				}
			}
		});
	}

	function getJPEGUrl(msg, iurl, timeout, attempts, attempted_) {
		var attempted = attempted_ || 0;
		request({"method": "GET", "url": iurl, "timeout": timeout }, (err, resp, data) => {
			if(err) {
				console.log("getJPEGUrl attempt " + (attempted + 1) + " of " + attempts);
				console.log("err: " + err);
				if(attempts > attempted) {
					setTimeout(() => {
						getJPEGUrl(msg, iurl, timeout, attempts, attempted + 1);
					}, 1000);
				} else {
					console.log("Failed to load " + iurl + " after " + attempts + " attempts.");
					setTimeout(() => {
						msg["bot"].sendMessage({ to: msg["channelID"], message: "Failed to load image..." });
					}, 0);
				}
			} else {
				var $;
				$ = cheerio.load(data);
				var jpgurl = $(".main-instance-element").attr('src');
				console.log("jpgurl: " + jpgurl);
				const embed = {
					"title": "",
					"url": "http://memegenerator.net",
					"image": { "url": jpgurl }
				};
				setTimeout(() => {
					msg["bot"].sendMessage({ to: msg["channelID"], embed: embed });
				}, 0);
			}
		});
	}
})();
