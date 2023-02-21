module.exports = (client, message, args) => { // This will pass through client, the message object, and args.
  message.channel.send("Pong!"); // Replies with the message "Pong!".
}
