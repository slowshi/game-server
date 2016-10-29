module.exports = {
	io: null,
	room: 'lobby',
	chatLogs: [],
	userList: {},
	gameUsers: require('./game_users.js'),
	registerIo: function(io, socket) {
		this.io = io;
		socket.on('ChatServer:JoinRoom', this.joinRoom.bind(this));
		socket.on('ChatServer:SendMessage', this.onMessageSent.bind(this));
		socket.on('disconnect', this.onDisconnect);
	},
	onDisconnect: function(socket) {
		console.log("User Has Left:",this.id);
		module.exports.leaveRoom(this.id);
	},
	joinRoom: function(data) {
		var room = data.room;
		var socketid = data.socketid;
		var user = this.gameUsers.getServerUserInfo(socketid);
		user.socket.join('lobby');
		user.rooms.push('lobby');

		console.log("User: "+ user.socket.id + " Has Entered:", room);

		this.io.sockets.emit('GameUser:UpdateUserList',
			this.gameUsers.getUserList());
		var userInfo = this.gameUsers.getUserInfo(socketid);
		user.socket.emit('GameUser:UpdateUserInfo', userInfo);
	},
	leaveRoom: function(socketid) {
		if(this.gameUsers.userList[socketid] !== void 0) {
			delete this.gameUsers.userList[socketid];
		}
		this.io.sockets.emit('GameUser:UpdateUserList',
			this.gameUsers.getUserList());
	},
	onMessageSent: function(message) {
		var user = this.gameUsers.getUserInfo(message.socketid);
		for(var i in user) {
			message[i] = user[i];
		}
		this.io.sockets.in(message.room).emit('ChatServer:RecieveMessage', message);
	},
};
