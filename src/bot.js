import dotenv from 'dotenv'
import Discord from 'discord.js'
import flags from 'flags'

import {trackedSummoners} from './models/TrackedSummoners.js'
import {clearTrackedSummoners} from './commands/clear.js'
import {listTrackedSummoners} from './commands/list.js'
import {trackSummoner} from './commands/track.js'
import {maybeAnnounceNewTFTMatch} from './announcer.js'
import {loadDefaultSummoners} from './test/loadDefaults.js'

const client = new Discord.Client();
const prefix = "-tftbot ";

dotenv.config()

flags.defineBoolean('debug', true);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setPresence({ activity: { name: '-tftbot' , type: "LISTENING"}});
  
  console.log(flags.get('debug'));
  if (flags.get('debug')) loadDefaultSummoners();
});

client.login(process.env.DISCORD_TOKEN);

var channelId;

client.on('message', message => {
  const channel = message.channel;
  channelId = channel.id;

  const messageContent = message.content;
  if (!messageContent.startsWith(prefix) || message.author.bot) return;

  const args = messageContent.slice(prefix.length).split('\"').map(arg => arg.trim());
  const command = args.shift().toLowerCase();

  // TODO: Add a help message.
  if (!command)
    return;

  console.log(`Command name: ${command}\nArguments: ${args}`);

  switch(command){
    case 'track':
      return trackSummoner(args, channel);
    case 'clear':
      return clearTrackedSummoners(channel);
    case 'list':
      return listTrackedSummoners(channel);
    default:
      return;
  }
});

setInterval(() => {
  if(!channelId || trackedSummoners.length() == 0)
    return;

  const channel = client.channels.cache.get(channelId);

  return trackedSummoners.get().forEach(summoner => maybeAnnounceNewTFTMatch(summoner, channel));
}, 60000);
