define(['app','./index-impl.js'],function(app,GameUserImpl){
	app.registerService('GameUser',['EventEmitter',GameUserImpl]);
});