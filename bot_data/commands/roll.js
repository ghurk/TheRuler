exports.command = 'roll';
exports.description = `i am able to roll a dice for you\nFormat:\n'${global.prefix}roll d{dice}' or '${global.prefix}roll {throws}d{dice}'\nExamples:\n'${global.prefix}roll d6' => 'roll 1d6'\n'--roll k6' => 'roll 1d6'\n'${global.prefix}roll 2D6' => 'roll 2d6'\n'${global.prefix}Roll 2K6' => 'roll 2d6'\n'${global.prefix}roll 2x 6' => 'roll 2d6'\n'${global.prefix}ROLL 2 * 6' => 'roll 2d6'`;
exports.func = function( message ) {

  var string = message.content.toLowerCase().replace(/\s/g,''); //remove capitals and whitespace

  var num1 = string.match(/roll(\d+)/); //get multiplier
  var num2 = string.match(/(?:d|k|x|\*)(\d+)/); //get dice
  if ( num2 === null ) return; //quit if no dice is specified

  var throws = 1; //default throws
  if ( num1 !== null ) throws = Number(num1[1]); //set from message if found
  var dice = Number(num2[1]); //set from message

  //check if throw is lesser than 1d2
  if ( throws < 1 || dice < 2 ) {
    message.channel.send(`\`\`\`${throws}d${dice} is below minimum of 1d2\`\`\``);
    return;
  }
  //check if throw is bigger than 10d1000
  if ( throws > 10 || dice > 1000 ) {
    message.channel.send(`\`\`\`${throws}d${dice} exceeds limit of 10d1000\`\`\``);
    return;
  } 

  //create string of thrown numbers
  var resultString = '';
  var total = 0;
  for( i=0; i<throws; i++ ) {
    var result = Math.floor((Math.random()*dice)+1);
    resultString += result;
    total += result;
    //add ', ' between throws and ' ' after
    if ( i+1 < throws ) {
      resultString += ', ';
    }
    else {
      resultString += ' ';
    }
  }
  var average = total/throws;

  //delete request message and send results
  message.delete().catch(O_o=>{});
  message.channel.send(`${message.author} rolled ${resultString}on ${throws}d${dice} [ avg: ${average}, total: ${total} ]`);
};
