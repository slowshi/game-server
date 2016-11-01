define([
	'app',
	'./index-impl.js',
], function(app, GameRoomService) {
	app.registerService('GameRoomService',
	['GameUser', '$state', 'storeService', GameRoomService]);
});
