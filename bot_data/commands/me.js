
exports.command = 'me';
exports.description = `i am able to tell you details about yourself\nFormat:\n'${global.prefix}me'`;
exports.func = function( message ) {
	message.delete().catch(O_o=>{});
	message.channel.send(`you are ${message.author}`);
};
