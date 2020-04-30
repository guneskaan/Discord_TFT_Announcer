import {trackedSummoners} from '../models/TrackedSummoners.js'

function clearTrackedSummoners(channel){
    trackedSummoners.clear();
    channel.send('Cleared the list of tracked Summoners.');
    console.log(trackedSummoners);
}

export {clearTrackedSummoners};
