exports.command = 'play';
exports.description = ``;
exports.func = function( message ) {

  var string = message.content.toLowerCase().replace(/\s/g,''); //remove capitals and whitespace
  var url = string.slice(6);

  var target = message.member.voiceChannel;

  if ( target !== undefined ) {


    /*
    //console.log('nothing');
    // Join a voice channel
    target.join()
    .then( connection => message.channel.send(`connected`) )
    .catch( console.error );
    //const dispatcher = connection.playFile('./audiofile.mp3');
    */

    //Play streams using ytdl-core
    var streamOptions = { seek: 0, volume: 1 };
    target.join()
    .then( connection => {
      const ytdl = require('ytdl-core');
      var stream = ytdl( 'https://www.youtube.com/watch?v=XAWgeLF9EVQ', {filter:'audioonly'} );
      var dispatcher = connection.playStream( stream, streamOptions ); //connection.playStream( stream, streamOptions );
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
