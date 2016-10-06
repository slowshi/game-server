define(['app','./index-impl.js'],function(app,GameRoomService){
	app.registerService('GameRoomService',['GameUser','EventEmitter',GameRoomService]);
});