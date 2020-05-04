import Discord from 'discord.js'
import flags from 'flags'
import express from 'express'
import dotenv from 'dotenv'

import {trackedSummoners} from './models/TrackedSummoners.js'
import {clearTrackedSummoners} from './commands/clear.js'
import {listTrackedSummoners} from './commands/list.js'
import {trackSummoner, displayIncorrectTrackUsageMessage} from './commands/track.js'
import {loadDefaultSummoners} from './test/loadDefaults.js'
import {sendHelpMessage, sendDefaultHelpMessage} from './commands/help.js'

const client = new Discord.Client();
const prefix = "-tftbot";

// Listen to incoming requests.
const app = express();
const port = process.env.PORT || 8080;

app.listen(port);

flags.defineBoolean('default', false);
flags.defineBoolean('development', false);

flags.parse();

if (flags.get('development'))
  dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  if (flags.get('default')) {
    client.channels.cache.forEach(channel => {
      if (channel.name != 'bot-channel') return;
      loadDefaultSummoners(channel.id);
    });
  }

  client.user.setPresence({ activity: { name: '-tftbot' , type: "LISTENING"}});
});

client.login(process.env.DISCORD_TOKEN);

client.on('message', message => {
  const channel = message.channel;
  const messageContent = message.content;

  if (!messageContent.startsWith(prefix) || message.author.bot) 
    return;

  const slicedMessageContent = messageContent.slice(prefix.length + 1);
  const hasTwoDoubleQuotes = (slicedMessageContent.match(/is/g) || []).length;

  const args = hasTwoDoubleQuotes ? slicedMessageContent.split("\"") : slicedMessageContent.split(' ');
  console.log(args);
  const command = args.shift().toLowerCase();
  console.log(command);

  console.log(`Command name: ${command}\nArguments: ${args}`);

  switch(command){
    case 'track':
      if (!hasTwoDoubleQuotes)
       return displayIncorrectTrackUsageMessage(channel);

      return trackSummoner(args, channel);
    case 'clear':
      return clearTrackedSummoners(channel);
    case 'list':
      return listTrackedSummoners(channel);
    case 'help':
      return sendHelpMessage(args, channel);
    default:
      if (command)
        channel.send(`Unrecognized command: ${command}`);
      
      return sendDefaultHelpMessage(channel);
  }
});

setInterval(() => trackedSummoners.checkForUpdates(client.channels.cache), 60000);
