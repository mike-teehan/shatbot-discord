"use strict";

// db.js handles db stuff

(function() {

	var db = require('sqlite-sync');

	var conf = require('./conf.json');

	const SCHEMA_VERSION = 1;

	function getSchemaVer() {
		var res = db.run("PRAGMA user_version");
		return res[0]["user_version"];
	}

	function setSchemaVer(ver) {
		var res = db.run("PRAGMA user_version=" + ver);
		return (res.error);
	}

	function updateSchema(from) {
		switch(from + 1) {
			case 1:
				var res = db.run(" \
CREATE TABLE messages( \
	id INTEGER PRIMARY KEY AUTOINCREMENT, \
	user TEXT NOT NULL, userID TEXT NOT NULL, \
	channelID TEXT NOT NULL, message TEXT NOT NULL, \
	evt TEXT NOT NULL, \
	ts DATETIME DEFAULT CURRENT_TIMESTAMP \
) \
				");
				if(res.error)
					throw res.error;
				setSchemaVer(1);
			break;
		}
	}

	module.exports.connect = () => { 
		var dburi = conf["db"]["path"] + conf["db"]["name"];
		db.connect(dburi);
	}

	module.exports.updateSchema = () => {
		var ver = getSchemaVer();
		while(ver < SCHEMA_VERSION) {
			console.log("upgrading db schema ver: " + ver + " -> " + (ver + 1));
			updateSchema(ver);
			ver++;
		}
	}

	module.exports.logMessage = (msg) => {
		console.log("log - (" + msg["user"] + ") " + msg["message"]);
		var res = db.insert("messages", msg);
	}

})();
