define([
	'app',
'./index-impl.js',
], function(app, HandCursorService) {
	app.registerService('handCursorService',
	['GameUser','$timeout', HandCursorService]);
});