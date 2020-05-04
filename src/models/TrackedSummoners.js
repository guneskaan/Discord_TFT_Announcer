import {maybeAnnounceNewTFTMatch} from '../announcer.js'

// Singleton class of all tracked summoners.
// TODO: Currently this bot only works with a single channel. It should work with multiple.
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
        try{
            for (const channelID in this.trackedSummoners){
                const channel = channelsCache.get(channelID);
                this.trackedSummoners[channelID].forEach(summoner => maybeAnnounceNewTFTMatch(summoner, channel));
            }
        }
        catch (e){
            console.log('error checkforupdates: ', e);
        }
    }
}

export let trackedSummoners = new TrackedSummoners();
