define([],function() {
	var GameRoomService = function(GameUser, EventEmitter, storeService) {
		var gameUserStore = storeService.store.getState().gameUser;
		return {
			user: GameUser,
			emitter: EventEmitter,
			gameRooms: {},
			gameList: {},
			onConnect: function() {
				gameUserStore.socket.on('GameServer:UpdateGameList', this.onUpdateGameList.bind(this));
				gameUserStore.socket.on('GameServer:GameRoomCreated', this.onMakeGameRoom.bind(this));
				gameUserStore.socket.on('GameServer:GameLoaded', this.onGameLoaded.bind(this));
				gameUserStore.socket.on('GameServer:UpdateGameRooms', this.onUpdateGameRooms.bind(this));
			},
			onDisconnect: function(user) {
				console.log('gameRoomDisconnect');
				gameUserStore.socket.removeAllListeners('GameServer:UpdateGameList');
				gameUserStore.socket.removeAllListeners('GameServer:UpdateGameRooms');
				gameUserStore.socket.removeAllListeners('GameServer:GameRoomCreated');
				gameUserStore.socket.removeAllListeners('GameServer:GameLoaded');
			},
			onUpdateGameList: function(data) {
				this.gameList = data;
			},
			onUpdateGameRooms: function(data) {
				this.gameRooms = data;
			},
			onMakeGameRoom: function(gameid) {
				GameUser.setGameid(gameid);
			},
			createGame: function(name) {
				var gameInfo = {
					socketid: gameUserStore.socketid,
					game: name,
				};
				gameUserStore.socket.emit('GameServer:MakeGameRoom', gameInfo);
				//this.emitter.trigger('GameView:ChangeState', 'gameroom');
			},
			joinGameRoom: function(gameid) {
				var gameInfo = {
					gameid: gameid,
					socketid: gameUserStore.socketid,
				};
				gameUserStore.gameid = gameid;
				gameUserStore.socket.emit('GameServer:JoinGameRoom', gameInfo);
				//this.emitter.trigger('GameView:ChangeState','gameroom');
			},
			leaveGameRoom: function() {
				var gameInfo = {
					gameid: gameUserStore.gameid,
					socketid: gameUserStore.socketid,
				};
				gameUserStore.socket.emit('GameServer:LeaveGameRoom', gameInfo);
				gameUserStore.gameid = null;
				//this.emitter.trigger('GameView:ChangeState', 'lobby');
			},
			startGame: function() {
				gameUserStore.socket.emit('GameServer:StartGame', gameUserStore.gameid);
			},
			onGameLoaded: function() {
				var gameName = this.getUsersGame().game;
				//this.emitter.trigger('GameView:ChangeState', gameName);
			},
			getGameInfo: function(game) {
				return this.gameList[game];
			},
			getGameRoomOccupants: function(gameid) {
				var room = this.gameRooms[gameid];
				var gameInfo = this.getGameInfo(room.game);
				return Object.keys(room.players).length + '/' + gameInfo.max_players;
			},
			getUsersGame: function() {
				var room = this.gameRooms[gameUserStore.gameid];
				return room;
			},
			checkValidRoom: function(gameid) {
				var room = this.gameRooms[gameid];
				var gameInfo = this.getGameInfo(room.game);
				var gameOpen = Object.keys(room.players).length < gameInfo.max_players;
				var hasUser = gameid == gameUserStore.gameid;
				return gameOpen && !hasUser;
			},
			gameRoomReady: function() {
				var room = this.gameRooms[gameUserStore.gameid];
				var gameInfo = this.getGameInfo(room.game);
				var gameReady = Object.keys(room.players).length >= gameInfo.min_players;
				var isOwner = room.owner == gameUserStore.socketid;
				return gameReady && isOwner;
			},
		};
	};
	return GameRoomService;
});
