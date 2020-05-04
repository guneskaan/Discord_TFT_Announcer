import {availableRegions} from '../models/Region.js'
import {displayTrackHelpMessage} from './track.js'
import {displayClearHelpMessage} from './clear.js'
import {displayListHelpMessage} from './list.js'

const prefix = "-tftbot ";
const availableCommands = ['track', 'list', 'remove', 'clear'];
const availableCommandsCode = availableCommands.map(command => "\`" + command + "\'").join(' ');

function sendHelpMessage(args, channel){
    const maybeCommandArgument = args[0];

    if (!availableCommands.includes(maybeCommandArgument))
        return sendDefaultHelpMessage(channel);
    
    switch (maybeCommandArgument){
        case 'track':
            return displayTrackHelpMessage(channel);
        case 'clear':
            return displayClearHelpMessage(channel);
        case 'list':
            return displayListHelpMessage(channel);
        case 'remove':
            return sendHelpMessage(args, channel); 
    }
}

function sendDefaultHelpMessage(channel){
    channel.send({embed: {
        color: 1211996,
        title: 'TFTBot',
        fields: [{
            name : "List of Commands",
            value: availableCommandsCode
        },
        {
            name: "Available Regions",
            value: availableRegions.toString()
        },
        {
            name : "Usage",
            value: "Track Summoners with: \`" + `${prefix}` + "track \"<summoner name>\" <region>\`.\n\nE.g \`-tftbot track \"Lie Lie Lie\" na\`" +
            "\n\n The bot will then send an update to the channel whenever a tracked Summoner finishes a TFT Match."
        },
        {
            name: "Get More Info On A Command",
            value: "To get more info. on a command, type `" + `${prefix}help` + " command`" + "\n\nE.g `" + prefix + "help track`"
        },
        {
            name: "Development",
            value : "TFTbot is an open source project. You can contribute on [GitHub](https://github.com/guneskaan/Discord_TFT_Announcer)."
        }
        ]
    }});
}

export {sendHelpMessage, sendDefaultHelpMessage};
