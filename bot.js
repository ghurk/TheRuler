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
    
  /////////////////////////////////////////////////
  client.playlist = []; //playlist
  client.connection; //VC connection
  client.indexRef = index; //index of this player
  client.track = 0; //index of playing track
  client.random = true; //random/repeat setting
  /////////////////////////////////////////////////
  function play( message ) {
    //check if playlist contains anything to play
    if ( client.playlist.length < 1 ) {
      message.channel.send(`\`\`\`prolog\nPlaylist Empty\`\`\``);
      return;
    }
    //reset pausedTime to fix incrementing pause issue
    client.connection.player.streamingData.pausedTime = 0;
    //choose track to play
    if ( client.random === false ) {
      client.track += 1;
      if ( client.track >= client.playlist.length ) { client.track = 0; }
    }
    else {
      client.track = Math.floor(Math.random()*client.playlist.length);
    }
    //play track
    let stream = ytdl( client.playlist[client.track].url, {filter:'audioonly'} );
    stream.on( 'error', console.error );
    let dispatcher = client.connection.playStream( stream, {seek:0,volume:1} );
    dispatcher.on( "end", (reason) => {if(reason!=="command"){play(message);}} );
    dispatcher.on( 'error', console.error );
    dispatcher.on( 'failed', console.error );
  }
  /////////////////////////////////////////////////
  client.on( "ready", () => {
    client.user.setActivity(`${global.prefix}player${index}`);
  });
  /////////////////////////////////////////////////
  client.on( "message", async message => {
    
    if ( !message.content.startsWith( global.prefix+"player"+index ) ) {
      return;
    }
    //add permissions check here
    
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player playlist
    if ( message.content.startsWith( global.prefix+"player"+index+" playlist" ) ) {
      let string = "";
      client.playlist.forEach( function(track,index) {
        string += `[${index}] '${track.url}'\nTitle: '${track.title}'\nTime: '${track.time}'\n`;
      });
      message.delete().catch(O_o=>{});
      message.channel.send(`\`\`\`prolog\nPlaylist:\n${string}\`\`\``);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player play
    else if ( message.content.startsWith( global.prefix+"player"+index+" play" ) ) {
      //check if user is in voice channel
      if ( message.member.voiceChannel === undefined ) {
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nYou Are Not In Any Voice Channel\`\`\``);
        return;
      }
      //join user voice channel
      message.member.voiceChannel.join() //join users voiceChannel
      //on success
      .then( connection => {
        //prevent multi-play & reset played track on new command
        if ( client.connection !== undefined && client.connection.dispatcher !== undefined ) {
          client.connection.dispatcher.end( "command" );
          console.log("DELETED DISPATCHER");
        }
        client.connection = connection;
        play( message );
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nPlaying In Channel '${message.member.voiceChannel.name}'\`\`\``);
      })
      //on fail
      .catch();
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player add {url}
    else if ( message.content.startsWith( global.prefix+"player"+index+" add" ) ) {
      //get url from message
      let url = message.content.match(/add (.*)?/);
      if ( url === null ) {
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nURL Not Specified\`\`\``);
        return;
      }
      //check if url is valid
      let urlCheck = ytdl.validateURL(url[1]);
      if ( urlCheck === false ) {
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nInvalid URL\`\`\``);
        return;
      }
      //load url info and add to playlist
      ytdl.getInfo( url[1], {downloadURL:false}, function(err,info) {
        if ( err !== null ) {
          message.delete().catch(O_o=>{});
          message.channel.send(`\`\`\`prolog\nError Loading URL.\`\`\``);
          return;
        }
        let time = "";
        let hours = Math.floor(info.length_seconds/3600);
        if ( hours > 0 ) { time += `${hours}h `; } //display hours
        let minutes = Math.floor(info.length_seconds/60 -hours*60);
        if ( minutes > 0 ) { time += `${minutes}m `; } //display minutes
        let seconds = info.length_seconds -minutes*60 -hours*3600;
        time += `${seconds}s`; //display seconds

        client.playlist.push( { url:url[1], title:info.title, time:time } );
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nAdded: '${url[1]}'\nTitle: '${info.title}'\nTime: '${time}'\`\`\``);
      });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player remove {index}
    else if ( message.content.startsWith( global.prefix+"player"+index+" remove" ) ) {
      //get track index from message
      let toRemove = message.content.match(/remove (\d+)/);
      if ( toRemove === null ) {
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nTrack Not Specified\`\`\``);
        return;
      } 
      let removedTrack = client.playlist.splice(toRemove[1],toRemove[1]+1)[0];
      message.delete().catch(O_o=>{});
      message.channel.send(`\`\`\`prolog\nRemoved: '${removedTrack.url}'\nTitle: '${removedTrack.title}'\nTime: '${removedTrack.time}'\`\`\``);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player random
    else if ( message.content.startsWith( global.prefix+"player"+index+" random" ) ) {
      client.random = true;
      message.delete().catch(O_o=>{});
      message.channel.send(`\`\`\`prolog\nPlayer Set To 'Random'\`\`\``);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player repeat
    else if ( message.content.startsWith( global.prefix+"player"+index+" repeat" ) ) {
      client.random = false;
      message.delete().catch(O_o=>{});
      message.channel.send(`\`\`\`prolog\nPlayer Set To 'Repeat'\`\`\``);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player clear
    else if ( message.content.startsWith( global.prefix+"player"+index+" clear" ) ) {
      client.playlist.length = 0; //empty playlist array
      message.delete().catch(O_o=>{});
      message.channel.send(`\`\`\`prolog\nPlaylist Cleared\`\`\``);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player end
    else if ( message.content.startsWith( global.prefix+"player"+index+" end" ) ) {
      //player leave room and stop stream
      if ( client.connection !== undefined ) {
        client.connection.disconnect();
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nDisconnected From Voice Channel\`\`\``);
      }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
  });

  //player bot login
  client.login( tokens[index] );
});
