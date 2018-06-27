//load discord.js library
const Discord = require("discord.js");
//load youtube library and stuff
const ytdl = require('ytdl-core');

//load config.json file
const config = require("./bot_data/config.json");
//set prefix as global variable
global.prefix = config.prefix;
    
//client control object
var clients = [];
var tokens = [];
tokens.push(config.token2);
tokens.push(config.token3);

//initialize a bot per token
tokens.forEach(function(token) {
  clients.push( new Discord.Client() );
});

//create bot functions
clients.forEach( function(client,index) {
  
  //initialize playlist array
  client.playlist = [];
  //initialize connection reference
  client.connection;

  function play( message ) {
    if ( client.playlist.length < 1 ) {
      message.channel.send(`\`\`\`Playlist is empty.\`\`\``);
      return;
    }
    var track = Math.floor(Math.random()*client.playlist.length);
    var stream = ytdl( client.playlist[track].url, {filter:'audioonly'} );
    var dispatcher = client.connection.playStream( stream, {seek:0,volume:1} );
    dispatcher.on("end", () => {
      play();
    });
  }

  client.on( "ready", () => {
    client.user.setActivity(`${global.prefix}player${index}`);
  });
    
  client.on( "message", async message => {
    
    if ( !message.content.startsWith( global.prefix+"player"+index ) ) {
      return;
    }
    //add permissions check here
    
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player play
    if ( message.content.startsWith( global.prefix+"player"+index+" play" ) ) {
      //join user voice channel
      if ( message.member.voiceChannel !== undefined ) {
        message.member.voiceChannel.join() //join users voiceChannel
        //on success
        .then( connection => {
          client.connection = connection;
          play( message );
        })
        //on fail
        .catch( message.channel.send(`\`\`\`Connection failed.\`\`\``) );
      }
      else {
        message.channel.send(`\`\`\`You are not in any voice channel.\`\`\``);
      }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player add {url}
    else if ( message.content.startsWith( global.prefix+"player"+index+" add" ) ) {
      //get url from message
      var url = message.content.match(/add (.*)?/);
      if ( url === null ) {
        message.channel.send(`\`\`\`Url not specified.\`\`\``);
        return;
      }
      //check if url is valid
      var urlCheck = ytdl.validateURL( url[1] );
      if ( urlCheck === false ) {
        message.channel.send(`\`\`\`Invalid URL.\`\`\``);
        return;
      }
      //load url info and add to playlist
      ytdl.getInfo( url[1], {downloadURL:false}, function(err,info) {
        if ( err !== null ) {
          message.channel.send(`\`\`\`Error loading URL.\`\`\``);
          return;
        }
        client.playlist.push( { url:url[1], title:info.title, time:info.length_seconds } );
        message.channel.send(`\`\`\`${url[1]} added to playlist.\`\`\`title: \`\`${info.title}\`\` time: \`\`${info.length_seconds} seconds\`\``);
      });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player list
    else if ( message.content.startsWith( global.prefix+"player"+index+" list" ) ) {
      var string = "";
      client.playlist.forEach( function(track,index) {
        string += `[${index}] ${track.url}\ntitle: ${track.title} time: ${track.time} seconds\n`;
      });
      message.channel.send(`\`\`\`Playlist:\n${string}\`\`\``);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player remove {index}
    else if ( message.content.startsWith( global.prefix+"player"+index+" remove" ) ) {
      //regex find anything after remove {index}
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player clear
    else if ( message.content.startsWith( global.prefix+"player"+index+" clear" ) ) {
      client.playlist.length = 0; //empty playlist array
      message.channel.send(`\`\`\`Playlist cleared.\`\`\``);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player end
    else if ( message.content.startsWith( global.prefix+"player"+index+" end" ) ) {
      //player leave room and stop stream
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
  });

  //player bot login
  client.login( tokens[index] );
});
