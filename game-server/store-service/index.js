define([
	'app',
	'./index-impl.js',
	], function(app, StoreServiceImpl) {
	app.registerService('storeService',
	['EventEmitter', StoreServiceImpl]);
});
