exports.command = 'play';
exports.description = ``;
exports.func = function( message ) {
  
  //load youtube library and stuff
  const ytdl = require('ytdl-core');

  //var string = message.content.toLowerCase().replace(/\s/g,''); //remove capitals and whitespace
  //var url = string.slice(6);

  var target = message.member.voiceChannel;
  
  //create playlist
  var playlist = [];
  playlist.push('https://www.youtube.com/watch?v=-rFW2Df5iRs'); //O - rise
  playlist.push('https://www.youtube.com/watch?v=EIVgSuuUTwQ'); //O - inner universe
  playlist.push('https://www.youtube.com/watch?v=AIbzZPePNKg'); //O - player
  playlist.push('https://www.youtube.com/watch?v=u0ow4tGgZWk'); //YK - torukia
  
  function playerStart(connection) {
    console.log('new function started');
    //start stream
    var random = Math.floor(Math.random()*playlist.length);
    var stream = connection.playStream( ytdl(playlist[random],{filter:'audioonly'}), {seek:0,volume:1} );
    console.log('new stream started');
    //play new stream on stream end
    stream.on("end", () => {
      console.log('song ended');
      playerStart( connection );
    });
  }

  //if author.voiceChannel is set
  if ( target !== undefined ) {
    //play stream
    target.join()
    .then( connection => {
        playerStart( connection );
    })
    .catch( console.error );
  }
  //else notify user of error
  else {
    message.channel.send(`You are not in any voice channel.`);
  }

};
