exports.command = 'roll';
exports.description = `i am able to roll a dice for you\nFormat:\n'${global.prefix}roll d{dice}' or '${global.prefix}roll {throws}d{dice}'\nExamples:\n'${global.prefix}roll d6' => 'roll 1d6'\n'--roll k6' => 'roll 1d6'\n'${global.prefix}roll 2D6' => 'roll 2d6'\n'${global.prefix}Roll 2K6' => 'roll 2d6'\n'${global.prefix}roll 2x 6' => 'roll 2d6'\n'${global.prefix}ROLL 2 * 6' => 'roll 2d6'`;
exports.func = function( message ) {

  var string = message.content.toLowerCase().replace(/\s/g,''); //remove capitals and whitespace

  var num1 = string.match(/roll(\d+)/); //get multiplier
  var num2 = string.match(/(?:d|k|x|\*)(\d+)/); //get dice
  if ( num1 === null && num2 === null ) return; //quit if no number is specified

  //case 1: roll d{} or roll {}d{}
  if ( num2 !== null ) {
    var throws = 1; //default throws
    if ( num1 !== null ) throws = Number(num1[1]); //set from message if found
    var dice = Number(num2[1]); //set from message
  }
  //case 2: roll {}
  else {
    var throws = 1; //default throws
    var dice = Number(num1[1]); //set from message
  }

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
    //add ',' between throws
    if ( i+1 < throws ) {
      resultString += ',';
    }
  }
  var average = Math.round(total/throws*10)/10;

  var details = '';
  if ( throws > 1 ) {
    details = `avg:${average} total:${total}`;
  }

  //delete request message and send results
  message.delete().catch(O_o=>{});
  message.channel.send(`${message.author} rolled\`\`\`prolog\n${resultString} on '${throws}d${dice}' ${details}\`\`\``);
};
