module.exports = (client) => { // Function for when client has logged in.
  if(!client.user.bot) { console.log("[JPBTips] Don't self bot idot (you thought you fixed it)"); return process.exit() }; // See the logic is that if someone is stupid enough to self bot they wont find this //double check
  client.user.setPresence( // Set's presence data to following object \/
    {
      status: "offline", // Makes status "online", (Green Bubble).
      afk: true, // Sets AFK to false, even though it's useless on bots....
      game: { // Game object.
        name: client.config.statusMessage, // Set's game name to the statusMessage value of the config file.
        url: null, // Set's the game's URL to null because this is a PLAYING presence.
        type: "STREAMING" // https://discord.js.org/#/docs/main/stable/typedef/ActivityType
      }
    }
  );

  if(client.config.dbltoken) { 
    const DBL = require('dblapi.js');
    const dbl = new DBL(client.config.dbltoken) 
    dbl.on('error', (err) => { // Adds event for if DBL ever errors.
      console.error(`Error while posting stats to DBL: ${err.status} | ${err.message}`);
      if(err.status == 401) { // If error was for being unauthorized.
        if(client.config.token == client.config.dbltoken) return console.log("[JPBTips] Your bot token is not your dbltoken. (Read bottom of ready.js for more info otherwise leave 'dbltoken' as undefined).");
      else console.log("[JPBTips] Your DBL token is incorrect!");
      }
    })
    dbl.on('posted', () => { // Adds event for when DBL posts successfully
      console.log(`Posted stats to dbl. ${client.guilds.size} servers...`);
    })

    dbl.postStats(client.guilds.size) 
      .then(()=>dbl.emit('posted')) 
      .catch((err)=>dbl.emit('error',err));
    setInterval(() => {
      dbl.postStats(client.guilds.size)
        .then(()=>dbl.emit('posted')) 
        .catch((err)=>dbl.emit('error',err)) 
    }, 1800000)
  }
}
