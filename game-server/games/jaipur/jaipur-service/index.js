define(['app','./index-impl.js'],function(app,JaipurService){
	app.registerService('JaipurService',['GameUser','EventEmitter',JaipurService]);
});