module.exports = {
	io:null,
	chatRooms:{},
	room:'Lobby',
	chatLogs:[],
	gameUsers: require('./game_users.js'),
	registerIo:function(io, socket) {
		this.io = io;
		socket.on('ChatServer:JoinRoom',this.joinRoom.bind(this));
		socket.on('ChatServer:SendMessage',this.onMessageSent.bind(this));
		socket.on('disconnect',this.onDisconnect);
	},
	onDisconnect:function(socket) {
		console.log("User Has Left:",this.id);
		module.exports.leaveRoom(this.id);
	},
	joinRoom:function(data) {
		var room = data.room;
		var socketid = data.socketid;
		var user = this.gameUsers.getServerUserInfo(socketid);
		user.socket.join('Lobby');
		console.log("User: "+ user.socket.id +" Has Entered:",room);
		if(this.chatRooms[room] == void 0) {
			this.chatRooms[room] = {};
		}
		this.chatRooms[room][socketid] = this.gameUsers.getUserInfo(socketid);
		this.io.sockets.in(room).emit('ChatServer:UpdateUserList',
			{room: room, users: this.chatRooms[room]});
	},
	leaveRoom:function(socketid) {
		for(var i in this.chatRooms) {
			var room = this.chatRooms[i];
			if(this.chatRooms[i][socketid] !== void 0) {
				delete this.chatRooms[i][socketid];
			}
			this.io.sockets.in(i).emit('ChatServer:UpdateUserList',
				{room: i, users: room});
		}
	},
	onMessageSent:function(message) {
		var user = this.gameUsers.getUserInfo(message.socketid);
		for(var i in user) {
			message[i] = user[i];
		}
		this.io.sockets.in(message.room).emit('ChatServer:RecieveMessage',message);
	}
};