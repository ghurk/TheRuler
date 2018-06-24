exports.command = 'play';
exports.description = ``;
exports.func = function( message ) {

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

    //Play streams using ytdl-core
    var streamOptions = { seek: 0, volume: 1 };
    target.join()
    .then( connection => {
      const ytdl = require('ytdl-core');
      var stream = ytdl( 'https://www.youtube.com/watch?v=1X4YQEgWJsw', {filter:'audioonly'} );
      var dispatcher = connection.playStream( stream, streamOptions );
      dispatcher.on("end", () => {
        console.log('song ended');
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
