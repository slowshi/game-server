define([], function() {
	var states = {
		'lobby': {
			path: 'game-server/game-lobby',
			controller: 'GameLobbyController as ctrl',
		},
		'gameroom': {
			path: 'game-server/game-room',
			controller: 'GameRoomController as ctrl',
		},
		'jaipur': {
			path: 'game-server/games/jaipur',
			controller: 'JaipurController as ctrl',
		},
		'pixelglory': {
			path: 'game-server/games/pixel-glory',
			controller: 'PixelGloryController as ctrl',
		},
		'clicker': {
			path: 'game-server/games/clicker',
			controller: 'ClickerGameController as ctrl',
		},
		};
	return states;
});
