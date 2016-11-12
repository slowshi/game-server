define([
	'./reducer.js',
	'lodash',
], function(reducer, _) {
	var GameRoomService = function(GameUser, $state, storeService) {
		storeService.addReducer('gameServer', reducer);
		var gameUserStore = storeService.store.getState().gameUser;
		var gameRooms = {};
		var	gameList = {};
		var userGame = {};
		var onGameServerStoreUpdate = function() {
			var userList = storeService.store.getState().userList;
			var rooms = storeService.store.getState().gameServer.gameRooms;
			for(var i in rooms) {
				var room = rooms[i];
				gameRooms[i] = {
					gameid: room.gameid,
					game: room.game,
					owner: room.owner,
					players: [],
				};
				for(var k in room.players) {
					gameRooms[i].players.push(userList[room.players[k]]);
				}
			}
			var userGameid = gameUserStore.gameid;
			if(gameRooms[userGameid] !== void 0){
				userGame['gameid'] = userGameid;
				userGame['game'] = gameRooms[userGameid].game;
				userGame['owner'] = gameRooms[userGameid].owner;
				userGame['players'] = gameRooms[userGameid].players;
			}
			var list = storeService.store.getState().gameServer.gameList;
			for(var j in list) {
				gameList[j] = list[j];
			}
			console.log(storeService.store.getState())
		};
		storeService.store.subscribe(onGameServerStoreUpdate);
		var onConnect = function onConnect() {
			gameUserStore.socket.on('GameServer:UpdateGameList', onUpdateGameList);
			gameUserStore.socket.on('GameServer:GameRoomCreated', onMakeGameRoom);
			gameUserStore.socket.on('GameServer:UpdateGameRooms', onUpdateGameRooms);
			gameUserStore.socket.on('GameServer:GameLoaded', onGameLoaded);
		};
		var onDisconnect = function onDisconnect() {
			gameUserStore.socket.removeAllListeners('GameServer:UpdateGameList');
			gameUserStore.socket.removeAllListeners('GameServer:UpdateGameRooms');
			gameUserStore.socket.removeAllListeners('GameServer:GameRoomCreated');
			gameUserStore.socket.removeAllListeners('GameServer:GameLoaded');
		};
		var onUpdateGameList = function onUpdateGameList(gameList) {
			storeService.store.dispatch({
				type: 'updateGameList',
				gameList: gameList,
			});
		};
		var onMakeGameRoom = function onMakeGameRoom(gameid) {
			GameUser.setGameid(gameid);
		};
		var onGameLoaded = function onGameLoaded() {
			var gameName = getUsersGame().game;
			$state.transitionTo(gameName);
		};
		var onUpdateGameRooms = function onUpdateGameRooms(rooms) {
			storeService.store.dispatch({
				type: 'updateGameRooms',
				gameRooms: rooms,
			});
		};
		var createGame = function createGame(name) {
			var gameInfo = {
				socketid: gameUserStore.socketid,
				game: name,
			};
			$state.transitionTo(name);
			gameUserStore.socket.emit('GameServer:MakeGameRoom', gameInfo);
		};
		var joinGameRoom = function joinGameRoom(gameid) {
			var gameInfo = {
				gameid: gameid,
				socketid: gameUserStore.socketid,
			};
			gameUserStore.socket.emit('GameServer:JoinGameRoom', gameInfo);
			GameUser.setGameid(gameid);
			$state.transitionTo('gameroom');
		};
		var leaveGameRoom = function leaveGameRoom() {
			var gameInfo = {
				gameid: gameUserStore.gameid,
				socketid: gameUserStore.socketid,
			};
			gameUserStore.socket.emit('GameServer:LeaveGameRoom', gameInfo);
			GameUser.setGameid(0);
			$state.transitionTo('lobby');
		};
		var startGame = function startGame() {
			gameUserStore.socket.emit('GameServer:StartGame', gameUserStore.gameid);
			$state.transitionTo(userGame['game']);
		};
		var getGameInfo = function getGameInfo(game) {
			return gameList[game];
		};
		var getGameRoomOccupants = function getGameRoomOccupants(gameid) {
			var room = gameRooms[gameid];
			var gameInfo = getGameInfo(room.game);
			return Object.keys(room.players).length + '/' + gameInfo.max_players;
		};
		var getUsersGame = function getUsersGame() {
			var room = gameRooms[gameUserStore.gameid];
			return room;
		};
		var checkValidRoom = function checkValidRoom(gameid) {
			var room = gameRooms[gameid];
			var gameInfo = getGameInfo(room.game);
			var gameOpen = Object.keys(room.players).length < gameInfo.max_players;
			var hasUser = gameid == gameUserStore.gameid;
			return gameOpen && !hasUser;
		};
		var gameRoomReady = function gameRoomReady() {
			console.log(gameRooms);
			var room = gameRooms[gameUserStore.gameid];
			var gameInfo = getGameInfo(room.game);
			var gameReady = Object.keys(room.players).length >= gameInfo.min_players;
			var isOwner = room.owner == gameUserStore.socketid;
			return gameReady && isOwner;
		};
		return {
			onConnect: onConnect,
			onDisconnect: onDisconnect,
			gameRooms: gameRooms,
			gameList: gameList,
			userGame: userGame,
			createGame: createGame,
			joinGameRoom: joinGameRoom,
			leaveGameRoom: leaveGameRoom,
			startGame: startGame,
			getGameInfo: getGameInfo,
			getGameRoomOccupants: getGameRoomOccupants,
			getUsersGame: getUsersGame,
			checkValidRoom: checkValidRoom,
			gameRoomReady: gameRoomReady,
		};
	};
	return GameRoomService;
});
