exports.command = 'play';
exports.description = ``;
exports.func = function( message ) {
  
  //load youtube library
  const ytdl = require('ytdl-core');

  var string = message.content.toLowerCase().replace(/\s/g,''); //remove capitals and whitespace
  var url = string.slice(6);

  var target = message.member.voiceChannel;

  if ( target !== undefined ) {
    /*
    //leave existing voice channel
    if ( guild.me.voiceChannel !== undefined ) {
      guild.me.voiceChannelID.leave();
    }
    */

     function startPlay() {
      var stream = ytdl( 'https://www.youtube.com/watch?v=1X4YQEgWJsw', {filter:'audioonly'} );
      var dispatcher = connection.playStream( stream, streamOptions );
      dispatcher.on("end", () => {
        console.log('song ended');
        startPlay();
      });
    }

    //Play streams using ytdl-core
    target.join()
    .then( connection => {
      var stream = ytdl( 'https://www.youtube.com/watch?v=1X4YQEgWJsw', {filter:'audioonly'} );
      var dispatcher = connection.playStream( stream, {seek:0,volume:1} );
      dispatcher.on("end", () => {
        console.log('song ended');
        startPlay();
      });
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
