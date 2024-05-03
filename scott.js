"use strict";

const { applyFixes } = require('eslint/lib/linter/source-code-fixer');

(() => {

    const { MessageEmbed } = require('discord.js');

    module.exports.scott = (args) => {
		return _scott(args);
	}

    const didrex = /(<@[0-9]*>)/;

    const apologies = [
        "Appologies in advance",
        "I really am sorry",
        "Please excuse this"
    ];

    const puns = [
        "There were three cats: an english cat, a spanish cat and a french cat, each named 1 2 3 in their respective languages. They were walking through the forest, when they came to a river.\nThe one two three cat swam across.\nThe uno dos tres cat swam across.\nBut the un deux trois cat sank.",
        "Q: How can you tell if it's spring time in Toronto?\nA: The Leafs are out!",
        "Q: Hey, do you know where Moose Jaw is?\nA: About 8 feet from moose butt.",
        "Q: Why doesn’t Saskatchewan use Daylight Saving Time?\nA: ‘Cause no one wants to spend an extra hour there!",
        "A baby seal walks into a bar. Bartender asks \"What'll you have?\"\nBaby seal says \"Anything but a Canadian Club.\"",
        "Q: How many Torontonians does it take to change a light bulb?\nA: Just one to hold the bulb while the country revolves around it.",
        "In Quebec, they can't have 2 eggs for breakfast any more. One egg is an oeuf.",
        "Q: What is a Jawa's favorite side?\nQ: Poutineeeeee."
    ];

    function _scott(args) {
        const argstr = args.join(' ').trim();
        //logger.info(`argstr: ${argstr}`);
        const m = argstr.match(didrex);

        if(m)
            return `${m[0]} just banged me!`;

        const a = Math.floor(Math.random() * apologies.length);
        const p = Math.floor(Math.random() * puns.length);

        const embed = new MessageEmbed()
            .setTitle(apologies[a])
            .setDescription(puns[p]);
        return embed;
        //return `\`\`\`puns[p]\`\`\``;
    }

})();
