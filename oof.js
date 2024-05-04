"use strict";

(() => {

    module.exports.oof = () => {
		return _oof();
	}

    const workloads = [
        "Llama 3",
        "Stable Diffusion XL",
        "4K 60fps video rendering",
        "Cyberpunk 2077 with Ray tracing ultra",
        "cycles renderer in Blender",
        "Cities: Skylines 2",
        "running 700 VMs",
        "mining shitcoins",
        "Llama 3",
        "running 700 VMs",
    ];

    const machines = [
        "Amiga 500",
        "Commodore 64",
        "Atari ST",
        "Amiga CD32",
        "Nintendo 64",
        "25Mhz Intel 386",
        "Thinkpad X220",
        "Raspberry Pi 4",
        "PPC G5",
        "GeForce 2 MX",
        "toaster",
        "potato",
        "25Mhz Intel 386",
        "Thinkpad X220",
        "Raspberry Pi 4",
        "PPC G5",
    ];

    const sentences = [
        "Oof, this MACHINE is not handling WORKLOAD all that well",
        "Oof, WORKLOAD is struggling on my MACHINE",
        "Oof, WORKLOAD on a MACHINE is NOT ideal",
        "Oof, I'm surprised WORKLOAD on the MACHINE isn't better",
        "Oof, the MACHINE is starting to smoke from WORKLOAD",
        "Oof, at least the WORKLOAD is causing the MACHINE to keep to room a bit warmer",
        "Oof, WORKLOAD - 0 fps, 0/10 would not run on MACHINE again",
    ];

    function _oof() {
        const workload = workloads[Math.floor(Math.random() * workloads.length)];
        const machine = machines[Math.floor(Math.random() * machines.length)];
        let sentence = sentences[Math.floor(Math.random() * sentences.length)];

        const ocnt = Math.floor(Math.random() * 8) + 2;
        const ostr = "o".repeat(ocnt);
        const oofstr = `O${ostr}f`;
        sentence = sentence.replace("MACHINE", machine);
        sentence = sentence.replace("WORKLOAD", workload);
        sentence = sentence.replace("Oof", oofstr);

        return sentence;
    }

})();