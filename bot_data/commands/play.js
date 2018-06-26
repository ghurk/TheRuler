exports.command = 'play';
exports.description = ``;
exports.func = function( message ) {
  
  //load youtube library and stuff
  const ytdl = require('ytdl-core');
  var stream;

  var string = message.content.toLowerCase().replace(/\s/g,''); //remove capitals and whitespace
  var url = string.slice(6);

  var target = message.member.voiceChannel;
  
  //create playlist
  var playlist = [];
  playlist.push('https://www.youtube.com/watch?v=-rFW2Df5iRs'); //O - rise
  playlist.push('https://www.youtube.com/watch?v=EIVgSuuUTwQ'); //O - inner universe
  playlist.push('https://www.youtube.com/watch?v=AIbzZPePNKg'); //O - player
  playlist.push('https://www.youtube.com/watch?v=u0ow4tGgZWk'); //YK - torukia

  //if author.voiceChannel is set
  if ( target !== undefined ) {
    /*
    //leave existing voice channel
    if ( guild.me.voiceChannel !== undefined ) {
      guild.me.voiceChannelID.leave();
    }
    */

    function playerStart(connection) {
      console.log('new function started');
      stream = ytdl( playlist[ Math.floor(Math.random()*playlist.length) ], {filter:'audioonly'} );
      var dispatcher = connection.playStream( stream, {seek:0,volume:1} );
      console.log('new stream started');
      //play new song on end
      dispatcher.on("end", () => {
        console.log('song ended');
        startPlay(connection);
      });
    }

    //Play streams using ytdl-core
    target.join()
    .then( connection => {
        playerStart(connection);
    })
    .catch( console.error );


  }
  else {
    message.channel.send(`You are not in any voice channel.`);
  }

  //delete request message
  message.delete().catch(O_o=>{});
  //do something wtfffffffffffffff
  message.channel.send(`${url} // ${target}`);
};
