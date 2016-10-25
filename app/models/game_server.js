module.exports = {
	io:null,
	gameRooms:{},
	gameid: new Date().getTime(),
	gamesList:require('./game_list.js'),
	gameUsers: require('./game_users.js'),
	registerIo:function(io, socket){
		this.io = io;
		// var Jaipur = require('./games/jaipur/game.js');
		// var obj = new Jaipur();
		//console.log(obj);
		socket.emit('GameServer:UpdateGameList',this.gamesList);
		socket.emit('GameServer:UpdateGameRooms',this.gameRooms);
		socket.on('GameServer:JoinGameRoom',this.onJoinGameRoom.bind(this));
		socket.on('GameServer:LeaveGameRoom',this.onLeaveGameRoom.bind(this));
		socket.on('GameServer:MakeGameRoom',this.onMakeGameRoom.bind(this));
		socket.on('GameServer:StartGame',this.onStartGame.bind(this));
		socket.on('disconnect',this.onDisconnect);
	},
	onMakeGameRoom:function(data){
		var socketid = data.socketid;
		var game = data.game;
		var room = {
			players:{},
			owner: socketid,
			game: game,
			gameid: this.gameid
		};
		var user = this.gameUsers.getServerUserInfo(socketid);
		user.gameid = this.gameid;
		room.players[socketid] = this.gameUsers.getUserInfo(socketid);
		this.gameRooms[user.gameid] = room;
		this.io.sockets.sockets[data.socketid].emit('GameServer:GameRoomCreated',this.gameid);
		this.io.sockets.emit('GameServer:UpdateGameRooms',this.gameRooms);
		this.gameid++;
	},
	onJoinGameRoom:function(data){
		var room = this.gameRooms[data.gameid];
		var user = this.gameUsers.getUserInfo(data.socketid);
		room.players[data.socketid] = user;
		this.io.sockets.emit('GameServer:UpdateGameRooms',this.gameRooms);
	},
	onStartGame:function(gameid){
		console.log("START",gameid);
		var room = this.gameRooms[gameid];
		var socketids = Object.keys(room.players);
		var sockets = socketids.map(function(socketid){
			return this.io.sockets.sockets[socketid];
		}.bind(this));
		var Game = new require('./games/' + room.game + '/game.js');
		var gameObj = new Game(sockets);
		gameObj.socketsEmit('GameServer:GameLoaded');
	},
	onLeaveGameRoom:function(data){
		var room = this.gameRooms[data.gameid];
		if(room !== void 0){
			delete room.players[data.socketid];
			if(room.owner == data.socketid){
				room.owner = Object.keys(room.players)[0];
			}
			if(Object.keys(room.players).length == 0){
				delete this.gameRooms[data.gameid];
			}
			this.io.sockets.emit('GameServer:UpdateGameRooms',this.gameRooms);
		}
	},
	onDisconnect:function(){
		var room = module.exports.getGameBySocketid(this.id);
		if(room !== void 0){
			delete room.players[this.id];
			if(room.owner == this.id){
				room.owner = Object.keys(room.players)[0];
			}
			if(Object.keys(room.players).length == 0){
				delete module.exports.gameRooms[room.gameid];
			}
			module.exports.io.sockets.emit('GameServer:UpdateGameRooms',module.exports.gameRooms);
		}
		console.log("DISCONNECTIONS",this.id);
	},
	getGameBySocketid:function(socketid){
		var game;
		for(var i in this.gameRooms){
			var room = this.gameRooms[i];
			if(room.players[socketid] !== void 0){
				game = room;
			}
		}
		return game;
	}
};
