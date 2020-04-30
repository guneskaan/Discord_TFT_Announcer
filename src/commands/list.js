import {trackedSummoners} from '../models/TrackedSummoners.js'

function listTrackedSummoners(channel){
    if (trackedSummoners.length() == 0)
        return channel.send(`Not tracking any Summoners. Use  \`-tftbot track "<summoner name>" <region (na/euw/tr)>\` to track a Summoner.\nE.g \`-tftbot track \"Lie Lie Lie\" na\`'`);

    const trackedSummonersString = trackedSummoners.list();
    return channel.send(`Currently tracking Summoners: ${trackedSummonersString}`);
}

export {listTrackedSummoners};
