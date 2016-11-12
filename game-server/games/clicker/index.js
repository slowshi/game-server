define([
	'app',
	'./clicker-game-service/index.js',
	],
function(app) {
	app.registerController('ClickerGameController',
	['$scope', 'cssInjector', 'clickerGameService',
	function($scope, cssInjector, clickerGameService) {
		cssInjector.add('/game-server/games/clicker/index.css');
		this.clickerGameService = clickerGameService;
		console.log(clickerGameService);
	}]);
});
