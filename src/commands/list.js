import {trackedSummoners} from '../models/TrackedSummoners.js'
import {availableRegions} from '../models/Region.js'

function listTrackedSummoners(channel){
    if (trackedSummoners.length(channel.id) == 0)
        return channel.send(`Not tracking any Summoners. Use  \`-tftbot track "<summoner name>" <region (${availableRegions.toString()})>\` to track a Summoner.\nE.g \`-tftbot track \"Lie Lie Lie\" na\`'`);

    const trackedSummonersString = trackedSummoners.list(channel.id);
    return channel.send(`Currently tracking Summoners: ${trackedSummonersString}`);
}

export {listTrackedSummoners};
