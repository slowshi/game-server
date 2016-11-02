define([
	'./reducer.js',
], function(reducer) {
	var GameRoomService = function(GameUser, $state, storeService) {
		storeService.addReducer('gameServer', reducer);
		var gameUserStore = storeService.store.getState().gameUser;
		var gameServerStore = storeService.store.getState().gameServer;
		var gameRooms = [];
		var onConnect = function onConnect() {
			gameUserStore.socket.on('GameServer:UpdateGameList', onUpdateGameList);
			gameUserStore.socket.on('GameServer:GameRoomCreated', onMakeGameRoom);
			gameUserStore.socket.on('GameServer:GameLoaded', onGameLoaded);
			gameUserStore.socket.on('GameServer:UpdateGameRooms', onUpdateGameRooms);
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
		var onUpdateGameRooms = function onUpdateGameRooms(gameRooms) {
			storeService.store.dispatch({
				type: 'updateGameRooms',
				gameRooms: gameRooms,
			});
		};
		var onMakeGameRoom = function onMakeGameRoom(gameid) {
			GameUser.setGameid(gameid);
			console.log("MAKE GAME ROOM");
		};
		var createGame = function createGame(name) {
			console.log("CREATEGAME", name);
			var gameInfo = {
				socketid: gameUserStore.socketid,
				game: name,
			};
			$state.transitionTo('gameroom');
			gameUserStore.socket.emit('GameServer:MakeGameRoom', gameInfo);
		};
		var joinGameRoom = function joinGameRoom(gameid) {
			var gameInfo = {
				gameid: gameid,
				socketid: gameUserStore.socketid,
			};
			GameUser.setGameid(gameid);
			gameUserStore.socket.emit('GameServer:JoinGameRoom', gameInfo);
		};
		var leaveGameRoom = function leaveGameRoom() {
			var gameInfo = {
				gameid: gameUserStore.gameid,
				socketid: gameUserStore.socketid,
			};
			gameUserStore.socket.emit('GameServer:LeaveGameRoom', gameInfo);
			GameUser.setGameid(null);
		};
		var startGame = function startGame() {
			gameUserStore.socket.emit('GameServer:StartGame', gameUserStore.gameid);
		};
		var onGameLoaded = function onGameLoaded() {
			var gameName = getUsersGame().game;
			$state.transitionTo(gameName);
		};
		var getGameInfo = function getGameInfo(game) {
			return gameServerStore.gameList[game];
		};
		var getGameRoomOccupants = function getGameRoomOccupants(gameid) {
			var room = gameServerStore.gameRooms[gameid];
			var gameInfo = getGameInfo(room.game);
			return Object.keys(room.players).length + '/' + gameInfo.max_players;
		};
		var getUsersGame = function getUsersGame() {
			console.log(gameServerStore, gameServerStore.gameRooms);
			var room = gameServerStore.gameRooms[gameUserStore.gameid];
			return room;
		};
		var checkValidRoom = function checkValidRoom(gameid) {
			var room = gameServerStore.gameRooms[gameid];
			var gameInfo = getGameInfo(room.game);
			var gameOpen = Object.keys(room.players).length < gameInfo.max_players;
			var hasUser = gameid == gameUserStore.gameid;
			return gameOpen && !hasUser;
		};
		var gameRoomReady = function gameRoomReady() {
			var room = gameServerStore.gameRooms[gameUserStore.gameid];
			var gameInfo = getGameInfo(room.game);
			var gameReady = Object.keys(room.players).length >= gameInfo.min_players;
			var isOwner = room.owner == gameUserStore.socketid;
			return gameReady && isOwner;
		};
		return {
			onConnect: onConnect,
			onDisconnect: onDisconnect,
			gameRooms: gameRooms,
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
