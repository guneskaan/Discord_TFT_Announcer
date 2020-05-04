import {trackedSummoners} from '../models/TrackedSummoners.js'

function clearTrackedSummoners(channel){
    trackedSummoners.clear(channel.id);
    channel.send('Cleared the list of tracked Summoners.');
    console.log(trackedSummoners);
}

function displayClearHelpMessage (channel) {
    return channel.send(`Usage: \`-tftbot clear\` to clear the list of tracked Summoners.`);
}

export {clearTrackedSummoners, displayClearHelpMessage};
