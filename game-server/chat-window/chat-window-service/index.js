define([
	'app',
	'./index-impl.js',
	],
function(app, ChatWindowServiceImpl) {
	app.registerService('ChatWindowService',
	['EventEmitter', 'GameUser', 'storeService', ChatWindowServiceImpl]);
});
