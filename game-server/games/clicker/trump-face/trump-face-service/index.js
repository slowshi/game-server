define([
	'app',
'./index-impl.js',
], function(app, TrumpFaceService) {
	app.registerService('trumpFaceService',
	['GameUser','$timeout', TrumpFaceService]);
});