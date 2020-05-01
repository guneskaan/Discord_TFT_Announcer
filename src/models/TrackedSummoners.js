// Singleton class of all tracked summoners.
// TODO: Currently this bot only works with a single channel. It should work with multiple.
export class TrackedSummoners {
    constructor() {
        this.trackedSummoners = [];
    }

    add(Summoner) {
        this.trackedSummoners.push(Summoner);
    }

    addAll(Summoners){
        console.log('adding all');
        Summoners.forEach(summoner => this.add(summoner));
        console.log(this.trackedSummoners);
    }

    list(){
        const buildSummonerString = summoner => {
            return summoner.name + '(' + summoner.region + ')';
          };
        
        const trackedSummonersString = this.trackedSummoners.reduce((prevSummoner, curSummoner, index) => index == 0 ? buildSummonerString(curSummoner) : prevSummoner + ', ' + buildSummonerString(curSummoner), '');
        return trackedSummonersString;
    }

    clear(){
        this.trackedSummoners = [];
    }

    length(){
        return this.trackedSummoners.length;
    }

    get(){
        return this.trackedSummoners;
    }
}

export let trackedSummoners = new TrackedSummoners();
