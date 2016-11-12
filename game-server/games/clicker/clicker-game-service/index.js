define([
	'app',
'./index-impl.js',
], function(app, ClickerGameService) {
	app.registerService('clickerGameService',
	['GameUser', ClickerGameService]);
});