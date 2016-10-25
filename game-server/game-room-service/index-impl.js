define([],function(){
	var GameRoomService = function(GameUser,EventEmitter){
		return {
			user:GameUser,
			emitter:EventEmitter,
			gameRooms:{},
			gameList:{},
			registerUser:function(){
				this.user.socket.on('GameServer:UpdateGameList',this.onUpdateGameList.bind(this));
				this.user.socket.on('GameServer:UpdateGameRooms',this.onUpdateGameRooms.bind(this));
				this.user.socket.on('GameServer:GameRoomCreated',this.onMakeGameRoom.bind(this));
				this.user.socket.on('GameServer:GameLoaded',this.onGameLoaded.bind(this));
				this.emitter.subscribe('GameUser:Disconnect',this.onDisconnect.bind(this));
			},
			onUpdateGameList:function(data){
				this.gameList = data;
				this.emitter.trigger('apply');
			},
			onUpdateGameRooms:function(data){
				this.gameRooms = data;
				this.emitter.trigger('apply');
			},
			onMakeGameRoom:function(gameid){
				this.user.gameid = gameid;
			},
			onDisconnect:function(user){
				console.log('gameRoomDisconnect');
				this.user.socket.removeAllListeners('GameServer:UpdateGameList');
				this.user.socket.removeAllListeners('GameServer:UpdateGameRooms');
				this.user.socket.removeAllListeners('GameServer:GameRoomCreated');
				this.user.socket.removeAllListeners('GameServer:GameLoaded');
			},
			createGame:function(){
				var gameInfo = {
					socketid: this.user.socketid,
					game:'onitama'
				};
				this.user.socket.emit('GameServer:MakeGameRoom',gameInfo);
				this.emitter.trigger('GameView:ChangeState','gameroom');
			},
			joinGameRoom:function(gameid){
				var gameInfo = {
					gameid: gameid,
					socketid: this.user.socketid
				}
				this.user.gameid = gameid;
				this.user.socket.emit('GameServer:JoinGameRoom',gameInfo);
				this.emitter.trigger('GameView:ChangeState','gameroom');
			},
			leaveGameRoom:function(){
				var gameInfo = {
					gameid: this.user.gameid,
					socketid: this.user.socketid
				};
				this.user.socket.emit('GameServer:LeaveGameRoom',gameInfo);
				this.user.gameid = null;
				this.emitter.trigger('GameView:ChangeState','lobby');
			},
			startGame:function(){
				this.user.socket.emit('GameServer:StartGame',this.user.gameid);
			},
			onGameLoaded:function(){
				var gameName = this.getUsersGame().game;
				this.emitter.trigger('GameView:ChangeState',gameName);
			},
			getGameInfo:function(game){
				return this.gameList[game];
			},
			getGameRoomOccupants:function(gameid){
				var room = this.gameRooms[gameid];
				var gameInfo = this.getGameInfo(room.game);
				return Object.keys(room.players).length + '/' + gameInfo.max_players;
			},
			getUsersGame:function(){
				var room = this.gameRooms[this.user.gameid];
				return room;
			},
			checkValidRoom:function(gameid){
				var room = this.gameRooms[gameid];
				var gameInfo = this.getGameInfo(room.game);
				var gameOpen = Object.keys(room.players).length < gameInfo.max_players;
				var hasUser = gameid == this.user.gameid;
				return gameOpen && !hasUser;
			},
			gameRoomReady:function(){
				var room = this.gameRooms[this.user.gameid];
				var gameInfo = this.getGameInfo(room.game);
				var gameReady = Object.keys(room.players).length >= gameInfo.min_players;
				var isOwner = room.owner == this.user.socketid;
				return gameReady && isOwner;
			}
		};
	};
	return GameRoomService;
});
