define([
	'app',
	'./index-impl.js',
	],
function(app, ChatWindowServiceImpl) {
	app.registerService('ChatLogService',
	['storeService', ChatWindowServiceImpl]);
});
