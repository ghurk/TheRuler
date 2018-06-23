//load discord.js library
const Discord = require("discord.js");
//load youtube library
const ytdl = require('ytdl-core');

//client control object
const client = new Discord.Client();
const client2 = new Discord.Client();

//load config.json file
const config = require("./bot_data/config.json");
global.prefix = config.prefix; //set global prefix variable

client.on("ready", () => {
  console.log('Bot Activated');
  client.user.setActivity(`--play0`);
});
client2.on("ready", () => {
  console.log('Bot Activated');
  client.user.setActivity(`--play1`);
});

//load commands from folder
var commands = [];
const fileSystem = require('fs');
fileSystem.readdirSync('./bot_data/commands/').forEach(file => {
  console.log(file);
  commands.push( require('./bot_data/commands/'+file) );
})

function messageControl(message) {

  if ( message.author.bot ) return; //return if author is bot

  //message.author.send('you sent message to chat didnt ya');
  if ( message.channel.type === 'dm' ) return; //personal message

  if ( !message.content.startsWith(global.prefix) ) return; //return if message doesnt start with prefix

  if ( message.content.toLowerCase().startsWith( global.prefix+'info' ) ) {

    var sufix = message.content.toLowerCase().match(/info (.*)/);
    if ( sufix !== null ) sufix = sufix[1];
    console.log(sufix);

    //print general info if no sufix is specified
    if ( sufix === null ) {
      message.delete().catch(O_o=>{});
      message.channel.send(`\`\`\`prolog\nuse command '${global.prefix}info commands' to get list of available commands\nuse command '${global.prefix}info {command}' to get details about specified command\`\`\``);
      return;
    }
    //print list of commands on 'commands' sufix
    else if ( sufix === 'commands' ) {
      var string = `\`\`\`prolog\nlist of available commands:\n`;
      commands.forEach(function(command) {
        string += `'${global.prefix}${command.command}'\n`;
      });
      message.delete().catch(O_o=>{});
      message.channel.send(`${string}\`\`\``);
      return;
    }
    //else look for command in list if other sufix is specified
    else {
      var found = false;
      commands.forEach(function(command) {
        if ( command.command === sufix ) {
          message.delete().catch(O_o=>{});
          message.channel.send(`\`\`\`prolog\n'${global.prefix}${command.command}' info:\n${command.description}\`\`\``);
          found = true;
          return;
        }
      });
      if ( found === false ) {
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\ncommand '${global.prefix}${sufix}' not found\`\`\``);
        return;
      }
    }
  }
  else {

    var found = false;

    //check if message command matches any of loaded commands
    commands.forEach(function(command) {
      if ( message.content.toLowerCase().startsWith( config.prefix+command.command ) ) {
        //execute command and return
        command.func(message);
        found = true;
        return;
      }
    });

    if ( found === false ) {
      message.channel.send(`\`\`\`prolog\ncommand not recognized\`\`\``);
    }

  }
}

//runs every time a message on server is posted or edited
client.on("message", async message => {
  messageControl(message);
});
client.on('messageUpdate', (oldMessage, message) => {
  messageControl(message);
});

client.login(config.token2);

//runs every time a message on server is posted or edited
client2.on("message", async message => {
  messageControl(message);
});
client2.on('messageUpdate', (oldMessage, message) => {
  messageControl(message);
});

client2.login(config.token3);
