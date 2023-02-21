

// Dependencies: ["discord.js", "dblapi.js"]

const Discord = require('discord.js'); // Require the Discord.JS library.
const client = new Discord.Client(); // Create a new client instance.
var { readdirSync } = require('fs'); // Require method used for reading directory lists from file system library.

client.config = require('./config.js'); // Set's client.config to your config.
client.commands = new Discord.Collection(); // Collections are something really cool custom to Discord.JS. Docs for them: https://discord.js.org/#/docs/main/stable/class/Collection

// Command Handler / Setup.

for(const file of readdirSync('./commands/')) { // Iterates through every file in the ./commands/ folder.
  if(!file.endsWith(".js")) return; // This is to prevent any files that aren't .js files from being processed as a command.
  var fileName = file.substring(0, file.length - 3); // Removes last three characters from file name to get rid of the .js extension (which should™ be .js ^^) for propper file name.

  var fileContents = require(`./commands/${file}`); // Defines fileContents of the export of the command in question.
  client.commands.set(fileName, fileContents); // Adds the command name to the client.commands collection with a value of it's respective exports.
}

// Event Handler / Setup.

for(const file of readdirSync('./events/')) { // Iterates through every file in the ./events/ folder.
  if(!file.endsWith(".js")) return; // This is to prevent any files that aren't .js files from being processed as a command.
  var fileName = file.substring(0, file.length - 3); // Removes last three characters from file name to get rid of the .js extension (which should™ be .js ^^) for propper file name.
  
  var fileContents = require(`./events/${file}`); // Defines fileContents of the export of the event in question.

  client.on(fileName, fileContents.bind(null, client)); // Set's the event of whatever the file name is to the bound function of said export (this will automatically make the first parmater of the export function to client.
  delete require.cache[require.resolve(`./events/${file}`)]; // Removes the cache of the required file to make it easier to reload and not take of more memory than needed.
}

client.login(client.config.token) // Logs into Discord with the token defined in config.
  .then(() => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    if(!client.user.bot) { console.log("[JPBTips] Don't self bot idot"); return process.exit() }; // See the logic is that if someone is stupid enough to self bot they wont find this

 console.log(`Client logged in as ${client.user.tag}`);
    // Tells you when the bot has logged in!
  })
  .catch((err) => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    console.error("Error while logging in: " + err); // If an error occurs while logging in it will tell you in console.
    if(err.toString().match(/incorrect login details/gi)) console.log("[JPBTips] | Make sure to change up your config!"); //If error (^) is about incorrect login, I come in and remind y'all to edit the config first before using this template--
  });
