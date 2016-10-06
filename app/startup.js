module.exports = {
	initialize:function(serverUrl){
		var http = require('http');
		var server = http.createServer(require('./routes.js').init);
		server.listen(3030,serverUrl);
		var socketio = require('socket.io');
		var io = socketio.listen(server);
		io.set('log level', 1);
		io.sockets.on('connection',onConnection);

		var chatServer = require('./models/chat_server.js');
		var gameServer = require('./models/game_server.js');
		var gameUsers = require('./models/game_users.js');
		function onConnection(socket){
			chatServer.registerIo(io, socket);
			gameServer.registerIo(io, socket);
			gameUsers.registerIo(io, socket);
		}
	}
};
