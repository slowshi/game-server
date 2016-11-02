define([
	'app',
	'./index-impl.js',
	],
function(app, ChatUserServiceImpl) {
	app.registerService('ChatUserService',
	['storeService', ChatUserServiceImpl]);
});
