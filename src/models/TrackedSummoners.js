import {maybeAnnounceNewTFTMatch} from '../announcer.js'

// Singleton class of all tracked summoners.
export class TrackedSummoners {
    constructor() {
        this.trackedSummoners = {};
    }

    add(channelID, Summoner) {
        if(!this.trackedSummoners[channelID])
            this.trackedSummoners[channelID] = [];
        
        this.trackedSummoners[channelID].push(Summoner);
    }

    addAll(channelID, Summoners){
        Summoners.forEach(summoner => this.add(channelID, summoner));
    }

    list(channelID){
        const buildSummonerString = summoner => {
            return summoner.name + '(' + summoner.region + ')';
          };
        
        const trackedSummonersString = this.trackedSummoners[channelID].reduce((prevSummoner, curSummoner, index) => index == 0 ? buildSummonerString(curSummoner) : prevSummoner + ', ' + buildSummonerString(curSummoner), '');
        return trackedSummonersString;
    }

    clear(channelID){
        this.trackedSummoners[channelID] = [];
    }

    length(channelID){
        if (!this.trackedSummoners[channelID]) 
            return 0;

        return this.trackedSummoners[channelID].length;
    }

    checkForUpdates(channelsCache){
        for (const channelID in this.trackedSummoners){
            const channel = channelsCache.get(channelID);
            this.trackedSummoners[channelID].forEach(summoner => maybeAnnounceNewTFTMatch(summoner, channel));
        }
    }
}

export let trackedSummoners = new TrackedSummoners();
