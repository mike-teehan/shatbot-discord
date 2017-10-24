"use strict";

// db.js handles db stuff

(function() {

	var db = require('sqlite-sync');

	var conf = require('./conf.json');

	const SCHEMA_VERSION = 2;

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
				var res = db.run(`
CREATE TABLE messages(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user TEXT NOT NULL, userID TEXT NOT NULL,
	channelID TEXT NOT NULL, message TEXT NOT NULL,
	evt TEXT NOT NULL,
	ts DATETIME DEFAULT CURRENT_TIMESTAMP
)
				`);
				if(res.error)
					throw res.error;
				setSchemaVer(1);
			break;
			case 2:
				var res = db.run(`
CREATE TABLE suggest_enabled(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	enabled INTEGER NOT NULL, message_id INTEGER NOT NULL,
	FOREIGN KEY(message_id) REFERENCES messages(id)
)
				`);
				if(res.error)
					throw res.error;
				setSchemaVer(2);
			break;
		}
	}

	function _logMessage(msg) {
		console.log("log - (" + msg["user"] + ") " + msg["message"]);
		var res = db.insert("messages", msg);
		console.log("insert res: " + res);
		return res;
	}

	function _getSuggestEnabled() {
		var res = db.run(`
SELECT enabled FROM suggest_enabled AS se
LEFT JOIN messages AS m ON m.id = se.message_id
ORDER BY m.ts DESC
LIMIT 1
		`);
		if(res.error)
			throw res.error;
		console.log("res: " + JSON.stringify(res));
		if(res.length != 1)
			return false;
		var boolstr = res[0]["values"][0][0];
		if(boolstr == "0")
			return false;
		if(boolstr == "1")
			return true;
		return null;
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
		return _logMessage(msg);
	}

	module.exports.getSuggestEnabled = () => {
		return _getSuggestEnabled();
	}

	module.exports.setSuggestEnabled = (msg, bool) => {
		var msg_id = _logMessage(msg);
		var boolstr = (bool) ? "1" : "0";
		var res = db.insert("suggest_enabled", { enabled: boolstr, message_id: msg_id });
	}

})();
