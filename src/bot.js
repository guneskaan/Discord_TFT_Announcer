import dotenv from 'dotenv'
import Discord from 'discord.js'
import flags from 'flags'

import {trackedSummoners} from './models/TrackedSummoners.js'
import {clearTrackedSummoners} from './commands/clear.js'
import {listTrackedSummoners} from './commands/list.js'
import {trackSummoner} from './commands/track.js'
import {loadDefaultSummoners} from './test/loadDefaults.js'

const client = new Discord.Client();
const prefix = "-tftbot ";

flags.defineBoolean('default', false);
flags.defineBoolean('development', false);

flags.parse();

if (flags.get('development'))
  dotenv.config()

client.on('ready', () => {
  // Add default help message.
  console.log(`Logged in as ${client.user.tag}!`);
  
  if (flags.get('default')) {
    client.channels.cache.forEach(channel => {
      if (channel.name != 'bot-channel') return;
      loadDefaultSummoners(channel.id);
    });
  }

  client.user.setPresence({ activity: { name: '-tftbot' , type: "LISTENING"}});
});

console.log(process.env.RIOT_API_KEY);
client.login(process.env.DISCORD_TOKEN);

client.on('message', message => {
  const channel = message.channel;

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
      // Add case where arguments are not proper.
      return trackSummoner(args, channel);
    case 'clear':
      return clearTrackedSummoners(channel);
    case 'list':
      return listTrackedSummoners(channel);
    default:
      // Default help message.
      return;
  }
});

setInterval(() => trackedSummoners.checkForUpdates(client.channels.cache), 60000);
