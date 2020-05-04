import twisted from 'twisted'

import {trackedSummoners} from '../models/TrackedSummoners.js'
import {Summoner} from '../models/Summoner.js'
import {availableRegions, regionArgToTwistedRegion} from '../models/Region.js'

const Constants = twisted.Constants;
const TftApi = new twisted.TftApi();

function trackSummoner(args, channel) {
    const userRegion = args[1].toLowerCase();
    const summonerName = args[0];

    if (args.length != 2 || !availableRegions.includes(userRegion)) {
      displayIncorrectTrackUsageMessage(channel);
      return;
    }
  
    if (trackedSummoners.length(channel.id) > 5){
      channel.send('Already tracking 5 Summoners. Use \'list\' to display tracked summoners or \'clear\' to clear the list.');
      return;
    }
  
    const twistedRegion = regionArgToTwistedRegion(userRegion);
  
    return getTFTSummoner(summonerName, twistedRegion)
      .then(puuid => {
        console.log('Received puuid:', puuid);
        const newSummoner = new Summoner(summonerName, puuid, twistedRegion, Constants.regionToTftRegions(twistedRegion));
        trackedSummoners.add(channel.id, newSummoner);
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
  
async function getTFTSummoner (summonerName, twistedRegion) {
    const {
        response: {
        puuid 
        }
    } = await TftApi.Summoner.getByName(summonerName, twistedRegion)

    return puuid;
}

function displayIncorrectTrackUsageMessage (channel){
  channel.send(`Incorrect usage of command \'track\'`);

  return displayTrackHelpMessage(channel);
}

function displayTrackHelpMessage (channel) {
  return channel.send(`Usage: \`-tftbot track "<summoner name>" <region (${availableRegions.toString()})>\`.\nE.g \`-tftbot track \"Lie Lie Lie\" na\``);
}

export {trackSummoner, displayTrackHelpMessage, displayIncorrectTrackUsageMessage};
