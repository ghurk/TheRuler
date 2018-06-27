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
      message.channel.send(`\`\`\`prolog\nPlaylist Empty\`\`\``);
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
          message.delete().catch(O_o=>{});
          play( message );
        })
        //on fail
        .catch();
      }
      else {
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nYou Are Not In Any Voice Channel\`\`\``);
      }
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
        if ( hours > 0 ) { time += hours+"h "; } //display hours
        var minutes = Math.floor(info.length_seconds/60 -hours*60);
        if ( minutes > 0 ) { time += minutes+"m "; } //display minutes
        var seconds = info.length_seconds -minutes*60 -hours*3600;
        time += seconds+"s"; } //display seconds
        

        client.playlist.push( { url:url[1], title:info.title, time:time } );
        message.delete().catch(O_o=>{});
        message.channel.send(`\`\`\`prolog\nAdded: '${url[1]}'\nTitle: '${info.title}'\nTime: '${time}'\`\`\``);
      });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--player list
    else if ( message.content.startsWith( global.prefix+"player"+index+" list" ) ) {
      var string = "";
      client.playlist.forEach( function(track,index) {
        string += `[${index}] '${track.url}'\nTitle: '${track.title}'\nTime: '${track.time}s'\n`;
      });
      message.delete().catch(O_o=>{});
      message.channel.send(`\`\`\`prolog\nPlaylist:\n${string}\`\`\``);
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
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
  });

  //player bot login
  client.login( tokens[index] );
});
