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
    console.log("play f started");
    if ( client.playlist.length < 1 ) {
      message.channel.send(`\`\`\`prolog\nPlaylist Empty\`\`\``);
      return;
    }
    var track = Math.floor(Math.random()*client.playlist.length);
    //var stream = ytdl( client.playlist[track].url, {filter:'audioonly'} );
    var dispatcher = client.connection.playStream( ytdl(client.playlist[track].url,{filter:'audioonly'}), {seek:-5,volume:1} );
    console.log("stream started");
      //start new song only if not ended because of command
    dispatcher.on("end", (reason) => {
        
      console.log( dispatcher.time );
      console.log( dispatcher.totalStreamTime );
        
      console.log('ended');
      console.log( reason );
      if ( reason !== "command" ) {
        play();
      }
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
    //--player playlist
    if ( message.content.startsWith( global.prefix+"player"+index+" playlist" ) ) {
      var string = "";
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
        //end current stream dispatcher if connection&dispatcher exist (prevent multi-play)
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
      var url = message.content.match(/add (.*)?/);
      if ( url === null ) {
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nURL Not Specified\`\`\``);
        return;
      }
      //check if url is valid
      var urlCheck = ytdl.validateURL( url[1] );
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
        var time = "";
        var hours = Math.floor(info.length_seconds/3600);
        if ( hours > 0 ) { time += `${hours}h `; } //display hours
        var minutes = Math.floor(info.length_seconds/60 -hours*60);
        if ( minutes > 0 ) { time += `${minutes}m `; } //display minutes
        var seconds = info.length_seconds -minutes*60 -hours*3600;
        time += `${seconds}s`; //display seconds
        

        client.playlist.push( { url:url[1], title:info.title, time:time } );
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nAdded: '${url[1]}'\nTitle: '${info.title}'\nTime: '${time}'\`\`\``);
      });
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
