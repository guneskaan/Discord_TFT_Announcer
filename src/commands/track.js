import twisted from 'twisted'

import {trackedSummoners} from '../models/TrackedSummoners.js'
import {Summoner} from '../models/Summoner.js'

const Constants = twisted.Constants;
const TftApi = new twisted.TftApi();

function trackSummoner(args, channel) {
    const availableRegions = ["na", "euw", "tr"];
    const userRegion = args[1].toLowerCase();
    const summonerName = args[0];
  
    console.log(userRegion);
    if (args.length != 2 || !availableRegions.includes(userRegion)) {
      channel.send('Incorrect usage of command \'track\'.\nCorrect usage: \`-tftbot track "<summoner name>" <region (na/euw/tr)>\`.\nE.g \`-tftbot track \"Lie Lie Lie\" na\`');
      return;
    }
  
    if (trackedSummoners.length() == 5){
      channel.send('Already tracking 5 summoners. Use \'list\' to display tracked summoners or \'clear\' to clear the list.');
      return;
    }
  
    const twistedRegion = regionArgToTwistedRegion(userRegion);
  
    return getTFTSummoner(summonerName, twistedRegion)
      .then(puuid => {
        console.log('Received puuid:', puuid);
        const newSummoner = new Summoner(summonerName, puuid, twistedRegion, Constants.regionToTftRegions(twistedRegion));
        trackedSummoners.add(newSummoner);
        channel.send(`Tracking Summoner ${newSummoner.name} in Region ${newSummoner.region}`);
        console.log('Tracking Summoner:', newSummoner);
      })
      .catch(error => { 
        if (error.status == 404){
          channel.send(`Summoner ${summonerName} does not exist in region ${userRegion}.`);
        }
        console.log('Caught Error:', error.message); 
      });
}

function regionArgToTwistedRegion(regionArg){
    switch(regionArg){
      case 'na':
        return Constants.Regions.AMERICA_NORTH;
      case 'euw':
        return Constants.Regions.EU_WEST;
      case 'tr':
        return Constants.Regions.TURKEY;
      default:
        return;
    }
  }
  
async function getTFTSummoner (summonerName, twistedRegion) {
    const {
        response: {
        puuid 
        }
    } = await TftApi.Summoner.getByName(summonerName, twistedRegion)

    return puuid;
}

export {trackSummoner};
