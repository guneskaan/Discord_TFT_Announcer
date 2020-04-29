import dotenv from 'dotenv'
import twisted from 'twisted'
import Discord from 'discord.js'

const client = new Discord.Client();
const prefix = "-tftbot ";
const TftApi = new twisted.TftApi();
const Constants = twisted.Constants;

dotenv.config()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

// TODO: Currently this bot only works with a single channel. It should work with multiple.
var channelId;

var trackedSummoners = [];

client.on('message', message => {
  channelId = message.channel.id;

  const messageContent = message.content;
  if (!messageContent.startsWith(prefix) || message.author.bot) return;

  //console.log(messageContent.slice(prefix.length).split('"'));
  const args = messageContent.slice(prefix.length).split('\"').map(arg => arg.trim());
  const command = args.shift().toLowerCase();

  console.log(`Command name: ${command}\nArguments: ${args}`);

  // TODO: Implement remove summoner and clear list.
  switch(command){
    // TODO: Parse Summoner name within quotes
    case 'track':
      trackSummoner(args, message.channel);
      return;
    default:
      return;
  }
});

class Summoner {
  constructor(name, puuid, region, TFTRegion) {
    this.name = name;
    this.puuid = puuid;
    this.region = region;
    this.TFTRegion = TFTRegion;
  }
}


function trackSummoner(args, channel) {
  const availableRegions = ["na", "euw"];
  const userRegion = args[1].toLowerCase();
  const summonerName = args[0];

  console.log(userRegion);
  if (args.length != 2 || !availableRegions.includes(userRegion)) {
    channel.send('Incorrect usage of command \'track\'.\nCorrect usage: \`-tftbot track "<summoner name>" <region (na/euw)>\`.\nE.g \`-tftbot track \"Lie Lie Lie\" na\`');
    return;
  }

  if (trackedSummoners.length == 5){
    channel.send('Already tracking 5 summoners. Use \'list\' to display tracked summoners or \'clear\' to clear the list.');
    return;
  }

  const twistedRegion = regionArgToTwistedRegion(userRegion);

  getTFTSummoner(summonerName, twistedRegion)
    .then(puuid => {
      console.log('Received puuid:', puuid);
      const newSummoner = new Summoner(summonerName, puuid, twistedRegion, Constants.regionToTftRegions(twistedRegion));
      trackedSummoners.push(newSummoner);
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

setInterval(() => {
  if(!channelId || trackedSummoners.length == 0)
    return;

  trackedSummoners.forEach(summoner => maybeAnnounceNewTFTMatch(summoner));
  // TODO: Set this interval to 30 seconds or 1 minute before deployment.
}, 60000);

function maybeAnnounceNewTFTMatch(summoner){
  const channel = client.channels.cache.get(channelId);

  TftApi.Match.list(summoner.puuid, summoner.TFTRegion)
  .then(matchList => {
    console.log('Retrieved Matchlist', matchList);

    // Case where the Summoner hasn't played any TFT Games.
    if(!matchList.response || matchList.response.length == 0){
      return;
    }

    const lastMatchId = matchList.response[0];
    // Case where we are fetching Summoner's match history for the first time.
    if (!summoner.lastMatchId){
      summoner.lastMatchId = lastMatchId;
      return;
    }
    
    // Case where the Summoner hasn't finished a new TFTMatch.
    if (summoner.lastMatchId == lastMatchId)
      return;

    fetchLastTFTMatch(lastMatchId, summoner, channel);
  })
  .catch(error => {
    channel.send(error)
    console.log('Caught Error During Summoner History Lookup Interval:', error); 
  });
}

function fetchLastTFTMatch(lastMatchId, summoner, channel){
  const buildPlacementString = placement => {
    switch (placement){
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
      default:
        return placement.toString() + "th";
    }
  }

  const buildTraitString = trait => {
    const traitName = trait.name;
    const slicedTraitName = traitName.startsWith('Set3') ? traitName.slice(5) : traitName;
    
    return trait.num_units + ' ' + slicedTraitName;
  }

  TftApi.Match.get(lastMatchId, summoner.TFTRegion)
    .then(TFTMatch => {
      console.log('Retrieved TFTMatch: ', TFTMatch);
      const participant = TFTMatch.response.info.participants.find(p => p.puuid === summoner.puuid);
      console.log('Retrieved Participant: ', participant);
      channel.send(`Summoner ${summoner.name}(${summoner.region}) just placed ${buildPlacementString(participant.placement)} in a TFT Match.\nComposition:`);
      const traits = participant.traits;
      console.log('Retrieved Traits: ', traits);
      var compString = traits
        .filter(trait => trait.tier_current && trait.tier_current > 0)
        .reduce((prevTrait, curTrait, index) => index == 0 ? buildTraitString(curTrait) : prevTrait + ', ' + buildTraitString(curTrait), '');
      channel.send(compString);
      summoner.lastMatchId = lastMatchId;
    })
    .catch(error => {
      channel.send(error)
      console.log('Caught Error During Summoner Last Match Lookup:', error); 
    });
}
