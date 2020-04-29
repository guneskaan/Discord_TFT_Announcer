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

client.on('message', message => {
  channelId = message.channel.id;
  console.log(channelId);

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  console.log(`Command name: ${command}\nArguments: ${args}`);

  switch(command){
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

var trackedSummoners = [];

function trackSummoner(args, channel) {
  const availableRegions = ["na", "euw"];
  const userRegion = args[1].toLowerCase();
  const summonerName = args[0];

  if (args.length != 2 || !availableRegions.includes(userRegion)) {
    channel.send('Incorrect usage of command \'track\'.\nCorrect usage: -tftbot track <summoner name> <region (na/euw)>');
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
      console.log('Tracking Summoner:', newSummoner);
      channel.send(puuid);
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

// export async function getTFTMatchList (puuid, TFTRegion) {
//   const {
//     response: {
//       puuid 
//     }
//   } = await TftApi.Summoner.getByName(summonerName, regionArgToTwistedRegion(region))

//   return TftApi.Match.list(puuid, Constants.TftRegions.AMERICAS);
// }


