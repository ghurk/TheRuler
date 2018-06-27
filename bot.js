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
  client.playlist.push('https://www.youtube.com/watch?v=-rFW2Df5iRs'); //O - rise
  client.playlist.push('https://www.youtube.com/watch?v=EIVgSuuUTwQ'); //O - inner universe
  //initialize connection reference
  client.connection;
  //store dispatcher
  //client.dispatcher;

  function play() {
    if ( client.playlist.length < 1 ) {
      message.channel.send(`Playlist is empty.`);
      return;
    }
    var track = Math.floor(Math.random()*client.playlist.length);
    var stream = ytdl( client.playlist[track], {filter:'audioonly'} );
    var dispatcher = client.connection.playStream( stream, {seek:0,volume:1} );
    dispatcher.on("end", () => {
      play();
    });
  }

  client.on("ready", () => {
    console.log(`Bot ${index} Activated`);
    client.user.setActivity(`${global.prefix}player${index}`);
  });
    
  client.on("message", async message => {
    if ( message.content.toLowerCase().startsWith( global.prefix+'player'+index ) ) {
      //also add permissions check
      /////////////////////////////////////////////////////////////////////////////////////////////
      //--player play
      if ( message.content.toLowerCase().startsWith(global.prefix+'player'+index+" play") ) {
        //join users voice channel
        if ( message.member.voiceChannel !== undefined ) {
          message.member.voiceChannel.join() //join users voiceChannel
          .then( connection => {
            //start playing
            client.connection = connection;
            play();
          })
          .catch( console.error );
        }
        else {
          message.channel.send(`You are not in any voice channel.`);
        }
      }
      /////////////////////////////////////////////////////////////////////////////////////////////
      //--player add {url}
      else if ( message.content.toLowerCase().startsWith(global.prefix+'player'+index+" add") ) {
        //get url from message
        var url = message.content.toLowerCase().match(/add (.*)?/);
        if ( url === null ) {
          message.channel.send(`Url not specified.`);
          return;
        }
        console.log('url found');///////////////////
        //check if url is valid
        var urlCheck = ytdl.validateURL( url[1] );
        if ( urlCheck === false ) {
          message.channel.send(`Invalid URL.`);
          return;
        }
        console.log('url valid');///////////////////
        //load url info and add to playlist
        ytdl.getInfo( url[1], {downloadURL:false}, function(err,info) {
          console.log( err );
          console.log( info );
          client.playlist.push( url[1] );
          console.log( client.playlist );
        });
        console.log('url added');///////////////////////
      }
      /////////////////////////////////////////////////////////////////////////////////////////////
      //--player remove {index}
      else if ( message.content.toLowerCase().startsWith(global.prefix+'player'+index+" remove") ) {
        //regex find anything after remove {index/all}
        //if result = all => playlist.clear(); else playlist.remove(index)
      }
      /////////////////////////////////////////////////////////////////////////////////////////////
      //--player clear
      else if ( message.content.toLowerCase().startsWith(global.prefix+'player'+index+" clear") ) {
        client.playlist.length = 0; //empty playlist array
        message.channel.send(`Playlist cleared.`);
      }
      /////////////////////////////////////////////////////////////////////////////////////////////
      //--player end
      else if ( message.content.toLowerCase().startsWith(global.prefix+'player'+index+" end") ) {
        //player leave room and stop stream
      }
      /////////////////////////////////////////////////////////////////////////////////////////////
    }
  });

  client.login(tokens[index]);
});
