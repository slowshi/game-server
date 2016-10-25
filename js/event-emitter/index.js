define(['app','/js/event-emitter/index-impl.js'],function(app,EventEmitterImpl) {
	app.registerService('EventEmitter',EventEmitterImpl);
});