//load discord.js library
const Discord = require("discord.js");
//load youtube library and stuff
const ytdl = require('ytdl-core');

//load config.json file
const config = require("./bot_data/config.json");
//set prefix as global variable
global.prefix = config.prefix;



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





    
    
    
//client control object
var clients = [];
var tokens = [];
//tokens.push(config.token2);
tokens.push(config.token3);

//initialize a bot per token
tokens.forEach(function(token) {
  clients.push( new Discord.Client() );
});

//create bot functions
clients.forEach( function(client,index) {
  
  //initialize playlist array
  client.playlist = [];
  client.playlist.push('https://www.youtube.com/watch?v=-rFW2Df5iRs'); //O - rise
  client.playlist.push('https://www.youtube.com/watch?v=EIVgSuuUTwQ'); //O - inner universe
  //initialize connection reference
  client.connection;

  client.on("ready", () => {
    console.log(`Bot ${index} Activated`);
    client.user.setActivity(`${global.prefix}play${index}`);
  });
  client.on("message", async message => {
    if ( message.content.toLowerCase().startsWith( global.prefix+'player'+index ) ) {
      
      if ( message.member.voiceChannel !== undefined ) {
        message.member.voiceChannel.join() //join users voiceChannel
        .then( connection => {
          client.connection = connection;
          var stream = ytdl( client.playlist[0], {filter:'audioonly'} );
          var dispatcher = client.connection.playStream( stream, {seek:0,volume:1} );
        })
        .catch( console.error );
      }
      
    }
  });
  /*
  client.on('messageUpdate', (oldMessage, message) => {
  });
  */

  client.login(tokens[index]);
});
