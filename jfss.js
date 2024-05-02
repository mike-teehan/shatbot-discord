"use strict";

(() => {

    const { MessageEmbed } = require('discord.js');

    module.exports.steph = () => {
		return _steph();
	}

    const f = [
        "Spunky",
        "Crispy",
        "Undercooked",
        "Wet Hot American",
        "Moistened",
        "Dirty",
        "Spicy, Spicy",
        "Crunchy",
        "Wildly Overrated",
        "Speedy",
        "S-Club 7-branded",
        "Jazzy",
        "Dilapidated",
        "Jizzy",
        "Prematurely-Birthed",
        "Hairy",
        "Hobgoblin's",
        "Spermy",
        "Stinky",
        "Clean Shaven",
        "Mystic",
        "Rectally-Inserted",
        "Erotically-Awakened",
        "Urine-Flavored",
        "Squeaky",
        "Soggy",
        "Pubic",
        "Big Black",
    ];

    const l = [
        "Cumdumpsters",
        "Areolas",
        "Uvulas",
        "Undies",
        "Jizzboys",
        "Rectums",
        "Dildos",
        "Cocklobsters",
        "Milkshakes",
        "Lady-fingers",
        "Hams",
        "Bottoms",
        "Fatties",
        "Wizzards",
        "Armpits",
        "Stink Clouds",
        "Pantaloons",
        "Shitwipes",
        "Clits",
        "Monkeys",
        "U2 Fans",
        "Scabs",
        "Fuckrags",
        "Boys",
        "Scrotums",
        "Parasites",
        "Pancakes",
        "Stinkers",
    ];

    const gifurls = [
        "https://media.giphy.com/media/8Zf0nJytPx4kr9t1OD/giphy.gif",
        "https://media.giphy.com/media/93YoxYHMJdej6/giphy.gif",
        "https://media2.giphy.com/media/COakIiWYHRlaU/giphy.gif",
        "https://media3.giphy.com/media/HhaZdWpfmc56o/giphy.gif",
        "https://media3.giphy.com/media/N2wzzZavH7jFK/giphy.gif",
        "https://media2.giphy.com/media/har4vdqu3xfCE/giphy.gif",
        "https://media3.giphy.com/media/lSyv3ESPQvYvC/giphy.gif",
        "https://media2.giphy.com/media/Gt4HdteNFL8wE/giphy.gif",
        "https://media3.giphy.com/media/lSyv3ESPQvYvC/giphy.gif",
        "https://i.imgur.com/CLKeAbg.mp4",
        "https://i.imgur.com/DjkUJsY.gif",
        "https://i.imgur.com/Ry6KPym.gif"
    ];

    function _steph() {
        const fn = Math.floor(Math.random() * f.length);
        const ln = Math.floor(Math.random() * l.length);
        const gn = Math.floor(Math.random() * gifurls.length);
        const text = `Hello, you ${f[fn]} ${l[ln]}™`;
        const embed = new MessageEmbed()
            .setImage(gifurls[gn])
            .setDescription(text);

        return embed;
    }

})();
